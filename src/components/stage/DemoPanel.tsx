import {
  Award,
  Car,
  Crown,
  Gift,
  GraduationCap,
  History,
  Paintbrush,
  Play,
  RotateCcw,
  Sparkles,
  User,
} from 'lucide-react';
import { DesignStudioPanel } from '@/components/studio/DesignStudioPanel';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/engine/config';
import { getAge, getAvailableViews, getStage, getStageMeta } from '@/engine/rules';
import { useDesignStudio } from '@/state/designStudio';
import { useLifestart } from '@/state/store';

export function DemoPanel() {
  const {
    state,
    hasSavedSession,
    setView,
    sendGift,
    triggerAchievement,
    resetDemo,
    restoreSavedSession,
  } = useLifestart();

  const { tokens, updateToken } = useDesignStudio();

  const { core, ui } = state;
  const age = getAge(core.monthIndex);
  const stageMeta = getStageMeta(getStage(age));
  const allowedViews = getAvailableViews(age);

  const langUnlocked = core.achievements.find((a) => a.id === 'ach-lang')?.unlockedAtMonth !== null;
  const driveUnlocked = core.achievements.find((a) => a.id === 'ach-drive')?.unlockedAtMonth !== null;

  return (
    <aside className="flex h-[690px] max-h-full w-full max-w-[390px] shrink-0 flex-col gap-3 rounded-2xl border border-[#dce5e1] bg-white p-4 shadow-sm">
      {/* Persistent Perspective Switcher + Mode Toggle */}
      <div className="shrink-0 space-y-2 border-b border-black/6 pb-3">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#eef3f1] p-1">
          <button
            type="button"
            onClick={() => updateToken('rightPanelMode', 'studio')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
              tokens.rightPanelMode === 'studio'
                ? 'bg-[#08261e] text-[#74bf1e] shadow-xs'
                : 'text-[#4a635c] hover:text-[#08261e]'
            }`}
          >
            <Paintbrush className="h-3.5 w-3.5" />
            Design Studio
          </button>
          <button
            type="button"
            onClick={() => updateToken('rightPanelMode', 'guide')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
              tokens.rightPanelMode === 'guide'
                ? 'bg-[#08261e] text-[#74bf1e] shadow-xs'
                : 'text-[#4a635c] hover:text-[#08261e]'
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            Scenarios
          </button>
        </div>

        {/* Always-accessible Perspective Switcher */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            disabled={!allowedViews.includes('parent')}
            onClick={() => setView('parent')}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all ${
              ui.activeView === 'parent'
                ? 'border-[#005e48] bg-[#005e48] text-white'
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
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all ${
              ui.activeView === 'kid' || ui.activeView === 'adult'
                ? 'border-[#005e48] bg-[#005e48] text-white'
                : age >= 7
                  ? 'border-[#dce5e1] bg-white text-[#0b2e26] hover:bg-[#f6f8f7]'
                  : 'cursor-not-allowed border-dashed border-gray-200 bg-gray-50 text-gray-400'
            }`}
          >
            {age >= 25 ? (
              <Crown className="h-3.5 w-3.5" />
            ) : age >= 18 ? (
              <GraduationCap className="h-3.5 w-3.5" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            <span>
              {age >= 25
                ? 'OTP GO (25+)'
                : age >= 18
                  ? `Adult (${core.family.childName})`
                  : `Kid (${age < 7 ? 'at 7y' : core.family.childName})`}
            </span>
          </button>
        </div>
      </div>

      {/* Panel Content */}
      {tokens.rightPanelMode === 'studio' ? (
        <div className="min-h-0 flex-1">
          <DesignStudioPanel />
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-between gap-3 overflow-y-auto">
          <div className="space-y-3">
            {/* Stage Summary */}
            <div className="rounded-xl bg-[#f4f7f5] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-[#005e48] uppercase">
                  Active Stage
                </span>
                <span className="rounded-full bg-[#e5f5de] px-2 py-0.5 text-[10px] font-bold text-[#08261e] tabular-nums">
                  Age {age}
                </span>
              </div>
              <p className="mt-1 text-xs font-bold text-[#08261e]">{stageMeta.badgeText}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-[#4a635c]">
                {stageMeta.description}
              </p>
            </div>

            {/* 3 Quick Demo Triggers */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold tracking-wider text-[#4a635c] uppercase">
                Live Event Triggers
              </p>
              <div className="flex flex-col gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => sendGift('Grandma', 'Birthday Gift', CONFIG.GIFT_AMOUNT)}
                  className="justify-start bg-[#ebf3f0] text-xs font-semibold text-[#0b2e26] hover:bg-[#dcebe5]"
                >
                  <Gift className="h-3.5 w-3.5 text-[#005e48]" />
                  Grandma Sends Gift (+15,000 Ft)
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={langUnlocked}
                  onClick={() => triggerAchievement('ach-lang')}
                  className="justify-start bg-[#ebf3f0] text-xs font-semibold text-[#0b2e26] hover:bg-[#dcebe5]"
                >
                  <Award className="h-3.5 w-3.5 text-[#005e48]" />
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
          </div>

          {/* Session Reset / Restore */}
          <div className="flex flex-col gap-1.5 border-t border-black/6 pt-2.5">
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
                className="w-full text-[11px] text-[#4a635c]"
              >
                <History className="h-3 w-3" /> Restore Last Session
              </Button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
