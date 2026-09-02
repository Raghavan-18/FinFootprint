import Card from '../common/Card';
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable AnalysisExplanation component with localization — FinFootprint v2 Design System
 *
 * Uses warm slate surfaces, semantic colors for strengths (verified green) and next steps (indigo).
 *
 * @param {Object} props
 * @param {string} [props.className='']
 */
export function AnalysisExplanation({ className = '' }) {
  const { t } = useLanguage();

  const strengths = t('analysis.strengthsList');
  const nextSteps = t('analysis.nextStepsList');

  return (
    <Card
      title={t('analysis.summaryTitle')}
      subtitle={t('analysis.summarySubtitle')}
      className={className}
    >
      <div className="space-y-4 text-xs sm:text-sm">
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-neutral-950 dark:text-neutral-50">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{t('analysis.aiModelAssessment')}</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
            {t('analysis.aiModelAssessmentText')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-verified-border dark:border-verified-border-dark bg-verified-bg dark:bg-verified-bg-dark">
            <h5 className="font-semibold text-verified dark:text-verified text-xs flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t('analysis.underwritingStrengths')}
            </h5>
            <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
              {Array.isArray(strengths) ? (
                strengths.map((s, idx) => <li key={idx}>• {s}</li>)
              ) : (
                <li>• {strengths}</li>
              )}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/30 dark:bg-indigo-950/20">
            <h5 className="font-semibold text-indigo-800 dark:text-indigo-300 text-xs flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> {t('analysis.nextStepsLimit')}
            </h5>
            <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
              {Array.isArray(nextSteps) ? (
                nextSteps.map((s, idx) => <li key={idx}>• {s}</li>)
              ) : (
                <li>• {nextSteps}</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AnalysisExplanation;