# Arquitetura do Sistema

## Stack Técnico

| Camada | Tecnologia | Versão mínima |
|--------|-----------|---------------|
| Engine | Foundry VTT | v13 (verified v14) |
| Data layer | `TypeDataModel` (`foundry.abstract.TypeDataModel`) | v13 API |
| Sheets | `ActorSheetV2` + `HandlebarsApplicationMixin` | v13 API |
| Templates | Handlebars (`.hbs`) | nativo FVTT |
| CSS | Sass → CSS compilado | sass 1.70+ |
| JS | ES Modules puros (`.mjs`) | sem bundler |
| Compendiums | `@foundryvtt/foundryvtt-cli` (LevelDB) | 2.0+ |
| Testes | Quench (módulo FVTT, runtime) | opcional |
| Lint | ESLint | 8.x |
| CI | GitHub Actions | — |

---

## Estrutura de Diretórios

```
infaernum-rpg-fvtt/
├── system.json                  # manifesto FVTT
├── LICENSE
├── README.md
├── package.json                 # devDeps: sass, eslint, fvtt-cli
├── .eslintrc.json
├── .gitignore
│
├── .github/
│   └── workflows/
│       ├── lint.yml             # ESLint em cada PR
│       └── release.yml          # zip + GitHub Release em tag v*.*.*
│
├── .claude/
│   ├── CLAUDE.md                # memória do projeto (só pointers)
│   ├── settings.json            # permissões e hooks
│   ├── agents/                  # briefings de agentes especializados
│   └── commands/                # slash commands
│
├── docs/                        # planejamento (não vai no zip de release)
│   ├── PLANEJAMENTO.md
│   ├── ARCHITECTURE.md          ← você está aqui
│   ├── RULES-MAPPING.md
│   ├── ROADMAP.md
│   ├── ...
│   ├── Compilado - Old Infærnum.md
│   ├── fractal-foundry-vtt/     # projeto de referência
│   └── assimilacao-sistema-nao-oficial/
│
├── module/                      # código fonte JS
│   ├── infaernum.mjs            # entry point
│   ├── config.mjs               # CONFIG.INFAERNUM — constantes globais
│   ├── data/                    # TypeDataModel por tipo
│   │   ├── actor-personagem.mjs
│   │   ├── actor-caido.mjs
│   │   ├── actor-colosso.mjs
│   │   ├── actor-grupo.mjs
│   │   ├── item-tralha.mjs
│   │   ├── item-bencao.mjs
│   │   ├── item-salvacao.mjs
│   │   ├── item-ritual.mjs
│   │   ├── item-pacto.mjs
│   │   ├── item-tormento.mjs
│   │   ├── item-maldicao.mjs
│   │   ├── item-paranoia.mjs
│   │   ├── item-fenda.mjs
│   │   ├── item-territorio.mjs
│   │   └── item-dominio.mjs
│   ├── dice/                    # motor de dados
│   │   ├── infaernum-roll.mjs   # Roll subclass
│   │   ├── roll-resolver.mjs    # classifica resultados 3d6
│   │   ├── roll-dialog.mjs      # diálogo de ação + preview
│   │   ├── presagio-dialog.mjs  # reroll via presságio
│   │   ├── alma-dialog.mjs      # burn alma para shift resultado
│   │   └── card-strategy.mjs    # modo Infærnaculum (cartas)
│   ├── sheets/                  # ActorSheet / ItemSheet
│   │   ├── actor-personagem-sheet.mjs
│   │   ├── actor-caido-sheet.mjs
│   │   ├── actor-colosso-sheet.mjs
│   │   ├── actor-grupo-sheet.mjs
│   │   └── item-generic-sheet.mjs
│   ├── helpers/                 # utilitários
│   │   ├── chat-messages.mjs    # render de mensagens de chat
│   │   ├── day-tracker.mjs      # dia atual + presságios
│   │   ├── cavaleiro-encounter.mjs # gatilho 6 desgraças
│   │   ├── handlebars.mjs       # registra helpers HBS customizados
│   │   └── sheet-registration.mjs
│   ├── tables/                  # dados estáticos das tabelas do livro
│   │   ├── cavaleiros.mjs       # maldições e eventos dos 4 Cavaleiros
│   │   ├── arcanos.mjs          # 22 arcanos maiores
│   │   ├── caos.mjs             # tabelas de Caos
│   │   └── definicao-personagem.mjs # sorte/azar/tralhas/bênção
│   └── settings/
│       ├── register.mjs         # registra world settings
│       └── campaign-config.mjs  # UI de configuração de campanha
│
├── templates/                   # Handlebars
│   ├── actor/
│   │   ├── personagem-sheet.hbs
│   │   ├── caido-sheet.hbs
│   │   ├── colosso-sheet.hbs
│   │   ├── grupo-sheet.hbs
│   │   └── parts/
│   │       ├── desgracas-tracker.hbs
│   │       ├── tormentos-list.hbs
│   │       ├── tralhas-list.hbs
│   │       └── presagios-panel.hbs
│   ├── item/
│   │   └── generic-sheet.hbs
│   ├── chat/
│   │   ├── roll-3d6.hbs
│   │   ├── roll-1d6.hbs
│   │   └── cavaleiro-encounter.hbs
│   └── dialog/
│       ├── roll-action.hbs
│       ├── presagio-reroll.hbs
│       └── alma-burn.hbs
│
├── styles/
│   ├── _variables.scss          # --inf-* CSS vars
│   ├── _sheets.scss
│   ├── _chat.scss
│   ├── _dialogs.scss
│   └── infaernum.scss           # ponto de entrada, gera infaernum.css
│
├── lang/
│   ├── pt-BR.json               # língua primária
│   └── en.json                  # Fase 9
│
├── assets/
│   ├── icons/
│   │   ├── cavaleiros/          # ícones dos 4 Cavaleiros
│   │   └── ui/
│   └── fonts/
│
└── packs/
    └── sources/                 # JSON de origem (commitados, buildados via fvtt-cli)
        ├── cavaleiros/
        │   ├── peste.json
        │   ├── guerra.json
        │   ├── fome.json
        │   └── morte.json
        ├── rolltables/
        │   ├── sorte.json
        │   ├── azar.json
        │   ├── tralhas.json
        │   ├── bencoes.json
        │   ├── salvacoes.json
        │   ├── paranoias.json
        │   ├── pactos-entidades.json
        │   ├── pactos-dadivas.json
        │   ├── pactos-dividas.json
        │   ├── arcanos.json
        │   └── caos/
        │       ├── desgraca.json
        │       ├── neutro.json
        │       ├── comportamento-npc.json
        │       └── suplica.json
        ├── macros/
        └── cenarios/
            └── cyfaernum.json   # JournalEntry com regras do cenário
```

