import Card from '../common/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Reusable StatCard Component — FinFootprint v2 Design System
 *
 * Variants: default, success, warning, danger (matching evidence tiers)
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
 * @param {'default'|'success'|'warning'|'danger'} [props.variant='default']
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
  variant = 'default',
  className = '',
}) {
  const isPositive = trendDirection === 'up';

  const variantStyles = {
    default: {
      iconBg: 'bg-neutral-100 dark:bg-neutral-800',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      valueColor: 'text-neutral-950 dark:text-neutral-50',
      borderColor: 'border-neutral-200 dark:border-neutral-800',
    },
    success: {
      iconBg: 'bg-verified-bg dark:bg-verified-bg-dark',
      iconColor: 'text-verified dark:text-verified',
      valueColor: 'text-neutral-950 dark:text-neutral-50',
      borderColor: 'border-verified-border dark:border-verified-border-dark',
    },
    warning: {
      iconBg: 'bg-self-declared-bg dark:bg-self-declared-bg-dark',
      iconColor: 'text-self-declared dark:text-self-declared',
      valueColor: 'text-neutral-950 dark:text-neutral-50',
      borderColor: 'border-self-declared-border dark:border-self-declared-border-dark',
    },
    danger: {
      iconBg: 'bg-mismatch-bg dark:bg-mismatch-bg-dark',
      iconColor: 'text-mismatch dark:text-mismatch',
      valueColor: 'text-neutral-950 dark:text-neutral-50',
      borderColor: 'border-mismatch-border dark:border-mismatch-border-dark',
    },
  };

  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <Card
      variant="default"
      className={`h-full flex flex-col justify-between ${styles.borderColor} ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            {icon && (
              <div className={`w-9 h-9 rounded-xl ${styles.iconBg} ${styles.iconColor} flex items-center justify-center shrink-0`}>
                {icon}
              </div>
            )}
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {title}
            </span>
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        <div className="flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${styles.valueColor}`}>
            {value}
          </span>
        </div>

        {description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {trend && (
        <div className="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center gap-1.5 text-xs">
          <span
            className={`font-semibold flex items-center gap-0.5 ${
              isPositive
                ? 'text-success dark:text-success'
                : 'text-error dark:text-error'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {trend}
          </span>
          <span className="text-neutral-400 dark:text-neutral-500">{trendLabel}</span>
        </div>
      )}
    </Card>
  );
}

export default StatCard;