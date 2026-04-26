// Old Infærnum — Firmar Pacto (p.40–41)
// Invocação: oferta + 3d6 → ao menos 1 resultado 6. Senão, falhou.
// Se sucesso: 3d6 dádiva + 3d6 dívida → cria item pacto no personagem.

const { DialogV2 } = foundry.applications.api;
import { rolarDadivaPacto, rolarDividaPacto } from "../tables/paranoias.mjs";

export async function firmarPactoWizard() {
  const personagens = game.actors.filter(a => a.type === "personagem" && a.isOwner);
  if (!personagens.length) {
    ui.notifications.warn("Nenhum personagem disponível.");
    return;
  }

  // Escolher personagem se múltiplos
  let actor;
  if (personagens.length === 1) {
    actor = personagens[0];
  } else {
    const opts = personagens.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
    const pid = await DialogV2.prompt({
      window: { title: "Firmar Pacto" },
      content: `<div class="field-group"><label>Personagem</label><select name="pid">${opts}</select></div>`,
      ok: { label: "Continuar", callback: (_e, btn) => btn.form.elements.pid.value },
    });
    if (!pid) return;
    actor = game.actors.get(pid);
  }
  if (!actor) return;

  // Step 1: entidade + oferta
  const step1 = await DialogV2.wait({
    window: { title: "Firmar Pacto — Invocação" },
    content: `
      <div class="inf-dialog">
        <div class="field-group">
          <label>Entidade</label>
          <input type="text" name="entidade" placeholder="Nome da entidade..." autofocus />
        </div>
        <div class="field-group">
          <label>Oferta</label>
          <input type="text" name="oferta" placeholder="O que você oferece?" />
        </div>
        <p style="font-size:0.85rem;opacity:0.7;margin-top:8px">
          Requer ao menos 1 resultado 6 em 3d6 para sucesso.
        </p>
      </div>`,
    rejectClose: false,
    buttons: [
      {
        action: "invocar",
        label: "⚀ Invocar (3d6)",
        default: true,
        callback: (_e, _btn, dialog) => {
          const form = dialog.element?.querySelector("form");
          if (!form) return null;
          const d = new FormData(form);
          return { entidade: d.get("entidade") ?? "", oferta: d.get("oferta") ?? "" };
        },
      },
      { action: "cancel", label: "Cancelar" },
    ],
  });
  if (!step1 || typeof step1 !== "object") return;

  // Roll 3d6
  const roll = new Roll("3d6");
  await roll.evaluate();
  const dados = roll.dice[0].results.map(r => r.result);
  const temMilagre = dados.includes(6);
  const dadosHtml = dados.map(v => `<span class="dado ${v === 6 ? "milagre" : v >= 4 ? "facanha" : v >= 2 ? "" : "desgraca"}">${v}</span>`).join("");

  if (!temMilagre) {
    // Falhou
    await ChatMessage.create({
      content: `<div class="infaernum-chat-message">
        <div class="chat-header">☠ Pacto Falhou — ${step1.entidade || "Entidade desconhecida"}</div>
        <div class="chat-dados">${dadosHtml}</div>
        <div class="chat-resultado"><span class="res-desgraca">Nenhum 6 — invocação falhou.</span></div>
      </div>`,
      rolls: [roll],
      sound: CONFIG.sounds.dice,
    });
    return;
  }

  // Sucesso — rolar dádiva e dívida
  const dadiva  = rolarDadivaPacto();
  const divida  = rolarDividaPacto();

  // Confirmar
  const confirmado = await DialogV2.confirm({
    window: { title: "Pacto Estabelecido" },
    content: `
      <div class="infaernum-chat-message" style="font-size:1rem">
        <p><strong>Dádiva (${dadiva.total}):</strong> ${dadiva.descricao}</p>
        <p><strong>Dívida (${divida.total}):</strong> ${divida.descricao}</p>
        <p style="font-size:0.8rem;opacity:0.7">Confirmar criação do pacto em ${actor.name}?</p>
      </div>`,
    yes: { label: "Firmar Pacto" },
    no:  { label: "Cancelar" },
  });
  if (!confirmado) return;

  await actor.createEmbeddedDocuments("Item", [{
    name:   step1.entidade || "Pacto",
    type:   "pacto",
    system: {
      entidade:     step1.entidade,
      dadiva:       dadiva.descricao,
      divida:       divida.descricao,
      dadiva_usada: false,
      divida_paga:  false,
    },
  }]);

  await ChatMessage.create({
    content: `<div class="infaernum-chat-message">
      <div class="chat-header">✦ Pacto com ${step1.entidade || "Entidade"} — ${actor.name}</div>
      <div class="chat-dados">${dadosHtml}</div>
      <div class="chat-resultado"><span class="res-milagre">Pacto estabelecido!</span></div>
      <div class="chat-aviso"><strong>Dádiva:</strong> ${dadiva.descricao}</div>
      <div class="chat-aviso"><strong>Dívida:</strong> ${divida.descricao}</div>
    </div>`,
    rolls: [roll],
    sound: CONFIG.sounds.dice,
  });
}
