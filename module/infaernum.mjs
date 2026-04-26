import { PersonagemData } from "./data/actor-personagem.mjs";
import { CaidoData } from "./data/actor-caido.mjs";
import { ColossoData } from "./data/actor-colosso.mjs";
import { GrupoData } from "./data/actor-grupo.mjs";
import { TralhaData } from "./data/item-tralha.mjs";
import { BencaoData } from "./data/item-bencao.mjs";
import { SalvacaoData } from "./data/item-salvacao.mjs";
import { RitualData } from "./data/item-ritual.mjs";
import { PactoData } from "./data/item-pacto.mjs";
import { TormentoData } from "./data/item-tormento.mjs";
import { MaldicaoData } from "./data/item-maldicao.mjs";
import { ParanoiaData } from "./data/item-paranoia.mjs";
import { FendaData } from "./data/item-fenda.mjs";
import { TerritorioData } from "./data/item-territorio.mjs";
import { DominioData } from "./data/item-dominio.mjs";

import { PersonagemSheet } from "./sheets/actor-personagem-sheet.mjs";
import { CaidoSheet } from "./sheets/actor-caido-sheet.mjs";
import { ColossoSheet } from "./sheets/actor-colosso-sheet.mjs";
import { GrupoSheet } from "./sheets/actor-grupo-sheet.mjs";
import { ItemGenericSheet } from "./sheets/item-generic-sheet.mjs";

import { registerSettings, applyThemeFromSettings } from "./settings/register.mjs";
import { registerHandlebarsHelpers } from "./helpers/handlebars.mjs";
import { gastarPresagioReroll, gastarPresagioDesgraca } from "./dice/presagio-dialog.mjs";
import { aplicarResultadoCaido } from "./helpers/caido-actions.mjs";
import { queimarAlma } from "./helpers/alma-dialog.mjs";
import { puxarArcanoChat, explorarTerritorioDialog } from "./tables/arcanos.mjs";
import { openPerguntaDialog } from "./dice/pergunta-dialog.mjs";
import { openIdeiaDialog } from "./dice/ideia-dialog.mjs";
import { rolarCaosChat } from "./tables/caos.mjs";
import { gerarTormentoDialog } from "./helpers/tormento-dialog.mjs";
import { grupoHUD } from "./helpers/grupo-hud.mjs";
import { firmarPactoWizard } from "./wizards/pacto-wizard.mjs";
import { rolarParanoia } from "./tables/paranoias.mjs";

// Load Quench test suites only when the Quench module is present
Hooks.once("ready", () => {
  if (game.modules?.get("quench")?.active) {
    import("./tests/dice-resolver.test.mjs").catch(console.error);
  }
});

// Tag all DialogV2 instances that contain inf-dialog content so CSS can target them.
Hooks.on("renderDialogV2", (_app, element) => {
  if (element.querySelector(".inf-dialog, [class*='inf-dialog--']")) {
    element.classList.add("inf-system");
  }
});

Hooks.once("init", () => {
  console.log("infaernum | Iniciando sistema Old Infærnum");

  // Actor DataModels
  CONFIG.Actor.dataModels.personagem = PersonagemData;
  CONFIG.Actor.dataModels.caido      = CaidoData;
  CONFIG.Actor.dataModels.colosso    = ColossoData;
  CONFIG.Actor.dataModels.grupo      = GrupoData;

  // Item DataModels
  CONFIG.Item.dataModels.tralha     = TralhaData;
  CONFIG.Item.dataModels.bencao     = BencaoData;
  CONFIG.Item.dataModels.salvacao   = SalvacaoData;
  CONFIG.Item.dataModels.ritual     = RitualData;
  CONFIG.Item.dataModels.pacto      = PactoData;
  CONFIG.Item.dataModels.tormento   = TormentoData;
  CONFIG.Item.dataModels.maldicao   = MaldicaoData;
  CONFIG.Item.dataModels.paranoia   = ParanoiaData;
  CONFIG.Item.dataModels.fenda      = FendaData;
  CONFIG.Item.dataModels.territorio = TerritorioData;
  CONFIG.Item.dataModels.dominio    = DominioData;

  registerSettings();
  registerHandlebarsHelpers();
  _registerSheets();

  // Paranoia: block 4th, 3rd triggers segundo_azar
  Hooks.on("preCreateItem", (item) => {
    if (item.type !== "paranoia") return true;
    const actor = item.parent;
    if (!actor || actor.type !== "personagem") return true;
    const count = actor.items.filter(i => i.type === "paranoia").length;
    if (count >= 3) {
      ui.notifications.warn(game.i18n.localize("INFAERNUM.Paranoia.MaxAtingido"));
      return false;
    }
    return true;
  });

  Hooks.on("createItem", async (item) => {
    if (item.type !== "paranoia") return;
    const actor = item.parent;
    if (!actor || actor.type !== "personagem") return;
    const count = actor.items.filter(i => i.type === "paranoia").length;
    if (count >= 3 && !actor.system.segundo_azar) {
      await actor.update({ "system.segundo_azar": true });
      await ChatMessage.create({
        content: `<div class="infaernum-chat-message">
          <div class="chat-header">⚠ ${actor.name}</div>
          <div class="chat-aviso">${game.i18n.localize("INFAERNUM.Personagem.SegundoAzarAtivo")}</div>
        </div>`,
      });
    }
  });

  // Default icons by actor type
  Hooks.on("preCreateActor", (actor) => {
    const defaults = {
      personagem: "icons/svg/mystery-man.svg",
      caido:      "icons/svg/skull.svg",
      colosso:    "icons/svg/hazard.svg",
      grupo:      "icons/svg/village.svg",
    };
    if (defaults[actor.type]) actor.updateSource({ img: defaults[actor.type] });
  });

  // Chat message presságio buttons (v13: renderChatMessageHTML passes HTMLElement, not jQuery)
  Hooks.on("renderChatMessageHTML", (message, html) => {
    html.querySelector("[data-action='gastarPresagioReroll']")
        ?.addEventListener("click", () => gastarPresagioReroll(message));
    html.querySelector("[data-action='gastarPresagioDesgraca']")
        ?.addEventListener("click", () => gastarPresagioDesgraca());
    html.querySelector("[data-action='aplicarFacanhaACaido']")
        ?.addEventListener("click", () => aplicarResultadoCaido(1));
    html.querySelector("[data-action='aplicarMilagreACaido']")
        ?.addEventListener("click", () => aplicarResultadoCaido(2));
    html.querySelector("[data-action='queimarAlma']")
        ?.addEventListener("click", () => queimarAlma(message));
    html.querySelector("[data-action='gerarTormento']")
        ?.addEventListener("click", () => gerarTormentoDialog(message));
  });
});

