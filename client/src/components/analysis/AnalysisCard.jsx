import MetricCard from './MetricCard';

/**
 * Reusable AnalysisCard wrapper for standardized metric presentation
 *
 * @param {Object} props
 * @param {Object} props.metric
 * @param {Function} [props.onExplain]
 * @param {string} [props.className='']
 */
export function AnalysisCard({ metric, className = '' }) {
  if (!metric) return null;

  return (
    <MetricCard
      title={metric.title}
      value={metric.value}
      max={metric.max || 100}
      status={metric.status || 'HIGH'}
      description={metric.description}
      trend={metric.trend}
      benchmark={metric.benchmark}
      factors={metric.factors || []}
      className={className}
    />
  );
}

export default AnalysisCard;
