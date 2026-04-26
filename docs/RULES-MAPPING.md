# Mapeamento de Regras → Código

> Documento canônico. Toda divergência entre código e regras é resolvida aqui primeiro.
> Referência de página = `docs/Compilado - Old Infærnum.md`.

---

## Legenda de status

| Status | Significado |
|--------|-------------|
| ✅ Implementado | Código existente e testado |
| 🔨 Em desenvolvimento | Branch aberta |
| 📋 Planejado | Fase definida no ROADMAP |
| ❓ Ambíguo | Regra precisa de interpretação |

---

## 1. Definição de Personagem (p.5–9)

### 1.1 Quem é você? (p.5)

**Regra:** Rola 3d6, consulta tabela (3–18) para descobrir o passado do personagem.

| Resultado | Descrição |
|-----------|-----------|
| 3 | Um invocador que tagarela com caídos |
| 4 | Alguém que já leu o que ainda será escrito |
| 5 | O fervor da divindade antiga, a encarnação da crença morta |
| 6 | Aos olhos dos outros, um louco qualquer |
| 7 | Alguém importante demais para lidar com o trabalho sujo |
| 8 | Astúcia e perspicácia te fizeram sobreviver até aqui |
| 9 | Um escravo, agora livre para continuar lutando |
| 10 | Alguém condenado à forca, salvo pelo prenúncio do fim |
| 11 | Aquele que carrega o peso de muitas mortes |
| 12 | Por algum motivo, um monstro |
| 13 | A justiça de uma única perspectiva |
| 14 | Um conhecedor das profundezas |
| 15 | Alguém que vê o que outros não veem |
| 16 | O servo de um caído que se opõe ao fim de tudo |
| 17 | A chave para um grande acontecimento |
| 18 | Um viajante de sonhos |

**Implementação:** RollTable `packs/sources/rolltables/quem-voce-e.json` (Fase 6)
**DataModel:** `PersonagemData.passado` — `StringField`
**Status:** 📋

---

### 1.2 Sorte — no que você é melhor? (p.6)

**Regra:** Rola 3d6, consulta tabela (3–18). A sorte é a vantagem do personagem — funciona como um "melhor atributo". Em rolagens de 3d6 relacionadas à sorte, cada milagre (6) **anula** uma desgraça (1) da mesma rolagem.

| Resultado | Sorte |
|-----------|-------|
| 3 | Manifestar milagres climáticos |
| 4 | Promover a cura, prestar auxílios milagrosos |
| 5 | Entender e ser compreendido por seres animalescos e bestas |
| 6 | Resistir, defender a qualquer custo, manter-se de pé |
| 7 | Encontrar caminhos e impedir que te encontrem |
| 8 | Causar boas primeiras impressões |
| 9 | Mover-se intensamente, com reflexos anormais |
| 10 | Esquematizar, lidar com armadilhas |
| 11 | Usar força bruta, superar limitações físicas |
| 12 | Perceber minúcias, notar detalhes ocultos |
| 13 | Investigar, usar da intuição para descobrir |
| 14 | Memorizar o que for preciso, gravar na mente |
| 15 | Improvisar, solucionar com o que é inesperado |
| 16 | Mentir, blefar, pintar como quiser a sua verdade |
| 17 | Conhecer e lidar com o oculto |
| 18 | Liderar, influenciar e cativar |

**Implementação:**
- `PersonagemData.sorte` — `StringField` (texto livre ou entrada da tabela)
- `DiceResolver`: param `temSorte: boolean` — cancela desgraças com milagres
- Roll dialog: checkbox "Aplicar sorte?" (desabilitado se ação não relacionada)

**Status:** 📋 Fase 1 (campo), Fase 2 (mecânica)

---

### 1.3 Azar — no que você é pior? (p.6)

**Regra:** Rola 3d6, consulta tabela. Em rolagens afetadas pelo azar, cada desgraça (1) **anula** um milagre (6). Se azar contradiz sorte → rerolar.

| Resultado | Azar |
|-----------|------|
| 3 | Fazer-se compreender |
| 4 | Pensar estrategicamente |
| 5 | Empunhar armas |
| 6 | Travar embates físicos |
| 7 | Esconder-se |
| 8 | Ludibriar, blefar |
| 9 | Lidar com o oculto |
| 10 | Encontrar pistas |
| 11 | Perceber ameaças |
| 12 | Negociar |
| 13 | Agir com rapidez |
| 14 | Ler, discernir sinais ou runas |
| 15 | Entender a natureza |
| 16 | Discernir intenções |
| 17 | Tirar vidas |
| 18 | Sujeitar-se a outras opiniões |

**Implementação:**
- `PersonagemData.azar` — `StringField`
- `PersonagemData.segundo_azar` — `BooleanField` (true após 3ª paranoia)
- Roll dialog: checkbox "Aplicar azar?" (ou auto-aplicado quando GM decide)

**Status:** 📋 Fase 1 (campo), Fase 2 (mecânica)

---

### 1.4 Tralhas — equipamentos iniciais (p.7)

**Regra:** Rola 3d6, obtém kit de itens. Contagem narrativa (sem bookkeeping rígido). Pode fazer perguntas 1d6 sobre disponibilidade de itens.

