import Modal from '../common/Modal';
import Button from '../common/Button';
import EvidenceExplanation from './EvidenceExplanation';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable EvidenceInfoModal component with localization
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 */
export function EvidenceInfoModal({ isOpen, onClose }) {
  const { t } = useLanguage();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('evidence.modalTitle')}
      description={t('evidence.modalSubtitle')}
      size="lg"
      footer={
        <Button variant="primary" size="sm" onClick={onClose}>
          {t('common.gotIt')}
        </Button>
      }
    >
      <EvidenceExplanation />
    </Modal>
  );
}

export default EvidenceInfoModal;
