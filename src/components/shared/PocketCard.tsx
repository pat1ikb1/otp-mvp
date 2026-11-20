import { Clock, Shield, Target, Wallet } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { Progress } from '@/components/ui/progress';
import { formatCompactFt } from '@/engine/finance';
import { useDesignStudio } from '@/state/designStudio';
import type { PocketKey } from '@/types/lifestart';

const POCKET_STYLES: Record<
  PocketKey,
  {
    title: string;
    subtitle: string;
    accentColor: string;
    badgeBg: string;
    badgeText: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  long: {
    title: 'Long Vault',
    subtitle: 'Car / Home · Super Bond',
    accentColor: '#005e48',
    badgeBg: '#e4f3ec',
    badgeText: '#08261e',
    icon: Shield,
  },
  mid: {
    title: 'Mid Buffer',
    subtitle: '1–3 yr goals · Super Bond',
    accentColor: '#0d9488',
    badgeBg: '#dff4f1',
    badgeText: '#0f3f3a',
    icon: Clock,
  },
  short: {
    title: 'Short Cash',
    subtitle: 'Everyday + Persely goals',
    accentColor: '#3c8322',
    badgeBg: '#e7f6d5',
    badgeText: '#1b3a07',
    icon: Wallet,
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
  const { tokens } = useDesignStudio();
  const meta = POCKET_STYLES[pocketKey];
  const Icon = meta.icon;
  const goalPct = goal ? Math.min(100, Math.round((amount / goal.target) * 100)) : 0;
  const showSubtitle = tokens.copyDensity !== 'concise' || Boolean(extraNote);

  return (
    <div
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: meta.accentColor,
        padding: compact ? 'calc(var(--ds-card-padding) * 0.72) var(--ds-card-padding)' : undefined,
      }}
      className="ds-card"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            style={{ backgroundColor: meta.badgeBg, color: meta.accentColor }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold ds-text-primary">{meta.title}</p>
            {showSubtitle && (
              <p className="truncate text-[10px] ds-text-muted">{extraNote ?? meta.subtitle}</p>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-extrabold ds-text-primary tabular-nums">
            <MoneyFlow value={amount} />
          </p>
          {allocationPct !== undefined && (
            <span
              style={{ backgroundColor: meta.badgeBg, color: meta.badgeText }}
              className="inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold tabular-nums"
            >
              {allocationPct}%
            </span>
          )}
        </div>
      </div>

      {goal && (
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-[10px] ds-text-muted">
            <span className="inline-flex items-center gap-1">
              <Target className="h-3 w-3 text-[#005e48]" /> {goal.label}
            </span>
            <span className="font-bold tabular-nums ds-text-primary">
              {goalPct}% · {formatCompactFt(goal.target)}
            </span>
          </div>
          <Progress
            value={goalPct}
            className="h-1.5 [&_[data-slot=progress-indicator]]:bg-[#005e48]"
          />
        </div>
      )}
    </div>
  );
}
