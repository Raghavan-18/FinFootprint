import { useState } from 'react';

/**
 * Reusable Tooltip component
 *
 * @param {Object} props
 * @param {string|React.ReactNode} props.content
 * @param {'top'|'bottom'|'left'|'right'} [props.position='top']
 * @param {React.ReactNode} props.children
 */
export function Tooltip({ content, position = 'top', children }) {
  const [isVisible, setIsVisible] = useState(false);

  if (!content) return children;

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute ${positionStyles[position]} z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-slate-800 border border-slate-700 rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-all duration-150 animate-in fade-in`}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
