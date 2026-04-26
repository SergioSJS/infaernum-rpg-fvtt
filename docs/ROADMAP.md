# Roadmap — Fases 0–9

Cada fase entrega um build **instalável e jogável** em Foundry VTT.
Versão segue SemVer: `0.X.0` por fase, `1.0.0` ao concluir Fase 9.

---

## Fase 0 — Fundação & Documentação
**Versão alvo:** `0.0.1`
**Dependências:** nenhuma

### O que entregar
- [ ] Repositório com git init + `.gitignore` adequado
- [ ] `system.json` v0.0.1 (manifesto FVTT válido, sem actors/items ainda)
- [ ] `package.json` com scripts: `build:css`, `watch:css`, `lint`, `pack:build`
- [ ] `.eslintrc.json` básico
- [ ] `styles/infaernum.scss` + `styles/infaernum.css` (empty)
- [ ] `lang/pt-BR.json` com estrutura base (namespace `INFAERNUM`)
- [ ] `module/infaernum.mjs` entry point vazio (só Hooks.once init/ready)
- [ ] `templates/` structure vazia
- [ ] `assets/` structure vazia
- [ ] `packs/sources/` structure vazia
- [ ] `.github/workflows/lint.yml` + `release.yml`
- [ ] Todos os docs em `docs/` (este ROADMAP + companheiros)
- [ ] `.claude/CLAUDE.md` + `settings.json` + `agents/` + `commands/`
- [ ] `README.md` raiz

### Definition of Done
Sistema instala no Foundry sem erros de console. Nenhuma sheet abre ainda, mas o manifesto é válido.

### Como verificar
```bash
# symlink local
ln -sf "$(pwd)" ~/Library/Application\ Support/FoundryVTT/Data/systems/infaernum
# abrir Foundry → criar mundo com sistema "infaernum" → sem erros no console
```

---

## Fase 1 — Ficha de Personagem
**Versão alvo:** `0.1.0`
**Dependências:** Fase 0

### O que entregar
- [ ] DataModel `PersonagemData` com campos:
  - `sorte: StringField`
  - `azar: StringField`
  - `desgracas: NumberField(0–6)`
  - `almas: NumberField(≥0)`
  - `movimentos_alteracao: NumberField(0–6)`
  - `segundo_azar: BooleanField`
  - `anotacoes: HTMLField`
- [ ] `PersonagemSheet` (ActorSheetV2 + HandlebarsApplicationMixin)
- [ ] Template `templates/actor/personagem-sheet.hbs`:
  - Header: nome, avatar
  - Seção sorte e azar (campos texto editáveis)
  - Tracker desgraças (6 bolinhas clicáveis)
  - Contador almas (+ / −)
  - Lista de tralhas (items embedded, tipo `tralha`)
  - Bloco bênção (item embedded, tipo `bencao`)
  - Lista de tormentos (items, tipo `tormento`) — apenas exibição
  - Bloco maldição (item, tipo `maldicao`) — apenas exibição
  - Seção paranoias (items, tipo `paranoia`) — apenas exibição
  - Campo anotações (HTML)
- [ ] Item DataModels básicos: `TralhaData`, `BencaoData`, `TormentoData`, `MaldicaoData`, `ParanoiaData`
- [ ] `item-generic-sheet.mjs` (uma sheet simples para todos os items)
- [ ] i18n pt-BR para todos os campos
- [ ] CSS base da ficha

### Definition of Done
Criar ator tipo `personagem`, abrir sheet, preencher sorte/azar/nome, adicionar tralha via drag, tracker de desgraças funciona com clique.

---

## Fase 2 — Motor de Dados
**Versão alvo:** `0.2.0`
**Dependências:** Fase 1

### O que entregar
- [ ] `InfaernumRoll` (extends Roll)
- [ ] `DiceResolver.resolver3d6({ dados, temSorte, azarAtivo })` → `{ desgracas, neutros, facanhas, milagres, morte }`
- [ ] Diálogo de ação 3d6:
  - Input "descrição da ação"
  - Checkbox "Aplicar sorte" (disabled se ação irrelevante)
  - Checkbox "Aplicar azar" (desabilitado se sorte ativa e vice-versa)
  - Preview "Rolando 3d6"
  - Botão confirmar