Hooks.once("ready", async () => {
  console.log("infaernum | Sistema pronto");

  // Expose API for macros
  game.infaernum = {
    // Rolagens de destino
    pergunta:           ()      => openPerguntaDialog(),
    ideia:              ()      => openIdeiaDialog(),
    // Caos (tabelas narrativas)
    caos:               (tab)   => rolarCaosChat(tab),
    caosDesgraca:       ()      => rolarCaosChat("desgraca"),
    caosVislumbre:         ()      => rolarCaosChat("vislumbre"),
    caosPNJConfronto:   ()      => rolarCaosChat("pnj_confronto"),
    caosPNJComport:     ()      => rolarCaosChat("pnj_comportamento"),
    caosOracoes:        ()      => rolarCaosChat("oracoes"),
    // Suplementos
    puxarArcano:        (n = 1) => puxarArcanoChat(n),
    explorarTerritorio: ()      => explorarTerritorioDialog(),
    // Criação de personagem
    firmarPacto:        ()      => firmarPactoWizard(),
    rolarParanoia:      ()      => { const r = rolarParanoia(); ui.notifications.info(`Paranoia: ${r.descricao} (${r.total})`); return r; },
  };

  // Create world macros if GM and they don't exist yet
  if (game.user.isGM) await _criarMacrosInfaernum();

  // Apply saved theme
  applyThemeFromSettings();

  // Mount HUD and keep it reactive
  grupoHUD.render();
  Hooks.on("updateActor", (actor) => {
    if (actor.type === "grupo") grupoHUD.render();
  });
  Hooks.on("createActor", (actor) => {
    if (actor.type === "grupo") grupoHUD.render();
  });
  Hooks.on("deleteActor", (actor) => {
    if (actor.type === "grupo") grupoHUD.render();
  });
});

// ─── Painel narrativo (canto superior direito, dentro de #ui-right-column-1) ──
// Mesmo padrão do fractal clock: prepend em #ui-right-column-1, position relative.
// O elemento vive na coluna direita e acompanha o sidebar automaticamente.
Hooks.once("ready", () => _montarPainelNarrativo());

function _montarPainelNarrativo() {
  document.getElementById("inf-narrative-panel")?.remove();

  const panel = document.createElement("div");
  panel.id = "inf-narrative-panel";
  panel.innerHTML = `
    <button class="inf-np-trigger" aria-haspopup="true" aria-expanded="false"
            title="Ferramentas Narrativas — Old Infærnum">
      <span class="inf-np-icon">✦</span>
      <span class="inf-np-label">Oráculo</span>
      <span class="inf-np-chevron">▾</span>
    </button>
    <div class="inf-np-menu" hidden>
      <button class="inf-np-item" data-inf="pergunta">
        <span>⚀</span> Pergunta ao Destino
        <small>1d6 · sim ou não</small>
      </button>
      <button class="inf-np-item" data-inf="ideia">
        <span>✦</span> Ideia
        <small>2d6 · verbo + substantivo</small>
      </button>
      <div class="inf-np-sep">Caos</div>
      <button class="inf-np-item inf-np-item--caos" data-inf="caos" data-tabela="desgraca">Desgraça</button>
      <button class="inf-np-item inf-np-item--caos" data-inf="caos" data-tabela="vislumbre">Vislumbre</button>
      <button class="inf-np-item inf-np-item--caos" data-inf="caos" data-tabela="pnj_confronto">PNJ — Confronto</button>
      <button class="inf-np-item inf-np-item--caos" data-inf="caos" data-tabela="pnj_comportamento">PNJ — Comportamento</button>
      <button class="inf-np-item inf-np-item--caos" data-inf="caos" data-tabela="oracoes">Orações</button>
    </div>
  `;

  const target = document.querySelector("#ui-right-column-1") ?? document.body;
  target.prepend(panel);

  const trigger = panel.querySelector(".inf-np-trigger");
  const menu    = panel.querySelector(".inf-np-menu");

  trigger.addEventListener("click", (ev) => {
    ev.stopPropagation();
    const nowOpen = menu.hidden;
    menu.hidden = !nowOpen;
    trigger.setAttribute("aria-expanded", String(nowOpen));
  });

  panel.querySelectorAll("[data-inf]").forEach(btn => {
    btn.addEventListener("click", () => {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      const action = btn.dataset.inf;
      if (action === "pergunta") openPerguntaDialog();
      else if (action === "ideia") openIdeiaDialog();
      else if (action === "caos") rolarCaosChat(btn.dataset.tabela);
    });
  });

  document.addEventListener("click", (ev) => {
    if (!panel.contains(ev.target)) {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }
  });
}

