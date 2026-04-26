# Plano de Testes

## Princípios

- **Teste manual primeiro.** Para cada feature, executar o checklist abaixo no Foundry real.
- **Quench para lógica crítica.** `DiceResolver` e cancelamento sorte/azar DEVEM ter tests Quench.
- **Não testar o óbvio.** Foundry já testa renderização de sheets. Testar regras de jogo, não plumbing.

---

## Setup Quench (opcional, Fase 2+)

1. Instalar módulo Quench no Foundry
2. Adicionar ao `system.json`:
   ```json
   "relationships": {
     "requires": [],
     "recommends": [{ "id": "quench", "type": "module" }]
   }
   ```
3. Arquivos de test: `module/tests/*.test.mjs`
4. Registrar em `Hooks.once("quenchReady", ...)` no entry point

---

## Checklist por Fase

### Fase 0 — Fundação

- [ ] Sistema aparece na lista de sistemas do Foundry
- [ ] Criar mundo usando sistema `infaernum` — sem erros no console (F12)
- [ ] Nenhum ator pode ser criado ainda (esperado)
- [ ] CI: push → lint verde

---

### Fase 1 — Ficha de Personagem

**Setup:** Criar ator tipo `personagem`.

**Campos básicos:**
- [ ] Preencher "Sorte" → salva ao desfocagem
- [ ] Preencher "Azar" → salva
- [ ] Alterar nome no header → salva
- [ ] Avatar: clicar → FilePicker abre

**Tracker de Desgraças:**
- [ ] Clicar 1ª bolinha → `desgracas = 1`
- [ ] Clicar 6ª bolinha → `desgracas = 6`
- [ ] Clicar bolinha já marcada → decrementa

**Almas:**
- [ ] Botão "+" → incrementa
- [ ] Botão "−" → decrementa, para em 0

**Tralhas:**
- [ ] Criar item tipo `tralha` → arrastar para sheet → aparece na lista
- [ ] Clicar item → sheet do item abre
- [ ] Deletar item da lista → some

**Bênção:**
- [ ] Criar item tipo `bencao` → arrastar → aparece no bloco
- [ ] Apenas 1 bênção permitida (segunda deve avisar ou substituir)

**Anotações:**
- [ ] Campo HTML editável → salva

**Tormento/Maldição/Paranoia (exibição):**
- [ ] Criar item `tormento` → arrastar → aparece na lista
- [ ] Criar item `maldicao` → aparece no bloco (highlight diferente)
- [ ] Criar item `paranoia` → aparece na lista

---

### Fase 2 — Motor de Dados

**1d6 pergunta:**
- [ ] Executar macro "Pergunta 1d6" → dialog abre
- [ ] Preencher pergunta → confirmar → chat exibe sim/não + intensidade
- [ ] Modificador +1 (sim provável) → testa 5x, confirma distribuição
- [ ] Modificador -1 (não provável) → idem

**2d6 ideias:**
- [ ] Executar macro "Ideias 2d6" → chat exibe verbo + substantivo
- [ ] Resultado está nas tabelas corretas (verificar manualmente em RULES-MAPPING §2.2)

**3d6 ação:**
- [ ] Abrir ficha personagem → clicar "Rolar Ação"
- [ ] Dialog abre com input de ação
- [ ] Preview mostra "3d6"
- [ ] Confirmar → chat mostra 3 dados coloridos
- [ ] Cores corretas: 1=vermelho, 2-3=cinza, 4-5=dourado, 6=branco/brilhante
- [ ] Contagens corretas: desgraças/neutros/façanhas/milagres

**Sorte:**
- [ ] Marcar "Aplicar Sorte" + desmarcar "Azar"
- [ ] Rolar 3d6 com dado=1 E dado=6 → o 1 deve ser anulado (exibir tachado ou diferente)
- [ ] Dois 1s e um 6 → um 1 anulado, um 1 permanece

**Azar:**
- [ ] Marcar "Aplicar Azar"
- [ ] Dado=6 e dado=1 → o 6 anulado

**Morte:**
- [ ] Rolar manualmente 3d6 todos iguais a 6 (forçar via console se necessário)
- [ ] Chat exibe mensagem de morte especial
- [ ] Dialog perguntando presságios ainda não existe (Fase 4)

