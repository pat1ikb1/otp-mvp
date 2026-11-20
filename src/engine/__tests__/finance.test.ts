import { describe, expect, it } from 'vitest';
import { CONFIG } from '@/engine/config';
import { currentDividendRate, feesVsValue, rebalanceThreePockets } from '@/engine/finance';
import { createInitialCoreState, openAccount, travelToMonth } from '@/engine/simulate';

describe('Finance & Age 25 Stay-vs-Leave Calculations', () => {
  it('reconciles Age 25 Stay-vs-Leave numbers to the exact Forint', () => {
    const start = openAccount(createInitialCoreState());
    const at25 = travelToMonth(start, { 0: start }, CONFIG.MONTH_AGE_25).core;

    expect(currentDividendRate(at25)).toBeCloseTo(0.08, 6);

    const fvv = feesVsValue(at25, false);
    expect(Math.round(fvv.bondBalance)).toBe(6_475_817);
    expect(fvv.baseMarketGross).toBe(420_928);
    expect(fvv.tbszTaxSaved).toBe(117_860);
    expect(fvv.neobankNetReturn).toBe(303_068);
    expect(fvv.loyaltyBonusAnnual).toBe(97_137);
    expect(fvv.grossAnnualYield).toBe(518_065);
    expect(fvv.goldCashback).toBe(35_000);
    expect(fvv.annualFees).toBe(18_000);
    expect(fvv.otpGoNet).toBe(535_065);
    expect(fvv.exclusiveAdvantage).toBe(231_997);

    // Verify exact vertical & horizontal sum consistency
    expect(fvv.otpGoNet - fvv.neobankNetReturn).toBe(fvv.exclusiveAdvantage);
    expect(
      fvv.tbszTaxSaved + fvv.loyaltyBonusAnnual + fvv.goldCashback - fvv.annualFees,
    ).toBe(fvv.exclusiveAdvantage);
  });

  it('adds exact 90,000 Ft/yr mortgage savings when first-home toggle is enabled', () => {
    const start = openAccount(createInitialCoreState());
    const at25 = travelToMonth(start, { 0: start }, CONFIG.MONTH_AGE_25).core;

    const withMortgage = feesVsValue(at25, true);
    expect(withMortgage.mortgageSavings).toBe(90_000);
    expect(withMortgage.exclusiveAdvantage).toBe(321_997);
    expect(withMortgage.otpGoNet - withMortgage.neobankNetReturn).toBe(321_997);
  });

  it('rebalances all 3 pocket sliders proportionally to sum to 100%', () => {
    const start = { long: 60, mid: 25, short: 15 };

    // Scaling long to 80 scales remaining 20 across 25:15 -> 13 and 7
    const at80 = rebalanceThreePockets(start, 'long', 80);
    expect(at80).toEqual({ long: 80, mid: 13, short: 7 });
    expect(at80.long + at80.mid + at80.short).toBe(100);

    // Dragging long to 100 zeroes both other pockets cleanly
    const at100 = rebalanceThreePockets(start, 'long', 100);
    expect(at100).toEqual({ long: 100, mid: 0, short: 0 });

    // Lowering from 100/0/0 splits remaining evenly across both other pockets
    const recovered = rebalanceThreePockets(at100, 'long', 50);
    expect(recovered).toEqual({ long: 50, mid: 25, short: 25 });
  });
});