| Resultado | Tralhas |
|-----------|---------|
| 3 | Um pão quase mofado, um cantil com aguardente e um canivete |
| 4 | Um martelo, alguns pregos e um pequeno espelho |
| 5 | Uma corda com gancho, um saco de dormir e uma capa pesada |
| 6 | Um pequeno livro em branco, tinta e uma pena para escrita |
| 7 | Um jogo com cartas marcadas, um cachimbo e um pouco de fumo |
| 8 | Um frasco de perfume, algumas ervas e uma pedra de amolar |
| 9 | Uma pederneira, algumas tochas e um frasco de óleo |
| 10 | Uma barraca desmontada, uma mochila e um cobertor |
| 11 | Uma panela, alguns vegetais e frascos de temperos variados |
| 12 | Uma pá, um crucifixo e vestes cerimoniais |
| 13 | Um molho de várias chaves, alguns cadeados e um par de algemas |
| 14 | Um mapa de algum lugar, uma bússola e uma garrafa de vinho |
| 15 | Um bestiário com páginas faltando, uma estola e um rosário |
| 16 | Um fêmur humano, a pele de algum animal e pequenos crânios de aves |
| 17 | Um pequeno saco de couro cheio de sal, algumas agulhas e um chifre |
| 18 | Uma coroa de espinhos, algumas velas e um pergaminho com uma gravura |

**Implementação:**
- Item type `tralha`: campos `nome`, `descricao`
- Actor `personagem` tem embedded items do tipo `tralha`
- Macro "Rolar Tralhas" chama RollTable → cria item automaticamente

**Status:** 📋 Fase 1 (campo), Fase 6 (compendium + macro)

---

### 1.5 Bênção — item especial (p.8)

**Regra:** Rola 3d6, obtém item único e mágico. **Requer ao menos 1 milagre (6) para funcionar exatamente conforme esperado** (p.17). Com 1 resultado 6, funciona ao máximo. Sem 6, pode funcionar parcialmente ou não funcionar.

| Resultado | Bênção |
|-----------|--------|
| 3 | Escudo com brasão estranho capaz de invocar relâmpagos |
| 4 | Livro com vontade própria que materializa o que for escrito nele |
| 5 | Marreta com poder de causar tremores |
| 6 | Adaga que permite controlar a alma de quem for estocado por ela |
| 7 | Cruz com dom de repelir caídos |
| 8 | Mangual capaz de acertar golpes que explodem em chamas |
| 9 | Animal possuído por um caído |
| 10 | Espada que fareja sangue |
| 11 | Arco que cria flechas necrotizantes por sua corda retesada |
| 12 | Espelho que mostra a verdade |
| 13 | Chicote que congela o que é envolto por ele |
| 14 | Esfera de vidro que revela o que está por vir |
| 15 | Cetro que comanda o corpo de alguém morto por ele |
| 16 | Tridente capaz de controlar as águas e o que delas emerge |
| 17 | Manto que torna invisível o que cobrir |
| 18 | Tatuagem que ganha vida quando seu sangue é derramado |

**Implementação:**
- Item type `bencao`: `nome`, `descricao`, `efeitoDescricao`
- Flag: `ativavel_com_milagre: true` (sempre para bênção)
- No roll-resolver: detectar se ação tem relação com bênção → interpretar resultado 6 como ativação

**Status:** 📋 Fase 1 (campo), Fase 2 (lógica de ativação em chat)

---

### 1.6 Movimentos de Alteração (p.9)

**Regra:** Ao criar personagem, jogador tem **6 movimentos de alteração** para ajustar resultados nas tabelas. Mover de 9→11 = gasta 2 movimentos (|resultado_novo - resultado_original|). Não acumulam entre jogadores. Só para tabelas de definição de personagem.

**Implementação:**
- `PersonagemData.movimentos_alteracao` — `NumberField({ min: 0, max: 6, initial: 6 })`
- UI: apenas durante criação (flag `PersonagemData.criacao_concluida: BooleanField`)

**Status:** 📋 Fase 1

---

## 2. Mecânica de Dados

### 2.1 Role 1d6 — perguntas (p.10)

**Regra:**
- 1–3 = não
- 4–6 = sim
- 1d6+1 se "sim" mais provável
- 1d6−1 se "não" mais provável
- Intensidade: quanto maior, mais intenso o "sim"; quanto menor, mais intenso o "não"

**Implementação:**
- `InfaernumRoll.roll1d6({ pergunta, modificador })` → `{ dado, resposta, intensidade }`
- Chat template: `templates/chat/roll-1d6.hbs`
- Macro "Pergunta 1d6" — input de pergunta → resultado em chat

**Status:** 📋 Fase 2

---

### 2.2 Role 2d6 — ideias (p.12–14)

**Regra:** Duas rolagens separadas. Primeira = verbo (tabela 6x6). Segunda = substantivo (tabela 6x6). Dois resultados possíveis por número (ex: 2 e 3 = "terminar" e "conquistar" — jogador escolhe). Unir verbo + substantivo e interpretar.

**Tabela de Verbos:**

