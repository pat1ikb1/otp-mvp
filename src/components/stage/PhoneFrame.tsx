import { useEffect, useRef } from 'react';
import { Crown, GraduationCap, Sparkles, UserCheck } from 'lucide-react';
import { EyeFlowHud, EyeFlowOverlay } from '@/components/guidance/EyeFlowOverlay';
import { BottomNav } from '@/components/shared/BottomNav';
import { ConfettiBurst } from '@/components/shared/ConfettiBurst';
import { Toast } from '@/components/shared/Toast';
import { getAge, getStage, getStageMeta, getStageTheme } from '@/engine/rules';
import { useDesignStudio } from '@/state/designStudio';
import { useLifestart } from '@/state/store';

export function PhoneFrame({
  children,
  takeover,
}: {
  children: React.ReactNode;
  takeover?: React.ReactNode;
}) {
  const { state, setTab, clearToast } = useLifestart();
  const { cssVariables } = useDesignStudio();
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
      style={cssVariables as React.CSSProperties}
      className="ds-phone-shell relative flex h-[690px] max-h-full w-[372px] shrink-0 flex-col overflow-hidden border-[7px] border-[#0e201b] shadow-[0_24px_64px_rgba(8,38,30,0.22)]"
    >
      {/* Top Status Bar + Dynamic Island */}
      <div
        style={{ backgroundColor: 'var(--ds-card-bg)', color: 'var(--ds-text-primary)' }}
        className="relative z-40 flex shrink-0 items-center justify-between px-6 pt-2.5 pb-1.5 text-[11px] font-semibold"
      >
        <span className="tabular-nums">09:41</span>
        <div className="h-5 w-24 rounded-full bg-[#0e201b]" />
        <span style={{ color: 'var(--ds-primary)' }} className="tabular-nums text-[10px] font-bold">
          5G · 98%
        </span>
      </div>

      {/* App Header */}
      <div
        style={{
          backgroundColor: 'var(--ds-header-bg)',
          color: 'var(--ds-header-fg)',
        }}
        className="relative z-20 flex shrink-0 items-center justify-between px-4 py-2.5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <img
            src="/otp-logo.png"
            alt="OTP Bank"
            className="h-7 w-7 rounded-lg bg-white object-contain p-0.5 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight">OTP Lifestart</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase">
                <ViewIcon className="h-2.5 w-2.5 text-[#74bf1e]" />
                {viewLabel}
              </span>
            </div>
            <p className="text-[10px] opacity-80">
              {stageMeta.badgeText} · Age {age}
            </p>
          </div>
        </div>
        <span className="rounded-lg bg-white/12 px-2 py-1 text-[10px] font-semibold tabular-nums">
          Mo {core.monthIndex}
        </span>
      </div>

      {/* Live Eye-Flow Step Ribbon */}
      <EyeFlowHud />

      {/* Scrollable Screen Body + Eye-Flow Vector Overlay */}
      <div className="relative flex min-h-0 flex-1 flex-col">
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
            style={{
              backgroundColor: 'var(--ds-surface-bg)',
              padding: 'var(--ds-screen-padding)',
            }}
            className="phone-scroll ds-phone-content-scale absolute inset-0 z-20 flex flex-col overflow-y-auto"
          >
            {takeover}
          </div>
        )}

        <EyeFlowOverlay scrollContainerRef={takeover ? takeoverRef : scrollRef} />
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
