// Old Infærnum — Caos tables (PDF p.44-45)

export const CAOS = {
  desgraca: [
    "Novo fato ou elemento entra em cena — por que é ruim?",
    "Algo ruim relacionado a elemento já em cena",
    "Situação muito pior que aparentava — por quê?",
    "Algum personagem sofre tormento superficial",
    "PNJ afetado severamente por algo",
    "Algum personagem sofre tormento grave",
  ],
  vislumbre: [
    "Algo oculto é revelado",
    "PNJ ou grupo entra em cena",
    "Algo no ambiente chama atenção",
    "Cena alterada por novo fato",
    "Algo relacionado a elemento já em cena",
    "Algo extremamente inesperado",
  ],
  pnj_confronto: [
    "Atacará com todas as forças",
    "Habilidade ou poder inexplicável",
    "Tentará se defender a qualquer custo",
    "Agirá de modo inesperado — por quê?",
    "Usará artimanhas para atacar de surpresa",
    "Manifestará novo poder ainda não utilizado",
  ],
  pnj_comportamento: [
    "Hostil (pode ser violento)",
    "Discordante (pensa de modo oposto)",
    "Indiferente (não demonstra interesse)",
    "Curioso (puxa conversa)",
    "Amigável (disposto a ouvir e opinar)",
    "Prestativo (disposto a ajudar)",
  ],
  oracoes: [
    "Lidar com ninho de caídos — portal deve ser fechado",
    "Alguém raptado — investigação e resgate",
    "Caído solitário num local — eliminar",
    "Caído perigosíssimo — capturar",
    "Boato sobre fenda — investigar",
    "Colosso tomou território — o que fazer?",
  ],
};

export const CAOS_LABELS = {
  desgraca:          "O que acontece ao rolar desgraça?",
  vislumbre:            "O que acontece ao rolar vislumbre?",
  pnj_confronto:     "O que um PNJ fará durante confronto?",
  pnj_comportamento: "Comportamento inicial de PNJ",
  oracoes:           "Objetivo de súplica no quadro de orações",
};

export function rolarCaos(tabela) {
  const entries = CAOS[tabela];
  if (!entries) return null;
  const idx = Math.floor(Math.random() * 6);
  return { dado: idx + 1, resultado: entries[idx], label: CAOS_LABELS[tabela] };
}

export async function rolarCaosChat(tabela) {
  const r = rolarCaos(tabela);
  if (!r) return;
  const content = `<div class="infaernum-chat-message infaernum-caos-msg">
    <div class="chat-header caos-label">${r.label}</div>
    <div class="caos-dado"><span class="dado dado--vislumbre">${r.dado}</span></div>
    <p class="caos-resultado">${r.resultado}</p>
  </div>`;
  await ChatMessage.create({ content, sound: CONFIG.sounds.dice });
}