| 2d6 | 1 | 2 | 3 | 4 | 5 | 6 |
|-----|---|---|---|---|---|---|
| 1 | ignorar | descobrir | começar | bloquear | ganhar | perseguir |
| 2 | julgar | fazer | terminar | vingar | imitar | iludir |
| 3 | esconder | conquistar | aumentar | guiar | oprimir | ajudar |
| 4 | proteger | pacificar | diminuir | expor | emboscar | controlar |
| 5 | mudar | encontrar | tomar | planejar | criar | recusar |
| 6 | conhecer | curar | pausar | perder | trair | aceitar |

**Tabela de Substantivos:**

| 2d6 | 1 | 2 | 3 | 4 | 5 | 6 |
|-----|---|---|---|---|---|---|
| 1 | ambiente | poder | falha | clima | animal | perigo |
| 2 | aliança | problema | atenção | boato | negócio | cilada |
| 3 | inimigo | lar | ferimento | caído | medo | prova |
| 4 | confronto | caminho | ilusão | fé | solidão | vazio |
| 5 | dor | doença | raiva | viagem | esperança | objetivo |
| 6 | mentira | morte | pista | riqueza | verdade | sucesso |

**Implementação:**
- `InfaernumRoll.roll2d6()` → rola 2d6, consulta tabelas, exibe opções
- RollTable `verbos` + RollTable `substantivos` em compendium
- Chat: exibe verbo + substantivo + campo para interpretação

**Status:** 📋 Fase 2

---

### 2.3 Role 3d6 — ações (p.15)

**Regra:** Quando personagem *pretende algo* e não tem certeza do resultado. Rolar 3d6 e observar cada dado individualmente.

| Resultado | Tipo | Efeito |
|-----------|------|--------|
| 1 | Desgraça | Fato negativo na cena; possível tormento |
| 2 ou 3 | Neutro | Fato indefinido ocorre |
| 4 ou 5 | Façanha | Personagem realiza algo relacionado à ação |
| 6 | Milagre | Fato positivo na cena (pode ser doado a outro personagem) |
| 6+6+6 | Morte | Fim definitivo do personagem (exceto: queimar 3 presságios = Grande Milagre) |

**Aplicação de sorte (p.15):** Cada 6 anula um 1 (o 1 é ignorado; o 6 é interpretado normalmente).
**Aplicação de azar/tormento/maldição/3ª paranoia (p.15):** Cada 1 anula um 6.
**Simultâneos (p.17):** Sorte e azar ao mesmo tempo → ambas desconsideradas.

**Façanhas como movimentação (p.23 — regra opcional):**
- Em grid: uma façanha permite mover até 6 quadrados
- Sem grid: até 6 polegadas

**Implementação:**
- `InfaernumRoll.roll3d6({ intencao, temSorte, azarAtivo, tormentosAtivos, maldicaoAtiva })`
- `DiceResolver.resolver3d6(dados, flags)` → `{ desgracas[], neutros[], facanhas[], milagres[], morte }`
- Roll dialog: input ação + toggles influência + preview "Xd6"
- Chat message: exibe dados coloridos + classificação + botões de ação pós-rolagem

**Status:** 📋 Fase 2

---

### 2.4 Morte por Três 6s (p.15)

**Regra:** Três resultados 6 em 3d6 = morte definitiva. Únicos escapes:
1. Queimar 3 presságios imediatamente → Grande Milagre (não é morte)
2. Sem presságios suficientes → personagem morre

**Implementação:**
- `DiceResolver`: flag `morte: boolean`
- Se `morte === true` → diálogo pós-rolagem: "Queimar 3 presságios?" (verifica `grupo.presagios_atuais >= 3`)
- Se não há presságios → chat renderiza mensagem de morte

**Status:** 📋 Fase 2 (detecção), Fase 4 (integração com presságios)

---

## 3. Tormentos e Desgraças

### 3.1 Tormentos (p.15–16)

**Regra:** Causados por desgraças (resultados 1). Funcionam como o azar em termos de regras — em rolagens afetadas por tormentos, cada 1 anula um 6. Tormentos NÃO são perpétuos.

**Remoção de tormento:**
- 1 milagre (6) em ação voltada ao tormento → remove
- 1 façanha (4 ou 5) → ameniza (reescreve como menos grave)
- Façanha que convence NPC curandeiro → remove completamente

**Implementação:**
- Item type `tormento`:
  ```
  descricao: StringField
  grave: BooleanField (false = superficial, true = grave)
  causa: StringField  // descrição narrativa da causa
  ```
- Active Effect no item: flag `infaernum.tormento = true`
- Roll dialog: listar tormentos ativos com checkboxes

**Status:** 📋 Fase 3

---

### 3.2 Contador de Desgraças (p.16)

**Regra:** Cada personagem contabiliza desgraças. Ao acumular **6 desgraças** → encontro com um Cavaleiro (não é morte, mas ganha maldição + zera contador). Segundo acúmulo de 6 desgraças com maldição já ativa → morte definitiva.

**Implementação:**
- `PersonagemData.desgracas` — `NumberField({ min: 0, max: 6, initial: 0 })`
- Hook: quando `desgracas` chega a 6 → trigger `cavaleiroEncounter(actor)`
- Tracker visual na ficha: 6 bolinhas (vazia/preenchida)

