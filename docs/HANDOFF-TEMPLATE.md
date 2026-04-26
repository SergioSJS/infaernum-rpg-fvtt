# Template de Handoff

> Copie este arquivo para `docs/tasks/HANDOFF-YYYYMMDD-HHmm.md` ao final de cada sessão que não fecha uma fase.
> Preencha TODAS as seções — handoffs incompletos causam retrabalho.

---

# HANDOFF — [DATA] [HORA]

## Estado da fase

**Fase em andamento:** [0–9]
**Branch ativa:** `[nome-da-branch]`
**Versão atual:** `[0.X.Y]`
**Próxima versão alvo:** `[0.X+1.0]`

## O que foi feito nesta sessão

> Liste os arquivos criados/modificados e o que cada um faz. Seja específico.

- `module/dice/roll-resolver.mjs` — criado. Implementa `resolverRolagem3d6({ dados, temSorte, azarAtivo })`. Cancelamento sorte/azar funcionando.
- `module/dice/roll-dialog.mjs` — criado. Dialog de ação com preview 3d6. Falta: integrar tormentos ativos.
- `lang/pt-BR.json` — adicionadas chaves `INFAERNUM.Roll.*`
- `docs/RULES-MAPPING.md` — seção §2.3 atualizada com status ✅

## O que NÃO foi feito (pendente desta fase)

> Lista clara do que ainda falta para esta fase ser concluída.

- [ ] `templates/chat/roll-3d6.hbs` — não iniciado
- [ ] Chat message renderizando dados coloridos — não iniciado
- [ ] Integração tormentos no roll-dialog — parcial (estrutura pronta, lógica faltando)
- [ ] Macro 1d6 pergunta — não iniciado
- [ ] Tests Quench para DiceResolver — não iniciado

## Estado dos arquivos críticos

> Para cada arquivo relevante em andamento, descreva o estado atual.

**`module/dice/roll-resolver.mjs`**
- Função `resolverRolagem3d6` completa e funcionando
- Faltando: integração com `segundo_azar` (quando personagem tem 3 paranoias)
- TODO na linha 47: `// TODO: checar actor.system.segundo_azar`

**`module/dice/roll-dialog.mjs`**
- Dialog abre e fecha corretamente
- Preview atualiza conforme checkboxes
- Faltando: seção de tormentos ativos do actor

## Próximo passo imediato

> Uma instrução clara para o próximo agente começar imediatamente.

Criar `templates/chat/roll-3d6.hbs`. Estrutura:
```hbs
<div class="inf-roll-result">
  {{#each dados}}
    <span class="inf-dado inf-dado--{{this.tipo}}">{{this.valor}}</span>
  {{/each}}
  <div class="inf-roll-summary">
    {{#if morte}}<strong class="inf-morte">MORTE</strong>{{/if}}
    Desgraças: {{desgracas}} | Façanhas: {{facanhas}} | Milagres: {{milagres}}
  </div>
</div>
```

## Contexto técnico relevante

> Qualquer detalhe não óbvio que o próximo agente precisaria saber.

- `DiceResolver` retorna `{ dados: Array<{valor, tipo}>, desgracas, neutros, facanhas, milagres, morte }` — os arrays contêm os valores dos dados (não os índices).
- O HBS `roll-3d6.hbs` vai receber o objeto retornado pelo resolver direto no context da ChatMessage.
- Padrão de criação de ChatMessage já estabelecido em `fractal-foundry-vtt/module/helpers/chat.mjs` — reutilizar o padrão.
- A CSS class por tipo de dado: `inf-dado--desgraca` (vermelho), `inf-dado--neutro` (cinza), `inf-dado--facanha` (dourado), `inf-dado--milagre` (branco/brilhante).

## Riscos e decisões em aberto

> Marque o que pode bloquear ou impactar negativamente.

- ❓ **Segundo azar:** quando personagem tem `segundo_azar = true`, o azar deve ser aplicado automaticamente ou ainda requer checkbox? Decisão atual: checkbox, mas com tooltip explicativo. Pode mudar.
- ⚠️ **Chat interativo:** botões pós-rolagem (Queimar Presságio, Queimar Alma) são da Fase 4 — não implementar aqui, deixar placeholder no HBS com `{{#if false}}`.

## Arquivos modificados (git status)

> Cole o output de `git status` e `git diff --stat`.

```
# colar aqui
```

## Como testar o que foi feito

> Passo a passo para verificar que o trabalho desta sessão funciona.

1. Abrir Foundry, criar ator tipo `personagem`
2. Abrir sheet → clicar "Rolar Ação"
3. Dialog deve abrir com input de ação e preview "3d6"
4. Confirmar → verificar console (F12): objeto retornado pelo resolver
5. Chat ainda não renderiza (template faltando) — apenas console.log esperado

---

*Handoff gerado em: [TIMESTAMP]*
*Agente que gerou: [Claude/Codex/Antigravity/Humano]*
