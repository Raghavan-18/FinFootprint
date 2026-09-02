import { Briefcase, IndianRupee, ShieldAlert, Sparkles } from 'lucide-react';
import Card from '../common/Card';
import { useLanguage } from '../../hooks/useLanguage';

const INCOME_TYPES = ['SALARY', 'BUSINESS', 'FREELANCE', 'DAILY_WAGE', 'OTHER'];
const STABILITY_OPTIONS = ['FIXED', 'MOSTLY_STABLE', 'VARIABLE'];

/**
 * Reusable Income & Work Information Section
 *
 * @param {Object} props
 * @param {Object} props.formData
 * @param {Function} props.onChange
 * @param {Object} [props.errors]
 */
export function IncomeSection({ formData, onChange, errors = {} }) {
  const { t } = useLanguage();

  const handleIncomeChange = (e) => {
    const val = e.target.value;
    onChange('monthlyIncome', val === '' ? '' : Number(val));
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <IndianRupee className="w-4 h-4" />
          </div>
          <span>{t('financialProfile.sections.income')}</span>
        </div>
      }
      subtitle={t('financialProfile.sections.incomeSubtitle')}
      className="transition-all"
    >
      <div className="space-y-6">
        {/* 1. Monthly Income */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            {t('financialProfile.income.monthlyIncome')} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
              ₹
            </div>
            <input
              type="number"
              min="0"
              step="100"
              value={formData.monthlyIncome ?? ''}
              onChange={handleIncomeChange}
              placeholder={t('financialProfile.income.monthlyIncomePlaceholder')}
              className={`w-full pl-9 pr-4 py-2.5 text-sm bg-white/70 dark:bg-slate-950/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400 transition-all ${
                errors.monthlyIncome
                  ? 'border-rose-500 focus:border-rose-500 ring-rose-500/20'
                  : 'border-slate-200/80 dark:border-slate-800 focus:border-indigo-500'
              }`}
            />
          </div>
          {errors.monthlyIncome && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <ShieldAlert className="w-3.5 h-3.5" />
              {errors.monthlyIncome}
            </p>
          )}
        </div>

        {/* 2. Income Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            {t('financialProfile.income.incomeType')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {INCOME_TYPES.map((type) => {
              const isSelected = formData.incomeType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange('incomeType', type)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 font-semibold'
                      : 'bg-white/60 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-800'
                  }`}
                >
                  <span className="text-xs font-medium">
                    {t(`financialProfile.income.types.${type}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Income Stability */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            {t('financialProfile.income.stability')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {STABILITY_OPTIONS.map((stability) => {
              const isSelected = formData.incomeStability === stability;
              return (
                <button
                  key={stability}
                  type="button"
                  onClick={() => onChange('incomeStability', stability)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'bg-white/60 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs">
                    {t(`financialProfile.income.stabilityOptions.${stability}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Occupation / Work Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            {t('financialProfile.income.occupation')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.occupation || ''}
              onChange={(e) => onChange('occupation', e.target.value)}
              placeholder={t('financialProfile.income.occupationPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            {t('financialProfile.income.occupationHelper')}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default IncomeSection;
