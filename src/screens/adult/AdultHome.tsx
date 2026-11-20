import { useState } from 'react';
import { ArrowRightLeft, ChevronDown, ChevronUp, ShieldCheck, TrendingUp } from 'lucide-react';
import { BondCard } from '@/components/shared/BondCard';
import { GrowthChart } from '@/components/shared/GrowthChart';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { PocketCard } from '@/components/shared/PocketCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CONFIG } from '@/engine/config';
import { formatFt, projectToMonth, totalBalance } from '@/engine/finance';
import { useLifestart } from '@/state/store';
import type { PocketKey } from '@/types/lifestart';

export function AdultHome() {
  const { state, setDividendMode, setAdultMonthly, moveMoney, setTab } = useLifestart();
  const { core } = state;
  const [manageOpen, setManageOpen] = useState(false);
  const [fromPocket, setFromPocket] = useState<PocketKey>('mid');
  const [toPocket, setToPocket] = useState<PocketKey>('long');
  const total = totalBalance(core);
  const isReinvest = core.account.dividendMode === 'reinvest';

  const projReinvest = projectToMonth(core, CONFIG.MONTH_AGE_25, 'reinvest').total;
  const projSpend = projectToMonth(core, CONFIG.MONTH_AGE_25, 'spend').total;
  const extraAt25 = Math.max(0, projReinvest - projSpend);

  return (
    <div className="space-y-3 pb-2">
      {/* Total Wealth Card */}
      <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[#4c665f]">
              {core.family.childName}’s Total Portfolio
            </p>
            <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-[#0b2e26]">
              <MoneyFlow value={total} />
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTab('value')}
            className="rounded-full bg-[#e5f5de] px-2.5 py-1 text-[10px] font-bold text-[#2f6b18]"
          >
            Value Proof →
          </button>
        </div>

        {/* Reinvest vs Spend Toggle */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-[#ebf3f0] p-2.5">
          <div>
            <p className="flex items-center gap-1 text-xs font-bold text-[#0b2e26]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#74BF1E]" />
              {isReinvest ? 'Reinvesting in TBSZ' : 'Spending Dividends'}
            </p>
            <p className="text-[10px] text-[#4c665f]">
              {core.monthIndex < CONFIG.MONTH_AGE_25
                ? `Reinvesting earns +${formatFt(extraAt25)} more by 25`
                : 'Earns +1.50% loyalty yield tax-free'}
            </p>
          </div>
          <Switch
            checked={isReinvest}
            onCheckedChange={(checked) => setDividendMode(checked ? 'reinvest' : 'spend')}
          />
        </div>

        {/* Optional Own Monthly Contribution */}
        <div className="mt-2 flex items-center justify-between rounded-xl border border-black/5 bg-[#f6f8f7] p-2.5">
          <div>
            <p className="flex items-center gap-1 text-xs font-semibold text-[#0b2e26]">
              <TrendingUp className="h-3.5 w-3.5 text-[#74BF1E]" /> Own Monthly Saving
            </p>
            <p className="text-[10px] text-[#4c665f]">
              Parent deposits paused at 18 ·{' '}
              {core.account.adultMonthlyContribution > 0
                ? `${formatFt(core.account.adultMonthlyContribution)}/mo active`
                : 'Currently 0 Ft/mo'}
            </p>
          </div>
          <Switch
            checked={core.account.adultMonthlyContribution > 0}
            onCheckedChange={(checked) =>
              setAdultMonthly(checked ? CONFIG.DEFAULT_ADULT_MONTHLY : 0)
            }
          />
        </div>
      </div>

      <BondCard core={core} />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-0.5">
          <p className="text-xs font-bold text-[#0b2e26]">Your 3 Pockets</p>
          <button
            type="button"
            onClick={() => setManageOpen((o) => !o)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#74BF1E]"
          >
            Manage {manageOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        {manageOpen && (
          <div className="rounded-2xl border border-emerald-200 bg-white p-3 shadow-xs">
            <p className="text-[11px] font-bold text-[#0b2e26]">Transfer Between Pockets</p>
            <div className="mt-2 flex items-center gap-2">
              <select
                value={fromPocket}
                onChange={(e) => setFromPocket(e.target.value as PocketKey)}
                className="flex-1 rounded-xl border border-[#dce5e1] bg-[#f6f8f7] px-2 py-1.5 text-xs font-semibold"
              >
                <option value="long">Long</option>
                <option value="mid">Mid</option>
                <option value="short">Short</option>
              </select>
              <ArrowRightLeft className="h-4 w-4 text-[#4c665f]" />
              <select
                value={toPocket}
                onChange={(e) => setToPocket(e.target.value as PocketKey)}
                className="flex-1 rounded-xl border border-[#dce5e1] bg-[#f6f8f7] px-2 py-1.5 text-xs font-semibold"
              >
                <option value="long">Long</option>
                <option value="mid">Mid</option>
                <option value="short">Short</option>
              </select>
            </div>
            <Button
              size="xs"
              disabled={fromPocket === toPocket}
              onClick={() => moveMoney(fromPocket, toPocket, 20_000)}
              className="mt-2 w-full bg-[#74BF1E] text-xs font-semibold text-white"
            >
              Transfer 20,000 Ft
            </Button>
          </div>
        )}

        <PocketCard
          pocketKey="long"
          amount={core.account.pockets.long}
          goal={{ label: 'First Home Deposit', target: 6_000_000 }}
          compact
        />
        <PocketCard pocketKey="mid" amount={core.account.pockets.mid} compact />
        <PocketCard pocketKey="short" amount={core.account.pockets.short} compact />
      </div>

      <GrowthChart core={core} />
    </div>
  );
}
