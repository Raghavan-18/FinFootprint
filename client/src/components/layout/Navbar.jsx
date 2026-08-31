import { Menu, Plus } from 'lucide-react';
import Button from '../common/Button';

/**
 * Reusable Navbar Component
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
              FinFootprint
            </span>
          </div>
        </div>

        {/* Center: Realtime AA Status indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Account Aggregator Stream Active
          </span>
          <span className="text-slate-400 font-mono text-[11px]">| HDFC Sync</span>
        </div>

        {/* Right: Quick Actions & Profile avatar */}
        <div className="flex items-center gap-3">
          {onAddActivity && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={onAddActivity}
              className="hidden sm:inline-flex shadow-xs"
            >
              Add Activity
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
                Score: <span className="font-bold text-indigo-600 dark:text-indigo-400">{profile?.footprintScore || 784}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
