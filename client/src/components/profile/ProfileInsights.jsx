import Card from '../common/Card';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable ProfileInsights component with localization
 *
 * @param {Object} props
 * @param {string} [props.className='']
 */
export function ProfileInsights({ className = '' }) {
  const { t } = useLanguage();

  return (
    <Card
      title={t('profile.readinessTitle')}
      subtitle={t('profile.readinessSubtitle')}
      className={className}
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('profile.dscrCushionTitle')}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('profile.dscrCushionText')}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 dark:text-indigo-300 mb-1">
            <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{t('profile.boostScoreTitle')}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('profile.boostScoreText')}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default ProfileInsights;
