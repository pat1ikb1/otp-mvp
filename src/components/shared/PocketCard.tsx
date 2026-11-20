import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { Progress } from '@/components/ui/progress';
import { formatCompactFt } from '@/engine/finance';
import type { PocketKey } from '@/types/lifestart';

const POCKET_STYLES: Record<
  PocketKey,
  { title: string; subtitle: string; colorClass: string; badgeBg: string; dotColor: string }
> = {
  long: {
    title: 'Long-Term Vault',
    subtitle: 'Car / First Home · Super Bond',
    colorClass: 'border-l-4 border-l-[#74BF1E]',
    badgeBg: 'bg-emerald-50 text-[#74BF1E]',
    dotColor: 'bg-[#74BF1E]',
  },
  mid: {
    title: 'Mid-Term Buffer',
    subtitle: 'Next 1–3 yrs · Super Bond',
    colorClass: 'border-l-4 border-l-[#74BF1E]',
    badgeBg: 'bg-teal-50 text-[#74BF1E]',
    dotColor: 'bg-[#74BF1E]',
  },
  short: {
    title: 'Short-Term + Persely',
    subtitle: 'Everyday cash & earmarked goals',
    colorClass: 'border-l-4 border-l-[#74BF1E]',
    badgeBg: 'bg-lime-50 text-[#3c8322]',
    dotColor: 'bg-[#74BF1E]',
  },
};

export function PocketCard({
  pocketKey,
  amount,
  allocationPct,
  extraNote,
  goal,
  compact = false,
}: {
  pocketKey: PocketKey;
  amount: number;
  allocationPct?: number;
  extraNote?: string;
  goal?: { label: string; target: number };
  compact?: boolean;
}) {
  const meta = POCKET_STYLES[pocketKey];
  const goalPct = goal ? Math.min(100, Math.round((amount / goal.target) * 100)) : 0;
  return (
    <div
      className={`rounded-2xl border border-black/5 bg-white shadow-xs ${meta.colorClass} ${
        compact ? 'px-3 py-2.5' : 'px-3.5 py-3'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${meta.dotColor}`} />
          <div>
            <p className="text-xs font-semibold text-[#0b2e26]">{meta.title}</p>
            <p className="text-[11px] text-[#4c665f]">{extraNote ?? meta.subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-[#0b2e26]">
            <MoneyFlow value={amount} />
          </p>
          {allocationPct !== undefined && (
            <span className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${meta.badgeBg}`}>
              {allocationPct}% split
            </span>
          )}
        </div>
      </div>
      {goal && (
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-[10px] text-[#4c665f]">
            <span>🎯 {goal.label}</span>
            <span className="font-semibold tabular-nums">
              {goalPct}% of {formatCompactFt(goal.target)}
            </span>
          </div>
          <Progress value={goalPct} className="h-1.5 [&_[data-slot=progress-indicator]]:bg-[#74BF1E]" />
        </div>
      )}
    </div>
  );
}
