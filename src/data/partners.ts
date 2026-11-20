export interface PartnerBenefit {
  id: string;
  name: string;
  category: string;
  benefit: string;
  audience: 'parent' | 'youth' | 'adult25';
  isOtpEcosystem: boolean;
  emoji: string;
}

export const PARTNERS: PartnerBenefit[] = [
  {
    id: 'p-szep',
    name: 'OTP SZÉP Card Link',
    category: 'Family Ecosystem',
    benefit: '2% family bonus + instant holiday & camp top-up',
    audience: 'parent',
    isOtpEcosystem: true,
    emoji: '💳',
  },
  {
    id: 'p-baby',
    name: 'BabyCare Shop',
    category: 'Early Years',
    benefit: '12% discount + 3% cashback to Long Pocket',
    audience: 'parent',
    isOtpEcosystem: false,
    emoji: '🍼',
  },
  {
    id: 'p-swim',
    name: 'SwimClub Kids',
    category: 'Sports & Health',
    benefit: '15% term discount via OTP Simple checkout',
    audience: 'parent',
    isOtpEcosystem: false,
    emoji: '🏊',
  },
  {
    id: 'p-alap',
    name: 'OTP Alapkezelő Youth Fund',
    category: 'Investments',
    benefit: '0% entry fee · Inflation-beating multi-asset growth',
    audience: 'parent',
    isOtpEcosystem: true,
    emoji: '📈',
  },
  {
    id: 'p-lang',
    name: 'Budapest Language School',
    category: 'Career Positive List',
    benefit: '10% tuition discount + 20,000 Ft exam cashback',
    audience: 'youth',
    isOtpEcosystem: false,
    emoji: '🗣️',
  },
  {
    id: 'p-drive',
    name: 'City Driving Academy',
    category: 'Career Positive List',
    benefit: 'Zero admin fee + 25,000 Ft licence cashback',
    audience: 'youth',
    isOtpEcosystem: false,
    emoji: '🚗',
  },
  {
    id: 'p-lakashitel',
    name: 'OTP Lakáshitel Gold',
    category: 'First Home',
    benefit: '-0.30% APR mortgage rate reduction (~90k Ft/yr saved)',
    audience: 'adult25',
    isOtpEcosystem: true,
    emoji: '🏠',
  },
  {
    id: 'p-autoguard',
    name: 'OTP Simple & AutoGuard',
    category: 'Mobility & Life',
    benefit: '15% young-driver insurance discount for Gold members',
    audience: 'adult25',
    isOtpEcosystem: true,
    emoji: '🛡️',
  },
];
