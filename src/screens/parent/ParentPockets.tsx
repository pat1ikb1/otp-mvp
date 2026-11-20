import { useMemo, useState } from 'react';
import { ArrowRightLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { PocketCard } from '@/components/shared/PocketCard';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
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
  const [transferOpen, setTransferOpen] = useState(false);

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

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'pockets-monthly',
        title: 'Monthly Auto-Save',
        eyeCue: 'Set monthly amount',
        whyHere: 'Starts with the single biggest lever: monthly contribution rate.',
        render: () => (
          <div className="ds-card">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold ds-text-primary">Monthly Auto-Deposit</p>
              <span style={{ color: 'var(--ds-primary)' }} className="text-xs font-extrabold tabular-nums">
                {formatFt(monthlyContribution)}/mo
              </span>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {[5_000, 10_000, 15_000, 25_000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setMonthly(amt)}
                  style={{
                    borderRadius: 'var(--ds-btn-radius)',
                    backgroundColor:
                      monthlyContribution === amt ? 'var(--ds-primary)' : 'var(--ds-card-muted-bg)',
                    color:
                      monthlyContribution === amt ? 'var(--ds-primary-fg)' : 'var(--ds-text-primary)',
                  }}
                  className="ds-btn py-1.5 text-xs font-bold tabular-nums"
                >
                  {amt / 1000}k
                </button>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: 'pockets-sliders',
        title: '100% Split Rules',
        eyeCue: 'Adjust 3-pocket ratio',
        whyHere: 'Interactive sliders locked to 100% give instant visual feedback with zero mental math.',
        render: () => (
          <div className="ds-card space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold ds-text-primary">Split Allocation</p>
              <span className="rounded-full bg-[#e5f5de] px-2 py-0.5 text-[10px] font-bold text-[#08261e] tabular-nums">
                100% Locked
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#005e48]">Long Vault</span>
                <span className="font-bold tabular-nums ds-text-primary">{allocation.long}%</span>
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
                <span className="font-semibold text-[#0d9488]">Mid Buffer</span>
                <span className="font-bold tabular-nums ds-text-primary">{allocation.mid}%</span>
              </div>
              <Slider
                min={0}
                max={100 - allocation.long}
                step={5}
                value={[allocation.mid]}
                onValueChange={(v) => updateMid(Array.isArray(v) ? v[0] : v)}
              />
            </div>

            <div className="flex justify-between rounded-xl bg-[#e7f6d5] px-3 py-1.5 text-xs text-[#1b3a07]">
              <span className="font-semibold">Short Cash</span>
              <span className="font-extrabold tabular-nums">{allocation.short}%</span>
            </div>
          </div>
        ),
      },
      {
        id: 'pockets-cards',
        title: 'Pocket Balances & Transfer',
        eyeCue: 'Review or move cash',
        whyHere: 'Balances sit below rules; transfer controls stay collapsed until needed to prevent clutter.',
        render: () => (
          <div className="space-y-2">
            <PocketCard
              pocketKey="long"
              amount={pockets.long}
              allocationPct={allocation.long}
              goal={{ label: 'First Car / Home', target: 4_000_000 }}
              compact
            />
            <PocketCard pocketKey="mid" amount={pockets.mid} allocationPct={allocation.mid} compact />
            <PocketCard
              pocketKey="short"
              amount={pockets.short}
              allocationPct={allocation.short}
              extraNote={`${formatFt(shortAvailable(core))} free`}
              compact
            />

            <div className="ds-card">
              <button
                type="button"
                onClick={() => setTransferOpen((o) => !o)}
                className="flex w-full items-center justify-between text-xs font-bold ds-text-primary"
              >
                <span className="inline-flex items-center gap-1.5">
                  <ArrowRightLeft className="h-3.5 w-3.5 text-[#005e48]" />
                  Move Between Pockets
                </span>
                {transferOpen ? (
                  <ChevronUp className="h-4 w-4 ds-text-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 ds-text-muted" />
                )}
              </button>

              {transferOpen && (
                <div className="mt-2.5 space-y-2 border-t border-black/6 pt-2.5">
                  <div className="flex items-center gap-2">
                    <select
                      aria-label="From pocket"
                      value={fromPocket}
                      onChange={(e) => setFromPocket(e.target.value as PocketKey)}
                      className="flex-1 rounded-xl border border-[#dce5e1] bg-[#f4f7f5] px-2 py-1.5 text-xs font-semibold text-[#08261e]"
                    >
                      <option value="long">Long</option>
                      <option value="mid">Mid</option>
                      <option value="short">Short</option>
                    </select>
                    <ArrowRightLeft className="h-3.5 w-3.5 shrink-0 ds-text-muted" />
                    <select
                      aria-label="To pocket"
                      value={toPocket}
                      onChange={(e) => setToPocket(e.target.value as PocketKey)}
                      className="flex-1 rounded-xl border border-[#dce5e1] bg-[#f4f7f5] px-2 py-1.5 text-xs font-semibold text-[#08261e]"
                    >
                      <option value="long">Long</option>
                      <option value="mid">Mid</option>
                      <option value="short">Short</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[10_000, 20_000, 50_000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTransferAmount(amt)}
                        style={{
                          borderRadius: 'var(--ds-btn-radius)',
                          backgroundColor:
                            transferAmount === amt ? 'var(--ds-primary)' : 'var(--ds-card-muted-bg)',
                          color:
                            transferAmount === amt
                              ? 'var(--ds-primary-fg)'
                              : 'var(--ds-text-primary)',
                        }}
                        className="ds-btn py-1 text-[11px] font-bold tabular-nums"
                      >
                        {amt / 1000}k Ft
                      </button>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    disabled={fromPocket === toPocket}
                    onClick={() => moveMoney(fromPocket, toPocket, transferAmount)}
                    style={{
                      borderRadius: 'var(--ds-btn-radius)',
                      backgroundColor: 'var(--ds-primary)',
                      color: 'var(--ds-primary-fg)',
                    }}
                    className="ds-btn w-full text-xs font-bold"
                  >
                    Transfer {formatFt(transferAmount)}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ),
      },
    ],
    [core, allocation, pockets, monthlyContribution, fromPocket, toPocket, transferAmount, transferOpen, setMonthly, moveMoney],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="parent-pockets" blocks={blocks} />
    </div>
  );
}
