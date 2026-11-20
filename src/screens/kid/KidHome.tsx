import { useMemo } from 'react';
import { GraduationCap, Lock, PiggyBank, Rocket } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Progress } from '@/components/ui/progress';
import { shortAvailable, totalBalance } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useDesignStudio } from '@/state/designStudio';
import { useLifestart } from '@/state/store';

export function KidHome() {
  const { state, setTab } = useLifestart();
  const { tokens } = useDesignStudio();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const total = totalBalance(core);
  const activeGoal = core.piggyGoals.find((g) => g.purchasedAtMonth === null);
  const goalPct = activeGoal
    ? Math.min(100, Math.round((activeGoal.saved / activeGoal.target) * 100))
    : 0;

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'kid-hero',
        title: 'Kid Mode & Vault',
        eyeCue: 'See your future vault',
        whyHere: 'Greets the child and anchors the read-only Future Vault amount at the top.',
        render: () => (
          <div
            style={{
              borderRadius: 'var(--ds-card-radius)',
              padding: 'var(--ds-card-padding)',
              background: 'linear-gradient(135deg, #1b3a07 0%, var(--ds-primary) 100%)',
            }}
            className="text-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#74bf1e] px-2 py-0.5 text-[10px] font-bold text-[#08261e]">
                {age >= 15 ? 'OTP Junior · Teen' : 'OTP Junior · Kid'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-100">
                <Rocket className="h-3 w-3 text-[#74bf1e]" /> Vault
              </span>
            </div>
            <h2 className="mt-1.5 text-lg font-extrabold">Hi {core.family.childName}</h2>
            <p className="mt-0.5 text-xl font-black text-white tabular-nums">
              <MoneyFlow value={total} />
            </p>
            {tokens.copyDensity !== 'concise' && (
              <p className="mt-0.5 text-[10px] text-emerald-100/90">
                Grown by {core.family.parentName} — full control unlocks at 18.
              </p>
            )}
          </div>
        ),
      },
      {
        id: 'kid-duo',
        title: 'Persely & Skill Cards',
        eyeCue: 'Pick Persely or Skills',
        whyHere: '2-column action cards separate everyday saving from education spending.',
        render: () => (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setTab('piggy')}
              style={{ borderRadius: 'var(--ds-card-radius)' }}
              className="ds-card text-left transition-transform active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <PiggyBank className="h-5 w-5 text-[#3c8322]" />
                <span className="text-[10px] font-bold text-[#3c8322]">Persely →</span>
              </div>
              <p className="mt-2 text-[10px] font-semibold ds-text-muted">Free Cash</p>
              <p className="text-sm font-extrabold ds-text-primary tabular-nums">
                <MoneyFlow value={shortAvailable(core)} />
              </p>
            </button>

            <button
              type="button"
              onClick={() => setTab('skills')}
              style={{ borderRadius: 'var(--ds-card-radius)' }}
              className="ds-card border-amber-300/70 bg-amber-50/90 text-left transition-transform active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <GraduationCap className="h-5 w-5 text-amber-800" />
                <span className="text-[10px] font-bold text-amber-900">Spend →</span>
              </div>
              <p className="mt-2 text-[10px] font-semibold text-amber-900">Skill Wallet</p>
              <p className="text-sm font-extrabold text-amber-950 tabular-nums">
                <MoneyFlow value={core.account.skillWallet.balance} />
              </p>
            </button>
          </div>
        ),
      },
      {
        id: 'kid-goal-unlock',
        title: 'Active Goal & Milestone',
        eyeCue: 'Track goal & next unlock',
        whyHere: 'Keeps focus on one active savings goal plus the immediate next age milestone.',
        render: () => (
          <div className="space-y-2">
            {activeGoal && (
              <div className="ds-card">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold ds-text-primary">
                    {activeGoal.emoji} {activeGoal.name}
                  </p>
                  <span style={{ color: 'var(--ds-primary)' }} className="text-xs font-extrabold tabular-nums">
                    {goalPct}%
                  </span>
                </div>
                <Progress
                  value={goalPct}
                  className="mt-2 h-2 [&_[data-slot=progress-indicator]]:bg-[#3c8322]"
                />
                <div className="mt-1.5 flex justify-between text-[10px] ds-text-muted tabular-nums">
                  <span>
                    <MoneyFlow value={activeGoal.saved} />
                  </span>
                  <span>
                    Goal: <MoneyFlow value={activeGoal.target} />
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl border border-dashed border-[#005e48]/25 bg-white/80 px-3 py-2 text-[11px] font-semibold text-[#4a635c]">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#005e48]" />
                {age < 15 ? 'Cashback & Odd Jobs' : '5-Year Tax-Free OTP TBSZ'}
              </span>
              <span className="rounded-full bg-[#eef3f1] px-2 py-0.5 text-[10px] font-bold text-[#08261e]">
                {age < 15 ? 'Age 15' : 'Age 18'}
              </span>
            </div>
          </div>
        ),
      },
    ],
    [core, age, total, activeGoal, goalPct, setTab, tokens.copyDensity],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="kid-home" blocks={blocks} />
    </div>
  );
}
