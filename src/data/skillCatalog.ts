export interface SkillMerchant {
  id: string;
  name: string;
  category: string;
  emoji: string;
  price: number;
  allowed: boolean;
  minAge: number;
  description: string;
}

export const SKILL_CATALOG: SkillMerchant[] = [
  // Whitelisted Youth & Teen Skill Merchants
  {
    id: 'skill-lang-course',
    name: 'Budapest Language School',
    category: 'Language Exam Prep',
    emoji: '🗣️',
    price: 45_000,
    allowed: true,
    minAge: 7,
    description: 'B2 English/German intensive semester module',
  },
  {
    id: 'skill-driving',
    name: 'City Driving Academy',
    category: 'Driving Licence',
    emoji: '🚗',
    price: 65_000,
    allowed: true,
    minAge: 15,
    description: 'KRESZ theory + first 10 driving hours package',
  },
  {
    id: 'skill-coding',
    name: 'CodeCamp HU',
    category: 'Coding & Digital',
    emoji: '💻',
    price: 38_000,
    allowed: true,
    minAge: 7,
    description: 'Python & web product workshop pass',
  },
  {
    id: 'skill-sports',
    name: 'SwimClub & Athletics Pass',
    category: 'Sports & Health',
    emoji: '⚽',
    price: 22_000,
    allowed: true,
    minAge: 7,
    description: 'Semester coaching & sports membership',
  },
  // 18+ Career & University Skill Merchants
  {
    id: 'skill-career-cert',
    name: 'CareerPro Academy',
    category: 'University & Career',
    emoji: '🎓',
    price: 85_000,
    allowed: true,
    minAge: 18,
    description: 'Data analytics & product leadership certification',
  },
  // Blocked Non-Skill Demo Merchants
  {
    id: 'blocked-gamestore',
    name: 'GameStore',
    category: 'Entertainment',
    emoji: '🎮',
    price: 24_990,
    allowed: false,
    minAge: 7,
    description: 'Console game & in-game credits bundle',
  },
  {
    id: 'blocked-sneakers',
    name: 'Sneaker Drop',
    category: 'Lifestyle Retail',
    emoji: '👟',
    price: 49_990,
    allowed: false,
    minAge: 7,
    description: 'Limited edition streetwear sneakers',
  },
  {
    id: 'blocked-fastfood',
    name: 'FastBite Delivery',
    category: 'Food Delivery',
    emoji: '🍔',
    price: 5_400,
    allowed: false,
    minAge: 7,
    description: 'Late-night burger & soda delivery',
  },
];

export function getSkillMerchantById(id: string): SkillMerchant | undefined {
  return SKILL_CATALOG.find((m) => m.id === id);
}
