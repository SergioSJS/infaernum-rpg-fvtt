import { resolverRolagem3d6, classificarDado, resumoResultado } from "./roll-resolver.mjs";
import { cavaleiroEncounter } from "./cavaleiro-encounter.mjs";
import { ofereceGrandeMilagre } from "./presagio-dialog.mjs";
import { drawAcao, formatCarta } from "./card-strategy.mjs";

const { DialogV2 } = foundry.applications.api;

/**
 * Open the 3d6 action dialog for an actor and execute the roll.
 * Handles segundo_azar flip, tormento azar, maldição azar.
 * @param {Actor} actor
 */
export async function openAcaoDialog(actor) {
  const system = actor.system;
  const temSegundoAzar = system.segundo_azar;

  const content = await foundry.applications.handlebars.renderTemplate(
    "systems/infaernum/templates/dialog/acao-dialog.hbs",
    {
      system,
      temSegundoAzar,
      tormentos:   system.tormentosAtivos,
      temMaldicao: system.temMaldicao,
    }
  );

  const formData = await DialogV2.wait({
    window: { title: `${actor.name} — Ação` },
    content,
    rejectClose: false,
    buttons: [
      {
        action:   "roll",
        label:    game.i18n.localize("INFAERNUM.Roll.Rolar"),
        icon:     "fa-dice",
        default:  true,
        callback: (_ev, _btn, dialog) => _coletarFormulario(dialog),
      },
      {
        action: "cancel",
        label:  game.i18n.localize("INFAERNUM.Roll.Cancelar"),
        icon:   "fa-times",
      },
    ],
  });

  if (!formData || typeof formData !== "object") return;

  await _executarRolagem(actor, formData, temSegundoAzar);
}

// ─── Internals ────────────────────────────────────────────────────────────────

function _coletarFormulario(dialog) {
  const form = dialog.element?.querySelector("form");
  if (!form) return null;
  const raw = Object.fromEntries(new FormData(form));
  return {
    descricao:    String(raw.descricao ?? ""),
    usarSorte:    "usarSorte"    in raw,
    usarAzar:     "usarAzar"     in raw,
    usarMaldicao: "usarMaldicao" in raw,
    tormentosIds: [...form.querySelectorAll("input[name^='tormento_']:checked")]
                    .map(el => el.name.slice(8)),
  };
}

async function _executarRolagem(actor, formData, temSegundoAzar) {
  let usarSorte = formData.usarSorte;
  let usarAzar  = formData.usarAzar;
  const { usarMaldicao, descricao, tormentosIds } = formData;

  // segundo_azar: sorte vira azar
  if (temSegundoAzar && usarSorte) {
    usarSorte = false;
    usarAzar  = true;
  }

  // Azar efetivo: selecionado pelo jogador OU tormento ativo OU maldição
  const temAzar = usarAzar || tormentosIds.length > 0 || usarMaldicao;

  // Roll 3d6 or draw 3 cards (Infærnaculum mode)
  const modoCartas = game.settings.get("infaernum", "modoAleatorio") === "cartas";
  let roll = null;
  let dados, cartasDraw;

  if (modoCartas) {
    const draw = drawAcao();
    dados      = draw.dados;
    cartasDraw = draw.cartas;
  } else {
    roll  = new Roll("3d6");
    await roll.evaluate();
    dados = roll.dice[0].results.map(r => r.result);
    cartasDraw = null;
  }

  // Resolve
  const resultado = resolverRolagem3d6({ dados, temSorte: usarSorte, temAzar });

  // 666 — offer grande milagre first; if declined → morte
  if (resultado.morte) {
    const grandeMilagre = await ofereceGrandeMilagre(actor);

    if (!grandeMilagre) {
      const dadosHtml = cartasDraw
        ? cartasDraw.map(c => `<span class="dado milagre" title="${c.naipe}">${formatCarta(c)}</span>`).join("")
        : dados.map(v => `<span class="dado milagre">${v}</span>`).join("");
      const content = `<div class="infaernum-chat-message">
        <div class="chat-header"><strong>${actor.name}</strong>${descricao ? ` — ${descricao}` : ""}</div>
        <div class="chat-dados">${dadosHtml}</div>
        <div class="chat-morte">☠ MORTE — três 6s ☠</div>
      </div>`;
      await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content, rolls: roll ? [roll] : [], sound: CONFIG.sounds.dice });
      return;
    }

    // Grande milagre: 3 façanhas, sem morte
    const gmDadosHtml = cartasDraw
      ? cartasDraw.map(c => `<span class="dado milagre" title="${c.naipe}">${formatCarta(c)}</span>`).join("")
      : dados.map(v => `<span class="dado milagre">${v}</span>`).join("");
    const gmContent = `<div class="infaernum-chat-message">
      <div class="chat-header"><strong>${actor.name}</strong>${descricao ? ` — ${descricao}` : ""}</div>
      <div class="chat-dados">${gmDadosHtml}</div>
      <div class="chat-resultado">
        <span class="res-milagre">✦ Grande Milagre — 3 presságios queimados</span>
      </div>
    </div>`;
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: gmContent, rolls: roll ? [roll] : [], sound: CONFIG.sounds.dice });
    return;
  }

  // Apply desgraças to actor; trigger cavaleiro encounter at 6
  if (resultado.numDesgracas > 0) {
    const novas = Math.min(6, actor.system.desgracas + resultado.numDesgracas);
    await actor.update({ "system.desgracas": novas });

    if (novas >= 6) {
      await cavaleiroEncounter(actor);
    }
  }

  const temAlmas = (actor.system.almas ?? 0) > 0;

  // Build and post chat message with flags for presságio actions
  const templateData = {
    actor,
    descricao,
    dados: dados.map(v => ({ valor: v, classe: classificarDado(v) })),
    cartas: cartasDraw
      ? cartasDraw.map((c, i) => ({ ...c, formatted: formatCarta(c), classe: classificarDado(dados[i]) }))
      : null,
    resultado,
    resumo: resumoResultado(resultado),
    usarSorte,
    temAzar,
    temAlmas,
    isReroll: false,
  };

  const content = await foundry.applications.handlebars.renderTemplate(
    "systems/infaernum/templates/chat/acao-result.hbs",
    templateData
  );

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
    rolls:   roll ? [roll] : [],
    sound:   CONFIG.sounds.dice,
    flags:   {
      infaernum: {
        actorId:   actor.id,
        dados,
        cartas:    cartasDraw ?? null,
        descricao,
        usarSorte,
        temAzar,
        temAlmas,
      },
    },
  });
}
