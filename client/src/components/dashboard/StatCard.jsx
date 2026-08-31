import Card from '../common/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Reusable StatCard Component
 *
 * @param {Object} props
 * @param {string} props.title - Metric Title
 * @param {string|number} props.value - Display Value (e.g. "₹48,650")
 * @param {string} [props.description] - Descriptive context
 * @param {React.ReactNode} [props.icon] - Leading Icon
 * @param {string|number} [props.trend] - Growth/Change percentage (e.g. "+8.4%")
 * @param {'up'|'down'|'neutral'} [props.trendDirection='up']
 * @param {string} [props.trendLabel] - e.g. "vs last month"
 * @param {React.ReactNode} [props.badge] - Optional badge
 * @param {string} [props.className='']
 */
export function StatCard({
  title,
  value,
  description,
  icon = null,
  trend = null,
  trendDirection = 'up',
  trendLabel = 'vs last month',
  badge = null,
  className = '',
}) {
  const isPositive = trendDirection === 'up';

  return (
    <Card className={`h-full flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            {icon && (
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {title}
            </span>
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </span>
        </div>

        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {trend && (
        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs">
          <span
            className={`font-semibold flex items-center gap-0.5 ${
              isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {trend}
          </span>
          <span className="text-slate-400">{trendLabel}</span>
        </div>
      )}
    </Card>
  );
}

export default StatCard;
