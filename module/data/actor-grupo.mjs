const { fields } = foundry.data;

export class GrupoData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      dia_atual:             new fields.NumberField({ integer: true, min: 0, max: 7, initial: 0, label: "INFAERNUM.Grupo.DiaAtual" }),
      presagios_totais:      new fields.NumberField({ integer: true, min: 0, initial: 0, label: "INFAERNUM.Grupo.PresagiosTotais" }),
      presagios_usados:      new fields.NumberField({ integer: true, min: 0, initial: 0, label: "INFAERNUM.Grupo.PresagiosUsados" }),
      cavaleiros_anunciados: new fields.ArrayField(
        new fields.StringField({ choices: ["peste", "guerra", "fome", "morte"] }),
        { initial: [], label: "INFAERNUM.Grupo.CavaleiroAnunciados" }
      ),
      cenario:               new fields.StringField({
        initial: "padrao",
        choices: ["padrao", "dominios", "cyfaernum", "custom"],
        label: "INFAERNUM.Grupo.Cenario",
      }),
      anotacoes:             new fields.HTMLField({ initial: "", label: "INFAERNUM.Grupo.Anotacoes" }),
    };
  }

  get presagiosDisponiveis() {
    return Math.max(0, this.presagios_totais - this.presagios_usados);
  }

  get todosOsCavaleirosAnunciados() {
    return ["peste", "guerra", "fome", "morte"].every(c => this.cavaleiros_anunciados.includes(c));
  }
}
