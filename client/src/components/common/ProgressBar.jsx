
/**
 * Reusable Progress Bar Component
 *
 * @param {Object} props
 * @param {number} props.value - Current progress value (e.g. 87)
 * @param {number} [props.max=100] - Max value
 * @param {'auto'|'emerald'|'indigo'|'blue'|'amber'|'rose'|'gradient'} [props.variant='auto']
 * @param {'xs'|'sm'|'md'|'lg'} [props.height='md']
 * @param {boolean} [props.showLabel=false]
 * @param {string} [props.label]
 * @param {string} [props.className='']
 */
export function ProgressBar({
  value = 0,
  max = 100,
  variant = 'auto',
  height = 'md',
  showLabel = false,
  label = '',
  className = '',
}) {
  const clampedValue = Math.min(Math.max(0, Number(value) || 0), max);
  const percentage = Math.round((clampedValue / max) * 100);

  const getAutoColor = (pct) => {
    if (pct >= 80) return 'bg-emerald-500';
    if (pct >= 60) return 'bg-blue-500';
    if (pct >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const variantColors = {
    auto: getAutoColor(percentage),
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    gradient: 'bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500',
  };

  const heightStyles = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-medium">{label || 'Progress'}</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200">
            {percentage}%
          </span>
        </div>
      )}
      <div
        className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${
          heightStyles[height] || heightStyles.md
        }`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            variantColors[variant] || variantColors.auto
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
