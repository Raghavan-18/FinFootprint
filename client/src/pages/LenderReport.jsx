import PageHeader from '../components/common/PageHeader';
import LenderReport from '../components/lender/LenderReport';
import LoadingState from '../components/common/LoadingState';
import { useLanguage } from '../hooks/useLanguage';

/**
 * LenderReport Page with localization
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
  const { t } = useLanguage();

  if (isLoading) {
    return <LoadingState message={t('common.loadingData')} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title={t('lenderReport.pageTitle')}
        description={t('lenderReport.pageSubtitle')}
        breadcrumbs={[
          { label: t('navigation.dashboard'), onClick: () => onNavigate('dashboard') },
          { label: t('navigation.lenderReport') },
        ]}
      />

      <LenderReport report={report} profile={profile} stats={stats} />
    </div>
  );
}

export default LenderReportPage;
