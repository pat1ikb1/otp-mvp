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
    <div className="ds-card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8f5e4] text-[#52ae30]">
            <TrendingUp className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[11px] font-semibold ds-text-muted">
              {isAdult ? '5-Year OTP TBSZ · Super Bond' : 'OTP Youth Super Bond'}
            </p>
            <p className="text-lg font-extrabold tracking-tight ds-text-primary tabular-nums">
              <MoneyFlow value={bond} />
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-[#38571a] px-2.5 py-1 text-right text-white">
          <p className="text-[9px] font-semibold text-emerald-100 uppercase">Yield</p>
          <p className="text-xs font-extrabold tabular-nums">{formatPct(rate)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5e4] px-2.5 py-0.5 text-[10px] font-bold text-[#38571a]">
          <ShieldCheck className="h-3 w-3 text-[#52ae30]" />
          3% Inflation Shield
        </span>
        {core.quizCompleted && (
          <span className="otp-tag-new inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold">
            <Sparkles className="h-3 w-3" />
            +0.25% Quiz
          </span>
        )}
        <span className="inline-flex items-center rounded-full bg-[#f2f5f8] px-2.5 py-0.5 text-[10px] font-semibold ds-text-muted">
          {isAdult ? tbsz.statusLabel : 'Auto-TBSZ at 18'}
        </span>
      </div>

      {isAdult && tbsz.active && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] ds-text-muted">
            <span>5-Yr Tax-Free Clock</span>
            <span className="font-bold tabular-nums text-[#38571a]">
              {tbsz.earlyExitTaxRate === 0
                ? '0% Matured ✓'
                : `${tbsz.monthsRemainingToMaturity}m left`}
            </span>
          </div>
          <Progress
            value={tbszProgress}
            className="h-1.5 bg-[#e4e9f0] [&_[data-slot=progress-indicator]]:bg-[#52ae30]"
          />
        </div>
      )}
    </div>
  );
}