async function _criarMacrosInfaernum() {
  async function _obterPasta(nome) {
    const existente = game.folders.find(f => f.type === "Macro" && f.name === nome && f.flags?.infaernum);
    if (existente) return existente;
    return Folder.create({ name: nome, type: "Macro", sorting: "a", flags: { infaernum: true } });
  }

  const pastaFerramentas = await _obterPasta("Infærnum — Ferramentas Narrativas");
  const pastaPersonagem  = await _obterPasta("Infærnum — Personagem");

  const macros = [
    {
      name: "🎲 Pergunta ao Destino",
      command: "game.infaernum.pergunta();",
      img: "icons/svg/dice-target.svg",
      folder: pastaFerramentas.id,
    },
    {
      name: "✦ Ideia (2d6)",
      command: "game.infaernum.ideia();",
      img: "icons/svg/d6-grey.svg",
      folder: pastaFerramentas.id,
    },
    {
      name: "⚡ Caos — Desgraça",
      command: "game.infaernum.caosDesgraca();",
      img: "icons/svg/hazard.svg",
      folder: pastaFerramentas.id,
    },
    {
      name: "⚡ Caos — Vislumbre",
      command: "game.infaernum.caosVislumbre();",
      img: "icons/svg/hazard.svg",
      folder: pastaFerramentas.id,
    },
    {
      name: "⚡ Caos — PNJ Confronto",
      command: "game.infaernum.caosPNJConfronto();",
      img: "icons/svg/combat.svg",
      folder: pastaFerramentas.id,
    },
    {
      name: "⚡ Caos — PNJ Comportamento",
      command: "game.infaernum.caosPNJComport();",
      img: "icons/svg/mystery-man.svg",
      folder: pastaFerramentas.id,
    },
    {
      name: "⚡ Caos — Orações",
      command: "game.infaernum.caosOracoes();",
      img: "icons/svg/book.svg",
      folder: pastaFerramentas.id,
    },
    {
      name: "🃏 Puxar Arcano",
      command: "game.infaernum.puxarArcano(1);",
      img: "icons/svg/card-joker.svg",
      folder: pastaPersonagem.id,
    },
    {
      name: "⚰ Firmar Pacto",
      command: "game.infaernum.firmarPacto();",
      img: "icons/svg/eye.svg",
      folder: pastaPersonagem.id,
    },
    {
      name: "🧠 Rolar Paranoia",
      command: "game.infaernum.rolarParanoia();",
      img: "icons/svg/pawprint.svg",
      folder: pastaPersonagem.id,
    },
  ];

  for (const data of macros) {
    const existe = game.macros.find(m => m.name === data.name && m.flags?.infaernum);
    if (existe) {
      if (existe.folder?.id !== data.folder) await existe.update({ folder: data.folder });
      continue;
    }
    await Macro.create({
      name:    data.name,
      type:    "script",
      command: data.command,
      img:     data.img,
      folder:  data.folder,
      flags:   { infaernum: true },
    });
  }
}

function _registerSheets() {
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);

  foundry.documents.collections.Actors.registerSheet("infaernum", PersonagemSheet, {
    types: ["personagem"],
    makeDefault: true,
    label: "INFAERNUM.Sheet.Personagem",
  });
  foundry.documents.collections.Actors.registerSheet("infaernum", CaidoSheet, {
    types: ["caido"],
    makeDefault: true,
    label: "INFAERNUM.Sheet.Caido",
  });
  foundry.documents.collections.Actors.registerSheet("infaernum", ColossoSheet, {
    types: ["colosso"],
    makeDefault: true,
    label: "INFAERNUM.Sheet.Colosso",
  });
  foundry.documents.collections.Actors.registerSheet("infaernum", GrupoSheet, {
    types: ["grupo"],
    makeDefault: true,
    label: "INFAERNUM.Sheet.Grupo",
  });

  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
  foundry.documents.collections.Items.registerSheet("infaernum", ItemGenericSheet, {
    makeDefault: true,
    label: "INFAERNUM.Sheet.Item",
  });
}
