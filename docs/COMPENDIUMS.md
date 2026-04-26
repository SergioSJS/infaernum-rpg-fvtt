# Design de Compendiums

## Visão Geral

Packs FVTT compilados via `@foundryvtt/foundryvtt-cli`. Fontes em `packs/sources/` (JSON versionado). Build: `npm run pack:build`.

**Importante:** Antes de incluir texto das regras nos compendiums, confirmar licença com Raul Volpato.

---

## Packs Planejados

### `infaernum.cavaleiros`

**Tipo:** JournalEntry  
**Fase:** 3  
**Arquivos fonte:** `packs/sources/cavaleiros/*.json`

| Entrada | Conteúdo |
|---------|---------|
| A Peste | Descrição narrativa + tabela de 6 maldições + tabela de 6 eventos |
| A Guerra | idem |
| A Fome | idem |
| A Morte | idem |

---

### `infaernum.tabelas`

**Tipo:** RollTable  
**Fase:** 6  
**Arquivos fonte:** `packs/sources/rolltables/*.json`

| Tabela | Fórmula | Entradas | Fase |
|--------|---------|----------|------|
| Quem Você É | `3d6` | 16 entradas (3–18) | 6 |
| Sorte | `3d6` | 16 entradas | 6 |
| Azar | `3d6` | 16 entradas | 6 |
| Tralhas | `3d6` | 16 entradas | 6 |
| Bênçãos | `3d6` | 16 entradas | 6 |
| Salvações | `3d6` | 16 entradas | 6 |
| Paranoias | `3d6` | 16 entradas | 6 |
| Pactos — Dádivas | `3d6` | 16 entradas | 6 |
| Pactos — Dívidas | `3d6` | 16 entradas | 6 |
| Presságios do Dia | `1d6` | 3 entradas (1-2/3-4/5-6) | 4 |
| Verbos (2d6) | — | (implementado via código, não RollTable) | 2 |
| Substantivos (2d6) | — | idem | 2 |
| Caos — Desgraça | `1d6` | 6 entradas | 6 |
| Caos — Neutro | `1d6` | 6 entradas | 6 |
| Caos — Comportamento PNJ | `1d6` | 6 entradas | 6 |
| Caos — Súplica | `1d6` | 6 entradas | 6 |
| Arcanos | — | (implementado via código + tabela estática) | 8 |
| Maldições Peste | `1d6` | 6 entradas | 3 |
| Maldições Guerra | `1d6` | 6 entradas | 3 |
| Maldições Fome | `1d6` | 6 entradas | 3 |
| Maldições Morte | `1d6` | 6 entradas | 3 |
| Eventos Dia VI | `1d6` | 6 entradas | 4 |

---

### `infaernum.macros`

**Tipo:** Macro  
**Fase:** 6  
**Arquivos fonte:** `packs/sources/macros/*.json`

| Macro | Descrição | Fase |
|-------|-----------|------|
| Pergunta 1d6 | Dialog → chat sim/não | 2 |
| Ideias 2d6 | Rola verbo+substantivo | 2 |
| Rolar Ação 3d6 | Abre dialog de ação do personagem selecionado | 2 |
| Virar Dia | Incrementa dia, rola presságios, reseta pactos | 4 |
| Absorver Alma | Soma 1 alma ao personagem selecionado | 5 |
| Rolar Quem Sou | 3d6 na tabela de passado | 6 |
| Rolar Sorte | 3d6 na tabela de sorte | 6 |
| Rolar Azar | 3d6 na tabela de azar | 6 |
| Rolar Tralhas | 3d6 na tabela de tralhas | 6 |
| Rolar Bênção | 3d6 na tabela de bênçãos | 6 |
| Rolar Paranoia | 3d6 na tabela de paranoias + cria item | 6 |
| Firmar Pacto | Wizard: invocação 3d6 + sorteio dádiva/dívida + cria item | 6 |
| Explorar Fenda | Rola desafios → sequência até salvação | 6 |
| Explorar Território | Simula draw de carta + cria item territorio | 8 |
| Puxar Arcano | Dialog 1-3 cartas → chat com verbo/substantivo/adjetivo | 8 |

---

### `infaernum.cenarios`

**Tipo:** JournalEntry  
**Fase:** 8  
**Arquivos fonte:** `packs/sources/cenarios/*.json`

| Entrada | Conteúdo |
|---------|---------|
| Cyfærnum | Regras completas do cenário cyberpunk |
| Guia de Campanha | Estrutura dos 7 dias + sugestões de GM |

---

## Estrutura de arquivo fonte (RollTable)

```json
{
  "name": "Sorte",
  "formula": "3d6",
  "replacement": true,
  "displayRoll": true,
  "description": "Role 3d6 e descubra no que seu personagem é melhor que a média.",
  "results": [
    {
      "type": 0,
      "text": "Manifestar milagres climáticos.",
      "img": "",
      "weight": 1,
      "range": [3, 3],
      "drawn": false
    },
    {
      "type": 0,
      "text": "Promover a cura, prestar auxílios milagrosos.",
      "img": "",
      "weight": 1,
      "range": [4, 4],
      "drawn": false
    }
    // ... demais entradas
  ]
}
```

---

## Estrutura de arquivo fonte (JournalEntry — Cavaleiro)

```json
{
  "name": "A Peste",
  "pages": [
    {
      "name": "Descrição",
      "type": "text",
      "text": {
        "format": 1,
        "content": "<p>A Peste manifesta sua presença...</p>"
      }
    },
    {
      "name": "Maldições",
      "type": "text",
      "text": {
        "format": 1,
        "content": "<table>...</table>"
      }
    },
    {
      "name": "Eventos do Dia",
      "type": "text",
      "text": {
        "format": 1,
        "content": "<table>...</table>"
      }
    }
  ]
}
```

---

## Build Script

`package.json`:
```json
{
  "scripts": {
    "pack:build": "fvtt package workon infaernum && fvtt package pack",
    "pack:unpack": "fvtt package unpack"
  }
}
```

`.fvtt-config` (na raiz):
```json
{
  "dataPath": "~/Library/Application Support/FoundryVTT/Data",
  "packageType": "system",
  "packageName": "infaernum"
}
```

---

## Notas de implementação

- RollTables com `formula: "3d6"` precisam de entradas com `range` correto (ex: `[3,3]` para resultado 3, `[18,18]` para 18).
- Para tabelas 2d6 (verbos/substantivos), usar código JavaScript direto (`module/tables/`) em vez de RollTable, pois a lógica de "dois resultados por número diferente" não é suportada nativamente.
- Macros devem usar `game.user.targets` ou `canvas.tokens.controlled` para identificar ator alvo.
- Compendiums são buildados ANTES do zip de release no CI.
