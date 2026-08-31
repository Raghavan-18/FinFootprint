import Card from '../common/Card';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable Lender-specific EvidenceSummary component with localization
 *
 * @param {Object} props
 * @param {Object} props.rating - Evidence integrity rating object
 * @param {string} [props.className='']
 */
export function EvidenceSummary({ rating, className = '' }) {
  const { t } = useLanguage();
  if (!rating) return null;

  return (
    <Card
      title={t('lenderReport.evidenceIntegrityTitle')}
      subtitle={t('lenderReport.evidenceIntegritySubtitle')}
      className={className}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-center">
          <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold block">
            {t('lenderReport.directBankApi')}
          </span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {rating.verifiedShare}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-center">
          <span className="text-[11px] text-blue-800 dark:text-blue-300 font-semibold block">
            {t('lenderReport.corroboratedGst')}
          </span>
          <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
            {rating.corroboratedShare}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-center">
          <span className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold block">
            {t('lenderReport.selfDeclaredShare')}
          </span>
          <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
            {rating.selfDeclaredShare}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-center">
          <span className="text-[11px] text-rose-800 dark:text-rose-300 font-semibold block">
            {t('lenderReport.discrepancyShare')}
          </span>
          <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
            {rating.mismatchShare}
          </span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-600 dark:text-slate-400">
          {t('lenderReport.integrityGrade')} <strong className="text-slate-900 dark:text-white">{t('lenderReport.gradePrefix')} {rating.grade}</strong>
        </span>
        <span className="text-slate-600 dark:text-slate-400">
          {t('lenderReport.confidenceRating')} <strong className="text-indigo-600 dark:text-indigo-400">{rating.confidenceIndex}</strong>
        </span>
      </div>
    </Card>
  );
}

export default EvidenceSummary;
