const { HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

const NAIPE_INFO = {
  copas:   { simbolo: "♥", label: "Copas" },
  espadas: { simbolo: "♠", label: "Espadas" },
  paus:    { simbolo: "♣", label: "Paus" },
  ouros:   { simbolo: "♦", label: "Ouros" },
};

export class ColossoSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["infaernum", "sheet", "actor", "colosso"],
    position: { width: 740, height: 700 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      adicionarDesgracaNaipe: ColossoSheet.#adicionarDesgracaNaipe,
      removerDesgracaNaipe:   ColossoSheet.#removerDesgracaNaipe,
      revelarCarta:           ColossoSheet.#revelarCarta,
      esconderCarta:          ColossoSheet.#esconderCarta,
      addParte:               ColossoSheet.#addParte,
      removeParte:            ColossoSheet.#removeParte,
      toggleParteDestruida:   ColossoSheet.#toggleParteDestruida,
      absorverRitual:         ColossoSheet.#absorverRitual,
      editItem:               ColossoSheet.#editItem,
      deleteItem:             ColossoSheet.#deleteItem,
    },
  };

  static PARTS = {
    header: { template: "systems/infaernum/templates/actor/colosso-header.hbs" },
    body:   { template: "systems/infaernum/templates/actor/colosso-body.hbs", scrollY: [".colosso-body"] },
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.actor;
    const system = actor.system;

    return {
      ...context,
      actor,
      system,
      rituais:   system.rituais,
      naipes:    ["copas", "espadas", "paus", "ouros"],
      naipeInfo: NAIPE_INFO,
      config:    CONFIG.INFAERNUM,
    };
  }

  // ─── Naipe actions ────────────────────────────────────────────────────────

  static async #adicionarDesgracaNaipe(_event, target) {
    const naipe = target.dataset.naipe;
    if (!naipe) return;
    const atual = this.actor.system.desgracas_naipes[naipe] ?? 0;
    await this.actor.update({ [`system.desgracas_naipes.${naipe}`]: atual + 1 });
  }

  static async #removerDesgracaNaipe(_event, target) {
    const naipe = target.dataset.naipe;
    if (!naipe) return;
    const atual = this.actor.system.desgracas_naipes[naipe] ?? 0;
    if (atual <= 0) return;
    await this.actor.update({ [`system.desgracas_naipes.${naipe}`]: atual - 1 });
  }

  static async #revelarCarta(_event, target) {
    const carta = target.dataset.carta;
    if (!carta) return;
    const reveladas = [...this.actor.system.cartas_reveladas];
    if (!reveladas.includes(carta)) {
      reveladas.push(carta);
      await this.actor.update({ "system.cartas_reveladas": reveladas });
    }
  }

  static async #esconderCarta(_event, target) {
    const carta = target.dataset.carta;
    if (!carta) return;
    const reveladas = this.actor.system.cartas_reveladas.filter(c => c !== carta);
    await this.actor.update({ "system.cartas_reveladas": reveladas });
  }

  // ─── Partes actions ───────────────────────────────────────────────────────

  static async #addParte(_event, _target) {
    const partes = [...this.actor.system.partes];
    partes.push({ nome: game.i18n.localize("INFAERNUM.Colosso.NovaParte"), destruida: false, ritual_gerado: "" });
    await this.actor.update({ "system.partes": partes });
  }

  static async #removeParte(_event, target) {
    const idx = Number(target.dataset.idx);
    const partes = [...this.actor.system.partes];
    partes.splice(idx, 1);
    await this.actor.update({ "system.partes": partes });
  }

  static async #toggleParteDestruida(_event, target) {
    const idx = Number(target.dataset.idx);
    const partes = this.actor.system.partes.map((p, i) =>
      i === idx ? { ...p, destruida: !p.destruida } : p
    );
    await this.actor.update({ "system.partes": partes });
  }

  // ─── Absorver ritual ──────────────────────────────────────────────────────

  static async #absorverRitual(_event, _target) {
    const system = this.actor.system;

    const naipesComDesgracas = ["copas", "espadas", "paus", "ouros"]
      .filter(n => (system.desgracas_naipes[n] ?? 0) > 0);

    if (!naipesComDesgracas.length) {
      ui.notifications.warn(game.i18n.localize("INFAERNUM.Colosso.SemDesgracasParaAbsorver"));
      return;
    }

    const personagens = game.actors.filter(a => a.type === "personagem");
    if (!personagens.length) {
      ui.notifications.warn(game.i18n.localize("INFAERNUM.Colosso.SemPersonagens"));
      return;
    }

    const naipeOptions = naipesComDesgracas.map(n => {
      const info = NAIPE_INFO[n];
      const tormento = system.naipe_tormentos[n] || "";
      return `<option value="${n}">${info.simbolo} ${info.label} (${system.desgracas_naipes[n]} desgraças)${tormento ? ` — ${tormento}` : ""}</option>`;
    }).join("");

    const personagemOptions = personagens.map(p =>
      `<option value="${p.id}">${p.name}</option>`
    ).join("");

    const content = `
      <div class="inf-dialog">
        <div class="field-group">
          <label>${game.i18n.localize("INFAERNUM.Colosso.EscolherNaipe")}</label>
          <select name="naipe">${naipeOptions}</select>
        </div>
        <div class="field-group">
          <label>${game.i18n.localize("INFAERNUM.Colosso.EscolherPersonagem")}</label>
          <select name="personagemId">${personagemOptions}</select>
        </div>
        <div class="field-group">
          <label>${game.i18n.localize("INFAERNUM.Colosso.NomeRitual")}</label>
          <input type="text" name="nomeRitual" value="${game.i18n.format("INFAERNUM.Colosso.RitualDefault", { nome: this.actor.name })}" />
        </div>
      </div>`;

    const result = await DialogV2.prompt({
      window: { title: game.i18n.localize("INFAERNUM.Colosso.AbsorverRitual") },
      content,
      ok: {
        label: game.i18n.localize("INFAERNUM.Colosso.Absorver"),
        callback: (_e, btn) => ({
          naipe:        btn.form.elements.naipe.value,
          personagemId: btn.form.elements.personagemId.value,
          nomeRitual:   btn.form.elements.nomeRitual.value,
        }),
      },
    });

    if (!result) return;

    const personagem = game.actors.get(result.personagemId);
    if (!personagem) return;

    const tormento = system.naipe_tormentos[result.naipe] || "";
    await personagem.createEmbeddedDocuments("Item", [{
      name:   result.nomeRitual || `Ritual — ${NAIPE_INFO[result.naipe].label}`,
      type:   "ritual",
      system: {
        origem_colosso: this.actor.name,
        efeito:         tormento,
        ativa:          false,
      },
    }]);

    ui.notifications.info(
      `${personagem.name}: ${game.i18n.localize("INFAERNUM.Colosso.RitualCriado")}`
    );
  }

  // ─── Item actions ─────────────────────────────────────────────────────────

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
