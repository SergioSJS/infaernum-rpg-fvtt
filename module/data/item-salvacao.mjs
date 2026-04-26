const { fields } = foundry.data;

export class SalvacaoData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      descricao:    new fields.HTMLField({ initial: "", label: "INFAERNUM.Salvacao.Descricao" }),
      efeito:       new fields.HTMLField({ initial: "", label: "INFAERNUM.Salvacao.Efeito" }),
      origem_fenda: new fields.StringField({ initial: "", label: "INFAERNUM.Salvacao.OrigemFenda" }),
      // Ativa com ≥2 milagres na rolagem
      ativa:        new fields.BooleanField({ initial: false, label: "INFAERNUM.Salvacao.Ativa" }),
    };
  }
}
