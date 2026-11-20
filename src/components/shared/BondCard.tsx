import { ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { Progress } from '@/components/ui/progress';
import { bondValue, currentDividendRate, formatPct } from '@/engine/finance';
import { getAge, getTbszStatus } from '@/engine/rules';
import type { LifestartCoreState } from '@/types/lifestart';

export function BondCard({ core }: { core: LifestartCoreState }) {
  const age = getAge(core.monthIndex);
  const bond = bondValue(core);
  const rate = currentDividendRate(core);
  const tbsz = getTbszStatus(core.monthIndex, core.account.tbszOpenedAtMonth);
  const isAdult = age >= 18;
  const tbszProgress = Math.min(100, Math.round((tbsz.monthsHeld / 60) * 100));

  return (
    <div
      className={`rounded-2xl p-3.5 text-white shadow-sm ${
        age >= 25
          ? 'bg-[#74BF1E] ring-1 ring-[#c89b3c]/40'
          : 'bg-[#74BF1E]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-100">
            <TrendingUp className="h-3.5 w-3.5 text-[#ffffff]" />
            <span>
              {isAdult ? '5-Year OTP TBSZ · Super Bond' : 'OTP Alapkezelő Youth Fund'}
            </span>
          </div>
          <p className="mt-1 text-lg font-bold tracking-tight">
            <MoneyFlow value={bond} />
          </p>
        </div>
        <div className="rounded-xl bg-white/15 px-2.5 py-1 text-right backdrop-blur-xs">
          <p className="text-[10px] text-emerald-100">Annual Yield</p>
          <p className="text-sm font-bold tabular-nums text-[#ffffff]">{formatPct(rate)}</p>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2 py-0.5 text-[10px] font-medium text-emerald-50">
          <ShieldCheck className="h-3 w-3 text-[#ffffff]" />
          3.0% Inflation Shield
        </span>
        {core.quizCompleted && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#c89b3c]/25 px-2 py-0.5 text-[10px] font-medium text-amber-200">
            <Sparkles className="h-3 w-3" />
            +0.25% Quiz Bonus
          </span>
        )}
        <span className="inline-flex items-center rounded-full bg-white/12 px-2 py-0.5 text-[10px] font-medium text-emerald-50">
          {isAdult ? tbsz.statusLabel : 'Auto-rolls to 5-Yr TBSZ at 18'}
        </span>
      </div>

      {isAdult && tbsz.active && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[10px] text-emerald-100/90">
            <span>5-Year TBSZ Tax-Free Clock (28% SZJA+SZOCHO shield)</span>
            <span className="font-semibold tabular-nums">
              {tbsz.earlyExitTaxRate === 0 ? 'Matured ✓' : `${tbsz.monthsRemainingToMaturity} mo left`}
            </span>
          </div>
          <Progress value={tbszProgress} className="h-1.5 bg-white/20 [&_[data-slot=progress-indicator]]:bg-[#ffffff]" />
        </div>
      )}
    </div>
  );
}
