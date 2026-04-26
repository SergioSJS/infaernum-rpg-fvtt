import { resolverRolagem3d6, classificarDado, resumoResultado } from "./roll-resolver.mjs";

const { DialogV2 } = foundry.applications.api;

/**
 * Find the first grupo actor visible to the current user.
 * @returns {Actor|undefined}
 */
export function getGrupo() {
  return game.actors.find(a => a.type === "grupo");
}

/**
 * Offer Grande Milagre escape when a morte (666) is rolled.
 * Requires ≥3 presságios in the grupo actor.
 * Returns true if the grande milagre was accepted and presságios spent.
 *
 * @param {Actor} actor - The personagem that rolled
 * @returns {Promise<boolean>}
 */
export async function ofereceGrandeMilagre(_actor) {
  const grupo = getGrupo();
  if (!grupo) return false;

  const disponiveis = grupo.system.presagiosDisponiveis;
  if (disponiveis < 3) return false;

  const aceito = await DialogV2.confirm({
    window: { title: "Grande Milagre — 666" },
    content: `
      <p style="text-align:center">
        <strong style="color:var(--inf-color-morte-result)">☠ Três 6s — MORTE ☠</strong>
      </p>
      <p>Queimar <strong>3 presságios</strong> para Grande Milagre?</p>
      <p>Presságios disponíveis: <strong>${disponiveis}</strong></p>
      <p style="font-size:0.8rem;color:var(--inf-color-text-muted)">
        Grande Milagre: os três 6s contam como façanhas. Não é morte.
      </p>`,
    rejectClose: false,
    yes: { label: "Queimar 3 Presságios", icon: "fa-fire" },
    no:  { label: "Aceitar a Morte",       icon: "fa-skull" },
  });

  if (!aceito) return false;

  await grupo.update({ "system.presagios_usados": grupo.system.presagios_usados + 3 });
  return true;
}

/**
 * Spend 1 presságio to reroll one die from a previous 3d6 roll.
 * Posts a new chat message with the updated result.
 *
 * @param {ChatMessage} message - The chat message containing infaernum flags
 */
export async function gastarPresagioReroll(message) {
  const grupo = getGrupo();
  if (!grupo || grupo.system.presagiosDisponiveis < 1) {
    return ui.notifications.warn(game.i18n.localize("INFAERNUM.Presagio.SemPresagios"));
  }

  const flags = message.flags?.infaernum;
  if (!flags) return;

  const { actorId, dados, usarSorte, temAzar } = flags;
  const actor = game.actors.get(actorId);
  if (!actor) return;

  // Dialog: escolher qual dado rerrolar
  const dadosMapeados = dados.map((v, i) => ({ valor: v, classe: classificarDado(v), index: i }));

  const content = await foundry.applications.handlebars.renderTemplate(
    "systems/infaernum/templates/dialog/presagio-reroll.hbs",
    { dados: dadosMapeados }
  );

  const indiceStr = await DialogV2.wait({
    window: { title: "Queimar Presságio — Rerrolar dado" },
    content,
    rejectClose: false,
    buttons: [
      {
        action:   "reroll",
        label:    "Rerrolar",
        icon:     "fa-dice",
        default:  true,
        callback: (_ev, _btn, dialog) => {
          const form = dialog.element?.querySelector("form");
          if (!form) return null;
          return Object.fromEntries(new FormData(form)).indice;
        },
      },
      { action: "cancelar", label: "Cancelar", icon: "fa-times" },
    ],
  });

  if (indiceStr === null || indiceStr === "cancelar" || indiceStr === undefined) return;

  const indice = Number(indiceStr);
  if (isNaN(indice) || indice < 0 || indice > 2) return;

  // Roll replacement die
  const newRoll = new Roll("1d6");
  await newRoll.evaluate();
  const novoDado = newRoll.total;

  // Spend presságio
  await grupo.update({ "system.presagios_usados": grupo.system.presagios_usados + 1 });

  // Build updated dados array
  const novosDados = [...dados];
  novosDados[indice] = novoDado;

  // Re-resolve
  const resultado = resolverRolagem3d6({ dados: novosDados, temSorte: usarSorte, temAzar });

  // New chat message
  const templateData = {
    actor,
    descricao: `[Presságio] ${flags.descricao ?? ""}`.trim(),
    dados: novosDados.map((v, i) => ({
      valor: v,
      classe: classificarDado(v),
      rerolled: i === indice,
    })),
    resultado,
    resumo: resumoResultado(resultado),
    usarSorte,
    temAzar,
    isReroll: true,
  };

  const newContent = await foundry.applications.handlebars.renderTemplate(
    "systems/infaernum/templates/chat/acao-result.hbs",
    templateData
  );

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content:  newContent,
    rolls:    [newRoll],
    sound:    CONFIG.sounds.dice,
    flags:    {
      infaernum: {
        actorId:    actor.id,
        dados:      novosDados,
        usarSorte,
        temAzar,
        descricao:  flags.descricao,
      },
    },
  });
}

/**
 * Spend 1 presságio to reduce desgraças of a personagem by 1.
 * Opens a dialog to pick which actor to help.
 */
export async function gastarPresagioDesgraca() {
  const grupo = getGrupo();
  if (!grupo || grupo.system.presagiosDisponiveis < 1) {
    return ui.notifications.warn(game.i18n.localize("INFAERNUM.Presagio.SemPresagios"));
  }

  const personagens = game.actors.filter(a => a.type === "personagem" && a.system.desgracas > 0);
  if (!personagens.length) {
    return ui.notifications.info(game.i18n.localize("INFAERNUM.Presagio.SemDesgraca"));
  }

  const options = personagens.map(a =>
    `<option value="${a.id}">${a.name} (${a.system.desgracas} desgraça${a.system.desgracas > 1 ? "s" : ""})</option>`
  ).join("");

  const alvoId = await DialogV2.wait({
    window: { title: "Queimar Presságio — Reduzir Desgraça" },
    content: `
      <div class="inf-dialog">
        <div class="field-group">
          <label>Personagem</label>
          <select name="actorId">${options}</select>
        </div>
      </div>`,
    rejectClose: false,
    buttons: [
      {
        action:   "confirmar",
        label:    "Queimar Presságio",
        icon:     "fa-fire",
        default:  true,
        callback: (_ev, _btn, dialog) => {
          const form = dialog.element?.querySelector("form");
          return form ? Object.fromEntries(new FormData(form)).actorId : null;
        },
      },
      { action: "cancelar", label: "Cancelar", icon: "fa-times" },
    ],
  });

  if (!alvoId || typeof alvoId !== "string") return;

  const alvo = game.actors.get(alvoId);
  if (!alvo) return;

  await grupo.update({ "system.presagios_usados": grupo.system.presagios_usados + 1 });
  await alvo.update({ "system.desgracas": Math.max(0, alvo.system.desgracas - 1) });

  const content = `
    <div class="infaernum-chat-message">
      <div class="chat-header">✦ Presságio queimado</div>
      <div class="chat-resultado">
        <span class="res-facanha">${alvo.name}: desgraças −1</span>
      </div>
    </div>`;
  await ChatMessage.create({ content });
}
