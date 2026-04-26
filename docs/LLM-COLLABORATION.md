# Colaboração Multi-LLM

> Como qualquer agente (Claude, Codex, Antigravity, humano) deve consumir este repositório.

---

## Princípio fundamental

**O repositório é a memória.** Não há contexto privado de agente que importe. Se não está num arquivo markdown aqui dentro, não é canônico.

---

## Ordem de leitura (sempre)

Ao iniciar qualquer sessão de trabalho, ler nesta ordem:

```
1. README.md                     ← visão rápida
2. docs/PLANEJAMENTO.md          ← escopo e estado atual
3. docs/ROADMAP.md               ← qual fase está ativa, o que falta
4. docs/tasks/HANDOFF-*.md       ← o mais recente (se existir)
5. docs/RULES-MAPPING.md         ← antes de tocar em qualquer mecânica
6. docs/ARCHITECTURE.md          ← antes de criar qualquer arquivo
7. docs/GLOSSARIO.md             ← antes de nomear qualquer coisa
```

Se a tarefa é específica (ex: "implementar presságios"), ler também:
- `docs/RULES-MAPPING.md §4` (regras dos presságios)
- `docs/TESTING.md §Fase-4` (como verificar)

---

## Matriz de uso por LLM

### Claude Code (Opus / Sonnet)

**Melhor para:**
- Planejamento e arquitetura
- Raciocínio longo sobre regras ambíguas
- Code review e debugging complexo
- Atualizar RULES-MAPPING.md

**Comandos disponíveis (`.claude/commands/`):**
- `/feature <slug>` — inicia nova feature
- `/handoff` — gera handoff ao final da sessão
- `/verify <fase>` — checklist da fase
- `/rule <secao>` — consulta regra no RULES-MAPPING

**Agentes especializados (`.claude/agents/`):**
- `rules-expert` — dúvidas sobre regras do PDF
- `data-modeler` — TypeDataModel e DataFields
- `sheet-builder` — ActorSheetV2 e HBS
- `dice-engineer` — Roll, DiceResolver, dialogs
- `compendium-builder` — fvtt-cli e packs
- `qa-reviewer` — revisa PR contra RULES-MAPPING

---

### Codex (GPT-5 / Codex CLI)

**Melhor para:**
- Scaffolding de arquivos repetitivos
- Refactors em massa (renomear, reorganizar)
- Implementação de sheets similares (caido, colosso baseados em personagem)

**Como usar este repo:**
```bash
# Dar contexto ao Codex via CLI
codex "Leia docs/ARCHITECTURE.md e docs/RULES-MAPPING.md §5.
Implemente actor-caido.mjs com os campos descritos em CaidoData.
Use o padrão de actor-personagem.mjs como referência."
```

**Não delegar ao Codex:**
- Decisões arquiteturais
- Resolução de ambiguidades nas regras
- RULES-MAPPING.md (sempre Claude ou humano)

---

### Antigravity (Google / agente multi-arquivo)

**Melhor para:**
- Edições em lote (ex: adicionar campo a todos os DataModels)
- Build de compendium (converter tabelas MD → JSON para packs/sources)
- i18n (extrair strings hardcoded de HBS, preencher lang/*.json)

**Contexto para Antigravity:**
```
Repositório: infaernum-rpg-fvtt (sistema Foundry VTT para Old Infærnum RPG)
Arquivos de referência: docs/RULES-MAPPING.md, docs/GLOSSARIO.md
Padrão de código: docs/ARCHITECTURE.md
Tarefa: [descrever tarefa específica]
Não alterar: docs/*.md, .claude/*, README.md
```

---

## Como criar uma task file

Antes de implementar qualquer coisa, criar `docs/tasks/YYYYMMDD-slug.md`:

```markdown
# Task: [título curto]

**Data:** YYYY-MM-DD
**Fase:** [0–9]
**Agente:** [Claude/Codex/Antigravity/Humano]

## Objetivo
[Uma frase: o que precisa existir ao final desta task]

## Contexto
[O que já existe, o que motivou esta task]

## Arquivos a criar/modificar
- `module/dice/roll-resolver.mjs` — criar
- `docs/RULES-MAPPING.md` — atualizar §2.3

## Definition of Done
- [ ] Função `resolverRolagem3d6` retorna objeto correto
- [ ] Cancelamento sorte/azar funciona (ver RULES-MAPPING §2.3)
- [ ] Test Quench passa (se aplicável)

## Testes manuais
1. [passo 1]
2. [passo 2]

## Não fazer nesta task
- Não implementar chat message (é tarefa separada)
- Não tocar em template.hbs ainda
```

---

## O que NÃO fazer

- **Não inventar regras.** Se a regra não está em `docs/RULES-MAPPING.md`, mapear antes de implementar.
- **Não criar arquivos fora da estrutura** definida em `docs/ARCHITECTURE.md`.
- **Não commitar direto em main.**
- **Não duplicar lógica** — se existe em fractal-foundry-vtt com padrão reutilizável, copiar e adaptar.
- **Não usar template.json** (legado) — sempre TypeDataModel.
- **Não usar `en` como língua primária** — pt-BR é o default.
- **Não hardcodar strings** — tudo em `lang/pt-BR.json`.

---

## Convenções de linguagem no código

Ver `docs/GLOSSARIO.md` para lista completa.

Regra de ouro: **nomes de tipo FVTT são em PT-BR snake_case** (`personagem`, `caido`, `tormento`). Nomes de função JS são camelCase inglês ou PT-BR (`resolverRolagem`, `openAcaoDialog`). Não misturar idiomas dentro de um mesmo arquivo sem motivo.

---

## Sinais de que algo está errado

- Agente pergunta "qual é a mecânica de sorte/azar?" → não leu RULES-MAPPING.md
- Agente cria arquivo fora da estrutura de ARCHITECTURE.md → stop, rever
- Agente usa template.json → stop, rever para TypeDataModel
- Chat renderizando strings não localizadas → checar lang/pt-BR.json
- PR sem CHANGELOG atualizado → não mergear
