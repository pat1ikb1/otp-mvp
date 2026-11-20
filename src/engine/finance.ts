import { CONFIG } from '@/engine/config';
import { getTbszStatus } from '@/engine/rules';
import type {
  DividendMode,
  FeesVsValueBreakdown,
  HistoryPoint,
  LifestartCoreState,
} from '@/types/lifestart';

export function totalBalance(core: LifestartCoreState): number {
  const { long, mid, short } = core.account.pockets;
  return long + mid + short + core.account.skillWallet.balance;
}

export function bondValue(core: LifestartCoreState): number {
  return core.account.pockets.long + core.account.pockets.mid;
}

export function totalPiggySaved(core: LifestartCoreState): number {
  return core.piggyGoals.reduce(
    (sum, goal) => (goal.purchasedAtMonth === null ? sum + goal.saved : sum),
    0,
  );
}

export function shortAvailable(core: LifestartCoreState): number {
  return Math.max(0, core.account.pockets.short - totalPiggySaved(core));
}

export function reinvestBonusRate(core: LifestartCoreState): number {
  const years = Math.floor(core.account.reinvestMonthsAfter18 / 12);
  return Math.min(CONFIG.MAX_REINVEST_BONUS, years * CONFIG.REINVEST_BONUS_PER_YEAR);
}

export function currentDividendRate(core: LifestartCoreState): number {
  const baseNominal = CONFIG.INFLATION_PROTECTION_RATE + CONFIG.BASE_REAL_RETURN_RATE;
  const quizBonus = core.quizCompleted ? CONFIG.QUIZ_BONUS_RATE : 0;
  return baseNominal + reinvestBonusRate(core) + quizBonus;
}

export function feesVsValue(
  core: LifestartCoreState,
  includeMortgage = false,
): FeesVsValueBreakdown {
  const bond = bondValue(core);
  const baseNominal = CONFIG.INFLATION_PROTECTION_RATE + CONFIG.BASE_REAL_RETURN_RATE;
  const quizBonus = core.quizCompleted ? CONFIG.QUIZ_BONUS_RATE : 0;
  const loyaltyRate = reinvestBonusRate(core) + quizBonus;
  const annualRate = baseNominal + loyaltyRate;

  const baseMarketGross = Math.round(bond * baseNominal);
  const tbsz = getTbszStatus(core.monthIndex, core.account.tbszOpenedAtMonth);
  const hasTbszTaxShield =
    tbsz.active && core.account.dividendMode === 'reinvest' && tbsz.earlyExitTaxRate === 0;
  const tbszEffectiveShield = hasTbszTaxShield
    ? CONFIG.TBSZ_TAX_RATE
    : tbsz.active && core.account.dividendMode === 'reinvest'
      ? Math.max(0, CONFIG.TBSZ_TAX_RATE - tbsz.earlyExitTaxRate)
      : 0;

  const tbszTaxSaved = Math.round(baseMarketGross * tbszEffectiveShield);
  const neobankNetReturn = baseMarketGross - tbszTaxSaved;
  const loyaltyBonusAnnual = Math.round(bond * loyaltyRate);
  const grossAnnualYield = baseMarketGross + loyaltyBonusAnnual;
  const goldCashback = CONFIG.GOLD_PARTNER_CASHBACK_ANNUAL;
  const annualFees = CONFIG.MONTHLY_FEES_AFTER_25 * 12;
  const mortgageSavings = includeMortgage
    ? Math.round(CONFIG.DEFAULT_MORTGAGE_PRINCIPAL * (CONFIG.MORTGAGE_DISCOUNT_BPS / 10_000))
    : 0;

  const otpGoNet =
    baseMarketGross + loyaltyBonusAnnual + goldCashback + mortgageSavings - annualFees;
  const exclusiveAdvantage = otpGoNet - neobankNetReturn;

  return {
    bondBalance: bond,
    annualRate,
    baseMarketGross,
    tbszTaxSaved,
    neobankNetReturn,
    loyaltyBonusAnnual,
    grossAnnualYield,
    goldCashback,
    annualFees,
    mortgageSavings,
    otpGoNet,
    exclusiveAdvantage,
    feeCoverageMultiple: annualFees > 0 ? grossAnnualYield / annualFees : 0,
    netAfterFeesOnly: grossAnnualYield - annualFees,
  };
}

