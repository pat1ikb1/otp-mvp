import { useState } from 'react';
import { Gift, HeartHandshake, Plus, TrendingUp, X } from 'lucide-react';
import { BondCard } from '@/components/shared/BondCard';
import { GrowthChart } from '@/components/shared/GrowthChart';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { PocketCard } from '@/components/shared/PocketCard';
import { Button } from '@/components/ui/button';
import { bondValue, currentDividendRate, formatFt, totalBalance } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function ParentHome() {
  const { state, deposit, setTab } = useLifestart();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const total = totalBalance(core);
  const annualEstDividend = bondValue(core) * currentDividendRate(core);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="space-y-3 pb-2">
      {/* Total Value Hero */}
      <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[#4c665f]">
              {core.family.childName}’s Total Lifestart Value
            </p>
            <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-[#0b2e26]">
              <MoneyFlow value={total} />
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e5f5de] px-2 py-0.5 text-[10px] font-bold text-[#2f6b18]">
            <TrendingUp className="h-3 w-3" />
            +<MoneyFlow value={annualEstDividend} />/yr
          </span>
        </div>

        <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-[#ebf3f0] px-2.5 py-2 text-[11px] text-[#0b2e26]">
          <HeartHandshake className="h-4 w-4 shrink-0 text-[#74BF1E]" />
          <span>
            You’ve already secured <strong>{formatFt(total)}</strong> for {core.family.childName}’s future.
          </span>
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <Button
            size="sm"
            onClick={() => setDrawerOpen(true)}
            className="rounded-xl bg-[#74BF1E] text-xs font-semibold text-white hover:bg-[#62a318]"
          >
            <Plus className="h-3.5 w-3.5" /> One-Off Deposit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTab('gifting')}
            className="rounded-xl border-[#dce5e1] text-xs font-semibold text-[#0b2e26]"
          >
            <Gift className="h-3.5 w-3.5 text-[#74BF1E]" /> Family Gift Link
          </Button>
        </div>
      </div>

      {/* 3 Pockets */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-0.5">
          <p className="text-xs font-bold text-[#0b2e26]">The 3 Pockets</p>
          <button
            type="button"
            onClick={() => setTab('pockets')}
            className="text-[11px] font-semibold text-[#74BF1E]"
          >
            Adjust split →
          </button>
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
          <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs">
            <span className="font-semibold text-amber-900">🎓 {core.family.childName}’s Skill Wallet (15% of yield)</span>
            <span className="font-bold text-amber-900">
              <MoneyFlow value={core.account.skillWallet.balance} />
            </span>
          </div>
        )}
      </div>

      {/* Super Bond Card */}
      <BondCard core={core} />

      {/* Growth Chart */}
      <GrowthChart core={core} />

      {/* Quick In-Phone Deposit Sheet */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/35 p-3 sm:absolute sm:inset-0">
          <div className="w-full rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#0b2e26]">Quick Top-Up</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1 text-[#4c665f] hover:bg-black/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-[#4c665f]">
              Adds directly to {core.family.childName}’s compounding Super Bond.
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
                  className="bg-[#74BF1E] text-xs font-bold text-white"
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
