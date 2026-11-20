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
        title: 'Age 18 Handover Hero',
        eyeCue: 'See inherited wealth',
        whyHere: 'Celebratory top anchor reveals total accumulated balance at adulthood.',
        render: () => (
          <div
            style={{
              borderRadius: 'var(--ds-card-radius)',
              padding: 'var(--ds-card-padding)',
              background: 'linear-gradient(135deg, var(--ds-header-bg) 0%, var(--ds-primary) 100%)',
            }}
            className="text-white shadow-md"
          >
            <span className="inline-block rounded-full bg-[#74bf1e] px-2.5 py-0.5 text-[10px] font-bold text-[#08261e] uppercase">
              Age 18 Handover
            </span>
            <h2 className="mt-2 text-lg font-extrabold leading-tight">
              {core.family.childName}, it’s yours now.
            </h2>
            <p className="mt-1 text-2xl font-black text-white">
              <MoneyFlow value={total} />
            </p>
            <div className="mt-2.5 flex items-start gap-1.5 rounded-xl bg-white/12 p-2 text-[11px] text-emerald-50">
              <Heart className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#74bf1e]" />
              <span className="italic">
                “We believed in your future from day one. — {core.family.parentName}”
              </span>
            </div>
          </div>
        ),
      },
      {
        id: 'handover-breakdown',
        title: 'Growth Origin Grid',
        eyeCue: 'Verify yield vs gifts',
        whyHere: '2x2 metric grid shows how compounding amplified parent deposits.',
        render: () => (
          <div className="ds-card grid grid-cols-2 gap-1.5 text-xs">
            <div className="ds-card-muted p-2">
              <p className="text-[10px] ds-text-muted">Deposits</p>
              <p className="font-bold ds-text-primary tabular-nums">{formatFt(contributions)}</p>
            </div>
            <div className="ds-card-muted p-2">
              <p className="text-[10px] ds-text-muted">Family Gifts</p>
              <p className="font-bold ds-text-primary tabular-nums">{formatFt(gifts)}</p>
            </div>
            <div className="ds-card-muted p-2">
              <p className="text-[10px] ds-text-muted">Birth Grant</p>
              <p style={{ color: 'var(--ds-primary)' }} className="font-bold tabular-nums">
                {formatFt(welcomeGrant)}
              </p>
            </div>
            <div className="rounded-xl bg-[#e5f5de] p-2">
              <p className="text-[10px] text-[#08261e]">Bond Growth</p>
              <p className="font-extrabold text-[#005e48] tabular-nums">
                {formatFt(grossYieldEarned)}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'handover-decision',
        title: '5-Yr TBSZ Choice',
        eyeCue: 'Pick Reinvest & launch',
        whyHere: 'Forces one clear decision (0% tax TBSZ vs spending dividends) directly above CTA.',
        render: () => (
          <div className="ds-card space-y-2.5">
            <p className="text-xs font-bold ds-text-primary">Your Path (18 → 25)</p>
            <button
              type="button"
              onClick={() => setChoice('reinvest')}
              style={{ borderRadius: 'var(--ds-btn-radius)' }}
              className={`w-full border p-2.5 text-left transition-all ${
                choice === 'reinvest'
                  ? 'border-[#005e48] bg-[#e5f5de]/70 ring-1 ring-[#005e48]'
                  : 'border-[#dce5e1] bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#08261e]">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#005e48]" /> 5-Yr TBSZ Reinvest
                </span>
                <span className="shrink-0 rounded-full bg-[#08261e] px-2 py-0.5 text-[9px] font-bold text-[#74bf1e]">
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
              className={`w-full border p-2.5 text-left transition-all ${
                choice === 'spend'
                  ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500'
                  : 'border-[#dce5e1] bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#08261e]">
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
              style={{
                borderRadius: 'var(--ds-btn-radius)',
                backgroundColor: 'var(--ds-primary)',
                color: 'var(--ds-primary-fg)',
              }}
              className="ds-btn h-11 w-full text-sm font-bold"
            >
              <CheckCircle2 className="h-4 w-4" />
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
