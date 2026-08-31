import Card from '../common/Card';
import { EVIDENCE_CONFIG } from '../../utils/evidenceUtils';
import EvidenceBadge from './EvidenceBadge';
import { Sparkles, Info } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable EvidenceExplanation component with localization
 *
 * @param {Object} props
 * @param {string} [props.className='']
 */
export function EvidenceExplanation({ className = '' }) {
  const { t } = useLanguage();

  const tiers = [
    EVIDENCE_CONFIG.VERIFIED,
    EVIDENCE_CONFIG.CORROBORATED,
    EVIDENCE_CONFIG.SELF_DECLARED,
    EVIDENCE_CONFIG.MISMATCH,
  ];

  return (
    <Card
      title={t('evidence.explanationTitle')}
      subtitle={t('evidence.explanationSubtitle')}
      className={className}
    >
      <div className="space-y-4">
        {tiers.map((tier) => (
          <div
            key={tier.status}
            className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-start gap-4"
          >
            <div className="shrink-0 pt-0.5">
              <EvidenceBadge status={tier.status} size="md" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {t(`evidence.trustLevels.${tier.status}`) || tier.trustLevel}
                </h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {tier.confidenceScore}% {t('evidence.confidenceWeight')}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {t(`evidence.descriptions.${tier.status}`) || tier.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 dark:text-indigo-200">
            <p className="font-semibold">{t('evidence.integrityGuaranteeTitle')}</p>
            <p className="mt-0.5 text-indigo-800 dark:text-indigo-300 leading-relaxed">
              {t('evidence.integrityGuaranteeText')}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{t('evidence.disclaimerNotice')}</span>
        </div>
      </div>
    </Card>
  );
}

export default EvidenceExplanation;
