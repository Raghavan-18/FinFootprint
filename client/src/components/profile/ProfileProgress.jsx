import { Check } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable Progress Indicator for Financial Profile Onboarding
 *
 * @param {Object} props
 * @param {number} props.currentStep - Active step (1-based index)
 * @param {number} props.totalSteps - Total number of steps
 * @param {Array<{id: string, titleKey: string}>} [props.steps] - Step metadata
 * @param {Function} [props.onStepClick] - Optional step jump callback
 */
export function ProfileProgress({
  currentStep = 1,
  totalSteps = 4,
  steps = [],
  onStepClick,
}) {
  const { t } = useLanguage();
  const progressPercent = Math.min(Math.round((currentStep / totalSteps) * 100), 100);

  const defaultSteps = [
    { id: 'income', title: t('financialProfile.sections.income') },
    { id: 'housing', title: t('financialProfile.sections.housing') },
    { id: 'loans', title: t('financialProfile.sections.loans') },
    { id: 'expenses', title: t('financialProfile.sections.expenses') },
  ];

  const effectiveSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/70 rounded-2xl p-4 sm:p-6 shadow-lg shadow-black/5 transition-all">
      {/* Top Header: Step counter & Percentage */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-400/20">
            {t('financialProfile.step')} {currentStep} {t('financialProfile.of')} {totalSteps}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
            {t('financialProfile.progress')}
          </span>
        </div>
        <div className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
          {progressPercent}%
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {effectiveSteps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <button
              key={step.id || idx}
              type="button"
              onClick={() => onStepClick && onStepClick(stepNum)}
              disabled={!onStepClick}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                isCurrent
                  ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : isCompleted
                  ? 'text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                  : 'text-slate-400 dark:text-slate-500'
              } ${onStepClick ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/30'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
              </div>
              <span className="text-xs truncate">{step.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProfileProgress;
