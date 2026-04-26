const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

export class ItemGenericSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["infaernum", "sheet", "item"],
    position: { width: 480, height: 420 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      toggleField:        ItemGenericSheet.#toggleField,
      addDificuldade:     ItemGenericSheet.#addDificuldade,
      removeDificuldade:  ItemGenericSheet.#removeDificuldade,
      superarDificuldade: ItemGenericSheet.#superarDificuldade,
      concluirFenda:      ItemGenericSheet.#concluirFenda,
    },
  };

  static PARTS = {
    header: { template: "systems/infaernum/templates/item/item-header.hbs" },
    body:   { template: "systems/infaernum/templates/item/item-body.hbs" },
  };

  async _prepareContext(options) {
    const base = await super._prepareContext(options);
    const item = this.item;

    return {
      ...base,
      item,
      system:   item.system,
      itemType: item.type,
    };
  }

  static async #toggleField(_event, target) {
    const field = target.dataset.field;
    if (!field) return;
    const current = foundry.utils.getProperty(this.item, field);
    await this.item.update({ [field]: !current });
  }

  // ─── Fenda actions ────────────────────────────────────────────────────────

  static async #addDificuldade(_event, _target) {
    const current = [...(this.item.system.dificuldades ?? [])];
    await this.item.update({ "system.dificuldades": [...current, 3] });
  }

  static async #removeDificuldade(_event, target) {
    const idx = Number(target.dataset.idx);
    const current = [...(this.item.system.dificuldades ?? [])];
    current.splice(idx, 1);
    const progresso = Math.min(this.item.system.progresso, current.length);
    await this.item.update({ "system.dificuldades": current, "system.progresso": progresso });
  }

  static async #superarDificuldade(_event, _target) {
    const { progresso, dificuldades } = this.item.system;
    if (progresso >= dificuldades.length) return;
    await this.item.update({ "system.progresso": progresso + 1 });
  }

  static async #concluirFenda(_event, _target) {
    const item   = this.item;
    const actor  = item.parent;
    const system = item.system;

    if (system.progresso < system.dificuldades.length) return;
    if (system.concluida) return;

    await item.update({ "system.concluida": true });

    // Create salvação on the actor if name is set
    if (actor && system.salvacao_nome) {
      await actor.createEmbeddedDocuments("Item", [{
        name:   system.salvacao_nome,
        type:   "salvacao",
        system: {
          efeito:       system.salvacao_efeito ?? "",
          origem_fenda: item.name,
          ativa:        false,
        },
      }]);
      ui.notifications.info(
        `${system.salvacao_nome} — ${game.i18n.localize("INFAERNUM.Fenda.SalvacaoCriada")}`
      );
    } else {
      ui.notifications.info(game.i18n.localize("INFAERNUM.Fenda.Concluida"));
    }
  }
}
