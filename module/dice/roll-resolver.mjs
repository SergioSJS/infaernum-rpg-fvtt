/**
 * Pure 3d6 resolution — no FVTT dependencies.
 * Sorte:  milagres (6) cancel desgraças (1), one-for-one.
 * Azar:   desgraças (1) cancel milagres (6), one-for-one.
 * Both:   no cancellation (effects cancel each other).
 * 666 without sorte = morte.
 *
 * @param {object} opts
 * @param {number[]} opts.dados        Raw results [1-6]
 * @param {boolean}  opts.temSorte     After segundo_azar flip is applied
 * @param {boolean}  opts.temAzar      Includes tormentos + maldição
 * @returns {RolagemResult}
 */
export function resolverRolagem3d6({ dados, temSorte, temAzar }) {
  let desgracas = dados.filter(d => d === 1);
  let milagres  = dados.filter(d => d === 6);
  const neutros  = dados.filter(d => d >= 2 && d <= 3);
  const facanhas = dados.filter(d => d >= 4 && d <= 5);

  if (temSorte && !temAzar) {
    const n = Math.min(desgracas.length, milagres.length);
    desgracas = desgracas.slice(n);
    // milagres retain their value; only desgraças removed
  } else if (temAzar && !temSorte) {
    const n = Math.min(milagres.length, desgracas.length);
    milagres = milagres.slice(n);
  }

  const morte = milagres.length === 3 && dados.length === 3 && !temSorte;

  return {
    dados,
    desgracas,
    neutros,
    facanhas,
    milagres,
    numDesgracas: desgracas.length,
    numNeutros:   neutros.length,
    numFacanhas:  facanhas.length,
    numMilagres:  milagres.length,
    temSorte,
    temAzar,
    morte,
  };
}

/**
 * Classify a single d6 value for display.
 * @param {number} v
 * @returns {"desgraca"|"neutro"|"facanha"|"milagre"}
 */
export function classificarDado(v) {
  if (v === 1) return "desgraca";
  if (v <= 3)  return "neutro";
  if (v <= 5)  return "facanha";
  return "milagre";
}

/**
 * Resolve a 1d6 yes/no oracle question.
 * 1-2 = não; 3-4 = sim (fraco); 5-6 = sim (forte)
 * @param {number} v
 * @returns {{resposta: string, forte: boolean}}
 */
export function resolverPergunta1d6(v) {
  if (v <= 2) return { resposta: "não",  forte: false };
  if (v <= 4) return { resposta: "sim",  forte: false };
  return         { resposta: "sim",  forte: true  };
}

/**
 * Build a human-readable summary of a resolved 3d6 result.
 * @param {RolagemResult} res
 * @returns {string}
 */
export function resumoResultado(res) {
  if (res.morte) return "MORTE";
  const parts = [];
  if (res.numDesgracas)  parts.push(`${res.numDesgracas} desgraça${res.numDesgracas > 1 ? "s" : ""}`);
  if (res.numFacanhas)   parts.push(`${res.numFacanhas} façanha${res.numFacanhas > 1 ? "s" : ""}`);
  if (res.numMilagres)   parts.push(`${res.numMilagres} milagre${res.numMilagres > 1 ? "s" : ""}`);
  if (res.numNeutros && parts.length === 0) parts.push(`${res.numNeutros} neutro${res.numNeutros > 1 ? "s" : ""}`);
  return parts.join(", ") || "neutro";
}
