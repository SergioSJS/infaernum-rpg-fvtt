const { fields } = foundry.data;

export class BencaoData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      descricao: new fields.HTMLField({ initial: "", label: "INFAERNUM.Bencao.Descricao" }),
      efeito:    new fields.HTMLField({ initial: "", label: "INFAERNUM.Bencao.Efeito" }),
      // Ativa com ≥1 milagre na rolagem
      ativa:     new fields.BooleanField({ initial: false, label: "INFAERNUM.Bencao.Ativa" }),
    };
  }
}
