const { HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class CaidoSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["infaernum", "sheet", "actor", "caido"],
    position: { width: 720, height: 580 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      reduzirDificuldade: CaidoSheet.#reduzirDificuldade,
      absorverAlma:       CaidoSheet.#absorverAlma,
      addHabilidade:      CaidoSheet.#addHabilidade,
      removeHabilidade:   CaidoSheet.#removeHabilidade,
      editItem:           CaidoSheet.#editItem,
      deleteItem:         CaidoSheet.#deleteItem,
    },
  };

  static PARTS = {
    header: { template: "systems/infaernum/templates/actor/caido-header.hbs" },
    body:   { template: "systems/infaernum/templates/actor/caido-body.hbs", scrollY: [".caido-body"] },
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.actor;
    const data = actor.system;

    return {
      ...context,
      actor,
      system: data,
      tormentos: data.tormentosCausados,
      config: CONFIG.INFAERNUM,
    };
  }

  // ─── Absorver Alma ──────────────────────────────────────────────────────────
  // Regra (p.53): personagem que desfere golpe final → absorve alma automaticamente.
  // Botão visível quando dificuldade_atual === 0 e dificuldade > 0.
  static async #absorverAlma(_event, _target) {
    const caido = this.actor;

    // Find personagens the current user owns or has observer access to
    const personagens = game.actors.filter(
      a => a.type === "personagem" && a.isOwner
    );

    if (!personagens.length) {
      ui.notifications.warn(game.i18n.localize("INFAERNUM.Alma.SemPersonagem"));
      return;
    }

    let alvo;
    if (personagens.length === 1) {
      alvo = personagens[0];
    } else {
      const opts = personagens
        .map(p => `<option value="${p.id}">${p.name}</option>`)
        .join("");
      const content = `
        <div class="field-group">
          <label>${game.i18n.localize("INFAERNUM.Alma.EscolherPersonagem")}</label>
          <select name="personagemId">${opts}</select>
        </div>`;

      const pid = await DialogV2.prompt({
        window: { title: game.i18n.localize("INFAERNUM.Alma.AbsorverTitulo") },
        content,
        ok: {
          label: game.i18n.localize("INFAERNUM.Alma.Absorver"),
          callback: (_event, button) => button.form.elements.personagemId.value,
        },
      });
      if (!pid) return;
      alvo = game.actors.get(pid);
    }

    if (!alvo) return;
    const novas = (alvo.system.almas ?? 0) + 1;
    await alvo.update({ "system.almas": novas });

    const content = `<div class="infaernum-chat-message">
      <div class="chat-header">✦ ${alvo.name}</div>
      <div class="chat-resultado">
        <span class="res-milagre">${game.i18n.format("INFAERNUM.Alma.AbsorvidaDe", { caido: caido.name })}</span>
      </div>
      <div class="chat-aviso">${game.i18n.format("INFAERNUM.Alma.TotalAtual", { total: novas })}</div>
    </div>`;
    await ChatMessage.create({ content });
  }

  static async #reduzirDificuldade(_event, target) {
    const reducao = Number(target.dataset.reducao ?? 1);
    const atual = this.actor.system.dificuldade_atual;
    await this.actor.update({ "system.dificuldade_atual": Math.max(0, atual - reducao) });
  }

  static async #addHabilidade(_event, _target) {
    const current = this.actor.system.habilidades ?? [];
    await this.actor.update({ "system.habilidades": [...current, ""] });
  }

  static async #removeHabilidade(_event, target) {
    const idx = Number(target.dataset.idx);
    const current = [...(this.actor.system.habilidades ?? [])];
    current.splice(idx, 1);
    await this.actor.update({ "system.habilidades": current });
  }

  static async #editItem(_event, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    item?.sheet?.render(true);
  }

  static async #deleteItem(_event, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    await item?.delete();
  }

  _onRender(context, options) {
    super._onRender(context, options);
    if (!this.isEditable) return;
    this.element.querySelector(".actor-portrait")?.addEventListener("click", () => {
      new foundry.applications.apps.FilePicker.implementation({
        type: "image",
        current: this.actor.img,
        callback: async path => { await this.actor.update({ img: path }); },
      }).browse();
    });
  }
}
