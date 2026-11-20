import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CONFIG } from '@/engine/config';
import { getAge, getAvailableViews } from '@/engine/rules';
import {
  addToPiggyGoal,
  applyGift,
  applyOneOffDeposit,
  autoOpenDefaultAccount,
  buyPiggyGoal,
  completeQuiz,
  createInitialCoreState,
  createPiggyGoal,
  logEarning,
  movePocketMoney,
  openAccount as engineOpenAccount,
  rollSkillWalletToTbsz,
  spendSkillWallet,
  travelToMonth,
  truncateFutureSnapshots,
  unlockAchievement,
  updateAllocation,
} from '@/engine/simulate';
import type {
  Allocation,
  AppStoreState,
  AppView,
  DividendMode,
  LifestartCoreState,
  PocketKey,
  ToastMessage,
} from '@/types/lifestart';

const STORAGE_KEY = 'otp-lifestart-last-session-v2';

interface SavedSessionPayload {
  core: LifestartCoreState;
  snapshots: Record<number, LifestartCoreState>;
  maxVisitedMonth: number;
  activeView: AppView;
}

function createBootState(): AppStoreState {
  const initialCore = createInitialCoreState();
  return {
    core: initialCore,
    snapshots: { 0: initialCore },
    maxVisitedMonth: 0,
    ui: {
      activeView: 'parent',
      activeTab: 'home',
      activeToast: null,
      confettiKey: 0,
    },
  };
}

interface LifestartContextValue {
  state: AppStoreState;
  hasSavedSession: boolean;
  openAccount: (params?: {
    childName?: string;
    monthlyContribution?: number;
    allocation?: Allocation;
  }) => void;
  jumpToMonth: (targetMonth: number) => void;
  setView: (view: AppView) => void;
  setTab: (tab: string) => void;
  deposit: (amount: number, pocket?: PocketKey) => void;
  sendGift: (from: string, occasion: string, amount: number) => void;
  moveMoney: (from: PocketKey, to: PocketKey, amount: number) => void;
  setAllocation: (allocation: Allocation) => void;
  setMonthly: (amount: number) => void;
  setAdultMonthly: (amount: number) => void;
  setDividendMode: (mode: DividendMode) => void;
  createGoal: (name: string, target: number, emoji: string) => void;
  fundGoal: (goalId: string, amount: number) => void;
  buyGoal: (goalId: string) => void;
  paySkillMerchant: (merchantId: string) => { ok: boolean; reason?: string };
  triggerAchievement: (achievementId: string) => void;
  addEarning: (source: string, amount: number) => void;
  submitQuiz: () => void;
  rollSkillToTbsz: () => void;
  acceptHandover: (mode: DividendMode) => void;
  dismissGoWelcome: () => void;
  resetDemo: () => void;
  restoreSavedSession: () => void;
  showToast: (text: string, tone?: ToastMessage['tone']) => void;
  clearToast: () => void;
}

const LifestartContext = createContext<LifestartContextValue | null>(null);

