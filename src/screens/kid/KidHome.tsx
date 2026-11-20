import { GraduationCap, Lock, PiggyBank, Rocket } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { Progress } from '@/components/ui/progress';
import { shortAvailable, totalBalance } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function KidHome() {
  const { state, setTab } = useLifestart();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const total = totalBalance(core);
  const activeGoal = core.piggyGoals.find((g) => g.purchasedAtMonth === null);
  const goalPct = activeGoal
    ? Math.min(100, Math.round((activeGoal.saved / activeGoal.target) * 100))
    : 0;

  return (
    <div className="space-y-3 pb-2">
      {/* Greeting Banner */}
      <div className="rounded-2xl bg-[#74BF1E] p-4 text-white shadow-sm">
        <p className="text-xs font-medium text-lime-100">
          {age >= 15 ? 'OTP Junior · Teen Mode' : 'OTP Junior · Kid Mode'}
        </p>
        <h2 className="mt-0.5 text-lg font-extrabold">Hi {core.family.childName} 👋</h2>
        <p className="mt-1 text-xs text-white/90">
          Your Skill Wallet & Persely help you level up while your long-term vault grows.
        </p>
      </div>

      {/* Quick Action Cards: Persely & Skill Wallet */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => setTab('piggy')}
          className="rounded-2xl border border-lime-200 bg-white p-3 text-left shadow-xs transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <PiggyBank className="h-5 w-5 text-[#74BF1E]" />
            <span className="text-[10px] font-bold text-[#3c8322]">Persely →</span>
          </div>
          <p className="mt-2 text-[11px] font-medium text-[#4c665f]">Free Spending Cash</p>
          <p className="text-sm font-extrabold text-[#0b2e26]">
            <MoneyFlow value={shortAvailable(core)} />
          </p>
        </button>

        <button
          type="button"
          onClick={() => setTab('skills')}
          className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3 text-left shadow-xs transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <GraduationCap className="h-5 w-5 text-amber-600" />
            <span className="text-[10px] font-bold text-amber-800">Spend →</span>
          </div>
          <p className="mt-2 text-[11px] font-medium text-amber-900">Skill Wallet</p>
          <p className="text-sm font-extrabold text-amber-950">
            <MoneyFlow value={core.account.skillWallet.balance} />
          </p>
        </button>
      </div>

      {/* Active Persely Goal Preview */}
      {activeGoal && (
        <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#0b2e26]">
              {activeGoal.emoji} {activeGoal.name}
            </p>
            <span className="text-xs font-bold text-[#74BF1E] tabular-nums">{goalPct}%</span>
          </div>
          <Progress value={goalPct} className="mt-2 h-2 [&_[data-slot=progress-indicator]]:bg-[#74BF1E]" />
          <div className="mt-1.5 flex justify-between text-[11px] text-[#4c665f]">
            <span>Saved: <MoneyFlow value={activeGoal.saved} /></span>
            <span>Target: <MoneyFlow value={activeGoal.target} /></span>
          </div>
        </div>
      )}

      {/* Read-Only Future Vault */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5">
        <div className="flex items-center gap-2">
          <Rocket className="h-4 w-4 text-[#74BF1E]" />
          <p className="text-xs font-bold text-[#0b2e26]">Your Future Vault</p>
        </div>
        <p className="mt-1 text-lg font-extrabold text-[#74BF1E]">
          <MoneyFlow value={total} />
        </p>
        <p className="mt-0.5 text-[11px] text-[#4c665f]">
          {core.family.parentName} is growing this for your future. Full control unlocks at 18!
        </p>
      </div>

      {/* Locked Teasers */}
      <div className="space-y-1.5 rounded-2xl border border-dashed border-gray-300 bg-white/70 p-3 opacity-80">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" /> 5-Year OTP TBSZ & Reinvest Mode
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">Unlocks at 18 🔒</span>
        </div>
        {age < 15 && (
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Achievement Cashback & Odd Jobs
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">Unlocks at 15 🔒</span>
          </div>
        )}
      </div>
    </div>
  );
}
