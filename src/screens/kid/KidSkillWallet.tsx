import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Ban, CheckCircle2, GraduationCap, ShieldAlert } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { SKILL_CATALOG } from '@/data/skillCatalog';
import { formatFt } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useDesignStudio } from '@/state/designStudio';
import { useLifestart } from '@/state/store';

export function KidSkillWallet() {
  const { state, paySkillMerchant } = useLifestart();
  const { tokens } = useDesignStudio();
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

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'skill-balance',
        title: 'Protected Skill Balance',
        eyeCue: 'Check education budget',
        whyHere: 'Amber-gold anchor distinguishes ring-fenced Skill funds from regular spending cash.',
        render: () => (
          <div
            style={{
              borderRadius: 'var(--ds-card-radius)',
              padding: 'var(--ds-card-padding)',
            }}
            className="bg-gradient-to-br from-[#78350f] to-[#b45309] text-white shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-100">
                <GraduationCap className="h-4 w-4" />
                <span>Skill Wallet</span>
              </div>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                {age < 15 ? 'Parent Approval' : 'Direct Pay ✓'}
              </span>
            </div>
            <p className="mt-1.5 text-2xl font-extrabold tabular-nums">
              <MoneyFlow value={core.account.skillWallet.balance} />
            </p>
            {tokens.copyDensity !== 'concise' && (
              <p className="mt-1 text-[10px] text-amber-100">
                15% of Super Bond yield · Education & career spend only.
              </p>
            )}
          </div>
        ),
      },
      {
        id: 'skill-partners',
        title: 'Approved Skill Partners',
        eyeCue: 'Pay whitelisted school',
        whyHere: 'Direct green pay buttons guide the eye to approved learning investments.',
        render: () => (
          <div className="ds-card space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-bold ds-text-primary">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#005e48]" />
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
                    style={{
                      borderRadius: 'var(--ds-btn-radius)',
                      backgroundColor: 'var(--ds-primary)',
                      color: 'var(--ds-primary-fg)',
                    }}
                    className="ds-btn shrink-0 text-[11px] font-bold tabular-nums"
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
        title: 'Guardrail Block Test',
        eyeCue: 'Test non-skill block',
        whyHere: 'Demonstrates automatic merchant-category protection against impulse spending.',
        render: () => (
          <div className="ds-card border-red-200 bg-red-50/70 space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-bold text-red-900">
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
                  className="flex items-center justify-between gap-2 rounded-xl border border-red-200 bg-white px-2.5 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{m.emoji}</span>
                    <span className="text-xs font-bold text-[#08261e]">{m.name}</span>
                  </div>
                  <Button
                    size="xs"
                    variant="destructive"
                    onClick={() => handlePayBlocked(m.id)}
                    className="shrink-0 text-[10px] font-bold tabular-nums"
                  >
                    <Ban className="h-3 w-3" /> {formatFt(m.price)}
                  </Button>
                </motion.div>
              );
            })}

            {core.account.skillWallet.spent.length > 0 && (
              <div className="border-t border-red-200/70 pt-2">
                <p className="text-[10px] font-bold text-[#08261e]">Recent Paid Skills</p>
                {core.account.skillWallet.spent.slice(0, 2).map((s) => (
                  <div
                    key={s.id}
                    className="mt-1 flex items-center justify-between text-[11px] text-[#08261e]"
                  >
                    <span>{s.merchant}</span>
                    <span className="font-bold text-[#005e48] tabular-nums">
                      -{formatFt(s.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ),
      },
    ],
    [core, age, allowedMerchants, blockedMerchants, approvingId, blockedId, tokens.copyDensity],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="kid-skills" blocks={blocks} />
    </div>
  );
}
