import { CAVALEIROS, getMaldicao } from "../tables/cavaleiros.mjs";

const { DialogV2 } = foundry.applications.api;

/**
 * Handle cavaleiro encounter when actor accumulates 6+ desgraças.
 * Flow:
 *   1. Se já tem maldição → morte definitiva (chat + return)
 *   2. Se tem cavaleiro_servido → zera desgraças sem maldição (serve este cavaleiro)
 *   3. Caso contrário → dialog escolhe cavaleiro + rola 1d6 → cria item maldicao + zera desgraças
 *
 * @param {Actor} actor
 */
export async function cavaleiroEncounter(actor) {
  const system = actor.system;

  // Segunda acumulação com maldição ativa = morte definitiva
  if (system.temMaldicao) {
    await _chatMorte(actor);
    return;
  }

  // Personagem serve um Cavaleiro: zera desgraças sem maldição
  if (system.cavaleiro_servido) {
    await actor.update({ "system.desgracas": 0 });
    await _chatServoCavaleiro(actor, system.cavaleiro_servido);
    return;
  }

  // Escolha de cavaleiro via dialog
  const resultado = await _dialogEscolhaCavaleiro(actor);
  if (!resultado) return;

  const { cavaleiro, indice } = resultado;
  const descricao = getMaldicao(cavaleiro, indice);

  // Criar item maldição
  await Item.create(
    {
      name:   _nomeMaldicao(cavaleiro, indice),
      type:   "maldicao",
      img:    `systems/infaernum/assets/icons/cavaleiros/${cavaleiro}.svg`,
      system: { cavaleiro, indice, descricao },
    },
    { parent: actor }
  );

  // Zerar desgraças
  await actor.update({ "system.desgracas": 0 });

  await _chatMaldicao(actor, cavaleiro, indice, descricao);
}

// ─── Internals ────────────────────────────────────────────────────────────────

async function _dialogEscolhaCavaleiro(actor) {
  const content = await foundry.applications.handlebars.renderTemplate(
    "systems/infaernum/templates/dialog/cavaleiro-dialog.hbs",
    { cavaleiros: CAVALEIROS, actor }
  );

  const formData = await DialogV2.wait({
    window: { title: `${actor.name} — Encontro com Cavaleiro` },
    content,
    rejectClose: false,
    buttons: [
      {
        action:  "confirmar",
        label:   "Confirmar",
        icon:    "fa-skull",
        default: true,
        callback: (_ev, _btn, dialog) => {
          const form = dialog.element?.querySelector("form");
          if (!form) return null;
          const raw = Object.fromEntries(new FormData(form));
          return {
            cavaleiro: raw.cavaleiro,
            indice:    raw.indice === "aleatorio" ? _rolarD6() : Number(raw.indice),
          };
        },
      },
      { action: "cancelar", label: "Cancelar", icon: "fa-times" },
    ],
  });

  if (!formData || typeof formData !== "object") return null;
  if (!CAVALEIROS.includes(formData.cavaleiro)) return null;
  return formData;
}

function _rolarD6() {
  return Math.ceil(Math.random() * 6);
}

function _nomeMaldicao(cavaleiro, indice) {
  const nomes = { peste: "Maldição da Peste", guerra: "Maldição da Guerra", fome: "Maldição da Fome", morte: "Maldição da Morte" };
  return `${nomes[cavaleiro] ?? "Maldição"} #${indice}`;
}

async function _chatMorte(actor) {
  const content = `
    <div class="infaernum-chat-message">
      <div class="chat-morte">☠ MORTE — ${actor.name} sucumbiu ☠</div>
      <p style="text-align:center;font-style:italic;margin-top:6px;">
        Segunda acumulação de 6 desgraças com maldição ativa.
      </p>
    </div>`;
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
  });
}

async function _chatServoCavaleiro(actor, cavaleiro) {
  const label = game.i18n.localize(`INFAERNUM.Cavaleiro.${cavaleiro.charAt(0).toUpperCase()}${cavaleiro.slice(1)}`);
  const content = `
    <div class="infaernum-chat-message">
      <div class="chat-header"><strong>${actor.name}</strong></div>
      <div class="chat-resultado">
        <span class="cavaleiro-badge ${cavaleiro}">${label}</span>
        reconheceu seu servo. Desgraças zeradas — sem maldição.
      </div>
    </div>`;
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
  });
}

async function _chatMaldicao(actor, cavaleiro, indice, descricao) {
  const content = await foundry.applications.handlebars.renderTemplate(
    "systems/infaernum/templates/chat/maldicao-result.hbs",
    { actor, cavaleiro, indice, descricao }
  );
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
  });
}
