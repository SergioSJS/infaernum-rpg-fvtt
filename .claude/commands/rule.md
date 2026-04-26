Consulta uma regra específica no mapeamento de regras do sistema Old Infærnum.

**Argumento:** seção ou termo a buscar (ex: `2.3`, `presagios`, `cavaleiro`, `tormento`)

**O que fazer:**

1. Buscar em `docs/RULES-MAPPING.md` pela seção ou termo $ARGUMENTS
2. Exibir a regra encontrada com:
   - Texto original do livro (quando disponível)
   - Implementação planejada (DataModel, tipo, campos)
   - Status atual (✅ / 🔨 / 📋 / ❓)
3. Se houver ambiguidade marcada com ❓, apresentar as interpretações possíveis

**Se a regra não estiver mapeada:**
1. Buscar em `docs/Compilado - Old Infærnum.md` pelo termo
2. Se encontrar: propor mapeamento e perguntar se deve adicionar ao RULES-MAPPING.md
3. Se não encontrar: informar "regra não encontrada no PDF"

**Não implementar código** — apenas consultar e apresentar.
