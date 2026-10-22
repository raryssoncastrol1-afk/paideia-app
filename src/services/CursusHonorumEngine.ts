import { CursusRank } from '../types';

export interface RankRequirement {
  rank: CursusRank;
  title: string;
  min_virtus: number;
  min_robur: number;       // Esforço físico
  min_sapientia: number;   // Trivium e estudos
  min_streak_days: number; // Constância
  description: string;
  motto: string;
}

export const CURSUS_HONORUM: RankRequirement[] = [
  {
    rank: 'TIRO',
    title: 'Tiro (O Recruta)',
    min_virtus: 0,
    min_robur: 0,
    min_sapientia: 0,
    min_streak_days: 0,
    description: 'Aquele que dá os primeiros passos para forjar o próprio caráter.',
    motto: 'Initium sapientiae timor Domini'
  },
  {
    rank: 'LEGIONARIUS',
    title: 'Legionarius (O Disciplinado)',
    min_virtus: 100,
    min_robur: 50,
    min_sapientia: 50,
    min_streak_days: 7,
    description: 'Estabeleceu a ordem diária entre o ginásio e o livro. O hábito se torna têmpera.',
    motto: 'Labor omnia vincit'
  },
  {
    rank: 'CENTURIO',
    title: 'Centurio (O Mestre de Si)',
    min_virtus: 500,
    min_robur: 250,
    min_sapientia: 250,
    min_streak_days: 30,
    description: 'Severidade inabalável. Comanda suas paixões e cumpre o dever sem hesitar.',
    motto: 'Vincere aut mori'
  },
  {
    rank: 'TRIBUNUS',
    title: 'Tribunus (O Magistrado Culto)',
    min_virtus: 1500,
    min_robur: 600,
    min_sapientia: 900,
    min_streak_days: 60,
    description: 'Erudição profunda e corpo desperto. A retórica e o vigor em perfeita harmonia.',
    motto: 'Mens sana in corpore sano'
  },
  {
    rank: 'PHILOSOPHUS',
    title: 'Philosophus (O Cidadão Exemplar)',
    min_virtus: 3500,
    min_robur: 1500,
    min_sapientia: 2000,
    min_streak_days: 100,
    description: 'A Paideia clássica plenamente realizada. O sábio sereno diante da adversidade.',
    motto: 'Non scholae, sed vitae discimus'
  }
];

export class CursusHonorumEngine {
  /**
   * Avalia as métricas do cidadão e determina se há promoção ou manutenção de grau
   */
  static evaluateRank(
    virtus: number,
    robur: number,
    sapientia: number,
    streak: number
  ): RankRequirement {
    let eligible = CURSUS_HONORUM[0];
    for (const req of CURSUS_HONORUM) {
      if (
        virtus >= req.min_virtus &&
        robur >= req.min_robur &&
        sapientia >= req.min_sapientia &&
        streak >= req.min_streak_days
      ) {
        eligible = req;
      }
    }
    return eligible;
  }

  /**
   * Retorna os requisitos para o próximo grau cívico
   */
  static getNextRank(currentRank: CursusRank): RankRequirement | null {
    const currentIndex = CURSUS_HONORUM.findIndex(r => r.rank === currentRank);
    if (currentIndex >= 0 && currentIndex < CURSUS_HONORUM.length - 1) {
      return CURSUS_HONORUM[currentIndex + 1];
    }
    return null; // Já atingiu o auge (Philosophus)
  }
}
