import React, { useEffect, useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { NavTabId } from './components/navigation';
import { TopBar } from './components/TopBar';
import { AskSmartFlowDrawer } from './components/AskSmartFlowDrawer';
import { PatientDetailModal } from './components/PatientDetailModal';

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

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTabId>('command-center');

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

export default function App() {
  return (
    <HospitalProvider>
      <MainLayout />
    </HospitalProvider>
  );
}
