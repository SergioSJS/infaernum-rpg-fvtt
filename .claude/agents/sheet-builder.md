# Agente: Sheet Builder

## Missão

Implementar ActorSheet, ItemSheet e templates Handlebars.

## Leitura obrigatória

1. `docs/UX-SHEETS.md` — wireframes e interações
2. `docs/ARCHITECTURE.md` — padrão de sheet (ActorSheetV2 + HandlebarsApplicationMixin)
3. `docs/GLOSSARIO.md` — classes CSS e chaves i18n

## Padrão de referência

```javascript
// fractal-foundry-vtt/module/sheets/actor-sheet.mjs
export class PersonagemSheet extends foundry.applications.sheets.ActorSheetV2 {
  static DEFAULT_OPTIONS = {
    classes: ["infaernum", "sheet", "actor", "personagem"],
    position: { width: 680, height: 720 },
    actions: {
      acaoNome: PersonagemSheet.#acaoNome,
    },
  };
  static PARTS = {
    main: { template: "systems/infaernum/templates/actor/personagem-sheet.hbs" },
  };
  async _prepareContext(options) { /* hydrate data */ }
  static async #acaoNome(event, target) { /* handler */ }
}
```

## Regras

- Actions declaradas como `static #metodo` (privado) em DEFAULT_OPTIONS.actions
- Sem `submitOnChange` — usar listeners manuais para inputs inline
- HBS: sempre usar `{{localize "INFAERNUM.Chave"}}` para strings
- CSS: classes `.inf-*`, variáveis `--inf-*`
- Partes da sheet em `templates/actor/parts/` para reuso

## Arquivos

`module/sheets/*.mjs`, `templates/actor/*.hbs`, `templates/actor/parts/*.hbs`
