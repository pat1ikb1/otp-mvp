import { useState } from 'react';
import { motion } from 'motion/react';
import { Ban, CheckCircle2, GraduationCap, ShieldAlert } from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { Button } from '@/components/ui/button';
import { SKILL_CATALOG } from '@/data/skillCatalog';
import { formatFt } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function KidSkillWallet() {
  const { state, paySkillMerchant } = useLifestart();
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
      }, 900);
    } else {
      paySkillMerchant(id);
    }
  };

  const handlePayBlocked = (id: string) => {
    setBlockedId(id);
    paySkillMerchant(id);
    window.setTimeout(() => setBlockedId(null), 650);
  };

  return (
    <div className="space-y-3 pb-2">
      {/* Skill Wallet Balance Card */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-4 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-100">
            <GraduationCap className="h-4 w-4" />
            <span>Protected Skill Wallet</span>
          </div>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
            {age < 15 ? 'Parent Approval Mode' : 'Direct Pay Active ✓'}
          </span>
        </div>
        <p className="mt-1.5 text-2xl font-extrabold">
          <MoneyFlow value={core.account.skillWallet.balance} />
        </p>
        <p className="mt-1 text-[11px] text-amber-100">
          Funded automatically by 15% of Super Bond yield + achievement cashback. Spendable ONLY on education, skills & career.
        </p>
      </div>

      {/* Approved Skill Merchants */}
      <div className="space-y-2 rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <p className="flex items-center gap-1.5 text-xs font-bold text-[#0b2e26]">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#74BF1E]" />
          Whitelisted Career & Skill Partners
        </p>
        {allowedMerchants.map((m) => {
          const canAfford = core.account.skillWallet.balance >= m.price;
          const isApproving = approvingId === m.id;
          return (
            <div
              key={m.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-emerald-100 bg-[#f6f8f7] p-2.5"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{m.emoji}</span>
                <div>
                  <p className="text-xs font-bold text-[#0b2e26]">{m.name}</p>
                  <p className="text-[10px] text-[#4c665f]">{m.category}</p>
                </div>
              </div>
              <Button
                size="xs"
                disabled={!canAfford || isApproving}
                onClick={() => handlePayAllowed(m.id)}
                className="shrink-0 bg-[#74BF1E] text-[11px] font-bold text-white tabular-nums hover:bg-[#62a318]"
              >
                {isApproving ? 'Anna approving…' : `Pay ${formatFt(m.price)}`}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Blocked Non-Skill Demo Merchants */}
      <div className="space-y-2 rounded-2xl border border-red-200 bg-red-50/50 p-3.5">
        <p className="flex items-center gap-1.5 text-xs font-bold text-red-800">
          <ShieldAlert className="h-3.5 w-3.5" />
          Try Non-Skill Spend
        </p>
        {blockedMerchants.map((m) => {
          const shaking = blockedId === m.id;
          return (
            <motion.div
              key={m.id}
              animate={shaking ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between gap-2 rounded-xl border border-red-200/80 bg-white p-2.5"
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
                variant="destructive"
                onClick={() => handlePayBlocked(m.id)}
                className="shrink-0 text-[11px] font-bold tabular-nums"
              >
                <Ban className="h-3 w-3" /> {formatFt(m.price)}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Spend History */}
      {core.account.skillWallet.spent.length > 0 && (
        <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
          <p className="text-xs font-bold text-[#0b2e26]">Recent Skill Investments</p>
          <div className="mt-2 space-y-1.5">
            {core.account.skillWallet.spent.slice(0, 4).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl bg-[#f6f8f7] px-2.5 py-1.5 text-xs"
              >
                <span className="font-medium text-[#0b2e26]">{s.merchant}</span>
                <span className="font-bold text-[#74BF1E] tabular-nums">
                  -{formatFt(s.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
