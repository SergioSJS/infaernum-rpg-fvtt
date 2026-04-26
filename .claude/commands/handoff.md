Gera um arquivo de handoff ao final de sessão de trabalho no sistema Old Infærnum Foundry VTT.

**O que fazer:**

1. Executar `git status` e `git diff --stat` para ver o estado atual
2. Executar `git log --oneline -5` para ver commits recentes
3. Ler `docs/ROADMAP.md` para identificar fase ativa e o que falta
4. Criar `docs/tasks/HANDOFF-$(date +%Y%m%d-%H%M).md` seguindo exatamente o template em `docs/HANDOFF-TEMPLATE.md`

**Preencher todas as seções:**
- Estado da fase (fase, branch, versão)
- O que foi feito nesta sessão (arquivos criados/modificados + o que cada um faz)
- O que NÃO foi feito (lista clara de pendências da fase)
- Estado dos arquivos críticos (TODOs, o que está incompleto)
- Próximo passo imediato (instrução concreta para o próximo agente)
- Contexto técnico relevante (detalhes não óbvios)
- Riscos e decisões em aberto
- Git status colado
- Como testar o que foi feito

5. Fazer commit: `git add docs/tasks/ && git commit -m "docs: handoff $(date +%Y%m%d)"`

**Objetivo:** qualquer LLM ou humano deve conseguir continuar sem perguntas adicionais.
