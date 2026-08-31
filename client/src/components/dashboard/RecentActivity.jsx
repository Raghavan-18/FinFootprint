import Card from '../common/Card';
import TransactionList from '../transactions/TransactionList';
import Button from '../common/Button';
import { ArrowRight } from 'lucide-react';

/**
 * Reusable RecentActivity dashboard component
 *
 * @param {Object} props
 * @param {Array<Object>} props.transactions
 * @param {boolean} [props.isLoading=false]
 * @param {Function} [props.onSelectTransaction]
 * @param {Function} [props.onViewAll]
 * @param {string} [props.className='']
 */
export function RecentActivity({
  transactions = [],
  isLoading = false,
  onSelectTransaction,
  onViewAll,
  className = '',
}) {
  return (
    <Card
      title="Recent Verified Activity"
      subtitle="Latest incoming & outgoing financial logs with evidence trails"
      headerAction={
        onViewAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
          >
            Full Ledger
          </Button>
        )
      }
      className={className}
    >
      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        onSelectTransaction={onSelectTransaction}
        limit={5}
        compact={false}
      />
    </Card>
  );
}

export default RecentActivity;
