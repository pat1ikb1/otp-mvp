import { useMemo, useState } from 'react';
import { ArrowRightLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { PocketCard } from '@/components/shared/PocketCard';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatFt, rebalanceThreePockets, shortAvailable } from '@/engine/finance';
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

  const handlePocketSlide = (key: PocketKey, nextVal: number) => {
    setAllocation(rebalanceThreePockets(allocation, key, nextVal));
  };

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'pockets-monthly',
        render: () => (
          <div className="ds-card">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold ds-text-primary">Monthly Auto-Deposit</p>
              <span className="text-xs font-extrabold text-[#38571a] tabular-nums">
                {formatFt(monthlyContribution)}/mo
              </span>
            </div>
            <div className="mt-2.5 grid grid-cols-4 gap-1.5">
              {[5_000, 10_000, 15_000, 25_000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setMonthly(amt)}
                  style={{ borderRadius: 'var(--ds-btn-radius)' }}
                  className={`ds-btn py-1.5 text-xs font-bold tabular-nums ${
                    monthlyContribution === amt
                      ? 'bg-[#38571a] text-white'
                      : 'bg-[#f2f5f8] text-[#0b2e26] hover:bg-[#e8eef3]'
                  }`}
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
        render: () => (
          <div className="ds-card space-y-3.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold ds-text-primary">Proportional 3-Pocket Split</p>
              <span className="rounded-full bg-[#e8f5e4] px-2.5 py-0.5 text-[10px] font-bold text-[#38571a] tabular-nums">
                {allocation.long + allocation.mid + allocation.short}% Total
              </span>
            </div>

            {/* Proportional Visual Bar */}
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#e4e9f0]">
              <div
                style={{ width: `${allocation.long}%` }}
                className="bg-[#38571a] transition-all duration-150"
              />
              <div
                style={{ width: `${allocation.mid}%` }}
                className="bg-[#0d9488] transition-all duration-150"
              />
              <div
                style={{ width: `${allocation.short}%` }}
                className="bg-[#52ae30] transition-all duration-150"
              />
            </div>

            {/* All 3 Sliders share a 0..100 scale so movement across pockets is realistically proportional */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#38571a]">Long Vault</span>
                <span className="font-extrabold tabular-nums ds-text-primary">{allocation.long}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[allocation.long]}
                aria-label="Long Vault percentage"
                onValueChange={(v) => handlePocketSlide('long', Array.isArray(v) ? v[0] : v)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#0d9488]">Mid Buffer</span>
                <span className="font-extrabold tabular-nums ds-text-primary">{allocation.mid}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[allocation.mid]}
                aria-label="Mid Buffer percentage"
                onValueChange={(v) => handlePocketSlide('mid', Array.isArray(v) ? v[0] : v)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#52ae30]">Short Cash</span>
                <span className="font-extrabold tabular-nums ds-text-primary">{allocation.short}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[allocation.short]}
                aria-label="Short Cash percentage"
                onValueChange={(v) => handlePocketSlide('short', Array.isArray(v) ? v[0] : v)}
              />
            </div>
          </div>
        ),
      },
      {
        id: 'pockets-cards',
        render: () => (
          <div className="space-y-2.5">
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
                className="flex w-full items-center justify-between text-xs font-extrabold ds-text-primary"
              >
                <span className="inline-flex items-center gap-1.5">
                  <ArrowRightLeft className="h-3.5 w-3.5 text-[#52ae30]" />
                  Move Between Pockets
                </span>
                {transferOpen ? (
                  <ChevronUp className="h-4 w-4 ds-text-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 ds-text-muted" />
                )}
              </button>

              {transferOpen && (
                <div className="mt-3 space-y-2.5 border-t border-black/6 pt-3">
                  <div className="flex items-center gap-2">
                    <select
                      aria-label="From pocket"
                      value={fromPocket}
                      onChange={(e) => setFromPocket(e.target.value as PocketKey)}
                      className="flex-1 rounded-xl border border-black/10 bg-[#f2f5f8] px-2.5 py-1.5 text-xs font-semibold text-[#0b2e26]"
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
                      className="flex-1 rounded-xl border border-black/10 bg-[#f2f5f8] px-2.5 py-1.5 text-xs font-semibold text-[#0b2e26]"
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
                        style={{ borderRadius: 'var(--ds-btn-radius)' }}
                        className={`ds-btn py-1.5 text-[11px] font-bold tabular-nums ${
                          transferAmount === amt
                            ? 'bg-[#38571a] text-white'
                            : 'bg-[#f2f5f8] text-[#0b2e26]'
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
                    style={{ borderRadius: 'var(--ds-btn-radius)' }}
                    className="ds-btn w-full bg-[#38571a] text-xs font-bold text-white"
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
