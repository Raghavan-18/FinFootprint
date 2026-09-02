import Card from '../common/Card';
import Badge from '../common/Badge';
import MetricProgress from '../analysis/MetricProgress';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable ProfileMetrics component with localization — FinFootprint v2 Design System
 *
 * Uses neutral warm slate, semantic badge colors, indigo accent.
 *
 * @param {Object} props
 * @param {Object} props.profile
 * @param {string} [props.className='']
 */
export function ProfileMetrics({ profile, className = '' }) {
  const { t } = useLanguage();
  if (!profile) return null;

  const hasScore = Boolean(profile.footprintScore && profile.footprintScore > 0);
  const scorePct = hasScore
    ? Math.round((profile.footprintScore / (profile.footprintScoreMax || 900)) * 100)
    : 0;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Footprint Trust Score */}
      <Card variant="default" padding="md" className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t('profile.trustScore')}</span>
            <Badge variant={hasScore ? "primary" : "default"} size="sm">
              {hasScore ? `${t('lenderReport.gradePrefix')} ${profile.trustGrade}` : '—'}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              {hasScore ? profile.footprintScore : '—'}
            </span>
            {hasScore && <span className="text-xs text-neutral-400">/ {profile.footprintScoreMax || 900}</span>}
          </div>
          <MetricProgress value={scorePct} max={100} status={hasScore ? 'OPTIMAL' : 'LOW'} className="h-2" />
        </div>
        <p className="text-[11px] text-neutral-500 mt-3">
          {hasScore ? t('common.topPercent') : t('dashboard.newOnboardingSubtitle')}
        </p>
      </Card>

      {/* Stability Index */}
      <Card variant="default" padding="md" className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t('profile.stabilityIndex')}</span>
            <Badge variant={profile.stabilityScore > 0 ? "success" : "default"} size="sm">
              {profile.stabilityScore > 0 ? t('profile.strong') : '—'}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              {profile.stabilityScore > 0 ? `${profile.stabilityScore}%` : '—'}
            </span>
          </div>
          <MetricProgress value={profile.stabilityScore || 0} max={100} status="OPTIMAL" className="h-2" />
        </div>
        <p className="text-[11px] text-neutral-500 mt-3">
          {t('profile.stabilitySubtitle')}
        </p>
      </Card>

      {/* Repayment Discipline */}
      <Card variant="default" padding="md" className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t('profile.repaymentTrack')}</span>
            <Badge variant={profile.repaymentDiscipline > 0 ? "success" : "default"} size="sm">
              {profile.repaymentDiscipline > 0 ? t('profile.timely') : '—'}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              {profile.repaymentDiscipline > 0 ? `${profile.repaymentDiscipline}%` : '—'}
            </span>
          </div>
          <MetricProgress value={profile.repaymentDiscipline || 0} max={100} status="OPTIMAL" className="h-2" />
        </div>
        <p className="text-[11px] text-neutral-500 mt-3">
          {t('profile.repaymentSubtitle')}
        </p>
      </Card>

      {/* Verification Coverage */}
      <Card variant="default" padding="md" className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t('profile.evidenceRatio')}</span>
            <Badge variant={profile.verificationCoverage > 0 ? "info" : "default"} size="sm">
              {profile.verificationCoverage > 0 ? t('profile.auditable') : '—'}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              {profile.verificationCoverage > 0 ? `${profile.verificationCoverage}%` : '—'}
            </span>
          </div>
          <MetricProgress value={profile.verificationCoverage || 0} max={100} status="HIGH" className="h-2" />
        </div>
        <p className="text-[11px] text-neutral-500 mt-3">
          {t('profile.evidenceSubtitle')}
        </p>
      </Card>
    </div>
  );
}

export default ProfileMetrics;