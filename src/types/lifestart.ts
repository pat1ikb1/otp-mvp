export type LifeStageId = 'seed' | 'learn' | 'grow' | 'launch' | 'go';
export type StageTheme = 'parent' | 'kid' | 'teen' | 'adult';
export type AppView = 'parent' | 'kid' | 'adult';
export type Controller = 'parent' | 'shared' | 'adult';
export type DividendMode = 'reinvest' | 'spend';
export type PocketKey = 'long' | 'mid' | 'short';

export interface Allocation {
  long: number;
  mid: number;
  short: number;
}

export interface PiggyGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  emoji: string;
  purchasedAtMonth: number | null;
}

export interface GiftRecord {
  id: string;
  from: string;
  occasion: string;
  amount: number;
  month: number;
}

export interface AchievementRecord {
  id: string;
  title: string;
  description: string;
  emoji: string;
  cashback: number;
  unlockedAtMonth: number | null;
}

export interface EarningRecord {
  id: string;
  source: string;
  amount: number;
  month: number;
}

export interface SkillSpendRecord {
  id: string;
  month: number;
  merchant: string;
  category: string;
  amount: number;
}

export interface TransactionRecord {
  id: string;
  month: number;
  type: 'grant' | 'contribution' | 'gift' | 'yield' | 'skill' | 'persely' | 'earning' | 'cashback' | 'fee' | 'transfer';
  pocket: PocketKey | 'skillWallet';
  amount: number;
  label: string;
}

export interface NotificationRecord {
  id: string;
  month: number;
  text: string;
  type: 'milestone' | 'tip' | 'approval';
}

export interface HistoryPoint {
  month: number;
  total: number;
  bond: number;
  contributed: number;
}

export interface LifestartCoreState {
  monthIndex: number;
  family: {
    parentName: string;
    childName: string;
    parentIsOtpCustomer: boolean;
  };
  account: {
    opened: boolean;
    openedAtMonth: number | null;
    pockets: {
      long: number;
      mid: number;
      short: number;
    };
    allocation: Allocation;
    monthlyContribution: number;
    adultMonthlyContribution: number;
    tbszOpenedAtMonth: number | null;
    dividendMode: DividendMode;
    reinvestMonthsAfter18: number;
    skillWallet: {
      balance: number;
      totalFundedFromYield: number;
      totalCashbackEarned: number;
      spent: SkillSpendRecord[];
    };
    totals: {
      welcomeGrant: number;
      contributions: number;
      gifts: number;
      grossYieldEarned: number;
      feesPaid: number;
    };
  };
  piggyGoals: PiggyGoal[];
  gifts: GiftRecord[];
  achievements: AchievementRecord[];
  earnings: EarningRecord[];
  transactions: TransactionRecord[];
  notifications: NotificationRecord[];
  historySnapshots: HistoryPoint[];
  quizCompleted: boolean;
  handoverAccepted: boolean;
  goWelcomeSeen: boolean;
}

export interface FeesVsValueBreakdown {
  bondBalance: number;
  annualRate: number;
  baseMarketGross: number;
  tbszTaxSaved: number;
  neobankNetReturn: number;
  loyaltyBonusAnnual: number;
  grossAnnualYield: number;
  goldCashback: number;
  annualFees: number;
  mortgageSavings: number;
  otpGoNet: number;
  exclusiveAdvantage: number;
  feeCoverageMultiple: number;
  netAfterFeesOnly: number;
}

export interface ToastMessage {
  id: string;
  text: string;
  tone: 'success' | 'info' | 'error';
}

export interface AppStoreState {
  core: LifestartCoreState;
  snapshots: Record<number, LifestartCoreState>;
  maxVisitedMonth: number;
  ui: {
    activeView: AppView;
    activeTab: string;
    activeToast: ToastMessage | null;
    confettiKey: number;
  };
}