**Quench tests (DiceResolver):**
```
✓ todos neutros [3,3,3] → { desgracas:0, neutros:3, facanhas:0, milagres:0 }
✓ sorte cancela: [6,1,3] com temSorte → desgracas:0 (1 cancelado), milagres:1
✓ azar cancela: [1,6,4] com azarAtivo → milagres:0 (6 cancelado), desgracas:1
✓ simultâneos: [1,6,3] com ambos → sem cancelamento (azar e sorte se anulam)
✓ morte: [6,6,6] → morte:true
```

---

### Fase 3 — Tormentos, Maldições, Cavaleiros

**Tormento pós-desgraça:**
- [ ] Rolar 3d6, obter desgraça
- [ ] Botão "Gerar Tormento" aparece no chat
- [ ] Clicar → dialog de descrição → confirmar → item `tormento` criado no ator
- [ ] Tormento aparece na ficha

**Tormento no roll-dialog:**
- [ ] Com tormento ativo, abrir roll-dialog
- [ ] Tormento listado com checkbox
- [ ] Marcar tormento → equivale a azar (dado 1 anula 6)
- [ ] Múltiplos tormentos → múltiplos checkboxes

**Remover tormento:**
- [ ] Rolar milagre (6) numa ação voltada ao tormento
- [ ] Dialog "Remover tormento?" → clicar sim → item removido
- [ ] Façanha (4 ou 5) → dialog "Amenizar tormento?" → modifica descrição

**Encontro com Cavaleiro:**
- [ ] Personagem com `desgracas = 5` → incrementar para 6
- [ ] Dialog do Cavaleiro abre automaticamente
- [ ] Mostra qual Cavaleiro (aleatório)
- [ ] Confirmar → item `maldicao` criado + `desgracas = 0`
- [ ] Maldição aparece na ficha com destaque especial

**Segundo encontro (morte):**
- [ ] Personagem com maldição, acumular 6 desgraças novamente
- [ ] Dialog de morte aparece (não maldição)

**Suplemento Domínios (antecipado):**
*Testar apenas se `cavaleiro_servido` já implementado*
- [ ] Setar `cavaleiro_servido = "guerra"`
- [ ] Acumular 6 desgraças → encontrar A GUERRA
- [ ] Desgraças zeradas SEM maldição

---

### Fase 4 — Grupo & Presságios

**Actor grupo:**
- [ ] Criar ator tipo `grupo` → sheet abre
- [ ] Botão "Rolar Presságios do Dia" → 1d6 → resultado seta max e atual
  - 1–2 → 4 presságios
  - 3–4 → 5 presságios
  - 5–6 → 6 presságios
- [ ] Tracker exibe bolinhas corretas

**Avançar dia:**
- [ ] Botão "Avançar Dia" → `dia_atual` incrementa (0 → 1 → ... → 7)
- [ ] Presságios do dia anterior zerados
- [ ] Dia 7: botão desabilitado

**HUD lateral:**
- [ ] HUD exibe dia atual + bolinhas de presságio
- [ ] Atualiza ao modificar ator grupo

**Queimar presságio pós-3d6:**
- [ ] Rolar 3d6 → chat exibe resultado
- [ ] Botão "Queimar Presságio" aparece (se `presagios_atuais > 0`)
- [ ] Clicar → dialog mostra dados individuais com checkboxes
- [ ] Selecionar dado → confirmar → dado rerola → resultado atualiza no chat
- [ ] `presagios_atuais` decrementa

**Queimar 3 presságios (morte):**
- [ ] Forçar 3d6 = [6,6,6]
- [ ] Dialog "Queimar 3 presságios para evitar morte?" (se `presagios_atuais >= 3`)
- [ ] Confirmar → Grande Milagre no chat, `presagios_atuais -= 3`
- [ ] Negar → morte definitiva

---

### Fase 5 — Caídos & Desafios

**Actor caido:**
- [ ] Criar ator tipo `caido` com dificuldade 5
- [ ] Sheet abre com barra de dificuldade 5/5

