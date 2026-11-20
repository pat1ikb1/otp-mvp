import { describe, expect, it } from 'vitest';
import { CONFIG } from '@/engine/config';
import { bondValue, shortAvailable, totalBalance, totalPiggySaved } from '@/engine/finance';
import {
  addToPiggyGoal,
  applyGift,
  applyOneOffDeposit,
  buyPiggyGoal,
  createInitialCoreState,
  movePocketMoney,
  openAccount,
  rollSkillWalletToTbsz,
  spendSkillWallet,
  travelToMonth,
  truncateFutureSnapshots,
  unlockAchievement,
} from '@/engine/simulate';

import type { LifestartCoreState } from '@/types/lifestart';

describe('Simulation Engine & Accounting Invariants', () => {
  it('matches exact verified baseline balances at Age 7, 15, 18, and 25', () => {
    const start = openAccount(createInitialCoreState());
    let snapshots: Record<number, LifestartCoreState> = { 0: start };

    const age7 = travelToMonth(start, snapshots, CONFIG.MONTH_AGE_7);
    snapshots = age7.snapshots;
    expect(Math.round(totalBalance(age7.core))).toBe(1_334_234);
    expect(Math.round(bondValue(age7.core))).toBe(1_208_234);
    expect(Math.round(age7.core.account.pockets.short)).toBe(126_000);
    expect(Math.round(age7.core.account.skillWallet.balance)).toBe(0);

    const age15 = travelToMonth(age7.core, snapshots, CONFIG.MONTH_AGE_15);
    snapshots = age15.snapshots;
    expect(Math.round(totalBalance(age15.core))).toBe(3_640_632);
    expect(Math.round(bondValue(age15.core))).toBe(3_204_672);
    expect(Math.round(age15.core.account.skillWallet.balance)).toBe(165_960);

    const age18 = travelToMonth(age15.core, snapshots, CONFIG.MONTH_AGE_18);
    snapshots = age18.snapshots;
    expect(Math.round(totalBalance(age18.core))).toBe(4_809_203);
    expect(Math.round(bondValue(age18.core))).toBe(4_211_458);
    expect(Math.round(age18.core.account.skillWallet.balance)).toBe(273_745);
    expect(age18.core.account.tbszOpenedAtMonth).toBe(CONFIG.MONTH_AGE_18);

    const age25 = travelToMonth(age18.core, snapshots, CONFIG.MONTH_AGE_25);
    expect(Math.round(totalBalance(age25.core))).toBe(7_473_155);
    expect(Math.round(bondValue(age25.core))).toBe(6_475_817);
    expect(Math.round(age25.core.account.skillWallet.balance)).toBe(673_338);
  });

  it('maintains gift schedule cadence: 0 at birth, 36 gifts = 540,000 Ft by 18, 0 automatic gifts after 18', () => {
    const start = openAccount(createInitialCoreState());
    expect(start.gifts.length).toBe(0);
    expect(start.account.totals.gifts).toBe(0);

    const at18 = travelToMonth(start, { 0: start }, CONFIG.MONTH_AGE_18);
    expect(at18.core.account.totals.gifts).toBe(540_000);

    const at25 = travelToMonth(at18.core, at18.snapshots, CONFIG.MONTH_AGE_25);
    expect(at25.core.account.totals.gifts).toBe(540_000);
  });

  it('preserves strict conservation of money and Persely bounds across all operations', () => {
    const start = openAccount(createInitialCoreState());
    let state = travelToMonth(start, { 0: start }, CONFIG.MONTH_AGE_15).core;

    const assertConservation = (s: typeof state) => {
      const sum =
        s.account.pockets.long +
        s.account.pockets.mid +
        s.account.pockets.short +
        s.account.skillWallet.balance;
      expect(Math.abs(totalBalance(s) - sum)).toBeLessThan(0.001);
      expect(totalPiggySaved(s)).toBeLessThanOrEqual(s.account.pockets.short + 0.001);
      expect(shortAvailable(s)).toBeGreaterThanOrEqual(0);
    };

    assertConservation(state);
    state = applyOneOffDeposit(state, 50_000, 'mid');
    assertConservation(state);
    state = applyGift(state, 'Grandma', 'Birthday', 15_000);
    assertConservation(state);
    state = movePocketMoney(state, 'mid', 'short', 25_000);
    assertConservation(state);
    state = addToPiggyGoal(state, 'goal-bike', 5_000);
    assertConservation(state);

    // Bike goal should be full (45,000) and purchasable from short pocket
    const prevShort = state.account.pockets.short;
    const bought = buyPiggyGoal(state, 'goal-bike');
    expect(bought.purchased).toBe(true);
    state = bought.core;
    expect(Math.round(state.account.pockets.short)).toBe(Math.round(prevShort - 45_000));
    assertConservation(state);

    // Unlock achievement cashback & roll skill wallet into TBSZ
    const ach = unlockAchievement(state, 'ach-lang');
    expect(ach.unlocked).toBe(true);
    state = ach.core;
    assertConservation(state);

    const beforeRollBond = bondValue(state);
    const skillBal = state.account.skillWallet.balance;
    state = rollSkillWalletToTbsz(state);
    expect(state.account.skillWallet.balance).toBe(0);
    expect(Math.round(bondValue(state))).toBe(Math.round(beforeRollBond + skillBal));
    assertConservation(state);
  });

  it('rejects non-skill purchases with zero balance change', () => {
    const start = openAccount(createInitialCoreState());
    const at15 = travelToMonth(start, { 0: start }, CONFIG.MONTH_AGE_15).core;
    const beforeSkill = at15.account.skillWallet.balance;

    const blocked = spendSkillWallet(at15, 'blocked-gamestore');
    expect(blocked.ok).toBe(false);
    expect(blocked.reason).toContain('Not a skill purchase');
    expect(blocked.core.account.skillWallet.balance).toBe(beforeSkill);

    const allowed = spendSkillWallet(at15, 'skill-lang-course');
    expect(allowed.ok).toBe(true);
    expect(allowed.core.account.skillWallet.balance).toBe(beforeSkill - 45_000);
  });

  it('supports bidirectional snapshot scrubbing and clean future truncation on mid-history edits', () => {
    const start = openAccount(createInitialCoreState());
    const fwd25 = travelToMonth(start, { 0: start }, CONFIG.MONTH_AGE_25);
    const back15 = travelToMonth(fwd25.core, fwd25.snapshots, CONFIG.MONTH_AGE_15);
    expect(Math.round(totalBalance(back15.core))).toBe(3_640_632);

    const back25 = travelToMonth(back15.core, back15.snapshots, CONFIG.MONTH_AGE_25);
    expect(totalBalance(back25.core)).toBe(totalBalance(fwd25.core));

    // Mutate at 15 and truncate future snapshots
    const edited15 = applyGift(back15.core, 'Grandma', 'Extra Gift', 100_000);
    const truncated = truncateFutureSnapshots(back15.snapshots, edited15);
    expect(truncated[CONFIG.MONTH_AGE_25]).toBeUndefined();

    const recomputed25 = travelToMonth(edited15, truncated, CONFIG.MONTH_AGE_25);
    expect(totalBalance(recomputed25.core)).toBeGreaterThan(totalBalance(fwd25.core) + 100_000);
  });
});
