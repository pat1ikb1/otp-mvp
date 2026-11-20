import { useMemo, useState } from 'react';
import { ArrowRightLeft, ChevronDown, ChevronUp, ShieldCheck, TrendingUp } from 'lucide-react';
import { BondCard } from '@/components/shared/BondCard';
import { GrowthChart } from '@/components/shared/GrowthChart';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { PocketCard } from '@/components/shared/PocketCard';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
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

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'adult-hero',
        title: 'Portfolio & Switches',
        eyeCue: 'Check wealth & reinvest',
        whyHere: 'Anchors total net worth and puts the two key wealth levers (Reinvest + Saving) at thumb reach.',
        render: () => (
          <div className="ds-card space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold ds-text-muted">
                  {core.family.childName}’s Portfolio
                </p>
                <p className="mt-0.5 text-2xl font-extrabold tracking-tight ds-text-primary">
                  <MoneyFlow value={total} />
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTab('value')}
                className="rounded-full bg-[#e5f5de] px-2.5 py-1 text-[10px] font-bold text-[#08261e] hover:bg-[#d5efc9]"
              >
                Value Proof →
              </button>
            </div>

            <div className="ds-card-muted flex items-center justify-between p-2.5">
              <div>
                <p className="flex items-center gap-1 text-xs font-bold ds-text-primary">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#005e48]" />
                  {isReinvest ? 'TBSZ Reinvest ON' : 'Spending Dividends'}
                </p>
                <p className="text-[10px] ds-text-muted">
                  {core.monthIndex < CONFIG.MONTH_AGE_25
                    ? `+${formatFt(extraAt25)} extra by 25`
                    : '+1.50% tax-free loyalty'}
                </p>
              </div>
              <Switch
                checked={isReinvest}
                onCheckedChange={(checked) => setDividendMode(checked ? 'reinvest' : 'spend')}
              />
            </div>

            <div className="ds-card-muted flex items-center justify-between p-2.5">
              <div>
                <p className="flex items-center gap-1 text-xs font-semibold ds-text-primary">
                  <TrendingUp className="h-3.5 w-3.5 text-[#005e48]" /> Own Monthly Saving
                </p>
                <p className="text-[10px] ds-text-muted">
                  {core.account.adultMonthlyContribution > 0
                    ? `${formatFt(core.account.adultMonthlyContribution)}/mo`
                    : '0 Ft/mo (Paused)'}
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
        ),
      },
      {
        id: 'adult-bond',
        title: '5-Yr TBSZ Super Bond',
        eyeCue: 'Track 0% tax countdown',
        whyHere: 'Shows tax-free maturity progress directly beneath your portfolio levers.',
        render: () => <BondCard core={core} />,
      },
      {
        id: 'adult-pockets',
        title: '3 Pockets & Transfer',
        eyeCue: 'Manage 3 pockets',
        whyHere: 'Shows Long/Mid/Short balances with collapsible transfer controls.',
        render: () => (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-0.5">
              <p className="text-xs font-bold ds-text-primary">Your 3 Pockets</p>
              <button
                type="button"
                onClick={() => setManageOpen((o) => !o)}
                style={{ color: 'var(--ds-primary)' }}
                className="inline-flex items-center gap-1 text-[11px] font-bold"
              >
                Transfer {manageOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>

            {manageOpen && (
              <div className="ds-card space-y-2">
                <div className="flex items-center gap-2">
                  <select
                    aria-label="From pocket"
                    value={fromPocket}
                    onChange={(e) => setFromPocket(e.target.value as PocketKey)}
                    className="flex-1 rounded-xl border border-[#dce5e1] bg-[#f4f7f5] px-2 py-1.5 text-xs font-semibold text-[#08261e]"
                  >
                    <option value="long">Long</option>
                    <option value="mid">Mid</option>
                    <option value="short">Short</option>
                  </select>
                  <ArrowRightLeft className="h-3.5 w-3.5 ds-text-muted" />
                  <select
                    aria-label="To pocket"
                    value={toPocket}
                    onChange={(e) => setToPocket(e.target.value as PocketKey)}
                    className="flex-1 rounded-xl border border-[#dce5e1] bg-[#f4f7f5] px-2 py-1.5 text-xs font-semibold text-[#08261e]"
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
                  style={{
                    borderRadius: 'var(--ds-btn-radius)',
                    backgroundColor: 'var(--ds-primary)',
                    color: 'var(--ds-primary-fg)',
                  }}
                  className="ds-btn w-full text-xs font-bold"
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
        ),
      },
      {
        id: 'adult-chart',
        title: '0→25 Trajectory',
        eyeCue: 'Review compounding curve',
        whyHere: 'Visualizes realized growth vs future trajectory to Age 25.',
        render: () => <GrowthChart core={core} />,
      },
    ],
    [
      core,
      total,
      isReinvest,
      extraAt25,
      manageOpen,
      fromPocket,
      toPocket,
      setDividendMode,
      setAdultMonthly,
      moveMoney,
      setTab,
    ],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="adult-home" blocks={blocks} />
    </div>
  );
}
