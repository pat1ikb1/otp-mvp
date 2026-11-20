import type { AppView, Controller, LifeStageId, StageTheme } from '@/types/lifestart';

export type FeatureId =
  | 'kidApp'
  | 'piggyBank'
  | 'skillWallet'
  | 'skillDirectPay'
  | 'achievements'
  | 'earnings'
  | 'quiz'
  | 'handover'
  | 'tbsz'
  | 'advisor'
  | 'otpGo';

export interface StageMeta {
  id: LifeStageId;
  label: string;
  shortLabel: string;
  ageRange: string;
  badgeText: string;
  description: string;
}

const STAGE_META: Record<LifeStageId, StageMeta> = {
  seed: {
    id: 'seed',
    label: 'Seed',
    shortLabel: '0–6',
    ageRange: 'Ages 0–6',
    badgeText: 'Stage 1 · Seed',
    description: 'Parent opens early, locks in welcome grant, monthly deposits & gifts.',
  },
  learn: {
    id: 'learn',
    label: 'Learn',
    shortLabel: '7–14',
    ageRange: 'Ages 7–14',
    badgeText: 'Stage 2 · Learn',
    description: 'OTP Persely goals & Skill Wallet unlock with parent approval.',
  },
  grow: {
    id: 'grow',
    label: 'Grow',
    shortLabel: '15–17',
    ageRange: 'Ages 15–17',
    badgeText: 'Stage 3 · Grow',
    description: 'Direct skill spending, achievements cashback, odd jobs & literacy quiz.',
  },
  launch: {
    id: 'launch',
    label: 'Launch',
    shortLabel: '18–24',
    ageRange: 'Ages 18–24',
    badgeText: 'Stage 4 · Launch',
    description: 'Full handover + auto-rollover into 5-Year Tax-Free OTP TBSZ.',
  },
  go: {
    id: 'go',
    label: 'OTP GO',
    shortLabel: '25+',
    ageRange: 'Age 25+',
    badgeText: 'Stage 5 · OTP GO',
    description: 'Junior transitions to OTP GO; dividends & perks pay for staying.',
  },
};

export function getAge(monthIndex: number): number {
  return Math.floor(Math.max(0, monthIndex) / 12);
}

export function getStage(age: number): LifeStageId {
  if (age < 7) return 'seed';
  if (age < 15) return 'learn';
  if (age < 18) return 'grow';
  if (age < 25) return 'launch';
  return 'go';
}

export function getStageMeta(stage: LifeStageId): StageMeta {
  return STAGE_META[stage];
}

export function getStageTheme(view: AppView, age: number): StageTheme {
  if (view === 'parent') return 'parent';
  if (age >= 18) return 'adult';
  if (age >= 15) return 'teen';
  return 'kid';
}

export function getController(age: number): Controller {
  if (age < 7) return 'parent';
  if (age < 18) return 'shared';
  return 'adult';
}

export function getAvailableViews(age: number): AppView[] {
  if (age < 7) return ['parent'];
  if (age < 18) return ['parent', 'kid'];
  return ['adult'];
}

const FEATURE_MIN_AGE: Record<FeatureId, number> = {
  kidApp: 7,
  piggyBank: 7,
  skillWallet: 7,
  skillDirectPay: 15,
  achievements: 15,
  earnings: 15,
  quiz: 15,
  handover: 18,
  tbsz: 18,
  advisor: 18,
  otpGo: 25,
};

export function isFeatureUnlocked(featureId: FeatureId, age: number): boolean {
  return age >= FEATURE_MIN_AGE[featureId];
}

export function getTbszStatus(monthIndex: number, tbszOpenedAtMonth: number | null) {
  if (tbszOpenedAtMonth === null || monthIndex < tbszOpenedAtMonth) {
    return {
      active: false,
      yearsHeld: 0,
      monthsHeld: 0,
      monthsRemainingToMaturity: 60,
      earlyExitTaxRate: 0.28 as const,
      statusLabel: 'Opens automatically at age 18',
    };
  }

  const monthsHeld = monthIndex - tbszOpenedAtMonth;
  const yearsHeld = Math.floor(monthsHeld / 12);
  const monthsRemainingToMaturity = Math.max(0, 60 - monthsHeld);

  if (yearsHeld >= 5) {
    return {
      active: true,
      yearsHeld,
      monthsHeld,
      monthsRemainingToMaturity: 0,
      earlyExitTaxRate: 0 as const,
      statusLabel: '5-Yr TBSZ Matured · 0% Tax-Free',
    };
  }

  if (yearsHeld >= 3) {
    return {
      active: true,
      yearsHeld,
      monthsHeld,
      monthsRemainingToMaturity,
      earlyExitTaxRate: 0.18 as const,
      statusLabel: `Year ${yearsHeld}/5 · 18% Early Exit Tax`,
    };
  }

  return {
    active: true,
    yearsHeld,
    monthsHeld,
    monthsRemainingToMaturity,
    earlyExitTaxRate: 0.28 as const,
    statusLabel: `Year ${yearsHeld}/5 · 28% Early Exit Tax`,
  };
}
