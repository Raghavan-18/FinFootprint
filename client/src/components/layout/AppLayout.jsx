import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';

/**
 * Reusable AppLayout wrapper
 *
 * @param {Object} props
 * @param {string} props.activeTab
 * @param {Function} props.onSelectTab
 * @param {Object} [props.profile]
 * @param {Function} [props.onAddActivity]
 * @param {React.ReactNode} props.children
 */
export function AppLayout({
  activeTab,
  onSelectTab,
  profile,
  onAddActivity,
  children,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Navbar
        profile={profile}
        activeTab={activeTab}
        onOpenMobileSidebar={() => setIsMobileMenuOpen(true)}
        onAddActivity={onAddActivity}
      />

      {/* Main Content Area with Sidebar touching left edge (left: 0) */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          profile={profile}
          className="hidden lg:flex shrink-0 sticky top-[57px] h-[calc(100vh-57px)]"
        />

        {/* Mobile Navigation Drawer & Bottom Bar */}
        <MobileNavigation
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          profile={profile}
        />

        {/* Page Viewport starting immediately after sidebar */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
