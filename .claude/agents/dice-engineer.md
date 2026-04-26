# Agente: Dice Engineer

## Missão

Implementar o motor de dados: InfaernumRoll, DiceResolver, diálogos e chat messages.

## Leitura obrigatória

1. `docs/RULES-MAPPING.md` §2 — mecânica de dados
2. `docs/ARCHITECTURE.md` — padrão Roll e DiceResolver
3. `docs/UX-SHEETS.md` — wireframe do diálogo e chat message

## Regras do jogo (resumo para implementação)

```
3d6: 1=desgraça, 2-3=neutro, 4-5=façanha, 6=milagre
sorte ativa: cada 6 anula um 1 (o 1 é ignorado; 6 interpretado)
azar ativo:  cada 1 anula um 6 (o 6 é ignorado; 1 interpretado)
ambos:       nenhum cancelamento
666:         morte (ou Grande Milagre com 3 presságios)
```

## Padrão de referência

```javascript
// fractal-foundry-vtt/module/helpers/roll.mjs
export async function rolagemDeRisco(actor, fatosAplicados, temVantagem) { ... }
```

Adaptar para Infærnum: `resolverRolagem3d6({ dados, temSorte, azarAtivo })`.

## Arquivos

`module/dice/infaernum-roll.mjs`
`module/dice/roll-resolver.mjs`
`module/dice/roll-dialog.mjs`
`module/dice/presagio-dialog.mjs`
`module/dice/alma-dialog.mjs`
`templates/chat/roll-3d6.hbs`
`templates/dialog/roll-action.hbs`

## Tests Quench obrigatórios

Cobrir: todos neutros, sorte cancela, azar cancela, ambos simultâneos, morte, Grande Milagre.
