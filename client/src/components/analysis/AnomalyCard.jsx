import Badge from '../common/Badge';
import Button from '../common/Button';
import { AlertTriangle, Check } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable AnomalyCard component with localization
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
        return 'rose';
      case 'MEDIUM':
        return 'amber';
      case 'LOW':
        return 'blue';
      default:
        return 'slate';
    }
  };

  const severityText = t(`anomaly.severity.${anomaly.severity}`) || anomaly.severity;

  return (
    <div
      className={`p-5 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/10 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {anomaly.title}
              </h4>
              <Badge variant={getSeverityVariant(anomaly.severity)} size="sm">
                {severityText}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {formatDate(anomaly.date, { format: 'short' })} • {t('anomaly.impact')} {anomaly.impactScore || -5} pts
            </p>
          </div>
        </div>

        {anomaly.status === 'RESOLVED' ? (
          <Badge variant="emerald" size="sm" icon={<Check className="w-3 h-3" />}>
            {t('anomaly.resolved')}
          </Badge>
        ) : (
          <Badge variant="amber" size="sm">
            {t('anomaly.actionRequired')}
          </Badge>
        )}
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4 pl-0 sm:pl-11">
        {anomaly.description}
      </p>

      {anomaly.actionRequired && (
        <div className="mb-4 pl-0 sm:pl-11">
          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-100 dark:border-rose-900/30 text-xs">
            <span className="font-semibold text-rose-900 dark:text-rose-300">
              {t('anomaly.recommendedRemediation')}
            </span>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              {anomaly.actionRequired}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pl-0 sm:pl-11 pt-2 border-t border-rose-100/60 dark:border-rose-900/30">
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
