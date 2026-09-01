import Card from '../common/Card';
import { BarChart3 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable FinancialOverview component with localization
 *
 * @param {Object} props
 * @param {Array<Object>} [props.cashflows=[]]
 * @param {Object} [props.stats]
 * @param {string} [props.className='']
 */
export function FinancialOverview({ cashflows = [], stats, className = '' }) {
  const { t } = useLanguage();
  const hasCashflows = cashflows && cashflows.length > 0;

  const maxAmount = hasCashflows
    ? Math.max(...cashflows.map((c) => Math.max(c.income || 0, c.expenses || 0)), 1000)
    : 1000;

  return (
    <Card
      title={t('dashboard.cashflowVelocityTitle')}
      subtitle={t('dashboard.cashflowVelocitySubtitle')}
      className={className}
    >
      {/* Visual Bar Graph or Empty State */}
      <div className="space-y-5">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span className="w-3 h-3 rounded-xs bg-emerald-500" />
              {t('common.inflow')}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
              <span className="w-3 h-3 rounded-xs bg-slate-400 dark:bg-slate-600" />
              {t('common.outflow')}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">{t('common.valuesInInr')}</span>
        </div>

        {hasCashflows ? (
          <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 sm:h-56 pt-4">
            {cashflows.map((item, idx) => {
              const incomeHeight = Math.round(((item.income || 0) / maxAmount) * 100);
              const expenseHeight = Math.round(((item.expenses || 0) / maxAmount) * 100);

              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full pb-2">
                    {/* Income bar */}
                    <div
                      className="w-full max-w-[20px] sm:max-w-[28px] bg-emerald-500 rounded-t-md transition-all duration-500 group-hover:bg-emerald-400 relative"
                      style={{ height: `${Math.max(incomeHeight, 2)}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded-sm whitespace-nowrap pointer-events-none z-10 transition-opacity">
                        +{formatCurrency(item.income, { compact: true })}
                      </div>
                    </div>

                    {/* Expense bar */}
                    <div
                      className="w-full max-w-[20px] sm:max-w-[28px] bg-slate-300 dark:bg-slate-700 rounded-t-md transition-all duration-500 group-hover:bg-slate-400 relative"
                      style={{ height: `${Math.max(expenseHeight, 2)}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded-sm whitespace-nowrap pointer-events-none z-10 transition-opacity">
                        -{formatCurrency(item.expenses, { compact: true })}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate w-full text-center mt-1">
                    {item.month ? item.month.split(' ')[0] : ''}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(item.net, { compact: true })}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 sm:h-56 p-6 text-center rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800">
            <BarChart3 className="w-8 h-8 text-slate-400 dark:text-slate-600 mb-2" />
            <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 max-w-xs">
              {t('dashboard.emptyChart')}
            </p>
          </div>
        )}
      </div>

      {/* Summary Footers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500">{t('dashboard.totalRecordedVolume')}</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {formatCurrency(stats?.totalRecordedTurnover || 0)}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500">{t('dashboard.gstCorroborated')}</span>
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
            {stats?.gstVerifiedTurnoverRatio !== null && stats?.gstVerifiedTurnoverRatio !== undefined
              ? `${stats.gstVerifiedTurnoverRatio}% ${t('dashboard.ofTotal')}`
              : '—'}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500">{t('dashboard.cashflowRunwayCapacity')}</span>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {stats?.cashflowRunwayMonths
              ? `${stats.cashflowRunwayMonths} ${t('dashboard.monthsReserve')}`
              : '—'}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default FinancialOverview;
