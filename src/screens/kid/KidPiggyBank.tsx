import { useMemo, useState } from 'react';
import { Briefcase, ChevronDown, ChevronUp, Lock, PiggyBank, Plus, ShoppingBag } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatFt, shortAvailable } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function KidPiggyBank() {
  const { state, createGoal, fundGoal, buyGoal, addEarning } = useLifestart();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const available = shortAvailable(core);

  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('30000');
  const [newEmoji, setNewEmoji] = useState('🎮');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const t = Number(newTarget);
    if (!newName.trim() || !Number.isFinite(t) || t <= 0) return;
    createGoal(newName, t, newEmoji);
    setNewName('');
    setNewOpen(false);
  };

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'piggy-cash',
        render: () => (
          <div className="ds-card flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold ds-text-muted">Unallocated Short Cash</p>
              <p className="text-xl font-extrabold ds-text-primary tabular-nums">
                <MoneyFlow value={available} />
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f5e4] text-[#52ae30]">
              <PiggyBank className="h-5 w-5" />
            </span>
          </div>
        ),
      },
      {
        id: 'piggy-goals',
        render: () => (
          <div className="space-y-3">
            {core.piggyGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
              const ready = goal.saved >= goal.target && goal.purchasedAtMonth === null;
              const bought = goal.purchasedAtMonth !== null;

              return (
                <div key={goal.id} className="ds-card">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold ds-text-primary">
                      {goal.emoji} {goal.name}
                    </span>
                    <span className="text-xs font-extrabold text-[#38571a] tabular-nums">
                      {bought ? 'Bought ✓' : `${pct}%`}
                    </span>
                  </div>
                  <Progress
                    value={bought ? 100 : pct}
                    className="mt-2.5 h-2 bg-[#e4e9f0] [&_[data-slot=progress-indicator]]:bg-[#52ae30]"
                  />
                  <div className="mt-1.5 flex items-center justify-between text-[10px] ds-text-muted tabular-nums">
                    <span>{formatFt(goal.saved)}</span>
                    <span>{formatFt(goal.target)}</span>
                  </div>

                  {!bought && (
                    <div className="mt-3 flex gap-1.5">
                      {!ready ? (
                        <>
                          <Button
                            size="xs"
                            disabled={available <= 0}
                            onClick={() => fundGoal(goal.id, 5_000)}
                            style={{ borderRadius: 'var(--ds-btn-radius)' }}
                            className="ds-btn flex-1 bg-[#38571a] text-xs font-bold text-white"
                          >
                            <Plus className="h-3 w-3" /> +5k Ft
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            disabled={available <= 0}
                            onClick={() => fundGoal(goal.id, goal.target - goal.saved)}
                            style={{ borderRadius: 'var(--ds-btn-radius)' }}
                            className="ds-btn text-xs font-semibold"
                          >
                            Fill Goal
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => buyGoal(goal.id)}
                          style={{ borderRadius: 'var(--ds-btn-radius)' }}
                          className="ds-btn w-full bg-[#52ae30] text-xs font-bold text-white"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" /> Buy Now
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ),
      },
      {
        id: 'piggy-create-earn',
        render: () => (
          <div className="space-y-3">
            <div className="ds-card">
              <button
                type="button"
                onClick={() => setNewOpen((o) => !o)}
                className="flex w-full items-center justify-between text-xs font-extrabold ds-text-primary"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5 text-[#52ae30]" /> New Persely Goal
                </span>
                {newOpen ? (
                  <ChevronUp className="h-4 w-4 ds-text-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 ds-text-muted" />
                )}
              </button>

              {newOpen && (
                <form onSubmit={handleAddGoal} className="mt-3 space-y-2 border-t border-black/6 pt-3">
                  <div className="flex gap-1.5">
                    <select
                      aria-label="Goal icon"
                      value={newEmoji}
                      onChange={(e) => setNewEmoji(e.target.value)}
                      className="rounded-xl border border-black/10 bg-[#f2f5f8] px-2 text-sm"
                    >
                      <option value="🎮">🎮</option>
                      <option value="🚲">🚲</option>
                      <option value="⚽">⚽</option>
                      <option value="🎧">🎧</option>
                      <option value="⛺">⛺</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Goal name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 rounded-xl border border-black/10 bg-[#f2f5f8] px-2.5 py-1.5 text-xs text-[#0b2e26]"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min={5000}
                      step={5000}
                      aria-label="Goal target amount"
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                      className="w-28 rounded-xl border border-black/10 bg-[#f2f5f8] px-2.5 py-1.5 text-xs text-[#0b2e26] tabular-nums"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      style={{ borderRadius: 'var(--ds-btn-radius)' }}
                      className="ds-btn flex-1 bg-[#38571a] text-xs font-bold text-white"
                    >
                      Create
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {age >= 15 ? (
              <div className="ds-card">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-[#52ae30]" />
                  <p className="text-xs font-extrabold ds-text-primary">Log Odd-Job Earnings</p>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => addEarning('Math Tutoring', 12_000)}
                    style={{ borderRadius: 'var(--ds-btn-radius)' }}
                    className="ds-btn text-xs font-semibold"
                  >
                    +12k Tutoring
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => addEarning('Weekend Barista Shift', 18_000)}
                    style={{ borderRadius: 'var(--ds-btn-radius)' }}
                    className="ds-btn text-xs font-semibold"
                  >
                    +18k Shift
                  </Button>
                </div>
              </div>
            ) : (
              <div className="ds-card flex items-center justify-between !py-3 text-[11px] font-semibold text-[#4a635c]">
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#52ae30]" /> Odd-Job Tracker
                </span>
                <span className="rounded-full bg-[#e8f5e4] px-2 py-0.5 text-[10px] font-bold text-[#38571a]">
                  Age 15
                </span>
              </div>
            )}
          </div>
        ),
      },
    ],
    [core, age, available, newOpen, newName, newTarget, newEmoji, fundGoal, buyGoal, addEarning],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="kid-piggy" blocks={blocks} />
    </div>
  );
}
