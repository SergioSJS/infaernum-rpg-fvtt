# Old Infærnum — Foundry VTT

> ⚠️ **Projeto NÃO-OFICIAL feito por fã para fã.**  
> Não é afiliado, endossado ou produzido pelo criador do Old Infærnum.  
> Feito com amor para a comunidade, de graça e de código aberto.

Sistema para jogar **Old Infærnum** de Raul Volpato no [Foundry Virtual Tabletop](https://foundryvtt.com/) v13+.

> Jogo brutal sobre os últimos 6 dias do mundo. 3d6. 4 Cavaleiros. Ninguém lutará por você.

---

## Ficha de Personagem

Sorte e Azar guiam cada ação — sorte anula desgraças, azar as amplifica. A ficha concentra tudo que importa: bênção, tralhas, tormentos, maldições, paranoias, desgraças e o tracker de almas (suplemento opcional). Suplementos como Fendas, Pactos, Rituais, Domínios e Salvações aparecem automaticamente conforme forem adicionados ao personagem.

---

## Motor de Dados 3d6

Cada ação gera uma rolagem de 3d6 com classificação automática: **1 = desgraça**, **2–3 = neutro**, **4–5 = façanha**, **6 = milagre**. Sorte anula desgraças; azar, tormentos e maldições anulam milagres. Três 6s = morte — ou Grande Milagre Escape queimando 3 presságios. O diálogo de rolagem lista tormentos e maldições ativos para aplicar cancelamento com um clique.

---

## Cavaleiros do Apocalipse

Acumule 6 desgraças e o encontro com um Cavaleiro é inevitável. O sistema abre o diálogo de maldição automaticamente, rola na tabela do Cavaleiro anunciado pelo GM e registra a maldição permanente na ficha. Segunda vez com 6 desgraças: morte.

---

## Grupo & Presságios

O ator Grupo rastreia o dia atual (1–7), o pool diário de presságios e os Cavaleiros anunciados. O GM rola 1d6 no início de cada dia para determinar quantos presságios o grupo tem — e qualquer jogador pode gastar um para rerolar um dado durante uma ação.

---

## Caídos & Colossos

Fichas de Caídos com dificuldade ajustável e absorção de alma no golpe final. Colossos têm grid de naipes (copas, espadas, ouros, paus) — cada desgraça revela uma carta, cada carta derrotada vira um Ritual para o grupo absorver.

---

## Oráculo & Caos

Macros prontas instaladas automaticamente para o GM: Pergunta ao Destino (1d6 sim/não), Ideia (2d6 verbo+substantivo), e cinco tabelas de Caos (Desgraça, Neutro, PNJ Confronto, PNJ Comportamento, Orações). Suporte ao modo **Infærnaculum** — substitui dados por cartas.

---

## Compendiums incluídos

- **Cavaleiros do Apocalipse** — maldições dos 4 Cavaleiros (JournalEntries)
- **Tabelas Aleatórias** — Sorte, Azar, Bênçãos, Tralhas, Dádivas, Dívidas, Paranoias, Passado
- **Cenários** — Cyfærnum (cenário alternativo cyberpunk)

---

## ✅ Funcionalidades completas

### Fichas

- Personagem — sorte, azar, desgraças, tormentos, maldições, paranoias, bênção, tralhas, almas
- Caído — dificuldade, tormentos que causa, absorver alma no golpe final
- Colosso — grid de naipes, partes, absorção de rituais
- Grupo — tracker dia 1–7, presságios diários, Cavaleiros anunciados

### Mecânica

- Motor 3d6 com cancelamento sorte/azar/tormento/maldição
- Diálogo de ação com checkboxes de influências ativas
- Rerolar via presságio com diálogo de seleção de dado
- Queimar alma para melhorar resultado
- Encontro com Cavaleiro automático aos 6 desgraças
- Modo Cartas (Infærnaculum) alternativo a dados

### Suplementos (toggles nas configurações)

- Fendas — dungeons procedurais com dificuldades e salvação
- Paranoias — stacking até 3; 3ª vira segundo azar
- Pactos — dádiva diária + dívida, reset automático por dia
- Almas — coletadas de Caídos, queimadas para shift de resultado
- Colossos — grid de cartas por naipe
- Domínios — cavaleiro servido por personagem
- Territórios — mapa hex de cartas
- Arcanos — tabela de Arcanos integrada

### Ferramentas narrativas

- Pergunta ao Destino (1d6 sim/não com matiz)
- Ideia (2d6 verbo + substantivo das tabelas de sorte/azar)
- 5 tabelas de Caos roladas direto no chat
- Macros criadas automaticamente em pastas organizadas no primeiro login do GM

### Cenários

- **Padrão** — Old Infærnum base
- **Domínios** — personagens servem a um Cavaleiro
- **Cyfærnum** — estética cyberpunk; Caídos→Agentes, Almas→Downloads
- **Personalizado** — sem restrições

### Visual

- 3 temas: Escuro (padrão), Medieval (sépia), Cyberpunk (néon)
- Temas por cliente (não afeta outros jogadores)

---

## 📦 Instalação

1. Abra o Foundry VTT
2. Vá em **Configurações → Gerenciar Sistemas → Instalar Sistema**
3. Cole no campo _Manifest URL_:

   ```text
   https://raw.githubusercontent.com/SergioSJS/infaernum-rpg-fvtt/main/system.json
   ```

4. Clique em **Instalar**

---

## 💻 Desenvolvimento Local

```bash
git clone https://github.com/SergioSJS/infaernum-rpg-fvtt.git
cd infaernum-rpg-fvtt
npm install

# Mac/Linux — symlink para o Foundry
ln -s "$(pwd)" "$HOME/Library/Application Support/FoundryVTT/Data/systems/infaernum"

# Windows (CMD como Administrador)
mklink /D "%APPDATA%\FoundryVTT\Data\systems\infaernum" "C:\Caminho\Para\infaernum-rpg-fvtt"
```

Reinicie o Foundry e o sistema aparecerá na lista.

### Scripts

| Script | O que faz |
|--------|-----------|
| `npm run build:css` | Compila SCSS → CSS |
| `npm run watch:css` | Hot-reload do CSS |
| `npm run lint` | ESLint no código |
| `npm run pack:build` | Constrói os 3 compendiums (LevelDB) |

---

## 🚀 Publicando uma Nova Versão

O projeto usa GitHub Actions para gerar releases automaticamente.  
Basta criar e enviar uma tag semântica:

```bash
git tag v1.0.0
git push origin v1.0.0
```

O CI irá:

1. Atualizar `system.json` com a nova versão e URL de download
1. Empacotar `infaernum.zip` com todos os arquivos do sistema
1. Criar o GitHub Release com o zip e o `system.json` como artefatos

---

## Compatibilidade

| Foundry VTT | Status |
|-------------|--------|
| v13         | ✅ Suportado |
| v14         | ✅ Verificado |

---

## 📋 Licença e Créditos

- Este repositório está sob [CC BY-NC-SA 4.0](LICENSE) — uso não-comercial, atribuição obrigatória, compartilhamento igual.
- Sistema **Old Infærnum** criado por Raul Volpato — todo o conteúdo narrativo e de regras pertence a ele.
- Feito por **Sérgio Sousa** — [meioorc.com](https://meioorc.com)
