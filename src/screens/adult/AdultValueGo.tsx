import { useMemo, useState } from 'react';
import { Award, CheckCircle2, ChevronDown, ChevronUp, Home, ShieldCheck } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Switch } from '@/components/ui/switch';
import { PARTNERS } from '@/data/partners';
import { feesVsValue, formatFt } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function AdultValueGo() {
  const { state } = useLifestart();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const [includeMortgage, setIncludeMortgage] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);

  const fvv = feesVsValue(core, includeMortgage);
  const adultPartners = PARTNERS.filter((p) => p.audience === 'adult25');

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'value-hero',
        title: 'Net Advantage & Mortgage',
        eyeCue: 'See annual net advantage',
        whyHere: 'Top anchor states the net annual advantage vs a 0 Ft neobank + interactive mortgage toggle.',
        render: () => (
          <div
            style={{
              borderRadius: 'var(--ds-card-radius)',
              padding: 'var(--ds-card-padding)',
              background: 'linear-gradient(135deg, var(--ds-header-bg) 0%, #1c3a2b 100%)',
            }}
            className="space-y-2.5 text-white ring-1 ring-[#c89b3c]/50 shadow-md"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#c89b3c] px-2.5 py-0.5 text-[10px] font-bold text-[#08261e]">
                <Award className="h-3 w-3" /> {age >= 25 ? 'Gold · 25 Yrs' : 'Age 25 Preview'}
              </span>
              <span className="text-[11px] font-bold text-[#74bf1e] tabular-nums">
                {fvv.feeCoverageMultiple.toFixed(1)}× fees covered
              </span>
            </div>

            <div>
              <p className="text-[11px] text-emerald-100">Advantage vs Free Neobank</p>
              <p className="text-2xl font-black text-white">
                +<MoneyFlow value={fvv.exclusiveAdvantage} />
                <span className="text-sm font-semibold text-emerald-100">/yr</span>
              </p>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-white/12 px-2.5 py-2">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-[#74bf1e]" />
                <div>
                  <p className="text-[11px] font-bold">First-Home Mortgage (-0.30%)</p>
                  <p className="text-[10px] text-emerald-100/85">Adds +90,000 Ft/yr savings</p>
                </div>
              </div>
              <Switch checked={includeMortgage} onCheckedChange={setIncludeMortgage} />
            </div>
          </div>
        ),
      },
      {
        id: 'value-compare',
        title: 'Stay vs Leave Proof',
        eyeCue: 'Compare OTP GO vs Neobank',
        whyHere: 'Visual summary bars highlight the gap first; full accounting table stays expandable on demand.',
        render: () => {
          const maxVal = Math.max(1, fvv.otpGoNet, fvv.neobankNetReturn);
          const otpPct = Math.round((fvv.otpGoNet / maxVal) * 100);
          const neoPct = Math.round((fvv.neobankNetReturn / maxVal) * 100);

          return (
            <div className="ds-card space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold ds-text-primary">Net Annual Return</p>
                <button
                  type="button"
                  onClick={() => setTableOpen((o) => !o)}
                  style={{ color: 'var(--ds-primary)' }}
                  className="inline-flex items-center gap-0.5 text-[10px] font-bold"
                >
                  {tableOpen ? 'Hide ledger' : 'Full table'}
                  {tableOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold ds-text-primary tabular-nums">
                    <span>OTP GO + TBSZ</span>
                    <span>{formatFt(fvv.otpGoNet)}/yr</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/8">
                    <div
                      style={{ width: `${otpPct}%`, backgroundColor: 'var(--ds-primary)' }}
                      className="h-full rounded-full transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold ds-text-muted tabular-nums">
                    <span>Free Neobank (28% tax)</span>
                    <span>{formatFt(fvv.neobankNetReturn)}/yr</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/8">
                    <div
                      style={{ width: `${neoPct}%` }}
                      className="h-full rounded-full bg-slate-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              {tableOpen && (
                <div className="overflow-hidden rounded-xl border border-[#dce5e1]">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-[#ebf3f0] text-[#08261e]">
                      <tr>
                        <th className="px-2 py-1.5 font-bold">Component</th>
                        <th className="px-2 py-1.5 text-right font-bold">OTP</th>
                        <th className="px-2 py-1.5 text-right font-bold">Neo</th>
                        <th className="px-2 py-1.5 text-right font-bold text-[#005e48]">Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dce5e1]/70 tabular-nums">
                      <tr>
                        <td className="px-2 py-1.5 font-medium">Base (6.5%)</td>
                        <td className="px-2 py-1.5 text-right">{formatFt(fvv.baseMarketGross)}</td>
                        <td className="px-2 py-1.5 text-right ds-text-muted">
                          {formatFt(fvv.neobankNetReturn)}
                        </td>
                        <td className="px-2 py-1.5 text-right font-bold text-[#005e48]">
                          +{formatFt(fvv.tbszTaxSaved)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1.5 font-medium">Loyalty + Gold</td>
                        <td className="px-2 py-1.5 text-right">
                          {formatFt(fvv.loyaltyBonusAnnual + fvv.goldCashback)}
                        </td>
                        <td className="px-2 py-1.5 text-right ds-text-muted">0 Ft</td>
                        <td className="px-2 py-1.5 text-right font-bold text-[#005e48]">
                          +{formatFt(fvv.loyaltyBonusAnnual + fvv.goldCashback)}
                        </td>
                      </tr>
                      {includeMortgage && (
                        <tr className="bg-amber-50">
                          <td className="px-2 py-1.5 font-medium">Mortgage -0.3%</td>
                          <td className="px-2 py-1.5 text-right">{formatFt(fvv.mortgageSavings)}</td>
                          <td className="px-2 py-1.5 text-right ds-text-muted">0 Ft</td>
                          <td className="px-2 py-1.5 text-right font-bold text-[#005e48]">
                            +{formatFt(fvv.mortgageSavings)}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="px-2 py-1.5 font-medium">All-In Fees</td>
                        <td className="px-2 py-1.5 text-right text-red-700">
                          -{formatFt(fvv.annualFees)}
                        </td>
                        <td className="px-2 py-1.5 text-right ds-text-muted">0 Ft</td>
                        <td className="px-2 py-1.5 text-right font-bold text-red-700">
                          -{formatFt(fvv.annualFees)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        },
      },
      {
        id: 'value-perks',
        title: 'Gold Perks Kept',
        eyeCue: 'Review retained perks',
        whyHere: 'Reinforces switching cost with tangible lifestyle & home-loan benefits.',
        render: () => (
          <div className="ds-card space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-bold ds-text-primary">
              <ShieldCheck className="h-4 w-4 text-[#005e48]" /> Kept by Staying
            </p>
            {adultPartners.map((p) => (
              <div key={p.id} className="ds-card-muted flex items-start gap-2 p-2 text-xs">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#005e48]" />
                <div>
                  <p className="font-bold ds-text-primary">{p.name}</p>
                  <p className="text-[10px] ds-text-muted">{p.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        ),
      },
    ],
    [age, fvv, includeMortgage, tableOpen, adultPartners],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="adult-value" blocks={blocks} />
    </div>
  );
}
