import { rolarPergunta } from "../tables/destino.mjs";
import { drawPergunta, formatCarta } from "./card-strategy.mjs";

const { DialogV2 } = foundry.applications.api;

const INTENSIDADE_LABEL = {
  1: "com extrema certeza",
  2: "com certeza",
  3: "provavelmente",
  4: "talvez",
  5: "dificilmente",
  6: "jamais",
};

export async function openPerguntaDialog() {
  const content = `
    <div class="inf-dialog inf-dialog--pergunta">
      <div class="field-group">
        <label>Pergunta</label>
        <input type="text" name="pergunta" placeholder="O que você quer saber?" autofocus />
      </div>
      <div class="field-group">
        <label>Probabilidade</label>
        <select name="provavel">
          <option value="">Neutro (1d6)</option>
          <option value="sim">Sim mais provável (1d6+1)</option>
          <option value="nao">Não mais provável (1d6−1)</option>
        </select>
      </div>
    </div>`;

  const formData = await DialogV2.wait({
    window: { title: "Pergunta ao Destino (1d6)" },
    content,
    rejectClose: false,
    buttons: [
      {
        action:   "rolar",
        label:    "⚀ Rolar",
        default:  true,
        callback: (_ev, _btn, dialog) => {
          const form = dialog.element?.querySelector("form");
          if (!form) return null;
          const raw = Object.fromEntries(new FormData(form));
          return { pergunta: raw.pergunta ?? "", provavel: raw.provavel || null };
        },
      },
      { action: "cancel", label: "Cancelar" },
    ],
  });

  if (!formData || typeof formData !== "object") return;

  const { pergunta, provavel } = formData;
  const modoCartas = game.settings.get("infaernum", "modoAleatorio") === "cartas";

  let conteudo;

  if (modoCartas) {
    const draw = drawPergunta(provavel);
    const cartasHtml = draw.cartas.map(c =>
      `<span class="dado dado--neutro">${formatCarta(c)}</span>`
    ).join("");
    const resClasse = draw.resposta === "sim" ? "res-milagre" : "res-desgraca";
    conteudo = `<div class="infaernum-chat-message">
      <div class="chat-header">${pergunta ? `<em>${pergunta}</em>` : "Pergunta ao Destino"}</div>
      <div class="chat-dados">${cartasHtml}</div>
      <div class="chat-resultado"><span class="${resClasse} pergunta-resp">${draw.resposta.toUpperCase()}</span></div>
    </div>`;
  } else {
    const r = rolarPergunta(provavel);
    const dadoClasse = r.resposta === "sim" ? "milagre" : "desgraca";
    const resClasse  = r.resposta === "sim" ? "res-milagre" : "res-desgraca";
    const intensLabel = INTENSIDADE_LABEL[r.intensidade] ?? "";
    const modLabel = provavel === "sim" ? " (+1)" : provavel === "nao" ? " (−1)" : "";
    conteudo = `<div class="infaernum-chat-message">
      <div class="chat-header">${pergunta ? `<em>${pergunta}</em>` : "Pergunta ao Destino"}</div>
      <div class="chat-dados"><span class="dado ${dadoClasse}">${r.dado}</span><span class="chat-descricao">${modLabel}</span></div>
      <div class="chat-resultado">
        <span class="${resClasse} pergunta-resp">${r.resposta.toUpperCase()}</span>
        <span class="pergunta-intensidade">${intensLabel}</span>
      </div>
    </div>`;
  }

  await ChatMessage.create({ content: conteudo, sound: CONFIG.sounds.dice });
}
