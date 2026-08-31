import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  TrendingUp,
  User,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react';

/**
 * Reusable Sidebar Navigation Component
 *
 * @param {Object} props
 * @param {string} props.activeTab
 * @param {Function} props.onSelectTab
 * @param {Object} [props.profile]
 * @param {string} [props.className='']
 */
export function Sidebar({
  activeTab,
  onSelectTab,
  profile,
  className = '',
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-activity', label: 'Add Activity', icon: PlusCircle },
    { id: 'history', label: 'History & Ledger', icon: Clock },
    { id: 'analysis', label: 'Risk Analysis', icon: TrendingUp },
    { id: 'profile', label: 'Profile & Proofs', icon: User },
    { id: 'lender-report', label: 'Lender Dossier', icon: FileSpreadsheet, badge: 'Prime' },
  ];

  return (
    <aside
      className={`w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between p-4 min-h-[calc(100vh-57px)] ${className}`}
    >
      <div className="space-y-6">
        {/* Navigation links */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Trust Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-900 border border-indigo-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2 mb-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Trust Rating: Grade {profile?.trustGrade || 'A'}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
          Alternative Underwriting Score: <strong>{profile?.footprintScore || 784}</strong>
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
