export const ARCANOS = [
  { indice: "0",    nome: "O Louco (Andarilho)",       verbos: ["mudar", "confiar"],       substantivos: ["jornada", "confiança"],    adjetivos: ["insano", "confiável"]        },
  { indice: "I",    nome: "O Mago",                    verbos: ["controlar", "conhecer"],  substantivos: ["estratégia", "astúcia"],   adjetivos: ["inteligente", "adaptável"]   },
  { indice: "II",   nome: "A Sacerdotisa",             verbos: ["perceber", "reconhecer"], substantivos: ["sonho", "segredo"],        adjetivos: ["oculto", "profundo"]         },
  { indice: "III",  nome: "A Imperatriz",              verbos: ["crescer", "fortalecer"],  substantivos: ["intuição", "sabedoria"],   adjetivos: ["independente", "sábio"]      },
  { indice: "IV",   nome: "O Imperador",               verbos: ["conquistar", "liderar"],  substantivos: ["domínio", "conquista"],   adjetivos: ["implacável", "superior"]     },
  { indice: "V",    nome: "O Hierofante (Papa)",       verbos: ["ordenar", "reunir"],      substantivos: ["tradição", "fé"],          adjetivos: ["valoroso", "espiritual"]     },
  { indice: "VI",   nome: "Os Enamorados",             verbos: ["escolher", "contradizer"],substantivos: ["dúvida", "probabilidade"],adjetivos: ["incerto", "contraditório"]   },
  { indice: "VII",  nome: "A Carruagem",               verbos: ["avançar", "progredir"],   substantivos: ["movimento", "ritmo"],     adjetivos: ["racional", "experiente"]     },
  { indice: "VIII", nome: "A Justiça",                 verbos: ["revelar", "discernir"],   substantivos: ["conflito", "ordem"],      adjetivos: ["verdadeiro", "justo"]        },
  { indice: "IX",   nome: "O Eremita",                 verbos: ["isolar", "fugir"],        substantivos: ["solidão", "fuga"],        adjetivos: ["sozinho", "prudente"]        },
  { indice: "X",    nome: "A Roda da Fortuna",         verbos: ["resolver", "melhorar"],   substantivos: ["solução", "sorte"],       adjetivos: ["afortunado", "evoluído"]     },
  { indice: "XI",   nome: "A Força",                   verbos: ["superar", "seduzir"],     substantivos: ["paixão", "razão"],        adjetivos: ["persistente", "resiliente"]  },
  { indice: "XII",  nome: "O Enforcado",               verbos: ["sacrificar", "alterar"],  substantivos: ["dor", "sacrifício"],      adjetivos: ["sacrificado", "renascido"]   },
  { indice: "XIII", nome: "A Morte",                   verbos: ["terminar", "transformar"],substantivos: ["fim", "transformação"],   adjetivos: ["mortal", "final"]            },
  { indice: "XIV",  nome: "A Temperança",              verbos: ["equilibrar", "pacificar"],substantivos: ["paz", "harmonia"],        adjetivos: ["equilibrado", "estável"]     },
  { indice: "XV",   nome: "O Diabo",                   verbos: ["enganar", "desejar"],     substantivos: ["desejo", "distração"],    adjetivos: ["mentiroso", "encantador"]    },
  { indice: "XVI",  nome: "A Torre (Casa de Deus)",    verbos: ["destruir", "retomar"],    substantivos: ["mudança", "destruição"],  adjetivos: ["trágico", "destrutivo"]      },
  { indice: "XVII", nome: "A Estrela",                 verbos: ["inspirar", "motivar"],    substantivos: ["força", "esperança"],     adjetivos: ["perseverante", "iluminado"]  },
  { indice: "XVIII",nome: "A Lua",                     verbos: ["iludir", "criar"],        substantivos: ["ritual", "ilusão"],       adjetivos: ["misterioso", "místico"]      },
  { indice: "XIX",  nome: "O Sol",                     verbos: ["aumentar", "proteger"],   substantivos: ["proteção", "grandeza"],   adjetivos: ["grandioso", "protegido"]     },
  { indice: "XX",   nome: "O Julgamento",              verbos: ["libertar", "renovar"],    substantivos: ["cura", "liberdade"],      adjetivos: ["liberto", "renovado"]        },
  { indice: "XXI",  nome: "O Mundo",                   verbos: ["desafiar", "vencer"],     substantivos: ["objetivo", "desafio"],    adjetivos: ["desafiador", "vitorioso"]    },
];

function _rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function _drawUnique(pool, n) {
  const copy = [...pool];
  const drawn = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * copy.length);
    drawn.push(copy.splice(idx, 1)[0]);
  }
  return drawn;
}

export async function puxarArcanoChat(quantidade = 1) {
  const drawn = _drawUnique(ARCANOS, quantidade);

  const linhas = drawn.map(a => `
    <div class="arcano-card">
      <div class="arcano-titulo"><strong>${a.indice} — ${a.nome}</strong></div>
      <div class="arcano-palavras">
        <span class="arcano-verbo">${_rand(a.verbos)}</span>
        <span class="arcano-sep">·</span>
        <span class="arcano-substantivo">${_rand(a.substantivos)}</span>
        <span class="arcano-sep">·</span>
        <span class="arcano-adjetivo">${_rand(a.adjetivos)}</span>
      </div>
    </div>`).join("");

  const content = `<div class="infaernum-chat-message">
    <div class="chat-header">🃏 Arcanos — ${quantidade} carta${quantidade > 1 ? "s" : ""}</div>
    ${linhas}
  </div>`;

  await ChatMessage.create({ content });
}

export async function explorarTerritorioDialog() {
  const territorios = game.items.filter(i => i.type === "territorio");
  if (!territorios.length) {
    ui.notifications.warn(game.i18n.localize("INFAERNUM.Territorio.SemTerritorios"));
    return;
  }

  const rows = territorios.map(t => {
    const s = t.system;
    const ctrl = s.controlador ? `<span class="badge badge--cavaleiro badge--${s.controlador}">${s.controlador}</span>` : "—";
    const rev = s.revelado ? "✓" : "○";
    return `<tr>
      <td>${rev}</td>
      <td><strong>${t.name}</strong></td>
      <td>${s.tipo || "—"}</td>
      <td>${ctrl}</td>
      <td>${s.coordenada_q}, ${s.coordenada_r}</td>
    </tr>`;
  }).join("");

  const content = `
    <table class="territorio-browser">
      <thead><tr><th>Rev.</th><th>Nome</th><th>Tipo</th><th>Controlador</th><th>Q, R</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;

  await foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.localize("INFAERNUM.Territorio.BrowserTitulo"), width: 560 },
    content,
    ok: { label: "Fechar", callback: () => {} },
  });
}
