import {
  LayoutDashboard,
  Users,
  BedDouble,
  TrendingUp,
  AlertOctagon,
  Cpu,
  Layers,
  FileText,
  ShieldCheck,
  Activity,
  Sliders,
  BarChart3,
  BellRing,
  Building2,
  LucideIcon,
} from 'lucide-react';

export type NavTabId =
  | 'command-center'
  | 'patient-flow'
  | 'bed-management'
  | 'arrival-forecast'
  | 'bottlenecks'
  | 'resource-utilization'
  | 'discharge'
  | 'billing'
  | 'insurance'
  | 'diagnostics'
  | 'autopilot'
  | 'simulator'
  | 'delay-analytics'
  | 'alerts';

export interface NavItem {
  id: NavTabId;
  label: string;
  icon: LucideIcon;
  /** Shown as a pill tab in the top bar; everything else lives in "More". */
  primary?: boolean;
}

export const navItems: NavItem[] = [
  { id: 'command-center', label: 'Command Center', icon: LayoutDashboard, primary: true },
  { id: 'patient-flow', label: 'Patient Flow', icon: Users, primary: true },
  { id: 'bed-management', label: 'Beds', icon: BedDouble, primary: true },
  { id: 'arrival-forecast', label: 'Forecast', icon: TrendingUp, primary: true },
  { id: 'bottlenecks', label: 'Bottlenecks', icon: AlertOctagon, primary: true },
  { id: 'resource-utilization', label: 'Resource Utilization', icon: Building2 },
  { id: 'autopilot', label: 'Flow Autopilot', icon: Cpu },
  { id: 'discharge', label: 'Discharge Coordination', icon: Layers },
  { id: 'billing', label: 'SmartSettle Billing', icon: FileText },
  { id: 'insurance', label: 'Insurance Coordination', icon: ShieldCheck },
  { id: 'diagnostics', label: 'Diagnostic Operations', icon: Activity },
  { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
  { id: 'delay-analytics', label: 'Delay & Cost Analytics', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts & Tasks', icon: BellRing },
];
