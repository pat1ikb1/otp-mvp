import { useState } from 'react';
import { ArrowRight, CheckCircle2, Heart, ShieldCheck, TrendingUp } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/engine/config';
import { formatFt, projectToMonth, totalBalance } from '@/engine/finance';
import { useLifestart } from '@/state/store';
import type { DividendMode } from '@/types/lifestart';

export function Handover18() {
  const { state, acceptHandover } = useLifestart();
  const { core } = state;
  const [choice, setChoice] = useState<DividendMode>('reinvest');

  const total = totalBalance(core);
  const projReinvest = projectToMonth(core, CONFIG.MONTH_AGE_25, 'reinvest');
  const projSpend = projectToMonth(core, CONFIG.MONTH_AGE_25, 'spend');
  const age25Delta = projReinvest.total - projSpend.total;

  const { welcomeGrant, contributions, gifts, grossYieldEarned } = core.account.totals;

  return (
    <div className="flex flex-1 flex-col justify-between p-4">
      <div className="space-y-3">
        {/* Emotional Hero */}
        <div className="rounded-2xl bg-[#74BF1E] p-4 text-white shadow-md">
          <span className="inline-block rounded-full bg-[#74BF1E] px-2.5 py-0.5 text-[10px] font-bold uppercase">
            Age 18 Handover
          </span>
          <h2 className="mt-2 text-lg font-extrabold leading-tight">
            {core.family.childName}, you’re 18. It’s yours now. 🎓
          </h2>
          <p className="mt-1 text-2xl font-black text-[#ffffff]">
            <MoneyFlow value={total} />
          </p>
          <p className="mt-1 text-[11px] text-emerald-100/90">
            Parent contributions pause automatically. You now take full control.
          </p>
        </div>

        {/* Breakdown Stack */}
        <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-black/5 bg-white p-3 text-xs shadow-xs">
          <div className="rounded-xl bg-[#f6f8f7] p-2">
            <p className="text-[10px] text-[#4c665f]">Parent Deposits</p>
            <p className="font-bold text-[#0b2e26] tabular-nums">{formatFt(contributions)}</p>
          </div>
          <div className="rounded-xl bg-[#f6f8f7] p-2">
            <p className="text-[10px] text-[#4c665f]">Family Gifts</p>
            <p className="font-bold text-[#0b2e26] tabular-nums">{formatFt(gifts)}</p>
          </div>
          <div className="rounded-xl bg-[#f6f8f7] p-2">
            <p className="text-[10px] text-[#4c665f]">Welcome Grant</p>
            <p className="font-bold text-[#74BF1E] tabular-nums">{formatFt(welcomeGrant)}</p>
          </div>
          <div className="rounded-xl bg-[#e5f5de] p-2">
            <p className="text-[10px] text-[#2f6b18]">Super Bond Growth</p>
            <p className="font-bold text-[#74BF1E] tabular-nums">{formatFt(grossYieldEarned)}</p>
          </div>
        </div>

        {/* Parent Note */}
        <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-[#0b2e26]">
          <Heart className="mt-0.5 h-4 w-4 shrink-0 text-[#74BF1E]" />
          <p className="italic">
            “We believed in your future from day one. Choose wisely — {core.family.parentName}”
          </p>
        </div>

        {/* 5-Year TBSZ Decision */}
        <div className="space-y-2 rounded-2xl border border-black/5 bg-white p-3 shadow-xs">
          <p className="text-xs font-bold text-[#0b2e26]">Your Next Step (18 → 25)</p>
          <button
            type="button"
            onClick={() => setChoice('reinvest')}
            className={`w-full rounded-xl border p-2.5 text-left transition-all ${
              choice === 'reinvest'
                ? 'border-[#74BF1E] bg-emerald-50/80 ring-1 ring-[#74BF1E]'
                : 'border-[#dce5e1] bg-white'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#74BF1E]">
                <ShieldCheck className="h-4 w-4 shrink-0" /> 5-Yr OTP TBSZ & Reinvest
              </span>
              <span className="shrink-0 whitespace-nowrap rounded-full bg-[#74BF1E] px-2 py-0.5 text-[9px] font-bold text-white">
                0% Tax at 23–25
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#4c665f]">
              Earns +0.25%/yr loyalty bonus (up to +1.50%) & shields 28% SZJA+SZOCHO.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setChoice('spend')}
            className={`w-full rounded-xl border p-2.5 text-left transition-all ${
              choice === 'spend'
                ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500'
                : 'border-[#dce5e1] bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#0b2e26]">
                <TrendingUp className="h-4 w-4 text-amber-600" /> Spend Dividends Now
              </span>
              <span className="text-[10px] font-semibold text-red-600 tabular-nums">
                -{formatFt(age25Delta)} by 25
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#4c665f]">
              Monthly dividends go to liquid cash; forfeits loyalty bonus & TBSZ compounding.
            </p>
          </button>
        </div>
      </div>

      <Button
        size="lg"
        onClick={() => acceptHandover(choice)}
        className="mt-3 h-11 w-full rounded-2xl bg-[#74BF1E] text-sm font-bold text-white hover:bg-[#62a318]"
      >
        <CheckCircle2 className="h-4 w-4" />
        Take Control of My Future
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
