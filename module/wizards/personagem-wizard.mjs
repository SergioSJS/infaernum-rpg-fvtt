import { PASSADO, SORTE, AZAR, TRALHAS, BENCAO, roll3d6 } from "../tables/personagem-creation.mjs";

const { DialogV2 } = foundry.applications.api;

const SECTIONS = [
  { key: "passado", label: "Quem é você?",             table: PASSADO, hint: "Seu passado e origem" },
  { key: "sorte",   label: "Sorte — no que é melhor?", table: SORTE,   hint: "Milagres (6) cancelam desgraças (1) nessa área" },
  { key: "azar",    label: "Azar — no que é pior?",    table: AZAR,    hint: "Desgraças (1) cancelam milagres (6) nessa área" },
  { key: "tralhas", label: "Tralhas iniciais",          table: TRALHAS, hint: "Kit de itens de partida" },
  { key: "bencao",  label: "Bênção",                    table: BENCAO,  hint: "Item especial (ativa com ao menos 1 milagre)" },
];

const MAX_MOVIMENTOS = 6;

const TABLES_JSON = Object.fromEntries(SECTIONS.map(s => [s.key, s.table]));

function _buildContent(rolls) {
  const sections = SECTIONS.map(s => {
    const { dados, total } = rolls[s.key];
    const desc = s.table[total] ?? "—";
    const diceHtml = dados.map(v => `<span class="dado vislumbre wiz-die">${v}</span>`).join("");
    return `
      <div class="wiz-section">
        <div class="wiz-section-header">
          <span class="wiz-section-title">${s.label}</span>
          <span class="wiz-section-hint">${s.hint}</span>
        </div>
        <div class="wiz-roll-row">
          <div class="wiz-dice">${diceHtml} <span class="wiz-sum">= ${total}</span></div>
          <div class="wiz-adjust">
            <button type="button" class="wiz-btn wiz-minus" data-key="${s.key}">−</button>
            <input type="number" name="${s.key}" value="${total}"
                   min="3" max="18" class="wiz-value" data-key="${s.key}" data-original="${total}" />
            <button type="button" class="wiz-btn wiz-plus" data-key="${s.key}">+</button>
          </div>
        </div>
        <p class="wiz-desc" data-key="${s.key}">${desc}</p>
      </div>`;
  }).join("");

  return `
    <div class="inf-dialog--wizard">
      <div class="wiz-movimentos-bar">
        <span class="wiz-mov-label">Movimentos de Alteração</span>
        <span class="wiz-mov-remaining" id="wiz-mov-remaining">${MAX_MOVIMENTOS}</span>
        <span class="wiz-mov-total">/ ${MAX_MOVIMENTOS}</span>
        <progress id="wiz-mov-bar" max="${MAX_MOVIMENTOS}" value="${MAX_MOVIMENTOS}"></progress>
      </div>
      <p class="wiz-mov-hint">Cada ponto gasto move o resultado em ±1. Total de gastos ≤ ${MAX_MOVIMENTOS}.</p>
      <div class="wiz-sections">${sections}</div>
    </div>`;
}

