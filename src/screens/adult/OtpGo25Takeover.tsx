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
        title: 'OTP GO Gold Hero',
        eyeCue: 'See 28× fee payback',
        whyHere: 'Anchors the Age 25 transition with total portfolio value and Gold tier proof.',
        render: () => (
          <div
            style={{
              borderRadius: 'var(--ds-card-radius)',
              padding: 'var(--ds-card-padding)',
              background: 'linear-gradient(135deg, var(--ds-header-bg) 0%, #1c3a2b 100%)',
            }}
            className="text-white ring-1 ring-[#c89b3c]/60 shadow-md"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-[#c89b3c] px-2.5 py-0.5 text-[10px] font-bold text-[#08261e] uppercase">
              <Award className="h-3 w-3" /> Age 25 · OTP GO Gold
            </span>
            <h2 className="mt-2 text-base font-extrabold leading-snug">
              Lifestart pays for itself — {fvv.feeCoverageMultiple.toFixed(0)}× over.
            </h2>
            <p className="mt-1.5 text-2xl font-black text-[#f3d17c]">
              <MoneyFlow value={total} />
            </p>
          </div>
        ),
      },
      {
        id: 'go25-summary',
        title: 'Net Value vs Fees',
        eyeCue: 'Compare yield vs fees',
        whyHere: 'Three-row financial proof replaces paragraphs with crisp side-by-side numbers.',
        render: () => (
          <div className="ds-card space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="ds-text-muted">OTP GO Annual Fees</span>
              <span className="font-bold text-red-700 tabular-nums">-{formatFt(fvv.annualFees)}/yr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="ds-text-muted">TBSZ Tax-Free Yield</span>
              <span style={{ color: 'var(--ds-primary)' }} className="font-bold tabular-nums">
                +{formatFt(fvv.grossAnnualYield)}/yr
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-black/8 pt-2">
              <span className="font-bold ds-text-primary">Net vs Free Neobank</span>
              <span style={{ color: 'var(--ds-primary)' }} className="text-sm font-black tabular-nums">
                +{formatFt(fvv.exclusiveAdvantage)}/yr
              </span>
            </div>
          </div>
        ),
      },
      {
        id: 'go25-cta',
        title: '0% Tax Maturity & CTA',
        eyeCue: 'Open Stay vs Leave proof',
        whyHere: 'Confirms 0% SZJA+SZOCHO tax maturity right before entering the full Value Proof tab.',
        render: () => (
          <div className="space-y-3">
            <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#9a6e14]" />
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
              style={{
                borderRadius: 'var(--ds-btn-radius)',
                backgroundColor: 'var(--ds-primary)',
                color: 'var(--ds-primary-fg)',
              }}
              className="ds-btn h-11 w-full text-sm font-bold"
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