**Reduzir dificuldade via chat:**
- [ ] Personagem rola 3d6, obtém 2 façanhas e 1 milagre
- [ ] Chat exibe botão "Aplicar ao Desafio"
- [ ] Clicar → select de caídos abertos na cena
- [ ] Selecionar caído → dificuldade reduz: 2 façanhas (-2) + 1 milagre (-2) = -4 → `1/5`
- [ ] Mensagem no chat: "Dificuldade reduzida: 5 → 1"
- [ ] Rolar novamente, 1 façanha → dificuldade 0
- [ ] Chat: "Desafio superado! [nome do caído]"

**Absorver alma:**
- [ ] Quando `dificuldade_atual = 0`, botão "Absorver Alma" aparece na sheet do caído
- [ ] Clicar (como personagem) → `personagem.almas += 1`
- [ ] Botão desaparece após absorção

---

### Fase 6 — Suplementos

**Paranoias:**
- [ ] Criar 3 itens `paranoia` no personagem → 3ª dispara `segundo_azar = true`
- [ ] Tentar criar 4ª → aviso/bloqueio
- [ ] Com `segundo_azar = true`, roll-dialog mostra azar automaticamente aplicado

**Pactos:**
- [ ] Criar item `pacto` com dádiva e dívida
- [ ] Botão "Usar Dádiva" → clicar → `dadiva_usada_hoje = true` → botão desabilitado
- [ ] Virar dia → botão reabilitado
- [ ] `divida_paga_hoje = false` ao virar dia → aviso no chat

**Almas (queima):**
- [ ] Personagem com `almas >= 1`, rolar 3d6
- [ ] Chat: botão "Queimar Alma"
- [ ] Clicar → dialog: "desgraça→neutro" ou "neutro→façanha"
- [ ] Confirmar → resultado atualiza no chat, `almas -= 1`

**Fendas:**
- [ ] Macro "Explorar Fenda" → rola número de desafios (2d6)
- [ ] Cada desafio tem dificuldade gerada
- [ ] Reduzir todos para 0 → salvação gerada (3d6 na tabela)

---

### Fase 7 — Colossos

**Criação:**
- [ ] Criar ator `colosso`, definir 4 desgraças por naipe, dificuldade

**Combate:**
- [ ] Posicionar personagem sobre carta (click ou drag)
- [ ] Rolar 3d6 com desgraça → carta sob o personagem revelada → naipe determina desgraça
- [ ] Resultado 2 ou 3 → personagem pode mover para carta adjacente
- [ ] Curinga → rolagem inteira ignorada

**Derrotar:**
- [ ] Reduzir dificuldade a 0 → dialog "Absorver ritual?" por personagem
- [ ] Confirmar → item `ritual` criado com efeito potencializado

---

### Fase 8 — Cenários

**Domínios:**
- [ ] Mudar world setting cenário → `dominios`
- [ ] Personagem com `cavaleiro_servido = "morte"`, acumular 6 desgraças → encontrar A MORTE → sem maldição

**Arcanos:**
- [ ] Macro "Puxar Arcano", escolher 3 cartas → chat exibe verbo + substantivo + adjetivo de 3 arcanos

**Territórios:**
- [ ] Macro "Explorar Território" → carta aleatória → chat descreve território (naipe + valor)

---

### Fase 9 — Modo Cartas

**Infærnaculum:**
- [ ] Mudar world setting `modoAleatorio → cartas`
- [ ] Rolar "pergunta 1d6" → desenha carta, não rola dado → naipe preto=sim, vermelho=não
- [ ] Rolar "3d6 ação" → 3 cartas → ♦=neutro, ♠=façanha, ♥=milagre, ♣=desgraça
- [ ] Curinga → "reviravolta extrema" no chat

---

## Testes de regressão entre versões

Antes de mergear Fase N+1, re-executar checklist de Fase N.
Se algo quebrou, não mergear. Abrir issue de regressão.

---

## Ambiente de teste

**Foundry version:** testar em v13 e v14 (CI matrix)
**Browser:** Chrome/Chromium (padrão Foundry)
**Dados de teste:** manter world salvo com actors de teste pré-criados
