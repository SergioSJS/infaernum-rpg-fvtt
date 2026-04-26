const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

import { openPerguntaDialog } from "../dice/pergunta-dialog.mjs";
import { openIdeiaDialog } from "../dice/ideia-dialog.mjs";
import { rolarCaosChat } from "../tables/caos.mjs";

export class GrupoSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["infaernum", "sheet", "actor", "grupo"],
    position: { width: 520, height: 780 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      rolarPresagiosDia:  GrupoSheet.#rolarPresagiosDia,
      avancarDia:         GrupoSheet.#avancarDia,
      recuarDia:          GrupoSheet.#recuarDia,
      usarPresagio:       GrupoSheet.#usarPresagio,
      restaurarPresagios: GrupoSheet.#restaurarPresagios,
      anunciarCavaleiro:  GrupoSheet.#anunciarCavaleiro,
      limparCavaleiro:    GrupoSheet.#limparCavaleiro,
      // Ferramentas narrativas
      rolarPergunta:        GrupoSheet.#rolarPergunta,
      rolarIdeia:           GrupoSheet.#rolarIdeia,
      rolarCaos:            GrupoSheet.#rolarCaos,
    },
  };

  static PARTS = {
    header: { template: "systems/infaernum/templates/actor/grupo-header.hbs" },
    body:   { template: "systems/infaernum/templates/actor/grupo-body.hbs", scrollY: [".sheet-body"] },
  };

  async _prepareContext(options) {
    const base = await super._prepareContext(options);
    const actor = this.actor;
    const system = actor.system;

    // Build day array for visual tracker
    const dias = Array.from({ length: 7 }, (_, i) => ({
      numero:  i + 1,
      ativo:   i + 1 === system.dia_atual,
      passado: i + 1 < system.dia_atual,
    }));

    // Build presságios pip array
    const presagiosPips = Array.from({ length: system.presagios_totais }, (_, i) => ({
      index: i,
      gasto: i < system.presagios_usados,
    }));

    return {
      ...base,
      actor,
      system,
      dias,
      presagiosPips,
      presagiosDisponiveis: system.presagiosDisponiveis,
      cavaleiros: ["peste", "guerra", "fome", "morte"],
      config: CONFIG.INFAERNUM,
    };
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  // Roll 1d6 → 4/5/6 presságios + advance day
  static async #rolarPresagiosDia(_event, _target) {
    const roll = new Roll("1d6");
    await roll.evaluate();
    const v = roll.total;
    const presagios = v <= 2 ? 4 : v <= 4 ? 5 : 6;
    const diaNovo = Math.min(7, this.actor.system.dia_atual + 1);

    await this.actor.update({
      "system.dia_atual":         diaNovo,
      "system.presagios_totais":  presagios,
      "system.presagios_usados":  0,
    });

    // Reset pactos for all personagem actors
    for (const p of game.actors.filter(a => a.type === "personagem")) {
      for (const pacto of p.items.filter(i => i.type === "pacto")) {
        await pacto.update({ "system.dadiva_usada": false, "system.divida_paga": false });
      }
    }

    const content = `<div class="infaernum-chat-message">
      <div class="chat-header">📅 Dia ${diaNovo} — Presságios</div>
      <div class="chat-resultado">
        <span class="res-milagre">${presagios} presságios disponíveis</span>
        <span class="res-neutro">(rolou ${v})</span>
      </div>
    </div>`;
    await ChatMessage.create({ content, rolls: [roll], sound: CONFIG.sounds.dice });
  }

  static async #avancarDia(_event, _target) {
    const { dia_atual } = this.actor.system;
    if (dia_atual >= 7) return ui.notifications.warn("Último dia atingido.");
    await this.actor.update({ "system.dia_atual": dia_atual + 1 });
  }

  static async #recuarDia(_event, _target) {
    const { dia_atual } = this.actor.system;
    if (dia_atual <= 0) return;
    await this.actor.update({ "system.dia_atual": dia_atual - 1 });
  }

  static async #usarPresagio(_event, _target) {
    const { presagios_totais, presagios_usados } = this.actor.system;
    if (presagios_usados >= presagios_totais) {
      return ui.notifications.warn(game.i18n.localize("INFAERNUM.Presagio.SemPresagios"));
    }
    await this.actor.update({ "system.presagios_usados": presagios_usados + 1 });
  }

  static async #restaurarPresagios(_event, _target) {
    await this.actor.update({ "system.presagios_usados": 0 });
  }

  static async #anunciarCavaleiro(_event, target) {
    const cavaleiro = target.dataset.cavaleiro;
    if (!cavaleiro) return;
    const anunciados = [...this.actor.system.cavaleiros_anunciados];
    if (!anunciados.includes(cavaleiro)) {
      anunciados.push(cavaleiro);
      await this.actor.update({ "system.cavaleiros_anunciados": anunciados });
    }
  }

  static async #limparCavaleiro(_event, target) {
    const cavaleiro = target.dataset.cavaleiro;
    if (!cavaleiro) return;
    const anunciados = this.actor.system.cavaleiros_anunciados.filter(c => c !== cavaleiro);
    await this.actor.update({ "system.cavaleiros_anunciados": anunciados });
  }

  // ─── Ferramentas narrativas ──────────────────────────────────────────────────

  static async #rolarPergunta(_event, _target) {
    await openPerguntaDialog();
  }

  static async #rolarIdeia(_event, _target) {
    await openIdeiaDialog();
  }

  static async #rolarCaos(_event, target) {
    const tabela = target.dataset.tabela;
    if (!tabela) return;
    await rolarCaosChat(tabela);
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
