import {
  Receipt,
  Utensils,
  Home,
  Zap,
  Car,
  GraduationCap,
  HeartPulse,
  CreditCard,
  Layers,
  Info,
} from 'lucide-react';
import Card from '../common/Card';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable Monthly Expenses Breakdown Section
 *
 * @param {Object} props
 * @param {Object} props.formData - Full form state
 * @param {Function} props.onChange - (field, value) => void
 * @param {Object} [props.errors]
 */
export function ExpenseSection({ formData, onChange }) {
  const { t } = useLanguage();
  const expenses = formData.monthlyExpenses || {};
  const isRented = formData.housing?.status === 'RENTED';
  const housingRent = isRented ? (Number(formData.housing?.monthlyRent) || 0) : 0;

  // Calculate total EMI from loans
  const totalLoanEmi = (formData.loans || []).reduce(
    (sum, l) => sum + (Number(l.monthlyEmi) || 0),
    0
  );

  const hasLoans = (formData.loans || []).length > 0;

  const handleExpenseChange = (field, value) => {
    onChange('monthlyExpenses', {
      ...expenses,
      [field]: value === '' ? '' : Number(value),
    });
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
          <span>{t('financialProfile.sections.expenses')}</span>
        </div>
      }
      subtitle={t('financialProfile.sections.expensesSubtitle')}
      className="transition-all"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Food & Groceries */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('financialProfile.expenses.food')}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                ₹
              </div>
              <input
                type="number"
                min="0"
                step="100"
                value={expenses.food ?? ''}
                onChange={(e) => handleExpenseChange('food', e.target.value)}
                placeholder="e.g. 5,000"
                className="w-full pl-8 pr-3 py-2 text-sm bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* 2. Rent (Auto-synced if Rented) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('financialProfile.expenses.rent')}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                ₹
              </div>
              <input
                type="number"
                min="0"
                step="100"
                disabled={isRented}
                value={isRented ? (housingRent || '') : (expenses.rent ?? '')}
                onChange={(e) => handleExpenseChange('rent', e.target.value)}
                placeholder="e.g. 10,000"
                className={`w-full pl-8 pr-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400 ${
                  isRented
                    ? 'bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-not-allowed opacity-90'
                    : 'bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800'
                }`}
              />
            </div>
          </div>

          {/* 3. Electricity & Utilities */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('financialProfile.expenses.utilities')}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                ₹
              </div>
              <input
                type="number"
                min="0"
                step="100"
                value={expenses.utilities ?? ''}
                onChange={(e) => handleExpenseChange('utilities', e.target.value)}
                placeholder="e.g. 2,000"
                className="w-full pl-8 pr-3 py-2 text-sm bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* 4. Transport & Fuel */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('financialProfile.expenses.transport')}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                ₹
              </div>
              <input
                type="number"
                min="0"
                step="100"
                value={expenses.transport ?? ''}
                onChange={(e) => handleExpenseChange('transport', e.target.value)}
                placeholder="e.g. 2,500"
                className="w-full pl-8 pr-3 py-2 text-sm bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* 5. Education */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('financialProfile.expenses.education')}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                ₹
              </div>
              <input
                type="number"
                min="0"
                step="100"
                value={expenses.education ?? ''}
                onChange={(e) => handleExpenseChange('education', e.target.value)}
                placeholder="e.g. 0"
                className="w-full pl-8 pr-3 py-2 text-sm bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* 6. Medical & Healthcare */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('financialProfile.expenses.medical')}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                ₹
              </div>
              <input
                type="number"
                min="0"
                step="100"
                value={expenses.medical ?? ''}
                onChange={(e) => handleExpenseChange('medical', e.target.value)}
                placeholder="e.g. 1,000"
                className="w-full pl-8 pr-3 py-2 text-sm bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* 7. Loan EMI (Auto-synced if loans present) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('financialProfile.expenses.loanEmi')}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                ₹
              </div>
              <input
                type="number"
                min="0"
                step="100"
                disabled={hasLoans}
                value={hasLoans ? (totalLoanEmi || '') : (expenses.loanEmi ?? '')}
                onChange={(e) => handleExpenseChange('loanEmi', e.target.value)}
                placeholder="e.g. 4,500"
                className={`w-full pl-8 pr-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400 ${
                  hasLoans
                    ? 'bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-not-allowed opacity-90'
                    : 'bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800'
                }`}
              />
            </div>
          </div>

          {/* 8. Other Discretionary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('financialProfile.expenses.other')}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                ₹
              </div>
              <input
                type="number"
                min="0"
                step="100"
                value={expenses.other ?? ''}
                onChange={(e) => handleExpenseChange('other', e.target.value)}
                placeholder="e.g. 1,000"
                className="w-full pl-8 pr-3 py-2 text-sm bg-white/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Sync Informational Notices */}
        <div className="space-y-2 pt-1">
          {isRented && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
              <Info className="w-4 h-4 shrink-0" />
              <span>{t('financialProfile.expenses.rentSyncedNotice')}</span>
            </div>
          )}

          {hasLoans && (
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-300">
              <Info className="w-4 h-4 shrink-0" />
              <span>{t('financialProfile.expenses.loanEmiSyncedNotice')}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ExpenseSection;
