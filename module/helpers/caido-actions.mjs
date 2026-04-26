const { DialogV2 } = foundry.applications.api;

export async function aplicarResultadoCaido(reducao) {
  const caidos = game.actors.filter(a => a.type === "caido");
  if (!caidos.length) {
    ui.notifications.warn(game.i18n.localize("INFAERNUM.Caido.NenhumDisponivel"));
    return;
  }

  let alvo;
  if (caidos.length === 1) {
    alvo = caidos[0];
  } else {
    const options = caidos.map(c =>
      `<option value="${c.id}">${c.name} (${c.system.dificuldade_atual}/${c.system.dificuldade})</option>`
    ).join("");
    const content = `
      <div class="form-group">
        <label>${game.i18n.localize("INFAERNUM.Caido.EscolherAlvo")}</label>
        <select name="caidoId">${options}</select>
      </div>`;

    const caidoId = await DialogV2.prompt({
      window: { title: game.i18n.localize("INFAERNUM.Caido.AplicarResultado") },
      content,
      ok: {
        label: reducao === 1
          ? game.i18n.localize("INFAERNUM.Caido.AplicarFacanha")
          : game.i18n.localize("INFAERNUM.Caido.AplicarMilagre"),
        callback: (_event, button) => button.form.elements.caidoId.value,
      },
    });
    if (!caidoId) return;
    alvo = game.actors.get(caidoId);
  }

  if (!alvo) return;
  const anterior = alvo.system.dificuldade_atual;
  const nova = Math.max(0, anterior - reducao);
  await alvo.update({ "system.dificuldade_atual": nova });

  const derrotado = nova <= 0 && alvo.system.dificuldade > 0;
  if (derrotado) {
    await ChatMessage.create({
      content: `<div class="infaernum-chat-message">
        <div class="chat-header">☠ ${alvo.name}</div>
        <div class="chat-resultado">
          <span class="res-facanha">Desafio superado!</span>
        </div>
        <div class="chat-aviso">${game.i18n.localize("INFAERNUM.Caido.AbsorverAlmaHint")}</div>
      </div>`,
    });
  } else {
    ui.notifications.info(`${alvo.name}: ${anterior} → ${nova}`);
  }
}
