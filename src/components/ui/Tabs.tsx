import { useRef, useEffect, type ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Scroll active tab into view on mobile
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const tab = activeTabRef.current;
      const scrollLeft = tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <div
      ref={tabsContainerRef}
      role="tablist"
      className={`
        flex gap-1 overflow-x-auto scrollbar-hide
        border-b border-navy-50 -mx-1 px-1
        ${className}
      `}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={isActive ? activeTabRef : undefined}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium
              whitespace-nowrap border-b-2 transition-all duration-200
              flex-shrink-0 min-w-0
              ${
                isActive
                  ? 'border-sage-600 text-sage-700'
                  : 'border-transparent text-navy-400 hover:text-navy-600 hover:border-navy-200'
              }
            `}
          >
            {tab.icon && (
              <span className="flex-shrink-0" aria-hidden="true">{tab.icon}</span>
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`
                  text-2xs font-semibold px-1.5 py-0.5 rounded-full
                  ${isActive ? 'bg-sage-100 text-sage-700' : 'bg-ivory-200 text-navy-400'}
                `}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
