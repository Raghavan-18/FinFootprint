import Card from '../common/Card';
import Badge from '../common/Badge';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable Lender-specific EvidenceSummary component with localization — FinFootprint v2 Design System
 *
 * Uses warm slate surfaces, semantic tier colors.
 *
 * @param {Object} props
 * @param {Object} props.rating - Evidence integrity rating object
 * @param {string} [props.className='']
 */
export function EvidenceSummary({ rating, className = '' }) {
  const { t } = useLanguage();
  if (!rating) return null;

  return (
    <Card variant="default" padding="lg" className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3.5 rounded-xl bg-verified-bg dark:bg-verified-bg-dark border border-verified-border dark:border-verified-border-dark text-center">
          <span className="text-[11px] text-verified dark:text-verified font-semibold block">
            {t('lenderReport.directBankApi')}
          </span>
          <span className="text-xl font-extrabold text-verified dark:text-verified">
            {rating.verifiedShare}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-info-bg dark:bg-info-bg-dark border border-info-border dark:border-info-border-dark text-center">
          <span className="text-[11px] text-info dark:text-info font-semibold block">
            {t('lenderReport.corroboratedGst')}
          </span>
          <span className="text-xl font-extrabold text-info dark:text-info">
            {rating.corroboratedShare}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-warning-bg dark:bg-warning-bg-dark border border-warning-border dark:border-warning-border-dark text-center">
          <span className="text-[11px] text-warning dark:text-warning font-semibold block">
            {t('lenderReport.selfDeclaredShare')}
          </span>
          <span className="text-xl font-extrabold text-warning dark:text-warning">
            {rating.selfDeclaredShare}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-danger-bg dark:bg-danger-bg-dark border border-danger-border dark:border-danger-border-dark text-center">
          <span className="text-[11px] text-danger dark:text-danger font-semibold block">
            {t('lenderReport.discrepancyShare')}
          </span>
          <span className="text-xl font-extrabold text-danger dark:text-danger">
            {rating.mismatchShare}
          </span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
        <span className="text-neutral-600 dark:text-neutral-400">
          {t('lenderReport.integrityGrade')} <strong className="text-neutral-950 dark:text-neutral-50">{t('lenderReport.gradePrefix')} {rating.grade}</strong>
        </span>
        <span className="text-neutral-600 dark:text-neutral-400">
          {t('lenderReport.confidenceRating')} <strong className="text-primary dark:text-primary">{rating.confidenceIndex}</strong>
        </span>
      </div>
    </Card>
  );
}

export default EvidenceSummary;