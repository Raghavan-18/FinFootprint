import {
  TrendingUp,
  TrendingDown,
  PieChart,
  HelpCircle,
  Layers,
  CreditCard,
  Wallet,
} from 'lucide-react';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable Live Financial Profile Summary & Ratios Component
 *
 * @param {Object} props
 * @param {Object} props.formData - Current form state
 * @param {string} [props.className='']
 */
export function ProfileSummary({ formData, className = '' }) {
  const { t } = useLanguage();

  const monthlyIncome = Number(formData.monthlyIncome) || 0;
  const loans = Array.isArray(formData.loans) ? formData.loans : [];
  const activeLoansCount = loans.length;
  const isRented = formData.housing?.status === 'RENTED';
  const monthlyRent = isRented ? (Number(formData.housing?.monthlyRent) || 0) : 0;

  // Calculate total EMI from loans
  const totalLoanEmi = loans.reduce((sum, l) => sum + (Number(l.monthlyEmi) || 0), 0);

  // Calculate total expenses
  const exp = formData.monthlyExpenses || {};
  const effectiveRent = isRented ? monthlyRent : (Number(exp.rent) || 0);
  const effectiveEmi = totalLoanEmi > 0 ? totalLoanEmi : (Number(exp.loanEmi) || 0);

  const totalMonthlyExpenses =
    (Number(exp.food) || 0) +
    effectiveRent +
    (Number(exp.utilities) || 0) +
    (Number(exp.transport) || 0) +
    (Number(exp.education) || 0) +
    (Number(exp.medical) || 0) +
    effectiveEmi +
    (Number(exp.other) || 0);

  const estimatedSurplus = monthlyIncome - totalMonthlyExpenses;
  const isPositiveSurplus = estimatedSurplus >= 0;

  // Derived Financial Ratios (frontend UI display only)
  const emiToIncomeRatio =
    monthlyIncome > 0 ? Math.round((totalLoanEmi / monthlyIncome) * 100) : 0;

  const rentToIncomeRatio =
    monthlyIncome > 0 ? Math.round((effectiveRent / monthlyIncome) * 100) : 0;

  const expenseToIncomeRatio =
    monthlyIncome > 0 ? Math.round((totalMonthlyExpenses / monthlyIncome) * 100) : 0;

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <span>{t('financialProfile.summary.title', { defaultValue: t('financialProfile.sections.summary') })}</span>
        </div>
      }
      subtitle={t('financialProfile.sections.summarySubtitle')}
      className={`transition-all ${className}`}
    >
      <div className="space-y-6">
        {/* Core Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Monthly Income */}
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-300 font-semibold mb-1">
              <Wallet className="w-3.5 h-3.5" />
              <span>{t('financialProfile.summary.totalMonthlyIncome')}</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-indigo-900 dark:text-indigo-100">
              {formatCurrency(monthlyIncome)}
            </div>
          </div>

          {/* Monthly Expenses */}
          <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>{t('financialProfile.summary.totalMonthlyExpenses')}</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(totalMonthlyExpenses)}
            </div>
          </div>

          {/* Total Monthly EMI */}
          <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>{t('financialProfile.summary.totalMonthlyEmi')}</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(totalLoanEmi)}
            </div>
          </div>

          {/* Estimated Monthly Surplus */}
          <div
            className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
              isPositiveSurplus
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-100'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-900 dark:text-rose-100'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
              {isPositiveSurplus ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              )}
              <span>{t('financialProfile.summary.estimatedSurplus')}</span>
            </div>
            <div
              className={`text-lg sm:text-xl font-extrabold ${
                isPositiveSurplus
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatCurrency(estimatedSurplus)}
            </div>
          </div>

          {/* Active Loans Count */}
          <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between col-span-2 lg:col-span-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>{t('financialProfile.summary.activeLoans')}</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {activeLoansCount}
            </div>
          </div>
        </div>

        {/* Calculated Financial Ratios */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t('financialProfile.summary.ratiosTitle')}
            </h4>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {t('financialProfile.summary.healthyThreshold')}: &lt; 50%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* EMI-to-Income */}
            <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/70">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {t('financialProfile.summary.emiToIncome')}
                </span>
                <span
                  className={`font-bold ${
                    emiToIncomeRatio <= 30
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : emiToIncomeRatio <= 50
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {emiToIncomeRatio}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    emiToIncomeRatio <= 30
                      ? 'bg-emerald-500'
                      : emiToIncomeRatio <= 50
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(emiToIncomeRatio, 100)}%` }}
                />
              </div>
            </div>

            {/* Rent-to-Income */}
            <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/70">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {t('financialProfile.summary.rentToIncome')}
                </span>
                <span
                  className={`font-bold ${
                    rentToIncomeRatio <= 30
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : rentToIncomeRatio <= 40
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {rentToIncomeRatio}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    rentToIncomeRatio <= 30
                      ? 'bg-emerald-500'
                      : rentToIncomeRatio <= 40
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(rentToIncomeRatio, 100)}%` }}
                />
              </div>
            </div>

            {/* Expense-to-Income */}
            <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/70">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {t('financialProfile.summary.expenseToIncome')}
                </span>
                <span
                  className={`font-bold ${
                    expenseToIncomeRatio <= 65
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : expenseToIncomeRatio <= 85
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {expenseToIncomeRatio}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    expenseToIncomeRatio <= 65
                      ? 'bg-emerald-500'
                      : expenseToIncomeRatio <= 85
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(expenseToIncomeRatio, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* UI Calculation Disclaimer */}
          <div className="mt-3 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p>{t('financialProfile.summary.ratiosDisclaimer')}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileSummary;
