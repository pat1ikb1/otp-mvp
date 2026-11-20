import { CONFIG } from '@/engine/config';
import { shortAvailable, totalBalance } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { getSkillMerchantById } from '@/data/skillCatalog';
import type {
  Allocation,
  LifestartCoreState,
  PocketKey,
} from '@/types/lifestart';

export function createInitialCoreState(): LifestartCoreState {
  return {
    monthIndex: 0,
    family: {
      parentName: CONFIG.PERSONA.parentName,
      childName: CONFIG.PERSONA.childName,
      parentIsOtpCustomer: true,
    },
    account: {
      opened: false,
      openedAtMonth: null,
      pockets: { long: 0, mid: 0, short: 0 },
      allocation: { ...CONFIG.DEFAULT_ALLOCATION },
      monthlyContribution: CONFIG.DEFAULT_MONTHLY,
      adultMonthlyContribution: 0,
      tbszOpenedAtMonth: null,
      dividendMode: 'reinvest',
      reinvestMonthsAfter18: 0,
      skillWallet: {
        balance: 0,
        totalFundedFromYield: 0,
        totalCashbackEarned: 0,
        spent: [],
      },
      totals: {
        welcomeGrant: 0,
        contributions: 0,
        gifts: 0,
        grossYieldEarned: 0,
        feesPaid: 0,
      },
    },
    piggyGoals: [
      {
        id: 'goal-bike',
        name: 'Mountain Bike',
        target: 45_000,
        saved: 0,
        emoji: '🚲',
        purchasedAtMonth: null,
      },
    ],
    gifts: [],
    achievements: [
      {
        id: 'ach-lang',
        title: 'B2 Language Exam',
        description: 'Official English or German certificate verified by partner',
        emoji: '🗣️',
        cashback: 20_000,
        unlockedAtMonth: null,
      },
      {
        id: 'ach-drive',
        title: 'Driving Licence',
        description: 'Completed KRESZ & practical driving exam at partner school',
        emoji: '🚗',
        cashback: 25_000,
        unlockedAtMonth: null,
      },
      {
        id: 'ach-job',
        title: 'First Summer Job',
        description: 'First verified student income deposited to OTP Junior',
        emoji: '💼',
        cashback: 15_000,
        unlockedAtMonth: null,
      },
    ],
    earnings: [],
    transactions: [],
    notifications: [],
    historySnapshots: [{ month: 0, total: 0, bond: 0, contributed: 0 }],
    quizCompleted: false,
    handoverAccepted: false,
    goWelcomeSeen: false,
  };
}

export function openAccount(
  core: LifestartCoreState,
  params?: {
    childName?: string;
    monthlyContribution?: number;
    allocation?: Allocation;
  },
): LifestartCoreState {
  if (core.account.opened) return core;

  const childName = params?.childName?.trim() || core.family.childName;
  const monthlyContribution = params?.monthlyContribution ?? core.account.monthlyContribution;
  const allocation = params?.allocation ?? core.account.allocation;

  const nextLong = core.account.pockets.long + CONFIG.WELCOME_GRANT;
  const nextBond = nextLong + core.account.pockets.mid;
  const nextTotal = nextBond + core.account.pockets.short + core.account.skillWallet.balance;

  return {
    ...core,
    family: {
      ...core.family,
      childName,
    },
    account: {
      ...core.account,
      opened: true,
      openedAtMonth: core.monthIndex,
      monthlyContribution,
      allocation: { ...allocation },
      pockets: {
        ...core.account.pockets,
        long: nextLong,
      },
      totals: {
        ...core.account.totals,
        welcomeGrant: core.account.totals.welcomeGrant + CONFIG.WELCOME_GRANT,
      },
    },
    transactions: [
      {
        id: `tx-grant-${core.monthIndex}`,
        month: core.monthIndex,
        type: 'grant',
        pocket: 'long',
        amount: CONFIG.WELCOME_GRANT,
        label: 'OTP Lifestart Welcome Grant',
      },
      ...core.transactions,
    ],
    notifications: [
      {
        id: `notif-open-${core.monthIndex}`,
        month: core.monthIndex,
        text: `Welcome ${childName}! +25,000 Ft early-bird grant invested in Long-Term pocket.`,
        type: 'milestone',
      },
      ...core.notifications,
    ],
    historySnapshots: [
      {
        month: core.monthIndex,
        total: nextTotal,
        bond: nextBond,
        contributed: core.account.totals.contributions,
      },
    ],
  };
}

