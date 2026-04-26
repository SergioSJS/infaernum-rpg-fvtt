const { fields } = foundry.data;
const { SchemaField, NumberField, StringField, BooleanField, HTMLField, ArrayField } = fields;

export class ColossoData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      descricao:         new HTMLField({ initial: "", label: "INFAERNUM.Colosso.Descricao" }),
      dificuldade:       new NumberField({ integer: true, min: 0, initial: 0, label: "INFAERNUM.Colosso.Dificuldade" }),
      dificuldade_atual: new NumberField({ integer: true, min: 0, initial: 0, label: "INFAERNUM.Colosso.DificuldadeAtual" }),

      desgracas_naipes: new SchemaField({
        copas:   new NumberField({ integer: true, min: 0, initial: 0 }),
        espadas: new NumberField({ integer: true, min: 0, initial: 0 }),
        paus:    new NumberField({ integer: true, min: 0, initial: 0 }),
        ouros:   new NumberField({ integer: true, min: 0, initial: 0 }),
      }, { label: "INFAERNUM.Colosso.DesgracasNaipes" }),

      naipe_tormentos: new SchemaField({
        copas:   new StringField({ initial: "" }),
        espadas: new StringField({ initial: "" }),
        paus:    new StringField({ initial: "" }),
        ouros:   new StringField({ initial: "" }),
      }, { label: "INFAERNUM.Colosso.NaipeTormentos" }),

      cartas_reveladas: new ArrayField(new StringField(), {
        initial: [],
        label: "INFAERNUM.Colosso.CartasReveladas",
      }),

      partes: new ArrayField(
        new SchemaField({
          nome:          new StringField({ initial: "Nova Parte" }),
          destruida:     new BooleanField({ initial: false }),
          ritual_gerado: new StringField({ initial: "" }),
        }),
        { initial: [], label: "INFAERNUM.Colosso.Partes" }
      ),

      anotacoes: new HTMLField({ initial: "", label: "INFAERNUM.Colosso.Anotacoes" }),
    };
  }

  get rituais() {
    return this.parent?.items?.filter(i => i.type === "ritual") ?? [];
  }

  get totalDesgracas() {
    const n = this.desgracas_naipes;
    return n.copas + n.espadas + n.paus + n.ouros;
  }

  get derrotado() {
    return this.dificuldade_atual <= 0 && this.dificuldade > 0;
  }
}
