Executa o checklist de verificação de uma fase do sistema Old Infærnum Foundry VTT.

**Argumento:** número da fase (ex: `1`, `2`, `3`)

**O que fazer:**

1. Ler `docs/TESTING.md` → seção da Fase $ARGUMENTS
2. Listar cada item do checklist
3. Para cada item que puder verificar via código (sem abrir Foundry):
   - Verificar se os arquivos existem
   - Checar se campos esperados estão no DataModel
   - Checar se chaves i18n existem em `lang/pt-BR.json`
   - Checar se templates HBS existem
4. Marcar cada item como:
   - ✅ Verificado via código
   - 🖥️ Requer teste manual no Foundry
   - ❌ Faltando (arquivo ausente ou campo não encontrado)

5. Mostrar resumo: X de Y itens verificados, Y-X requerem teste manual.

**Ao finalizar:** se todos os itens estão ✅ ou 🖥️ (sem ❌), sugerir PR de fechamento da fase.
Se há ❌: listar o que falta implementar.
