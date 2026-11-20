import { ArrowRight, Award, ShieldCheck } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { Button } from '@/components/ui/button';
import { feesVsValue, formatFt, totalBalance } from '@/engine/finance';
import { useLifestart } from '@/state/store';

export function OtpGo25Takeover() {
  const { state, dismissGoWelcome, setTab } = useLifestart();
  const { core } = state;
  const total = totalBalance(core);
  const fvv = feesVsValue(core);

  return (
    <div className="flex flex-1 flex-col justify-between p-4">
      <div className="space-y-3.5">
        <div className="rounded-2xl bg-[#74BF1E] p-5 text-white ring-1 ring-[#c89b3c]/50 shadow-md">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#c89b3c] px-2.5 py-0.5 text-[10px] font-bold text-[#0b2e26] uppercase">
            <Award className="h-3 w-3" /> Age 25 · OTP GO Gold
          </span>
          <h2 className="mt-2.5 text-lg font-extrabold leading-snug">
            OTP Junior ended at 24–25. Lifestart pays for itself — 28× over.
          </h2>
          <p className="mt-2 text-2xl font-black text-[#f3d17c]">
            <MoneyFlow value={total} />
          </p>
        </div>

        <div className="space-y-2 rounded-2xl border border-black/5 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#4c665f]">All-in OTP GO Annual Fees</span>
            <span className="font-bold text-red-600 tabular-nums">-{formatFt(fvv.annualFees)}/yr</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#4c665f]">Your Super Bond TBSZ Yield</span>
            <span className="font-bold text-[#74BF1E] tabular-nums">+{formatFt(fvv.grossAnnualYield)}/yr</span>
          </div>
          <div className="border-t border-black/5 pt-2 flex items-center justify-between gap-2 text-xs">
            <span className="font-bold text-[#0b2e26]">Exclusive vs. Free Neobank</span>
            <span className="shrink-0 whitespace-nowrap text-sm font-black text-[#74BF1E] tabular-nums">
              +{formatFt(fvv.exclusiveAdvantage)}/yr
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-950">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#c89b3c]" />
          <span>
            Your 5-year OTP TBSZ opened at 18 has reached <strong>0% tax maturity</strong> — shielding 28% SZJA+SZOCHO.
          </span>
        </div>
      </div>

      <Button
        size="lg"
        onClick={() => {
          dismissGoWelcome();
          setTab('value');
        }}
        className="mt-3 h-11 w-full rounded-2xl bg-[#74BF1E] text-sm font-bold text-white hover:bg-[#62a318]"
      >
        See Stay vs. Leave Breakdown
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
