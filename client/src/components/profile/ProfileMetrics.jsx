import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable ProfileMetrics component with localization
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
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('profile.trustScore')}</span>
            <Badge variant={hasScore ? "indigo" : "default"} size="sm">
              {hasScore ? `${t('lenderReport.gradePrefix')} ${profile.trustGrade}` : '—'}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {hasScore ? profile.footprintScore : '—'}
            </span>
            {hasScore && <span className="text-xs text-slate-400">/ {profile.footprintScoreMax || 900}</span>}
          </div>
          <ProgressBar value={scorePct} variant="gradient" height="sm" />
        </div>
        <p className="text-[11px] text-slate-500 mt-3">
          {hasScore ? t('common.topPercent') : t('dashboard.newOnboardingSubtitle')}
        </p>
      </Card>

      {/* Stability Index */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('profile.stabilityIndex')}</span>
            <Badge variant={profile.stabilityScore > 0 ? "emerald" : "default"} size="sm">
              {profile.stabilityScore > 0 ? t('profile.strong') : '—'}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {profile.stabilityScore > 0 ? `${profile.stabilityScore}%` : '—'}
            </span>
          </div>
          <ProgressBar value={profile.stabilityScore || 0} variant="emerald" height="sm" />
        </div>
        <p className="text-[11px] text-slate-500 mt-3">
          {t('profile.stabilitySubtitle')}
        </p>
      </Card>

      {/* Repayment Discipline */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('profile.repaymentTrack')}</span>
            <Badge variant={profile.repaymentDiscipline > 0 ? "emerald" : "default"} size="sm">
              {profile.repaymentDiscipline > 0 ? t('profile.timely') : '—'}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {profile.repaymentDiscipline > 0 ? `${profile.repaymentDiscipline}%` : '—'}
            </span>
          </div>
          <ProgressBar value={profile.repaymentDiscipline || 0} variant="emerald" height="sm" />
        </div>
        <p className="text-[11px] text-slate-500 mt-3">
          {t('profile.repaymentSubtitle')}
        </p>
      </Card>

      {/* Verification Coverage */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('profile.evidenceRatio')}</span>
            <Badge variant={profile.verificationCoverage > 0 ? "blue" : "default"} size="sm">
              {profile.verificationCoverage > 0 ? t('profile.auditable') : '—'}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {profile.verificationCoverage > 0 ? `${profile.verificationCoverage}%` : '—'}
            </span>
          </div>
          <ProgressBar value={profile.verificationCoverage || 0} variant="blue" height="sm" />
        </div>
        <p className="text-[11px] text-slate-500 mt-3">
          {t('profile.evidenceSubtitle')}
        </p>
      </Card>
    </div>
  );
}

export default ProfileMetrics;
