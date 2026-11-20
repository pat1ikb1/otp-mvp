export const CONFIG = {
  PERSONA: {
    parentName: 'Anna',
    childName: 'Bence',
  },
  WELCOME_GRANT: 25_000,
  DEFAULT_MONTHLY: 10_000,
  DEFAULT_ADULT_MONTHLY: 15_000,
  DEFAULT_ALLOCATION: { long: 60, mid: 25, short: 15 },

  // Return & Bonus Model (OTP Alapkezelő Youth Multi-Asset Fund -> OTP TBSZ)
  INFLATION_PROTECTION_RATE: 0.03,
  BASE_REAL_RETURN_RATE: 0.035, // 6.50% base nominal annual yield
  REINVEST_BONUS_PER_YEAR: 0.0025, // +0.25%/yr after age 18
  MAX_REINVEST_BONUS: 0.015, // caps at +1.50%/yr (8.00% before quiz)
  QUIZ_BONUS_RATE: 0.0025, // +0.25%/yr permanent literacy bonus (8.25% ceiling)

  // Skill Wallet & Gifts
  SKILL_WALLET_YIELD_SHARE: 0.15, // 15% of monthly Super Bond yield (months 85..300)
  GIFT_AMOUNT: 15_000, // Ft per scheduled Birthday / Christmas gift

  // Persely auto-save simulation (within short pocket only)
  AUTO_PERSELY_MONTHLY: 2_500,

  // Age 25 OTP GO & Hungarian Tax Reality
  MONTHLY_FEES_AFTER_25: 1_500, // 18,000 Ft/yr all-in account + card + transfers + custody
  TBSZ_TAX_RATE: 0.28, // 15% SZJA + 13% SZOCHO
  TBSZ_MID_EXIT_TAX_RATE: 0.18, // 10% SZJA + 8% SZOCHO (3-5 yr premature exit)
  GOLD_PARTNER_CASHBACK_ANNUAL: 35_000,
  MORTGAGE_DISCOUNT_BPS: 30, // -0.30% APR on OTP Lakashitel
  DEFAULT_MORTGAGE_PRINCIPAL: 30_000_000,

  // Key Age Month Thresholds
  MONTH_AGE_7: 84,
  MONTH_AGE_15: 180,
  MONTH_AGE_18: 216,
  MONTH_AGE_25: 300,
} as const;
