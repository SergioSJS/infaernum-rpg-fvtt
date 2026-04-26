export function registerHandlebarsHelpers() {

  // Boolean comparisons
  Handlebars.registerHelper("infaernum-eq",  (a, b) => a === b);
  Handlebars.registerHelper("infaernum-gt",  (a, b) => a > b);
  Handlebars.registerHelper("infaernum-lt",  (a, b) => a < b);
  Handlebars.registerHelper("infaernum-lte", (a, b) => a <= b);
  Handlebars.registerHelper("infaernum-gte", (a, b) => a >= b);

  // Array / string helpers
  Handlebars.registerHelper("infaernum-includes", (arr, val) => Array.isArray(arr) && arr.includes(val));

  // Build inline array: {{array "a" "b" "c"}}
  Handlebars.registerHelper("array", (...args) => args.slice(0, -1));

  // Capitalize first letter
  Handlebars.registerHelper("infaernum-capitalize", (s) =>
    typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : s
  );

  // Iteration
  Handlebars.registerHelper("infaernum-range", (start, end) => {
    const r = [];
    for (let i = start; i <= end; i++) r.push(i);
    return r;
  });

  // Lookup helpers
  Handlebars.registerHelper("infaernum-cavaleiro-label", (key) => {
    if (!key) return "";
    return game.i18n.localize(`INFAERNUM.Cavaleiro.${key.charAt(0).toUpperCase()}${key.slice(1)}`);
  });

  // Choices builder for selects
  Handlebars.registerHelper("infaernum-choices", (type) => {
    const maps = {
      cavaleiros: [
        { value: "",       label: "— Nenhum —" },
        { value: "peste",  label: game.i18n.localize("INFAERNUM.Cavaleiro.Peste") },
        { value: "guerra", label: game.i18n.localize("INFAERNUM.Cavaleiro.Guerra") },
        { value: "fome",   label: game.i18n.localize("INFAERNUM.Cavaleiro.Fome") },
        { value: "morte",  label: game.i18n.localize("INFAERNUM.Cavaleiro.Morte") },
      ],
      cenarios: [
        { value: "padrao",    label: game.i18n.localize("INFAERNUM.Setting.Cenario.Padrao") },
        { value: "dominios",  label: game.i18n.localize("INFAERNUM.Setting.Cenario.Dominios") },
        { value: "cyfaernum", label: game.i18n.localize("INFAERNUM.Setting.Cenario.Cyfaernum") },
        { value: "custom",    label: game.i18n.localize("INFAERNUM.Setting.Cenario.Custom") },
      ],
      "cavaleiros-plus": [
        { value: "",            label: "—" },
        { value: "peste",       label: game.i18n.localize("INFAERNUM.Cavaleiro.Peste") },
        { value: "guerra",      label: game.i18n.localize("INFAERNUM.Cavaleiro.Guerra") },
        { value: "fome",        label: game.i18n.localize("INFAERNUM.Cavaleiro.Fome") },
        { value: "morte",       label: game.i18n.localize("INFAERNUM.Cavaleiro.Morte") },
        { value: "personagens", label: game.i18n.localize("INFAERNUM.Territorio.Personagens") },
      ],
    };
    return maps[type] ?? [];
  });

  // Arithmetic
  Handlebars.registerHelper("infaernum-plus", (a, b) => Number(a) + Number(b));

  // Scenario-aware label: swaps terminology in Cyfærnum scenario.
  // Usage: {{infLabel "Alma.PluralLabel"}} or {{infLabel "Caido.Label"}}
  const CYFAERNUM_LABELS = {
    "Caido.Label":        "INFAERNUM.Cyfaernum.Agente",
    "Caido.PluralLabel":  "INFAERNUM.Cyfaernum.Agentes",
    "Alma.PluralLabel":   "INFAERNUM.Cyfaernum.Downloads",
    "Alma.Queimar":       "INFAERNUM.Cyfaernum.QuerimarDownload",
    "Personagem.Almas":   "INFAERNUM.Cyfaernum.Downloads",
  };
  Handlebars.registerHelper("infLabel", (key) => {
    const cenario = game.settings?.get("infaernum", "cenario") ?? "padrao";
    const i18nKey = cenario === "cyfaernum" && CYFAERNUM_LABELS[key]
      ? CYFAERNUM_LABELS[key]
      : `INFAERNUM.${key}`;
    return game.i18n.localize(i18nKey);
  });

  // CSS class for dado result
  Handlebars.registerHelper("infaernum-dado-classe", (v) => {
    if (v === 1) return "desgraca";
    if (v <= 3)  return "vislumbre";
    if (v <= 5)  return "facanha";
    return "milagre";
  });
}
