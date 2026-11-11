const SettingsSidebar = ({ tabItems, activeTab, onTabChange }) => {
  return (
    <aside className="rounded-xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-[#19191b]">
      <div className="h-full overflow-y-auto p-2.5">
        <p className="px-3 pt-2.5 pb-3 text-xs font-mono font-medium text-zinc-500 uppercase">
          Settings
        </p>

        <div className="space-y-1">
          {tabItems.map((item) => {
            const { key, label, icon: Icon } = item;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => onTabChange(key)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-[#fe3e91] text-white dark:bg-[#fe3e91] dark:text-white shadow-xs"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default SettingsSidebar;