- [ ] Chat message 3d6: exibe dados coloridos, classificação por tipo, total de cada
- [ ] Detecção de morte (três 6s) → mensagem especial
- [x] Macro 1d6 pergunta: input texto → chat sim/não com intensidade
- [x] Macro 2d6 ideias: rola verbo + substantivo → chat
- [x] Tabelas de Caos (desgraça, neutro, PNJ confronto, PNJ comportamento, orações)
- [x] Botão "Rolar Ação" na ficha do personagem
- [ ] Tests Quench (se configurado): `DiceResolver` → 5 cenários base

### Definition of Done
Abrir sheet de personagem → clicar "Rolar Ação" → dialog abre → preencher → dados aparecem no chat classificados. Três 6s → mensagem de morte aparece.

---

## Fase 3 — Tormentos, Maldições, Cavaleiros
**Versão alvo:** `0.3.0`
**Dependências:** Fase 2

### O que entregar
- [ ] Roll dialog lista tormentos ativos com checkboxes (aplicar ao cálculo)
- [ ] Ao rolar desgraça: botão pós-chat "Gerar tormento?" → dialog de descrição → cria item `tormento`
- [ ] Active Effect nos itens `tormento` e `maldicao` com flag `infaernum.tormento/maldicao = true`
- [ ] `helpers/cavaleiro-encounter.mjs`:
  - Gatilho quando `desgracas === 6`
  - Sorteia Cavaleiro aleatoriamente
  - Sorteia maldição (1d6 na tabela do Cavaleiro)
  - Dialog de confirmação
  - Cria item `maldicao`
  - Zera desgraças
  - Se já tem maldição → diálogo de morte
- [ ] `module/tables/cavaleiros.mjs` com todas as maldições dos 4 Cavaleiros
- [ ] Chat template `templates/chat/cavaleiro-encounter.hbs`
- [ ] Compendium `packs/sources/cavaleiros/` (JournalEntries com lore dos Cavaleiros)
- [ ] i18n pt-BR para novos elementos

### Definition of Done
Personagem acumula 6 desgraças → dialog do Cavaleiro abre → aceita → item maldição criado → desgraças zeradas. Segundo encontro → morte notificada.

---

## Fase 4 — Grupo & Presságios
**Versão alvo:** `0.4.0`
**Dependências:** Fase 3

### O que entregar
- [ ] DataModel `GrupoData`:
  - `dia_atual: NumberField(0–7)`
  - `presagios_atuais: NumberField(0–6)`
  - `presagios_max_dia: NumberField(0–6)`
  - `cavaleiros_anunciados: ArrayField(StringField)`
  - `cenario: StringField`
- [ ] `GrupoSheet` com:
  - Tracker dia (1–7) com botão avançar dia
  - Tracker presságios (max_dia bolinhas, marcadas as atuais)
  - Botão "Rolar Presságios do Dia" (1d6 → seta max e atual)
  - Lista de Cavaleiros já anunciados
- [ ] HUD lateral (clock-panel style): dia atual + presságios ativos
- [ ] Pós-rolagem 3d6 no chat: botão "Queimar Presságio" → `presagio-dialog.mjs`:
  - Escolher qual dado rerrolar
  - Verifica `presagios_atuais >= 1`
  - Decrementa presságio + rerrola dado + recalcula resultado
- [ ] Macro "Virar Dia": rola presságios do dia, reseta pactos (Fase 6 vai usar), incrementa dia
- [ ] Se três 6s + presságios >= 3 → diálogo "Queimar 3 presságios → Grande Milagre?"

### Definition of Done
Criar ator tipo `grupo` → sheet abre → avançar dia → presságios rolam → HUD exibe. Após rolar 3d6, clicar "Queimar Presságio" → dado rerola no chat.

---

## Fase 5 — Caídos & Desafios
**Versão alvo:** `0.5.0`
**Dependências:** Fase 2

### O que entregar
- [ ] DataModel `CaidoData`:
  - `descricao: StringField`
  - `dificuldade_max: NumberField`
  - `dificuldade_atual: NumberField`
  - `habilidades: ArrayField(StringField)`
  - `tormentos_que_causa: ArrayField(StringField)`
- [ ] `CaidoSheet`:
  - Nome, avatar, descrição
  - Barra de dificuldade (atual / max)
  - Lista de habilidades
  - Botão "Absorver Alma" (visível quando `dificuldade_atual === 0`)
