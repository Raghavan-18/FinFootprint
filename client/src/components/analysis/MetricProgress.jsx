/**
 * Reusable MetricProgress Component with benchmark tick indicator — FinFootprint v2 Design System
 *
 * Uses design system semantic colors based on status.
 *
 * @param {Object} props
 * @param {number} props.value - Score/Progress (0 - 100)
 * @param {number} [props.max=100]
 * @param {'HIGH'|'OPTIMAL'|'MEDIUM'|'LOW'|'CRITICAL'|string} [props.status='HIGH']
 * @param {string} [props.benchmark]
 * @param {string} [props.className='']
 */
export function MetricProgress({
  value = 0,
  max = 100,
  status = 'HIGH',
  benchmark = '',
  className = '',
}) {
  const percentage = Math.min(Math.max(0, Math.round((value / max) * 100)), 100);

  const getStatusColor = (st) => {
    switch (String(st).toUpperCase()) {
      case 'OPTIMAL':
      case 'HIGH':
        return 'bg-verified';
      case 'MEDIUM':
      case 'MODERATE':
        return 'bg-corroborated';
      case 'LOW':
      case 'CAUTION':
        return 'bg-turmeric-500';
      case 'CRITICAL':
        return 'bg-mismatch';
      default:
        return 'bg-indigo-600';
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getStatusColor(status)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {benchmark && (
        <div className="flex justify-between items-center text-[11px] text-neutral-500 dark:text-neutral-400">
          <span>{benchmark}</span>
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
            {value} / {max}
          </span>
        </div>
      )}
    </div>
  );
}

export default MetricProgress;