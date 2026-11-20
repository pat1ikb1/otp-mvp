import { formatFt, feesVsValue, totalBalance, bondValue } from '@/engine/finance';
import { getTbszStatus } from '@/engine/rules';
import type { LifestartCoreState } from '@/types/lifestart';

export interface AdvisorPrompt {
  id: string;
  question: string;
  buildAnswer: (core: LifestartCoreState) => string;
}

export const ADVISOR_PROMPTS: AdvisorPrompt[] = [
  {
    id: 'adv-tbsz',
    question: 'Should I keep my TBSZ or cash out for a car?',
    buildAnswer: (core) => {
      const tbsz = getTbszStatus(core.monthIndex, core.account.tbszOpenedAtMonth);
      const bond = bondValue(core);
      if (tbsz.earlyExitTaxRate === 0) {
        return `Your 5-year OTP TBSZ (${formatFt(bond)}) has matured at 0% tax! You can withdraw tax-free if you need a major purchase, or roll it forward to keep earning your ${(core.account.reinvestMonthsAfter18 >= 72 ? 8.0 : 6.5).toFixed(2)}% loyalty yield and Gold status.`;
      }
      const pct = Math.round(tbsz.earlyExitTaxRate * 100);
      return `Right now your TBSZ is in ${tbsz.statusLabel}. Breaking it early triggers ${pct}% Hungarian tax (SZJA + SZOCHO) on your gains. If you can use your Short/Mid pockets (${formatFt(core.account.pockets.short + core.account.pockets.mid)}) instead, you protect ${formatFt(bond)} compounding tax-free!`;
    },
  },
  {
    id: 'adv-revolut',
    question: 'How does OTP GO stay cheaper than a free neobank?',
    buildAnswer: (core) => {
      const fvv = feesVsValue(core);
      return `Even though OTP GO has ${formatFt(fvv.annualFees)}/yr in all-in banking fees, your matured TBSZ shields ${formatFt(fvv.tbszTaxSaved)}/yr from 28% tax, your loyalty bonus adds ${formatFt(fvv.loyaltyBonusAnnual)}/yr, and Gold cashback adds ${formatFt(fvv.goldCashback)}/yr. Net result: staying with OTP beats a 0 Ft neobank by ${formatFt(fvv.exclusiveAdvantage)}/yr.`;
    },
  },
  {
    id: 'adv-mortgage',
    question: 'How do I use my Gold first-home mortgage discount?',
    buildAnswer: (core) => {
      const fvv = feesVsValue(core, true);
      return `Because your Lifestart relationship started at birth, you qualify for Gold-tier OTP Lakáshitel (-0.30% APR). On a 30M Ft first-home loan, that saves ~${formatFt(fvv.mortgageSavings)}/yr automatically — and your ${formatFt(totalBalance(core))} total balance counts toward your down payment.`;
    },
  },
  {
    id: 'adv-skill',
    question: 'What happens to my Skill Wallet at 25?',
    buildAnswer: (core) => {
      const bal = core.account.skillWallet.balance;
      return `You currently have ${formatFt(bal)} in your Skill Wallet. You can spend it on career certifications at partner schools anytime — or, from age 25, roll unused funds directly into your tax-free OTP TBSZ with one tap in the Skills tab.`;
    },
  },
];
