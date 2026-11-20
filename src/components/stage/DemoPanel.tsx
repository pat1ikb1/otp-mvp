import {
  Award,
  Car,
  Crown,
  Gift,
  GraduationCap,
  History,
  RotateCcw,
  Sparkles,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/engine/config';
import { getAge, getAvailableViews, getStage, getStageMeta } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function DemoPanel() {
  const {
    state,
    hasSavedSession,
    setView,
    sendGift,
    triggerAchievement,
    openDrivingFlow,
    resetDemo,
    restoreSavedSession,
  } = useLifestart();

  const { core, ui } = state;
  const age = getAge(core.monthIndex);
  const stageMeta = getStageMeta(getStage(age));
  const allowedViews = getAvailableViews(age);

  const langUnlocked = core.achievements.find((a) => a.id === 'ach-lang')?.unlockedAtMonth !== null;
  const driveUnlocked = core.achievements.find((a) => a.id === 'ach-drive')?.unlockedAtMonth !== null;

  return (
    <aside className="ds-card flex w-80 shrink-0 flex-col gap-4">
      <div className="flex items-center justify-between border-b border-black/6 pb-3">
        <div>
          <p className="text-[10px] font-bold tracking-wider text-[#38571a] uppercase">
            Demo Controls
          </p>
          <p className="text-xs font-semibold text-[#0b2e26]">{stageMeta.badgeText}</p>
        </div>
        <span className="rounded-full bg-[#e8f5e4] px-3 py-1 text-xs font-extrabold text-[#38571a] tabular-nums">
          Age {age}
        </span>
      </div>

      {/* App Perspective Switcher */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-bold text-[#4a635c]">Active Perspective</p>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            disabled={!allowedViews.includes('parent')}
            onClick={() => setView('parent')}
            style={{ borderRadius: 'var(--ds-btn-radius)' }}
            className={`ds-btn flex items-center justify-center gap-1.5 border px-2.5 py-2 text-xs font-bold transition-all ${
              ui.activeView === 'parent'
                ? 'border-[#38571a] bg-[#38571a] text-white'
                : allowedViews.includes('parent')
                  ? 'border-black/8 bg-[#f2f5f8] text-[#0b2e26] hover:bg-[#e8eef3]'
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
            style={{ borderRadius: 'var(--ds-btn-radius)' }}
            className={`ds-btn flex items-center justify-center gap-1.5 border px-2.5 py-2 text-xs font-bold transition-all ${
              ui.activeView === 'kid' || ui.activeView === 'adult'
                ? 'border-[#38571a] bg-[#38571a] text-white'
                : age >= 7
                  ? 'border-black/8 bg-[#f2f5f8] text-[#0b2e26] hover:bg-[#e8eef3]'
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
                ? 'OTP GO'
                : age >= 18
                  ? `Adult (${core.family.childName})`
                  : `Kid (${age < 7 ? 'at 7y' : core.family.childName})`}
            </span>
          </button>
        </div>
      </div>

      {/* Live Triggers */}
      <div className="space-y-1.5 border-t border-black/6 pt-3">
        <p className="text-[11px] font-bold text-[#4a635c]">Quick Scenarios</p>
        <div className="flex flex-col gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={openDrivingFlow}
            style={{ borderRadius: 'var(--ds-btn-radius)' }}
            className="ds-btn justify-start bg-[#e8f5e4] text-xs font-bold text-[#38571a] hover:bg-[#dbf0d4]"
          >
            <Car className="h-3.5 w-3.5 text-[#52ae30]" />
            Open Driver’s License Hub
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => sendGift('Grandma', 'Birthday Gift', CONFIG.GIFT_AMOUNT)}
            style={{ borderRadius: 'var(--ds-btn-radius)' }}
            className="ds-btn justify-start bg-[#f2f5f8] text-xs font-semibold text-[#0b2e26] hover:bg-[#e8eef3]"
          >
            <Gift className="h-3.5 w-3.5 text-[#52ae30]" />
            Grandma Sends Gift (+15,000 Ft)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            disabled={langUnlocked}
            onClick={() => triggerAchievement('ach-lang')}
            style={{ borderRadius: 'var(--ds-btn-radius)' }}
            className="ds-btn justify-start bg-[#f2f5f8] text-xs font-semibold text-[#0b2e26] hover:bg-[#e8eef3]"
          >
            <Award className="h-3.5 w-3.5 text-[#38571a]" />
            {langUnlocked ? 'Language Exam Unlocked ✓' : 'Pass Language Exam (+20k Skill)'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            disabled={driveUnlocked}
            onClick={() => triggerAchievement('ach-drive')}
            style={{ borderRadius: 'var(--ds-btn-radius)' }}
            className="ds-btn justify-start bg-[#f2f5f8] text-xs font-semibold text-[#0b2e26] hover:bg-[#e8eef3]"
          >
            <Car className="h-3.5 w-3.5 text-[#0d9488]" />
            {driveUnlocked ? 'Driving Licence Unlocked ✓' : 'Complete Driving Cashback (+25k)'}
          </Button>
        </div>
      </div>

      {/* Reset / Restore */}
      <div className="flex flex-col gap-1.5 border-t border-black/6 pt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={resetDemo}
          style={{ borderRadius: 'var(--ds-btn-radius)' }}
          className="ds-btn w-full text-xs font-bold"
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
    </aside>
  );
}
