import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/engine/config';
import { formatFt } from '@/engine/finance';
import { useDesignStudio } from '@/state/designStudio';
import { useLifestart } from '@/state/store';

export function OnboardingFlow() {
  const { state, openAccount } = useLifestart();
  const { tokens } = useDesignStudio();
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
        title: 'Welcome Grant',
        eyeCue: 'Claim +25,000 Ft grant',
        whyHere: 'Top anchor leads with the immediate +25,000 Ft birth reward to create instant motivation.',
        render: () => (
          <div
            style={{
              borderRadius: 'var(--ds-card-radius)',
              padding: 'var(--ds-card-padding)',
              background: 'linear-gradient(135deg, var(--ds-header-bg) 0%, var(--ds-primary) 100%)',
            }}
            className="text-white shadow-sm"
          >
            <div className="inline-flex items-center gap-1 rounded-full bg-[#74bf1e] px-2 py-0.5 text-[10px] font-bold text-[#08261e]">
              <Sparkles className="h-3 w-3" />
              Birth Grant
            </div>
            <h2 className="mt-2 text-base font-extrabold leading-snug">
              Start {childName || 'Bence'}’s future with +25,000 Ft
            </h2>
            {tokens.copyDensity !== 'concise' && (
              <p className="mt-1 text-[11px] text-emerald-100/90">
                Invested from day one inside OTP Lifestart.
              </p>
            )}
          </div>
        ),
      },
      {
        id: 'onboard-plan',
        title: 'Child & Monthly Plan',
        eyeCue: 'Set name & deposit',
        whyHere: 'Groups the two essential inputs together so onboarding feels effortless.',
        render: () => (
          <div className="ds-card space-y-3">
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
                className="mt-1 w-full border border-[#dce5e1] bg-[#f4f7f5] px-3 py-2 text-sm font-semibold text-[#08261e] focus:border-[#005e48]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold ds-text-muted">Monthly Deposit</span>
                <span style={{ color: 'var(--ds-primary)' }} className="font-extrabold tabular-nums">
                  {formatFt(monthly)}/mo
                </span>
              </div>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {[5_000, 10_000, 20_000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setMonthly(amt)}
                    style={{
                      borderRadius: 'var(--ds-btn-radius)',
                      backgroundColor: monthly === amt ? 'var(--ds-primary)' : 'var(--ds-card-muted-bg)',
                      color: monthly === amt ? 'var(--ds-primary-fg)' : 'var(--ds-text-primary)',
                    }}
                    className="ds-btn py-2 text-xs font-bold tabular-nums"
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
        title: 'Strategy & Launch',
        eyeCue: 'Pick split & open',
        whyHere: 'Closes with a single high-contrast CTA right below the preset choice.',
        render: () => (
          <div className="ds-card space-y-3">
            <div>
              <p className="text-[11px] font-semibold ds-text-muted">3-Pocket Preset</p>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
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
                    style={{
                      borderRadius: 'var(--ds-btn-radius)',
                      borderColor: preset === opt.id ? 'var(--ds-primary)' : 'var(--ds-border-color)',
                      backgroundColor: preset === opt.id ? 'var(--stage-badge-bg)' : 'transparent',
                    }}
                    className="ds-btn border p-2 text-left"
                  >
                    <p className="text-[10px] font-bold ds-text-primary">{opt.label}</p>
                    <p
                      style={{ color: 'var(--ds-primary)' }}
                      className="mt-0.5 text-[10px] font-extrabold tabular-nums"
                    >
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
              style={{
                borderRadius: 'var(--ds-btn-radius)',
                backgroundColor: 'var(--ds-primary)',
                color: 'var(--ds-primary-fg)',
              }}
              className="ds-btn h-11 w-full text-sm font-bold hover:opacity-95"
            >
              <CheckCircle2 className="h-4 w-4" />
              Open & Claim +25k Ft
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [childName, monthly, preset, allocation, openAccount, tokens.copyDensity],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="onboarding" blocks={blocks} />
    </div>
  );
}
