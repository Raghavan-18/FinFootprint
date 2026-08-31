import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';

/**
 * Reusable ProfileMetrics component
 *
 * @param {Object} props
 * @param {Object} props.profile
 * @param {string} [props.className='']
 */
export function ProfileMetrics({ profile, className = '' }) {
  if (!profile) return null;

  const scorePct = Math.round((profile.footprintScore / (profile.footprintScoreMax || 900)) * 100);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Footprint Trust Score */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Trust Score</span>
            <Badge variant="indigo" size="sm">
              Grade {profile.trustGrade}
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
          Top 8% among regional electrical & hardware micro-enterprises
        </p>
      </Card>

      {/* Stability Index */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Stability Index</span>
            <Badge variant="emerald" size="sm">
              Strong
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
          Calculated across 6-month recurring cash inflows
        </p>
      </Card>

      {/* Repayment Discipline */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Repayment Track</span>
            <Badge variant="emerald" size="sm">
              94% Timely
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
          100% on-time utility & vendor supplier payments
        </p>
      </Card>

      {/* Verification Coverage */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Evidence Ratio</span>
            <Badge variant="blue" size="sm">
              Auditable
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
          Corroborated via GSTN & Account Aggregator
        </p>
      </Card>
    </div>
  );
}

export default ProfileMetrics;
