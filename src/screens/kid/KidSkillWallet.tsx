import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Ban, Car, CheckCircle2, GraduationCap, ShieldAlert } from 'lucide-react';
import { DrivingLicenseHub } from '@/components/shared/DrivingLicenseHub';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { SKILL_CATALOG } from '@/data/skillCatalog';
import { formatFt } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function KidSkillWallet() {
  const { state, skillSubTab, setSkillSubTab, paySkillMerchant } = useLifestart();
  const { core } = state;
  const age = getAge(core.monthIndex);
  const [blockedId, setBlockedId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const allowedMerchants = SKILL_CATALOG.filter((m) => m.allowed && m.minAge <= age);
  const blockedMerchants = SKILL_CATALOG.filter((m) => !m.allowed);

  const handlePayAllowed = (id: string) => {
    if (age < 15) {
      setApprovingId(id);
      window.setTimeout(() => {
        setApprovingId(null);
        paySkillMerchant(id);
      }, 850);
    } else {
      paySkillMerchant(id);
    }
  };

  const handlePayBlocked = (id: string) => {
    setBlockedId(id);
    paySkillMerchant(id);
    window.setTimeout(() => setBlockedId(null), 650);
  };

  const partnerBlocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'skill-balance',
        render: () => (
          <div className="ds-card space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#38571a]">
                <GraduationCap className="h-4 w-4 text-[#52ae30]" />
                <span>Skill Wallet</span>
              </div>
              <span className="rounded-full bg-[#e8f5e4] px-2.5 py-0.5 text-[10px] font-bold text-[#38571a]">
                {age < 15 ? 'Parent Approval' : 'Direct Pay ✓'}
              </span>
            </div>
            <p className="text-2xl font-extrabold ds-text-primary tabular-nums">
              <MoneyFlow value={core.account.skillWallet.balance} />
            </p>
            <p className="text-[11px] ds-text-muted">
              15% of Super Bond yield · Education & skills only.
            </p>
          </div>
        ),
      },
      {
        id: 'skill-partners',
        render: () => (
          <div className="ds-card space-y-2.5">
            <p className="flex items-center gap-1.5 text-xs font-extrabold ds-text-primary">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#52ae30]" />
              Approved Skill Partners
            </p>
            {allowedMerchants.map((m) => {
              const canAfford = core.account.skillWallet.balance >= m.price;
              const isApproving = approvingId === m.id;
              return (
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
                    disabled={!canAfford || isApproving}
                    onClick={() => handlePayAllowed(m.id)}
                    style={{ borderRadius: 'var(--ds-btn-radius)' }}
                    className="ds-btn shrink-0 bg-[#38571a] text-[10px] font-bold text-white"
                  >
                    {isApproving ? 'Approving…' : formatFt(m.price)}
                  </Button>
                </div>
              );
            })}
          </div>
        ),
      },
      {
        id: 'skill-guardrail',
        render: () => (
          <div className="ds-card space-y-2.5">
            <p className="flex items-center gap-1.5 text-xs font-extrabold text-red-700">
              <ShieldAlert className="h-3.5 w-3.5" />
              Blocked Non-Skill Spend
            </p>
            {blockedMerchants.map((m) => {
              const shaking = blockedId === m.id;
              return (
                <motion.div
                  key={m.id}
                  animate={shaking ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.35 }}
                  className="ds-card-muted flex items-center justify-between gap-2 px-2.5 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{m.emoji}</span>
                    <span className="text-xs font-bold ds-text-primary">{m.name}</span>
                  </div>
                  <Button
                    size="xs"
                    variant="destructive"
                    onClick={() => handlePayBlocked(m.id)}
                    style={{ borderRadius: 'var(--ds-btn-radius)' }}
                    className="ds-btn shrink-0 text-[10px] font-bold tabular-nums"
                  >
                    <Ban className="h-3 w-3" /> {formatFt(m.price)}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        ),
      },
    ],
    [core, age, allowedMerchants, blockedMerchants, approvingId, blockedId],
  );

  return (
    <div className="flex flex-col pb-2" style={{ gap: 'var(--ds-block-gap)' }}>
      {/* OTP MobilBank Segmented Switch (matching Template/szamlatortenet_MB_230.webp) */}
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
        <BlockCanvas screenId="kid-skills" blocks={partnerBlocks} />
      )}
    </div>
  );
}
