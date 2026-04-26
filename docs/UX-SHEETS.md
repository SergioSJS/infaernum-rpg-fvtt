# Wireframes das Fichas

> Layouts textuais das sheets. Base para implementação HBS + CSS.
> Não é visual final — é especificação de estrutura e interação.

---

## Ficha do Personagem (`personagem`)

**Dimensões:** 680 × 720 px

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                   │
│  [Avatar 80x80]  [Nome do Personagem        ] [botões]  │
│                  [Rolar Ação] [Pergunta 1d6] [Ideias]   │
├──────────────────────────┬──────────────────────────────┤
│ COLUNA ESQUERDA          │ COLUNA DIREITA               │
│                          │                              │
│  SORTE                   │  DESGRAÇAS                   │
│  ┌──────────────────┐    │  ● ● ● ○ ○ ○   (clicáveis)  │
│  │ [texto livre]    │    │  [0/6]                       │
│  └──────────────────┘    │                              │
│                          │  ALMAS                       │
│  AZAR                    │  [−] [ 3 ] [+]               │
│  ┌──────────────────┐    │                              │
│  │ [texto livre]    │    │  PRESSÁGIOS (link ao grupo)  │
│  └──────────────────┘    │  ● ● ● ○ ○   [queimar]      │
│                          │                              │
├──────────────────────────┴──────────────────────────────┤
│ BÊNÇÃO                                                   │
│  [ícone] [Nome da bênção] — [descrição curta]           │
│          [Efeito: ativa com 1 milagre]                  │
├─────────────────────────────────────────────────────────┤
│ TRALHAS                                  [+ Adicionar]  │
│  • [nome tralha 1]                       [×]            │
│  • [nome tralha 2]                       [×]            │
│  • [nome tralha 3]                       [×]            │
├─────────────────────────────────────────────────────────┤
│ TORMENTOS                                [+ Adicionar]  │
│  ⚠ [descrição tormento 1]    [grave?●]  [×]            │
│  ⚠ [descrição tormento 2]               [×]            │
├─────────────────────────────────────────────────────────┤
│ MALDIÇÃO (aparece apenas se existir)                     │
│  ☠ [Cavaleiro] — [descrição maldição]  PERPÉTUA        │
├─────────────────────────────────────────────────────────┤
│ PARANOIAS (aparece se existir)           [+ Adicionar]  │
│  🌀 [descrição paranoia 1]                              │
│  🌀 [descrição paranoia 2]                              │
│  [SEGUNDO AZAR ATIVO] — badge vermelho se 3ª paranoia   │
├─────────────────────────────────────────────────────────┤
│ PACTOS (aparece se existir)                             │
│  📜 [Nome entidade] | Dádiva: [desc] | Dívida: [desc]  │
│     [Usar Dádiva ✓/×]  [Dívida paga ✓/×]              │
├─────────────────────────────────────────────────────────┤
│ SALVAÇÕES / RITUAIS                                     │
│  ✦ [Nome salvação] — 2 milagres para ativar            │
│  ✦ [Nome ritual]   — 2 milagres para ativar            │
├─────────────────────────────────────────────────────────┤
│ ANOTAÇÕES                                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [Editor HTML]                                    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Interações:**
- Desgraças: click na bolinha N → `desgracas = N`; click em bolinha já marcada → `desgracas = N-1`
- Almas: `[−]` decrements até 0, `[+]` incrementa
- Tralhas: clique no nome → abre item sheet; `[×]` remove
- Tormentos: `[grave?●]` toggle; `[×]` remove
- Bênção: drag de item `bencao` para a seção
- Dádiva do Pacto: `[Usar Dádiva]` → seta flag `dadiva_usada_hoje`; desabilita até virar dia

---

## Ficha do Caído (`caido`)

**Dimensões:** 480 × 520 px

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                   │
│  [Avatar 64x64]  [Nome do Caído            ]            │
│                  [Tipo: Caído / Colosso menor]          │
├─────────────────────────────────────────────────────────┤
│ DIFICULDADE                                             │
│  ████████░░  [4 / 10]                                   │
│  [reduzir −1] [reduzir −2] [zerar]                      │
│                                                         │
│  [Absorver Alma] ← só visível quando dificuldade = 0   │
├─────────────────────────────────────────────────────────┤
│ DESCRIÇÃO / APARÊNCIA                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [Texto livre]                                    │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│ HABILIDADES                             [+ Adicionar]  │
│  • [habilidade 1]                            [×]        │
│  • [habilidade 2]                            [×]        │
├─────────────────────────────────────────────────────────┤
│ TORMENTOS QUE CAUSA               [+ Adicionar]        │
│  • [descrição tormento causado 1]       [×]            │
│  • [descrição tormento causado 2]       [×]            │
└─────────────────────────────────────────────────────────┘
```

**Interações:**
- Barra de dificuldade: visual apenas; reduzida via botões ou chat
- `[reduzir −1]` → façanha manual; `[reduzir −2]` → milagre manual
- `[Absorver Alma]` → só aparece com `dificuldade_atual === 0`; clique como personagem selecionado

---

## Ficha do Colosso (`colosso`)

**Dimensões:** 720 × 680 px

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                   │
│  [Avatar 80x80]  [Nome do Colosso           ]           │
│                  Dificuldade Total: [16 / 16]           │
├─────────────────────────────────────────────────────────┤
│ PARTES DO COLOSSO                                       │
│  • [Pata Dianteira Dir.]  ████░░  [3/4]  [−1][−2]      │
│  • [Pata Dianteira Esq.]  ████░░  [4/4]  [−1][−2]      │
│  • [Cabeça]               ████░░  [5/8]  [−1][−2]      │
│  • [Corpo]                ████░░  [0/0]  ✓ SUPERADO    │
├─────────────────────────────────────────────────────────┤
│ DESGRAÇAS POR NAIPE (habilidades do colosso)            │
│  ♠ Espadas: [descrição da desgraça espadas]             │
│  ♥ Copas:   [descrição da desgraça copas]               │
│  ♦ Ouros:   [descrição da desgraça ouros]               │
│  ♣ Paus:    [descrição da desgraça paus]                │
├─────────────────────────────────────────────────────────┤
│ GRID DE CARTAS (posições dos personagens)               │
│                                                         │
│     [♠ 7]         [♥ K]                                │
│   [JOGADOR A]                                           │
│                 [♦ 3]         [♣ A]                    │
│               [JOGADOR B]   [JOGADOR C]                 │
│                                                         │
│  Legenda: carta revelada = naipe+valor visível          │
│           carta oculta = [?]                            │
│  Drag jogador entre cartas para reposicionar            │
├─────────────────────────────────────────────────────────┤
│ AO DERROTAR                                             │
│  [Absorver Ritual — 1 por personagem]                   │
│  Naipe da carta ao derrotar = desgraça absorvida        │
└─────────────────────────────────────────────────────────┘
```

