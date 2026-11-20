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
    { id: 'benefits', label: 'Benefits', icon: Sparkles },
  ],
  kid: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'piggy', label: 'Persely', icon: PiggyBank },
    { id: 'skills', label: 'Skill Wallet', icon: GraduationCap },
    { id: 'milestones', label: 'Quests', icon: Award },
  ],
  adult: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'skills', label: 'Skills', icon: GraduationCap },
    { id: 'value', label: 'Value / GO', icon: TrendingUp },
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
    <nav className="grid shrink-0 grid-cols-4 border-t border-black/8 bg-white/95 px-1.5 py-1.5 backdrop-blur-md">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1 transition-colors ${
              active
                ? 'bg-emerald-50 text-[#74BF1E]'
                : 'text-[#5b736c] hover:text-[#0b2e26]'
            }`}
          >
            <Icon className={`h-4 w-4 ${active ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
            <span className={`text-[10px] ${active ? 'font-semibold' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
