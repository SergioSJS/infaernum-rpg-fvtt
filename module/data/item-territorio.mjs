const { fields } = foundry.data;

export class TerritorioData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      descricao:    new fields.HTMLField({ initial: "", label: "INFAERNUM.Territorio.Descricao" }),
      tipo:         new fields.StringField({ initial: "", label: "INFAERNUM.Territorio.Tipo" }),
      controlador:  new fields.StringField({
        initial: "", blank: true,
        choices: ["", "peste", "guerra", "fome", "morte", "personagens"],
        label: "INFAERNUM.Territorio.Controlador",
      }),
      coordenada_q: new fields.NumberField({ integer: true, initial: 0, label: "INFAERNUM.Territorio.CoordQ" }),
      coordenada_r: new fields.NumberField({ integer: true, initial: 0, label: "INFAERNUM.Territorio.CoordR" }),
      revelado:     new fields.BooleanField({ initial: false, label: "INFAERNUM.Territorio.Revelado" }),
    };
  }
}
