import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/engine/config';
import { formatFt } from '@/engine/finance';
import { useLifestart } from '@/state/store';

export function OnboardingFlow() {
  const { state, openAccount } = useLifestart();
  const [childName, setChildName] = useState(state.core.family.childName);
  const [monthly, setMonthly] = useState<number>(CONFIG.DEFAULT_MONTHLY);
  const [preset, setPreset] = useState<'balanced' | 'growth' | 'liquid'>('balanced');

  const allocationMap = {
    balanced: { long: 60, mid: 25, short: 15 },
    growth: { long: 75, mid: 15, short: 10 },
    liquid: { long: 45, mid: 30, short: 25 },
  };
  const allocation = allocationMap[preset];

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'onboard-grant',
        render: () => (
          <div className="ds-card space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5e4] px-2.5 py-0.5 text-[10px] font-bold text-[#38571a]">
                <Sparkles className="h-3 w-3 text-[#52ae30]" />
                Birth Grant
              </span>
              <span className="otp-tag-new px-2 py-0.5 text-[10px] font-bold">+25,000 Ft</span>
            </div>
            <h2 className="text-base font-extrabold leading-snug ds-text-primary">
              Start {childName || 'Bence'}’s Lifestart with +25,000 Ft
            </h2>
            <p className="text-xs ds-text-muted">
              Compounding from day one with zero setup fee.
            </p>
          </div>
        ),
      },
      {
        id: 'onboard-plan',
        render: () => (
          <div className="ds-card space-y-3.5">
            <div>
              <label
                htmlFor="child-first-name"
                className="text-[11px] font-semibold ds-text-muted"
              >
                Child’s First Name
              </label>
              <input
                id="child-first-name"
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Bence"
                style={{ borderRadius: 'var(--ds-btn-radius)' }}
                className="mt-1.5 w-full border border-black/10 bg-[#f2f5f8] px-3.5 py-2 text-sm font-semibold text-[#0b2e26] focus:border-[#52ae30]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold ds-text-muted">Monthly Deposit</span>
                <span className="font-extrabold text-[#38571a] tabular-nums">
                  {formatFt(monthly)}/mo
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[5_000, 10_000, 20_000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setMonthly(amt)}
                    style={{ borderRadius: 'var(--ds-btn-radius)' }}
                    className={`ds-btn py-2 text-xs font-bold tabular-nums ${
                      monthly === amt
                        ? 'bg-[#38571a] text-white'
                        : 'bg-[#f2f5f8] text-[#0b2e26] hover:bg-[#e8eef3]'
                    }`}
                  >
                    {amt / 1000}k Ft
                  </button>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'onboard-split',
        render: () => (
          <div className="ds-card space-y-3.5">
            <div>
              <p className="text-[11px] font-semibold ds-text-muted">3-Pocket Preset</p>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'balanced', label: 'Balanced', split: '60 / 25 / 15' },
                    { id: 'growth', label: 'Growth', split: '75 / 15 / 10' },
                    { id: 'liquid', label: 'Flexible', split: '45 / 30 / 25' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPreset(opt.id)}
                    className={`rounded-2xl border p-2 text-left transition-colors ${
                      preset === opt.id
                        ? 'border-[#52ae30] bg-[#e8f5e4]'
                        : 'border-transparent bg-[#f2f5f8]'
                    }`}
                  >
                    <p className="text-[10px] font-bold ds-text-primary">{opt.label}</p>
                    <p className="mt-0.5 text-[10px] font-extrabold text-[#38571a] tabular-nums">
                      {opt.split}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              onClick={() =>
                openAccount({
                  childName: childName || CONFIG.PERSONA.childName,
                  monthlyContribution: monthly,
                  allocation,
                })
              }
              style={{ borderRadius: 'var(--ds-btn-radius)' }}
              className="ds-btn h-11 w-full bg-[#38571a] text-sm font-bold text-white hover:bg-[#2c4614]"
            >
              <CheckCircle2 className="h-4 w-4 text-[#74bf1e]" />
              Open & Claim +25k Ft
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [childName, monthly, preset, allocation, openAccount],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="onboarding" blocks={blocks} />
    </div>
  );
}
