import { useMemo } from 'react';
import { ArrowRight, Award, ShieldCheck } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { feesVsValue, formatFt, totalBalance } from '@/engine/finance';
import { useLifestart } from '@/state/store';

export function OtpGo25Takeover() {
  const { state, dismissGoWelcome, setTab } = useLifestart();
  const { core } = state;
  const total = totalBalance(core);
  const fvv = feesVsValue(core);

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'go25-hero',
        render: () => (
          <div className="ds-card space-y-2">
            <span className="otp-tag-new inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase">
              <Award className="h-3 w-3" /> Age 25 · OTP GO Gold
            </span>
            <h2 className="text-base font-extrabold leading-snug ds-text-primary">
              Lifestart pays for itself — {fvv.feeCoverageMultiple.toFixed(0)}× over.
            </h2>
            <p className="text-2xl font-black text-[#38571a]">
              <MoneyFlow value={total} />
            </p>
          </div>
        ),
      },
      {
        id: 'go25-summary',
        render: () => (
          <div className="ds-card space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="ds-text-muted">OTP GO Annual Fees</span>
              <span className="font-bold text-red-700 tabular-nums">-{formatFt(fvv.annualFees)}/yr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="ds-text-muted">TBSZ Tax-Free Yield</span>
              <span className="font-bold text-[#38571a] tabular-nums">
                +{formatFt(fvv.grossAnnualYield)}/yr
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-black/8 pt-2">
              <span className="font-bold ds-text-primary">Net vs Free Neobank</span>
              <span className="text-sm font-black text-[#38571a] tabular-nums">
                +{formatFt(fvv.exclusiveAdvantage)}/yr
              </span>
            </div>
          </div>
        ),
      },
      {
        id: 'go25-cta',
        render: () => (
          <div className="space-y-3">
            <div className="ds-card flex items-start gap-2.5 text-xs ds-text-primary">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#52ae30]" />
              <span>
                5-Yr TBSZ reached <strong>0% tax maturity</strong> — 28% Hungarian tax shielded.
              </span>
            </div>

            <Button
              size="lg"
              onClick={() => {
                dismissGoWelcome();
                setTab('value');
              }}
              style={{ borderRadius: 'var(--ds-btn-radius)' }}
              className="ds-btn h-11 w-full bg-[#38571a] text-sm font-bold text-white hover:bg-[#2c4614]"
            >
              Compare Stay vs. Leave
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [total, fvv, dismissGoWelcome, setTab],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="otp-go-25" blocks={blocks} />
    </div>
  );
}
