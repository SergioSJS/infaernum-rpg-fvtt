// Quench tests for roll-resolver.mjs
// Run in Foundry with the Quench module installed.
// Hooks.on("quenchReady") is called by Quench after Foundry is ready.
import { resolverRolagem3d6, classificarDado, resolverPergunta1d6 } from "../dice/roll-resolver.mjs";

Hooks.on("quenchReady", (quench) => {
  quench.registerBatch("infaernum.diceResolver", (context) => {
    const { describe, it, assert } = context;

    describe("classificarDado", () => {
      it("1 → desgraca",  () => assert.equal(classificarDado(1), "desgraca"));
      it("2 → neutro",   () => assert.equal(classificarDado(2), "neutro"));
      it("3 → neutro",   () => assert.equal(classificarDado(3), "neutro"));
      it("4 → facanha",  () => assert.equal(classificarDado(4), "facanha"));
      it("5 → facanha",  () => assert.equal(classificarDado(5), "facanha"));
      it("6 → milagre",  () => assert.equal(classificarDado(6), "milagre"));
    });

    describe("resolverPergunta1d6", () => {
      it("1 → não",     () => assert.equal(resolverPergunta1d6(1).resposta, "não"));
      it("2 → não",     () => assert.equal(resolverPergunta1d6(2).resposta, "não"));
      it("3 → sim fraco", () => { const r = resolverPergunta1d6(3); assert.equal(r.resposta, "sim"); assert.equal(r.forte, false); });
      it("5 → sim forte", () => { const r = resolverPergunta1d6(5); assert.equal(r.resposta, "sim"); assert.equal(r.forte, true);  });
      it("6 → sim forte", () => { const r = resolverPergunta1d6(6); assert.equal(r.resposta, "sim"); assert.equal(r.forte, true);  });
    });

    describe("resolverRolagem3d6 — sem sorte/azar", () => {
      it("tudo neutro: 3 neutros, 0 resto", () => {
        const r = resolverRolagem3d6({ dados: [2, 3, 2], temSorte: false, temAzar: false });
        assert.equal(r.numNeutros,   3);
        assert.equal(r.numDesgracas, 0);
        assert.equal(r.numFacanhas,  0);
        assert.equal(r.numMilagres,  0);
        assert.equal(r.morte,        false);
      });

      it("misto: 1 desgraca, 1 facanha, 1 milagre", () => {
        const r = resolverRolagem3d6({ dados: [1, 5, 6], temSorte: false, temAzar: false });
        assert.equal(r.numDesgracas, 1);
        assert.equal(r.numFacanhas,  1);
        assert.equal(r.numMilagres,  1);
        assert.equal(r.morte,        false);
      });

      it("666 → morte", () => {
        const r = resolverRolagem3d6({ dados: [6, 6, 6], temSorte: false, temAzar: false });
        assert.equal(r.morte, true);
        assert.equal(r.numMilagres, 3);
      });

      it("111 → 3 desgraças, sem morte", () => {
        const r = resolverRolagem3d6({ dados: [1, 1, 1], temSorte: false, temAzar: false });
        assert.equal(r.numDesgracas, 3);
        assert.equal(r.morte,        false);
      });
    });

    describe("resolverRolagem3d6 — com sorte (milagres cancelam desgraças)", () => {
      it("1 desgraca + 1 milagre → sorte cancela: 0 desgraças, 0 milagres effective", () => {
        const r = resolverRolagem3d6({ dados: [1, 6, 3], temSorte: true, temAzar: false });
        assert.equal(r.numDesgracas, 0);
        // milagres retain value; desgraças removed
        assert.equal(r.numNeutros,   1);
      });

      it("2 desgraças + 1 milagre → cancela 1, resta 1 desgraca", () => {
        const r = resolverRolagem3d6({ dados: [1, 1, 6], temSorte: true, temAzar: false });
        assert.equal(r.numDesgracas, 1);
        assert.equal(r.numMilagres,  1);
      });

      it("666 com sorte → não é morte", () => {
        const r = resolverRolagem3d6({ dados: [6, 6, 6], temSorte: true, temAzar: false });
        assert.equal(r.morte, false);
      });
    });

    describe("resolverRolagem3d6 — com azar (desgraças cancelam milagres)", () => {
      it("1 milagre + 1 desgraca → azar cancela milagre", () => {
        const r = resolverRolagem3d6({ dados: [6, 1, 3], temSorte: false, temAzar: true });
        assert.equal(r.numMilagres,  0);
        assert.equal(r.numDesgracas, 1);
      });

      it("2 milagres + 1 desgraca → cancela 1, resta 1 milagre", () => {
        const r = resolverRolagem3d6({ dados: [6, 6, 1], temSorte: false, temAzar: true });
        assert.equal(r.numMilagres,  1);
        assert.equal(r.numDesgracas, 1);
      });
    });

    describe("resolverRolagem3d6 — sorte + azar simultaneamente", () => {
      it("nenhum cancelamento quando ambos ativos", () => {
        const r = resolverRolagem3d6({ dados: [1, 6, 3], temSorte: true, temAzar: true });
        assert.equal(r.numDesgracas, 1);
        assert.equal(r.numMilagres,  1);
      });
    });
  }, { displayName: "Infærnum — Motor de Dados (DiceResolver)" });
});
