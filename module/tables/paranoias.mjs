// Old Infærnum — Paranoia table (PDF p.38–39)

export const PARANOIAS = {
  3:  "Quatro vozes dizem te guiar à Terra Prometida",
  4:  "Algo te diz que você é o quinto Cavaleiro",
  5:  "Está tudo envenenado. É perigoso comer qualquer coisa",
  6:  "Personalidade alterna momentos com outra cruel ao extremo",
  7:  "Personalidade alterna com outra megalomaníaca",
  8:  "Personalidade alterna com outra amedrontada",
  9:  "Há um padrão em todas as coisas, nada parece ser por acaso",
  10: "Vozes incessantes que confundem raciocínio",
  11: "Visões de vultos que parecem te perseguir",
  12: "Estresse torna pelos mais alvos que a neve",
  13: "Há algo vindo das águas e todos parecem ignorar",
  14: "Há algo vindo dos céus e todos parecem ignorar",
  15: "Eles te matarão enquanto dormir",
  16: "Sangue precisa ser derramado, ou ela ficará furiosa",
  17: "Um senhor das profundezas deseja algo de você",
  18: "O Dragão sussurra sua vontade em seus ouvidos",
};

// Dádivas de Pacto (3d6, p.40–41)
export const DADIVAS = {
  3:  "Saúde — livre-se de um tormento",
  4:  "Prosperidade — recursos suficientes",
  5:  "Sedução — convencimento nas próximas palavras",
  6:  "Revelação — descobre algo oculto",
  7:  "Conhecimento — qualquer informação",
  8:  "Coragem — reduz dificuldade de desafio em 1",
  9:  "Carisma — alguém passa a gostar de você",
  10: "Direção — aponta o caminho",
  11: "Ilusão — como você deseja ser visto (tempo limitado)",
  12: "Natureza — ambiente facilita o caminho",
  13: "Divinação — passado ou futuro (pergunta com 1d6)",
  14: "Transmutação — transforma em animal (não dura muito)",
  15: "Destino — reduz 2 desgraças OU rerrola 2 dados com presságio",
  16: "Dominação — obediência (duração via 1d6)",
  17: "Fortalecimento — ao reduzir dificuldade, reduz o dobro",
  18: "Desejo — qualquer pedido (verifica com 1d6)",
};

// Dívidas de Pacto (3d6, p.41)
export const DIVIDAS = {
  3:  "Portal — destruir portais e ninhos de caídos",
  4:  "Alimento — comer o que é proibido (literalmente)",
  5:  "Súplica — lidar com súplica no quadro de orações",
  6:  "Coleção — trazer restos de outros caídos",
  7:  "Sacrifício — animais tombados",
  8:  "Traição — trair alguém de verdade",
  9:  "Vício — substância insubstituível",
  10: "Ouro — preciosidades (verifica com 1d6)",
  11: "Morte — uma vida por dia",
  12: "Cerimônia — rito peculiar",
  13: "Exorcismo — eliminar um caído",
  14: "Culto — converter fiéis",
  15: "Roubo — pegar algo (especificar via 1d6/2d6)",
  16: "Adoração — construir altar",
  17: "Busca — pistas sobre Terra Prometida",
  18: "Purificação — templos e sacerdotes devem perecer",
};

function d6() { return Math.ceil(Math.random() * 6); }
function rolar3d6() { return d6() + d6() + d6(); }

export function rolarParanoia() {
  const total = rolar3d6();
  return { total, descricao: PARANOIAS[total] };
}

export function rolarDadivaPacto() {
  const total = rolar3d6();
  return { total, descricao: DADIVAS[total] };
}

export function rolarDividaPacto() {
  const total = rolar3d6();
  return { total, descricao: DIVIDAS[total] };
}
