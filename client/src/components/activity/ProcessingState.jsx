import { Loader2, ShieldCheck, Database, Search } from 'lucide-react';
import Card from '../common/Card';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable ProcessingState Component during Evidence Analysis
 *
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {string} [props.className='']
 */
export function ProcessingState({
  title,
  subtitle,
  className = '',
}) {
  const { t } = useLanguage();

  return (
    <Card className={`text-center py-10 px-6 max-w-xl mx-auto space-y-6 ${className}`}>
      {/* Animated Spinner with Glow */}
      <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 dark:bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 relative z-10">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {title || t('activity.processingTitle')}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
          {subtitle || t('activity.processingSubtitle')}
        </p>
      </div>

      {/* Simulated pipeline checklist */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs text-left space-y-2.5 max-w-sm mx-auto">
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
          <Search className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>{t('activity.stepExaminingChannel')}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
          <Database className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>{t('activity.stepCheckingReference')}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>{t('activity.stepEvaluatingProof')}</span>
        </div>
      </div>
    </Card>
  );
}

export default ProcessingState;