- [ ] Chat message de rolagem 3d6: botão "Aplicar ao Desafio"
  - Select de atores `caido` na cena
  - Aplica: `dificuldade_atual -= facanhas.length + (milagres.length * 2)`
  - Chat renderiza redução + dificuldade restante
  - Se `dificuldade_atual <= 0` → "Desafio superado!" no chat
- [ ] Botão "Absorver Alma" incrementa `actor.system.almas` do personagem que clicou
- [ ] i18n pt-BR

### Definition of Done
Criar caído com dificuldade 6 → personagem rola 3d6, obtém façanhas → clicar "Aplicar ao Desafio" → dificuldade cai → ao chegar a 0, alma disponível.

---

## Fase 6 — Suplementos: Fendas, Paranoias, Pactos, Almas
**Versão alvo:** `0.6.0`
**Dependências:** Fase 5

### O que entregar
- [ ] Item type `salvacao` + DataModel
- [ ] Item type `fenda` + DataModel + lógica de desafios sequenciais
- [ ] Item type `paranoia` + DataModel
  - Hook: bloqueia criação da 4ª paranoia
  - Hook na 3ª: seta `segundo_azar = true` no actor
- [ ] Item type `pacto` + DataModel
  - Flag `dadiva_usada_hoje` e `divida_paga_hoje`
  - Botão "Usar Dádiva" na ficha (uma vez por dia)
- [ ] Integração "Virar Dia" (Fase 4) → reseta flags de pacto
- [ ] `alma-dialog.mjs`: pós-rolagem, se `actor.system.almas > 0`, botão "Queimar Alma"
  - Shift desgraça→neutro ou neutro→façanha
  - Decrementa `almas`
- [ ] Compendiums: rolltables de salvações, paranoias, pactos (dádivas e dívidas)
- [ ] Macro "Rolar Paranoia" → cria item paranoia com resultado aleatório
- [ ] Macro "Firmar Pacto" → wizard: invocação 3d6 → se ≥1 milagre, cria pacto

### Definition of Done
Criar item paranoia → 3ª paranoia aciona `segundo_azar`. Criar pacto → usar dádiva hoje → botão desabilitado. Virar dia → botão reabilita.

---

## Fase 7 — Colossos
**Versão alvo:** `0.7.0`
**Dependências:** Fase 5

### O que entregar
- [ ] DataModel `ColossoData` com partes, desgraças por naipe, cartas de jogadores
- [ ] `ColossoSheet`:
  - Dificuldade total/atual (pode ser dividida em partes)
  - Grid visual das 4 "cartas" com naipes
  - Posições de personagens nas cartas (drag para mover)
  - Ao rolar desgraça: exibir qual tormento do naipe atual
- [ ] Pós-rolagem com desgraça: se personagem está no colosso → revelar carta
- [ ] Ao derrotar colosso: dialog "Absorver desgraça como ritual?" → cria item `ritual`
- [ ] Item type `ritual` (cópia de `salvacao` com origem)
- [ ] Chat template para combate de colosso

### Definition of Done
Criar colosso → posicionar personagens → rolar ação → desgraça revela carta e aplica tormento do naipe. Derrotar → ritual criado.

---

## Fase 8 — Cenários: Domínios, Cyfærnum, Territórios, Arcanos
**Versão alvo:** `0.8.0`
**Dependências:** Fase 6

### O que entregar
- [ ] World setting `cenario`: `padrao | dominios | cyfaernum | custom`
- [ ] Toggle de suplementos: `usaColossos`, `usaFendas`, etc.
- [ ] Cenário `domínios`:
  - Item type `dominio`
  - `PersonagemData.cavaleiro_servido`
  - Lógica: ao encontrar Cavaleiro servido → zera desgraças sem maldição
- [ ] Cenário `cyfaernum`:
  - JournalEntry no compendium
  - Setting para renomear labels (caído→agente, almas→downloads, etc.)
- [ ] Item type `territorio` + Macro "Explorar Território"
- [ ] `module/tables/arcanos.mjs` + Macro "Puxar Arcano"
- [ ] Compendiums: cenários, macros, arcanos

### Definition of Done
Criar mundo com cenário `domínios` → personagem com cavaleiro_servido definido → acumular 6 desgraças → diálogo aparece → sem maldição por servir o Cavaleiro.

---

