export interface ParentTip {
  id: string;
  minAge: number;
  title: string;
  body: string;
  tag: string;
}

export const PARENT_TIPS: ParentTip[] = [
  {
    id: 'tip-0',
    minAge: 0,
    title: 'Welcome to Seed Stage (0–6)',
    body: 'Every 10,000 Ft/month compounded from birth outperforms starting three times larger in high school.',
    tag: 'Compounding',
  },
  {
    id: 'tip-3',
    minAge: 3,
    title: 'Turn Birthday Envelopes into Growth',
    body: 'Share your Lifestart QR link before family birthdays so relatives can fund future goals in 10 seconds.',
    tag: 'Family Gifting',
  },
  {
    id: 'tip-7',
    minAge: 7,
    title: 'Bence is 7: Persely & Skill Wallet Active!',
    body: '15% of monthly Super Bond yield now flows into Bence’s Skill Wallet. Try setting a Persely goal together.',
    tag: 'Milestone',
  },
  {
    id: 'tip-15',
    minAge: 15,
    title: 'Teen Autonomy & Career Cashback',
    body: 'Bence can now pay whitelisted language and driving schools directly and earn Skill Wallet cashback on achievements.',
    tag: 'Career Prep',
  },
];
