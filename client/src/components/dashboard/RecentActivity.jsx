import Card from '../common/Card';
import TransactionList from '../transactions/TransactionList';
import Button from '../common/Button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable RecentActivity dashboard component with localization
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
  const { t } = useLanguage();

  return (
    <Card
      title={t('dashboard.recentActivityTitle')}
      subtitle={t('dashboard.recentActivitySubtitle')}
      headerAction={
        onViewAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
          >
            {t('common.fullLedger')}
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
