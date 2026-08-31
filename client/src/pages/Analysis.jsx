import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import AnalysisExplanation from '../components/analysis/AnalysisExplanation';
import AnalysisCard from '../components/analysis/AnalysisCard';
import AnomalyCard from '../components/analysis/AnomalyCard';
import TransactionDetailsModal from '../components/transactions/TransactionDetailsModal';
import LoadingState from '../components/common/LoadingState';

/**
 * Analysis Page
 *
 * Deep dive into behavioral indicators, income stability, DSCR,
 * cashflow volatility, and anomaly detection.
 */
export function Analysis({
  analysisData,
  transactions = [],
  isLoading = false,
  onNavigate,
}) {
  const [selectedTx, setSelectedTx] = useState(null);

  if (isLoading) {
    return <LoadingState message="Running behavioral risk models..." />;
  }

  const { metrics = [], anomalies = [] } = analysisData || {};

  const handleViewFlaggedTransaction = (txId) => {
    const found = transactions.find((t) => t.id === txId);
    if (found) {
      setSelectedTx(found);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Behavioral & Risk Analysis"
        description="Machine-learning synthesized financial health indicators evaluating stability, leverage cushion, and cashflow consistency"
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
          { label: 'Risk Analysis' },
        ]}
      />

      {/* AI Synthesis Header */}
      <AnalysisExplanation />

      {/* Grid of Key Metrics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Core Financial Pillars
          </h3>
          <span className="text-xs text-slate-500">
            5 verified predictive signals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {metrics.map((metric) => (
            <AnalysisCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>

      {/* Anomalies / Flagged Items */}
      {anomalies.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Discrepancy & Anomaly Detection
            </h3>
            <span className="text-xs text-rose-500 font-semibold">
              {anomalies.length} items flagged for review
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anomalies.map((anom) => (
              <AnomalyCard
                key={anom.id}
                anomaly={anom}
                onViewTransaction={handleViewFlaggedTransaction}
                onResolve={(a) => alert(`Resolving verification for: ${a.title}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      <TransactionDetailsModal
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />
    </div>
  );
}

export default Analysis;
