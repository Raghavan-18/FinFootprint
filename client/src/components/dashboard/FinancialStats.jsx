import StatCard from './StatCard';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  Wallet,
  ArrowDownRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import Badge from '../common/Badge';

/**
 * Reusable FinancialStats component
 *
 * @param {Object} props
 * @param {Object} props.stats - Stats data object
 * @param {Object} [props.profile] - Profile data object
 * @param {string} [props.className='']
 */
export function FinancialStats({ stats, profile, className = '' }) {
  if (!stats) return null;

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 ${className}`}
    >
      <StatCard
        title="Avg Monthly Inflows"
        value={formatCurrency(stats.monthlyIncomeAvg)}
        description="Verified baseline turnover"
        icon={<Wallet className="w-5 h-5" />}
        trend={`+${stats.monthlyGrowthRate || 8.4}%`}
        trendDirection="up"
        trendLabel="MoM Growth"
      />

      <StatCard
        title="Avg Monthly Outflows"
        value={formatCurrency(stats.monthlyExpensesAvg)}
        description="Operating costs & overheads"
        icon={<ArrowDownRight className="w-5 h-5" />}
        trend="-2.1%"
        trendDirection="down"
        trendLabel="Optimized"
      />

      <StatCard
        title="Net Monthly Surplus"
        value={formatCurrency(stats.netMonthlyCashflow)}
        description="Unencumbered free cashflow"
        icon={<TrendingUp className="w-5 h-5" />}
        badge={<Badge variant="emerald" size="sm">Healthy</Badge>}
      />

      <StatCard
        title="Trust Footprint Score"
        value={profile?.footprintScore || 784}
        description="Alternative Underwriting Index"
        icon={<ShieldCheck className="w-5 h-5" />}
        badge={<Badge variant="indigo" size="sm">Grade {profile?.trustGrade || 'A'}</Badge>}
        trend="+18 pts"
        trendDirection="up"
        trendLabel="this quarter"
      />
    </div>
  );
}

export default FinancialStats;
