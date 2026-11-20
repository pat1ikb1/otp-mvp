import { useMemo } from 'react';
import { ArrowUpRight, Award, Car, CheckCircle2, GraduationCap } from 'lucide-react';
import { DrivingLicenseHub } from '@/components/shared/DrivingLicenseHub';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { SKILL_CATALOG } from '@/data/skillCatalog';
import { formatFt } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function AdultSkills() {
  const {
    state,
    skillSubTab,
    setSkillSubTab,
    paySkillMerchant,
    rollSkillToTbsz,
    triggerAchievement,
  } = useLifestart();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const careerMerchants = SKILL_CATALOG.filter((m) => m.allowed);

  const partnerBlocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'adult-skill-hero',
        render: () => (
          <div className="ds-card space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#38571a]">
                <GraduationCap className="h-4 w-4 text-[#52ae30]" /> Career Skill Wallet
              </span>
              {age >= 25 && (
                <span className="otp-tag-new px-2 py-0.5 text-[10px] font-bold">
                  Rollover Ready
                </span>
              )}
            </div>
            <p className="text-2xl font-extrabold ds-text-primary tabular-nums">
              <MoneyFlow value={core.account.skillWallet.balance} />
            </p>
            <p className="text-[11px] ds-text-muted">
              {age >= 25
                ? 'Roll remaining Skill funds tax-free into OTP TBSZ.'
                : '15% of monthly Super Bond yield funds your career until 25.'}
            </p>

            {age >= 25 && core.account.skillWallet.balance > 0 && (
              <Button
                size="sm"
                onClick={rollSkillToTbsz}
                style={{ borderRadius: 'var(--ds-btn-radius)' }}
                className="ds-btn w-full bg-[#38571a] text-xs font-bold text-white"
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-[#74bf1e]" />
                Roll {formatFt(core.account.skillWallet.balance)} to TBSZ
              </Button>
            )}
          </div>
        ),
      },
      {
        id: 'adult-skill-partners',
        render: () => (
          <div className="ds-card space-y-2.5">
            <p className="text-xs font-extrabold ds-text-primary">Career & Uni Partners</p>
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
                  style={{ borderRadius: 'var(--ds-btn-radius)' }}
                  className="ds-btn shrink-0 bg-[#38571a] text-[10px] font-bold text-white tabular-nums"
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
        render: () => (
          <div className="ds-card space-y-2.5">
            <p className="flex items-center gap-1.5 text-xs font-extrabold ds-text-primary">
              <Award className="h-4 w-4 text-[#52ae30]" /> Milestone Cashback
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
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#38571a] px-2.5 py-0.5 text-[10px] font-bold text-white">
                      <CheckCircle2 className="h-3 w-3 text-[#74bf1e]" /> +{ach.cashback / 1000}k
                    </span>
                  ) : (
                    <Button
                      size="xs"
                      onClick={() => triggerAchievement(ach.id)}
                      style={{ borderRadius: 'var(--ds-btn-radius)' }}
                      className="ds-btn shrink-0 bg-[#38571a] text-[10px] font-bold text-white"
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
    [core, age, careerMerchants, paySkillMerchant, rollSkillToTbsz, triggerAchievement],
  );

  return (
    <div className="flex flex-col pb-2" style={{ gap: 'var(--ds-block-gap)' }}>
      <div className="otp-seg-track grid grid-cols-2">
        <button
          type="button"
          onClick={() => setSkillSubTab('driving')}
          className={`inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold transition-all ${
            skillSubTab === 'driving'
              ? 'otp-seg-pill-active'
              : 'text-[#4a635c] hover:text-[#0b2e26]'
          }`}
        >
          <Car className="h-3.5 w-3.5" />
          Driver’s License
        </button>
        <button
          type="button"
          onClick={() => setSkillSubTab('partners')}
          className={`inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold transition-all ${
            skillSubTab === 'partners'
              ? 'otp-seg-pill-active'
              : 'text-[#4a635c] hover:text-[#0b2e26]'
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          Skill Partners
        </button>
      </div>

      {skillSubTab === 'driving' ? (
        <DrivingLicenseHub />
      ) : (
        <BlockCanvas screenId="adult-skills" blocks={partnerBlocks} />
      )}
    </div>
  );
}
