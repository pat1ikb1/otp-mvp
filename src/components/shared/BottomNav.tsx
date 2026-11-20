import {
  Award,
  Gift,
  GraduationCap,
  Home,
  MessageSquareHeart,
  PiggyBank,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import type { AppView } from '@/types/lifestart';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_MAP: Record<AppView, NavItem[]> = {
  parent: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'pockets', label: 'Pockets', icon: Wallet },
    { id: 'gifting', label: 'Gifting', icon: Gift },
    { id: 'benefits', label: 'Perks', icon: Sparkles },
  ],
  kid: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'piggy', label: 'Persely', icon: PiggyBank },
    { id: 'skills', label: 'Skills', icon: GraduationCap },
    { id: 'milestones', label: 'Quests', icon: Award },
  ],
  adult: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'skills', label: 'Skills', icon: GraduationCap },
    { id: 'value', label: 'OTP GO', icon: TrendingUp },
    { id: 'advisor', label: 'Advisor', icon: MessageSquareHeart },
  ],
};

export function BottomNav({
  view,
  activeTab,
  onSelectTab,
}: {
  view: AppView;
  activeTab: string;
  onSelectTab: (id: string) => void;
}) {
  const items = NAV_MAP[view];
  return (
    <nav
      aria-label="Primary phone navigation"
      className="grid shrink-0 grid-cols-4 border-t border-black/6 bg-white px-2 py-1.5"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-2xl py-1 transition-colors ${
              active
                ? 'text-[#52ae30]'
                : 'text-[#4a635c] hover:text-[#0b2e26]'
            }`}
          >
            <span
              className={`flex h-6 w-9 items-center justify-center rounded-full transition-colors ${
                active ? 'bg-[#e8f5e4]' : ''
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? 'stroke-[2.3]' : 'stroke-[1.7]'}`} />
            </span>
            <span className={`text-[10px] leading-none ${active ? 'font-bold text-[#38571a]' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
