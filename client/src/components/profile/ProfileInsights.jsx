import Card from '../common/Card';
import Badge from '../common/Badge';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable ProfileInsights component with localization — FinFootprint v2 Design System
 *
 * Uses neutral warm surfaces with semantic colored badges and icons.
 *
 * @param {Object} props
 * @param {string} [props.className='']
 */
export function ProfileInsights({ className = '' }) {
  const { t } = useLanguage();

  return (
    <Card variant="default" padding="lg" className={className}>
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-verified-bg dark:bg-verified-bg-dark border border-verified-border dark:border-verified-border-dark flex items-start gap-3">
          <div className="p-2 rounded-lg bg-verified/10 dark:bg-verified/10 text-verified dark:text-verified shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-950 dark:text-neutral-50 mb-1">
              <Badge variant="success" size="xs" dot>
                {t('profile.dscrCushionTitle')}
              </Badge>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('profile.dscrCushionText')}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-primary-bg dark:bg-primary-bg-dark border border-primary-border dark:border-primary-border-dark flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/10 text-primary dark:text-primary shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-950 dark:text-neutral-50 mb-1">
              <Badge variant="primary" size="xs" dot>
                {t('profile.boostScoreTitle')}
              </Badge>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('profile.boostScoreText')}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileInsights;