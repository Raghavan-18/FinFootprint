import { ShieldCheck, CheckCheck, FileText, AlertTriangle } from 'lucide-react';
import { getEvidenceConfig } from '../../utils/evidenceUtils';
import Tooltip from '../common/Tooltip';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable EvidenceBadge component with automatic localization — FinFootprint v2 Design System
 *
 * Variants use design system semantic colors:
 * - VERIFIED: Verified green (bank-grade)
 * - CORROBORATED: Corroborated blue (cross-referenced)
 * - SELF_DECLARED: Turmeric (daily commerce, pending)
 * - MISMATCH: Terracotta/red (discrepancy)
 *
 * @param {Object} props
 * @param {'VERIFIED'|'CORROBORATED'|'SELF_DECLARED'|'MISMATCH'|string} props.status
 * @param {'sm'|'md'|'lg'} [props.size='sm']
 * @param {boolean} [props.showIcon=true]
 * @param {boolean} [props.showTooltip=true]
 * @param {boolean} [props.interactive=false]
 * @param {Function} [props.onClick]
 * @param {string} [props.className='']
 */
export function EvidenceBadge({
  status = 'SELF_DECLARED',
  size = 'sm',
  showIcon = true,
  showTooltip = false,
  interactive = false,
  onClick,
  className = '',
}) {
  const { t } = useLanguage();
  const config = getEvidenceConfig(status);
  const normalized = (status || 'SELF_DECLARED').toUpperCase().trim();

  // Localized label and description
  const label = t(`evidence.statuses.${normalized}`) || config.label;
  const description = t(`evidence.descriptions.${normalized}`) || config.description;

  const getIcon = (iconName, sizeClass) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className={sizeClass} />;
      case 'CheckCheck':
        return <CheckCheck className={sizeClass} />;
      case 'FileText':
        return <FileText className={sizeClass} />;
      case 'AlertTriangle':
        return <AlertTriangle className={sizeClass} />;
      default:
        return <FileText className={sizeClass} />;
    }
  };

  const sizeStyles = {
    sm: {
      badge: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium rounded-full',
      icon: 'w-3.5 h-3.5 shrink-0',
    },
    md: {
      badge: 'text-xs px-3 py-1 gap-1.5 font-semibold rounded-full',
      icon: 'w-4 h-4 shrink-0',
    },
    lg: {
      badge: 'text-sm px-3.5 py-1.5 gap-2 font-semibold rounded-full',
      icon: 'w-4.5 h-4.5 shrink-0',
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.sm;
  const cursorStyle = interactive || onClick ? 'cursor-pointer hover:opacity-90 active:scale-95' : 'cursor-default';

  const badgeElement = (
    <span
      onClick={onClick}
      className={`inline-flex items-center border select-none transition-all duration-150 ${config.badgeBg} ${currentSize.badge} ${cursorStyle} ${className}`}
    >
      {showIcon && getIcon(config.iconName, currentSize.icon)}
      <span className="truncate">{label}</span>
    </span>
  );

  if (showTooltip) {
    return (
      <Tooltip content={`${label}: ${description}`}>
        {badgeElement}
      </Tooltip>
    );
  }

  return badgeElement;
}

export default EvidenceBadge;