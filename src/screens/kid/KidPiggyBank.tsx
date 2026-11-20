import { useState } from 'react';
import { Briefcase, Lock, PiggyBank, Plus, ShoppingBag } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
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

  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('30000');
  const [newEmoji, setNewEmoji] = useState('🎮');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const t = Number(newTarget);
    if (!newName.trim() || !Number.isFinite(t) || t <= 0) return;
    createGoal(newName, t, newEmoji);
    setNewName('');
  };

  return (
    <div className="space-y-3 pb-2">
      {/* Persely Available Header */}
      <div className="rounded-2xl border border-lime-200 bg-white p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[#4c665f]">
              Available in Short Pocket
            </p>
            <p className="text-lg font-extrabold text-[#0b2e26]">
              <MoneyFlow value={available} />
            </p>
          </div>
          <PiggyBank className="h-6 w-6 text-[#74BF1E]" />
        </div>
        <p className="mt-1 text-[10px] text-[#4c665f]">
          OTP Persely goals earmark money inside your Short Pocket—never double-counted.
        </p>
      </div>

      {/* Active Goals */}
      <div className="space-y-2">
        {core.piggyGoals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
          const ready = goal.saved >= goal.target && goal.purchasedAtMonth === null;
          const bought = goal.purchasedAtMonth !== null;

          return (
            <div
              key={goal.id}
              className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#0b2e26]">
                  {goal.emoji} {goal.name}
                </span>
                <span className="text-xs font-bold text-[#74BF1E] tabular-nums">
                  {bought ? 'Purchased ✓' : `${pct}%`}
                </span>
              </div>
              <Progress
                value={bought ? 100 : pct}
                className="mt-2 h-2 [&_[data-slot=progress-indicator]]:bg-[#74BF1E]"
              />
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#4c665f]">
                <span>{formatFt(goal.saved)}</span>
                <span>{formatFt(goal.target)}</span>
              </div>

              {!bought && (
                <div className="mt-2.5 flex gap-2">
                  {!ready ? (
                    <>
                      <Button
                        size="xs"
                        disabled={available <= 0}
                        onClick={() => fundGoal(goal.id, 5_000)}
                        className="flex-1 bg-[#74BF1E] text-xs font-bold text-white hover:bg-[#62a318]"
                      >
                        <Plus className="h-3 w-3" /> Earmark 5k Ft
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        disabled={available <= 0}
                        onClick={() => fundGoal(goal.id, goal.target - goal.saved)}
                        className="text-xs font-semibold"
                      >
                        Fill Goal
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => buyGoal(goal.id)}
                      className="w-full bg-[#74BF1E] text-xs font-bold text-white hover:bg-[#62a318]"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" /> Buy it now!
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create New Goal */}
      <form
        onSubmit={handleAddGoal}
        className="space-y-2 rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs"
      >
        <p className="text-xs font-bold text-[#0b2e26]">New Persely Goal</p>
        <div className="flex gap-1.5">
          <select
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            className="rounded-xl border border-[#dce5e1] bg-[#f6f8f7] px-2 text-sm"
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
            className="flex-1 rounded-xl border border-[#dce5e1] bg-[#f6f8f7] px-2.5 py-1.5 text-xs"
          />
        </div>
        <div className="flex gap-1.5">
          <input
            type="number"
            min={5000}
            step={5000}
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            className="w-28 rounded-xl border border-[#dce5e1] bg-[#f6f8f7] px-2.5 py-1.5 text-xs tabular-nums"
          />
          <Button type="submit" size="sm" variant="secondary" className="flex-1 text-xs font-semibold">
            + Create Goal
          </Button>
        </div>
      </form>

      {/* Odd-Job Earnings Tracker (15+) */}
      {age >= 15 ? (
        <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-3.5">
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-[#74BF1E]" />
            <p className="text-xs font-bold text-[#0b2e26]">Odd-Job Earnings Tracker</p>
          </div>
          <p className="mt-1 text-[11px] text-[#4c665f]">
            Log part-time work or family tasks straight into your Short Pocket.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <Button
              size="xs"
              variant="outline"
              onClick={() => addEarning('Math Tutoring', 12_000)}
              className="bg-white text-xs font-semibold"
            >
              +12k Tutoring
            </Button>
            <Button
              size="xs"
              variant="outline"
              onClick={() => addEarning('Weekend Barista Shift', 18_000)}
              className="bg-white text-xs font-semibold"
            >
              +18k Weekend Shift
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-dashed border-gray-300 bg-white/70 p-3 text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-semibold">
            <Lock className="h-3.5 w-3.5" /> Odd-Job Earnings Tracker
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">Unlocks at 15 🔒</span>
        </div>
      )}
    </div>
  );
}
