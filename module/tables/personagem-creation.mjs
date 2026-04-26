// Old Infærnum — character creation tables (PDF p.5-9)
// Keys: 3–18 (3d6 sum)

export const PASSADO = {
   3: "Um invocador que tagarela com caídos",
   4: "Alguém que já leu o que ainda será escrito",
   5: "O fervor da divindade antiga, a encarnação da crença morta",
   6: "Aos olhos dos outros, um louco qualquer",
   7: "Alguém importante demais para lidar com o trabalho sujo",
   8: "Astúcia e perspicácia te fizeram sobreviver até aqui",
   9: "Um escravo, agora livre para continuar lutando",
  10: "Alguém condenado à forca, salvo pelo prenúncio do fim",
  11: "Aquele que carrega o peso de muitas mortes",
  12: "Por algum motivo, um monstro",
  13: "A justiça de uma única perspectiva",
  14: "Um conhecedor das profundezas",
  15: "Alguém que vê o que outros não veem",
  16: "O servo de um caído que se opõe ao fim de tudo",
  17: "A chave para um grande acontecimento",
  18: "Um viajante de sonhos",
};

export const SORTE = {
   3: "Manifestar milagres climáticos",
   4: "Promover a cura, prestar auxílios milagrosos",
   5: "Entender e ser compreendido por seres animalescos e bestas",
   6: "Resistir, defender a qualquer custo, manter-se de pé",
   7: "Encontrar caminhos e impedir que te encontrem",
   8: "Causar boas primeiras impressões",
   9: "Mover-se intensamente, com reflexos anormais",
  10: "Esquematizar, lidar com armadilhas",
  11: "Usar força bruta, superar limitações físicas",
  12: "Perceber minúcias, notar detalhes ocultos",
  13: "Investigar, usar da intuição para descobrir",
  14: "Memorizar o que for preciso, gravar na mente",
  15: "Improvisar, solucionar com o que é inesperado",
  16: "Mentir, blefar, pintar como quiser a sua verdade",
  17: "Conhecer e lidar com o oculto",
  18: "Liderar, influenciar e cativar",
};

export const AZAR = {
   3: "Fazer-se compreender",
   4: "Pensar estrategicamente",
   5: "Empunhar armas",
   6: "Travar embates físicos",
   7: "Esconder-se",
   8: "Ludibriar, blefar",
   9: "Lidar com o oculto",
  10: "Encontrar pistas",
  11: "Perceber ameaças",
  12: "Negociar",
  13: "Agir com rapidez",
  14: "Ler, discernir sinais ou runas",
  15: "Entender a natureza",
  16: "Discernir intenções",
  17: "Tirar vidas",
  18: "Sujeitar-se a outras opiniões",
};

export const TRALHAS = {
   3: "Um pão quase mofado, um cantil com aguardente e um canivete",
   4: "Um martelo, alguns pregos e um pequeno espelho",
   5: "Uma corda com gancho, um saco de dormir e uma capa pesada",
   6: "Um pequeno livro em branco, tinta e uma pena para escrita",
   7: "Um jogo com cartas marcadas, um cachimbo e um pouco de fumo",
   8: "Um frasco de perfume, algumas ervas e uma pedra de amolar",
   9: "Uma pederneira, algumas tochas e um frasco de óleo",
  10: "Uma barraca desmontada, uma mochila e um cobertor",
  11: "Uma panela, alguns vegetais e frascos de temperos variados",
  12: "Uma pá, um crucifixo e vestes cerimoniais",
  13: "Um molho de várias chaves, alguns cadeados e um par de algemas",
  14: "Um mapa de algum lugar, uma bússola e uma garrafa de vinho",
  15: "Um bestiário com páginas faltando, uma estola e um rosário",
  16: "Um fêmur humano, a pele de algum animal e pequenos crânios de aves",
  17: "Um pequeno saco de couro cheio de sal, algumas agulhas e um chifre",
  18: "Uma coroa de espinhos, algumas velas e um pergaminho com uma gravura",
};

export const BENCAO = {
   3: "Escudo com brasão estranho capaz de invocar relâmpagos",
   4: "Livro com vontade própria que materializa o que for escrito nele",
   5: "Marreta com poder de causar tremores",
   6: "Adaga que permite controlar a alma de quem for estocado por ela",
   7: "Cruz com dom de repelir caídos",
   8: "Mangual capaz de acertar golpes que explodem em chamas",
   9: "Animal possuído por um caído",
  10: "Espada que fareja sangue",
  11: "Arco que cria flechas necrotizantes por sua corda retesada",
  12: "Espelho que mostra a verdade",
  13: "Chicote que congela o que é envolto por ele",
  14: "Esfera de vidro que revela o que está por vir",
  15: "Cetro que comanda o corpo de alguém morto por ele",
  16: "Tridente capaz de controlar as águas e o que delas emerge",
  17: "Manto que torna invisível o que cobrir",
  18: "Tatuagem que ganha vida quando seu sangue é derramado",
};

export function roll3d6() {
  const d = () => Math.ceil(Math.random() * 6);
  const dados = [d(), d(), d()];
  return { dados, total: dados.reduce((a, b) => a + b, 0) };
}
