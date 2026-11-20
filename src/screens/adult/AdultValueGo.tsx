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
        render: () => (
          <div className="ds-card space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="otp-tag-new inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold">
                <Award className="h-3 w-3" /> {age >= 25 ? 'Gold · 25 Yrs' : 'Age 25 Preview'}
              </span>
              <span className="text-[11px] font-extrabold text-[#38571a] tabular-nums">
                {fvv.feeCoverageMultiple.toFixed(1)}× fees covered
              </span>
            </div>

            <div>
              <p className="text-[11px] font-semibold ds-text-muted">Advantage vs Free Neobank</p>
              <p className="text-2xl font-black text-[#38571a]">
                +<MoneyFlow value={fvv.exclusiveAdvantage} />
                <span className="text-sm font-semibold ds-text-muted">/yr</span>
              </p>
            </div>

            <div className="ds-card-muted flex items-center justify-between px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-[#52ae30]" />
                <div>
                  <p className="text-[11px] font-bold ds-text-primary">First-Home Mortgage (-0.30%)</p>
                  <p className="text-[10px] ds-text-muted">Adds +90,000 Ft/yr savings</p>
                </div>
              </div>
              <Switch checked={includeMortgage} onCheckedChange={setIncludeMortgage} />
            </div>
          </div>
        ),
      },
      {
        id: 'value-compare',
        render: () => {
          const maxVal = Math.max(1, fvv.otpGoNet, fvv.neobankNetReturn);
          const otpPct = Math.round((fvv.otpGoNet / maxVal) * 100);
          const neoPct = Math.round((fvv.neobankNetReturn / maxVal) * 100);

          return (
            <div className="ds-card space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold ds-text-primary">Net Annual Return</p>
                <button
                  type="button"
                  onClick={() => setTableOpen((o) => !o)}
                  className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#38571a]"
                >
                  {tableOpen ? 'Hide ledger' : 'Full table'}
                  {tableOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              <div className="space-y-2.5 text-[11px]">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold ds-text-primary tabular-nums">
                    <span>OTP GO + TBSZ</span>
                    <span>{formatFt(fvv.otpGoNet)}/yr</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e4e9f0]">
                    <div
                      style={{ width: `${otpPct}%` }}
                      className="h-full rounded-full bg-[#52ae30] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold ds-text-muted tabular-nums">
                    <span>Free Neobank (28% tax)</span>
                    <span>{formatFt(fvv.neobankNetReturn)}/yr</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e4e9f0]">
                    <div
                      style={{ width: `${neoPct}%` }}
                      className="h-full rounded-full bg-slate-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              {tableOpen && (
                <div className="overflow-hidden rounded-xl border border-black/8">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-[#f2f5f8] text-[#0b2e26]">
                      <tr>
                        <th className="px-2 py-1.5 font-bold">Component</th>
                        <th className="px-2 py-1.5 text-right font-bold">OTP</th>
                        <th className="px-2 py-1.5 text-right font-bold">Neo</th>
                        <th className="px-2 py-1.5 text-right font-bold text-[#38571a]">Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/6 tabular-nums">
                      <tr>
                        <td className="px-2 py-1.5 font-medium">Base (6.5%)</td>
                        <td className="px-2 py-1.5 text-right">{formatFt(fvv.baseMarketGross)}</td>
                        <td className="px-2 py-1.5 text-right ds-text-muted">
                          {formatFt(fvv.neobankNetReturn)}
                        </td>
                        <td className="px-2 py-1.5 text-right font-bold text-[#38571a]">
                          +{formatFt(fvv.tbszTaxSaved)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1.5 font-medium">Loyalty + Gold</td>
                        <td className="px-2 py-1.5 text-right">
                          {formatFt(fvv.loyaltyBonusAnnual + fvv.goldCashback)}
                        </td>
                        <td className="px-2 py-1.5 text-right ds-text-muted">0 Ft</td>
                        <td className="px-2 py-1.5 text-right font-bold text-[#38571a]">
                          +{formatFt(fvv.loyaltyBonusAnnual + fvv.goldCashback)}
                        </td>
                      </tr>
                      {includeMortgage && (
                        <tr className="bg-amber-50">
                          <td className="px-2 py-1.5 font-medium">Mortgage -0.3%</td>
                          <td className="px-2 py-1.5 text-right">{formatFt(fvv.mortgageSavings)}</td>
                          <td className="px-2 py-1.5 text-right ds-text-muted">0 Ft</td>
                          <td className="px-2 py-1.5 text-right font-bold text-[#38571a]">
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
        render: () => (
          <div className="ds-card space-y-2.5">
            <p className="flex items-center gap-1.5 text-xs font-extrabold ds-text-primary">
              <ShieldCheck className="h-4 w-4 text-[#52ae30]" /> Kept by Staying
            </p>
            {adultPartners.map((p) => (
              <div key={p.id} className="ds-card-muted flex items-start gap-2 p-2.5 text-xs">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#52ae30]" />
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
