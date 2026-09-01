import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  TrendingUp,
  User,
  FileSpreadsheet,
  X,
  Globe,
  LogOut,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../context/AuthContext';

/**
 * Reusable MobileNavigation component
 *
 * @param {Object} props
 * @param {string} props.activeTab
 * @param {Function} props.onSelectTab
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Object} [props.profile]
 */
export function MobileNavigation({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  profile,
}) {
  const { language, setLanguage, t } = useLanguage();
  const { logout, isAuthenticated } = useAuth();

  const navItems = [
    { id: 'dashboard', label: t('navigation.dashboard'), icon: LayoutDashboard },
    { id: 'add-activity', label: t('navigation.addActivity'), icon: PlusCircle },
    { id: 'history', label: t('navigation.history'), icon: Clock },
    { id: 'analysis', label: t('navigation.analysis'), icon: TrendingUp },
    { id: 'profile', label: t('navigation.profile'), icon: User },
    { id: 'lender-report', label: t('navigation.lenderReport'), icon: FileSpreadsheet },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-slate-900 h-full p-5 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    F
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {t('common.appName')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Switcher in Drawer */}
              <div className="mt-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 pl-1">
                  <Globe className="w-3.5 h-3.5" />
                  {t('navigation.language')}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      language === 'en'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('ta')}
                    className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      language === 'ta'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    தமிழ்
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectTab(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={async () => {
                      onClose();
                      await logout();
                      onSelectTab('login');
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer mt-2"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span className="truncate">{t('auth.common.logout')}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500">
              {t('navbar.loggedInAs')} <strong className="text-slate-800 dark:text-slate-200">{profile?.fullName}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Tab Bar for Fast Thumb Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around"
        aria-label="Mobile Bottom Navigation"
      >
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition-colors cursor-pointer max-w-[72px] truncate ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className="truncate w-full text-center">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default MobileNavigation;
