import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Generic Reusable Modal Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {string|React.ReactNode} [props.title]
 * @param {string|React.ReactNode} [props.description]
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'} [props.size='md']
 * @param {React.ReactNode} [props.footer]
 * @param {React.ReactNode} props.children
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  footer = null,
  children,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${
          sizeStyles[size] || sizeStyles.md
        } bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 my-8 transition-all transform animate-in fade-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800/80 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white leading-snug">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">{children}</div>

        {/* Optional Footer */}
        {footer && (
          <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-950/50 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
