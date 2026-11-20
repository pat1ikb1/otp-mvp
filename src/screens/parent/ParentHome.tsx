import { useMemo, useState } from 'react';
import { Gift, GraduationCap, Plus, TrendingUp, X } from 'lucide-react';
import { BondCard } from '@/components/shared/BondCard';
import { GrowthChart } from '@/components/shared/GrowthChart';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { PocketCard } from '@/components/shared/PocketCard';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { bondValue, currentDividendRate, totalBalance } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useDesignStudio } from '@/state/designStudio';
import { useLifestart } from '@/state/store';

export function ParentHome() {
  const { state, deposit, setTab } = useLifestart();
  const { tokens } = useDesignStudio();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const total = totalBalance(core);
  const annualEstDividend = bondValue(core) * currentDividendRate(core);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'parent-hero',
        title: 'Total Value & CTA',
        eyeCue: 'Check balance & top up',
        whyHere: 'F-Pattern Top Anchor: shows net future wealth and the single primary action (+ Deposit) immediately.',
        render: () => (
          <div className="ds-card">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold ds-text-muted">
                  {core.family.childName}’s Lifestart Value
                </p>
                <p className="mt-0.5 text-2xl font-extrabold tracking-tight ds-text-primary">
                  <MoneyFlow value={total} />
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e5f5de] px-2 py-0.5 text-[10px] font-bold text-[#08261e]">
                <TrendingUp className="h-3 w-3 text-[#005e48]" />
                +<MoneyFlow value={annualEstDividend} />/yr
              </span>
            </div>

            {tokens.copyDensity === 'detailed' && (
              <p className="mt-2 rounded-xl bg-[#ebf3f0] px-2.5 py-1.5 text-[11px] font-medium text-[#08261e]">
                Compounding automatically across 3 dedicated pockets.
              </p>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                size="sm"
                onClick={() => setDrawerOpen(true)}
                style={{
                  borderRadius: 'var(--ds-btn-radius)',
                  backgroundColor: 'var(--ds-primary)',
                  color: 'var(--ds-primary-fg)',
                }}
                className="ds-btn h-9 text-xs font-bold hover:opacity-95"
              >
                <Plus className="h-3.5 w-3.5" /> Top Up
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTab('gifting')}
                style={{ borderRadius: 'var(--ds-btn-radius)' }}
                className="ds-btn h-9 border-[#dce5e1] text-xs font-semibold ds-text-primary"
              >
                <Gift className="h-3.5 w-3.5 text-[#005e48]" /> Gift Link
              </Button>
            </div>
          </div>
        ),
      },
      {
        id: 'parent-pockets',
        title: '3-Pocket Split',
        eyeCue: 'Scan pocket balances',
        whyHere: 'Proportional bar + 3 color-coded pockets make allocation readable in 1 second without prose.',
        render: () => (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-0.5">
              <p className="text-xs font-bold ds-text-primary">3-Pocket Allocation</p>
              <button
                type="button"
                onClick={() => setTab('pockets')}
                style={{ color: 'var(--ds-primary)' }}
                className="text-[11px] font-bold hover:underline"
              >
                Edit split →
              </button>
            </div>

            {/* Visual Proportional Bar */}
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-black/8">
              <div
                style={{ width: `${core.account.allocation.long}%` }}
                className="bg-[#005e48] transition-all"
              />
              <div
                style={{ width: `${core.account.allocation.mid}%` }}
                className="bg-[#0d9488] transition-all"
              />
              <div
                style={{ width: `${core.account.allocation.short}%` }}
                className="bg-[#74bf1e] transition-all"
              />
            </div>

            <PocketCard
              pocketKey="long"
              amount={core.account.pockets.long}
              allocationPct={core.account.allocation.long}
              compact
            />
            <PocketCard
              pocketKey="mid"
              amount={core.account.pockets.mid}
              allocationPct={core.account.allocation.mid}
              compact
            />
            <PocketCard
              pocketKey="short"
              amount={core.account.pockets.short}
              allocationPct={core.account.allocation.short}
              compact
            />

            {age >= 7 && (
              <div className="flex items-center justify-between rounded-xl border border-amber-300/70 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <GraduationCap className="h-3.5 w-3.5 text-amber-700" />
                  Skill Wallet (15% yield)
                </span>
                <span className="font-extrabold">
                  <MoneyFlow value={core.account.skillWallet.balance} />
                </span>
              </div>
            )}
          </div>
        ),
      },
      {
        id: 'parent-bond',
        title: 'Super Bond Yield',
        eyeCue: 'Verify inflation shield',
        whyHere: 'High-contrast card reinforces trust with live annual yield & inflation protection.',
        render: () => <BondCard core={core} />,
      },
      {
        id: 'parent-chart',
        title: '0→25 Trajectory',
        eyeCue: 'Project Age 25 outcome',
        whyHere: 'Visual payoff curve sits at the bottom to anchor long-term confidence.',
        render: () => <GrowthChart core={core} />,
      },
    ],
    [core, age, total, annualEstDividend, setTab, tokens.copyDensity],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="parent-home" blocks={blocks} />

      {/* Quick In-Phone Deposit Sheet */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-3 sm:absolute sm:inset-0">
          <div className="ds-card w-full shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold ds-text-primary">Quick Top-Up</p>
              <button
                type="button"
                aria-label="Close deposit sheet"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1 ds-text-muted hover:bg-black/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs ds-text-muted">
              Adds straight to {core.family.childName}’s Long Vault.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[10_000, 25_000, 50_000].map((amt) => (
                <Button
                  key={amt}
                  size="sm"
                  onClick={() => {
                    deposit(amt, 'long');
                    setDrawerOpen(false);
                  }}
                  style={{
                    borderRadius: 'var(--ds-btn-radius)',
                    backgroundColor: 'var(--ds-primary)',
                    color: 'var(--ds-primary-fg)',
                  }}
                  className="ds-btn text-xs font-bold"
                >
                  +{amt / 1000}k Ft
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
