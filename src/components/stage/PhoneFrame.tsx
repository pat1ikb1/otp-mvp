import { useEffect, useRef } from 'react';
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

  const viewLabel =
    ui.activeView === 'parent'
      ? `👩 ${core.family.parentName}`
      : age >= 25
        ? `🥇 ${core.family.childName} · GO`
        : age >= 18
          ? `🎓 ${core.family.childName}`
          : `🧒 ${core.family.childName}`;

  return (
    <div
      data-stage-theme={theme}
      className="relative flex h-full max-h-[750px] w-[368px] shrink-0 flex-col overflow-hidden rounded-[42px] border-[7px] border-[#11241f] bg-[var(--stage-surface)] shadow-[0_22px_60px_rgba(11,46,38,0.22)]"
    >
      {/* Top Status Bar + Dynamic Island */}
      <div className="relative z-20 flex shrink-0 items-center justify-between bg-white/90 px-6 pt-2.5 pb-1.5 text-[11px] font-semibold text-[#0b2e26] backdrop-blur-md">
        <span className="tabular-nums">09:41</span>
        <div className="h-5 w-24 rounded-full bg-[#11241f]" />
        <span className="tabular-nums text-[10px] font-bold text-[#00664f]">5G · 98%</span>
      </div>

      {/* App Header */}
      <div
        style={{ background: 'var(--stage-header-bg)' }}
        className="relative z-10 flex shrink-0 items-center justify-between px-4 py-2.5 text-white"
      >
        <div className="flex items-center gap-2">
          <img
            src="/otp-logo.png"
            alt="OTP Bank"
            className="h-7 w-7 rounded-lg bg-white p-0.5 object-contain shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight">OTP Lifestart</span>
              <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase">
                {viewLabel}
              </span>
            </div>
            <p className="text-[10px] text-emerald-100/90">
              {stageMeta.badgeText} · Age {age}
            </p>
          </div>
        </div>
        <span className="rounded-lg bg-white/12 px-2 py-1 text-[10px] font-medium text-emerald-50 tabular-nums">
          Mo {core.monthIndex}
        </span>
      </div>

      {/* Scrollable Screen Body */}
      <div ref={scrollRef} className="phone-scroll relative flex-1 min-h-0 overflow-y-auto px-3.5 py-3">
        {children}
      </div>

      {/* Bottom Navigation */}
      {!takeover && core.account.opened && (
        <BottomNav view={ui.activeView} activeTab={ui.activeTab} onSelectTab={setTab} />
      )}

      {/* Confetti & Floating Toast */}
      <ConfettiBurst triggerKey={ui.confettiKey} />
      <Toast toast={ui.activeToast} onClose={clearToast} />

      {/* In-Phone Takeover Overlay (Onboarding / Age 18 / Age 25) */}
      {takeover && (
        <div
          ref={takeoverRef}
          className="phone-scroll absolute inset-0 z-30 flex flex-col overflow-y-auto bg-[var(--stage-surface)] pt-9"
        >
          {takeover}
        </div>
      )}
    </div>
  );
}