---

## Ficha do Grupo (`grupo`)

**Dimensões:** 480 × 400 px

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                   │
│  [Avatar]  [Nome do Grupo / Campanha]                   │
├─────────────────────────────────────────────────────────┤
│ DIA ATUAL                                               │
│                                                         │
│  ○ ● ○ ○ ○ ○ ○    (DIA II de VII)                      │
│  [← Voltar] [Avançar Dia →]                             │
│                                                         │
│  "Faltam 5 dias para o fim de todas as coisas."         │
├─────────────────────────────────────────────────────────┤
│ PRESSÁGIOS DO DIA                                       │
│                                                         │
│  ● ● ● ○ ○  [3 / 5]                                    │
│  [Rolar Presságios do Dia]  [Queimar 1 Presságio]       │
├─────────────────────────────────────────────────────────┤
│ CAVALEIROS ANUNCIADOS                                   │
│  [Dia II] ☠ A PESTE                                     │
│  [Dia III] ⚔ A GUERRA                                  │
│  [Dia IV]  👁 —                                         │
│  [Dia V]   💀 —                                         │
├─────────────────────────────────────────────────────────┤
│ CENÁRIO ATIVO                                           │
│  [Padrão ▾]  → Domínios / Cyfærnum / Custom            │
└─────────────────────────────────────────────────────────┘
```

**HUD Lateral (clock-panel):**
```
[INF] Dia II  ● ● ● ○ ○  [⚔ ☠ _ _]
```
Exibido no sidebar do Foundry quando ator `grupo` existe.

---

## Item Sheet (genérica)

**Dimensões:** 400 × 360 px

```
┌───────────────────────────────────────────┐
│ [Avatar]  [Nome do Item           ]       │
│           [Tipo: tormento          ]      │
├───────────────────────────────────────────┤
│ DESCRIÇÃO                                 │
│ ┌───────────────────────────────────┐    │
│ │ [Editor HTML]                     │    │
│ └───────────────────────────────────┘    │
├───────────────────────────────────────────┤
│ CAMPOS ESPECÍFICOS DO TIPO                │
│ (variam: ex. tormento tem toggle "grave") │
└───────────────────────────────────────────┘
```

---

## Chat Message — Rolagem 3d6

```
┌─────────────────────────────────────────────────────────┐
│ [Avatar] NOME DO PERSONAGEM             HH:MM           │
│                                                         │
│  Ação: "Atacar o caído com a pá"                        │
│                                                         │
│  ┌──┐  ┌──┐  ┌──┐                                       │
│  │ 1│  │ 5│  │ 6│                                       │
│  └──┘  └──┘  └──┘                                       │
│  DES.  FAÇ. MIL.                                        │
│                                                         │
│  Sorte ativa: ●                                         │
│  → 1 cancelado por milagre                              │
│                                                         │
│  Resultado: 1 Façanha · 1 Milagre                       │
│                                                         │
│  [Queimar Presságio] [Queimar Alma] [Aplicar Desafio]  │
└─────────────────────────────────────────────────────────┘
```

**Cores dos dados:**
- 1 (desgraça): vermelho escuro; se cancelado: vermelho tachado/translúcido
- 2–3 (neutro): cinza
- 4–5 (façanha): dourado
- 6 (milagre): branco/ouro brilhante; se cancelado: tachado

---

## Diálogo de Ação (roll-action)

```
┌─────────────────────────────────────────────────────────┐
│ Rolagem de Ação — NOME DO PERSONAGEM                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  O que você pretende fazer?                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [input texto livre]                              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Influências:                                           │
│  ☐ Aplicar Sorte: "Resistir e defender a qualquer       │
│    custo" — milagres (6) anulam desgraças (1)          │
│                                                         │
│  ☐ Aplicar Azar: "Travar embates físicos" —            │
│    desgraças (1) anulam milagres (6)                   │
│                                                         │
│  Tormentos ativos:                                      │
│  ☐ "Ferimento na perna" — aplica como azar             │
│  ☐ "Hemorragia no braço" — aplica como azar            │
│                                                         │
│  Maldição: "Suando sangue" (A GUERRA) — ativa          │
│                                                         │
│  Preview: rolando 3d6                                   │
│                                                         │
│  [Cancelar]                      [🎲 Rolar Ação]       │
└─────────────────────────────────────────────────────────┘
```

**Notas:**
- Sorte e Azar são mutuamente exclusivos (selecionar um desabilita o outro)
- Maldição sempre ativa se existir (não tem checkbox — é automática)
- Preview mostra apenas "3d6" (não muda com influências — a influência muda o cálculo pós-rolagem, não a quantidade de dados)
