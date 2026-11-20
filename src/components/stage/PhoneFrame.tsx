import { useEffect, useRef } from 'react';
import { Crown, GraduationCap, Sparkles, UserCheck } from 'lucide-react';
import { BottomNav } from '@/components/shared/BottomNav';
import { ConfettiBurst } from '@/components/shared/ConfettiBurst';
import { Toast } from '@/components/shared/Toast';
import { getAge, getStage, getStageMeta, getStageTheme } from '@/engine/rules';
import { useLifestart } from '@/state/store';

export function PhoneFrame({
  children,
  takeover,
}: {
  children: React.ReactNode;
  takeover?: React.ReactNode;
}) {
  const { state, setTab, clearToast } = useLifestart();
  const { core, ui } = state;
  const scrollRef = useRef<HTMLDivElement>(null);
  const takeoverRef = useRef<HTMLDivElement>(null);
  const age = getAge(core.monthIndex);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (takeoverRef.current) takeoverRef.current.scrollTop = 0;
  }, [ui.activeView, ui.activeTab, core.monthIndex, Boolean(takeover)]);

  const stage = getStage(age);
  const stageMeta = getStageMeta(stage);
  const theme = getStageTheme(ui.activeView, age);

  const ViewIcon =
    ui.activeView === 'parent'
      ? UserCheck
      : age >= 25
        ? Crown
        : age >= 18
          ? GraduationCap
          : Sparkles;

  const viewLabel =
    ui.activeView === 'parent'
      ? core.family.parentName
      : age >= 25
        ? `${core.family.childName} · GO`
        : core.family.childName;

  return (
    <div
      data-stage-theme={theme}
      className="ds-phone-shell relative flex h-[700px] max-h-full w-[372px] shrink-0 flex-col overflow-hidden border-[7px] border-[#111820] shadow-[0_24px_60px_rgba(18,34,52,0.18)]"
    >
      {/* Top Status Bar + Dynamic Island */}
      <div className="relative z-40 flex shrink-0 items-center justify-between bg-[#f2f5f8] px-6 pt-2.5 pb-1.5 text-[11px] font-semibold text-[#0b2e26]">
        <span className="tabular-nums">09:41</span>
        <div className="h-5 w-24 rounded-full bg-[#111820]" />
        <span className="tabular-nums text-[10px] font-bold text-[#38571a]">5G · 98%</span>
      </div>

      {/* OTP MobilBank Clean Off-White Header (No Gradient) */}
      <div className="relative z-20 flex shrink-0 items-center justify-between border-b border-black/5 bg-[#f2f5f8] px-4 py-2.5 text-[#0b2e26]">
        <div className="flex items-center gap-2">
          <img
            src="/otp-logo.png"
            alt="OTP Bank"
            className="h-7 w-7 rounded-lg bg-white object-contain p-0.5 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold tracking-tight text-[#0b2e26]">
                OTP Lifestart
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5e4] px-2 py-0.5 text-[9px] font-bold tracking-wide text-[#38571a] uppercase">
                <ViewIcon className="h-2.5 w-2.5 text-[#52ae30]" />
                {viewLabel}
              </span>
            </div>
            <p className="text-[10px] font-medium text-[#4a635c]">
              {stageMeta.badgeText} · Age {age}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#38571a] shadow-xs tabular-nums">
          Mo {core.monthIndex}
        </span>
      </div>

      {/* Scrollable Screen Body */}
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#f2f5f8]">
        <div
          ref={scrollRef}
          style={{ padding: 'var(--ds-screen-padding)' }}
          className="phone-scroll ds-phone-content-scale relative flex-1 min-h-0 overflow-y-auto"
        >
          {children}
        </div>

        {/* In-Phone Takeover Overlay (Onboarding / Age 18 / Age 25) */}
        {takeover && (
          <div
            ref={takeoverRef}
            style={{ padding: 'var(--ds-screen-padding)' }}
            className="phone-scroll ds-phone-content-scale absolute inset-0 z-20 flex flex-col overflow-y-auto bg-[#f2f5f8]"
          >
            {takeover}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      {!takeover && core.account.opened && (
        <BottomNav view={ui.activeView} activeTab={ui.activeTab} onSelectTab={setTab} />
      )}

      {/* Confetti & Floating Toast */}
      <ConfettiBurst triggerKey={ui.confettiKey} />
      <Toast toast={ui.activeToast} onClose={clearToast} />
    </div>
  );
}
