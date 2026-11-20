import { Compass, Eye, GitBranch, Move, Sparkles } from 'lucide-react';
import { DemoPanel } from '@/components/stage/DemoPanel';
import { PhoneFrame } from '@/components/stage/PhoneFrame';
import { StageTimeline } from '@/components/stage/StageTimeline';
import { getAge } from '@/engine/rules';
import { AdultAdvisor } from '@/screens/adult/AdultAdvisor';
import { AdultHome } from '@/screens/adult/AdultHome';
import { AdultSkills } from '@/screens/adult/AdultSkills';
import { AdultValueGo } from '@/screens/adult/AdultValueGo';
import { Handover18 } from '@/screens/adult/Handover18';
import { OtpGo25Takeover } from '@/screens/adult/OtpGo25Takeover';
import { KidHome } from '@/screens/kid/KidHome';
import { KidMilestones } from '@/screens/kid/KidMilestones';
import { KidPiggyBank } from '@/screens/kid/KidPiggyBank';
import { KidSkillWallet } from '@/screens/kid/KidSkillWallet';
import { OnboardingFlow } from '@/screens/parent/OnboardingFlow';
import { ParentBenefits } from '@/screens/parent/ParentBenefits';
import { ParentGifting } from '@/screens/parent/ParentGifting';
import { ParentHome } from '@/screens/parent/ParentHome';
import { ParentPockets } from '@/screens/parent/ParentPockets';
import {
  DesignStudioProvider,
  useDesignStudio,
  type EyeGuidanceMode,
} from '@/state/designStudio';
import { LifestartProvider, useLifestart } from '@/state/store';

function StageViewport() {
  const { state } = useLifestart();
  const { tokens, updateToken } = useDesignStudio();
  const { core, ui } = state;
  const age = getAge(core.monthIndex);

  let takeover: React.ReactNode = null;
  if (!core.account.opened) {
    takeover = <OnboardingFlow />;
  } else if (age >= 25 && !core.goWelcomeSeen) {
    takeover = <OtpGo25Takeover />;
  } else if (age >= 18 && age < 25 && !core.handoverAccepted) {
    takeover = <Handover18 />;
  }

  const renderScreen = () => {
    if (ui.activeView === 'parent') {
      switch (ui.activeTab) {
        case 'pockets':
          return <ParentPockets />;
        case 'gifting':
          return <ParentGifting />;
        case 'benefits':
          return <ParentBenefits />;
        default:
          return <ParentHome />;
      }
    }
    if (ui.activeView === 'kid') {
      switch (ui.activeTab) {
        case 'piggy':
          return <KidPiggyBank />;
        case 'skills':
          return <KidSkillWallet />;
        case 'milestones':
          return <KidMilestones />;
        default:
          return <KidHome />;
      }
    }
    switch (ui.activeTab) {
      case 'skills':
        return <AdultSkills />;
      case 'value':
        return <AdultValueGo />;
      case 'advisor':
        return <AdultAdvisor />;
      default:
        return <AdultHome />;
    }
  };

  return (
    <div className="flex min-h-screen w-screen flex-col justify-between bg-[#f4f7f5] px-5 py-3 lg:h-screen lg:overflow-hidden">
      {/* Unified Studio & Eye-Flow Toolbar */}
      <header className="mx-auto flex w-full max-w-6xl shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <img
            src="/otp-logo.png"
            alt="OTP Bank"
            className="h-7 w-7 rounded-lg bg-white object-contain p-0.5 shadow-xs"
          />
          <span className="text-sm font-extrabold tracking-tight text-[#08261e]">
            OTP Lifestart
          </span>
          <span className="hidden items-center gap-1 rounded-full bg-[#e5f5de] px-2 py-0.5 text-[10px] font-bold text-[#08261e] sm:inline-flex">
            <GitBranch className="h-3 w-3 text-[#005e48]" />
            redesign/guided-ui-studio
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Eye-Flow Mode Selector */}
          <div
            role="group"
            aria-label="Visual eye-guidance mode"
            className="flex items-center gap-0.5 rounded-full border border-[#dce5e1] bg-white p-0.5 shadow-xs"
          >
            <span className="hidden items-center gap-1 pl-2 pr-1 text-[10px] font-bold text-[#4a635c] md:inline-flex">
              <Eye className="h-3 w-3 text-[#005e48]" /> Eye Guide:
            </span>
            {(
              [
                { id: 'beacons', label: 'Beacons ①②③' },
                { id: 'vectors', label: 'Gaze Vectors' },
                { id: 'spotlight', label: 'Spotlight' },
                { id: 'off', label: 'Off' },
              ] as Array<{ id: EyeGuidanceMode; label: string }>
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => updateToken('eyeMode', mode.id)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors ${
                  tokens.eyeMode === mode.id
                    ? 'bg-[#08261e] text-[#74bf1e]'
                    : 'text-[#4a635c] hover:text-[#08261e]'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Quick Arrange Blocks Toggle */}
          <button
            type="button"
            onClick={() => updateToken('studioEditMode', !tokens.studioEditMode)}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors ${
              tokens.studioEditMode
                ? 'border-[#08261e] bg-[#08261e] text-[#74bf1e]'
                : 'border-[#dce5e1] bg-white text-[#08261e] hover:bg-[#ebf3f0]'
            }`}
          >
            <Move className="h-3 w-3" />
            {tokens.studioEditMode ? 'Done Moving' : 'Move Blocks'}
          </button>

          {/* Quick Copy Density Switch */}
          <button
            type="button"
            onClick={() =>
              updateToken(
                'copyDensity',
                tokens.copyDensity === 'concise' ? 'detailed' : 'concise',
              )
            }
            className="inline-flex items-center gap-1 rounded-full border border-[#dce5e1] bg-white px-2.5 py-1 text-[10px] font-bold text-[#08261e] hover:bg-[#ebf3f0]"
            title="Toggle concise vs detailed UI text"
          >
            {tokens.copyDensity === 'concise' ? (
              <Sparkles className="h-3 w-3 text-[#005e48]" />
            ) : (
              <Compass className="h-3 w-3 text-[#005e48]" />
            )}
            <span>{tokens.copyDensity === 'concise' ? 'Zen Text' : 'Full Text'}</span>
          </button>
        </div>
      </header>

      {/* Main Centered Stage: Interactive Phone + Design Studio */}
      <main className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col items-center justify-center gap-6 py-2 lg:flex-row">
        <PhoneFrame takeover={takeover}>{renderScreen()}</PhoneFrame>
        <DemoPanel />
      </main>

      {/* Unified Bottom 5-Stage Lifecycle & Age Scrubber */}
      <footer className="shrink-0">
        <StageTimeline />
      </footer>
    </div>
  );
}

export function App() {
  return (
    <DesignStudioProvider>
      <LifestartProvider>
        <StageViewport />
      </LifestartProvider>
    </DesignStudioProvider>
  );
}

export default App;
