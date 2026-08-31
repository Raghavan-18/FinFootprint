import PageHeader from '../components/common/PageHeader';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileMetrics from '../components/profile/ProfileMetrics';
import ProfileTimeline from '../components/profile/ProfileTimeline';
import ProfileInsights from '../components/profile/ProfileInsights';
import EvidenceSummary from '../components/profile/EvidenceSummary';
import LoadingState from '../components/common/LoadingState';
import { useLanguage } from '../hooks/useLanguage';

/**
 * Profile Page with localization
 *
 * User business profile, KYC credentials, trust footprint score,
 * verified pipeline integrations, and historical milestones.
 */
export function Profile({
  profile,
  isLoading = false,
  onNavigate,
}) {
  const { t } = useLanguage();

  if (isLoading) {
    return <LoadingState message={t('common.loadingData')} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title={t('profile.pageTitle')}
        description={t('profile.pageSubtitle')}
        breadcrumbs={[
          { label: t('navigation.dashboard'), onClick: () => onNavigate('dashboard') },
          { label: t('navigation.profile') },
        ]}
      />

      {/* Main Profile Header with Avatar & KYC details */}
      <ProfileHeader profile={profile} />

      {/* Profile Metrics Score Cards */}
      <ProfileMetrics profile={profile} />

      {/* 2-Column Section: Connected Streams & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EvidenceSummary />
        <ProfileInsights />
      </div>

      {/* Milestones History */}
      <ProfileTimeline />
    </div>
  );
}

export default Profile;
