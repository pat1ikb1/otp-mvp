import { useMemo, useState } from 'react';
import { Gift, GraduationCap, Plus, SlidersHorizontal, Sparkles, TrendingUp, X } from 'lucide-react';
import { BondCard } from '@/components/shared/BondCard';
import { GrowthChart } from '@/components/shared/GrowthChart';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { PocketCard } from '@/components/shared/PocketCard';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { bondValue, currentDividendRate, totalBalance } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function ParentHome() {
  const { state, deposit, setTab } = useLifestart();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const total = totalBalance(core);
  const annualEstDividend = bondValue(core) * currentDividendRate(core);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Locked Final Order: ["parent-hero", "parent-chart", "parent-bond", "parent-pockets"]
  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'parent-hero',
        render: () => (
          <div className="space-y-4">
            {/* OTP Circular Quick Action Bubbles (matching Template/card3.webp) */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="otp-action-circle-primary flex h-12 w-12 items-center justify-center rounded-full">
                  <Plus className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-bold text-[#0b2e26]">Top Up</span>
              </button>

              <button
                type="button"
                onClick={() => setTab('gifting')}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="otp-action-circle flex h-12 w-12 items-center justify-center rounded-full">
                  <Gift className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-semibold text-[#4a635c]">Gift Link</span>
              </button>

              <button
                type="button"
                onClick={() => setTab('pockets')}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="otp-action-circle flex h-12 w-12 items-center justify-center rounded-full">
                  <SlidersHorizontal className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-semibold text-[#4a635c]">Split</span>
              </button>

              <button
                type="button"
                onClick={() => setTab('benefits')}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="otp-action-circle flex h-12 w-12 items-center justify-center rounded-full">
                  <Sparkles className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-semibold text-[#4a635c]">Perks</span>
              </button>
            </div>

            {/* White Neuromorphic Total Value Card */}
            <div className="ds-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold ds-text-muted">
                    {core.family.childName}’s Lifestart Value
                  </p>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight ds-text-primary">
                    <MoneyFlow value={total} />
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5e4] px-2.5 py-1 text-[10px] font-bold text-[#38571a]">
                  <TrendingUp className="h-3 w-3 text-[#52ae30]" />
                  +<MoneyFlow value={annualEstDividend} />/yr
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'parent-chart',
        render: () => <GrowthChart core={core} />,
      },
      {
        id: 'parent-bond',
        render: () => <BondCard core={core} />,
      },
      {
        id: 'parent-pockets',
        render: () => (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-0.5">
              <p className="text-xs font-extrabold ds-text-primary">3-Pocket Split</p>
              <button
                type="button"
                onClick={() => setTab('pockets')}
                className="text-[11px] font-bold text-[#38571a] hover:underline"
              >
                Adjust →
              </button>
            </div>

            <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#e4e9f0]">
              <div
                style={{ width: `${core.account.allocation.long}%` }}
                className="bg-[#38571a] transition-all"
              />
              <div
                style={{ width: `${core.account.allocation.mid}%` }}
                className="bg-[#0d9488] transition-all"
              />
              <div
                style={{ width: `${core.account.allocation.short}%` }}
                className="bg-[#52ae30] transition-all"
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
              <div className="ds-card flex items-center justify-between !py-3 text-xs">
                <span className="inline-flex items-center gap-1.5 font-bold text-[#0b2e26]">
                  <GraduationCap className="h-4 w-4 text-[#52ae30]" />
                  Skill Wallet (15% yield)
                </span>
                <span className="font-extrabold text-[#38571a]">
                  <MoneyFlow value={core.account.skillWallet.balance} />
                </span>
              </div>
            )}
          </div>
        ),
      },
    ],
    [core, age, total, annualEstDividend, setTab],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="parent-home" blocks={blocks} />

      {/* Quick In-Phone Deposit Sheet */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/35 p-3 sm:absolute sm:inset-0">
          <div className="ds-card w-full shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold ds-text-primary">Quick Top-Up</p>
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
                  style={{ borderRadius: 'var(--ds-btn-radius)' }}
                  className="ds-btn bg-[#38571a] text-xs font-bold text-white"
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
