import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import AnalysisExplanation from '../components/analysis/AnalysisExplanation';
import AnalysisCard from '../components/analysis/AnalysisCard';
import AnomalyCard from '../components/analysis/AnomalyCard';
import EmptyState from '../components/common/EmptyState';
import TransactionDetailsModal from '../components/transactions/TransactionDetailsModal';
import LoadingState from '../components/common/LoadingState';
import { useLanguage } from '../hooks/useLanguage';

/**
 * Analysis Page with localization
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
  const { t, isTamil } = useLanguage();
  const [selectedTx, setSelectedTx] = useState(null);

  if (isLoading) {
    return <LoadingState message={t('dashboard.loading')} />;
  }

  const { metrics = [], anomalies = [], hasSufficientData } = analysisData || {};

  const handleViewFlaggedTransaction = (txId) => {
    const found = transactions.find((t) => t.id === txId);
    if (found) {
      setSelectedTx(found);
    }
  };

  // Localize metrics if in Tamil
  const localizedMetrics = metrics.map((m) => {
    if (!isTamil) return m;

    const metricMap = {
      metric_income_stability: {
        title: 'வருமான நிலைத்தன்மைக் குறியீடு',
        description: 'தொடர்ச்சியான வாடிக்கையாளர் கொடுப்பனவுகள் மற்றும் சரிபார்க்கப்பட்ட வங்கி வைப்புகளில் 6 மாத மாறுபாட்டின் குணகம் மூலம் அளவிடப்படுகிறது.',
        benchmark: 'துறை அடிப்படை அளவு: 72',
        factors: [
          '3 செயலில் உள்ள காலாண்டு தொடர் சேவை ஒப்பந்தங்கள் அடிப்படை நிலைத்தன்மையை வழங்குகின்றன.',
          'குறைந்த வருவாய் பருவ மாறுபாடு (மாதந்தோறும் < 14%).',
          '86% டிஜிட்டல் பணப்புழக்க தடம் நம்பகமான சரிபார்ப்பை வழங்குகிறது.',
        ],
      },
      metric_expense_discipline: {
        title: 'செலவு-வருமான விகிதம்',
        description: 'நிலையான நிர்வாகச் செலவுகள் மற்றும் இயக்க கொள்முதல் மூலம் நுகரப்படும் மாதாந்திர வருவாயின் சராசரி விகிதம்.',
        benchmark: 'ஆரோக்கியமான வரம்பு: < 65%',
        factors: [
          'பட்டறை வாடகை & பயன்பாட்டுக் கட்டணங்கள் மொத்த வருவாயில் 17% ஆக நிலையாக உள்ளன.',
          'மூலப்பொருள் கொள்முதல் திட்ட மைல்கல் வரவுகளுடன் இறுக்கமாக சீரமைக்கப்பட்டுள்ளது.',
          'அதிக வட்டி கொண்ட எந்தவித கடன் பற்றுகளும் இல்லை.',
        ],
      },
      metric_cashflow_predictability: {
        title: 'பணப்புழக்க முன்கணிப்புத் திறன்',
        description: 'வரலாற்று கொடுப்பனவு கால அளவுகளின் அடிப்படையில் எதிர்கால 60-நாள் வரவுகள் குறித்த அல்காரிதமிக் நம்பிக்கை மதிப்பீடு.',
        benchmark: 'துறை அடிப்படை அளவு: 68',
        factors: [
          'விலைப்பட்டியல் தொகை வந்து சேரும் சராசரி காலம்: 11.4 நாட்கள்.',
          '86% வாடிக்கையாளர்கள் பதிவு செய்யப்பட்ட வீட்டு வசதி சங்கங்கள் & வணிக நிறுவனங்கள்.',
          'நேரடி UPI மற்றும் NEFT கொடுப்பனவுகள் வசூல் சிரமங்களைக் குறைக்கின்றன.',
        ],
      },
      metric_debt_capacity: {
        title: 'மதிப்பிடப்பட்ட கடன் சேவைத் திறன் (DSCR)',
        description: 'தற்போதைய செயல்பாட்டு லாபத்தில் ₹1,50,000 செயல்பாட்டு மூலதனக் கடனை எளிதாகத் திருப்பிச் செலுத்தும் திறன்.',
        benchmark: 'மதிப்பிடப்பட்ட DSCR: 2.85x',
        factors: [
          'நிகர மாதாந்திர இலவச பணப்புழக்க சராசரி: ₹22,450.',
          '₹1.5L கடனுக்கான மாதாந்திர EMI சுமை: ~₹7,200 (இலவச பணப்புழக்கத்தில் 32% மட்டுமே).',
          'தவணை தவறாத குறைந்த கடன் சுமை.',
        ],
      },
      metric_evidence_authenticity: {
        title: 'சான்று சரிபார்ப்புக் கவரேஜ்',
        description: 'வெளிப்புற சரிபார்க்கக்கூடிய டிஜிட்டல் தடங்களால் உறுதிப்படுத்தப்பட்ட மொத்த பதிவு செய்யப்பட்ட விற்றுமுதலின் சதவீதம்.',
        benchmark: 'கடன் வழங்குநர் வரம்பு: > 75%',
        factors: [
          'முதன்மை நடப்புக் கணக்கிற்கான கணக்கு ஒருங்கிணைப்பாளர் நேரலை ஒத்திசைவு இயக்கப்பட்டது.',
          'ஹார்டுவேர் கொள்முதல் பதிவுகளில் 92% மின்-விலைப்பட்டியல் QR குறியீடுகள் உள்ளன.',
          'வெறும் 6.2% பதிவுகள் மட்டுமே சரிபார்க்கப்படாத கையேடு சுய அறிவிப்பை நம்பியுள்ளன.',
        ],
      },
    };

    const loc = metricMap[m.id];
    if (!loc) return m;

    return {
      ...m,
      title: loc.title || m.title,
      description: loc.description || m.description,
      benchmark: loc.benchmark || m.benchmark,
      factors: loc.factors || m.factors,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title={t('analysis.pageTitle')}
        description={t('analysis.pageSubtitle')}
        breadcrumbs={[
          { label: t('navigation.dashboard'), onClick: () => onNavigate('dashboard') },
          { label: t('navigation.analysis') },
        ]}
      />

      {!hasSufficientData || metrics.length === 0 ? (
        <EmptyState
          title={t('dashboard.noAnalysis')}
          description={t('dashboard.noAnalysisDescription')}
          buttonText={t('history.addActivity')}
          onAction={() => onNavigate('add-activity')}
        />
      ) : (
        <>
          {/* AI Synthesis Header */}
          <AnalysisExplanation />

          {/* Grid of Key Metrics */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-950 dark:text-neutral-50 uppercase tracking-wider">
                {t('analysis.corePillars')}
              </h3>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {t('analysis.predictiveSignals')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {localizedMetrics.map((metric) => (
                <AnalysisCard key={metric.id} metric={metric} />
              ))}
            </div>
          </div>

          {/* Anomalies / Flagged Items */}
          {anomalies.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-neutral-950 dark:text-neutral-50 uppercase tracking-wider">
                  {t('analysis.anomalySectionTitle')}
                </h3>
                <span className="text-xs text-danger dark:text-danger font-semibold">
                  {t('analysis.flaggedReview', { count: anomalies.length })}
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
        </>
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
