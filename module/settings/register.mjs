export function registerSettings() {
  game.settings.register("infaernum", "cenario", {
    name: "INFAERNUM.Setting.Cenario.Name",
    hint: "INFAERNUM.Setting.Cenario.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: {
      padrao:    "INFAERNUM.Setting.Cenario.Padrao",
      dominios:  "INFAERNUM.Setting.Cenario.Dominios",
      cyfaernum: "INFAERNUM.Setting.Cenario.Cyfaernum",
      custom:    "INFAERNUM.Setting.Cenario.Custom",
    },
    default: "padrao",
  });

  game.settings.register("infaernum", "modoAleatorio", {
    name: "INFAERNUM.Setting.ModoAleatorio.Name",
    hint: "INFAERNUM.Setting.ModoAleatorio.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: {
      dados:  "INFAERNUM.Setting.ModoAleatorio.Dados",
      cartas: "INFAERNUM.Setting.ModoAleatorio.Cartas",
    },
    default: "dados",
  });

  game.settings.register("infaernum", "theme", {
    name: "INFAERNUM.Setting.Theme.Name",
    hint: "INFAERNUM.Setting.Theme.Hint",
    scope: "client",
    config: true,
    type: String,
    choices: {
      escuro:    "INFAERNUM.Setting.Theme.Escuro",
      claro:     "INFAERNUM.Setting.Theme.Claro",
      medieval:  "INFAERNUM.Setting.Theme.Medieval",
      cyberpunk: "INFAERNUM.Setting.Theme.Cyberpunk",
    },
    default: "escuro",
    onChange: (value) => _applyTheme(value),
  });

  // Suplementos ativos
  for (const suplemento of ["Colossos", "Fendas", "Paranoias", "Pactos", "Territorios", "Dominios", "Almas", "Arcanos"]) {
    game.settings.register("infaernum", `usa${suplemento}`, {
      name: `INFAERNUM.Setting.Usa${suplemento}.Name`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true,
    });
  }
}

export function applyThemeFromSettings() {
  const theme = game.settings.get("infaernum", "theme") ?? "escuro";
  _applyTheme(theme);
}

const THEMES = {
  escuro: {
    "--inf-color-bg":                "#0e0608",
    "--inf-color-bg-sheet":          "#130a0a",
    "--inf-color-bg-panel":          "#1a0e0e",
    "--inf-color-bg-input":          "#0a0406",
    "--inf-color-border":            "#4a1515",
    "--inf-color-border-light":      "#c03030",
    "--inf-color-text":              "#f0e8e8",
    "--inf-color-text-muted":        "#b09090",
    "--inf-color-text-header":       "#ffd0d0",
    "--inf-color-accent":            "#c03030",
    "--inf-color-accent-glow":       "rgba(192,48,48,0.35)",
    "--inf-color-bg-float":          "rgba(0,0,0,0.80)",
    "--inf-color-bg-float-hover":    "rgba(0,0,0,0.92)",
    "--inf-color-divider":           "rgba(255,255,255,0.07)",
  },
  claro: {
    "--inf-color-bg":                "#f2e5c8",
    "--inf-color-bg-sheet":          "#ead8b0",
    "--inf-color-bg-panel":          "#e2cca0",
    "--inf-color-bg-input":          "#f8f0dc",
    "--inf-color-border":            "#8a5028",
    "--inf-color-border-light":      "#4a2808",
    "--inf-color-text":              "#1e0e05",
    "--inf-color-text-muted":        "#5a3010",
    "--inf-color-text-header":       "#120803",
    "--inf-color-accent":            "#8a1515",
    "--inf-color-accent-glow":       "rgba(138,21,21,0.12)",
    "--inf-color-bg-float":          "rgba(242,229,200,0.93)",
    "--inf-color-bg-float-hover":    "rgba(226,204,160,0.97)",
    "--inf-color-divider":           "rgba(90,48,16,0.15)",
  },
  medieval: {
    "--inf-color-bg":                "#0e0a04",
    "--inf-color-bg-sheet":          "#1e1608",
    "--inf-color-bg-panel":          "#261e0a",
    "--inf-color-bg-input":          "#160e02",
    "--inf-color-border":            "#6b4a10",
    "--inf-color-border-light":      "#c8902a",
    "--inf-color-text":              "#f0e0c0",
    "--inf-color-text-muted":        "#a08060",
    "--inf-color-text-header":       "#f8e8c0",
    "--inf-color-accent":            "#8b6010",
    "--inf-color-accent-glow":       "rgba(139,96,16,0.3)",
    "--inf-color-bg-float":          "rgba(0,0,0,0.80)",
    "--inf-color-bg-float-hover":    "rgba(0,0,0,0.92)",
    "--inf-color-divider":           "rgba(255,255,255,0.07)",
  },
  cyberpunk: {
    "--inf-color-bg":                "#06060e",
    "--inf-color-bg-sheet":          "#0a0a18",
    "--inf-color-bg-panel":          "#0e0e20",
    "--inf-color-bg-input":          "#040410",
    "--inf-color-border":            "#20207a",
    "--inf-color-border-light":      "#6060d0",
    "--inf-color-text":              "#d8eeff",
    "--inf-color-text-muted":        "#8090c0",
    "--inf-color-text-header":       "#a0d8ff",
    "--inf-color-accent":            "#4040c0",
    "--inf-color-accent-glow":       "rgba(64,64,192,0.4)",
    "--inf-color-bg-float":          "rgba(0,0,0,0.85)",
    "--inf-color-bg-float-hover":    "rgba(6,6,24,0.95)",
    "--inf-color-divider":           "rgba(255,255,255,0.06)",
  },
};

function _applyTheme(theme) {
  const vars = THEMES[theme] ?? THEMES.escuro;
  const root = document.documentElement;
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
  document.body.dataset.infTheme = theme;
}
