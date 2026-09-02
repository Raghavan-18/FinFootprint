import Button from '../common/Button';
import Badge from '../common/Badge';
import { PlusCircle, FileSpreadsheet, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable WelcomeSection component for Dashboard with localization
 *
 * @param {Object} props
 * @param {Object} props.profile
 * @param {Function} [props.onAddActivity]
 * @param {Function} [props.onViewLenderReport]
 * @param {string} [props.className='']
 */
export function WelcomeSection({
  profile,
  onAddActivity,
  onViewLenderReport,
  className = '',
}) {
  const { t } = useLanguage();

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/70 via-indigo-900/55 to-slate-950/70 backdrop-blur-xl text-white p-6 sm:p-8 border border-indigo-500/30 shadow-2xl ${className}`}
    >
      {/* Background glow accents */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              {t('dashboard.welcomeSubtitle')}
            </span>
            <Badge variant="emerald" size="sm" dot>
              {t('dashboard.aaConnected')}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t('dashboard.welcomeTitle')} {profile?.fullName || 'User'}
          </h1>
          <p className="text-sm text-indigo-200/80 mt-1 max-w-2xl">
            {profile?.businessName || 'Micro-Enterprise'} •{' '}
            <span className="text-indigo-100">{profile?.city || 'India'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {onAddActivity && (
            <Button
              variant="success"
              size="md"
              icon={<PlusCircle className="w-4 h-4" />}
              onClick={onAddActivity}
              className="shadow-lg shadow-emerald-950/40"
            >
              {t('dashboard.logActivityBtn')}
            </Button>
          )}

          {onViewLenderReport && (
            <Button
              variant="outline"
              size="md"
              icon={<FileSpreadsheet className="w-4 h-4" />}
              onClick={onViewLenderReport}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              {t('dashboard.lenderReportBtn')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
