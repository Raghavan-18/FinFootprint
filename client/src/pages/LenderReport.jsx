import PageHeader from '../components/common/PageHeader';
import LenderReport from '../components/lender/LenderReport';
import LoadingState from '../components/common/LoadingState';

/**
 * LenderReport Page
 *
 * Institutional Underwriting Dossier generated for NBFCs and Banks.
 */
export function LenderReportPage({
  report,
  profile,
  stats,
  isLoading = false,
  onNavigate,
}) {
  if (isLoading) {
    return <LoadingState message="Compiling formal credit underwriting dossier..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Lender Credit Assessment Dossier"
        description="Formal auditable evaluation package for bank credit committees, loan officers, and automated fintech underwriters"
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
          { label: 'Lender Dossier' },
        ]}
      />

      <LenderReport report={report} profile={profile} stats={stats} />
    </div>
  );
}

export default LenderReportPage;
