# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
Versioning: [SemVer](https://semver.org/lang/pt-BR/)

---

## [1.0.0] — 2026-04-24

### Adicionado — Fase 9: Modo Cartas (Infærnaculum)

- `module/tables/infaernaculum.mjs`: tabelas completas de verbos (52 entradas) e substantivos (52 entradas) por naipe; `naipeParaDado` para compatibilidade com resolver; `NAIPE_SIMBOLO`
- `module/dice/card-strategy.mjs`: `drawAcao` (3 cartas → dados equiv.), `drawPergunta` (1 carta sim/não com provável), `drawIdeia` (verbo + substantivo), `formatCarta` ("♦ 7")
- `roll-dialog.mjs`: suporte a `modoAleatorio === "cartas"` — branchs roll vs. draw; `cartasDraw` passado para templateData e flags do ChatMessage
- `acao-result.hbs`: exibe cartas (♥ 7 etc.) quando `cartas` presente; fallback para dados normais
- `lang/en.json`: tradução completa de todos os keys `INFAERNUM.*`
- `system.json`: língua `en` registrada; versão bumped para 1.0.0

---

## [0.8.0] — 2026-04-24

### Adicionado — Fase 8: Cenários, Arcanos, Territórios

- `module/tables/arcanos.mjs`: 22 arcanos do PDF com verbos/substantivos/adjetivos; `puxarArcanoChat(n)` → chat; `explorarTerritorioDialog()` → dialog com lista de territórios
- `game.infaernum` API exposta no hook `ready`: `puxarArcano`, `explorarTerritorio`
- `item-body.hbs`: seção DOMÍNIO (cavaleiro, indice, ativo); seção TERRITÓRIO (tipo, controlador, coordenadas, revelado)
- `personagem-body.hbs`: seção domínios com badge de cavaleiro; fendas com progresso X/Y
- `actor-personagem-sheet.mjs`: context inclui `fendas`, `dominios`, `cenario`
- CSS: `.dominio-*`, `.territorio-*`, `.arcano-*`

---

## [0.7.0] — 2026-04-24

### Adicionado — Fase 7: Colossos

- `actor-colosso.mjs` reescrito: `dificuldade_atual`, `naipe_tormentos` (SchemaField por naipe), getter `derrotado`
- `colosso-header.hbs`: retrato, dificuldade X/Y, badge Derrotado, botão "Absorver Ritual"
- `colosso-body.hbs`: grid 2×2 de naipes (símbolo ♥♠♣♦, tormento text, desgraças +/−, revelar/ocultar); lista de partes; rituais absorvidos
- `actor-colosso-sheet.mjs`: PARTS header+body; actions `adicionarDesgracaNaipe`, `removerDesgracaNaipe`, `revelarCarta`, `esconderCarta`, `addParte`, `removeParte`, `toggleParteDestruida`, `absorverRitual`, `editItem`, `deleteItem`
- `absorverRitual`: dialog seleciona naipe + personagem → cria item `ritual` no personagem
- CSS: grid de naipes, `.colosso-naipe-*`, `.colosso-parte-*`

---

## [0.6.0] — 2026-04-24

### Adicionado — Fase 6: Fendas, Paranoias, Pactos, Almas

- `item-fenda.mjs`: campo `progresso` (NumberField)
- `item-generic-sheet.mjs`: actions `addDificuldade`, `removeDificuldade`, `superarDificuldade`, `concluirFenda` (cria salvação no actor pai)
- `item-body.hbs`: seção FENDA com checklist sequencial de dificuldades, botões Superar/Concluir
- `alma-dialog.mjs`: `queimarAlma(message)` — dialog para shift de dado (desgraça→neutro ou neutro→façanha), decrementa `almas`
- `acao-result.hbs`: botão "Queimar Alma" quando `temAlmas`
- `actor-grupo-sheet.mjs`: `rolarPresagiosDia` reseta `dadiva_usada` e `divida_paga` em todos os pactos de todos os personagens
- `personagem-body.hbs`: botão "Usar Dádiva" em pactos (desabilitado após uso); seção fendas com progresso
- Hooks `preCreateItem` (bloqueia 4ª paranoia) e `createItem` (3ª paranoia → `segundo_azar = true`)
- i18n: chaves `Alma.*`, `Fenda.*`, `Pacto.UsarDadiva`

---

## [0.5.0] — 2026-04-24

### Adicionado
- `CaidoSheet` com header (retrato, nome, cavaleiro, dificuldade `X/Y`, badge "Derrotado") e body (aparência, habilidades editáveis, tormentos causados, descrição, anotações)
- Habilidades: lista com add/remove inline (ArrayField)
- Chat result 3d6: botões "−1 Façanha" / "−2 Milagre" aparecem quando há façanhas ou milagres
- `module/helpers/caido-actions.mjs`: dialog para selecionar caído alvo e reduzir dificuldade
- i18n: chaves `Caido.*` expandidas, `Common.Remover/Editar`, `Roll.Facanha/Milagre`
- CSS: `.infaernum.sheet.caido`, `.caido-body`, `.chat-caido-actions`

### Alterado
- `actor-caido-sheet.mjs`: PARTS separados em header + body; actions adicionadas
- `acao-result.hbs`: botões de caído após presságios, condicionais por resultado

---

## [0.4.0] — 2026-04-24

### Adicionado
- `GrupoData` com `dia_atual`, `presagios_totais`, `presagios_usados`, `cavaleiros_anunciados`, `cenario`, getter `presagiosDisponiveis`
- `GrupoSheet` com tracker de dia (0–7), tracker de presságios (pips), grid de cavaleiros anunciados
- `rolarPresagiosDia`: rola 1d6, converte (1-2→4, 3-4→5, 5-6→6 presságios), avança dia
- Chat result 3d6: botões "Rerrolar dado" e "Reduzir desgraça" (gastam 1 presságio do grupo)
- `presagio-dialog.mjs`: rerrolagem de dado individual, redução de desgraça, oferta de Grande Milagre (666 + 3 presságios)
- Hook `renderChatMessageHTML` (v13+) para wiring de botões de chat
- i18n: chaves `Grupo.*`, `Presagio.*`
- CSS: grupo sheet, day tracker, presságio tracker

---

## [0.3.0] — 2026-04-24

### Adicionado
- Roll dialog: checkboxes de tormentos ativos e maldição (aplicam azar extra)
- `cavaleiro-encounter.mjs`: gatilho ao acumular 6 desgraças, sorteia cavaleiro e índice de maldição, cria item `maldicao`, zera desgraças
- `module/tables/cavaleiros.mjs`: 24 maldições verbatim do PDF (4 cavaleiros × 6 índices)
- Dialog de seleção de cavaleiro com índice aleatório ou manual (1–6)
- Chat template `maldicao-result.hbs`
- Segundo encontro → morte
- Personagem que serve cavaleiro → sem maldição
- i18n: chaves `Encontro.*`, `Maldicao.*`

### Alterado
- `PersonagemData`: getter `temMaldicao`, `paranoias`, `tormentosAtivos`
- Roll dialog: `segundo_azar` troca sorte por azar

---

## [0.2.0] — 2026-04-24

### Adicionado
- `module/dice/roll-resolver.mjs`: função pura `resolverRolagem3d6` com cancelamento sorte/azar
- `module/dice/roll-dialog.mjs`: `openAcaoDialog` com DialogV2, 3d6 com `Roll`, acumulação de desgraças, detecção de morte (666)
- Chat template `acao-result.hbs`: dados coloridos por tipo (desgraca/neutro/facanha/milagre), resumo do resultado
- Handlebars helper `infaernum-dado-classe`
- Botão "Rolar Ação" na ficha do personagem
- i18n: chaves `Roll.*`, `Resultado.*`

---

## [0.1.0] — 2026-04-24

### Adicionado
- `PersonagemData` com sorte, azar, desgracas, almas, movimentos_alteracao, segundo_azar, cavaleiro_servido, anotacoes
- `PersonagemSheet` (ActorSheetV2 + HandlebarsApplicationMixin) com header + body (3 tabs: Principal, Itens, Anotações)
- Tracker de desgraças (6 pips clicáveis)
- Gestão de items: tralhas, bênção, salvações, rituais, pactos, tormentos, maldição, paranoias
- DataModels de items: TralhaData, BencaoData, SalvacaoData, RitualData, PactoData, TormentoData, MaldicaoData, ParanoiaData, FendaData, TerritorioData, DominioData
- `ItemGenericSheet` para todos os tipos de item
- `registerHandlebarsHelpers`: eq, gt, lt, lte, gte, includes, array, capitalize, plus, choices, cavaleiro-label, dado-classe
- i18n: estrutura base + chaves de personagem e items
- CSS: sheet-header, desgraca-tracker, tabs, items-list, badges

---

## [0.0.1] — 2026-04-24

### Adicionado
- Scaffolding completo: `system.json`, `package.json`, `.eslintrc.json`, `.gitignore`
- Entry point `module/infaernum.mjs` com registro de DataModels e sheets
- Estrutura de diretórios: `module/`, `templates/`, `styles/`, `lang/`, `packs/`, `assets/`
- `styles/infaernum.scss` + `styles/_variables.scss` com variáveis `--inf-*`
- `lang/pt-BR.json` com namespace `INFAERNUM`
- `module/settings/register.mjs`: cenario, modoAleatorio, 8 toggles de suplementos
- `.github/workflows/lint.yml` + `release.yml`
- Documentação: PLANEJAMENTO, ARCHITECTURE, RULES-MAPPING, ROADMAP, DEV-WORKFLOW, HANDOFF-TEMPLATE, LLM-COLLABORATION, TESTING, GLOSSARIO, COMPENDIUMS, UX-SHEETS
- Symlink local para Foundry VTT em `~/Library/Application Support/FoundryVTT/Data/systems/infaernum`
