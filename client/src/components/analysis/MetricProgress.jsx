
/**
 * Reusable MetricProgress Component with benchmark tick indicator
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
        return 'bg-emerald-500';
      case 'MEDIUM':
      case 'MODERATE':
        return 'bg-blue-500';
      case 'LOW':
      case 'CAUTION':
        return 'bg-amber-500';
      case 'CRITICAL':
        return 'bg-rose-500';
      default:
        return 'bg-indigo-600';
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getStatusColor(
            status
          )}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {benchmark && (
        <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
          <span>{benchmark}</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {value} / {max}
          </span>
        </div>
      )}
    </div>
  );
}

export default MetricProgress;