**Status:** 📋 Fase 1 (campo), Fase 3 (gatilho)

---

### 3.3 Maldições (p.16)

**Regra:** Adquirida ao encontrar um Cavaleiro (acúmulo de 6 desgraças). Funcionam como tormentos em termos de mecânica (cada 1 anula um 6 em rolagens afetadas). **Perpétuas** — não podem ser removidas.

**Os 4 Cavaleiros e suas maldições (p.24–27):**

#### A PESTE (Dia II, p.24)
| 1d6 | Maldição |
|-----|---------|
| 1 | Língua derrete, torna-se sangue. Pecado jamais virá pela voz. |
| 2 | Tímpanos sangram até que o estampido cesse. Silêncio te acompanhará. |
| 3 | Chagas abrem em cada mão. Feridas jamais se fecharão. |
| 4 | Chagas abrem em cada pé. Sangue perseguirá seus passos. |
| 5 | Cavidades oculares vazam sangue. Pela visão não pecarás. |
| 6 | Todos estão imundos. Você é ferramenta da Peste. |

#### A GUERRA (Dia III, p.25)
| 1d6 | Maldição |
|-----|---------|
| 1 | Um braço separado da vida pelo gume da Guerra. |
| 2 | Uma perna separada da vida pelo gume da Guerra. |
| 3 | Alguém deve morrer sempre. Por suas mãos, a Guerra continuará. |
| 4 | Você passa a suar sangue. A dor será sempre intensa. |
| 5 | Caídos te perseguem para guerrear. Um após o outro, eles sempre virão. |
| 6 | Não há inocentes. Todos devem ser destruídos. |

#### A FOME (Dia IV, p.26)
| 1d6 | Maldição |
|-----|---------|
| 1 | A pior lepra recai sobre você. As marcas do pecado te seguirão. |
| 2 | Nada mais para no estômago. A Fome será eterna. |
| 3 | Cabelos e unhas caem, pele coça e queima numa ardência sangrenta. |
| 4 | Sangue vaza sob a pele formando bolsões de pus. |
| 5 | Um caído faminto te segue como sombra. Será preciso alimentá-lo. |
| 6 | A Fome exige um banquete de almas. Você precisará caçá-las. |

#### A MORTE (Dia V, p.27)
| 1d6 | Maldição |
|-----|---------|
| 1 | Você foi marcado pela Morte. Sua alma permanecerá nesse corpo putrificado. |
| 2 | A cena da sua própria morte te atormenta ao fechar os olhos. |
| 3 | A Terra Prometida não aceitará sua alma, a menos que você mate o Dragão. |
| 4 | A resposta está nos quatro animais. Apresente a Morte e tome o trono. |
| 5 | A Morte tomará a terra da promessa. O exército dos cavaleiros brancos deve cair. |
| 6 | Seu corpo morrerá, sempre. Tome outros corpos desalmados para prosseguir. |

**Implementação:**
- Item type `maldicao`:
  ```
  cavaleiro: StringField({ choices: ["peste", "guerra", "fome", "morte"] })
  descricao:  StringField
  resultado:  NumberField({ min: 1, max: 6 })
  ```
- Active Effect: flag `infaernum.maldicao = true`, `duration.rounds = null` (permanente)
- `module/tables/cavaleiros.mjs`: export dos objetos de dados

**Status:** 📋 Fase 3

---

### 3.4 Encontro com Cavaleiro (p.16, p.24–27)

**Regra:** Ao acumular 6 desgraças → Cavaleiro aleatório aparece → personagem ganha maldição aleatória → zera desgraças. Se já tem maldição e acumula mais 6 → morte.

**No suplemento Domínios (p.47):** Personagem que "serve" um Cavaleiro — ao encontrá-lo, zera desgraças SEM ganhar maldição.

**Implementação:**
- `helpers/cavaleiro-encounter.mjs`:
  - Escolhe Cavaleiro aleatoriamente (1d4 → peste/guerra/fome/morte)
  - Se `actor.items.find(i => i.type === "maldicao")` já existe → morte
  - Abre dialog para confirmar
  - Rola maldição (1d6) do Cavaleiro escolhido
  - Cria item `maldicao` no actor
  - `actor.update({ "system.desgracas": 0 })`

**Status:** 📋 Fase 3

---

## 4. Presságios (p.18)

**Regra:** Pool diário de grupo. Role 1d6 no início de cada dia narrativo:
- 1–2 → 4 presságios disponíveis
- 3–4 → 5 presságios
- 5–6 → 6 presságios

Usos dos presságios (queimar 1 por uso):
1. Reduzir em 1 o total de desgraças de um personagem (não remove tormentos)
2. Imediatamente após rolagem de 3d6 (resultado ≠ 666): rerrolar qualquer dado — cuidado, pode gerar 666

Queimar 3 presságios se resultado for 666 → Grande Milagre (evita morte).

Presságios **não acumulam** entre dias — zeramos ao virar o dia.

