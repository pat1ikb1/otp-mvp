import { useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  HeartPulse,
  MapPin,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { MoneyFlow } from '@/components/shared/MoneyFlow';
import { Button } from '@/components/ui/button';
import { formatFt } from '@/engine/finance';
import { getAge } from '@/engine/rules';
import { useLifestart } from '@/state/store';

const FEE_MODULES = [
  {
    id: 'skill-drv-kresz',
    title: 'KRESZ & Theory Exam',
    tag: 'Step 1',
    price: 32_000,
    icon: BookOpen,
  },
  {
    id: 'skill-drv-medical',
    title: 'Medical & First Aid',
    tag: 'Step 2',
    price: 18_000,
    icon: HeartPulse,
  },
  {
    id: 'skill-driving',
    title: '10-Hr Driving Pack',
    tag: 'Step 3',
    price: 65_000,
    icon: Car,
  },
] as const;

const INSTRUCTORS = [
  {
    id: 'inst-gabor',
    initials: 'GK',
    name: 'Gábor K.',
    car: 'VW Golf · Auto',
    zone: 'School pickup',
    rating: '4.9',
  },
  {
    id: 'inst-eszter',
    initials: 'EM',
    name: 'Eszter M.',
    car: 'Toyota Yaris Hybrid',
    zone: 'Buda · Calm pace',
    rating: '5.0',
  },
  {
    id: 'inst-daniel',
    initials: 'DT',
    name: 'Dániel T.',
    car: 'Suzuki Swift · Manual',
    zone: 'Weekend slots',
    rating: '4.8',
  },
] as const;

const DRIVE_SLOTS = ['Tue 16:00', 'Thu 17:00', 'Sat 10:00', 'Sun 11:00'] as const;

const ROAD_STEPS = [
  { label: 'Fees', icon: BookOpen },
  { label: 'Driver', icon: UserCheck },
  { label: 'Drives', icon: Calendar },
  { label: 'License', icon: Award },
] as const;

export function DrivingLicenseHub() {
  const {
    state,
    drivingFlow,
    paySkillMerchant,
    selectDrivingInstructor,
    toggleDrivingSlot,
    logPracticeDrive,
    setDrivingStep,
    triggerAchievement,
  } = useLifestart();

  const { core } = state;
  const age = getAge(core.monthIndex);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const paidNames = new Set(core.account.skillWallet.spent.map((s) => s.merchant));
  const kreszPaid = paidNames.has('KRESZ & Theory Exam');
  const medicalPaid = paidNames.has('Medical & First Aid');
  const drivingPaid =
    paidNames.has('Practical Driving Package') || paidNames.has('City Driving Academy');
  const paidFlags = [kreszPaid, medicalPaid, drivingPaid];
  const paidCount = paidFlags.filter(Boolean).length;
  const driveUnlocked = core.achievements.find((a) => a.id === 'ach-drive')?.unlockedAtMonth !== null;

  const selectedInstructor = INSTRUCTORS.find((i) => i.id === drivingFlow.instructorId) ?? null;
  const progressPct = Math.round(
    ((paidCount > 0 ? 1 : 0) +
      (selectedInstructor ? 1 : 0) +
      (drivingFlow.practiceHours >= 30 ? 1 : drivingFlow.practiceHours > 0 ? 0.5 : 0) +
      (driveUnlocked ? 1 : 0)) /
      4 *
      100,
  );

  const handlePayModule = (id: string) => {
    if (age < 15) {
      setApprovingId(id);
      window.setTimeout(() => {
        setApprovingId(null);
        paySkillMerchant(id);
      }, 750);
    } else {
      paySkillMerchant(id);
    }
  };

  return (
    <div className="flex flex-col" style={{ gap: 'var(--ds-block-gap)' }}>
      {/* Road Map Visual Cue Card */}
      <div className="ds-card space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="otp-action-circle-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Car className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-extrabold ds-text-primary">Driver’s License</p>
                <span className="otp-tag-new px-1.5 py-0.5 text-[9px] font-bold">7% fee</span>
              </div>
              <p className="text-[11px] ds-text-muted">
                Wallet: <span className="font-bold ds-text-primary"><MoneyFlow value={core.account.skillWallet.balance} /></span>
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[#e8f5e4] px-2.5 py-1 text-[10px] font-bold text-[#38571a] tabular-nums">
            {progressPct}%
          </span>
        </div>

        {/* Visual Road Stepper */}
        <div className="relative pt-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e4e9f0]">
            <div
              style={{ width: `${Math.max(12, ((drivingFlow.activeStep + 1) / 4) * 100)}%` }}
              className="h-full rounded-full bg-[#52ae30] transition-all duration-300"
            />
          </div>
          <div className="mt-2.5 grid grid-cols-4 gap-1">
            {ROAD_STEPS.map((st, idx) => {
              const Icon = st.icon;
              const active = drivingFlow.activeStep === idx;
              const done =
                (idx === 0 && paidCount > 0) ||
                (idx === 1 && Boolean(selectedInstructor)) ||
                (idx === 2 && drivingFlow.practiceHours >= 30) ||
                (idx === 3 && driveUnlocked);
              return (
                <button
                  key={st.label}
                  type="button"
                  onClick={() => setDrivingStep(idx)}
                  className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-bold transition-colors ${
                    active
                      ? 'bg-[#e8f5e4] text-[#38571a]'
                      : 'text-[#4a635c] hover:bg-[#f2f5f8]'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                      active
                        ? 'bg-[#52ae30] text-white otp-cue-ring'
                        : done
                          ? 'bg-[#38571a] text-white'
                          : 'bg-[#e4e9f0] text-[#4a635c]'
                    }`}
                  >
                    {done && !active ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                  </span>
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step 1: Pay License Fees */}
      {drivingFlow.activeStep === 0 && (
        <div className="ds-card space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold ds-text-primary">1 · License Fees</p>
            <span className="rounded-full bg-[#e8f5e4] px-2 py-0.5 text-[10px] font-bold text-[#38571a]">
              {age < 15 ? 'Parent approves' : 'Direct Pay'}
            </span>
          </div>

          <div className="space-y-2">
            {FEE_MODULES.map((mod, idx) => {
              const Icon = mod.icon;
              const paid = paidFlags[idx];
              const isApproving = approvingId === mod.id;
              const canAfford = core.account.skillWallet.balance >= mod.price;

              return (
                <div
                  key={mod.id}
                  className="ds-card-muted flex items-center justify-between gap-2 px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#52ae30] shadow-xs">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold ds-text-primary">{mod.title}</p>
                      <p className="text-[10px] font-semibold ds-text-muted tabular-nums">
                        {formatFt(mod.price)}
                      </p>
                    </div>
                  </div>

                  {paid ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#e8f5e4] px-2.5 py-1 text-[10px] font-bold text-[#38571a]">
                      <CheckCircle2 className="h-3 w-3 text-[#52ae30]" /> Paid
                    </span>
                  ) : (
                    <Button
                      size="xs"
                      disabled={!canAfford || isApproving}
                      onClick={() => handlePayModule(mod.id)}
                      style={{ borderRadius: 'var(--ds-btn-radius)' }}
                      className="ds-btn shrink-0 bg-[#38571a] px-3 text-[10px] font-bold text-white hover:bg-[#2c4614]"
                    >
                      {isApproving ? 'Asking…' : 'Pay'}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setDrivingStep(1)}
            className="flex w-full items-center justify-between rounded-xl bg-[#e8f5e4] px-3 py-2 text-xs font-bold text-[#38571a] hover:bg-[#dbf0d4]"
          >
            <span>Next: Connect with a Driver</span>
            <ChevronRight className="h-4 w-4 text-[#52ae30]" />
          </button>
        </div>
      )}

      {/* Step 2: Connect to Instructor */}
      {drivingFlow.activeStep === 1 && (
        <div className="ds-card space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold ds-text-primary">2 · Pick Your Driver</p>
            <span className="otp-tag-new px-2 py-0.5 text-[10px] font-bold">Verified</span>
          </div>

          <div className="space-y-2">
            {INSTRUCTORS.map((inst) => {
              const selected = drivingFlow.instructorId === inst.id;
              return (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => selectDrivingInstructor(inst.id)}
                  className={`flex w-full items-center justify-between gap-2.5 rounded-2xl border p-2.5 text-left transition-all ${
                    selected
                      ? 'border-[#52ae30] bg-[#e8f5e4]'
                      : 'border-transparent bg-[#f2f5f8] hover:bg-[#e9eff4]'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b4d6b6] text-xs font-extrabold text-[#163117]">
                      {inst.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold ds-text-primary">
                        {inst.name} · ★ {inst.rating}
                      </p>
                      <p className="flex items-center gap-1 truncate text-[10px] ds-text-muted">
                        <MapPin className="h-2.5 w-2.5 text-[#52ae30]" />
                        {inst.car} · {inst.zone}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      selected
                        ? 'bg-[#52ae30] text-white'
                        : 'bg-white text-[#38571a] shadow-xs'
                    }`}
                  >
                    {selected ? 'Matched ✓' : 'Connect'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Organize Drives & Track 30h */}
      {drivingFlow.activeStep === 2 && (
        <div className="ds-card space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold ds-text-primary">3 · Organize Drives</p>
            <span className="text-[11px] font-extrabold text-[#38571a] tabular-nums">
              {drivingFlow.practiceHours} / 30 hrs
            </span>
          </div>

          {/* Visual Car-on-Road Progress */}
          <div className="rounded-xl bg-[#f2f5f8] p-2.5">
            <div className="relative h-2 w-full rounded-full bg-[#dce4ec]">
              <div
                style={{ width: `${Math.round((drivingFlow.practiceHours / 30) * 100)}%` }}
                className="h-full rounded-full bg-[#52ae30] transition-all duration-300"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-semibold ds-text-muted">
              <span className="inline-flex items-center gap-1">
                <Car className="h-3.5 w-3.5 text-[#52ae30]" />
                {selectedInstructor ? `With ${selectedInstructor.name}` : 'Ready to drive'}
              </span>
              <Button
                size="xs"
                disabled={drivingFlow.practiceHours >= 30}
                onClick={() => logPracticeDrive(5)}
                style={{ borderRadius: 'var(--ds-btn-radius)' }}
                className="ds-btn bg-[#52ae30] px-2.5 text-[10px] font-bold text-white hover:bg-[#469828]"
              >
                +5h Drive
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold ds-text-muted uppercase">
              <Clock className="h-3 w-3 text-[#52ae30]" /> Tap weekly slots
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {DRIVE_SLOTS.map((slot) => {
                const booked = drivingFlow.bookedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleDrivingSlot(slot)}
                    style={{ borderRadius: 'var(--ds-btn-radius)' }}
                    className={`ds-btn border px-2.5 py-1.5 text-[11px] font-bold transition-colors ${
                      booked
                        ? 'border-[#52ae30] bg-[#52ae30] text-white'
                        : 'border-black/8 bg-[#f2f5f8] text-[#0b2e26] hover:bg-[#e8eef3]'
                    }`}
                  >
                    {booked ? `${slot} ✓` : slot}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDrivingStep(3)}
            className="flex w-full items-center justify-between rounded-xl bg-[#e8f5e4] px-3 py-2 text-xs font-bold text-[#38571a]"
          >
            <span>Next: Final Exam & Reward</span>
            <ChevronRight className="h-4 w-4 text-[#52ae30]" />
          </button>
        </div>
      )}

      {/* Step 4: Exam & +25,000 Ft Cashback */}
      {drivingFlow.activeStep === 3 && (
        <div className="ds-card space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold ds-text-primary">4 · Exam & Reward</p>
            <span className="rounded-full bg-[#e8f5e4] px-2 py-0.5 text-[10px] font-bold text-[#38571a]">
              +25,000 Ft
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
            <div className="ds-card-muted p-2">
              <p className="font-bold ds-text-primary">{paidCount}/3</p>
              <p className="ds-text-muted">Fees paid</p>
            </div>
            <div className="ds-card-muted p-2">
              <p className="font-bold ds-text-primary">{selectedInstructor ? 'Ready' : 'Pick 1'}</p>
              <p className="ds-text-muted">Driver</p>
            </div>
            <div className="ds-card-muted p-2">
              <p className="font-bold ds-text-primary">{drivingFlow.practiceHours}h</p>
              <p className="ds-text-muted">Driven</p>
            </div>
          </div>

          {driveUnlocked ? (
            <div className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#e8f5e4] p-3 text-xs font-extrabold text-[#38571a]">
              <Sparkles className="h-4 w-4 text-[#52ae30]" />
              License Complete · +25,000 Ft Credited!
            </div>
          ) : (
            <Button
              size="lg"
              onClick={() => triggerAchievement('ach-drive')}
              style={{ borderRadius: 'var(--ds-btn-radius)' }}
              className="ds-btn h-10 w-full bg-[#38571a] text-xs font-bold text-white hover:bg-[#2c4614]"
            >
              <Award className="h-4 w-4 text-[#74bf1e]" />
              Pass Exam & Claim +25,000 Ft
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
