import Modal from '../common/Modal';
import Button from '../common/Button';
import TransactionDetails from './TransactionDetails';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable TransactionDetailsModal Component with localization
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Object} props.transaction
 */
export function TransactionDetailsModal({ isOpen, onClose, transaction }) {
  const { t } = useLanguage();
  if (!transaction) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('transactions.modalTitle')}
      description={`${t('transactions.recordId')} ${transaction.id || t('common.na')}`}
      size="lg"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          {t('common.closeRecord')}
        </Button>
      }
    >
      <TransactionDetails transaction={transaction} />
    </Modal>
  );
}

export default TransactionDetailsModal;
