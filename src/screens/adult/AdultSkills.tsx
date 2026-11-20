import { ArrowUpRight, Award, CheckCircle2, GraduationCap } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { Button } from '@/components/ui/button';
import { SKILL_CATALOG } from '@/data/skillCatalog';
import { formatFt } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function AdultSkills() {
  const { state, paySkillMerchant, rollSkillToTbsz, triggerAchievement } = useLifestart();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const careerMerchants = SKILL_CATALOG.filter((m) => m.allowed);

  return (
    <div className="space-y-3 pb-2">
      <div className="rounded-2xl bg-[#74BF1E] p-4 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-100">
            <GraduationCap className="h-4 w-4 text-[#ffffff]" /> Career & Uni Skill Wallet
          </span>
          {age >= 25 && (
            <span className="rounded-full bg-[#c89b3c] px-2 py-0.5 text-[10px] font-bold text-[#0b2e26]">
              Rollover Ready
            </span>
          )}
        </div>
        <p className="mt-1.5 text-2xl font-extrabold">
          <MoneyFlow value={core.account.skillWallet.balance} />
        </p>
        <p className="mt-1 text-[11px] text-emerald-100/90">
          {age >= 25
            ? 'At 25, automatic yield diversion stops so 100% compounds in TBSZ. Spend on career courses or roll remaining funds into TBSZ.'
            : '15% of monthly Super Bond yield keeps funding your degrees & certifications until 25.'}
        </p>

        {age >= 25 && core.account.skillWallet.balance > 0 && (
          <Button
            size="sm"
            onClick={rollSkillToTbsz}
            className="mt-3 w-full bg-[#c89b3c] text-xs font-bold text-[#0b2e26] hover:bg-[#b5892d]"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            Roll {formatFt(core.account.skillWallet.balance)} into 0% Tax OTP TBSZ
          </Button>
        )}
      </div>

      <div className="space-y-2 rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <p className="text-xs font-bold text-[#0b2e26]">Career & Certification Partners</p>
        {careerMerchants.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between gap-2 rounded-xl bg-[#f6f8f7] p-2.5"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{m.emoji}</span>
              <div>
                <p className="text-xs font-bold text-[#0b2e26]">{m.name}</p>
                <p className="text-[10px] text-[#4c665f]">{m.category}</p>
              </div>
            </div>
            <Button
              size="xs"
              disabled={core.account.skillWallet.balance < m.price}
              onClick={() => paySkillMerchant(m.id)}
              className="bg-[#74BF1E] text-[11px] font-bold text-white tabular-nums"
            >
              {formatFt(m.price)}
            </Button>
          </div>
        ))}
      </div>

      {/* Achievements -> Cashback */}
      <div className="space-y-2 rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <p className="flex items-center gap-1.5 text-xs font-bold text-[#0b2e26]">
          <Award className="h-4 w-4 text-[#74BF1E]" /> Career Positive-List Cashback
        </p>
        {core.achievements.map((ach) => {
          const done = ach.unlockedAtMonth !== null;
          return (
            <div
              key={ach.id}
              className="flex items-center justify-between gap-2 rounded-xl bg-[#f6f8f7] p-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{ach.emoji}</span>
                <div>
                  <p className="text-xs font-bold text-[#0b2e26]">{ach.title}</p>
                  <p className="text-[10px] text-[#4c665f]">{ach.description}</p>
                </div>
              </div>
              {done ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#74BF1E] px-2 py-0.5 text-[10px] font-bold text-white">
                  <CheckCircle2 className="h-3 w-3" /> +{ach.cashback / 1000}k
                </span>
              ) : (
                <Button
                  size="xs"
                  onClick={() => triggerAchievement(ach.id)}
                  className="shrink-0 bg-[#74BF1E] text-[11px] font-bold text-white"
                >
                  +{formatFt(ach.cashback)}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
