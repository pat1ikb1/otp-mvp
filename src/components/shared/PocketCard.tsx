import { ChevronRight, Clock, Shield, Target, Wallet } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { Progress } from '@/components/ui/progress';
import { formatCompactFt } from '@/engine/finance';
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
    accentColor: '#38571a',
    badgeBg: '#e8f5e4',
    badgeText: '#38571a',
    icon: Shield,
  },
  mid: {
    title: 'Mid Buffer',
    subtitle: '1–3 yr goals · Super Bond',
    accentColor: '#0d9488',
    badgeBg: '#e4f4f1',
    badgeText: '#0f3f3a',
    icon: Clock,
  },
  short: {
    title: 'Short Cash',
    subtitle: 'Everyday + Persely',
    accentColor: '#52ae30',
    badgeBg: '#e8f5e4',
    badgeText: '#264210',
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
  const meta = POCKET_STYLES[pocketKey];
  const Icon = meta.icon;
  const goalPct = goal ? Math.min(100, Math.round((amount / goal.target) * 100)) : 0;

  return (
    <div
      style={{
        padding: compact ? '14px 18px' : undefined,
      }}
      className="ds-card ds-card-interactive"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            style={{ backgroundColor: meta.badgeBg, color: meta.accentColor }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          >
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold ds-text-primary">{meta.title}</p>
            <p className="truncate text-[10px] ds-text-muted">{extraNote ?? meta.subtitle}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <div className="text-right">
            <p className="text-sm font-extrabold ds-text-primary tabular-nums">
              <MoneyFlow value={amount} />
            </p>
            {allocationPct !== undefined && (
              <span
                style={{ backgroundColor: meta.badgeBg, color: meta.badgeText }}
                className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold tabular-nums"
              >
                {allocationPct}%
              </span>
            )}
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-[#52ae30]" />
        </div>
      </div>

      {goal && (
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between text-[10px] ds-text-muted">
            <span className="inline-flex items-center gap-1">
              <Target className="h-3 w-3 text-[#52ae30]" /> {goal.label}
            </span>
            <span className="font-bold tabular-nums ds-text-primary">
              {goalPct}% · {formatCompactFt(goal.target)}
            </span>
          </div>
          <Progress
            value={goalPct}
            className="h-1.5 bg-[#e4e9f0] [&_[data-slot=progress-indicator]]:bg-[#52ae30]"
          />
        </div>
      )}
    </div>
  );
}
