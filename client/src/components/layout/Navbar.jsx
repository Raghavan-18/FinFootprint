import { useState, useEffect } from 'react';
import { Menu, Plus, Globe } from 'lucide-react';
import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';
import { apiService } from '../../services/api';

/**
 * Reusable Navbar Component with Global Language Switcher and Backend Health Status
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
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      const res = await apiService.getHealthCheck();
      if (isMounted) {
        setBackendOnline(Boolean(res.success && res.data?.status === 'ok'));
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const initials = (profile?.fullName || 'User')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20">
              F
            </div>
            <span className="font-extrabold text-neutral-900 dark:text-white text-base tracking-tight hidden sm:inline">
              {t('common.appName')}
            </span>
          </div>
        </div>

        {/* Center: Realtime Backend & AA Status indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 text-xs">
          <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
            {backendOnline ? t('activity.backendConnected') : t('activity.backendOffline')}
          </span>
          <span className="text-neutral-400 font-mono text-[11px]">| {t('navbar.hdfcSync')}</span>
        </div>

        {/* Right: Language Switcher, Quick Actions & Profile avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Global Language Toggle Switcher */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
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
                  ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
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

          <div className="flex items-center gap-2.5 pl-2 border-l border-neutral-200 dark:border-neutral-800">
            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center justify-center">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-neutral-900 dark:text-white leading-tight">
                {profile?.fullName || 'User'}
              </p>
              <p className="text-[11px] text-neutral-400 leading-tight">
                {t('navbar.score')}: <span className="font-bold text-indigo-600 dark:text-indigo-400">{profile?.footprintScore ? profile.footprintScore : '—'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
