import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import BehaviourSummary from './BehaviourSummary';
import EvidenceSummary from './EvidenceSummary';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Printer } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable LenderReport component with localization
 *
 * @param {Object} props
 * @param {Object} props.report - Lender report data object
 * @param {Object} [props.profile] - User profile
 * @param {Object} [props.stats] - Financial stats
 * @param {string} [props.className='']
 */
export function LenderReport({
  report,
  profile,
  stats,
  className = '',
}) {
  const { t, isTamil } = useLanguage();
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const riskGradeDisplay = isTamil ? 'குறைந்த இடர் (பிரிவு A-)' : report.riskGrade;
  const scoreBandDisplay = isTamil ? 'பிரைம் அடுக்கு (750 - 850)' : report.scoreBand;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Formal Letterhead */}
      <Card className="border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                {t('lenderReport.letterheadTitle')}
              </span>
              <Badge variant="indigo" size="sm">
                {t('common.confidential')}
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('lenderReport.letterheadHeading')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('lenderReport.appId')} <span className="font-mono font-semibold">{report.applicationId}</span> • {t('lenderReport.generated')} {formatDate(report.generatedDate)}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 print:hidden">
            <Button
              variant="outline"
              size="sm"
              icon={<Printer className="w-3.5 h-3.5" />}
              onClick={handlePrint}
            >
              {t('common.printDossier')}
            </Button>
          </div>
        </div>

        {/* Applicant Details & Underwriting Decision Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {t('lenderReport.tradeName')}
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
              {report.tradeName || profile?.businessName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{profile?.registrationNumber}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
              {t('lenderReport.recommendedLimit')}
            </span>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
              {formatCurrency(report.recommendedCreditLimit)}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
              {t('lenderReport.tenure')} {report.recommendedTenureMonths} {t('lenderReport.months')}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {t('lenderReport.riskGrade')}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {riskGradeDisplay}
              </span>
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
              {scoreBandDisplay}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {t('lenderReport.interestTier')}
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {report.estimatedInterestTier}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{t('lenderReport.primeBracket')}</p>
          </div>
        </div>
      </Card>

      {/* Behavioral Summary */}
      <BehaviourSummary report={report} stats={stats} />

      {/* Evidence Integrity Breakdown */}
      <EvidenceSummary rating={report.evidenceIntegrityRating} />
    </div>
  );
}

export default LenderReport;
