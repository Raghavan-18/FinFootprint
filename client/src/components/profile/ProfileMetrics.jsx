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

  const scorePct = Math.round((profile.footprintScore / (profile.footprintScoreMax || 900)) * 100);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Footprint Trust Score */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('profile.trustScore')}</span>
            <Badge variant="indigo" size="sm">
              {t('lenderReport.gradePrefix')} {profile.trustGrade}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {profile.footprintScore}
            </span>
            <span className="text-xs text-slate-400">/ {profile.footprintScoreMax || 900}</span>
          </div>
          <ProgressBar value={scorePct} variant="gradient" height="sm" />
        </div>
        <p className="text-[11px] text-slate-500 mt-3">
          {t('common.topPercent')}
        </p>
      </Card>

      {/* Stability Index */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('profile.stabilityIndex')}</span>
            <Badge variant="emerald" size="sm">
              {t('profile.strong')}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {profile.stabilityScore}%
            </span>
          </div>
          <ProgressBar value={profile.stabilityScore} variant="emerald" height="sm" />
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
            <Badge variant="emerald" size="sm">
              {t('profile.timely')}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {profile.repaymentDiscipline}%
            </span>
          </div>
          <ProgressBar value={profile.repaymentDiscipline} variant="emerald" height="sm" />
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
            <Badge variant="blue" size="sm">
              {t('profile.auditable')}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {profile.verificationCoverage}%
            </span>
          </div>
          <ProgressBar value={profile.verificationCoverage} variant="blue" height="sm" />
        </div>
        <p className="text-[11px] text-slate-500 mt-3">
          {t('profile.evidenceSubtitle')}
        </p>
      </Card>
    </div>
  );
}

export default ProfileMetrics;
