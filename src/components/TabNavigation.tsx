import Icon from "@mdi/react";

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="relative">
      {/* Premium Tab Container */}
      <div className="glass-card rounded-2xl p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative inline-flex items-center gap-3 rounded-xl px-6 py-3.5
                  text-sm font-semibold transition-all duration-300
                  ${
                    isActive
                      ? "neu-button bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-white"
                      : "hover:bg-white/5 text-gray-400 hover:text-white"
                  }
                `}
              >
                {/* Active Tab Glow Effect */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 blur-md" />
                )}
                
                {/* Tab Content */}
                <div className="relative flex items-center gap-2.5">
                  <Icon 
                    path={tab.icon} 
                    size={1}
                    className={isActive ? "text-violet-300 drop-shadow-[0_0_8px_rgba(196,181,253,0.5)]" : ""}
                  />
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full" />
                  )}
                </div>
                
                {/* Premium Hover Effect */}
                <div className="premium-hover" />
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Subtle Bottom Border */}
      <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
