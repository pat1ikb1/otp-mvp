import { getAge, getStage, getStageMeta } from '@/engine/rules';
import { CONFIG } from '@/engine/config';
import { useLifestart } from '@/state/store';
import type { LifeStageId } from '@/types/lifestart';

const STAGES: Array<{ id: LifeStageId; jumpMonth: number }> = [
  { id: 'seed', jumpMonth: 0 },
  { id: 'learn', jumpMonth: CONFIG.MONTH_AGE_7 },
  { id: 'grow', jumpMonth: CONFIG.MONTH_AGE_15 },
  { id: 'launch', jumpMonth: CONFIG.MONTH_AGE_18 },
  { id: 'go', jumpMonth: CONFIG.MONTH_AGE_25 },
];

export function StageTimeline() {
  const { state, jumpToMonth } = useLifestart();
  const age = getAge(state.core.monthIndex);
  const currentStage = getStage(age);
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className="mx-auto flex w-full max-w-4xl items-center gap-1.5 rounded-2xl border border-[#dce5e1] bg-white px-3 py-2 shadow-xs">
      {STAGES.map((s, idx) => {
        const meta = getStageMeta(s.id);
        const isCurrent = s.id === currentStage;
        const isPast = idx < currentIndex;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => jumpToMonth(s.jumpMonth)}
            className={`flex flex-1 items-center justify-between rounded-xl px-2.5 py-1.5 text-left transition-all ${
              isCurrent
                ? 'bg-[#00664f] text-white shadow-xs'
                : isPast
                  ? 'bg-[#e5f5de] text-[#0b2e26] hover:bg-[#d8efc9]'
                  : 'bg-[#f6f8f7] text-[#5b736c] hover:bg-[#ebf3f0]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                  isCurrent
                    ? 'bg-[#52ae30] text-white'
                    : isPast
                      ? 'bg-[#00664f] text-white'
                      : 'bg-black/10 text-[#4c665f]'
                }`}
              >
                {idx + 1}
              </span>
              <span className="text-xs font-bold">{meta.label}</span>
            </div>
            <span
              className={`text-[10px] font-medium tabular-nums ${
                isCurrent ? 'text-emerald-100' : 'text-[#4c665f]'
              }`}
            >
              {meta.shortLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
