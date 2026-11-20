import { ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { Progress } from '@/components/ui/progress';
import { bondValue, currentDividendRate, formatPct } from '@/engine/finance';
import { getAge, getTbszStatus } from '@/engine/rules';
import { useDesignStudio } from '@/state/designStudio';
import type { LifestartCoreState } from '@/types/lifestart';

export function BondCard({ core }: { core: LifestartCoreState }) {
  const { tokens } = useDesignStudio();
  const age = getAge(core.monthIndex);
  const bond = bondValue(core);
  const rate = currentDividendRate(core);
  const tbsz = getTbszStatus(core.monthIndex, core.account.tbszOpenedAtMonth);
  const isAdult = age >= 18;
  const tbszProgress = Math.min(100, Math.round((tbsz.monthsHeld / 60) * 100));

  return (
    <div
      style={{
        borderRadius: 'var(--ds-card-radius)',
        padding: 'var(--ds-card-padding)',
        background: 'linear-gradient(135deg, var(--ds-header-bg) 0%, var(--ds-primary) 100%)',
        boxShadow: 'var(--ds-card-shadow)',
      }}
      className={`text-white transition-all ${age >= 25 ? 'ring-1 ring-[#c89b3c]/50' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-100">
            <TrendingUp className="h-3.5 w-3.5 text-[#74bf1e]" />
            <span>{isAdult ? '5-Year OTP TBSZ · Super Bond' : 'OTP Youth Super Bond'}</span>
          </div>
          <p className="mt-1 text-lg font-extrabold tracking-tight text-white">
            <MoneyFlow value={bond} />
          </p>
        </div>
        <div className="rounded-xl bg-[#08261e]/60 px-2.5 py-1 text-right ring-1 ring-white/15">
          <p className="text-[9px] font-semibold text-emerald-100 uppercase">Yield</p>
          <p className="text-sm font-extrabold tabular-nums text-[#74bf1e]">{formatPct(rate)}</p>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/14 px-2 py-0.5 text-[10px] font-semibold text-white">
          <ShieldCheck className="h-3 w-3 text-[#74bf1e]" />
          3% Inflation Shield
        </span>
        {core.quizCompleted && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#c89b3c] px-2 py-0.5 text-[10px] font-bold text-[#08261e]">
            <Sparkles className="h-3 w-3" />
            +0.25% Quiz
          </span>
        )}
        <span className="inline-flex items-center rounded-full bg-white/14 px-2 py-0.5 text-[10px] font-semibold text-emerald-50">
          {isAdult ? tbsz.statusLabel : 'Auto-TBSZ at 18'}
        </span>
      </div>

      {isAdult && tbsz.active && (
        <div className="mt-2.5 space-y-1">
          <div className="flex justify-between text-[10px] text-emerald-100">
            <span>
              {tokens.copyDensity === 'concise'
                ? '5-Yr Tax-Free Clock'
                : '5-Yr TBSZ Clock (28% SZJA+SZOCHO shield)'}
            </span>
            <span className="font-bold tabular-nums text-[#74bf1e]">
              {tbsz.earlyExitTaxRate === 0
                ? '0% Matured ✓'
                : `${tbsz.monthsRemainingToMaturity}m left`}
            </span>
          </div>
          <Progress
            value={tbszProgress}
            className="h-1.5 bg-white/20 [&_[data-slot=progress-indicator]]:bg-[#74bf1e]"
          />
        </div>
      )}
    </div>
  );
}
