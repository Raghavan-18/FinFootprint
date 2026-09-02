import Badge from '../common/Badge';
import Button from '../common/Button';
import { AlertTriangle, Check } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable AnomalyCard component with localization — FinFootprint v2 Design System
 *
 * Uses design system semantic colors:
 * - CRITICAL/HIGH: Mismatch red (discrepancy)
 * - MEDIUM: Turmeric/amber (caution)
 * - LOW: Corroborated blue (informational)
 *
 * @param {Object} props
 * @param {Object} props.anomaly
 * @param {Function} [props.onResolve]
 * @param {Function} [props.onViewTransaction]
 * @param {string} [props.className='']
 */
export function AnomalyCard({
  anomaly,
  onResolve,
  onViewTransaction,
  className = '',
}) {
  const { t } = useLanguage();
  if (!anomaly) return null;

  const getSeverityVariant = (sev) => {
    switch (String(sev).toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getSeverityBg = (sev) => {
    switch (String(sev).toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-mismatch-bg dark:bg-mismatch-bg-dark border-mismatch-border dark:border-mismatch-border-dark';
      case 'MEDIUM':
        return 'bg-self-declared-bg dark:bg-self-declared-bg-dark border-self-declared-border dark:border-self-declared-border-dark';
      case 'LOW':
        return 'bg-corroborated-bg dark:bg-corroborated-bg-dark border-corroborated-border dark:border-corroborated-border-dark';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700';
    }
  };

  const getSeverityIconBg = (sev) => {
    switch (String(sev).toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-mismatch-bg dark:bg-mismatch-bg-dark text-mismatch dark:text-mismatch';
      case 'MEDIUM':
        return 'bg-self-declared-bg dark:bg-self-declared-bg-dark text-self-declared dark:text-self-declared';
      case 'LOW':
        return 'bg-corroborated-bg dark:bg-corroborated-bg-dark text-corroborated dark:text-corroborated';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
    }
  };

  const severityText = t(`anomaly.severity.${anomaly.severity}`) || anomaly.severity;

  return (
    <div
      className={`p-5 rounded-2xl ${getSeverityBg(anomaly.severity)} ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${getSeverityIconBg(anomaly.severity)}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                {anomaly.title}
              </h4>
              <Badge variant={getSeverityVariant(anomaly.severity)} size="sm">
                {severityText}
              </Badge>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {formatDate(anomaly.date, { format: 'short' })} • {t('anomaly.impact')} {anomaly.impactScore || -5} pts
            </p>
          </div>
        </div>

        {anomaly.status === 'RESOLVED' ? (
          <Badge variant="success" size="sm" icon={<Check className="w-3 h-3" />}>
            {t('anomaly.resolved')}
          </Badge>
        ) : (
          <Badge variant="warning" size="sm">
            {t('anomaly.actionRequired')}
          </Badge>
        )}
      </div>

      <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4 pl-0 sm:pl-11">
        {anomaly.description}
      </p>

      {anomaly.actionRequired && (
        <div className="mb-4 pl-0 sm:pl-11">
          <div className="p-3 rounded-xl bg-surface-raised dark:bg-surface-sunken border border-neutral-200 dark:border-neutral-800 text-xs">
            <span className="font-semibold text-neutral-950 dark:text-neutral-50">
              {t('anomaly.recommendedRemediation')}
            </span>
            <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
              {anomaly.actionRequired}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pl-0 sm:pl-11 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        {onViewTransaction && anomaly.transactionId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewTransaction(anomaly.transactionId)}
            className="text-xs"
          >
            {t('common.viewFlaggedRecord')}
          </Button>
        )}
        {onResolve && anomaly.status !== 'RESOLVED' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onResolve(anomaly)}
            className="text-xs"
          >
            {t('common.submitProof')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default AnomalyCard;