**Implementação:**
- `GrupoData.presagios_atuais` — `NumberField({ min: 0, max: 6, initial: 0 })`
- `GrupoData.presagios_max_dia` — `NumberField({ min: 0, max: 6, initial: 0 }`
- Macro "Virar Dia" → rola 1d6 → define `presagios_max_dia` e `presagios_atuais` → incrementa `dia_atual`
- Botão "Queimar Presságio" na ficha de grupo e no chat após rolagem 3d6
- `presagio-dialog.mjs`: escolher qual dado rerrolar

**Status:** 📋 Fase 4

---

## 5. Desafios (p.19)

**Regra (opcional):** Qualquer obstáculo (caído, grupo de inimigos, diálogo, armadilha) pode ter dificuldade numérica.
- Determinar dificuldade: rola 1d6 (GM ou aleatório). Para dificulades maiores: 2d6 ou 3d6 somados.
- Superar: reduzir dificuldade a zero.
  - Cada façanha (4 ou 5) → reduz dificuldade em 1
  - Cada milagre (6) → reduz em 2
  - Milagre doado → ainda reduz em 2
- Efeito narrativo: cada redução é interpretada conforme a ficção.

**Implementação:**
- Actor `caido`:
  ```
  dificuldade_max:   NumberField({ min: 1, initial: 1 })
  dificuldade_atual: NumberField({ min: 0, initial: 1 })
  ```
- Chat message de rolagem 3d6: botão "Aplicar ao Desafio" → select de actor `caido` aberto → `dificuldade_atual -= facanhas + (milagres * 2)`
- Quando `dificuldade_atual === 0` → chat renderiza "Desafio superado!"

**Status:** 📋 Fase 5

---

## 6. Colossos (p.36–37)

**Regra:** Inimigos gigantescos. Requer baralho (52 cartas + 2 curingas).

**Preparação:**
- `dificuldade_total` = rola 3d6+6 (mínimo 9, máximo 24)
- Pode dividir em "partes" com sub-dificuldades
- Criar 4 desgraças do colosso (uma por naipe: ♠♥♦♣)
- Distribuir 4 cartas viradas ao redor do colosso
- Posicionar personagens sobre cartas

**Durante combate:**
- Resultado 1 numa rolagem → revelar carta sob o personagem → naipe = qual desgraça do colosso; valor = intensidade (A=min, K=max)
- Resultado 2 ou 3 → neutro + pode mover para carta adjacente
- Curinga → ignorar toda a rolagem
- Derrotar: reduzir dificuldade a 0 → cada personagem puxa carta → naipe = qual desgraça é "absorvida" como ritual

**Ritual (absorvido de Colosso):** Funciona como salvação — requer 2 milagres para ativar, efeito potencializado (nível K).

**Implementação:**
- Actor `colosso`:
  ```
  dificuldade_total:  NumberField
  dificuldade_atual:  NumberField
  partes: ArrayField(SchemaField({ nome, dificuldade_max, dificuldade_atual }))
  desgraca_espadas:   StringField  // descrição da desgraça ♠
  desgraca_copas:     StringField  // ♥
  desgraca_ouros:     StringField  // ♦
  desgraca_paus:      StringField  // ♣
  cartas_jogadores: ArrayField(SchemaField({ jogador_id, naipe, valor }))
  ```
- Item type `ritual` (cópia de `salvacao` com flag de origem)
- UI de colosso: grid visual 4 cartas + avatares de jogadores

**Status:** 📋 Fase 7

---

## 7. Fendas / Masmorras (p.34–35)

**Regra:** Caminhos de entrada de caídos. Explorar = encontrar artefato lendário (salvação).

**Estrutura:**
- Quantos desafios: rola 2d6 (ou 3d6 para mais)
- Cada desafio: dificuldade 1d6 (penúltimo = 2d6; último = 3d6)
- Ao superar todos: obtém salvação
- Salvação requer 2 milagres para ativar

**Tabela de Salvações (3d6):** (p.35)

| Resultado | Salvação |
|-----------|---------|
| 3 | Trombeta que invoca o serafim taurino para guerrear |
| 4 | Trombeta que invoca o serafim-águia para mortificar |
| 5 | Punhal que dá vida à árvore estocada por ele |
| 6 | Manopla que torna a pele rígida como ferro |
| 7 | Anel capaz de enviar você e aliados a local aleatório |
| 8 | Frasco que suga caído para dentro, escravizando-o |
| 9 | Lanterna capaz de evocar um caído envolto em chamas |
| 10 | Cabo de espada capaz de criar lâmina de luz |
| 11 | Coroa possuída por arcanjo, capaz de comandar legiões |
| 12 | Lança sagrada que sempre desfere o último golpe |
| 13 | Cajado capaz de convocar e controlar animais próximos |
| 14 | Cruz que paralisa tudo nos arredores de onde for fincada |
| 15 | Elmo capaz de criar quatro asas em seu usuário |
| 16 | Pote que contém a praga mais terrível |
| 17 | Trombeta que invoca o serafim-homem para amaldiçoar |
| 18 | Trombeta que invoca o serafim leonino para purificar |

**Implementação:**
- Item type `salvacao`:
  ```
  descricao:   StringField
  efeitoDescricao: StringField
  ativavel:    BooleanField({ initial: true })
  milagresNecessarios: NumberField({ initial: 2 })
  ```
