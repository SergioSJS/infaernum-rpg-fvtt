const { fields } = foundry.data;

export class DominioData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      descricao:  new fields.HTMLField({ initial: "", label: "INFAERNUM.Dominio.Descricao" }),
      cavaleiro:  new fields.StringField({
        initial: "", blank: true,
        choices: ["", "peste", "guerra", "fome", "morte"],
        label: "INFAERNUM.Dominio.Cavaleiro",
      }),
      efeito:     new fields.HTMLField({ initial: "", label: "INFAERNUM.Dominio.Efeito" }),
      ativo:      new fields.BooleanField({ initial: true, label: "INFAERNUM.Dominio.Ativo" }),
      indice:     new fields.NumberField({ integer: true, min: 1, max: 6, initial: 1, label: "INFAERNUM.Dominio.Indice" }),
    };
  }
}
