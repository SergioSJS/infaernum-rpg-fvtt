// Verb + substantivo tables from PDF p.50-51
// Keys: suit → {card_value: word}

const VALORES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function _buildSuitMap(words) {
  return Object.fromEntries(VALORES.map((v, i) => [v, words[i]]));
}

export const VERBOS = {
  ouros:   _buildSuitMap(["mudar", "expor", "imitar", "bloquear", "tomar", "esconder", "iludir", "recusar", "controlar", "perseguir", "emboscar", "vingar", "perder"]),
  copas:   _buildSuitMap(["terminar", "julgar", "diminuir", "trair", "pausar", "finalizar", "ignorar", "separar", "abandonar", "oprimir", "enganar", "fracassar", "prejudicar"]),
  espadas: _buildSuitMap(["ganhar", "começar", "encontrar", "descobrir", "conhecer", "facilitar", "conquistar", "aumentar", "recompensar", "unir", "conseguir", "guiar", "libertar"]),
  paus:    _buildSuitMap(["pacificar", "curar", "proteger", "ajudar", "aceitar", "criar", "planejar", "resgatar", "esperar", "sonhar", "investigar", "fazer", "fortalecer"]),
};

export const SUBSTANTIVOS = {
  ouros:   _buildSuitMap(["ambiente", "aliança", "inimigo", "confronto", "dor", "mentira", "poder", "problema", "lar", "caminho", "doença", "morte", "falha"]),
  copas:   _buildSuitMap(["atenção", "ferimento", "ilusão", "raiva", "pista", "clima", "boato", "caído", "fé", "viagem", "riqueza", "animal", "negócio"]),
  espadas: _buildSuitMap(["medo", "solidão", "esperança", "verdade", "perigo", "cilada", "prova", "vazio", "objetivo", "sucesso", "liderança", "pista", "ódio"]),
  paus:    _buildSuitMap(["informação", "sentimento", "sentidos", "traição", "descanso", "paz", "plano", "separação", "abandono", "opressão", "engano", "fracasso", "derrota"]),
};

export const NAIPE_SIMBOLO = {
  ouros:   "♦",
  copas:   "♥",
  espadas: "♠",
  paus:    "♣",
};

// 3d6 mapping: paus=desgraça, ouros=neutro, espadas=façanha, copas=milagre
export function naipeParaResultado(naipe) {
  if (naipe === "paus")   return "desgraca";
  if (naipe === "ouros")  return "neutro";
  if (naipe === "espadas") return "facanha";
  return "milagre"; // copas
}

// Convert card result to dice-equivalent value for resolver
export function naipeParaDado(naipe) {
  if (naipe === "paus")    return 1;
  if (naipe === "ouros")   return 2;
  if (naipe === "espadas") return 4;
  return 6; // copas
}
