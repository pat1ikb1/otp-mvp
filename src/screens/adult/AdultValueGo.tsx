import { useState } from 'react';
import { Award, CheckCircle2, Home, ShieldCheck } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
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

  const fvv = feesVsValue(core, includeMortgage);
  const adultPartners = PARTNERS.filter((p) => p.audience === 'adult25');

  return (
    <div className="space-y-3 pb-2">
      {/* Self-Funding Hero Banner */}
      <div className="rounded-2xl bg-[#74BF1E] p-4 text-white ring-1 ring-[#c89b3c]/40 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#c89b3c] px-2.5 py-0.5 text-[10px] font-bold text-[#0b2e26]">
            <Award className="h-3 w-3" /> {age >= 25 ? 'Gold Member · 25 Yrs' : 'Age 25 Preview · Road to Gold'}
          </span>
          <span className="text-[11px] font-semibold text-emerald-100 tabular-nums">
            {fvv.feeCoverageMultiple.toFixed(1)}× fee coverage
          </span>
        </div>

        <p className="mt-2 text-[11px] text-emerald-100/90">
          {age >= 25
            ? 'Lifestart Exclusive Advantage vs. a “Free” Neobank:'
            : `Projected at Age 25 (${25 - age} yrs to OTP GO Gold):`}
        </p>
        <p className="text-2xl font-black text-[#ffffff]">
          +<MoneyFlow value={fvv.exclusiveAdvantage} />
          <span className="text-sm font-semibold text-emerald-100">/yr</span>
        </p>
        <p className="mt-1 text-[10px] text-emerald-100/80">
          OTP Junior ends at 24–25. Staying with OTP GO beats a 0 Ft neobank even on identical market returns.
        </p>
      </div>

      {/* Side-by-Side Stay vs Leave Comparison */}
      <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <p className="text-xs font-bold text-[#0b2e26]">
          Stay with OTP GO vs. Switch to Free Neobank
        </p>
        <div className="mt-2 overflow-hidden rounded-xl border border-[#dce5e1]">
          <table className="w-full text-left text-[10px]">
            <thead className="bg-[#ebf3f0] text-[#0b2e26]">
              <tr>
                <th className="px-2 py-1.5 font-bold">Annual Value</th>
                <th className="px-2 py-1.5 text-right font-bold">OTP GO</th>
                <th className="px-2 py-1.5 text-right font-bold">Neobank</th>
                <th className="px-2 py-1.5 text-right font-bold text-[#74BF1E]">Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce5e1]/70 tabular-nums [&_td:not(:first-child)]:whitespace-nowrap">
              <tr>
                <td className="px-2 py-1.5 font-medium">Base Market (6.5%)</td>
                <td className="px-2 py-1.5 text-right">{formatFt(fvv.baseMarketGross)}</td>
                <td className="px-2 py-1.5 text-right text-gray-500">
                  {formatFt(fvv.neobankNetReturn)}
                </td>
                <td className="px-2 py-1.5 text-right font-bold text-[#74BF1E]">
                  +{formatFt(fvv.tbszTaxSaved)}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 font-medium">Loyalty Bonus</td>
                <td className="px-2 py-1.5 text-right">{formatFt(fvv.loyaltyBonusAnnual)}</td>
                <td className="px-2 py-1.5 text-right text-gray-400">0 Ft</td>
                <td className="px-2 py-1.5 text-right font-bold text-[#74BF1E]">
                  +{formatFt(fvv.loyaltyBonusAnnual)}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1.5 font-medium">Gold Cashback</td>
                <td className="px-2 py-1.5 text-right">{formatFt(fvv.goldCashback)}</td>
                <td className="px-2 py-1.5 text-right text-gray-400">0 Ft</td>
                <td className="px-2 py-1.5 text-right font-bold text-[#74BF1E]">
                  +{formatFt(fvv.goldCashback)}
                </td>
              </tr>
              {includeMortgage && (
                <tr className="bg-amber-50/60">
                  <td className="px-2 py-1.5 font-medium">Lakáshitel -0.3%</td>
                  <td className="px-2 py-1.5 text-right">{formatFt(fvv.mortgageSavings)}</td>
                  <td className="px-2 py-1.5 text-right text-gray-400">0 Ft</td>
                  <td className="px-2 py-1.5 text-right font-bold text-[#74BF1E]">
                    +{formatFt(fvv.mortgageSavings)}
                  </td>
                </tr>
              )}
              <tr>
                <td className="px-2 py-1.5 font-medium">All-In Bank Fees</td>
                <td className="px-2 py-1.5 text-right text-red-600">-{formatFt(fvv.annualFees)}</td>
                <td className="px-2 py-1.5 text-right text-gray-500">0 Ft</td>
                <td className="px-2 py-1.5 text-right font-bold text-red-600">
                  -{formatFt(fvv.annualFees)}
                </td>
              </tr>
              <tr className="bg-[#e5f5de]/70 font-extrabold text-[#0b2e26]">
                <td className="px-2 py-2">NET / YEAR</td>
                <td className="px-2 py-2 text-right">{formatFt(fvv.otpGoNet)}</td>
                <td className="px-2 py-2 text-right">{formatFt(fvv.neobankNetReturn)}</td>
                <td className="px-2 py-2 text-right text-[#74BF1E]">
                  +{formatFt(fvv.exclusiveAdvantage)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Interactive First-Home Mortgage Scenario Toggle */}
        <div className="mt-2.5 flex items-center justify-between rounded-xl bg-[#f6f8f7] p-2.5">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-[#74BF1E]" />
            <div>
              <p className="text-[11px] font-bold text-[#0b2e26]">
                First-Home Mortgage
              </p>
              <p className="text-[10px] text-[#4c665f]">Gold -0.30% APR adds +90,000 Ft/yr</p>
            </div>
          </div>
          <Switch checked={includeMortgage} onCheckedChange={setIncludeMortgage} />
        </div>
      </div>

      {/* What You'd Lose if You Leave */}
      <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <p className="flex items-center gap-1.5 text-xs font-bold text-[#0b2e26]">
          <ShieldCheck className="h-4 w-4 text-[#74BF1E]" /> What You Keep by Staying
        </p>
        <div className="mt-2 space-y-1.5">
          {adultPartners.map((p) => (
            <div
              key={p.id}
              className="flex items-start gap-2 rounded-xl bg-[#f6f8f7] p-2 text-xs"
            >
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#74BF1E]" />
              <div>
                <p className="font-bold text-[#0b2e26]">{p.name}</p>
                <p className="text-[10px] text-[#4c665f]">{p.benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
