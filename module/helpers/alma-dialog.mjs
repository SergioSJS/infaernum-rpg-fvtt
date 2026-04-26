import { resolverRolagem3d6, classificarDado, resumoResultado } from "../dice/roll-resolver.mjs";

const { DialogV2 } = foundry.applications.api;

export async function queimarAlma(message) {
  const flags = message.flags?.infaernum;
  if (!flags) return;

  const actor = game.actors.get(flags.actorId);
  if (!actor) return;

  if (actor.system.almas <= 0) {
    ui.notifications.warn(game.i18n.localize("INFAERNUM.Alma.SemAlmas"));
    return;
  }

  const dados = flags.dados; // raw numbers e.g. [1, 3, 6]
  // Only desgraças (1) and vislumbres (2-3) can be shifted up
  const shiftable = dados
    .map((val, idx) => ({ idx, val }))
    .filter(({ val }) => val <= 3);

  if (!shiftable.length) {
    ui.notifications.info(game.i18n.localize("INFAERNUM.Alma.NadaParaShift"));
    return;
  }

  const options = shiftable.map(({ idx, val }) => {
    const tipo    = val === 1 ? game.i18n.localize("INFAERNUM.Resultado.Desgraca") : game.i18n.localize("INFAERNUM.Resultado.Vislumbre");
    const destino = val === 1 ? game.i18n.localize("INFAERNUM.Resultado.Vislumbre")   : game.i18n.localize("INFAERNUM.Resultado.Facanha");
    return `<option value="${idx}">${idx + 1}º dado (${val}) — ${tipo} → ${destino}</option>`;
  }).join("");

  const content = `
    <div class="inf-dialog">
      <div class="field-group">
        <label>${game.i18n.localize("INFAERNUM.Alma.EscolherDado")}</label>
        <select name="diceIdx">${options}</select>
      </div>
      <p class="field-hint">${game.i18n.localize("INFAERNUM.Alma.QueimarHint")}</p>
    </div>`;

  const diceIdxStr = await DialogV2.prompt({
    window: { title: game.i18n.localize("INFAERNUM.Alma.Queimar") },
    content,
    ok: {
      label: game.i18n.localize("INFAERNUM.Alma.ConfirmarQueimar"),
      callback: (_e, btn) => btn.form.elements.diceIdx.value,
    },
  });

  if (diceIdxStr === null || diceIdxStr === undefined) return;

  const diceIdx = Number(diceIdxStr);
  const novosDados = [...dados];
  novosDados[diceIdx] = novosDados[diceIdx] === 1 ? 2 : 4;

  await actor.update({ "system.almas": actor.system.almas - 1 });

  const resultado = resolverRolagem3d6({
    dados: novosDados,
    temSorte: flags.usarSorte,
    temAzar:  flags.temAzar,
  });

  const templateData = {
    actor,
    descricao: flags.descricao,
    dados: novosDados.map((v, i) => ({
      valor:    v,
      classe:   classificarDado(v),
      rerolled: i === diceIdx,
    })),
    resultado,
    resumo:    resumoResultado(resultado),
    usarSorte: flags.usarSorte,
    temAzar:   flags.temAzar,
    isReroll:  true,
    temAlmas:  actor.system.almas > 0,
  };

  const htmlContent = await foundry.applications.handlebars.renderTemplate(
    "systems/infaernum/templates/chat/acao-result.hbs",
    templateData
  );

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: htmlContent,
    flags: {
      infaernum: {
        actorId:   actor.id,
        dados:     novosDados,
        descricao: flags.descricao,
        usarSorte: flags.usarSorte,
        temAzar:   flags.temAzar,
        temAlmas:  actor.system.almas > 0,
      },
    },
  });
}
