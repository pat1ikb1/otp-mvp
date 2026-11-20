import { ArrowRightLeft } from 'lucide-react';
import { useState } from 'react';
import { PocketCard } from '@/components/shared/PocketCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatFt, shortAvailable } from '@/engine/finance';
import { useLifestart } from '@/state/store';
import type { PocketKey } from '@/types/lifestart';

export function ParentPockets() {
  const { state, setAllocation, setMonthly, moveMoney } = useLifestart();
  const { core } = state;
  const { allocation, pockets, monthlyContribution } = core.account;
  const [fromPocket, setFromPocket] = useState<PocketKey>('mid');
  const [toPocket, setToPocket] = useState<PocketKey>('long');
  const [transferAmount, setTransferAmount] = useState<number>(20_000);

  const updateLong = (nextLong: number) => {
    const clamped = Math.max(10, Math.min(85, nextLong));
    const rem = 100 - clamped;
    const prevRem = allocation.mid + allocation.short;
    const nextMid =
      prevRem > 0 ? Math.round((allocation.mid / prevRem) * rem) : Math.round(rem / 2);
    const nextShort = 100 - clamped - nextMid;
    setAllocation({ long: clamped, mid: nextMid, short: nextShort });
  };

  const updateMid = (nextMid: number) => {
    const maxMid = 100 - allocation.long;
    const clampedMid = Math.max(0, Math.min(maxMid, nextMid));
    const nextShort = 100 - allocation.long - clampedMid;
    setAllocation({ long: allocation.long, mid: clampedMid, short: nextShort });
  };

  return (
    <div className="space-y-3 pb-2">
      <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-[#0b2e26]">Monthly Auto-Deposit</p>
          <span className="text-xs font-extrabold text-[#74BF1E] tabular-nums">
            {formatFt(monthlyContribution)}/mo
          </span>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {[5_000, 10_000, 15_000, 25_000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setMonthly(amt)}
              className={`rounded-xl py-1.5 text-xs font-semibold tabular-nums ${
                monthlyContribution === amt
                  ? 'bg-[#74BF1E] text-white'
                  : 'bg-[#ebf3f0] text-[#0b2e26]'
              }`}
            >
              {amt / 1000}k
            </button>
          ))}
        </div>
      </div>

      {/* Allocation Sliders locked to 100% */}
      <div className="space-y-3 rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-[#0b2e26]">Pocket Split Rules</p>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#74BF1E] tabular-nums">
            Total = {allocation.long + allocation.mid + allocation.short}%
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-[#74BF1E]">Long-Term Vault</span>
            <span className="font-bold tabular-nums">{allocation.long}%</span>
          </div>
          <Slider
            min={10}
            max={85}
            step={5}
            value={[allocation.long]}
            onValueChange={(v) => updateLong(Array.isArray(v) ? v[0] : v)}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-[#74BF1E]">Mid-Term Buffer</span>
            <span className="font-bold tabular-nums">{allocation.mid}%</span>
          </div>
          <Slider
            min={0}
            max={100 - allocation.long}
            step={5}
            value={[allocation.mid]}
            onValueChange={(v) => updateMid(Array.isArray(v) ? v[0] : v)}
          />
        </div>

        <div className="flex justify-between rounded-xl bg-[#f4fbf1] px-3 py-2 text-xs">
          <span className="font-semibold text-[#3c8322]">Short-Term + Persely</span>
          <span className="font-bold tabular-nums text-[#3c8322]">{allocation.short}%</span>
        </div>
      </div>

      <PocketCard
        pocketKey="long"
        amount={pockets.long}
        allocationPct={allocation.long}
        goal={{ label: 'First Car / Home Deposit', target: 4_000_000 }}
        compact
      />
      <PocketCard pocketKey="mid" amount={pockets.mid} allocationPct={allocation.mid} compact />
      <PocketCard
        pocketKey="short"
        amount={pockets.short}
        allocationPct={allocation.short}
        extraNote={`${formatFt(shortAvailable(core))} unallocated cash`}
        compact
      />

      {/* Instant Transfer Between Pockets */}
      <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <p className="text-xs font-bold text-[#0b2e26]">Move Money Between Pockets</p>
        <div className="mt-2 flex items-center gap-2">
          <select
            value={fromPocket}
            onChange={(e) => setFromPocket(e.target.value as PocketKey)}
            className="flex-1 rounded-xl border border-[#dce5e1] bg-[#f6f8f7] px-2 py-1.5 text-xs font-semibold"
          >
            <option value="long">Long</option>
            <option value="mid">Mid</option>
            <option value="short">Short</option>
          </select>
          <ArrowRightLeft className="h-4 w-4 text-[#4c665f]" />
          <select
            value={toPocket}
            onChange={(e) => setToPocket(e.target.value as PocketKey)}
            className="flex-1 rounded-xl border border-[#dce5e1] bg-[#f6f8f7] px-2 py-1.5 text-xs font-semibold"
          >
            <option value="long">Long</option>
            <option value="mid">Mid</option>
            <option value="short">Short</option>
          </select>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[10_000, 20_000, 50_000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setTransferAmount(amt)}
              className={`rounded-lg py-1 text-[11px] font-semibold tabular-nums ${
                transferAmount === amt
                  ? 'bg-[#74BF1E] text-white'
                  : 'bg-[#ebf3f0] text-[#0b2e26]'
              }`}
            >
              {amt / 1000}k Ft
            </button>
          ))}
        </div>
        <Button
          size="sm"
          disabled={fromPocket === toPocket}
          onClick={() => moveMoney(fromPocket, toPocket, transferAmount)}
          className="mt-2.5 w-full rounded-xl bg-[#74BF1E] text-xs font-semibold text-white"
        >
          Transfer {formatFt(transferAmount)}
        </Button>
      </div>
    </div>
  );
}
