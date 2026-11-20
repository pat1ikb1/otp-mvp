import { useMemo } from 'react';
import { ArrowUpRight, Award, CheckCircle2, GraduationCap } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { SKILL_CATALOG } from '@/data/skillCatalog';
import { formatFt } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useDesignStudio } from '@/state/designStudio';
import { useLifestart } from '@/state/store';

export function AdultSkills() {
  const { state, paySkillMerchant, rollSkillToTbsz, triggerAchievement } = useLifestart();
  const { tokens } = useDesignStudio();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const careerMerchants = SKILL_CATALOG.filter((m) => m.allowed);

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'adult-skill-hero',
        title: 'Career Skill Wallet',
        eyeCue: 'Use or roll to TBSZ',
        whyHere: 'Top anchor shows spendable career balance and 1-tap TBSZ rollover at 25+.',
        render: () => (
          <div
            style={{
              borderRadius: 'var(--ds-card-radius)',
              padding: 'var(--ds-card-padding)',
              background: 'linear-gradient(135deg, var(--ds-header-bg) 0%, var(--ds-primary) 100%)',
            }}
            className="text-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-100">
                <GraduationCap className="h-4 w-4 text-[#74bf1e]" /> Career Skill Wallet
              </span>
              {age >= 25 && (
                <span className="rounded-full bg-[#c89b3c] px-2 py-0.5 text-[10px] font-bold text-[#08261e]">
                  Rollover Ready
                </span>
              )}
            </div>
            <p className="mt-1.5 text-2xl font-extrabold tabular-nums">
              <MoneyFlow value={core.account.skillWallet.balance} />
            </p>
            {tokens.copyDensity !== 'concise' && (
              <p className="mt-1 text-[10px] text-emerald-100/90">
                {age >= 25
                  ? 'Roll remaining Skill funds tax-free into OTP TBSZ.'
                  : '15% of monthly Super Bond yield funds your career until 25.'}
              </p>
            )}

            {age >= 25 && core.account.skillWallet.balance > 0 && (
              <Button
                size="sm"
                onClick={rollSkillToTbsz}
                style={{ borderRadius: 'var(--ds-btn-radius)' }}
                className="ds-btn mt-2.5 w-full bg-[#c89b3c] text-xs font-bold text-[#08261e] hover:bg-[#b5892d]"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                Roll {formatFt(core.account.skillWallet.balance)} to TBSZ
              </Button>
            )}
          </div>
        ),
      },
      {
        id: 'adult-skill-partners',
        title: 'Career Certifications',
        eyeCue: 'Pay partner tuition',
        whyHere: 'Lists eligible degree & certification partners with single-tap payment.',
        render: () => (
          <div className="ds-card space-y-2">
            <p className="text-xs font-bold ds-text-primary">Career & Uni Partners</p>
            {careerMerchants.map((m) => (
              <div
                key={m.id}
                className="ds-card-muted flex items-center justify-between gap-2 p-2.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-base">{m.emoji}</span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold ds-text-primary">{m.name}</p>
                    <p className="truncate text-[10px] ds-text-muted">{m.category}</p>
                  </div>
                </div>
                <Button
                  size="xs"
                  disabled={core.account.skillWallet.balance < m.price}
                  onClick={() => paySkillMerchant(m.id)}
                  style={{
                    borderRadius: 'var(--ds-btn-radius)',
                    backgroundColor: 'var(--ds-primary)',
                    color: 'var(--ds-primary-fg)',
                  }}
                  className="ds-btn shrink-0 text-[10px] font-bold tabular-nums"
                >
                  {formatFt(m.price)}
                </Button>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: 'adult-skill-cashback',
        title: 'Positive-List Cashback',
        eyeCue: 'Claim milestone rewards',
        whyHere: 'Allows claiming remaining milestone bonuses into the Skill Wallet.',
        render: () => (
          <div className="ds-card space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-bold ds-text-primary">
              <Award className="h-4 w-4 text-[#005e48]" /> Milestone Cashback
            </p>
            {core.achievements.map((ach) => {
              const done = ach.unlockedAtMonth !== null;
              return (
                <div
                  key={ach.id}
                  className="ds-card-muted flex items-center justify-between gap-2 p-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-base">{ach.emoji}</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold ds-text-primary">{ach.title}</p>
                      <p className="truncate text-[10px] ds-text-muted">{ach.description}</p>
                    </div>
                  </div>
                  {done ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#005e48] px-2 py-0.5 text-[10px] font-bold text-white">
                      <CheckCircle2 className="h-3 w-3" /> +{ach.cashback / 1000}k
                    </span>
                  ) : (
                    <Button
                      size="xs"
                      onClick={() => triggerAchievement(ach.id)}
                      style={{
                        borderRadius: 'var(--ds-btn-radius)',
                        backgroundColor: 'var(--ds-primary)',
                        color: 'var(--ds-primary-fg)',
                      }}
                      className="ds-btn shrink-0 text-[10px] font-bold"
                    >
                      +{formatFt(ach.cashback)}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ),
      },
    ],
    [core, age, careerMerchants, paySkillMerchant, rollSkillToTbsz, triggerAchievement, tokens.copyDensity],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="adult-skills" blocks={blocks} />
    </div>
  );
}
