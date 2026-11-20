import { useMemo } from 'react';
import { Award, Car, ChevronRight, GraduationCap, Lock, PiggyBank, Rocket } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Progress } from '@/components/ui/progress';
import { shortAvailable, totalBalance } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function KidHome() {
  const { state, setTab, setSkillSubTab } = useLifestart();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const total = totalBalance(core);
  const activeGoal = core.piggyGoals.find((g) => g.purchasedAtMonth === null);
  const goalPct = activeGoal
    ? Math.min(100, Math.round((activeGoal.saved / activeGoal.target) * 100))
    : 0;

  const openDriving = () => {
    setSkillSubTab('driving');
    setTab('skills');
  };

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'kid-actions',
        render: () => (
          <div className="space-y-4">
            {/* Kid-friendly Circular Quick Action Bubbles with Visual Cues */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <button
                type="button"
                onClick={openDriving}
                className="relative flex flex-col items-center gap-1.5"
              >
                <span className="otp-action-circle-primary otp-cue-ring flex h-12 w-12 items-center justify-center rounded-full">
                  <Car className="h-5 w-5" />
                </span>
                <span className="otp-tag-new absolute -top-1 right-1 px-1.5 py-0.5 text-[8px] font-extrabold">
                  Új
                </span>
                <span className="text-[10px] font-bold text-[#0b2e26]">Jogsi</span>
              </button>

              <button
                type="button"
                onClick={() => setTab('piggy')}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="otp-action-circle flex h-12 w-12 items-center justify-center rounded-full">
                  <PiggyBank className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-semibold text-[#4a635c]">Persely</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSkillSubTab('partners');
                  setTab('skills');
                }}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="otp-action-circle flex h-12 w-12 items-center justify-center rounded-full">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-semibold text-[#4a635c]">Skills</span>
              </button>

              <button
                type="button"
                onClick={() => setTab('milestones')}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="otp-action-circle flex h-12 w-12 items-center justify-center rounded-full">
                  <Award className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-semibold text-[#4a635c]">Quests</span>
              </button>
            </div>

            {/* White Neuromorphic Future Vault Hero */}
            <div className="ds-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#e8f5e4] px-2.5 py-0.5 text-[10px] font-bold text-[#38571a]">
                  {age >= 15 ? 'OTP Junior · Teen' : 'OTP Junior · Kid'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#52ae30]">
                  <Rocket className="h-3.5 w-3.5" /> Future Vault
                </span>
              </div>
              <h2 className="text-base font-extrabold ds-text-primary">
                Hi {core.family.childName}
              </h2>
              <p className="text-2xl font-black ds-text-primary tabular-nums">
                <MoneyFlow value={total} />
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'kid-duo',
        render: () => (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setTab('piggy')}
              className="ds-card ds-card-interactive text-left"
            >
              <div className="flex items-center justify-between">
                <PiggyBank className="h-5 w-5 text-[#52ae30]" />
                <ChevronRight className="h-4 w-4 text-[#52ae30]" />
              </div>
              <p className="mt-2 text-[10px] font-semibold ds-text-muted">Free Cash</p>
              <p className="text-sm font-extrabold ds-text-primary tabular-nums">
                <MoneyFlow value={shortAvailable(core)} />
              </p>
            </button>

            <button
              type="button"
              onClick={openDriving}
              className="ds-card ds-card-interactive text-left"
            >
              <div className="flex items-center justify-between">
                <GraduationCap className="h-5 w-5 text-[#38571a]" />
                <span className="otp-tag-new px-1.5 py-0.5 text-[9px] font-bold">License</span>
              </div>
              <p className="mt-2 text-[10px] font-semibold ds-text-muted">Skill Wallet</p>
              <p className="text-sm font-extrabold ds-text-primary tabular-nums">
                <MoneyFlow value={core.account.skillWallet.balance} />
              </p>
            </button>
          </div>
        ),
      },
      {
        id: 'kid-goal-unlock',
        render: () => (
          <div className="space-y-3">
            {activeGoal && (
              <div className="ds-card">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold ds-text-primary">
                    {activeGoal.emoji} {activeGoal.name}
                  </p>
                  <span className="text-xs font-extrabold text-[#38571a] tabular-nums">
                    {goalPct}%
                  </span>
                </div>
                <Progress
                  value={goalPct}
                  className="mt-2.5 h-2 bg-[#e4e9f0] [&_[data-slot=progress-indicator]]:bg-[#52ae30]"
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

            <div className="ds-card flex items-center justify-between !py-3 text-[11px] font-semibold text-[#4a635c]">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#52ae30]" />
                {age < 15 ? 'Cashback & Odd Jobs' : '5-Year Tax-Free OTP TBSZ'}
              </span>
              <span className="rounded-full bg-[#e8f5e4] px-2.5 py-0.5 text-[10px] font-bold text-[#38571a]">
                {age < 15 ? 'Age 15' : 'Age 18'}
              </span>
            </div>
          </div>
        ),
      },
    ],
    [core, age, total, activeGoal, goalPct, setTab, setSkillSubTab],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="kid-home" blocks={blocks} />
    </div>
  );
}
