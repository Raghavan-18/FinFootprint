import Card from '../common/Card';
import { EVIDENCE_CONFIG } from '../../utils/evidenceUtils';
import EvidenceBadge from './EvidenceBadge';
import { Sparkles } from 'lucide-react';

/**
 * Reusable EvidenceExplanation component
 *
 * @param {Object} props
 * @param {string} [props.className='']
 */
export function EvidenceExplanation({ className = '' }) {
  const tiers = [
    EVIDENCE_CONFIG.VERIFIED,
    EVIDENCE_CONFIG.CORROBORATED,
    EVIDENCE_CONFIG.SELF_DECLARED,
    EVIDENCE_CONFIG.MISMATCH,
  ];

  return (
    <Card
      title="How Evidence Tiers Power Alternative Underwriting"
      subtitle="FinFootprint bridges informal income and formal institutional credit through cryptographically signed and cross-referenced evidence."
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
                  {tier.trustLevel}
                </h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {tier.confidenceScore}% Confidence Weight
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {tier.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 dark:text-indigo-200">
          <p className="font-semibold">Lender-Grade Integrity Guarantee</p>
          <p className="mt-0.5 text-indigo-800 dark:text-indigo-300 leading-relaxed">
            By shifting records from <em>Self-Declared</em> to <em>Corroborated</em> and <em>Verified</em> via Account Aggregator and GST APIs, applicants unlock up to 3.5x higher loan limits and 250 bps lower interest rates.
          </p>
        </div>
      </div>
    </Card>
  );
}

export default EvidenceExplanation;
