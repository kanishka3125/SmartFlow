import React, { useEffect, useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { ThemeProvider } from './context/ThemeContext';
import { NavTabId } from './components/navigation';
import { TopBar } from './components/TopBar';
import { AskSmartFlowDrawer } from './components/AskSmartFlowDrawer';
import { PatientDetailModal } from './components/PatientDetailModal';
import { LandingPage } from './components/LandingPage/LandingPage';

// Views
import { CommandCenter } from './views/CommandCenter';
import { PatientFlowView } from './views/PatientFlowView';
import { BedManagementView } from './views/BedManagementView';
import { ArrivalForecastView } from './views/ArrivalForecastView';
import { BottleneckAnalysisView } from './views/BottleneckAnalysisView';
import { ResourceUtilizationView } from './views/ResourceUtilizationView';
import { DischargeCoordinationView } from './views/DischargeCoordinationView';
import { SmartSettleView } from './views/SmartSettleView';
import { InsuranceCoordinationView } from './views/InsuranceCoordinationView';
import { DiagnosticOperationsView } from './views/DiagnosticOperationsView';
import { AutopilotView } from './views/AutopilotView';
import { ResilienceSimulatorView } from './views/ResilienceSimulatorView';
import { DelayAnalyticsView } from './views/DelayAnalyticsView';
import { AlertsTasksView } from './views/AlertsTasksView';

type AppRoute = 'landing' | 'dashboard';

const ALL_NAV_TABS: NavTabId[] = [
  'command-center',
  'patient-flow',
  'bed-management',
  'arrival-forecast',
  'bottlenecks',
  'resource-utilization',
  'discharge',
  'billing',
  'insurance',
  'diagnostics',
  'autopilot',
  'simulator',
  'delay-analytics',
  'alerts',
];

const determineInitialRoute = (): AppRoute => {
  if (typeof window === 'undefined') return 'landing';
  const hash = window.location.hash.toLowerCase();
  if (hash === '#dashboard' || hash.startsWith('#dashboard/')) {
    return 'dashboard';
  }
  const stripped = hash.replace('#', '') as NavTabId;
  if (ALL_NAV_TABS.includes(stripped)) {
    return 'dashboard';
  }
  // Landing page is the opening page when entering website
  return 'landing';
};

interface MainLayoutProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  onReturnToLanding: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  activeTab,
  setActiveTab,
  onReturnToLanding,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeTab]);

  const {
    isAskDrawerOpen,
    setIsAskDrawerOpen,
    selectedPatientId,
    setSelectedPatientId,
  } = useHospital();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'command-center':
        return <CommandCenter setActiveTab={setActiveTab} />;
      case 'patient-flow':
        return <PatientFlowView setActiveTab={setActiveTab} />;
      case 'bed-management':
        return <BedManagementView />;
      case 'arrival-forecast':
        return <ArrivalForecastView />;
      case 'bottlenecks':
        return <BottleneckAnalysisView setActiveTab={setActiveTab} />;
      case 'resource-utilization':
        return <ResourceUtilizationView />;
      case 'discharge':
        return <DischargeCoordinationView />;
      case 'billing':
        return <SmartSettleView />;
      case 'insurance':
        return <InsuranceCoordinationView />;
      case 'diagnostics':
        return <DiagnosticOperationsView />;
      case 'autopilot':
        return <AutopilotView setActiveTab={setActiveTab} />;
      case 'simulator':
        return <ResilienceSimulatorView />;
      case 'delay-analytics':
        return <DelayAnalyticsView />;
      case 'alerts':
        return <AlertsTasksView />;
      default:
        return <CommandCenter setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-page text-ink font-sans">
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAskDrawer={() => setIsAskDrawerOpen(true)}
        onReturnToLanding={onReturnToLanding}
      />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        {renderActiveView()}
      </main>

      {/* Grounded Operations Assistant Slide-Over Drawer */}
      <AskSmartFlowDrawer
        isOpen={isAskDrawerOpen}
        onClose={() => setIsAskDrawerOpen(false)}
      />

      {/* Full Patient Profile Drilldown Modal */}
      {selectedPatientId && (
        <PatientDetailModal
          patientId={selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
        />
      )}
    </div>
  );
};

const AppRouter: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(determineInitialRoute);
  const [activeTab, setActiveTab] = useState<NavTabId>(() => {
    if (typeof window === 'undefined') return 'command-center';
    const stripped = window.location.hash.replace('#', '') as NavTabId;
    return ALL_NAV_TABS.includes(stripped) ? stripped : 'command-center';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (!hash || hash === '#' || hash === '#landing') {
        setCurrentRoute('landing');
      } else {
        setCurrentRoute('dashboard');
        const stripped = hash.replace('#', '') as NavTabId;
        if (ALL_NAV_TABS.includes(stripped)) {
          setActiveTab(stripped);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLaunchDashboard = () => {
    setCurrentRoute('dashboard');
    window.location.hash = '#dashboard';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreDashboard = () => {
    setCurrentRoute('dashboard');
    window.location.hash = '#dashboard';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToLanding = () => {
    setCurrentRoute('landing');
    window.location.hash = '#landing';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentRoute === 'landing') {
    return (
      <LandingPage
        onLaunchDashboard={handleLaunchDashboard}
        onExploreDashboard={handleExploreDashboard}
      />
    );
  }

  return (
    <MainLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onReturnToLanding={handleReturnToLanding}
    />
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <HospitalProvider>
        <AppRouter />
      </HospitalProvider>
    </ThemeProvider>
  );
}
