export interface ClassicalQuote {
  id: number;
  author: string;
  latin: string;
  portuguese: string;
  source: string;
}

export const CLASSICAL_LIBRARY: ClassicalQuote[] = [
  {
    id: 1,
    author: 'Sêneca',
    latin: 'Non quia difficilia sunt non audemus, sed quia non audemus difficilia sunt.',
    portuguese: 'Não é porque as coisas são difíceis que não ousamos; é porque não ousamos que elas são difíceis.',
    source: 'Epistulae Morales ad Lucilium'
  },
  {
    id: 2,
    author: 'Marco Aurélio',
    latin: 'Mane, ubi piget surgere, in promptu habe: ad opus hominis expergiscor.',
    portuguese: 'Pela manhã, quando hesitar em despertar, lembra-te logo: desperto para a tarefa de um homem.',
    source: 'Meditationes, V.1'
  },
  {
    id: 3,
    author: 'Epicteto',
    latin: 'Non res sed de rebus opiniones homines turbant.',
    portuguese: 'O que perturba os homens não são as coisas em si, mas a opinião que eles têm sobre as coisas.',
    source: 'Enchiridion'
  },
  {
    id: 4,
    author: 'Cícero',
    latin: 'Virtute enim ipsa non beatior esse potest.',
    portuguese: 'Pela própria virtude o homem atinge o máximo da plenitude e felicidade.',
    source: 'De Finibus Bonorum et Malorum'
  },
  {
    id: 5,
    author: 'Juvenal',
    latin: 'Orandum est ut sit mens sana in corpore sano.',
    portuguese: 'Deve-se orar para que haja uma mente sã em um corpo são.',
    source: 'Satirae, X.356'
  },
  {
    id: 6,
    author: 'Aristóteles',
    latin: 'Virtus est habitus electivus in mediocritate consistens.',
    portuguese: 'A virtude é um hábito deliberado que consiste na justa medida entre os extremos.',
    source: 'Ethica Nicomachea'
  }
];

export function getDailyQuote(): ClassicalQuote {
  const dayOfYear = Math.floor(Date.now() / 86400000);
  return CLASSICAL_LIBRARY[dayOfYear % CLASSICAL_LIBRARY.length];
}
