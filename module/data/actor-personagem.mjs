const { fields } = foundry.data;

export class PersonagemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      sorte:               new fields.StringField({ initial: "", label: "INFAERNUM.Personagem.Sorte" }),
      azar:                new fields.StringField({ initial: "", label: "INFAERNUM.Personagem.Azar" }),
      desgracas:           new fields.NumberField({ integer: true, min: 0, max: 6, initial: 0, label: "INFAERNUM.Personagem.Desgracas" }),
      almas:               new fields.NumberField({ integer: true, min: 0, initial: 0, label: "INFAERNUM.Personagem.Almas" }),
      movimentos_alteracao: new fields.NumberField({ integer: true, min: 0, max: 6, initial: 6, label: "INFAERNUM.Personagem.MovimentosAlteracao" }),
      segundo_azar:        new fields.BooleanField({ initial: false, label: "INFAERNUM.Personagem.SegundoAzar" }),
      criacao_concluida:   new fields.BooleanField({ initial: false }),
      cavaleiro_servido:   new fields.StringField({ initial: "", blank: true, choices: ["", "peste", "guerra", "fome", "morte"], label: "INFAERNUM.Personagem.CavaleiroServido" }),
      anotacoes:           new fields.HTMLField({ initial: "", label: "INFAERNUM.Personagem.Anotacoes" }),
    };
  }

  get temMaldicao() {
    return this.parent?.items?.some(i => i.type === "maldicao") ?? false;
  }

  get paranoias() {
    return this.parent?.items?.filter(i => i.type === "paranoia") ?? [];
  }

  get tormentosAtivos() {
    return this.parent?.items?.filter(i => i.type === "tormento") ?? [];
  }

  get salvacoes() {
    return this.parent?.items?.filter(i => i.type === "salvacao") ?? [];
  }

  get rituais() {
    return this.parent?.items?.filter(i => i.type === "ritual") ?? [];
  }

  get pactos() {
    return this.parent?.items?.filter(i => i.type === "pacto") ?? [];
  }
}
