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
import { LifestartProvider, useLifestart } from '@/state/store';

function StageViewport() {
  const { state } = useLifestart();
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
    <div className="flex min-h-screen w-screen flex-col justify-between bg-[#f2f5f8] px-6 py-3 lg:h-screen lg:overflow-hidden">
      {/* Compact Brand Header */}
      <header className="mx-auto flex w-full max-w-5xl shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/otp-logo.png"
            alt="OTP Bank"
            className="h-7 w-7 rounded-lg bg-white object-contain p-0.5 shadow-xs"
          />
          <span className="text-sm font-extrabold tracking-tight text-[#0b2e26]">
            OTP Lifestart
          </span>
          <span className="text-xs font-medium text-[#4a635c]">· 0 → 25 Prototype</span>
        </div>
      </header>

      {/* Centered Stage: Final Phone Interface + Demo Triggers */}
      <main className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col items-center justify-center gap-7 py-2 lg:flex-row">
        <PhoneFrame takeover={takeover}>{renderScreen()}</PhoneFrame>
        <DemoPanel />
      </main>

      {/* Unified 5-Stage Timeline */}
      <footer className="shrink-0">
        <StageTimeline />
      </footer>
    </div>
  );
}

export function App() {
  return (
    <LifestartProvider>
      <StageViewport />
    </LifestartProvider>
  );
}

export default App;