export function autoOpenDefaultAccount(core: LifestartCoreState): LifestartCoreState {
  return core.account.opened ? core : openAccount(core);
}

export function stepOneMonth(prev: LifestartCoreState): LifestartCoreState {
  const m = prev.monthIndex + 1;
  let { long, mid, short } = prev.account.pockets;
  let skillBalance = prev.account.skillWallet.balance;
  let totalFundedFromYield = prev.account.skillWallet.totalFundedFromYield;
  let {
    contributions,
    gifts: totalGifts,
    grossYieldEarned,
    feesPaid,
  } = prev.account.totals;
  let reinvestMonthsAfter18 = prev.account.reinvestMonthsAfter18;
  let tbszOpenedAtMonth = prev.account.tbszOpenedAtMonth;

  const newGifts = [...prev.gifts];
  const newNotifications = [...prev.notifications];

  // 1. Monthly contribution
  const monthlyDeposit =
    m <= CONFIG.MONTH_AGE_18
      ? prev.account.monthlyContribution
      : prev.account.adultMonthlyContribution;

  if (monthlyDeposit > 0) {
    long += monthlyDeposit * (prev.account.allocation.long / 100);
    mid += monthlyDeposit * (prev.account.allocation.mid / 100);
    short += monthlyDeposit * (prev.account.allocation.short / 100);
    contributions += monthlyDeposit;
  }

  // 2. Scheduled Family Gifts (ages 0-17, months 1..216)
  if (m <= CONFIG.MONTH_AGE_18) {
    if (m % 12 === 0) {
      long += CONFIG.GIFT_AMOUNT;
      totalGifts += CONFIG.GIFT_AMOUNT;
      newGifts.unshift({
        id: `gift-bday-${m}`,
        from: 'Grandparents & Family',
        occasion: `Age ${m / 12} Birthday`,
        amount: CONFIG.GIFT_AMOUNT,
        month: m,
      });
    } else if (m % 12 === 6) {
      long += CONFIG.GIFT_AMOUNT;
      totalGifts += CONFIG.GIFT_AMOUNT;
      newGifts.unshift({
        id: `gift-xmas-${m}`,
        from: 'Family',
        occasion: 'Christmas Gift',
        amount: CONFIG.GIFT_AMOUNT,
        month: m,
      });
    }
  }

  // 3. Super Bond / TBSZ Yield
  const yearsReinvest = Math.floor(reinvestMonthsAfter18 / 12);
  const reinvestBonus = Math.min(
    CONFIG.MAX_REINVEST_BONUS,
    yearsReinvest * CONFIG.REINVEST_BONUS_PER_YEAR,
  );
  const baseNominal = CONFIG.INFLATION_PROTECTION_RATE + CONFIG.BASE_REAL_RETURN_RATE;
  const quizBonus = prev.quizCompleted ? CONFIG.QUIZ_BONUS_RATE : 0;
  const annualRate = baseNominal + reinvestBonus + quizBonus;

  const bond = long + mid;
  const monthlyYield = bond * (annualRate / 12);
  grossYieldEarned += monthlyYield;

  let distributableYield = monthlyYield;
  if (m > CONFIG.MONTH_AGE_25) {
    const fee = CONFIG.MONTHLY_FEES_AFTER_25;
    if (distributableYield >= fee) {
      distributableYield -= fee;
    } else {
      const shortfall = fee - distributableYield;
      distributableYield = 0;
      short = Math.max(0, short - shortfall);
    }
    feesPaid += fee;
  }

  // 4. Skill Wallet & Dividend Distribution
  if (m >= 85 && m <= CONFIG.MONTH_AGE_25) {
    const toSkill = distributableYield * CONFIG.SKILL_WALLET_YIELD_SHARE;
    skillBalance += toSkill;
    totalFundedFromYield += toSkill;
    distributableYield -= toSkill;
  }

  if (prev.account.dividendMode === 'reinvest') {
    long += distributableYield;
    if (m > CONFIG.MONTH_AGE_18) {
      reinvestMonthsAfter18 += 1;
    }
  } else {
    short += distributableYield;
  }

  // 5. Earmarked OTP Persely Auto-Save inside short (ages 7-17)
  let nextPiggyGoals = prev.piggyGoals;
  if (m >= 85 && m <= CONFIG.MONTH_AGE_18) {
    const currentlySaved = nextPiggyGoals.reduce(
      (sum, g) => (g.purchasedAtMonth === null ? sum + g.saved : sum),
      0,
    );
    const availableInShort = Math.max(0, short - currentlySaved);
    const activeIndex = nextPiggyGoals.findIndex(
      (g) => g.purchasedAtMonth === null && g.saved < g.target,
    );
    if (activeIndex !== -1 && availableInShort > 0) {
      const targetGoal = nextPiggyGoals[activeIndex];
      const delta = Math.min(
        CONFIG.AUTO_PERSELY_MONTHLY,
        availableInShort,
        targetGoal.target - targetGoal.saved,
      );
      if (delta > 0) {
        nextPiggyGoals = nextPiggyGoals.map((g, idx) =>
          idx === activeIndex ? { ...g, saved: g.saved + delta } : g,
        );
      }
    }
  }

  // 6. Milestones & Auto-TBSZ Rollover at Age 18
  const childName = prev.family.childName;
  if (m === CONFIG.MONTH_AGE_7) {
    newNotifications.unshift({
      id: `ms-${m}`,
      month: m,
      text: `🎉 ${childName} turned 7! Persely goals & Skill Wallet are unlocked.`,
      type: 'milestone',
    });
  } else if (m === CONFIG.MONTH_AGE_15) {
    newNotifications.unshift({
      id: `ms-${m}`,
      month: m,
      text: `🚀 ${childName} turned 15! Direct Skill Pay, Cashback & Quiz unlocked.`,
      type: 'milestone',
    });
  } else if (m === CONFIG.MONTH_AGE_18) {
    tbszOpenedAtMonth = CONFIG.MONTH_AGE_18;
    newNotifications.unshift({
      id: `ms-${m}`,
      month: m,
      text: `🎓 ${childName} is 18! Full control & 5-Year OTP TBSZ rollover unlocked.`,
      type: 'milestone',
    });
  } else if (m === CONFIG.MONTH_AGE_25) {
    newNotifications.unshift({
      id: `ms-${m}`,
      month: m,
      text: `🥇 ${childName} is 25! OTP GO active — TBSZ matured 0% tax-free.`,
      type: 'milestone',
    });
  }

  const nextCore: LifestartCoreState = {
    ...prev,
    monthIndex: m,
    account: {
      ...prev.account,
      pockets: { long, mid, short },
      tbszOpenedAtMonth,
      reinvestMonthsAfter18,
      skillWallet: {
        ...prev.account.skillWallet,
        balance: skillBalance,
        totalFundedFromYield,
      },
      totals: {
        ...prev.account.totals,
        contributions,
        gifts: totalGifts,
        grossYieldEarned,
        feesPaid,
      },
    },
    piggyGoals: nextPiggyGoals,
    gifts: newGifts.slice(0, 40),
    notifications: newNotifications.slice(0, 30),
    historySnapshots: prev.historySnapshots,
  };

  const nextTotal = totalBalance(nextCore);
  const nextBond = long + mid;

  return {
    ...nextCore,
    historySnapshots: [
      ...prev.historySnapshots,
      {
        month: m,
        total: nextTotal,
        bond: nextBond,
        contributed: contributions,
      },
    ],
  };
}

