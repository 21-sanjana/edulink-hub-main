import { ReactNode, useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { Navbar } from './Navbar';

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
        <AppSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
