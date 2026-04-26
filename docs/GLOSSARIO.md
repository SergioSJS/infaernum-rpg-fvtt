# Glossário

> Termos do jogo (PT-BR) ↔ termos no código ↔ termos FVTT.
> Consultar antes de nomear qualquer campo, função ou arquivo.

---

## Termos do Jogo → Código

| Termo PT-BR | Código (campo/tipo) | Notas |
|-------------|---------------------|-------|
| **Sorte** | `PersonagemData.sorte` | StringField; melhor habilidade do personagem |
| **Azar** | `PersonagemData.azar` | StringField; pior habilidade |
| **Segundo azar** | `PersonagemData.segundo_azar` | BooleanField; ativado com 3ª paranoia |
| **Desgraça** | resultado `1` em 3d6; `PersonagemData.desgracas` (contador) | `desgracas` no código |
| **Acontecimento neutro** | resultado `2` ou `3` em 3d6 | `neutros` |
| **Façanha** | resultado `4` ou `5` em 3d6 | `facanhas` |
| **Milagre** | resultado `6` em 3d6 | `milagres` |
| **Morte** | três resultados `6` em 3d6 | `morte: boolean` |
| **Grande Milagre** | três 6s + queimar 3 presságios | `grande_milagre: boolean` |
| **Tormento** | Item type `tormento`; Active Effect flag `infaernum.tormento` | Temporário; funciona como azar |
| **Maldição** | Item type `maldicao`; Active Effect permanente | Perpétua; funciona como tormento |
| **Tralhas** | Item type `tralha` | Equipamentos narrativos |
| **Bênção** | Item type `bencao` | Item mágico; ativa com ≥1 milagre (6) |
| **Salvação** | Item type `salvacao` | Artefato de Fenda; ativa com 2 milagres |
| **Ritual** | Item type `ritual` | Absorvido de Colosso; ativa com 2 milagres |
| **Pacto** | Item type `pacto` | Entidade + dádiva + dívida |
| **Dádiva** | `PactoData.dadiva` | Benefício diário do pacto |
| **Dívida** | `PactoData.divida` | Custo diário do pacto |
| **Paranoia** | Item type `paranoia` | Máx 3; 3ª ativa `segundo_azar` |
| **Presságio** | `GrupoData.presagios_atuais` (pool diário) | Pool do grupo, não individual |
| **Caído** | Actor type `caido` | Inimigo/monstro |
| **Colosso** | Actor type `colosso` | Senhor das Profundezas; usa cartas |
| **Fenda** | Item type `fenda` | Masmorra/dungeon procedural |
| **Território** | Item type `territorio` | Carta de mapa (suplemento Territórios) |
| **Domínio** | Item type `dominio` | Zona controlada por Cavaleiro |
| **Alma** | `PersonagemData.almas` (contador) | Absorvida de caído; pode ser queimada |
| **Súplica** | missão/contrato no quadro de orações | Sem item type; narrativo |
| **Arcano** | entrada em `module/tables/arcanos.mjs` | 22 arcanos maiores do tarô |
| **Movimento de alteração** | `PersonagemData.movimentos_alteracao` | Para personalizar personagem |
| **Presságio queimado** | decrementar `presagios_atuais` | Burn, não delete |
| **Alma queimada** | decrementar `almas` | Shift resultado de rolagem |

---

## Os 4 Cavaleiros

| Português | Código | Naipe (Domínios/Infærnaculum) |
|-----------|--------|-------------------------------|
| A Peste | `"peste"` | ♦ Ouros |
| A Guerra | `"guerra"` | ♠ Espadas |
| A Fome | `"fome"` | ♥ Copas |
| A Morte | `"morte"` | ♣ Paus |

---

## Naipes (cartas)

| Naipe | Código | Uso em Colossos | Uso em Territórios | Uso em Infærnaculum |
|-------|--------|----------------|--------------------|---------------------|
| ♠ Espadas | `"espadas"` | desgraça-espadas | águas | façanha |
| ♥ Copas | `"copas"` | desgraça-copas | pessoas | milagre |
| ♦ Ouros | `"ouros"` | desgraça-ouros | clima | neutro |
| ♣ Paus | `"paus"` | desgraça-paus | vegetação | desgraça |

---

## Actor Types

| Tipo | Código | Descrição |
|------|--------|-----------|
| Personagem | `personagem` | PC (player character) |
| Caído | `caido` | NPC inimigo |
| Colosso | `colosso` | Inimigo gigantesco |
| Grupo | `grupo` | Tracker compartilhado do grupo |

---

## Item Types

| Tipo | Código | Descrição |
|------|--------|-----------|
| Tralha | `tralha` | Equipamento narrativo |
| Bênção | `bencao` | Item mágico inicial |
| Salvação | `salvacao` | Artefato de Fenda |
| Ritual | `ritual` | Absorvido de Colosso |
| Pacto | `pacto` | Acordo com entidade |
| Tormento | `tormento` | Aflição temporária |
| Maldição | `maldicao` | Curse permanente de Cavaleiro |
| Paranoia | `paranoia` | Perturbação mental (máx 3) |
| Fenda | `fenda` | Dungeon procedural |
| Território | `territorio` | Carta de mapa |
| Domínio | `dominio` | Zona de Cavaleiro |

---

## Cenários

| Cenário | Código | Descrição |
|---------|--------|-----------|
| Padrão | `"padrao"` | Profecia completa, 7 dias |
| Domínios | `"dominios"` | Profecia parcial, Cavaleiros já manifestados |
| Cyfærnum | `"cyfaernum"` | Cyberpunk, megacorporações = Cavaleiros |
| Customizado | `"custom"` | GM define regras |

---

## Termos Cyfærnum (remapeamentos de cenário)

| Termo padrão | Cyfærnum |
|--------------|---------|
| Caído | Agente |
| Alma | Download de sistema |
| Presságio | Reboot |
| Terra Prometida | Cura do mundo antigo |
| Cavaleiros | Megacorporações |

---

## Termos FVTT

| Conceito FVTT | Uso neste sistema |
|---------------|-------------------|
| `Actor` | `personagem`, `caido`, `colosso`, `grupo` |
| `Item` (embedded) | `tralha`, `bencao`, `tormento`, `maldicao`, `paranoia`, `pacto`, `salvacao`, `ritual` |
| `Item` (world) | `fenda`, `territorio`, `dominio` |
| `ActiveEffect` | Tormentos e maldições (flag, não modificador numérico) |
| `RollTable` | Tabelas de sorte, azar, tralhas, bênçãos, paranoias, etc. |
| `JournalEntry` | Lore dos Cavaleiros, cenário Cyfærnum |
| `Macro` | Roll 1d6/2d6, Arcanos, Explorar Território, Virar Dia |
| `ChatMessage` | Resultados de rolagem, encontro com Cavaleiro |
| `DialogV2` | Diálogos de ação, presságio, alma, Cavaleiro |

---

## Abreviações usadas no código

| Abrev | Significado |
|-------|-------------|
| `inf` | `infaernum` (prefixo CSS e namespace) |
| `PNJ` | Personagem não-jogador (NPC) |
| `PC` | Player Character (personagem jogador) |
| `AE` | Active Effect |
| `HBS` | Handlebars (templates .hbs) |
| `DM` | DataModel (TypeDataModel) |
| `HUD` | Heads-Up Display (painel lateral) |
