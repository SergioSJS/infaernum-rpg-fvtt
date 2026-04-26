const { fields } = foundry.data;

export class PactoData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      descricao:    new fields.HTMLField({ initial: "", label: "INFAERNUM.Pacto.Descricao" }),
      entidade:     new fields.StringField({ initial: "", label: "INFAERNUM.Pacto.Entidade" }),
      dadiva:       new fields.HTMLField({ initial: "", label: "INFAERNUM.Pacto.Dadiva" }),
      divida:       new fields.HTMLField({ initial: "", label: "INFAERNUM.Pacto.Divida" }),
      // Resetado a cada novo dia
      dadiva_usada: new fields.BooleanField({ initial: false, label: "INFAERNUM.Pacto.DadivaUsada" }),
      divida_paga:  new fields.BooleanField({ initial: false, label: "INFAERNUM.Pacto.DividaPaga" }),
    };
  }
}
