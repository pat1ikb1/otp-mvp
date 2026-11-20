import { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
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

  return (
    <div className="flex flex-1 flex-col justify-between p-4">
      <div className="space-y-3">
        <div className="rounded-2xl bg-[#74BF1E] p-4 text-white shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#ffffff]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Early-Bird Birth Offer</span>
          </div>
          <h2 className="mt-1 text-base font-bold leading-snug">
            {state.core.family.parentName}, congratulations on baby {childName || 'Bence'}! 🎉
          </h2>
          <p className="mt-1 text-xs text-emerald-100/90">
            Open OTP Lifestart today and receive a{' '}
            <strong className="text-white">+25,000 Ft Welcome Grant</strong> invested from day one.
          </p>
        </div>

        {/* Child Name */}
        <div className="rounded-2xl border border-black/5 bg-white p-3 shadow-xs">
          <label className="text-[11px] font-semibold text-[#4c665f]">Child’s First Name</label>
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Bence"
            className="mt-1 w-full rounded-xl border border-[#dce5e1] bg-[#f6f8f7] px-3 py-1.5 text-sm font-semibold text-[#0b2e26] outline-none focus:border-[#74BF1E]"
          />
        </div>

        {/* Monthly Contribution */}
        <div className="rounded-2xl border border-black/5 bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#4c665f]">Monthly Deposit</span>
            <span className="text-xs font-bold text-[#74BF1E] tabular-nums">
              {formatFt(monthly)} / mo
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {[5_000, 10_000, 20_000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setMonthly(amt)}
                className={`rounded-xl py-2 text-xs font-bold tabular-nums transition-all ${
                  monthly === amt
                    ? 'bg-[#74BF1E] text-white'
                    : 'bg-[#ebf3f0] text-[#0b2e26] hover:bg-[#dcebe5]'
                }`}
              >
                {(amt / 1000).toFixed(0)}k Ft
              </button>
            ))}
          </div>
        </div>

        {/* 3-Pocket Split */}
        <div className="rounded-2xl border border-black/5 bg-white p-3 shadow-xs">
          <p className="text-[11px] font-semibold text-[#4c665f]">3-Pocket Strategy Split</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {(
              [
                { id: 'balanced', label: 'Recommended', split: '60 / 25 / 15' },
                { id: 'growth', label: 'Max Growth', split: '75 / 15 / 10' },
                { id: 'liquid', label: 'Flexible', split: '45 / 30 / 25' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPreset(opt.id)}
                className={`rounded-xl border p-2 text-left transition-all ${
                  preset === opt.id
                    ? 'border-[#74BF1E] bg-emerald-50/70'
                    : 'border-[#dce5e1] bg-white'
                }`}
              >
                <p className="text-[10px] font-bold text-[#0b2e26]">{opt.label}</p>
                <p className="mt-0.5 text-[10px] font-semibold text-[#74BF1E] tabular-nums">
                  {opt.split}
                </p>
              </button>
            ))}
          </div>
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
        className="mt-3 h-11 w-full rounded-2xl bg-[#74BF1E] text-sm font-bold text-white hover:bg-[#62a318]"
      >
        <CheckCircle2 className="h-4 w-4" />
        Open & Claim +25,000 Ft Grant
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
