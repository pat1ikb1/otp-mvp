import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Heart, ShieldCheck, TrendingUp } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/engine/config';
import { formatFt, projectToMonth, totalBalance } from '@/engine/finance';
import { useLifestart } from '@/state/store';
import type { DividendMode } from '@/types/lifestart';

export function Handover18() {
  const { state, acceptHandover } = useLifestart();
  const { core } = state;
  const [choice, setChoice] = useState<DividendMode>('reinvest');

  const total = totalBalance(core);
  const projReinvest = projectToMonth(core, CONFIG.MONTH_AGE_25, 'reinvest');
  const projSpend = projectToMonth(core, CONFIG.MONTH_AGE_25, 'spend');
  const age25Delta = projReinvest.total - projSpend.total;

  const { welcomeGrant, contributions, gifts, grossYieldEarned } = core.account.totals;

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'handover-hero',
        render: () => (
          <div className="ds-card space-y-2.5">
            <span className="inline-block rounded-full bg-[#e8f5e4] px-2.5 py-0.5 text-[10px] font-bold text-[#38571a] uppercase">
              Age 18 Handover
            </span>
            <h2 className="text-lg font-extrabold leading-tight ds-text-primary">
              {core.family.childName}, it’s yours now.
            </h2>
            <p className="text-2xl font-black text-[#38571a]">
              <MoneyFlow value={total} />
            </p>
            <div className="ds-card-muted flex items-start gap-2 p-2.5 text-[11px] ds-text-muted">
              <Heart className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#52ae30]" />
              <span className="italic">
                “We believed in your future from day one. — {core.family.parentName}”
              </span>
            </div>
          </div>
        ),
      },
      {
        id: 'handover-breakdown',
        render: () => (
          <div className="ds-card grid grid-cols-2 gap-2 text-xs">
            <div className="ds-card-muted p-2.5">
              <p className="text-[10px] ds-text-muted">Deposits</p>
              <p className="font-bold ds-text-primary tabular-nums">{formatFt(contributions)}</p>
            </div>
            <div className="ds-card-muted p-2.5">
              <p className="text-[10px] ds-text-muted">Family Gifts</p>
              <p className="font-bold ds-text-primary tabular-nums">{formatFt(gifts)}</p>
            </div>
            <div className="ds-card-muted p-2.5">
              <p className="text-[10px] ds-text-muted">Birth Grant</p>
              <p className="font-bold text-[#38571a] tabular-nums">{formatFt(welcomeGrant)}</p>
            </div>
            <div className="rounded-xl bg-[#e8f5e4] p-2.5">
              <p className="text-[10px] text-[#38571a]">Bond Growth</p>
              <p className="font-extrabold text-[#38571a] tabular-nums">
                {formatFt(grossYieldEarned)}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'handover-decision',
        render: () => (
          <div className="ds-card space-y-2.5">
            <p className="text-xs font-extrabold ds-text-primary">Your Path (18 → 25)</p>
            <button
              type="button"
              onClick={() => setChoice('reinvest')}
              style={{ borderRadius: 'var(--ds-btn-radius)' }}
              className={`w-full border p-3 text-left transition-all ${
                choice === 'reinvest'
                  ? 'border-[#52ae30] bg-[#e8f5e4]'
                  : 'border-transparent bg-[#f2f5f8]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-xs font-bold ds-text-primary">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#52ae30]" /> 5-Yr TBSZ Reinvest
                </span>
                <span className="shrink-0 rounded-full bg-[#38571a] px-2 py-0.5 text-[9px] font-bold text-white">
                  0% Tax at 23
                </span>
              </div>
              <p className="mt-1 text-[10px] ds-text-muted">
                +0.25%/yr loyalty bonus & 28% tax shield.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setChoice('spend')}
              style={{ borderRadius: 'var(--ds-btn-radius)' }}
              className={`w-full border p-3 text-left transition-all ${
                choice === 'spend'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-transparent bg-[#f2f5f8]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold ds-text-primary">
                  <TrendingUp className="h-4 w-4 text-amber-600" /> Spend Dividends
                </span>
                <span className="text-[10px] font-bold text-red-700 tabular-nums">
                  -{formatFt(age25Delta)} by 25
                </span>
              </div>
            </button>

            <Button
              size="lg"
              onClick={() => acceptHandover(choice)}
              style={{ borderRadius: 'var(--ds-btn-radius)' }}
              className="ds-btn h-11 w-full bg-[#38571a] text-sm font-bold text-white hover:bg-[#2c4614]"
            >
              <CheckCircle2 className="h-4 w-4 text-[#74bf1e]" />
              Take Full Control
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [core, total, contributions, gifts, welcomeGrant, grossYieldEarned, choice, age25Delta, acceptHandover],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="handover-18" blocks={blocks} />
    </div>
  );
}
