Inicia uma nova feature para o sistema Old Infærnum Foundry VTT.

**Argumento:** nome/slug da feature (ex: `fase-2-motor-dados`, `fix-desgracas-tracker`)

**O que fazer:**

1. Identificar a fase atual em `docs/ROADMAP.md`
2. Criar branch: `feat/$ARGUMENTS` (ou `fix/$ARGUMENTS` se for correção)
3. Criar task file `docs/tasks/$(date +%Y%m%d)-$ARGUMENTS.md` com esta estrutura:

```markdown
# Task: $ARGUMENTS

**Data:** $(date +%Y-%m-%d)
**Fase:** [número da fase]
**Branch:** feat/$ARGUMENTS

## Objetivo
[Uma frase clara]

## Contexto
[O que já existe, o que motivou]

## Arquivos a criar/modificar
- [lista]

## Definition of Done
- [ ] [item 1]
- [ ] [item 2]

## Testes manuais
1. [passo]

## Não fazer nesta task
- [limitações de escopo]
```

4. Mostrar o task file criado e confirmar branch ativa com `git branch`.

**Não iniciar implementação** — apenas preparar estrutura.
