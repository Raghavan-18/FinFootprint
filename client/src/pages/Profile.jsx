import PageHeader from '../components/common/PageHeader';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileMetrics from '../components/profile/ProfileMetrics';
import ProfileTimeline from '../components/profile/ProfileTimeline';
import ProfileInsights from '../components/profile/ProfileInsights';
import EvidenceSummary from '../components/profile/EvidenceSummary';
import LoadingState from '../components/common/LoadingState';

/**
 * Profile Page
 *
 * User business profile, KYC credentials, trust footprint score,
 * verified pipeline integrations, and historical milestones.
 */
export function Profile({
  profile,
  isLoading = false,
  onNavigate,
}) {
  if (isLoading) {
    return <LoadingState message="Loading profile footprint..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Applicant Profile & Verifications"
        description="Comprehensive KYC credentials, enterprise registry data, connected financial streams, and milestone track record"
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
          { label: 'Profile & Proofs' },
        ]}
      />

      {/* Main Profile Header with Avatar & KYC details */}
      <ProfileHeader profile={profile} />

      {/* Profile Metrics Score Cards */}
      <ProfileMetrics profile={profile} />

      {/* 2-Column Section: Connected Streams & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EvidenceSummary profile={profile} />
        <ProfileInsights />
      </div>

      {/* Milestones History */}
      <ProfileTimeline />
    </div>
  );
}

export default Profile;
