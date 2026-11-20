import { FastForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { CONFIG } from '@/engine/config';
import { getAge, getStage, getStageMeta } from '@/engine/rules';
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
  const monthsIntoYear = state.core.monthIndex % 12;
  const currentStage = getStage(age);
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 rounded-2xl border border-[#dce5e1] bg-white px-3 py-2 shadow-xs">
      {/* 5 Lifecycle Stage Stops */}
      <div className="grid min-w-[420px] flex-1 grid-cols-5 gap-1.5">
        {STAGES.map((s, idx) => {
          const meta = getStageMeta(s.id);
          const isCurrent = s.id === currentStage;
          const isPast = idx < currentIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpToMonth(s.jumpMonth)}
              className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-left transition-all ${
                isCurrent
                  ? 'bg-[#08261e] text-white shadow-xs'
                  : isPast
                    ? 'bg-[#e5f5de] text-[#08261e] hover:bg-[#d6eec9]'
                    : 'bg-[#f4f7f5] text-[#4a635c] hover:bg-[#ebf3f0]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-[#74bf1e] text-[#08261e]'
                      : isPast
                        ? 'bg-[#005e48] text-white'
                        : 'bg-black/10 text-[#4a635c]'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="text-xs font-bold">{meta.label}</span>
              </div>
              <span
                className={`text-[10px] font-medium tabular-nums ${
                  isCurrent ? 'text-emerald-200' : 'text-[#4a635c]'
                }`}
              >
                {meta.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inline Age Scrubber + Quick Step */}
      <div className="flex items-center gap-2.5 border-l border-black/8 pl-3">
        <div className="w-32 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#08261e] tabular-nums">
            <span>Age {age}</span>
            <span className="text-[#4a635c]">{monthsIntoYear}m</span>
          </div>
          <Slider
            min={0}
            max={25}
            step={1}
            value={[age]}
            aria-label="Scrub child age from 0 to 25"
            onValueChange={(val) => {
              const nextAge = Array.isArray(val) ? val[0] : val;
              jumpToMonth(nextAge * 12);
            }}
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => jumpToMonth(state.core.monthIndex + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-[#dce5e1] bg-[#f9fbfa] px-2 py-1 text-[10px] font-bold text-[#08261e] hover:bg-[#ebf3f0]"
          >
            <FastForward className="h-3 w-3 text-[#005e48]" /> +1m
          </button>
          <button
            type="button"
            onClick={() => jumpToMonth(state.core.monthIndex + 12)}
            className="inline-flex items-center gap-1 rounded-lg border border-[#dce5e1] bg-[#f9fbfa] px-2 py-1 text-[10px] font-bold text-[#08261e] hover:bg-[#ebf3f0]"
          >
            <FastForward className="h-3 w-3 text-[#005e48]" /> +1y
          </button>
        </div>
      </div>
    </div>
  );
}
