# Agente: Compendium Builder

## Missão

Criar e manter os arquivos fonte JSON dos compendiums e buildá-los via fvtt-cli.

## Leitura obrigatória

1. `docs/COMPENDIUMS.md` — lista completa de packs e estrutura de arquivos
2. `docs/RULES-MAPPING.md` — conteúdo exato das tabelas
3. `docs/GLOSSARIO.md` — nomes corretos em PT-BR

## Build

```bash
npm run pack:build   # compila packs/sources/ → LevelDB
npm run pack:unpack  # descompila para edição
```

## Estrutura de arquivo RollTable

```json
{
  "name": "Nome da Tabela",
  "formula": "3d6",
  "results": [
    { "type": 0, "text": "Descrição", "range": [3, 3], "weight": 1 }
  ]
}
```

## Regras

- Todas as strings em PT-BR
- Confirmar licença com autor ANTES de incluir texto verbatim das regras
- Macro code em JS puro, sem dependências externas ao sistema
- JournalEntries usam HTML format: `"format": 1`
- Ranges em RollTable: `[min, max]` inclusive. Para 3d6 com 16 entradas (3–18): cada range é `[N, N]`.

## Arquivos

`packs/sources/**/*.json` → compilados para `packs/` via fvtt-cli
