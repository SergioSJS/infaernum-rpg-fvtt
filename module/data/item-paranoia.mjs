const { fields } = foundry.data;

export class ParanoiaData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      descricao: new fields.HTMLField({ initial: "", label: "INFAERNUM.Paranoia.Descricao" }),
      gatilho:   new fields.StringField({ initial: "", label: "INFAERNUM.Paranoia.Gatilho" }),
      // Índice 1–3; ao acumular 3ª paranoia, sorte vira segundo azar
      indice:    new fields.NumberField({ integer: true, min: 1, max: 3, initial: 1, label: "INFAERNUM.Paranoia.Indice" }),
    };
  }
}
