const { fields } = foundry.data;

export class RitualData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      descricao:       new fields.HTMLField({ initial: "", label: "INFAERNUM.Ritual.Descricao" }),
      efeito:          new fields.HTMLField({ initial: "", label: "INFAERNUM.Ritual.Efeito" }),
      origem_colosso:  new fields.StringField({ initial: "", label: "INFAERNUM.Ritual.OrigemColosso" }),
      // Ativa com ≥2 milagres na rolagem
      ativa:           new fields.BooleanField({ initial: false, label: "INFAERNUM.Ritual.Ativa" }),
    };
  }
}
