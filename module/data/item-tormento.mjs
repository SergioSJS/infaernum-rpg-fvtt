const { fields } = foundry.data;

export class TormentoData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      descricao: new fields.HTMLField({ initial: "", label: "INFAERNUM.Tormento.Descricao" }),
      origem:    new fields.StringField({ initial: "", label: "INFAERNUM.Tormento.Origem" }),
      grave:     new fields.BooleanField({ initial: false, label: "INFAERNUM.Tormento.Grave" }),
      // Tormento aplica azar: desgraças cancelam milagres nas rolagens
      ativo:     new fields.BooleanField({ initial: true, label: "INFAERNUM.Tormento.Ativo" }),
    };
  }
}