export function travelToMonth(
  core: LifestartCoreState,
  snapshots: Record<number, LifestartCoreState>,
  targetMonth: number,
): {
  core: LifestartCoreState;
  snapshots: Record<number, LifestartCoreState>;
  maxVisitedMonth: number;
} {
  const clamped = Math.max(0, Math.min(360, Math.round(targetMonth)));

  // Backward or cached jump
  if (snapshots[clamped]) {
    return {
      core: snapshots[clamped],
      snapshots,
      maxVisitedMonth: Math.max(clamped, ...Object.keys(snapshots).map(Number)),
    };
  }

  let working = core;
  const nextSnapshots: Record<number, LifestartCoreState> = { ...snapshots };

  if (clamped > 0 && !working.account.opened) {
    working = autoOpenDefaultAccount(working);
    nextSnapshots[working.monthIndex] = working;
  }

  if (clamped < working.monthIndex) {
    // Fallback if snapshot somehow missing: replay from month 0
    working = autoOpenDefaultAccount(createInitialCoreState());
    nextSnapshots[0] = working;
  }

  while (working.monthIndex < clamped) {
    working = stepOneMonth(working);
    nextSnapshots[working.monthIndex] = working;
  }

  return {
    core: working,
    snapshots: nextSnapshots,
    maxVisitedMonth: Math.max(clamped, ...Object.keys(nextSnapshots).map(Number)),
  };
}

