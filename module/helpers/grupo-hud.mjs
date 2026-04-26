// Old Infærnum — HUD presságios/dia (mesmo padrão do fractal clock-panel)
// Monta em #ui-right-column-1, abaixo do painel narrativo.

export class GrupoHUD {
  #el = null;
  #bound = false;

  render() {
    const grupo = game.actors?.find(a => a.type === "grupo");

    if (!this.#el) {
      this.#el = document.createElement("div");
      this.#el.id = "inf-grupo-hud";
      const target = document.querySelector("#ui-right-column-1") ?? document.body;
      // Insert after inf-narrative-panel if it exists, otherwise prepend
      const narrativa = target.querySelector("#inf-narrative-panel");
      if (narrativa) narrativa.after(this.#el);
      else target.prepend(this.#el);
    }

    if (!grupo) {
      this.#el.style.display = "none";
      return;
    }

    this.#el.style.display = "block";
    const sys = grupo.system;
    const dia = sys.dia_atual || 0;
    const disponiveis = sys.presagiosDisponiveis ?? 0;
    const total = sys.presagios_totais ?? 0;

    const diaLabels = ["—", "I", "II", "III", "IV", "V", "VI", "VII"];

    const pips = Array.from({ length: total }, (_, i) =>
      `<div class="inf-hud-pip ${i < (sys.presagios_usados ?? 0) ? "inf-hud-pip--gasto" : ""}"></div>`
    ).join("");

    this.#el.innerHTML = `
      <div class="inf-hud-inner">
        <div class="inf-hud-dia">
          <span class="inf-hud-dia-label">Dia</span>
          <span class="inf-hud-dia-num">${diaLabels[dia] ?? "—"}</span>
        </div>
        <div class="inf-hud-presagio">
          <span class="inf-hud-presagio-label">Presságios</span>
          <div class="inf-hud-pips">${pips || "<span class=\"inf-hud-sem-presagios\">—</span>"}</div>
          ${total ? `<span class="inf-hud-presagio-count">${disponiveis}/${total}</span>` : ""}
        </div>
      </div>
    `;

    if (!this.#bound) {
      this.#bound = true;
      this.#el.addEventListener("click", () => grupo.sheet?.render(true));
      this.#el.title = `${grupo.name} — clique para abrir`;
    }
  }
}

export const grupoHUD = new GrupoHUD();