export function projectToMonth(
  core: LifestartCoreState,
  targetMonth: number,
  modeOverride?: DividendMode,
): { total: number; bond: number } {
  let long = core.account.pockets.long;
  let mid = core.account.pockets.mid;
  let short = core.account.pockets.short;
  let skill = core.account.skillWallet.balance;
  let reinvestMonths = core.account.reinvestMonthsAfter18;
  const mode = modeOverride ?? core.account.dividendMode;
  const baseNominal = CONFIG.INFLATION_PROTECTION_RATE + CONFIG.BASE_REAL_RETURN_RATE;
  const quizBonus = core.quizCompleted ? CONFIG.QUIZ_BONUS_RATE : 0;

  for (let m = core.monthIndex + 1; m <= targetMonth; m++) {
    const contrib =
      m <= CONFIG.MONTH_AGE_18
        ? core.account.monthlyContribution
        : core.account.adultMonthlyContribution;
    long += contrib * (core.account.allocation.long / 100);
    mid += contrib * (core.account.allocation.mid / 100);
    short += contrib * (core.account.allocation.short / 100);

    if (m <= CONFIG.MONTH_AGE_18 && (m % 12 === 0 || m % 12 === 6)) {
      long += CONFIG.GIFT_AMOUNT;
    }

    const bonus = Math.min(
      CONFIG.MAX_REINVEST_BONUS,
      Math.floor(reinvestMonths / 12) * CONFIG.REINVEST_BONUS_PER_YEAR,
    );
    const rate = baseNominal + bonus + quizBonus;
    const bond = long + mid;
    let distributable = bond * (rate / 12);

    if (m > CONFIG.MONTH_AGE_25) {
      distributable = Math.max(0, distributable - CONFIG.MONTHLY_FEES_AFTER_25);
    }

    if (m >= 85 && m <= CONFIG.MONTH_AGE_25) {
      const toSkill = distributable * CONFIG.SKILL_WALLET_YIELD_SHARE;
      skill += toSkill;
      distributable -= toSkill;
    }

    if (mode === 'reinvest') {
      long += distributable;
      if (m > CONFIG.MONTH_AGE_18) {
        reinvestMonths += 1;
      }
    } else {
      short += distributable;
    }
  }

  return {
    total: long + mid + short + skill,
    bond: long + mid,
  };
}

export interface ChartDataPoint {
  age: number;
  label: string;
  actualTotal: number | null;
  projectedTotal: number | null;
  contributed: number | null;
}

export function buildChartSeries(core: LifestartCoreState): ChartDataPoint[] {
  const yearlyActuals = new Map<number, HistoryPoint>();
  for (const pt of core.historySnapshots) {
    if (pt.month % 12 === 0 || pt.month === core.monthIndex) {
      yearlyActuals.set(Math.floor(pt.month / 12), pt);
    }
  }

  const currentAge = Math.floor(core.monthIndex / 12);
  const points: ChartDataPoint[] = [];

  for (let age = 0; age <= 25; age++) {
    const actual = yearlyActuals.get(age);
    if (age <= currentAge && actual) {
      points.push({
        age,
        label: `${age}y`,
        actualTotal: Math.round(actual.total),
        projectedTotal: age === currentAge ? Math.round(actual.total) : null,
        contributed: Math.round(actual.contributed),
      });
    } else if (age > currentAge) {
      const proj = projectToMonth(core, age * 12);
      points.push({
        age,
        label: `${age}y`,
        actualTotal: null,
        projectedTotal: Math.round(proj.total),
        contributed: null,
      });
    } else {
      points.push({
        age,
        label: `${age}y`,
        actualTotal: 0,
        projectedTotal: null,
        contributed: 0,
      });
    }
  }

  return points;
}

export function formatFt(value: number): string {
  const rounded = Math.round(value);
  return `${rounded.toLocaleString('hu-HU')} Ft`;
}

export function formatCompactFt(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M Ft`;
  }
  if (abs >= 1_000) {
    return `${Math.round(value / 1_000)}k Ft`;
  }
  return formatFt(value);
}

export function formatPct(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}
