import { rolarIdeia } from "../tables/destino.mjs";
import { drawIdeia, formatCarta } from "./card-strategy.mjs";

export async function openIdeiaDialog() {
  const modoCartas = game.settings.get("infaernum", "modoAleatorio") === "cartas";
  let conteudo;

  if (modoCartas) {
    const r = drawIdeia();
    const cv = formatCarta(r.cartaVerbo);
    const cs = formatCarta(r.cartaSubst);
    conteudo = `<div class="infaernum-chat-message infaernum-ideia-msg">
      <div class="chat-header">Ideia (Infærnaculum)</div>
      <div class="ideia-grid">
        <div class="ideia-col">
          <span class="ideia-dado"><span class="dado dado--facanha">${cv}</span></span>
          <span class="ideia-word ideia-verbo">${r.verbo}</span>
          <span class="ideia-role">verbo</span>
        </div>
        <span class="ideia-plus">+</span>
        <div class="ideia-col">
          <span class="ideia-dado"><span class="dado dado--milagre">${cs}</span></span>
          <span class="ideia-word ideia-subst">${r.substantivo}</span>
          <span class="ideia-role">substantivo</span>
        </div>
      </div>
    </div>`;
  } else {
    const r = rolarIdeia();
    const [v1, v2] = r.verboDados;
    const [s1, s2] = r.substDados;
    conteudo = `<div class="infaernum-chat-message infaernum-ideia-msg">
      <div class="chat-header">Ideia (2d6)</div>
      <div class="ideia-grid">
        <div class="ideia-col">
          <span class="ideia-dado">
            <span class="dado dado--facanha">${v1}</span>
            <span class="dado dado--facanha">${v2}</span>
          </span>
          <span class="ideia-options">
            <span class="ideia-word ideia-verbo">${r.verboA}</span>
            <span class="ideia-ou">ou</span>
            <span class="ideia-word ideia-verbo ideia-alt">${r.verboB}</span>
          </span>
          <span class="ideia-role">verbo</span>
        </div>
        <span class="ideia-plus">+</span>
        <div class="ideia-col">
          <span class="ideia-dado">
            <span class="dado dado--milagre">${s1}</span>
            <span class="dado dado--milagre">${s2}</span>
          </span>
          <span class="ideia-options">
            <span class="ideia-word ideia-subst">${r.substA}</span>
            <span class="ideia-ou">ou</span>
            <span class="ideia-word ideia-subst ideia-alt">${r.substB}</span>
          </span>
          <span class="ideia-role">substantivo</span>
        </div>
      </div>
      <p class="ideia-hint">Escolha uma opção de cada coluna e interprete.</p>
    </div>`;
  }

  await ChatMessage.create({ content: conteudo, sound: CONFIG.sounds.dice });
}