export function LifestartProvider({ children }: { children: React.ReactNode }) {
  // Always boot fresh at Age 0 for safe classroom presentation
  const [state, setState] = useState<AppStoreState>(() => createBootState());
  const [hasSavedSession, setHasSavedSession] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as SavedSessionPayload;
      return Boolean(parsed?.core?.account?.opened);
    } catch {
      return false;
    }
  });

  // Save active opened sessions to recovery key
  useEffect(() => {
    if (!state.core.account.opened) return;
    try {
      const payload: SavedSessionPayload = {
        core: state.core,
        snapshots: state.snapshots,
        maxVisitedMonth: state.maxVisitedMonth,
        activeView: state.ui.activeView,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setHasSavedSession(true);
    } catch {
      // Ignore storage quota errors in demo mode
    }
  }, [state.core, state.snapshots, state.maxVisitedMonth, state.ui.activeView]);

  // Auto-dismiss toasts
  useEffect(() => {
    if (!state.ui.activeToast) return;
    const timer = window.setTimeout(() => {
      setState((prev) => ({
        ...prev,
        ui: { ...prev.ui, activeToast: null },
      }));
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [state.ui.activeToast]);

  const showToast = useCallback(
    (text: string, tone: ToastMessage['tone'] = 'success') => {
      setState((prev) => ({
        ...prev,
        ui: {
          ...prev.ui,
          activeToast: { id: `${Date.now()}`, text, tone },
        },
      }));
    },
    [],
  );

  const clearToast = useCallback(() => {
    setState((prev) => ({ ...prev, ui: { ...prev.ui, activeToast: null } }));
  }, []);

  const mutateCore = useCallback(
    (
      updater: (core: LifestartCoreState) => LifestartCoreState,
      options?: { toast?: ToastMessage; confetti?: boolean },
    ) => {
      setState((prev) => {
        const nextCore = updater(prev.core);
        const nextSnapshots = truncateFutureSnapshots(prev.snapshots, nextCore);
        return {
          ...prev,
          core: nextCore,
          snapshots: nextSnapshots,
          maxVisitedMonth: nextCore.monthIndex,
          ui: {
            ...prev.ui,
            activeToast: options?.toast ?? prev.ui.activeToast,
            confettiKey: options?.confetti ? prev.ui.confettiKey + 1 : prev.ui.confettiKey,
          },
        };
      });
    },
    [],
  );

  const openAccount = useCallback(
    (params?: {
      childName?: string;
      monthlyContribution?: number;
      allocation?: Allocation;
    }) => {
      mutateCore((core) => engineOpenAccount(core, params), {
        confetti: true,
        toast: {
          id: `open-${Date.now()}`,
          text: '🎉 +25,000 Ft Welcome Grant added to Long Pocket!',
          tone: 'success',
        },
      });
    },
    [mutateCore],
  );

  const jumpToMonth = useCallback((targetMonth: number) => {
    setState((prev) => {
      const traveled = travelToMonth(prev.core, prev.snapshots, targetMonth);
      const nextAge = getAge(traveled.core.monthIndex);
      const prevAge = getAge(prev.core.monthIndex);
      const allowedViews = getAvailableViews(nextAge);

      let nextView = prev.ui.activeView;
      let nextTab = prev.ui.activeTab;

      if (!allowedViews.includes(nextView)) {
        nextView = allowedViews[allowedViews.length - 1];
        nextTab = 'home';
      } else if (nextAge >= 18 && prevAge < 18) {
        nextView = 'adult';
        nextTab = 'home';
      }

      let toast: ToastMessage | null = prev.ui.activeToast;
      if (nextAge !== prevAge) {
        if (nextAge === 7) {
          toast = {
            id: `m7-${Date.now()}`,
            text: `🎉 ${traveled.core.family.childName} turned 7! Kid App & Skill Wallet unlocked.`,
            tone: 'info',
          };
        } else if (nextAge === 15) {
          toast = {
            id: `m15-${Date.now()}`,
            text: `🚀 Age 15 reached! Direct Skill Pay & Cashback unlocked.`,
            tone: 'info',
          };
        } else if (nextAge === 18) {
          toast = {
            id: `m18-${Date.now()}`,
            text: `🎓 ${traveled.core.family.childName} turned 18! Full control & 5-Yr OTP TBSZ unlocked.`,
            tone: 'success',
          };
        } else if (nextAge === 25) {
          toast = {
            id: `m25-${Date.now()}`,
            text: `🥇 Age 25: OTP GO unlocked! 5-Yr TBSZ matured 0% tax-free.`,
            tone: 'success',
          };
        }
      }

      return {
        ...prev,
        core: traveled.core,
        snapshots: traveled.snapshots,
        maxVisitedMonth: traveled.maxVisitedMonth,
        ui: {
          ...prev.ui,
          activeView: nextView,
          activeTab: nextTab,
          activeToast: toast,
        },
      };
    });
  }, []);

  const setView = useCallback((view: AppView) => {
    setState((prev) => {
      const age = getAge(prev.core.monthIndex);
      const allowed = getAvailableViews(age);
      if (!allowed.includes(view)) return prev;
      return {
        ...prev,
        ui: {
          ...prev.ui,
          activeView: view,
          activeTab: 'home',
        },
      };
    });
  }, []);

  const setTab = useCallback((tab: string) => {
    setState((prev) => ({
      ...prev,
      ui: { ...prev.ui, activeTab: tab },
    }));
  }, []);

  const deposit = useCallback(
    (amount: number, pocket: PocketKey = 'long') => {
      mutateCore((core) => applyOneOffDeposit(core, amount, pocket), {
        toast: {
          id: `dep-${Date.now()}`,
          text: `✅ Deposited ${amount.toLocaleString('hu-HU')} Ft into ${pocket} pocket.`,
          tone: 'success',
        },
      });
    },
    [mutateCore],
  );

  const sendGift = useCallback(
    (from: string, occasion: string, amount: number) => {
      mutateCore((core) => applyGift(core, from, occasion, amount), {
        confetti: true,
        toast: {
          id: `gift-${Date.now()}`,
          text: `🎁 ${from} sent ${amount.toLocaleString('hu-HU')} Ft (${occasion})!`,
          tone: 'success',
        },
      });
    },
    [mutateCore],
  );

  const moveMoney = useCallback(
    (from: PocketKey, to: PocketKey, amount: number) => {
      mutateCore((core) => movePocketMoney(core, from, to, amount), {
        toast: {
          id: `mv-${Date.now()}`,
          text: `Moved ${amount.toLocaleString('hu-HU')} Ft from ${from} → ${to}.`,
          tone: 'info',
        },
      });
    },
    [mutateCore],
  );

  const setAllocation = useCallback(
    (allocation: Allocation) => {
      mutateCore((core) => updateAllocation(core, allocation));
    },
    [mutateCore],
  );

  const setMonthly = useCallback(
    (amount: number) => {
      mutateCore((core) => ({
        ...core,
        account: { ...core.account, monthlyContribution: Math.max(0, amount) },
      }));
    },
    [mutateCore],
  );

  const setAdultMonthly = useCallback(
    (amount: number) => {
      mutateCore((core) => ({
        ...core,
        account: { ...core.account, adultMonthlyContribution: Math.max(0, amount) },
      }));
    },
    [mutateCore],
  );

  const setDividendMode = useCallback(
    (mode: DividendMode) => {
      mutateCore((core) => ({
        ...core,
        account: { ...core.account, dividendMode: mode },
      }));
    },
    [mutateCore],
  );

  const createGoal = useCallback(
    (name: string, target: number, emoji: string) => {
      mutateCore((core) => createPiggyGoal(core, name, target, emoji), {
        toast: {
          id: `goal-${Date.now()}`,
          text: `${emoji} Persely goal "${name}" created!`,
          tone: 'info',
        },
      });
    },
    [mutateCore],
  );

  const fundGoal = useCallback(
    (goalId: string, amount: number) => {
      mutateCore((core) => addToPiggyGoal(core, goalId, amount), {
        toast: {
          id: `fund-${Date.now()}`,
          text: `🐷 Earmarked +${amount.toLocaleString('hu-HU')} Ft to Persely goal!`,
          tone: 'success',
        },
      });
    },
    [mutateCore],
  );

  const buyGoal = useCallback(
    (goalId: string) => {
      setState((prev) => {
        const res = buyPiggyGoal(prev.core, goalId);
        if (!res.purchased) return prev;
        const nextSnapshots = truncateFutureSnapshots(prev.snapshots, res.core);
        return {
          ...prev,
          core: res.core,
          snapshots: nextSnapshots,
          maxVisitedMonth: res.core.monthIndex,
          ui: {
            ...prev.ui,
            confettiKey: prev.ui.confettiKey + 1,
            activeToast: {
              id: `buy-${Date.now()}`,
              text: '🎉 Goal reached & purchased from Short Pocket!',
              tone: 'success',
            },
          },
        };
      });
    },
    [],
  );

  const paySkillMerchant = useCallback(
    (merchantId: string): { ok: boolean; reason?: string } => {
      let result: { ok: boolean; reason?: string } = { ok: false };
      setState((prev) => {
        const age = getAge(prev.core.monthIndex);
        const res = spendSkillWallet(prev.core, merchantId);
        if (!res.ok) {
          result = { ok: false, reason: res.reason };
          return {
            ...prev,
            ui: {
              ...prev.ui,
              activeToast: {
                id: `err-${Date.now()}`,
                text: res.reason ?? 'Purchase blocked',
                tone: 'error',
              },
            },
          };
        }

        result = { ok: true };
        const nextSnapshots = truncateFutureSnapshots(prev.snapshots, res.core);
        const toastMsg =
          age < 15
            ? `📩 Request sent to ${prev.core.family.parentName} → Approved ✓`
            : '✅ Paid directly from Skill Wallet!';

        return {
          ...prev,
          core: res.core,
          snapshots: nextSnapshots,
          maxVisitedMonth: res.core.monthIndex,
          ui: {
            ...prev.ui,
            activeToast: {
              id: `skill-${Date.now()}`,
              text: toastMsg,
              tone: 'success',
            },
          },
        };
      });
      return result;
    },
    [],
  );

  const triggerAchievement = useCallback((achievementId: string) => {
    setState((prev) => {
      const base =
        prev.core.monthIndex < CONFIG.MONTH_AGE_15
          ? travelToMonth(prev.core, prev.snapshots, CONFIG.MONTH_AGE_15)
          : { core: prev.core, snapshots: prev.snapshots, maxVisitedMonth: prev.maxVisitedMonth };

      const res = unlockAchievement(base.core, achievementId);
      if (!res.unlocked) {
        return {
          ...prev,
          ui: {
            ...prev.ui,
            activeToast: {
              id: `ach-dup-${Date.now()}`,
              text: 'Achievement already unlocked!',
              tone: 'info',
            },
          },
        };
      }

      const nextSnapshots = truncateFutureSnapshots(base.snapshots, res.core);
      const nextAge = getAge(res.core.monthIndex);
      const nextView = nextAge >= 18 ? 'adult' : nextAge >= 7 ? prev.ui.activeView : 'parent';

      return {
        ...prev,
        core: res.core,
        snapshots: nextSnapshots,
        maxVisitedMonth: res.core.monthIndex,
        ui: {
          ...prev.ui,
          activeView: nextView,
          confettiKey: prev.ui.confettiKey + 1,
          activeToast: {
            id: `ach-${Date.now()}`,
            text: `🏆 Achievement unlocked! +${res.cashback.toLocaleString('hu-HU')} Ft Skill Wallet cashback!`,
            tone: 'success',
          },
        },
      };
    });
  }, []);

  const addEarning = useCallback(
    (source: string, amount: number) => {
      mutateCore((core) => logEarning(core, source, amount), {
        toast: {
          id: `earn-${Date.now()}`,
          text: `💼 +${amount.toLocaleString('hu-HU')} Ft logged into Short Pocket!`,
          tone: 'success',
        },
      });
    },
    [mutateCore],
  );

  const submitQuiz = useCallback(() => {
    mutateCore((core) => completeQuiz(core), {
      confetti: true,
      toast: {
        id: `quiz-${Date.now()}`,
        text: '🎓 Quiz mastered! +0.25% Super Bond yield bonus active!',
        tone: 'success',
      },
    });
  }, [mutateCore]);

  const rollSkillToTbsz = useCallback(() => {
    mutateCore((core) => rollSkillWalletToTbsz(core), {
      confetti: true,
      toast: {
        id: `roll-${Date.now()}`,
        text: '📈 Skill Wallet rolled into 5-Year Tax-Free OTP TBSZ!',
        tone: 'success',
      },
    });
  }, [mutateCore]);

  const acceptHandover = useCallback(
    (mode: DividendMode) => {
      mutateCore(
        (core) => ({
          ...autoOpenDefaultAccount(core),
          handoverAccepted: true,
          account: {
            ...core.account,
            dividendMode: mode,
            tbszOpenedAtMonth: core.account.tbszOpenedAtMonth ?? CONFIG.MONTH_AGE_18,
          },
        }),
        {
          confetti: true,
          toast: {
            id: `handover-${Date.now()}`,
            text:
              mode === 'reinvest'
                ? '🎓 Rolled into 5-Year OTP TBSZ (+0.25%/yr loyalty bonus active)!'
                : '💸 Handover complete — dividends set to Spend mode.',
            tone: 'success',
          },
        },
      );
    },
    [mutateCore],
  );

  const dismissGoWelcome = useCallback(() => {
    mutateCore((core) => ({ ...core, goWelcomeSeen: true }));
  }, [mutateCore]);

  const resetDemo = useCallback(() => {
    setState(createBootState());
  }, []);

  const restoreSavedSession = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SavedSessionPayload;
      if (!parsed?.core) return;
      setState({
        core: parsed.core,
        snapshots: parsed.snapshots ?? { [parsed.core.monthIndex]: parsed.core },
        maxVisitedMonth: parsed.maxVisitedMonth ?? parsed.core.monthIndex,
        ui: {
          activeView: parsed.activeView ?? 'parent',
          activeTab: 'home',
          activeToast: {
            id: `restored-${Date.now()}`,
            text: `💾 Restored session at Age ${getAge(parsed.core.monthIndex)}.`,
            tone: 'info',
          },
          confettiKey: 0,
        },
      });
    } catch {
      showToast('No valid saved session found.', 'error');
    }
  }, [showToast]);

  return (
    <LifestartContext.Provider
      value={{
        state,
        hasSavedSession,
        openAccount,
        jumpToMonth,
        setView,
        setTab,
        deposit,
        sendGift,
        moveMoney,
        setAllocation,
        setMonthly,
        setAdultMonthly,
        setDividendMode,
        createGoal,
        fundGoal,
        buyGoal,
        paySkillMerchant,
        triggerAchievement,
        addEarning,
        submitQuiz,
        rollSkillToTbsz,
        acceptHandover,
        dismissGoWelcome,
        resetDemo,
        restoreSavedSession,
        showToast,
        clearToast,
      }}
    >
      {children}
    </LifestartContext.Provider>
  );
}

export function useLifestart(): LifestartContextValue {
  const ctx = useContext(LifestartContext);
  if (!ctx) {
    throw new Error('useLifestart must be used within LifestartProvider');
  }
  return ctx;
}
