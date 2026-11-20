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
      style={{ backgroundColor: 'var(--ds-card-bg)', borderColor: 'var(--ds-border-color)' }}
      className="grid shrink-0 grid-cols-4 border-t px-1.5 py-1.5 backdrop-blur-md"
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
            style={{
              borderRadius: 'var(--ds-btn-radius)',
              backgroundColor: active ? 'var(--stage-badge-bg, #e4f3ec)' : 'transparent',
              color: active ? 'var(--ds-primary, #005e48)' : 'var(--ds-text-muted, #4a635c)',
            }}
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 py-1 transition-colors hover:opacity-90"
          >
            <Icon className={`h-4 w-4 ${active ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
            <span className={`text-[10px] leading-none ${active ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
