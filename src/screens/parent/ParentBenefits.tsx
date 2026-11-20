import { BellRing, Sparkles } from 'lucide-react';
import { PARENT_TIPS } from '@/data/parentTips';
import { PARTNERS } from '@/data/partners';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function ParentBenefits() {
  const { state } = useLifestart();
  const age = getAge(state.core.monthIndex);
  const parentPartners = PARTNERS.filter((p) => p.audience === 'parent' || p.audience === 'youth');
  const tips = PARENT_TIPS.filter((t) => t.minAge <= age).reverse();

  return (
    <div className="space-y-3 pb-2">
      {/* Stage-Triggered Parent Tips */}
      <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <div className="flex items-center gap-1.5">
          <BellRing className="h-4 w-4 text-[#74BF1E]" />
          <p className="text-xs font-bold text-[#0b2e26]">Parent Milestone Feed</p>
        </div>
        <div className="mt-2.5 space-y-2">
          {tips.map((tip) => (
            <div key={tip.id} className="rounded-xl bg-[#ebf3f0] p-2.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#0b2e26]">{tip.title}</p>
                <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-[#74BF1E]">
                  {tip.tag}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-[#4c665f]">{tip.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Benefits Directory */}
      <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#74BF1E]" />
          <p className="text-xs font-bold text-[#0b2e26]">OTP & Partner Perks</p>
        </div>
        <div className="mt-2.5 space-y-2">
          {parentPartners.map((p) => (
            <div
              key={p.id}
              className="flex items-start gap-2.5 rounded-xl border border-black/5 bg-[#f6f8f7] p-2.5"
            >
              <span className="text-lg">{p.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-[#0b2e26]">{p.name}</p>
                  {p.isOtpEcosystem && (
                    <span className="rounded-full bg-[#74BF1E] px-1.5 py-0.5 text-[9px] font-bold text-white">
                      OTP
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#4c665f]">{p.benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
