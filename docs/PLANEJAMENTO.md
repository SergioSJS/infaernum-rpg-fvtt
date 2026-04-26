# Old Infærnum — Sistema Foundry VTT

> Documento-mestre. Leia este antes de qualquer outro.

## O que é este projeto

Sistema Foundry VTT para **Old Infærnum**, RPG brasileiro de Raul Volpato. Jogo brutal sobre os últimos 6 dias do mundo, com mecânica central 3d6, 4 Cavaleiros do Apocalipse e 10+ suplementos.

Regras completas: [`docs/Compilado - Old Infærnum.md`](Compilado%20-%20Old%20Inf%C3%A6rnum.md)

**Status atual:** Fase 0 (Documentação) — nenhum código ainda.

---

## Visão

Criar um sistema Foundry VTT instalável que:

1. Implementa fielmente as mecânicas de Old Infærnum (3d6, sorte/azar, desgraças, Cavaleiros, suplementos).
2. Suporta solo, cooperativo e guiado por mestre.
3. É desenvolvido iterativamente em 10 fases (0–9), cada uma entregando algo jogável.
4. Qualquer LLM (Claude, Codex, Antigravity) consegue continuar de onde parou lendo os docs deste repo.

---

## Estrutura de documentos

| Doc | Papel |
|-----|-------|
| **PLANEJAMENTO.md** ← você está aqui | Visão geral, escopo, critérios |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Stack, estrutura de diretórios, convenções de código |
| [RULES-MAPPING.md](RULES-MAPPING.md) | Cada regra do PDF → DataModel / Item / Hook / Action |
| [ROADMAP.md](ROADMAP.md) | Fases 0–9 com Definition-of-Done |
| [DEV-WORKFLOW.md](DEV-WORKFLOW.md) | Branches, commits, PRs, deploy local, handoffs |
| [LLM-COLLABORATION.md](LLM-COLLABORATION.md) | Como Claude/Codex/Antigravity usam este repo |
| [HANDOFF-TEMPLATE.md](HANDOFF-TEMPLATE.md) | Template para passagem de contexto entre sessões |
| [TESTING.md](TESTING.md) | Testes manuais + Quench por fase |
| [GLOSSARIO.md](GLOSSARIO.md) | PT-BR ↔ FVTT ↔ código (evita deriva linguística) |
| [COMPENDIUMS.md](COMPENDIUMS.md) | Design dos packs compendium |
| [UX-SHEETS.md](UX-SHEETS.md) | Wireframes das fichas |
| [CHANGELOG.md](CHANGELOG.md) | Histórico de versões |

---

## Escopo do sistema

### Actor Types (4)
- `personagem` — PC com sorte/azar/tralhas/bênção/desgraças/tormentos/maldição/paranoias/almas
- `caido` — NPC inimigo com dificuldade
- `colosso` — inimigo gigantesco (mecânica de cartas)
- `grupo` — tracker compartilhado: dia 1–7, presságios, Cavaleiros anunciados

### Item Types (11)
`tralha` · `bencao` · `salvacao` · `ritual` · `pacto` · `tormento` · `maldicao` · `paranoia` · `fenda` · `territorio` · `dominio`

### Suplementos a implementar (Fases 6–8)
Fendas, Colossos, Paranoias, Pactos, Almas, Territórios, Domínios, Arcanos, Infærnaculum (modo cartas), Cyfærnum (cenário)

---

## Critérios de sucesso — v1.0.0

- [ ] Ficha de personagem completa e jogável
- [ ] Motor 3d6 com sorte/azar/tormento/maldição funcionando
- [ ] Desgraças acumulam; Cavaleiro aparece aos 6; maldição aplicada
- [ ] Grupo tracker com dia e presságios
- [ ] Caído com dificuldade redutível via chat
- [ ] Todos os suplementos principais implementados (Fases 6–8)
- [ ] Compendium com todas as tabelas do livro
- [ ] Build instalável em Foundry v13/v14
- [ ] CI verde (lint + release zip)

---

## Decisões de design

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Data layer | TypeDataModel (v13+) | Tipagem, validação, sem template.json legado |
| Sheet API | ActorSheetV2 + HandlebarsApplicationMixin | Padrão moderno, igual ao `fractal-foundry-vtt` |
| CSS | Sass → CSS compilado | Variáveis, mais fácil de manter |
| Bundler | Nenhum inicialmente | ES modules puros; adicionar Vite só se necessário |
| Testes | Quench (runtime FVTT) | Integração real, sem mock de engine |
| Compendiums | fvtt-cli (LevelDB) | Padrão oficial v12+ |
| Língua principal | PT-BR | Jogo e público primário em português |

---

## Decisões em aberto (resolver na Fase 0)

1. **Licença** — confirmar com Raul Volpato antes de publicar compendiums com texto das regras.
2. **dice-so-nice** — integração opcional (world setting).
3. **i18n en.json** — defer para Fase 9.

---

## Referências de arquitetura

Projetos de referência em `docs/`:
- [`fractal-foundry-vtt/`](fractal-foundry-vtt/) — arquitetura a espelhar (TypeDataModel, sheets, CI)
- [`assimilacao-sistema-nao-oficial/`](assimilacao-sistema-nao-oficial/) — protocolo de handoff multi-agente a adotar
