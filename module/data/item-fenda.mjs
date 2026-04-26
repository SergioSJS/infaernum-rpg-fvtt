const { fields } = foundry.data;

export class FendaData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      descricao:         new fields.HTMLField({ initial: "", label: "INFAERNUM.Fenda.Descricao" }),
      dificuldades:      new fields.ArrayField(
        new fields.NumberField({ integer: true, min: 0, initial: 0 }),
        { initial: [], label: "INFAERNUM.Fenda.Dificuldades" }
      ),
      salvacao_nome:     new fields.StringField({ initial: "", label: "INFAERNUM.Fenda.SalvacaoNome" }),
      salvacao_efeito:   new fields.HTMLField({ initial: "", label: "INFAERNUM.Fenda.SalvacaoEfeito" }),
      progresso:         new fields.NumberField({ integer: true, min: 0, initial: 0, label: "INFAERNUM.Fenda.Progresso" }),
      concluida:         new fields.BooleanField({ initial: false, label: "INFAERNUM.Fenda.Concluida" }),
    };
  }
}
