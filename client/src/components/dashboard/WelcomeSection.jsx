import Button from '../common/Button';
import Badge from '../common/Badge';
import { PlusCircle, FileSpreadsheet, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable WelcomeSection component for Dashboard — FinFootprint v2 Design System
 *
 * Visual identity: Turmeric/indigo gradient — the colors of daily commerce
 * meeting institutional trust. Not generic fintech blue.
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
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-turmeric-700 via-turmeric-800 to-indigo-950 text-white p-6 sm:p-8 border border-turmeric-600/30 shadow-2xl ${className}`}
    >
      {/* Background glow accents — warm, organic */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-turmeric-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -tranneutral-x-1/2 -tranneutral-y-1/2 w-96 h-96 bg-turmeric-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/20 flex items-center gap-1.5 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-turmeric-200" />
              {t('dashboard.welcomeSubtitle')}
            </span>
            <Badge variant="success" size="sm" dot>
              {t('dashboard.aaConnected')}
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-white">
            {t('dashboard.welcomeTitle')} {profile?.fullName || 'User'}
          </h1>
          <p className="text-sm text-turmeric-100/90 mt-2 max-w-2xl leading-relaxed">
            {profile?.businessName || 'Micro-Enterprise'} •{' '}
            <span className="text-turmeric-50 font-medium">{profile?.city || 'India'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {onAddActivity && (
            <Button
              variant="success"
              size="md"
              icon={<PlusCircle className="w-4 h-4" />}
              onClick={onAddActivity}
              className="shadow-lg shadow-verified/30"
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