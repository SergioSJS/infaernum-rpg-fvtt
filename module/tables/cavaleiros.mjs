/**
 * Canonical maldição data for the 4 Cavaleiros.
 * Source: Old Infærnum PDF p.24-27 / RULES-MAPPING §3.3
 * Index 0 = 1d6 result 1, index 5 = result 6.
 */
export const MALDICOES = {
  peste: [
    "Língua derrete, torna-se sangue. Pecado jamais virá pela voz.",
    "Tímpanos sangram até que o estampido cesse. Silêncio te acompanhará.",
    "Chagas abrem em cada mão. Feridas jamais se fecharão.",
    "Chagas abrem em cada pé. Sangue perseguirá seus passos.",
    "Cavidades oculares vazam sangue. Pela visão não pecarás.",
    "Todos estão imundos. Você é ferramenta da Peste.",
  ],
  guerra: [
    "Um braço separado da vida pelo gume da Guerra.",
    "Uma perna separada da vida pelo gume da Guerra.",
    "Alguém deve morrer sempre. Por suas mãos, a Guerra continuará.",
    "Você passa a suar sangue. A dor será sempre intensa.",
    "Caídos te perseguem para guerrear. Um após o outro, eles sempre virão.",
    "Não há inocentes. Todos devem ser destruídos.",
  ],
  fome: [
    "A pior lepra recai sobre você. As marcas do pecado te seguirão.",
    "Nada mais para no estômago. A Fome será eterna.",
    "Cabelos e unhas caem, pele coça e queima numa ardência sangrenta.",
    "Sangue vaza sob a pele formando bolsões de pus.",
    "Um caído faminto te segue como sombra. Será preciso alimentá-lo.",
    "A Fome exige um banquete de almas. Você precisará caçá-las.",
  ],
  morte: [
    "Você foi marcado pela Morte. Sua alma permanecerá nesse corpo putrificado.",
    "A cena da sua própria morte te atormenta ao fechar os olhos.",
    "A Terra Prometida não aceitará sua alma, a menos que você mate o Dragão.",
    "A resposta está nos quatro animais. Apresente a Morte e tome o trono.",
    "A Morte tomará a terra da promessa. O exército dos cavaleiros brancos deve cair.",
    "Seu corpo morrerá, sempre. Tome outros corpos desalmados para prosseguir.",
  ],
};

export const CAVALEIROS = ["peste", "guerra", "fome", "morte"];

/**
 * Get maldição text for a cavaleiro + 1d6 result.
 * @param {"peste"|"guerra"|"fome"|"morte"} cavaleiro
 * @param {number} indice - 1 to 6
 * @returns {string}
 */
export function getMaldicao(cavaleiro, indice) {
  return MALDICOES[cavaleiro]?.[indice - 1] ?? "";
}
