import { VERBOS, SUBSTANTIVOS, NAIPE_SIMBOLO, naipeParaDado } from "../tables/infaernaculum.mjs";

const NAIPES  = ["ouros", "copas", "espadas", "paus"];
const VALORES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function _criarBaralho() {
  const deck = [];
  for (const naipe of NAIPES) {
    for (const valor of VALORES) {
      deck.push({ naipe, valor });
    }
  }
  return deck;
}

function _puxar(deck) {
  const idx = Math.floor(Math.random() * deck.length);
  return deck.splice(idx, 1)[0];
}

/**
 * Draw 3 cards for a 3d6-equivalent action roll.
 * Returns { cartas, dados } where `dados` is number array compatible with roll-resolver.
 */
export function drawAcao() {
  const deck = _criarBaralho();
  const cartas = [_puxar(deck), _puxar(deck), _puxar(deck)];
  const dados   = cartas.map(c => naipeParaDado(c.naipe));
  return { cartas, dados };
}

/**
 * Draw 1 card for a 1d6-equivalent yes/no question.
 * Returns { carta, resposta: "sim"|"não" }
 */
export function drawPergunta(provavel = null) {
  const deck = _criarBaralho();
  if (provavel) {
    const c1 = _puxar(deck);
    const c2 = _puxar(deck);
    const preto = ["espadas", "paus"];
    if (provavel === "sim") {
      const sim = preto.includes(c1.naipe) || preto.includes(c2.naipe);
      return { cartas: [c1, c2], resposta: sim ? "sim" : "não" };
    }
    // provavel === "não"
    const vermelho = ["ouros", "copas"];
    const nao = vermelho.includes(c1.naipe) || vermelho.includes(c2.naipe);
    return { cartas: [c1, c2], resposta: nao ? "não" : "sim" };
  }
  const carta = _puxar(deck);
  const preto = ["espadas", "paus"];
  return { cartas: [carta], resposta: preto.includes(carta.naipe) ? "sim" : "não" };
}

/**
 * Draw 2 cards for 2d6-equivalent idea generation.
 * Returns { cartaVerbo, cartaSubst, verbo, substantivo }
 */
export function drawIdeia() {
  const deck = _criarBaralho();
  const cartaVerbo  = _puxar(deck);
  // Reshuffle first and draw again for substantivo
  const deck2 = _criarBaralho();
  const cartaSubst  = _puxar(deck2);

  const verbo       = VERBOS[cartaVerbo.naipe]?.[cartaVerbo.valor]   ?? cartaVerbo.valor;
  const substantivo = SUBSTANTIVOS[cartaSubst.naipe]?.[cartaSubst.valor] ?? cartaSubst.valor;

  return { cartaVerbo, cartaSubst, verbo, substantivo };
}

/**
 * Format a card for display: e.g. "♦ 7"
 */
export function formatCarta(carta) {
  return `${NAIPE_SIMBOLO[carta.naipe]} ${carta.valor}`;
}
