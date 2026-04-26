const { fields } = foundry.data;

export class MaldicaoData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      descricao: new fields.HTMLField({ initial: "", label: "INFAERNUM.Maldicao.Descricao" }),
      cavaleiro: new fields.StringField({
        initial: "", blank: true,
        choices: ["", "peste", "guerra", "fome", "morte"],
        label: "INFAERNUM.Maldicao.Cavaleiro",
      }),
      // Maldição é permanente; aplica azar como tormento mas não pode ser removida normalmente
      indice:    new fields.NumberField({ integer: true, min: 1, max: 6, initial: 1, label: "INFAERNUM.Maldicao.Indice" }),
    };
  }
}
