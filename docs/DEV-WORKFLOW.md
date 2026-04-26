# Fluxo de Desenvolvimento

## Princípios

1. **Repo é a memória.** Nenhuma lógica crítica vive em prompt privado de agente.
2. **Uma feature por branch.** Nunca commitar direto em `main`.
3. **Cada fase fecha em PR.** PR mergeado = versão bumpada + CHANGELOG atualizado.
4. **Handoff obrigatório.** Ao final de sessão sem fechar fase, criar `docs/tasks/HANDOFF-*.md`.

---

## Setup Local

### Pré-requisitos

- Node.js 20+
- Foundry VTT instalado (v13 ou v14)
- Git

### Instalação

```bash
git clone https://github.com/SergioSJS/infaernum-rpg-fvtt.git
cd infaernum-rpg-fvtt
npm install
```

### Link local para Foundry

```bash
# macOS
ln -sf "$(pwd)" ~/Library/Application\ Support/FoundryVTT/Data/systems/infaernum

# Linux
ln -sf "$(pwd)" ~/.local/share/FoundryVTT/Data/systems/infaernum

# Windows (PowerShell, como admin)
New-Item -ItemType Junction -Path "$env:LOCALAPPDATA\FoundryVTT\Data\systems\infaernum" -Target "$(Get-Location)"
```

### Build CSS (dev)

```bash
npm run watch:css   # observa mudanças em styles/*.scss
```

### Build CSS (produção)

```bash
npm run build:css
```

### Build Compendiums

```bash
npm run pack:build   # compila packs/sources/ → LevelDB em packs/
```

---

## Fluxo de Feature

### 1. Criar branch

```bash
git checkout -b feat/fase-2-motor-dados
# ou para fix:
git checkout -b fix/roll-resolver-cancelamento
```

### 2. Criar task file

```bash
# docs/tasks/YYYYMMDD-slug.md (ver HANDOFF-TEMPLATE.md para estrutura)
touch docs/tasks/20260424-fase-2-motor-dados.md
```

### 3. Implementar

- Ler `docs/RULES-MAPPING.md` antes de tocar em qualquer mecânica
- Se regra não está mapeada → mapear primeiro, depois implementar
- CSS: editar `styles/_*.scss`, nunca o `infaernum.css` diretamente
- i18n: adicionar todas as strings em `lang/pt-BR.json` antes de usar em HBS

### 4. Lint

```bash
npm run lint
# ou com fix automático:
npm run lint -- --fix
```

### 5. Testar manualmente

Ver `docs/TESTING.md` → checklist da fase atual.

### 6. Commit

Usar Conventional Commits:

```
feat(dados): implementa DiceResolver com cancelamento sorte/azar
fix(sheet): corrige tracker de desgraças no clique duplo
docs(rules): adiciona mapeamento de paranoias
refactor(dice): extrai roll-dialog para arquivo próprio
chore(ci): adiciona matrix de testes v13/v14
```

```bash
git add module/dice/roll-resolver.mjs module/dice/roll-dialog.mjs
git commit -m "feat(dados): implementa DiceResolver com cancelamento sorte/azar"
```

### 7. Pull Request

```bash
gh pr create --title "feat: Motor de dados 3d6 (Fase 2)" \
  --body "Implementa DiceResolver, diálogo de ação, chat message. Ver RULES-MAPPING.md §2.3."
```

Checklist do PR:
- [ ] Lint passa
- [ ] Teste manual feito (ver TESTING.md)
- [ ] RULES-MAPPING.md atualizado se nova mecânica
- [ ] lang/pt-BR.json atualizado
- [ ] CHANGELOG.md atualizado

---

## Release

Releases são geradas automaticamente via GitHub Actions ao criar uma tag:

```bash
# Bumpar versão em system.json
npm version minor  # 0.1.0 → 0.2.0

# Criar tag (trigger do CI)
git tag v0.2.0
git push origin main --tags
```

CI vai:
1. Build CSS
2. Build compendiums
3. Atualizar `system.json` com URL de download
4. Criar zip (sem `docs/` e `.claude/`)
5. Criar GitHub Release com `infaernum.zip` e `system.json`

---

## Estrutura de Commits

```
<tipo>(<escopo>): <descrição curta>

[corpo opcional: o "porquê" não óbvio]

[footer: links, breaking changes]
```

**Tipos:** `feat` `fix` `docs` `refactor` `test` `chore` `style`

**Escopos:** `dados` `sheet` `personagem` `caido` `grupo` `cavaleiros` `presagios` `compendium` `ci` `rules` `i18n`

---

## Convenções de Nomeação

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Arquivos JS | `kebab-case.mjs` | `roll-resolver.mjs` |
| Classes JS | `PascalCase` | `PersonagemData` |
| Funções JS | `camelCase` | `resolverRolagem3d6` |
| Constantes JS | `UPPER_SNAKE_CASE` | `CAVALEIROS` |
| IDs de Item FVTT | `kebab-case` | `tormento-ferimento-perna` |
| Chaves i18n | `INFAERNUM.Escopo.Subescopo` | `INFAERNUM.Roll.Faca nha` |
| CSS classes | `.infaernum-*` ou `.inf-*` | `.inf-desgracas-tracker` |
| CSS variables | `--inf-*` | `--inf-accent` |
| Branches | `feat/slug` ou `fix/slug` | `feat/fase-3-cavaleiros` |

---

## Resolução de Conflitos

Se regra do PDF contradiz implementação:
1. Verificar `docs/RULES-MAPPING.md`
2. Se mapeamento está errado → corrigir RULES-MAPPING primeiro
3. Abrir issue descrevendo a ambiguidade
4. Implementar conforme RULES-MAPPING atualizado

Se ambiguidade na regra:
1. Marcar como `❓ Ambíguo` no RULES-MAPPING
2. Descrever interpretação adotada e motivo
3. Implementar interpretação mais conservadora/simples

---

## Handoff entre Sessões

Ao terminar sessão sem fechar uma fase:
1. Copiar `docs/HANDOFF-TEMPLATE.md`
2. Salvar como `docs/tasks/HANDOFF-YYYYMMDD-HHmm.md`
3. Preencher todas as seções
4. Commit: `docs: handoff YYYYMMDD`

Ver template em `docs/HANDOFF-TEMPLATE.md`.
