import Card from '../common/Card';
import Button from '../common/Button';
import EvidenceBadge from '../evidence/EvidenceBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { CheckCircle2, ArrowRight, PlusCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable EvidenceAssessmentResult Component
 *
 * Displays the system-evaluated evidence classification and auditable explanation.
 *
 * @param {Object} props
 * @param {Object} props.transaction - The saved transaction with evidence metadata
 * @param {Function} props.onViewLedger - Callback to navigate to ledger
 * @param {Function} props.onLogAnother - Callback to reset and log another activity
 * @param {string} [props.className='']
 */
export function EvidenceAssessmentResult({
  transaction,
  onViewLedger,
  onLogAnother,
  className = '',
}) {
  const { t } = useLanguage();
  if (!transaction) return null;

  const status = transaction.evidence?.status || transaction.evidenceStatus || 'SELF_DECLARED';
  const explanation =
    (transaction.evidence?.explanationKey && t(transaction.evidence.explanationKey)) ||
    transaction.evidence?.explanation ||
    t(`evidence.assessments.${status.toLowerCase()}`) ||
    t(`evidence.descriptions.${status}`);

  return (
    <Card className={`max-w-xl mx-auto space-y-6 ${className}`}>
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-verified/10 dark:bg-verified/10 text-verified dark:text-verified flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-950 dark:text-neutral-50">
              {t('activity.assessmentCompleteTitle')}
            </h3>
            <p className="text-xs text-neutral-500">
              {t('activity.assessmentCompleteSubtitle')}
            </p>
          </div>
        </div>
        <EvidenceBadge status={status} size="md" />
      </div>

      {/* Recorded Transaction Summary Pill */}
      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
            {transaction.title}
          </span>
          <span className="text-base font-extrabold text-neutral-950 dark:text-neutral-50">
            {transaction.type === 'INCOME' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span>{t('transactions.paymentChannel')}: <strong className="text-neutral-700 dark:text-neutral-300">{transaction.paymentMethod}</strong></span>
          {transaction.reference && (
            <>
              <span>•</span>
              <span className="font-mono">{transaction.reference}</span>
            </>
          )}
        </div>
      </div>

      {/* System Evidence Assessment Explanation Box */}
      <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 dark:text-indigo-200">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>{t('activity.systemEvidenceExplanationTitle')}</span>
        </div>
        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {explanation}
        </p>
        <p className="text-[11px] text-neutral-500 italic pt-1 border-t border-indigo-200/60 dark:border-indigo-800/40">
          {t('evidence.disclaimerNotice')}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          size="md"
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={onLogAnother}
          className="w-full sm:w-auto text-sm"
        >
          {t('activity.logAnotherBtn')}
        </Button>

        <Button
          variant="primary"
          size="md"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={onViewLedger}
          className="w-full sm:w-auto text-sm"
        >
          {t('activity.viewInLedgerBtn')}
        </Button>
      </div>
    </Card>
  );
}

export default EvidenceAssessmentResult;