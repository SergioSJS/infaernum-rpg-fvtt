// Old Infærnum — 2d6 tables for ideias (PDF p.12-14)
// Index: VERBOS[d1][d2] and VERBOS[d2][d1] give two options

export const VERBOS = {
  1: { 1:"ignorar",  2:"descobrir",  3:"começar",  4:"bloquear", 5:"ganhar",   6:"perseguir" },
  2: { 1:"julgar",   2:"fazer",      3:"terminar", 4:"vingar",   5:"imitar",   6:"iludir"    },
  3: { 1:"esconder", 2:"conquistar", 3:"aumentar", 4:"guiar",    5:"oprimir",  6:"ajudar"    },
  4: { 1:"proteger", 2:"pacificar",  3:"diminuir", 4:"expor",    5:"emboscar", 6:"controlar" },
  5: { 1:"mudar",    2:"encontrar",  3:"tomar",    4:"planejar", 5:"criar",    6:"recusar"   },
  6: { 1:"conhecer", 2:"curar",      3:"pausar",   4:"perder",   5:"trair",    6:"aceitar"   },
};

export const SUBSTANTIVOS = {
  1: { 1:"ambiente",   2:"poder",    3:"falha",     4:"clima",   5:"animal",    6:"perigo"   },
  2: { 1:"aliança",    2:"problema", 3:"atenção",   4:"boato",   5:"negócio",   6:"cilada"   },
  3: { 1:"inimigo",    2:"lar",      3:"ferimento", 4:"caído",   5:"medo",      6:"prova"    },
  4: { 1:"confronto",  2:"caminho",  3:"ilusão",    4:"fé",      5:"solidão",   6:"vazio"    },
  5: { 1:"dor",        2:"doença",   3:"raiva",     4:"viagem",  5:"esperança", 6:"objetivo" },
  6: { 1:"mentira",    2:"morte",    3:"pista",     4:"riqueza", 5:"verdade",   6:"sucesso"  },
};

function d6() { return Math.ceil(Math.random() * 6); }

export function rolarIdeia() {
  const v1 = d6(), v2 = d6();
  const s1 = d6(), s2 = d6();
  return {
    verboDados:  [v1, v2],
    verboA:      VERBOS[v1][v2],
    verboB:      VERBOS[v2][v1],
    substDados:  [s1, s2],
    substA:      SUBSTANTIVOS[s1][s2],
    substB:      SUBSTANTIVOS[s2][s1],
  };
}

export function rolarPergunta(provavel = null) {
  let dado = d6();
  if (provavel === "sim") dado = Math.min(6, dado + 1);
  if (provavel === "nao") dado = Math.max(1, dado - 1);
  const resposta = dado >= 4 ? "sim" : "não";
  const intensidade = dado >= 4 ? dado : 7 - dado; // 1-3 intensity (3=very, 1=barely)
  return { dado, resposta, intensidade, provavel };
}
