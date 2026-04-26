# Agente: Data Modeler

## Missão

Implementar e revisar TypeDataModel para Actors e Items do sistema.

## Leitura obrigatória

1. `docs/ARCHITECTURE.md` — padrões de TypeDataModel
2. `docs/RULES-MAPPING.md` — campos necessários por tipo
3. `docs/GLOSSARIO.md` — nomes corretos dos campos

## Padrão de referência

```javascript
// fractal-foundry-vtt/module/data/actor-personagem.mjs
export class PersonagemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const f = foundry.data.fields;
    return {
      campo: new f.StringField({ initial: "" }),
      numero: new f.NumberField({ integer: true, min: 0, initial: 0 }),
      flag: new f.BooleanField({ initial: false }),
      lista: new f.ArrayField(new f.SchemaField({ ... })),
    };
  }
}
```

## Regras

- Sempre TypeDataModel, nunca template.json
- Campos em PT-BR snake_case
- Getters computados para valores derivados (ex: `get superado()`)
- Validar ranges onde relevante (`min`, `max`)
- Registrar em `module/infaernum.mjs`: `CONFIG.Actor.dataModels.tipo = ClasseData`

## Arquivos a criar/modificar

`module/data/actor-*.mjs` e `module/data/item-*.mjs`
