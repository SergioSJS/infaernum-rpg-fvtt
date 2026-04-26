const { DialogV2 } = foundry.applications.api;

/**
 * Opens dialog to name and describe a tormento, then creates the item on the actor.
 * Called from chat renderChatMessageHTML when "Gerar Tormento" is clicked.
 * @param {ChatMessage} message
 */
export async function gerarTormentoDialog(message) {
  const actorId = message.flags?.infaernum?.actorId;
  const actor = game.actors.get(actorId);
  if (!actor) return;

  const content = `
    <div class="inf-dialog inf-dialog--tormento">
      <div class="field-group">
        <label>${game.i18n.localize("INFAERNUM.Tormento.Nome")}</label>
        <input type="text" name="nome" autofocus
               placeholder="${game.i18n.localize("INFAERNUM.Tormento.NomePlaceholder")}" />
      </div>
      <div class="field-group">
        <label>${game.i18n.localize("INFAERNUM.Tormento.Origem")}</label>
        <input type="text" name="origem"
               placeholder="${game.i18n.localize("INFAERNUM.Tormento.OrigemPlaceholder")}" />
      </div>
      <div class="field-group field-group--row">
        <input type="checkbox" name="grave" id="tormento-grave" />
        <label for="tormento-grave">${game.i18n.localize("INFAERNUM.Tormento.Grave")}</label>
        <span class="field-hint">${game.i18n.localize("INFAERNUM.Tormento.GraveHint")}</span>
      </div>
    </div>`;

  const result = await DialogV2.wait({
    window: { title: game.i18n.localize("INFAERNUM.Tormento.GerarTitulo") },
    content,
    rejectClose: false,
    buttons: [
      {
        action: "criar",
        label: game.i18n.localize("INFAERNUM.Tormento.Criar"),
        default: true,
        callback: (_ev, _btn, dialog) => {
          const form = dialog.element?.querySelector("form");
          if (!form) return null;
          const data = new FormData(form);
          return {
            nome:   data.get("nome")   ?? "",
            origem: data.get("origem") ?? "",
            grave:  form.querySelector("[name='grave']")?.checked ?? false,
          };
        },
      },
      { action: "cancel", label: game.i18n.localize("INFAERNUM.Common.Cancelar") },
    ],
  });

  if (!result || typeof result !== "object" || !result.nome) return;

  await actor.createEmbeddedDocuments("Item", [{
    name:   result.nome,
    type:   "tormento",
    system: {
      origem: result.origem,
      grave:  result.grave,
      ativo:  true,
    },
  }]);

  ui.notifications.info(
    `${actor.name}: ${game.i18n.localize("INFAERNUM.Tormento.Criado")} "${result.nome}"${result.grave ? ` (${game.i18n.localize("INFAERNUM.Tormento.GraveLabel")})` : ""}`
  );
}
