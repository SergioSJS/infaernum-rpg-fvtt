# Old Infærnum — Foundry VTT System

> Memória do projeto. Apenas pointers — conteúdo vive em docs/.

## Leitura obrigatória antes de qualquer trabalho

1. `docs/PLANEJAMENTO.md` — visão geral e estado atual
2. `docs/ROADMAP.md` — fase ativa + DoD
3. `docs/tasks/HANDOFF-*.md` — o mais recente (se existir)
4. `docs/RULES-MAPPING.md` — antes de tocar em mecânica
5. `docs/ARCHITECTURE.md` — antes de criar arquivo
6. `docs/GLOSSARIO.md` — antes de nomear qualquer coisa

## Estado atual

**Fase:** 0 — Fundação & Documentação
**Versão:** 0.0.1
**Próxima milestone:** Fase 1 — Ficha de Personagem (0.1.0)

## Convenções rápidas

- IDs e tipos de actor/item: **PT-BR snake_case** (`personagem`, `caido`, `tormento`)
- Prefixo CSS: `--inf-*` e `.inf-*`
- i18n namespace: `INFAERNUM.*`
- Commits: Conventional Commits
- Língua primária: `lang/pt-BR.json`
- **Não usar template.json** — sempre TypeDataModel
- **Não commitar em main** — sempre feature branch

## Agentes disponíveis

Ver `.claude/agents/` para briefings de agentes especializados.

## Comandos disponíveis

- `/feature <slug>` — inicia feature com task file + branch
- `/handoff` — gera HANDOFF.md ao fim da sessão
- `/verify <fase>` — checklist da fase (ex: `/verify 2`)
- `/rule <secao>` — consulta regra no RULES-MAPPING

## Regras do jogo (resumo)

3d6 por ação. 1=desgraça, 2-3=neutro, 4-5=façanha, 6=milagre, 666=morte.
Sorte: milagres anulam desgraças. Azar/tormento/maldição: desgraças anulam milagres.
6 desgraças = encontro com Cavaleiro + maldição. Segunda vez = morte.
Presságios: pool diário do grupo para rerrolar dados (1d6 → 4-6 presságios).
Almas: coletadas de caídos, queimadas para shift de resultado.

PDF completo: `docs/Compilado - Old Infærnum.md`
