import {
  Award,
  Car,
  FastForward,
  Gift,
  History,
  RotateCcw,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CONFIG } from '@/engine/config';
import { getAge, getAvailableViews, getStage, getStageMeta } from '@/engine/rules';
import { useLifestart } from '@/state/store';

const STAGE_STOPS = [
  { age: 0, label: '0', month: 0 },
  { age: 7, label: '7', month: CONFIG.MONTH_AGE_7 },
  { age: 15, label: '15', month: CONFIG.MONTH_AGE_15 },
  { age: 18, label: '18', month: CONFIG.MONTH_AGE_18 },
  { age: 25, label: '25', month: CONFIG.MONTH_AGE_25 },
];

export function DemoPanel() {
  const {
    state,
    hasSavedSession,
    jumpToMonth,
    setView,
    sendGift,
    triggerAchievement,
    resetDemo,
    restoreSavedSession,
  } = useLifestart();

  const { core, ui } = state;
  const age = getAge(core.monthIndex);
  const monthsIntoYear = core.monthIndex % 12;
  const stageMeta = getStageMeta(getStage(age));
  const allowedViews = getAvailableViews(age);

  const langUnlocked = core.achievements.find((a) => a.id === 'ach-lang')?.unlockedAtMonth !== null;
  const driveUnlocked = core.achievements.find((a) => a.id === 'ach-drive')?.unlockedAtMonth !== null;

  return (
    <aside className="flex w-80 shrink-0 flex-col gap-3 rounded-2xl border border-[#dce5e1] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-[#00664f] uppercase">
            Demo Time Machine
          </p>
          <p className="text-xs text-[#4c665f]">{stageMeta.badgeText}</p>
        </div>
        <div className="rounded-xl bg-[#ebf3f0] px-3 py-1 text-right">
          <p className="text-base font-extrabold text-[#0b2e26] tabular-nums">
            Age {age}
          </p>
          <p className="text-[10px] text-[#4c665f] tabular-nums">
            {monthsIntoYear} mo · ({core.monthIndex}m)
          </p>
        </div>
      </div>

      {/* Age Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-[#0b2e26]">
          <span>Scrub Age (0 ↔ 25)</span>
        </div>
        <Slider
          min={0}
          max={25}
          step={1}
          value={[age]}
          onValueChange={(val) => {
            const nextAge = Array.isArray(val) ? val[0] : val;
            jumpToMonth(nextAge * 12);
          }}
        />
        <div className="grid grid-cols-5 gap-1 pt-0.5">
          {STAGE_STOPS.map((stop) => {
            const active = age === stop.age;
            return (
              <button
                key={stop.age}
                type="button"
                onClick={() => jumpToMonth(stop.month)}
                className={`rounded-lg py-1 text-xs font-semibold tabular-nums transition-all ${
                  active
                    ? 'bg-[#00664f] text-white shadow-xs'
                    : 'bg-[#f1f5f3] text-[#0b2e26] hover:bg-[#e1ece7]'
                }`}
              >
                {stop.label}y
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => jumpToMonth(core.monthIndex + 1)}
            className="text-xs"
          >
            <FastForward className="h-3 w-3" /> +1 Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => jumpToMonth(core.monthIndex + 12)}
            className="text-xs"
          >
            <FastForward className="h-3 w-3" /> +1 Year
          </Button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="space-y-1.5 border-t border-black/5 pt-2.5">
        <p className="text-xs font-medium text-[#0b2e26]">Active App Perspective</p>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            disabled={!allowedViews.includes('parent')}
            onClick={() => setView('parent')}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-semibold transition-all ${
              ui.activeView === 'parent'
                ? 'border-[#00664f] bg-[#00664f] text-white'
                : allowedViews.includes('parent')
                  ? 'border-[#dce5e1] bg-white text-[#0b2e26] hover:bg-[#f6f8f7]'
                  : 'cursor-not-allowed border-dashed border-gray-200 bg-gray-50 text-gray-400'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Parent ({core.family.parentName})
          </button>

          <button
            type="button"
            disabled={age < 7}
            onClick={() => setView(age >= 18 ? 'adult' : 'kid')}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-semibold transition-all ${
              ui.activeView === 'kid' || ui.activeView === 'adult'
                ? 'border-[#00664f] bg-[#00664f] text-white'
                : age >= 7
                  ? 'border-[#dce5e1] bg-white text-[#0b2e26] hover:bg-[#f6f8f7]'
                  : 'cursor-not-allowed border-dashed border-gray-200 bg-gray-50 text-gray-400'
            }`}
          >
            {age >= 25
              ? `🥇 OTP GO`
              : age >= 18
                ? `🎓 Adult (${core.family.childName})`
                : `🧒 Kid (${age < 7 ? 'at 7y' : core.family.childName})`}
          </button>
        </div>
      </div>

      {/* 3 Quick Demo Triggers */}
      <div className="space-y-1.5 border-t border-black/5 pt-2.5">
        <p className="text-xs font-medium text-[#0b2e26]">Quick Live Triggers</p>
        <div className="flex flex-col gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => sendGift('Grandma', 'Birthday Gift', CONFIG.GIFT_AMOUNT)}
            className="justify-start bg-[#ebf3f0] text-xs font-semibold text-[#0b2e26] hover:bg-[#dcebe5]"
          >
            <Gift className="h-3.5 w-3.5 text-[#52ae30]" />
            Grandma Sends Gift (+15,000 Ft)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            disabled={langUnlocked}
            onClick={() => triggerAchievement('ach-lang')}
            className="justify-start bg-[#ebf3f0] text-xs font-semibold text-[#0b2e26] hover:bg-[#dcebe5]"
          >
            <Award className="h-3.5 w-3.5 text-[#00664f]" />
            {langUnlocked ? 'Language Exam Unlocked ✓' : 'Pass Language Exam (+20k Skill)'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            disabled={driveUnlocked}
            onClick={() => triggerAchievement('ach-drive')}
            className="justify-start bg-[#ebf3f0] text-xs font-semibold text-[#0b2e26] hover:bg-[#dcebe5]"
          >
            <Car className="h-3.5 w-3.5 text-[#0d9488]" />
            {driveUnlocked ? 'Driving Licence Unlocked ✓' : 'Driving Licence (+25k Skill)'}
          </Button>
        </div>
      </div>

      {/* Session Reset / Restore */}
      <div className="flex flex-col gap-1.5 border-t border-black/5 pt-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={resetDemo}
          className="w-full text-xs font-semibold"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Demo to Age 0
        </Button>
        {hasSavedSession && (
          <Button
            variant="ghost"
            size="xs"
            onClick={restoreSavedSession}
            className="w-full text-[11px] text-[#4c665f]"
          >
            <History className="h-3 w-3" /> Restore Last Session
          </Button>
        )}
      </div>
    </aside>
  );
}
