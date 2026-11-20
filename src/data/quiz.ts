export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Why does keeping your Super Bond invested from age 0 matter more than starting at 25?',
    options: [
      'Compound yield earns returns on past returns over 25 years',
      'Banks double your cash automatically every birthday',
      'Inflation only affects adults over 25',
    ],
    correctIndex: 0,
    explanation: 'Compounding lets early deposits and gifts grow exponentially across decades.',
  },
  {
    id: 'q2',
    question: 'How long must an OTP TBSZ (Long-Term Investment Account) be held to pay 0% tax in Hungary?',
    options: [
      '12 months',
      '5 full years after the collection year',
      'Only until age 20',
    ],
    correctIndex: 1,
    explanation: 'Holding a TBSZ for 5 full years eliminates the 15% SZJA + 13% SZOCHO (28% total tax).',
  },
  {
    id: 'q3',
    question: 'What makes the Lifestart Skill Wallet unique compared to regular pocket money?',
    options: [
      'It only unlocks for verified education, driving, and career investments',
      'It can only be spent on video games',
      'It expires every 30 days if unused',
    ],
    correctIndex: 0,
    explanation: 'Skill Wallet protects a slice of your yield strictly for skills that boost future income.',
  },
];
