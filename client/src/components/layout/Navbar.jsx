import { Menu, Plus, Globe } from 'lucide-react';
import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable Navbar Component with Global Language Switcher
 *
 * @param {Object} props
 * @param {Object} props.profile
 * @param {Function} [props.onOpenMobileSidebar]
 * @param {Function} [props.onAddActivity]
 */
export function Navbar({
  profile,
  onOpenMobileSidebar,
  onAddActivity,
}) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20">
              F
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight hidden sm:inline">
              {t('common.appName')}
            </span>
          </div>
        </div>

        {/* Center: Realtime AA Status indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {t('navbar.streamActive')}
          </span>
          <span className="text-slate-400 font-mono text-[11px]">| {t('navbar.hdfcSync')}</span>
        </div>

        {/* Right: Language Switcher, Quick Actions & Profile avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Global Language Toggle Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Switch to English"
            >
              <Globe className="w-3 h-3" />
              <span>EN</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                language === 'ta'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="தமிழுக்கு மாற்றவும்"
            >
              <span>தமிழ்</span>
            </button>
          </div>

          {onAddActivity && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={onAddActivity}
              className="hidden sm:inline-flex shadow-xs"
            >
              {t('navbar.addActivityBtn')}
            </Button>
          )}

          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
              {profile?.fullName
                ?.split(' ')
                .map((n) => n[0])
                .join('') || 'RK'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                {profile?.fullName || 'Rajesh Kumar'}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                {t('navbar.score')}: <span className="font-bold text-indigo-600 dark:text-indigo-400">{profile?.footprintScore || 784}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