export function truncateFutureSnapshots(
  snapshots: Record<number, LifestartCoreState>,
  currentCore: LifestartCoreState,
): Record<number, LifestartCoreState> {
  const kept: Record<number, LifestartCoreState> = {};
  for (const [key, val] of Object.entries(snapshots)) {
    const m = Number(key);
    if (m < currentCore.monthIndex) {
      kept[m] = val;
    }
  }
  kept[currentCore.monthIndex] = currentCore;
  return kept;
}

export function applyOneOffDeposit(
  core: LifestartCoreState,
  amount: number,
  pocket: PocketKey = 'long',
): LifestartCoreState {
  if (amount <= 0) return core;
  const base = autoOpenDefaultAccount(core);
  const nextPockets = {
    ...base.account.pockets,
    [pocket]: base.account.pockets[pocket] + amount,
  };
  return {
    ...base,
    account: {
      ...base.account,
      pockets: nextPockets,
      totals: {
        ...base.account.totals,
        contributions: base.account.totals.contributions + amount,
      },
    },
    transactions: [
      {
        id: `dep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        month: base.monthIndex,
        type: 'contribution',
        pocket,
        amount,
        label: `Extra deposit to ${pocket} pocket`,
      },
      ...base.transactions,
    ],
  };
}

export function applyGift(
  core: LifestartCoreState,
  from: string,
  occasion: string,
  amount: number,
): LifestartCoreState {
  if (amount <= 0) return core;
  const base = autoOpenDefaultAccount(core);
  return {
    ...base,
    account: {
      ...base.account,
      pockets: {
        ...base.account.pockets,
        long: base.account.pockets.long + amount,
      },
      totals: {
        ...base.account.totals,
        gifts: base.account.totals.gifts + amount,
      },
    },
    gifts: [
      {
        id: `gift-manual-${Date.now()}`,
        from,
        occasion,
        amount,
        month: base.monthIndex,
      },
      ...base.gifts,
    ],
    transactions: [
      {
        id: `tx-gift-${Date.now()}`,
        month: base.monthIndex,
        type: 'gift',
        pocket: 'long',
        amount,
        label: `🎁 ${from}: ${occasion}`,
      },
      ...base.transactions,
    ],
    notifications: [
      {
        id: `notif-gift-${Date.now()}`,
        month: base.monthIndex,
        text: `🎁 ${from} sent ${amount.toLocaleString('hu-HU')} Ft (${occasion})!`,
        type: 'milestone',
      },
      ...base.notifications,
    ],
  };
}

export function movePocketMoney(
  core: LifestartCoreState,
  from: PocketKey,
  to: PocketKey,
  amount: number,
): LifestartCoreState {
  if (from === to || amount <= 0) return core;
  const maxMovable =
    from === 'short' ? shortAvailable(core) : core.account.pockets[from];
  const actual = Math.min(amount, maxMovable);
  if (actual <= 0) return core;

  return {
    ...core,
    account: {
      ...core.account,
      pockets: {
        ...core.account.pockets,
        [from]: core.account.pockets[from] - actual,
        [to]: core.account.pockets[to] + actual,
      },
    },
    transactions: [
      {
        id: `mv-${Date.now()}`,
        month: core.monthIndex,
        type: 'transfer',
        pocket: to,
        amount: actual,
        label: `Moved ${from} → ${to}`,
      },
      ...core.transactions,
    ],
  };
}

export function updateAllocation(
  core: LifestartCoreState,
  allocation: Allocation,
): LifestartCoreState {
  const sum = allocation.long + allocation.mid + allocation.short;
  if (sum !== 100) return core;
  return {
    ...core,
    account: {
      ...core.account,
      allocation: { ...allocation },
    },
  };
}

export function createPiggyGoal(
  core: LifestartCoreState,
  name: string,
  target: number,
  emoji: string,
): LifestartCoreState {
  if (!name.trim() || target <= 0) return core;
  return {
    ...core,
    piggyGoals: [
      ...core.piggyGoals,
      {
        id: `goal-${Date.now()}`,
        name: name.trim(),
        target,
        saved: 0,
        emoji,
        purchasedAtMonth: null,
      },
    ],
  };
}

export function addToPiggyGoal(
  core: LifestartCoreState,
  goalId: string,
  amount: number,
): LifestartCoreState {
  if (amount <= 0) return core;
  const available = shortAvailable(core);
  if (available <= 0) return core;

  return {
    ...core,
    piggyGoals: core.piggyGoals.map((goal) => {
      if (goal.id !== goalId || goal.purchasedAtMonth !== null) return goal;
      const room = Math.max(0, goal.target - goal.saved);
      const delta = Math.min(amount, available, room);
      return { ...goal, saved: goal.saved + delta };
    }),
  };
}

export function buyPiggyGoal(
  core: LifestartCoreState,
  goalId: string,
): { core: LifestartCoreState; purchased: boolean } {
  const goal = core.piggyGoals.find((g) => g.id === goalId);
  if (!goal || goal.purchasedAtMonth !== null || goal.saved < goal.target) {
    return { core, purchased: false };
  }

  const spendAmount = Math.min(goal.saved, core.account.pockets.short);
  return {
    purchased: true,
    core: {
      ...core,
      account: {
        ...core.account,
        pockets: {
          ...core.account.pockets,
          short: core.account.pockets.short - spendAmount,
        },
      },
      piggyGoals: core.piggyGoals.map((g) =>
        g.id === goalId ? { ...g, purchasedAtMonth: core.monthIndex } : g,
      ),
      transactions: [
        {
          id: `persely-buy-${Date.now()}`,
          month: core.monthIndex,
          type: 'persely',
          pocket: 'short',
          amount: -spendAmount,
          label: `Bought Persely goal: ${goal.emoji} ${goal.name}`,
        },
        ...core.transactions,
      ],
    },
  };
}

export function spendSkillWallet(
  core: LifestartCoreState,
  merchantId: string,
): { core: LifestartCoreState; ok: boolean; reason?: string } {
  const merchant = getSkillMerchantById(merchantId);
  if (!merchant) {
    return { core, ok: false, reason: 'Merchant not found.' };
  }
  if (!merchant.allowed) {
    return {
      core,
      ok: false,
      reason: 'Not a skill purchase — Skill Wallet is protected for your future',
    };
  }
  if (core.account.skillWallet.balance < merchant.price) {
    return {
      core,
      ok: false,
      reason: 'Insufficient Skill Wallet balance for this item.',
    };
  }

  const age = getAge(core.monthIndex);
  const approvalNote = age < 15 ? ' (Approved by Anna)' : '';

  return {
    ok: true,
    core: {
      ...core,
      account: {
        ...core.account,
        skillWallet: {
          ...core.account.skillWallet,
          balance: core.account.skillWallet.balance - merchant.price,
          spent: [
            {
              id: `skill-${Date.now()}`,
              month: core.monthIndex,
              merchant: merchant.name,
              category: merchant.category,
              amount: merchant.price,
            },
            ...core.account.skillWallet.spent,
          ],
        },
      },
      transactions: [
        {
          id: `tx-skill-${Date.now()}`,
          month: core.monthIndex,
          type: 'skill',
          pocket: 'skillWallet',
          amount: -merchant.price,
          label: `${merchant.emoji} ${merchant.name}${approvalNote}`,
        },
        ...core.transactions,
      ],
    },
  };
}

export function unlockAchievement(
  core: LifestartCoreState,
  achievementId: string,
): { core: LifestartCoreState; unlocked: boolean; cashback: number } {
  const target = core.achievements.find((a) => a.id === achievementId);
  if (!target || target.unlockedAtMonth !== null) {
    return { core, unlocked: false, cashback: 0 };
  }

  const base = autoOpenDefaultAccount(core);
  return {
    unlocked: true,
    cashback: target.cashback,
    core: {
      ...base,
      account: {
        ...base.account,
        skillWallet: {
          ...base.account.skillWallet,
          balance: base.account.skillWallet.balance + target.cashback,
          totalCashbackEarned:
            base.account.skillWallet.totalCashbackEarned + target.cashback,
        },
      },
      achievements: base.achievements.map((a) =>
        a.id === achievementId ? { ...a, unlockedAtMonth: base.monthIndex } : a,
      ),
      transactions: [
        {
          id: `tx-ach-${Date.now()}`,
          month: base.monthIndex,
          type: 'cashback',
          pocket: 'skillWallet',
          amount: target.cashback,
          label: `${target.emoji} ${target.title} cashback`,
        },
        ...base.transactions,
      ],
      notifications: [
        {
          id: `notif-ach-${Date.now()}`,
          month: base.monthIndex,
          text: `🏆 ${target.title} unlocked! +${target.cashback.toLocaleString('hu-HU')} Ft Skill Wallet cashback.`,
          type: 'milestone',
        },
        ...base.notifications,
      ],
    },
  };
}

export function logEarning(
  core: LifestartCoreState,
  source: string,
  amount: number,
): LifestartCoreState {
  if (!source.trim() || amount <= 0) return core;
  return {
    ...core,
    account: {
      ...core.account,
      pockets: {
        ...core.account.pockets,
        short: core.account.pockets.short + amount,
      },
    },
    earnings: [
      {
        id: `earn-${Date.now()}`,
        source: source.trim(),
        amount,
        month: core.monthIndex,
      },
      ...core.earnings,
    ],
    transactions: [
      {
        id: `tx-earn-${Date.now()}`,
        month: core.monthIndex,
        type: 'earning',
        pocket: 'short',
        amount,
        label: `💼 ${source.trim()}`,
      },
      ...core.transactions,
    ],
  };
}

export function completeQuiz(core: LifestartCoreState): LifestartCoreState {
  if (core.quizCompleted) return core;
  return {
    ...core,
    quizCompleted: true,
    notifications: [
      {
        id: `notif-quiz-${Date.now()}`,
        month: core.monthIndex,
        text: '🎓 Finance Quiz mastered! +0.25% permanent Super Bond yield bonus active.',
        type: 'milestone',
      },
      ...core.notifications,
    ],
  };
}

export function rollSkillWalletToTbsz(core: LifestartCoreState): LifestartCoreState {
  const bal = core.account.skillWallet.balance;
  if (bal <= 0) return core;
  return {
    ...core,
    account: {
      ...core.account,
      pockets: {
        ...core.account.pockets,
        long: core.account.pockets.long + bal,
      },
      skillWallet: {
        ...core.account.skillWallet,
        balance: 0,
      },
    },
    transactions: [
      {
        id: `tx-roll-${Date.now()}`,
        month: core.monthIndex,
        type: 'transfer',
        pocket: 'long',
        amount: bal,
        label: 'Rolled unused Skill Wallet into OTP TBSZ',
      },
      ...core.transactions,
    ],
  };
}
