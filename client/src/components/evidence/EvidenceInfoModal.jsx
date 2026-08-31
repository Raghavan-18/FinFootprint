import Modal from '../common/Modal';
import Button from '../common/Button';
import EvidenceExplanation from './EvidenceExplanation';

/**
 * Reusable EvidenceInfoModal component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 */
export function EvidenceInfoModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Evidence & Verification Framework"
      description="Understanding how FinFootprint validates informal transactions into creditworthy footprints"
      size="lg"
      footer={
        <Button variant="primary" size="sm" onClick={onClose}>
          Got it
        </Button>
      }
    >
      <EvidenceExplanation />
    </Modal>
  );
}

export default EvidenceInfoModal;