- Item type `fenda`:
  ```
  total_desafios:    NumberField
  desafios_restantes: NumberField
  dificuldade_atual:  NumberField
  superada:          BooleanField
  ```

**Status:** 📋 Fase 6

---

## 8. Paranoias (p.38–39)

**Regra:** Pode reduzir total de desgraças em 1 para adquirir uma paranoia. Efeito narrativo (sem mecânica imediata), mas desgraças podem ser interpretadas como paranoia em ação.

**Limite:** máximo 3 paranoias. Ao atingir 3 → sorte do personagem transforma-se em segundo azar (irreversível).

**Tabela de Paranoias (3d6):**

| Resultado | Paranoia |
|-----------|---------|
| 3 | Quatro vozes dizem te guiar à Terra Prometida |
| 4 | Algo te diz que você é o quinto Cavaleiro |
| 5 | Está tudo envenenado. É perigoso comer qualquer coisa |
| 6 | Personalidade alterna momentos com outra cruel ao extremo |
| 7 | Personalidade alterna com outra megalomaníaca |
| 8 | Personalidade alterna com outra amedrontada |
| 9 | Há um padrão em todas as coisas, nada parece ser por acaso |
| 10 | Vozes incessantes que confundem raciocínio |
| 11 | Visões de vultos que parecem te perseguir |
| 12 | Estresse torna pelos mais alvos que a neve |
| 13 | Há algo vindo das águas e todos parecem ignorar |
| 14 | Há algo vindo dos céus e todos parecem ignorar |
| 15 | Eles te matarão enquanto dormir |
| 16 | Sangue precisa ser derramado, ou ela ficará furiosa |
| 17 | Um senhor das profundezas deseja algo de você |
| 18 | O Dragão sussurra sua vontade em seus ouvidos |

**Implementação:**
- Item type `paranoia`: `descricao: StringField`
- `PersonagemData.segundo_azar: BooleanField` → true quando terceira paranoia adicionada
- Hook `preCreateItem` para item paranoia: verifica se `paranoias.length >= 3` → bloqueia com aviso
- Hook `createItem` para 3ª paranoia → seta `segundo_azar = true`

**Status:** 📋 Fase 6

---

## 9. Pactos (p.40–41)

**Regra:** Personagem firma pacto com entidade (caído ou outra). A entidade concede **dádiva diária** (usada uma vez por dia) em troca de **dívida diária**. Não pagar = entidade aniquila personagem.

**Invocação:** Requer oferta + rolagem 3d6 → ao menos 1 resultado 6. Senão, falhou.

**Tabelas de Pactos:**

Dádivas (3d6, p.40–41):
- 3: Saúde — livre-se de um tormento
- 4: Prosperidade — recursos suficientes
- 5: Sedução — convencimento nas próximas palavras
- 6: Revelação — descobre algo oculto
- 7: Conhecimento — qualquer informação
- 8: Coragem — reduz dificuldade de desafio em 1
- 9: Carisma — alguém passa a gostar de você
- 10: Direção — aponta o caminho
- 11: Ilusão — como você deseja ser visto (tempo limitado)
- 12: Natureza — ambiente facilita o caminho
- 13: Divinação — passado ou futuro (pergunta com 1d6)
- 14: Transmutação — transforma em animal (não dura muito)
- 15: Destino — reduz 2 desgraças OU rerrola 2 dados com presságio
- 16: Dominação — obediência (duração via 1d6)
- 17: Fortalecimento — ao reduzir dificuldade, reduz o dobro
- 18: Desejo — qualquer pedido (verifica com 1d6)

Dívidas (3d6, p.41):
- 3: Portal — destruir portais e ninhos de caídos
- 4: Alimento — comer o que é proibido (literalmente)
- 5: Súplica — lidar com súplica no quadro de orações
- 6: Coleção — trazer restos de outros caídos
- 7: Sacrifício — animais tombados
- 8: Traição — trair alguém de verdade
- 9: Vício — substância insubstituível
- 10: Ouro — preciosidades (verifica com 1d6)
- 11: Morte — uma vida por dia
- 12: Cerimônia — rito peculiar
- 13: Exorcismo — eliminar um caído
- 14: Culto — converter fiéis
- 15: Roubo — pegar algo (especificar via 1d6/2d6)
- 16: Adoração — construir altar
- 17: Busca — pistas sobre Terra Prometida
- 18: Purificação — templos e sacerdotes devem perecer

**Implementação:**
- Item type `pacto`:
  ```
  entidade:        StringField
  dadiva:          StringField   // descrição do benefício
  divida:          StringField   // descrição do custo diário
  dadiva_usada_hoje: BooleanField({ initial: false })
  divida_paga_hoje:  BooleanField({ initial: false })
  ```
- Macro "Virar Dia" → reseta `dadiva_usada_hoje = false` e `divida_paga_hoje = false`
- Se `divida_paga_hoje = false` ao virar dia → chat renderiza aviso (entidade pode agir)

**Status:** 📋 Fase 6

---

## 10. Almas (p.53)

