import TransactionCard from './TransactionCard';
import EmptyState from '../common/EmptyState';
import LoadingState from '../common/LoadingState';

/**
 * Reusable TransactionList container component
 *
 * @param {Object} props
 * @param {Array<Object>} props.transactions
 * @param {boolean} [props.isLoading=false]
 * @param {Function} [props.onSelectTransaction]
 * @param {number} [props.limit]
 * @param {boolean} [props.compact=false]
 * @param {string} [props.emptyTitle='No transactions recorded']
 * @param {string} [props.emptyDescription='Start by logging your recent activity or syncing your accounts.']
 * @param {React.ReactNode} [props.emptyAction]
 * @param {string} [props.className='']
 */
export function TransactionList({
  transactions = [],
  isLoading = false,
  onSelectTransaction,
  limit,
  compact = false,
  emptyTitle = 'No transactions recorded',
  emptyDescription = 'Start by logging your recent activity or syncing your accounts.',
  emptyAction = null,
  className = '',
}) {
  if (isLoading) {
    return <LoadingState type="skeleton" count={4} className={className} />;
  }

  const displayedTransactions = limit
    ? transactions.slice(0, limit)
    : transactions;

  if (displayedTransactions.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
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
