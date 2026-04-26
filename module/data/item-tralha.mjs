const { fields } = foundry.data;

export class TralhaData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      descricao:  new fields.HTMLField({ initial: "", label: "INFAERNUM.Tralha.Descricao" }),
      quantidade: new fields.NumberField({ integer: true, min: 0, initial: 1, label: "INFAERNUM.Tralha.Quantidade" }),
      consumivel: new fields.BooleanField({ initial: false, label: "INFAERNUM.Tralha.Consumivel" }),
    };
  }
}