**Regra:** Personagem que desfere golpe final em caído → absorve alma automaticamente. Após rolagem de ação, queimar 1 alma para:
- Transformar desgraça → neutro
- Transformar neutro → façanha

Podem ser encadeadas: 2 almas = desgraça → neutro → façanha.

**Implementação:**
- `PersonagemData.almas: NumberField({ min: 0, integer: true, initial: 0 })`
- Botão "Absorver Alma" no actor `caido` quando `dificuldade_atual === 0`
- Pós-rolagem 3d6 no chat: botão "Queimar Alma" → dialog mostra opções disponíveis

**Status:** 📋 Fase 6

---

## 11. Arcanos (p.48–49)

**Regra:** 22 cartas de tarô maior. Puxar 1–3 cartas para gerar ideias (verbo/substantivo/adjetivo).

| Arcano | Verbos | Substantivos | Adjetivos |
|--------|--------|-------------|-----------|
| 0 - O Louco | mudar, confiar | jornada, confiança | insano, confiável |
| I - O Mago | controlar, conhecer | estratégia, astúcia | inteligente, adaptável |
| II - A Sacerdotisa | perceber, reconhecer | sonho, segredo | oculto, profundo |
| III - A Imperatriz | crescer, fortalecer | intuição, sabedoria | independente, sábio |
| IV - O Imperador | conquistar, liderar | domínio, conquista | implacável, superior |
| V - O Hierofante | ordenar, reunir | tradição, fé | valoroso, espiritual |
| VI - Os Enamorados | escolher, contradizer | dúvida, probabilidade | incerto, contraditório |
| VII - A Carruagem | avançar, progredir | movimento, ritmo | racional, experiente |
| VIII - A Justiça | revelar, discernir | conflito, ordem | verdadeiro, justo |
| IX - O Eremita | isolar, fugir | solidão, fuga | sozinho, prudente |
| X - A Roda da Fortuna | resolver, melhorar | solução, sorte | afortunado, evoluído |
| XI - A Força | superar, seduzir | paixão, razão | persistente, resiliente |
| XII - O Enforcado | sacrificar, alterar | dor, sacrifício | sacrificado, renascido |
| XIII - A Morte | terminar, transformar | fim, transformação | mortal, final |
| XIV - A Temperança | equilibrar, pacificar | paz, harmonia | equilibrado, estável |
| XV - O Diabo | enganar, desejar | desejo, distração | mentiroso, encantador |
| XVI - A Torre | destruir, retomar | mudança, destruição | trágico, destrutivo |
| XVII - A Estrela | inspirar, motivar | força, esperança | perseverante, iluminado |
| XVIII - A Lua | iludir, criar | ritual, ilusão | misterioso, místico |
| XIX - O Sol | aumentar, proteger | proteção, grandeza | grandioso, protegido |
| XX - O Julgamento | libertar, renovar | cura, liberdade | liberto, renovado |
| XXI - O Mundo | desafiar, vencer | objetivo, desafio | desafiador, vitorioso |

**Implementação:**
- `module/tables/arcanos.mjs`: array dos 22 arcanos com verbos/substantivos/adjetivos
- Macro "Puxar Arcano": dialog pede quantas cartas (1–3) → resultado em chat

**Status:** 📋 Fase 8

---

## 12. Territórios (p.42–43)

**Regra:** Baralho (52+2) para mapear o mundo. Revelar carta ao entrar em território:
- Naipe = foco do ambiente: ♦=clima, ♠=águas, ♥=pessoas, ♣=vegetação
- Valor A–10 = dificuldade do desafio presente (1–10)
- J ou Q = há uma Fenda no território
- K = há um Colosso no território
- Curinga 1 = pistas sobre Terra Prometida (território)
- Curinga 2 = Terra Prometida está aqui

**Implementação:**
- Item type `territorio`:
  ```
  naipe: StringField({ choices: ["espadas","copas","ouros","paus"] })
  valor: StringField  // "A","2"..."K","curinga"
  foco:  StringField  // clima/águas/pessoas/vegetação
  descricao: StringField  // texto livre do GM
  posicao:   SchemaField({ linha: NumberField, coluna: NumberField }) // grid hex
  ```
- Macro "Explorar Território" → simula draw de carta → cria item `territorio`

**Status:** 📋 Fase 8

---

## 13. Domínios (p.46–47)

**Regra:** Cenário alternativo (profecia parcialmente verdadeira). 24 cartas (A–6 dos 4 naipes). Naipe = Cavaleiro que domina a localidade. Valor = qual evento do Cavaleiro acontece.

Personagem escolhe um Cavaleiro para "servir" — ao encontrá-lo com 6 desgraças, zera desgraças sem ganhar maldição.

**Implementação:**
- World setting `cenario: "dominios"`
- Item type `dominio`:
  ```
  cavaleiro: StringField
  evento:    NumberField({ min: 1, max: 6 })
  descricao: StringField
  posicao:   SchemaField({ linha: Number, coluna: Number })
  ```
- `PersonagemData.cavaleiro_servido: StringField({ choices: ["", "peste", "guerra", "fome", "morte"] })`

**Status:** 📋 Fase 8

---

