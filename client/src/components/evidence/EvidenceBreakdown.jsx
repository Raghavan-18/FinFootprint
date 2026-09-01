import Card from '../common/Card';
import EvidenceBadge from './EvidenceBadge';
import { EVIDENCE_CONFIG, calculateEvidenceStats } from '../../utils/evidenceUtils';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable EvidenceBreakdown component with localization
 *
 * @param {Object} props
 * @param {Array<Object>} props.transactions - List of transactions to analyze
 * @param {Function} [props.onOpenGuide] - Callback to open educational modal
 * @param {string} [props.className='']
 */
export function EvidenceBreakdown({
  transactions = [],
  onOpenGuide,
  className = '',
}) {
  const { t } = useLanguage();
  const stats = calculateEvidenceStats(transactions);
  const total = stats.totalCount || 1;

  const verifiedPct = Math.round((stats.breakdown.VERIFIED / total) * 100);
  const corroboratedPct = Math.round((stats.breakdown.CORROBORATED / total) * 100);
  const selfDeclaredPct = Math.round((stats.breakdown.SELF_DECLARED / total) * 100);
  const mismatchPct = Math.round((stats.breakdown.MISMATCH / total) * 100);

  const tiers = [
    {
      key: 'VERIFIED',
      count: stats.breakdown.VERIFIED,
      percent: verifiedPct,
      config: EVIDENCE_CONFIG.VERIFIED,
      barColor: 'bg-emerald-500',
    },
    {
      key: 'CORROBORATED',
      count: stats.breakdown.CORROBORATED,
      percent: corroboratedPct,
      config: EVIDENCE_CONFIG.CORROBORATED,
      barColor: 'bg-blue-500',
    },
    {
      key: 'SELF_DECLARED',
      count: stats.breakdown.SELF_DECLARED,
      percent: selfDeclaredPct,
      config: EVIDENCE_CONFIG.SELF_DECLARED,
      barColor: 'bg-amber-500',
    },
    {
      key: 'MISMATCH',
      count: stats.breakdown.MISMATCH,
      percent: mismatchPct,
      config: EVIDENCE_CONFIG.MISMATCH,
      barColor: 'bg-rose-500',
    },
  ];

  const hasRecords = stats.totalCount > 0;

  return (
    <Card
      title={t('evidence.breakdownTitle')}
      subtitle={t('evidence.breakdownSubtitle')}
      headerAction={
        onOpenGuide && (
          <button
            type="button"
            onClick={onOpenGuide}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('common.howItWorks')}</span>
          </button>
        )
      }
      className={className}
    >
      {/* Segmented Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
          <span>{t('evidence.verificationCoverage')}</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200">
            {hasRecords ? `${stats.verifiedPercent}% ${t('evidence.weightedTrustScore')}` : '—'}
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden gap-0.5">
          {hasRecords ? (
            tiers.map((tier) =>
              tier.percent > 0 ? (
                <div
                  key={tier.key}
                  className={`${tier.barColor} h-full transition-all duration-500`}
                  style={{ width: `${tier.percent}%` }}
                  title={`${t(`evidence.statuses.${tier.key}`)}: ${tier.percent}% (${tier.count} ${
                    tier.count === 1 ? t('common.record') : t('common.records')
                  })`}
                />
              ) : null
            )
          ) : (
            <div className="w-full h-full bg-slate-100 dark:bg-slate-800" />
          )}
        </div>
      </div>

      {/* Grid of Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tiers.map((tier) => (
          <div
            key={tier.key}
            className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <EvidenceBadge status={tier.key} size="sm" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {tier.percent}%
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {tier.count} {tier.count === 1 ? t('common.record') : t('common.records')}
              </p>
              <p className="text-[11px] mt-0.5 line-clamp-2">
                {t(`evidence.descriptions.${tier.key}`) || tier.config.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default EvidenceBreakdown;
