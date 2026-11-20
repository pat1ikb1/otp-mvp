import { useMemo, useState } from 'react';
import { BellRing, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { PARENT_TIPS } from '@/data/parentTips';
import { PARTNERS } from '@/data/partners';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function ParentBenefits() {
  const { state } = useLifestart();
  const age = getAge(state.core.monthIndex);
  const parentPartners = PARTNERS.filter((p) => p.audience === 'parent' || p.audience === 'youth');
  const tips = PARENT_TIPS.filter((t) => t.minAge <= age).reverse();
  const [showAllTips, setShowAllTips] = useState(false);

  const visibleTips = showAllTips ? tips : tips.slice(0, 1);

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'benefits-tips',
        title: 'Stage Focus Tip',
        eyeCue: 'Read current stage tip',
        whyHere: 'Progressive disclosure shows only the active age tip first, cutting reading load by 70%.',
        render: () => (
          <div className="ds-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <BellRing className="h-4 w-4 text-[#005e48]" />
                <p className="text-xs font-bold ds-text-primary">Current Stage Insight</p>
              </div>
              {tips.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowAllTips((v) => !v)}
                  style={{ color: 'var(--ds-primary)' }}
                  className="inline-flex items-center gap-0.5 text-[10px] font-bold"
                >
                  {showAllTips ? 'Collapse' : `All (${tips.length})`}
                  {showAllTips ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              )}
            </div>

            <div className="mt-2 space-y-2">
              {visibleTips.map((tip) => (
                <div key={tip.id} className="ds-card-muted p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold ds-text-primary">{tip.title}</p>
                    <span className="shrink-0 rounded-full bg-[#e5f5de] px-2 py-0.5 text-[9px] font-bold text-[#08261e]">
                      {tip.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-snug ds-text-muted">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: 'benefits-partners',
        title: 'OTP & Partner Perks',
        eyeCue: 'Browse family discounts',
        whyHere: 'Clean perk directory sits below the active insight with scannable OTP badges.',
        render: () => (
          <div className="ds-card">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#005e48]" />
              <p className="text-xs font-bold ds-text-primary">Family & Partner Perks</p>
            </div>
            <div className="mt-2 space-y-1.5">
              {parentPartners.map((p) => (
                <div
                  key={p.id}
                  className="ds-card-muted flex items-start gap-2.5 p-2.5"
                >
                  <span className="text-base leading-none">{p.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="truncate text-xs font-bold ds-text-primary">{p.name}</p>
                      {p.isOtpEcosystem && (
                        <span className="shrink-0 rounded-full bg-[#005e48] px-1.5 py-0.5 text-[9px] font-bold text-white">
                          OTP
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] ds-text-muted">{p.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
    [tips, visibleTips, showAllTips, parentPartners],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="parent-benefits" blocks={blocks} />
    </div>
  );
}
