import Modal from '../common/Modal';
import Button from '../common/Button';
import TransactionDetails from './TransactionDetails';

/**
 * Reusable TransactionDetailsModal Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Object} props.transaction
 */
export function TransactionDetailsModal({ isOpen, onClose, transaction }) {
  if (!transaction) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction & Evidence Record"
      description={`ID: ${transaction.id || 'N/A'}`}
      size="lg"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close Record
        </Button>
      }
    >
      <TransactionDetails transaction={transaction} onClose={onClose} />
    </Modal>
  );
}

export default TransactionDetailsModal;
