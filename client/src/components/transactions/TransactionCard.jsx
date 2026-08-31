import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import EvidenceBadge from '../evidence/EvidenceBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

/**
 * Reusable TransactionCard Component
 *
 * @param {Object} props
 * @param {Object} props.transaction
 * @param {Function} [props.onClick]
 * @param {boolean} [props.compact=false]
 * @param {boolean} [props.showChevron=true]
 * @param {string} [props.className='']
 */
export function TransactionCard({
  transaction,
  onClick,
  compact = false,
  showChevron = true,
  className = '',
}) {
  if (!transaction) return null;

  const isIncome = (transaction.type || 'INCOME').toUpperCase() === 'INCOME';

  return (
    <div
      onClick={() => onClick && onClick(transaction)}
      className={`group relative flex items-center justify-between p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:shadow-xs transition-all duration-150 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Left: Direction Icon & Details */}
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        {/* Type Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isIncome
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          {isIncome ? (
            <ArrowDownLeft className="w-5 h-5" />
          ) : (
            <ArrowUpRight className="w-5 h-5" />
          )}
        </div>

        {/* Text Details */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {transaction.title}
            </h4>
            {!compact && (
              <EvidenceBadge
                status={transaction.evidenceStatus}
                size="sm"
                className="hidden sm:inline-flex"
              />
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
            {transaction.counterparty && (
              <span className="truncate max-w-[140px] sm:max-w-[200px]">
                {transaction.counterparty}
              </span>
            )}
            {transaction.category && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-slate-600 dark:text-slate-300 font-medium">
                  {transaction.category}
                </span>
              </>
            )}
            <span>•</span>
            <span>{formatDate(transaction.date, { format: 'short' })}</span>
          </div>
        </div>
      </div>

      {/* Right: Amount & Evidence Badge */}
      <div className="flex items-center gap-3 shrink-0 text-right">
        <div>
          <p
            className={`text-sm sm:text-base font-bold tracking-tight ${
              isIncome
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </p>
          <div className="sm:hidden mt-0.5">
            <EvidenceBadge status={transaction.evidenceStatus} size="sm" />
          </div>
        </div>

        {showChevron && (
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all hidden sm:block shrink-0" />
        )}
      </div>
    </div>
  );
}

export default TransactionCard;