---

## Padrões de Código

### TypeDataModel

Todo Actor e Item usa TypeDataModel (não `template.json`):

```javascript
// module/data/actor-personagem.mjs
import { fields } from "foundry.data";

export class PersonagemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const f = foundry.data.fields;
    return {
      sorte:  new f.StringField({ initial: "" }),
      azar:   new f.StringField({ initial: "" }),
      desgracas: new f.NumberField({ integer: true, min: 0, max: 6, initial: 0 }),
      almas:  new f.NumberField({ integer: true, min: 0, initial: 0 }),
      movimentos_alteracao: new f.NumberField({ integer: true, min: 0, max: 6, initial: 6 }),
      segundo_azar: new f.BooleanField({ initial: false }), // true após 3 paranoias
      // ... demais campos em RULES-MAPPING.md
    };
  }
}
```

### Entry Point

```javascript
// module/infaernum.mjs
import { PersonagemData } from "./data/actor-personagem.mjs";
// ... demais imports

Hooks.once("init", () => {
  // Registrar DataModels
  CONFIG.Actor.dataModels.personagem = PersonagemData;
  CONFIG.Actor.dataModels.caido     = CaidoData;
  CONFIG.Actor.dataModels.colosso   = ColossoData;
  CONFIG.Actor.dataModels.grupo     = GrupoData;

  // Registrar Item DataModels
  CONFIG.Item.dataModels.tralha   = TralhaData;
  // ...

  registerSettings();
  registerSheets();
  registerHandlebarsHelpers();
});

Hooks.once("ready", async () => {
  await setupMacros();
  // render day tracker panel se ativo
});
```

### Sheets

```javascript
// module/sheets/actor-personagem-sheet.mjs
export class PersonagemSheet extends foundry.applications.sheets.ActorSheetV2 {
  static DEFAULT_OPTIONS = {
    classes: ["infaernum", "sheet", "actor", "personagem"],
    position: { width: 680, height: 720 },
    actions: {
      rollAction:      PersonagemSheet.#rollAction,
      roll1d6:         PersonagemSheet.#roll1d6,
      roll2d6:         PersonagemSheet.#roll2d6,
      addTormento:     PersonagemSheet.#addTormento,
      removeTormento:  PersonagemSheet.#removeTormento,
    },
  };

  static PARTS = {
    main: { template: "systems/infaernum/templates/actor/personagem-sheet.hbs" },
  };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    // hydrate e retorna dados para HBS
    return { ...ctx, system: this.document.system };
  }

  static async #rollAction(event, target) {
    // abre roll-dialog
  }
}
```

