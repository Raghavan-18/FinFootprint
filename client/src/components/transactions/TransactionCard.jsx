import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import EvidenceBadge from '../evidence/EvidenceBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable TransactionCard Component with localization — FinFootprint v2 Design System
 *
 * Uses warm slate surfaces, semantic colors for income/expense,
 * and evidence badges integrated with design system.
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
  const { t } = useLanguage();
  if (!transaction) return null;

  const isIncome = (transaction.type || 'INCOME').toUpperCase() === 'INCOME';
  const categoryLabel =
    t(`transactions.categories.${transaction.category}`) || transaction.category;
  const paymentMethodLabel =
    transaction.paymentMethod
      ? t(`activity.paymentMethods.${transaction.paymentMethod.toLowerCase()}`) || transaction.paymentMethod
      : null;

  return (
    <div
      onClick={() => onClick && onClick(transaction)}
      className={`group relative flex items-center justify-between p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-surface-raised hover:border-indigo-500/30 dark:hover:border-indigo-900/50 hover:shadow-xs transition-all duration-150 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Left: Direction Icon & Details */}
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        {/* Type Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isIncome
              ? 'bg-verified-bg text-verified dark:bg-verified-bg-dark dark:text-verified'
              : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
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
            <h4 className="text-sm font-semibold text-neutral-950 dark:text-neutral-50 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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

          <div className="flex items-center gap-2.5 text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate">
            {paymentMethodLabel && (
              <>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded-sm text-[10px]">
                  {paymentMethodLabel}
                </span>
                <span>•</span>
              </>
            )}
            {transaction.counterparty && (
              <span className="truncate max-w-[140px] sm:max-w-[180px]">
                {transaction.counterparty}
              </span>
            )}
            {transaction.category && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-neutral-600 dark:text-neutral-300 font-medium">
                  {categoryLabel}
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
                ? 'text-verified dark:text-verified'
                : 'text-neutral-950 dark:text-neutral-50'
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
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:tranneutral-x-0.5 transition-all hidden sm:block shrink-0" />
        )}
      </div>
    </div>
  );
}

export default TransactionCard;