// Called from DialogV2 render callback — attaches live interactivity.
// Foundry v13 sanitizes <script> in dialog content, so this must be done here.
function _attachListeners(html) {
  const TABLES = TABLES_JSON;
  const MAX    = MAX_MOVIMENTOS;

  function getSpent() {
    let spent = 0;
    html.querySelectorAll(".wiz-value").forEach(inp => {
      spent += Math.abs(Number(inp.value) - Number(inp.dataset.original));
    });
    return spent;
  }

  function updateBar() {
    const remaining = MAX - getSpent();
    const el  = html.querySelector("#wiz-mov-remaining");
    const bar = html.querySelector("#wiz-mov-bar");
    if (el)  { el.textContent = remaining; el.style.color = remaining < 0 ? "#c04040" : ""; }
    if (bar) bar.value = Math.max(0, remaining);
  }

  function updateDesc(key, val) {
    const clamped = Math.max(3, Math.min(18, val));
    const p = html.querySelector(`.wiz-desc[data-key="${key}"]`);
    if (p) p.textContent = TABLES[key]?.[clamped] ?? "—";
  }

  html.querySelectorAll(".wiz-value").forEach(inp => {
    inp.addEventListener("input", () => {
      inp.value = Math.max(3, Math.min(18, Number(inp.value)));
      updateDesc(inp.dataset.key, Number(inp.value));
      updateBar();
    });
  });

  html.querySelectorAll(".wiz-minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const inp = html.querySelector(`.wiz-value[data-key="${btn.dataset.key}"]`);
      if (!inp) return;
      const cur = Number(inp.value);
      if (cur <= 3) return;
      inp.value = cur - 1;
      updateDesc(btn.dataset.key, cur - 1);
      updateBar();
    });
  });

  html.querySelectorAll(".wiz-plus").forEach(btn => {
    btn.addEventListener("click", () => {
      const inp = html.querySelector(`.wiz-value[data-key="${btn.dataset.key}"]`);
      if (!inp) return;
      const cur  = Number(inp.value);
      const orig = Number(inp.dataset.original);
      const thisCost = Math.abs(cur - orig);
      const spent    = getSpent();
      if (cur >= 18) return;
      if (spent >= MAX && (cur + 1 - orig) > thisCost) return;
      inp.value = cur + 1;
      updateDesc(btn.dataset.key, cur + 1);
      updateBar();
    });
  });
}

function _collectForm(dialog) {
  const form = dialog.element?.querySelector("form");
  if (!form) return null;
  const data = Object.fromEntries(new FormData(form));
  const result = {};
  for (const s of SECTIONS) result[s.key] = Math.max(3, Math.min(18, Number(data[s.key])));
  return result;
}

export async function openPersonagemWizard(actor) {
  if (actor.system.criacao_concluida) {
    ui.notifications.warn("Criação já concluída para este personagem.");
    return;
  }

  const rolls = {};
  for (const s of SECTIONS) rolls[s.key] = roll3d6();

  const chosen = await DialogV2.wait({
    window:      { title: `Criação de Personagem — ${actor.name}` },
    position:    { width: 520 },
    content:     _buildContent(rolls),
    rejectClose: false,
    // render callback fires after dialog renders — attach listeners here, NOT in <script>
    render:      (_event, dialog) => _attachListeners(dialog.element),
    buttons: [
      {
        action:   "confirm",
        label:    "✦ Confirmar Criação",
        default:  true,
        callback: (_ev, _btn, dialog) => _collectForm(dialog),
      },
      { action: "cancel", label: "Cancelar" },
    ],
  });

  if (!chosen || typeof chosen !== "object") return;

  const spent = SECTIONS.reduce((acc, s) => acc + Math.abs(chosen[s.key] - rolls[s.key].total), 0);

  if (spent > MAX_MOVIMENTOS) {
    ui.notifications.error(`Movimentos gastos (${spent}) excedem o limite de ${MAX_MOVIMENTOS}.`);
    return;
  }

  await actor.update({
    "system.sorte":               SORTE[chosen.sorte]  ?? "",
    "system.azar":                AZAR[chosen.azar]    ?? "",
    "system.movimentos_alteracao": MAX_MOVIMENTOS - spent,
    "system.criacao_concluida":   true,
  });

  await Item.create({
    name: TRALHAS[chosen.tralhas] ?? "Tralha",
    type: "tralha",
    system: { descricao: TRALHAS[chosen.tralhas] ?? "", quantidade: 1 },
  }, { parent: actor });

  await Item.create({
    name: BENCAO[chosen.bencao] ?? "Bênção",
    type: "bencao",
    system: { descricao: BENCAO[chosen.bencao] ?? "", ativa: false },
  }, { parent: actor });

  ui.notifications.info(`${actor.name} criado! ${MAX_MOVIMENTOS - spent} movimentos restantes registrados.`);
}