## Fase 9 — Modo Cartas (Infærnaculum) & Polish
**Versão alvo:** `1.0.0`
**Dependências:** Fase 8

### O que entregar
- [ ] `module/dice/card-strategy.mjs` implementando `IDiceStrategy`
- [ ] World setting `modoAleatorio: "dados" | "cartas"`
- [ ] Tabelas Infærnaculum em `module/tables/infaernaculum.mjs`
- [ ] `lang/en.json` (tradução básica)
- [ ] Theme presets (tema escuro + claro/medieval + cyberpunk)
- [ ] Tests Quench completos: `DiceResolver`, cancelamento sorte/azar, presságios
- [ ] README.md atualizado com guia de instalação e uso
- [ ] `docs/CHANGELOG.md` atualizado com histórico completo
- [ ] CI: lint verde + release zip gerado corretamente
- [ ] Teste em Foundry v13 e v14

### Definition of Done
Sistema completo. Instalar via manifest URL. Criar mundo. Criar personagem. Rolar 3d6. Todos suplementos acessíveis via settings. Mode cartas funciona. CI verde.

---

## Progresso

| Fase | Versão | Status | Data início | Data fim |
|------|--------|--------|-------------|----------|
| 0 | 0.0.1 | ✅ Concluída | 2026-04-24 | 2026-04-24 |
| 1 | 0.1.0 | ✅ Concluída | 2026-04-24 | 2026-04-24 |
| 2 | 0.2.0 | ✅ Concluída | 2026-04-24 | 2026-04-24 |
| 3 | 0.3.0 | ✅ Concluída | 2026-04-24 | 2026-04-24 |
| 4 | 0.4.0 | ✅ Concluída | 2026-04-24 | 2026-04-24 |
| 5 | 0.5.0 | ✅ Concluída | 2026-04-24 | 2026-04-24 |
| 6 | 0.6.0 | ✅ Concluída | 2026-04-24 | 2026-04-24 |
| 7 | 0.7.0 | ✅ Concluída | 2026-04-24 | 2026-04-24 |
| 8 | 0.8.0 | ✅ Concluída | 2026-04-24 | 2026-04-24 |
| 9 | 1.0.0 | ✅ Concluída | 2026-04-24 | 2026-04-24 |

### Notas de implementação (divergências do plano original)

- **Fase 2:** `InfaernumRoll` não foi criada como subclasse de `Roll` — rolagem usa `new Roll("3d6").evaluate()` diretamente em `roll-dialog.mjs`. `DiceResolver` é módulo de funções puras (`roll-resolver.mjs`), não classe.
- **Fase 3:** Maldições implementadas com texto verbatim do PDF (24 maldições, 4 cavaleiros × 6 índices). Sem Active Effects com flags — tormento/maldição influenciam cálculo via DataModel getters.
- **Fase 4:** Campo `presagios_atuais/max_dia` renomeado para `presagios_totais/usados` com getter `presagiosDisponiveis`. Grande Milagre (666 + 3 presságios) implementado.
- **Fase 5:** `dificuldade_max` renomeado para `dificuldade` (consistente com DataModel). Chat tem botões −1/−2 por façanha/milagre. "Absorver Alma" implementado: banner aparece quando `derrotado = true`, ação cria +1 alma no personagem e posta chat.
- **Fase 6 (extra):** `firmarPactoWizard` e `rolarParanoia` adicionados como macros + `game.infaernum` API. `grupoHUD` montado em `#ui-right-column-1` com reatividade via updateActor hook. Painel Oráculo (Pergunta/Ideia/Caos) montado em `#ui-right-column-1`.
- **Fase 8 (extra):** Rótulos Cyfærnum implementados via Handlebars helper `{{infLabel}}` — almas→downloads quando cenario=cyfaernum. JournalEntry Cyfærnum adicionado ao compendium.
- **Fase 9 (extra):** Quench tests (`module/tests/dice-resolver.test.mjs`). Theme presets (Escuro/Medieval/Cyberpunk) via setting client-side + `_applyTheme()`. Compendiums: 4 JournalEntries cavaleiros + 8 RollTables (passado, sorte, azar, tralhas, bençãos, paranoias, dádivas, dívidas) + JournalEntry cyfaernum.

---

## Tasks ativas

Ver `docs/tasks/` para tasks abertas de cada fase.
Convenção de nome: `YYYYMMDD-fase-N-descricao.md`
