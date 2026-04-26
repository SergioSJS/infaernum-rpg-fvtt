import { openAcaoDialog } from "../dice/roll-dialog.mjs";
import { openPersonagemWizard } from "../wizards/personagem-wizard.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class PersonagemSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["infaernum", "sheet", "actor", "personagem"],
    position: { width: 680, height: 740 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      rollAction:    PersonagemSheet.#rollAction,
      openWizard:    PersonagemSheet.#openWizard,
      setDesgracas:  PersonagemSheet.#setDesgracas,
      addItem:       PersonagemSheet.#addItem,
      deleteItem:    PersonagemSheet.#deleteItem,
      editItem:      PersonagemSheet.#editItem,
      toggleItem:    PersonagemSheet.#toggleItem,
      usarDadiva:    PersonagemSheet.#usarDadiva,
    },
  };

  static PARTS = {
    header: { template: "systems/infaernum/templates/actor/personagem-header.hbs" },
    body:   { template: "systems/infaernum/templates/actor/personagem-body.hbs", scrollY: [".personagem-body"] },
  };

  async _prepareContext(options) {
    const base = await super._prepareContext(options);
    const actor = this.actor;
    const system = actor.system;

    return {
      ...base,
      actor,
      system,
      desgracasArr:   Array.from({ length: 6 }, (_, i) => i + 1),
      temMaldicao:    system.temMaldicao,
      maldicoes:      actor.items.filter(i => i.type === "maldicao"),
      paranoias:      system.paranoias,
      tormentos:      system.tormentosAtivos,
      salvacoes:      system.salvacoes,
      rituais:        system.rituais,
      pactos:         system.pactos,
      fendas:         actor.items.filter(i => i.type === "fenda"),
      dominios:       actor.items.filter(i => i.type === "dominio"),
      tralhas:        actor.items.filter(i => i.type === "tralha"),
      cenario:        game.settings.get("infaernum", "cenario"),
      usaAlmas:       game.settings.get("infaernum", "usaAlmas"),
      bencaos:        actor.items.filter(i => i.type === "bencao"),
      temSegundoAzar: system.segundo_azar,
    };
  }

  // --- Actions ---

  static async #rollAction(_event, _target) {
    await openAcaoDialog(this.actor);
  }

  static async #openWizard(_event, _target) {
    await openPersonagemWizard(this.actor);
  }

  static async #setDesgracas(_event, target) {
    const idx = Number(target.dataset.idx);
    const atual = this.actor.system.desgracas;
    // Toggle: clicou no último preenchido → decrementar; senão → setar
    const novo = atual >= idx && atual === idx ? idx - 1 : idx;
    await this.actor.update({ "system.desgracas": novo });
  }

  static async #addItem(_event, target) {
    const type = target.dataset.type;
    if (!type) return;
    const nome = game.i18n.format("INFAERNUM.Item.NovoTipo", { tipo: type });
    await Item.create({ name: nome, type }, { parent: this.actor });
  }

  static async #deleteItem(_event, target) {
    const itemId = target.closest("[data-item-id]")?.dataset.itemId;
    if (!itemId) return;
    const item = this.actor.items.get(itemId);
    if (!item) return;
    await Dialog.confirm({
      title: game.i18n.localize("INFAERNUM.Dialog.ConfirmarRemocao"),
      content: `<p>${game.i18n.format("INFAERNUM.Dialog.RemoverItem", { nome: item.name })}</p>`,
      yes: () => item.delete(),
    });
  }

  static async #editItem(_event, target) {
    const itemId = target.closest("[data-item-id]")?.dataset.itemId;
    if (!itemId) return;
    this.actor.items.get(itemId)?.sheet.render(true);
  }

  static async #toggleItem(_event, target) {
    const itemId = target.closest("[data-item-id]")?.dataset.itemId;
    const field = target.dataset.field;
    if (!itemId || !field) return;
    const item = this.actor.items.get(itemId);
    if (!item) return;
    await item.update({ [field]: !foundry.utils.getProperty(item, field) });
  }

  static async #usarDadiva(_event, target) {
    const itemId = target.dataset.itemId;
    if (!itemId) return;
    const item = this.actor.items.get(itemId);
    if (!item || item.system.dadiva_usada) return;
    await item.update({ "system.dadiva_usada": true });
  }

  _onRender(context, options) {
    super._onRender(context, options);
    if (!this.isEditable) return;
    this.element.querySelector(".profile-img")?.addEventListener("click", () => {
      new foundry.applications.apps.FilePicker.implementation({
        type: "image",
        current: this.actor.img,
        callback: async path => { await this.actor.update({ img: path }); },
      }).browse();
    });
  }

}
