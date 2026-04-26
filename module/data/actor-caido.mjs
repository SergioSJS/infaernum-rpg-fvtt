const { fields } = foundry.data;

export class CaidoData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      descricao:         new fields.HTMLField({ initial: "", label: "INFAERNUM.Caido.Descricao" }),
      aparencia:         new fields.StringField({ initial: "", label: "INFAERNUM.Caido.Aparencia" }),
      dificuldade:       new fields.NumberField({ integer: true, min: 0, initial: 0, label: "INFAERNUM.Caido.Dificuldade" }),
      dificuldade_atual: new fields.NumberField({ integer: true, min: 0, initial: 0, label: "INFAERNUM.Caido.DificuldadeAtual" }),
      habilidades:       new fields.ArrayField(new fields.StringField(), { initial: [], label: "INFAERNUM.Caido.Habilidades" }),
      cavaleiro:         new fields.StringField({ initial: "", blank: true, choices: ["", "peste", "guerra", "fome", "morte"], label: "INFAERNUM.Caido.Cavaleiro" }),
      anotacoes:         new fields.HTMLField({ initial: "", label: "INFAERNUM.Caido.Anotacoes" }),
    };
  }

  get tormentosCausados() {
    return this.parent?.items?.filter(i => i.type === "tormento") ?? [];
  }

  get derrotado() {
    return this.dificuldade_atual <= 0 && this.dificuldade > 0;
  }
}
