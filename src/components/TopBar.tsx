import React, { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, RotateCcw, Sparkles } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { navItems, NavTabId } from './navigation';
import { IconButton } from './ui';

interface TopBarProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  onOpenAskDrawer: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeTab, setActiveTab, onOpenAskDrawer }) => {
  const { role, setRole, resetDemoData, activeAlertsCount, edBoardingCount, blockedDischargesCount } = useHospital();
  const [moreOpen, setMoreOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || moreButtonRef.current?.contains(t)) return;
      setMoreOpen(false);
    };
    const dismiss = () => setMoreOpen(false);
    document.addEventListener('mousedown', close);
    window.addEventListener('resize', dismiss);
    return () => {
      document.removeEventListener('mousedown', close);
      window.removeEventListener('resize', dismiss);
    };
  }, [moreOpen]);

  const toggleMore = () => {
    const rect = moreButtonRef.current?.getBoundingClientRect();
    if (rect) {
      const width = 256;
      const left = Math.min(Math.max(16, rect.right - width), window.innerWidth - width - 16);
      setMenuPos({ top: rect.bottom + 8, left });
    }
    setMoreOpen((o) => !o);
  };

  // Live counters carried over from the old sidebar badges
  const badgeFor = (id: NavTabId): { text: string; tone: 'rose' | 'amber' } | undefined => {
    if (id === 'patient-flow' && edBoardingCount > 0) return { text: String(edBoardingCount), tone: 'amber' };
    if (id === 'discharge' && blockedDischargesCount > 0) return { text: `${blockedDischargesCount} blocked`, tone: 'rose' };
    if (id === 'alerts' && activeAlertsCount > 0) return { text: String(activeAlertsCount), tone: 'rose' };
    return undefined;
  };

  const primary = navItems.filter((n) => n.primary);
  const secondary = navItems.filter((n) => !n.primary);
  const activeSecondary = secondary.find((n) => n.id === activeTab);

  const go = (id: NavTabId) => {
    setActiveTab(id);
    setMoreOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-page/85 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-0 lg:h-16 flex flex-wrap lg:flex-nowrap items-center gap-x-4 gap-y-2">
        {/* Logo + product name */}
        <button onClick={() => go('command-center')} className="flex items-center gap-2 shrink-0 cursor-pointer">
          <span className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center text-xs font-bold tracking-tight">
            SF
          </span>
          <span className="hidden sm:block text-sm font-semibold tracking-tight text-ink">SmartFlow</span>
        </button>

        {/* Centered pill nav — scrolls horizontally on small screens */}
        <nav className="order-last lg:order-none w-full lg:w-auto lg:flex-1 min-w-0 flex justify-start lg:justify-center" aria-label="Primary">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {primary.map((item) => {
              const active = item.id === activeTab;
              const badge = badgeFor(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition-colors cursor-pointer ${
                    active
                      ? 'bg-ink text-white border-ink'
                      : 'bg-card text-ink-2 border-line hover:text-ink hover:border-slate-300'
                  }`}
                >
                  {item.label}
                  {badge && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${badge.tone === 'rose' ? 'bg-rose-500' : 'bg-amber-500'}`}
                      title={badge.text}
                    />
                  )}
                </button>
              );
            })}

            {/* More dropdown */}
            <div className="relative">
              <button
                ref={moreButtonRef}
                onClick={toggleMore}
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition-colors cursor-pointer ${
                  activeSecondary
                    ? 'bg-ink text-white border-ink'
                    : 'bg-card text-ink-2 border-line hover:text-ink hover:border-slate-300'
                }`}
              >
                {activeSecondary ? activeSecondary.label : 'More'}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </nav>

        {/* Right cluster */}
        <div className="ml-auto lg:ml-0 flex items-center gap-2 shrink-0">
          <IconButton label="Ask SmartFlow" variant="accent" size="sm" onClick={onOpenAskDrawer}>
            <Sparkles className="w-4 h-4" />
          </IconButton>
          <IconButton
            label="Alerts & tasks"
            size="sm"
            badge={activeAlertsCount}
            onClick={() => go('alerts')}
            className="max-sm:hidden"
          >
            <Bell className="w-4 h-4" />
          </IconButton>
          <IconButton label="Reset demo data" size="sm" onClick={resetDemoData} className="max-md:hidden">
            <RotateCcw className="w-4 h-4" />
          </IconButton>

          {/* User chip with role toggle */}
          <button
            onClick={() => setRole(role === 'admin' ? 'staff' : 'admin')}
            title="Switch role (Admin / Staff)"
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-card border border-line hover:border-slate-300 cursor-pointer"
          >
            <img
              src="/src/assets/images/avatar_operations_director_1791867936630.jpg"
              alt="Dr. E. Vance"
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="hidden xl:block text-left leading-tight">
              <span className="block text-[11px] font-semibold text-ink">Dr. E. Vance</span>
              <span className="block text-[10px] text-ink-3">{role === 'admin' ? 'Administrator' : 'Staff'}</span>
            </span>
            <span className="xl:hidden text-[10px] font-semibold text-ink-2 uppercase">{role}</span>
          </button>
        </div>
      </div>

      {/* "More" menu is fixed-positioned so the scrolling nav doesn't clip it */}
      {moreOpen && (
        <div
          ref={menuRef}
          role="menu"
          style={{ top: menuPos.top, left: menuPos.left }}
          className="fixed w-64 bg-card border border-line rounded-2xl shadow-xl p-1.5 z-40"
        >
            {secondary.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeTab;
              const badge = badgeFor(item.id);
              return (
                <button
                  key={item.id}
                  role="menuitem"
                  onClick={() => go(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer ${
                    active ? 'bg-ink text-white' : 'text-ink-2 hover:bg-canvas hover:text-ink'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {badge && (
                    <span
                      className={`text-[10px] font-semibold ${
                        active ? 'text-white/80' : badge.tone === 'rose' ? 'text-rose-700' : 'text-amber-700'
                      }`}
                    >
                      {badge.text}
                    </span>
                  )}
                </button>
              );
            })}
        </div>
      )}
    </header>
  );
};
