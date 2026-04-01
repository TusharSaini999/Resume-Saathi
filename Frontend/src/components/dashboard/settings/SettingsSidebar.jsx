import { GRADIENT_SHARED } from "../../../constants/style";
const SettingsSidebar = ({ tabItems, activeTab, onTabChange }) => {
  return (
    <aside className="rounded-3xl border border-slate-200/70 bg-white/85 shadow-[0_20px_70px_-30px_rgba(128,58,209,0.45)] backdrop-blur-md lg:h-full lg:overflow-hidden dark:border-slate-700/80 dark:bg-slate-900/85">
      <div className="h-full overflow-y-auto p-3">
        <p className="px-3 pt-3 pb-4 text-xs font-semibold tracking-[0.18em] text-[#ca25af] uppercase dark:text-pink-300">
          Settings
        </p>

        <div className="space-y-2.5">
          {tabItems.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => onTabChange(key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? `${GRADIENT_SHARED} text-white shadow-md shadow-violet-400/30`
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={16} />
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