### CSS Variables

```scss
// styles/_variables.scss
:root {
  --inf-accent:      #8B0000;
  --inf-accent2:     #a00000;
  --inf-bg:          #1a1a1a;
  --inf-bg-section:  #222222;
  --inf-bg-input:    #2a2a2a;
  --inf-border:      #444444;
  --inf-text:        #e0e0e0;
  --inf-red:         #cc2222;
  --inf-gold:        #c9a84c;
}
```

### Handlebars Helpers

Registrar em `module/helpers/handlebars.mjs`:

```javascript
Handlebars.registerHelper("times",    (n, block) => Array.from({length: n}, (_, i) => block.fn(i)).join(""));
Handlebars.registerHelper("eq",       (a, b) => a === b);
Handlebars.registerHelper("neq",      (a, b) => a !== b);
Handlebars.registerHelper("lt",       (a, b) => a < b);
Handlebars.registerHelper("lte",      (a, b) => a <= b);
Handlebars.registerHelper("gt",       (a, b) => a > b);
Handlebars.registerHelper("localize", (key) => game.i18n.localize(key));
```

---

## Sistema de Dados (Dice)

### Classificação 3d6

```
dado = 1       → desgraça
dado = 2 ou 3  → neutro
dado = 4 ou 5  → façanha
dado = 6       → milagre
três 6s        → morte (ou grande milagre com 3 presságios)
```

### Regras de cancelamento

- **sorte** ativa: cada milagre (6) anula uma desgraça (1) — o 6 permanece interpretado, o 1 é ignorado.
- **azar** ativo (ou tormento/maldição/paranoia pós-3ª): cada desgraça (1) anula um milagre (6).
- Sorte e azar simultâneos: ambos desconsiderados (neutros se anulam).

### Classe DiceResolver

```javascript
// module/dice/roll-resolver.mjs
export function resolverRolagem3d6({ dados, temSorte, temAzar }) {
  let desgracas = dados.filter(d => d === 1);
  let milagres  = dados.filter(d => d === 6);
  let neutros   = dados.filter(d => d === 2 || d === 3);
  let facanhas  = dados.filter(d => d === 4 || d === 5);

  if (temSorte && !temAzar) {
    const cancelados = Math.min(desgracas.length, milagres.length);
    // sorte anula desgracas: remover cancelados desgracas
    desgracas = desgracas.slice(cancelados);
  } else if (temAzar && !temSorte) {
    const cancelados = Math.min(milagres.length, desgracas.length);
    // azar anula milagres
    milagres = milagres.slice(cancelados);
  }
  // se ambos: nenhum cancelamento

  const morte = milagres.length === 3 && dados.length === 3
    && !temSorte; // sorte não cancela morte

  return { dados, desgracas, neutros, facanhas, milagres, morte };
}
```

---

## CI/CD

### release.yml (adaptado do fractal-foundry-vtt)

```yaml
on:
  push:
    tags: ["v*.*.*"]

jobs:
  release:
    steps:
      - uses: actions/checkout@v4

      - name: Build CSS
        run: npm ci && npm run build:css

      - name: Build Compendiums
        run: npm run pack:build

      - name: Update system.json
        run: |
          jq --arg ver "$VERSION" --arg dl "$DOWNLOAD_URL" \
            '.version = $ver | .download = $dl' \
            system.json > system.tmp.json && mv system.tmp.json system.json

      - name: Zip release
        run: |
          zip -r infaernum.zip \
            module/ templates/ lang/ styles/infaernum.css \
            system.json assets/ packs/
            # NÃO inclui docs/ nem .claude/

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: |
            infaernum.zip
            system.json
```

---

## Convenções

- **IDs de sistema:** `infaernum` (em `system.json`, pacotes, i18n namespace).
- **Prefixo CSS:** `--inf-` para variáveis, `.infaernum` como classe raiz.
- **Prefixo i18n:** `INFAERNUM.*`
- **Nomes de tipo:** snake_case em português (`personagem`, `caido`, `tormento`).
- **Nomes de arquivo JS:** `kebab-case.mjs`
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).
- **Versão:** SemVer. Patch para bug, minor para feature, major para breaking change Foundry.
