import TransactionCard from './TransactionCard';
import EmptyState from '../common/EmptyState';
import LoadingState from '../common/LoadingState';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable TransactionList container component with localization
 *
 * @param {Object} props
 * @param {Array<Object>} props.transactions
 * @param {boolean} [props.isLoading=false]
 * @param {Function} [props.onSelectTransaction]
 * @param {number} [props.limit]
 * @param {boolean} [props.compact=false]
 * @param {string} [props.emptyTitle]
 * @param {string} [props.emptyDescription]
 * @param {React.ReactNode} [props.emptyAction]
 * @param {string} [props.className='']
 */
export function TransactionList({
  transactions = [],
  isLoading = false,
  onSelectTransaction,
  limit,
  compact = false,
  emptyTitle,
  emptyDescription,
  emptyAction = null,
  className = '',
}) {
  const { t } = useLanguage();

  if (isLoading) {
    return <LoadingState type="skeleton" count={4} className={className} />;
  }

  const displayedTransactions = limit
    ? transactions.slice(0, limit)
    : transactions;

  if (displayedTransactions.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || t('transactions.emptyTitle')}
        description={emptyDescription || t('transactions.emptyDesc')}
        action={emptyAction}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      {displayedTransactions.map((tx) => (
        <TransactionCard
          key={tx.id}
          transaction={tx}
          onClick={onSelectTransaction}
          compact={compact}
        />
      ))}
    </div>
  );
}

export default TransactionList;
