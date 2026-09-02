import { Search, X } from 'lucide-react';
import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable TransactionFilters component with localization
 *
 * @param {Object} props
 * @param {string} props.searchQuery
 * @param {Function} props.onSearchChange
 * @param {string} props.selectedType
 * @param {Function} props.onTypeChange
 * @param {string} props.selectedStatus
 * @param {Function} props.onStatusChange
 * @param {Function} [props.onReset]
 * @param {string} [props.className='']
 */
export function TransactionFilters({
  searchQuery = '',
  onSearchChange,
  selectedType = 'ALL',
  onTypeChange,
  selectedStatus = 'ALL',
  onStatusChange,
  onReset,
  className = '',
}) {
  const { t } = useLanguage();
  const hasActiveFilters =
    searchQuery !== '' || selectedType !== 'ALL' || selectedStatus !== 'ALL';

  return (
    <div
      className={`p-4 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-800/70 space-y-3 shadow-lg shadow-black/5 ${className}`}
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('history.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
          >
            <option value="ALL">{t('history.allFlows')}</option>
            <option value="INCOME">{t('history.incomeFlows')}</option>
            <option value="EXPENSE">{t('history.expenseFlows')}</option>
          </select>

          {/* Evidence Tier Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
          >
            <option value="ALL">{t('history.allTiers')}</option>
            <option value="VERIFIED">{t('evidence.statuses.VERIFIED')}</option>
            <option value="CORROBORATED">{t('evidence.statuses.CORROBORATED')}</option>
            <option value="SELF_DECLARED">{t('evidence.statuses.SELF_DECLARED')}</option>
            <option value="MISMATCH">{t('evidence.statuses.MISMATCH')}</option>
          </select>

          {hasActiveFilters && onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-slate-500 hover:text-slate-800 text-xs shrink-0"
            >
              {t('common.reset')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionFilters;