## 14. Infærnaculum — Modo Cartas (p.50–51)

**Regra:** Substitui dados por cartas. Baralho 52+2.

- 1d6 (pergunta): puxar 1 carta. Naipe preto = sim, vermelho = não.
- 2d6 (ideias): puxar 2 cartas. 1ª = verbo (por naipe+valor, tabelas p.50). 2ª = substantivo.
- 3d6 (ação): puxar 3 cartas. ♦=neutro, ♠=façanha, ♥=milagre, ♣=desgraça.
- Curinga (qualquer "rolagem") = reviravolta extrema.

**Implementação:**
- `module/dice/card-strategy.mjs`: implementa interface `IDiceStrategy`
- `DiceStrategy`:
  - `pergunta(modificador)` → sim/não
  - `ideias()` → verbo + substantivo
  - `acao(temSorte, azarAtivo)` → classificação
- Toggle em world settings: `modoAleatorio: "dados" | "cartas"`
- Entry point: `import { estrategiaDados } from "./dice/infaernum-roll.mjs"`

**Status:** 📋 Fase 9

---

## 15. Cyfærnum — Cenário Cyberpunk (p.52)

**Regra:** Cenário alternativo. Megalópole, megacorporações (= 4 Cavaleiros), agentes (= caídos), downloads de sistema (= almas), reboots (= presságios).

**Implementação:**
- JournalEntry em compendium com regras do cenário
- Toggle de cenário → ajusta labels no sistema (ex: "caído" → "agente")
- World setting `cenario: "cyfaernum"`

**Status:** 📋 Fase 8

---

## 16. Caos — Tabelas de Narração (p.44–45)

**Tabelas:**

**O que acontece ao rolar desgraça?**
1. Novo fato ou elemento entra em cena — por que é ruim?
2. Algo ruim relacionado a elemento já em cena
3. Situação muito pior que aparentava — por quê?
4. Algum personagem sofre tormento superficial
5. PNJ afetado severamente por algo
6. Algum personagem sofre tormento grave

**O que acontece ao rolar neutro?**
1. Algo oculto é revelado
2. PNJ ou grupo entra em cena
3. Algo no ambiente chama atenção
4. Cena alterada por novo fato
5. Algo relacionado a elemento já em cena
6. Algo extremamente inesperado

**O que um PNJ fará durante confronto?**
1. Atacará com todas as forças
2. Habilidade/poder inexplicável
3. Tentará se defender a qualquer custo
4. Agirá de modo inesperado — por quê?
5. Usará artimanhas para atacar de surpresa
6. Manifestará novo poder ainda não utilizado

**Comportamento inicial de PNJ:**
1. Hostil (pode ser violento)
2. Discordante (pensa de modo oposto)
3. Indiferente (não demonstra interesse)
4. Curioso (puxa conversa)
5. Amigável (disposto a ouvir e opinar)
6. Prestativo (disposto a ajudar)

**Objetivo de súplica no quadro de orações:**
1. Lidar com ninho de caídos — portal deve ser fechado
2. Alguém raptado — investigação e resgate
3. Caído solitário num local — eliminar
4. Caído perigosíssimo — capturar
5. Boato sobre fenda — investigar
6. Colosso tomou território — o que fazer?

**Implementação:**
- `module/tables/caos.mjs`: export das 5 tabelas como arrays
- Macros em compendium: "Rolar Desgraça Caos", "Rolar Neutro Caos", etc.
- Rolltables em packs/sources/rolltables/caos/

**Status:** 📋 Fase 6

---

## 17. Campanha — Os 7 Dias (p.23–29)

**Estrutura:**
- Dia I: Faltam 6 dias. Eclipse, tremores, caída do bastião. Primeiro Cavaleiro pode aparecer se 6 desgraças.
- Dia II: Faltam 5. A PESTE — serafim-leão convoca primeiro Cavaleiro.
- Dia III: Faltam 4. A GUERRA — serafim-touro. Trombeta audível por todos.
- Dia IV: Faltam 3. A FOME — o homem tocado pelo poder dos céus.
- Dia V: Amanhã. A MORTE — serafim-águia. Última trombeta.
- Dia VI: O fim. Batalha final. Role 1d6 para evento do dia.
- Dia VII: Quem sobreviveu reina por 1000 anos.

**Eventos Dia VI (1d6):**
1. Besta e Dragão destroem portões
2. Exército da Terra Prometida dizima caídos; jogadores vistos como inimigos
3. Quatro animais deixam postos e entram no campo de batalha
4. Besta se rebela contra o Dragão
5. Caídos se sobressaem ao exército dos cavaleiros brancos
6. Dragão devora a besta e aumenta poder

**Implementação:**
- `GrupoData.dia_atual: NumberField({ min: 0, max: 7, initial: 0 })`
- `GrupoData.cavaleiros_anunciados: ArrayField(StringField)` — lista dos que já apareceram
- HUD de dia: exibe texto de cada dia + eventos possíveis
- World setting `anuncio_cavaleiro_por_dia: Boolean` — se true, Cavaleiros só aparecem no dia correspondente

**Status:** 📋 Fase 4 (grupo/dia), Fase 3 (Cavaleiros)
