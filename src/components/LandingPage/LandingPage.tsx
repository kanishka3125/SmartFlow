import React from 'react';
import {
  ArrowRight,
  TrendingUp,
  BedDouble,
  Cpu,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  Zap,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Building2,
  Bell,
  Sliders,
  Sun,
  Moon,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { useTheme } from '../../context/ThemeContext';
import { MedicalCube3D } from './MedicalCube3D';
import './landing.css';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onExploreDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onExploreDashboard,
}) => {
  // Pull real, live application KPIs from HospitalContext
  const {
    totalBeds,
    occupiedBeds,
    availableBeds,
    occupancyRate,
    patientsWaitingAdmission,
    avgWaitTimeMinutes,
    edBoardingCount,
    activeAlertsCount,
  } = useHospital();
  const { theme, toggleTheme } = useTheme();

  const scrollToFeatures = () => {
    const el = document.getElementById('synesis-features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onExploreDashboard();
    }
  };

  return (
    <div className="synesis-landing-root">
      {/* Background Ambient Lighting Orbs */}
      <div className="synesis-orb-top" aria-hidden="true" />
      <div className="synesis-orb-left" aria-hidden="true" />
      <div className="synesis-orb-bottom" aria-hidden="true" />
      <div className="synesis-grid-pattern" aria-hidden="true" />

      {/* Navigation Header */}
      <header className="relative z-30 border-b border-violet-500/15 bg-[#090514]/85 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 p-[1.5px] shadow-[0_0_20px_rgba(109,40,217,0.45)]">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${theme === 'dark' ? 'bg-[#090514]' : 'bg-white'}`}>
                <span className="font-extrabold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600">
                  SF
                </span>
              </div>
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight flex items-center gap-2">
                <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'} style={{ color: theme === 'dark' ? '#ffffff' : undefined }}>SmartFlow</span>
                <span className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full ${
                  theme === 'dark'
                    ? 'bg-violet-500/20 text-white border border-violet-500/30'
                    : 'bg-violet-100 text-violet-800 border border-violet-300'
                }`}>
                  Hospital Intelligence
                </span>
              </div>
              <div className={`text-[11px] font-medium tracking-wide ${theme === 'dark' ? 'text-white/80' : 'text-violet-900/60'}`}>
                Enterprise Clinical Operations Platform
              </div>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-slate-700'}`}>
            <button
              onClick={scrollToFeatures}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Core Capabilities
            </button>
            <a
              href="#synesis-telemetry"
              className="hover:text-white transition-colors cursor-pointer"
            >
              Live Telemetry
            </a>
            <a
              href="#synesis-architecture"
              className="hover:text-white transition-colors cursor-pointer"
            >
              Architecture
            </a>
          </nav>

          {/* Right Header Action */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Telemetry Connected</span>
            </div>

            {/* Dark / Light Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2.5 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-violet-950/60 border-violet-500/30 text-amber-300 hover:bg-violet-900/80 shadow-[0_0_12px_rgba(124,58,237,0.3)]'
                  : 'bg-white border-violet-200 text-violet-700 hover:bg-violet-50 shadow-sm'
              }`}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-violet-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            <button
              onClick={onLaunchDashboard}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 hover:from-violet-600 hover:to-purple-600 shadow-[0_0_20px_rgba(109,40,217,0.45)] hover:shadow-[0_0_30px_rgba(124,58,237,0.65)] transition-all cursor-pointer"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Text & Actions (approx 7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Pill tag */}
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 w-fit ${
                theme === 'dark'
                  ? 'bg-violet-950/60 border border-violet-500/30 text-white shadow-[0_0_15px_rgba(109,40,217,0.25)]'
                  : 'bg-violet-100 border border-violet-300 text-violet-800 shadow-xs'
              }`}>
                <Sparkles className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-white' : 'text-violet-600'}`} />
                <span>Next-Generation Operational Decision Intelligence</span>
              </div>

              {/* Main Headline (Rich Dark Purple, Zero Pink) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] mb-6 text-white" style={{ color: theme === 'dark' ? '#ffffff' : undefined }}>
                Every Bed.{' '}
                <br className="hidden sm:inline" />
                Every Decision.{' '}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600">
                  Smarter.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className={`text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal ${theme === 'dark' ? 'text-white/90' : 'text-slate-600'}`}>
                Continuous hospital capacity monitoring, high-precision patient-demand forecasting, 
                and automated bed allocation. Empowering clinical operations leaders to eliminate 
                emergency department boarding, resolve discharge barriers, and maximize throughput across every care unit.
              </p>

              {/* Two Functional CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <button
                  type="button"
                  onClick={onLaunchDashboard}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 hover:from-violet-600 hover:to-purple-600 shadow-[0_0_25px_rgba(109,40,217,0.55)] hover:shadow-[0_0_35px_rgba(124,58,237,0.75)] transition-all cursor-pointer group"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={onExploreDashboard}
                  className={`flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold transition-all cursor-pointer backdrop-blur-md ${
                    theme === 'dark'
                      ? 'text-white bg-[#0e0720]/80 hover:bg-[#160b33] border border-violet-400/30 hover:border-violet-400/60 shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
                      : 'text-violet-900 bg-white/90 hover:bg-white border border-violet-300 hover:border-violet-500 shadow-[0_4px_16px_rgba(124,58,237,0.08)]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>Explore Dashboard</span>
                </button>
              </div>

              {/* Trust & Architecture Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-violet-500/20 max-w-xl">
                <div>
                  <div className={`text-xs uppercase tracking-wider font-semibold mb-1 ${theme === 'dark' ? 'text-white/80' : 'text-violet-800'}`}>
                    Telemetry Engine
                  </div>
                  <div className={`text-sm font-medium flex items-center gap-1.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Real-Time Sync</span>
                  </div>
                </div>

                <div>
                  <div className={`text-xs uppercase tracking-wider font-semibold mb-1 ${theme === 'dark' ? 'text-white/80' : 'text-violet-800'}`}>
                    Compliance
                  </div>
                  <div className={`text-sm font-medium flex items-center gap-1.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>HIPAA Ready</span>
                  </div>
                </div>

                <div>
                  <div className={`text-xs uppercase tracking-wider font-semibold mb-1 ${theme === 'dark' ? 'text-white/80' : 'text-violet-800'}`}>
                    Flow Autopilot
                  </div>
                  <div className={`text-sm font-medium flex items-center gap-1.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Zero Bottleneck</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: 3D Medical Plus Cube Showcase (approx 5 cols) */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="w-full relative flex items-center justify-center">
                {/* Glow backdrop behind cube */}
                <div className="absolute w-[260px] h-[260px] rounded-full bg-violet-900/10 filter blur-[90px] pointer-events-none" />

                {/* Genuinely 3D Floating Transparent Glass Acrylic Medical Cube */}
                <MedicalCube3D />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Compact KPI Cards (Directly using live application data) */}
      <section id="synesis-telemetry" className="relative z-10 py-10 bg-[#0e0720]/75 border-y border-violet-500/15">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white mb-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Operational Telemetry</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Current Hospital State & Capacity Indicators
              </h2>
            </div>
            <p className="text-sm text-white/80 max-w-md">
              Real-time census metrics pulled dynamically from the active hospital database and bed management telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* KPI Card 1: Occupancy Rate */}
            <div className="synesis-glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full filter blur-xl pointer-events-none group-hover:bg-violet-600/20 transition-all" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-violet-300">Live Bed Occupancy</span>
                <span className="p-2 rounded-xl bg-violet-500/15 text-violet-300 border border-violet-500/20">
                  <BedDouble className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight mb-1">
                {occupancyRate}%
              </div>
              <div className="text-xs text-violet-300/70 flex items-center justify-between">
                <span>{occupiedBeds} occupied of {totalBeds} total beds</span>
                <span className="text-emerald-400 font-semibold">Active Census</span>
              </div>
              {/* Progress bar */}
              <div className="mt-3.5 w-full h-1.5 rounded-full bg-violet-950/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500"
                  style={{ width: `${Math.min(100, occupancyRate)}%` }}
                />
              </div>
            </div>

            {/* KPI Card 2: Available Capacity */}
            <div className="synesis-glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full filter blur-xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-violet-300">Immediate Bed Capacity</span>
                <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight mb-1">
                {availableBeds} Beds
              </div>
              <div className="text-xs text-violet-300/70 flex items-center justify-between">
                <span>Sanitized & ready for placement</span>
                <span className="text-emerald-400 font-semibold">Ready</span>
              </div>
              <div className="mt-3.5 w-full h-1.5 rounded-full bg-violet-950/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{ width: `${Math.min(100, (availableBeds / (totalBeds || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* KPI Card 3: Admission Queue / ED Boarding */}
            <div className="synesis-glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-900/10 rounded-full filter blur-xl pointer-events-none group-hover:bg-purple-800/20 transition-all" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-violet-300">Intake Placement Queue</span>
                <span className="p-2 rounded-xl bg-purple-900/30 text-purple-300 border border-purple-500/30">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight mb-1">
                {patientsWaitingAdmission} Queued
              </div>
              <div className="text-xs text-violet-300/70 flex items-center justify-between">
                <span>{edBoardingCount} boarding in emergency care</span>
                <span className="text-amber-400 font-semibold">Triage Sync</span>
              </div>
              <div className="mt-3.5 w-full h-1.5 rounded-full bg-violet-950/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-500"
                  style={{ width: `${Math.min(100, (patientsWaitingAdmission / 15) * 100)}%` }}
                />
              </div>
            </div>

            {/* KPI Card 4: Triage-to-Bed Wait Time */}
            <div className="synesis-glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full filter blur-xl pointer-events-none group-hover:bg-violet-500/20 transition-all" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-violet-300">Mean Triage-to-Bed</span>
                <span className="p-2 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight mb-1">
                {avgWaitTimeMinutes}m
              </div>
              <div className="text-xs text-violet-300/70 flex items-center justify-between">
                <span>{activeAlertsCount} active throughput alerts</span>
                <span className="text-violet-300 font-semibold">-38% vs target</span>
              </div>
              <div className="mt-3.5 w-full h-1.5 rounded-full bg-violet-950/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  style={{ width: '62%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Feature Cards */}
      <section id="synesis-features" className="relative z-10 py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-4">
              <Cpu className="w-3.5 h-3.5 text-violet-300" />
              <span>Architected for Modern Hospital Command Centers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Comprehensive Intelligence for Every Step of Patient Flow
            </h2>
            <p className="text-base text-violet-200/80">
              Transform clinical operations from reactive triage into proactive, automated orchestrations 
              with our three integrated pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature Card 1: Predictive Intelligence */}
            <div className="synesis-glass-card rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-violet-600/20 rounded-full filter blur-2xl pointer-events-none group-hover:bg-violet-600/35 transition-all" />

              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-[1px] mb-6 shadow-[0_0_20px_rgba(109,40,217,0.35)]">
                  <div className="w-full h-full bg-[#0e0720] rounded-[15px] flex items-center justify-center text-violet-300">
                    <TrendingUp className="w-7 h-7 text-violet-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <div className="text-xs uppercase font-bold tracking-wider text-violet-400 mb-2">
                  Forecasting & Early Warning
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Predictive Intelligence
                </h3>
                <p className="text-sm text-violet-200/80 leading-relaxed mb-6 font-normal">
                  Machine learning arrival forecasting projects ED surge volume, ICU transfers, 
                  and department admissions up to 48 hours in advance. Proactively adjust nurse staffing, 
                  prep telemetry equipment, and reserve recovery suites before congestion strikes.
                </p>
              </div>

              <div>
                <ul className="space-y-2.5 text-xs text-violet-300/90 mb-6 pt-4 border-t border-violet-500/15">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                    <span>Hourly admission volume projections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                    <span>Seasonal & acute surge classification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                    <span>Automated staffing risk notifications</span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={onLaunchDashboard}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-violet-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Explore Forecast Module</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Feature Card 2: Capacity Monitoring */}
            <div className="synesis-glass-card rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-700/20 rounded-full filter blur-2xl pointer-events-none group-hover:bg-purple-700/35 transition-all" />

              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 to-violet-800 p-[1px] mb-6 shadow-[0_0_20px_rgba(109,40,217,0.35)]">
                  <div className="w-full h-full bg-[#0e0720] rounded-[15px] flex items-center justify-center text-purple-300">
                    <BedDouble className="w-7 h-7 text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <div className="text-xs uppercase font-bold tracking-wider text-purple-400 mb-2">
                  Real-Time Census & Bed Status
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Capacity Monitoring
                </h3>
                <p className="text-sm text-violet-200/80 leading-relaxed mb-6 font-normal">
                  Live sensor-level census tracking across emergency, general acute wards, ICU pods, 
                  and isolation chambers. Monitor rapid room turnover, trigger environmental sanitization 
                  workflows, and maintain instant visibility over patient bed occupancy.
                </p>
              </div>

              <div>
                <ul className="space-y-2.5 text-xs text-violet-300/90 mb-6 pt-4 border-t border-violet-500/15">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                    <span>Real-time sanitization turnover tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                    <span>Ward & department capacity heatmaps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                    <span>Zero-latency status updates for charge nurses</span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={onLaunchDashboard}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-violet-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Explore Bed Management</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Feature Card 3: Decision Support */}
            <div className="synesis-glass-card rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-600/20 rounded-full filter blur-2xl pointer-events-none group-hover:bg-indigo-600/35 transition-all" />

              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-[1px] mb-6 shadow-[0_0_20px_rgba(99,102,241,0.35)]">
                  <div className="w-full h-full bg-[#0e0720] rounded-[15px] flex items-center justify-center text-indigo-300">
                    <Cpu className="w-7 h-7 text-indigo-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <div className="text-xs uppercase font-bold tracking-wider text-indigo-400 mb-2">
                  Algorithmic Allocation & Discharge
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Decision Support
                </h3>
                <p className="text-sm text-violet-200/80 leading-relaxed mb-6 font-normal">
                  Algorithmic acuity-to-bed allocation pairs patient diagnosis and isolation requirements 
                  with ideal placement in seconds. Automated discharge coordination clears insurance, 
                  pharmacy, and transportation barriers hours ahead of departure.
                </p>
              </div>

              <div>
                <ul className="space-y-2.5 text-xs text-violet-300/90 mb-6 pt-4 border-t border-violet-500/15">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                    <span>Intelligent multi-criteria bed matching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                    <span>SmartSettle insurance pre-clearance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                    <span>Flow Autopilot automated intervention plans</span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={onLaunchDashboard}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-violet-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Explore Autopilot & Flow</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Operational Modules Architecture Preview */}
      <section id="synesis-architecture" className="relative z-10 py-16 bg-[#0b0518]/60 border-t border-violet-500/15">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
              One Unified Operational Ecosystem
            </h2>
            <p className="text-sm text-violet-300/80">
              Explore the fourteen purpose-built operational command modules available directly inside the SmartFlow platform.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              { label: 'Command Center', icon: BarChart3, desc: 'Central Operations' },
              { label: 'Patient Flow', icon: Activity, desc: 'Triage & Movement' },
              { label: 'Bed Management', icon: BedDouble, desc: 'Live Census Grid' },
              { label: 'Arrival Forecast', icon: TrendingUp, desc: 'Surge Projection' },
              { label: 'Bottlenecks', icon: Clock, desc: 'Delay Resolution' },
              { label: 'Flow Autopilot', icon: Zap, desc: 'Autonomous Actions' },
              { label: 'Discharge Hub', icon: Layers, desc: 'Departure Barrier Sync' },
              { label: 'SmartSettle', icon: ShieldCheck, desc: 'Financial Clearing' },
              { label: 'Insurance Ops', icon: Building2, desc: 'Claims & Pre-Auth' },
              { label: 'Diagnostics', icon: Activity, desc: 'Imaging & Lab Queues' },
              { label: 'What-If Sim', icon: Sliders, desc: 'Resilience Modeling' },
              { label: 'Alerts & Tasks', icon: Bell, desc: 'Active Dispatch' },
            ].map((module, i) => {
              const Icon = module.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={onLaunchDashboard}
                  className="synesis-glass-card rounded-2xl p-4 text-left hover:border-violet-400/50 hover:bg-[#160b33] transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-300 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:text-purple-200 transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold text-white tracking-tight leading-snug">
                    {module.label}
                  </div>
                  <div className="text-[10px] text-violet-300/60 mt-0.5 truncate">
                    {module.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative z-10 py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="synesis-glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-violet-400/30 text-center">
            {/* Ambient radiant dark purple glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-800/20 via-purple-900/20 to-indigo-950/20 pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Zero-Latency Command Center</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Ready to Experience Smart Hospital Operations?
              </h2>

              <p className="text-sm sm:text-base text-violet-200/80 mb-8 leading-relaxed">
                Step directly into the live command center. Monitor real-time census, simulate surge capacity, 
                and interact with grounded operational AI assistants.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={onLaunchDashboard}
                  className="flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 hover:from-violet-600 hover:to-purple-600 shadow-[0_0_30px_rgba(109,40,217,0.6)] transition-all cursor-pointer"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onExploreDashboard}
                  className={`flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'text-violet-200 bg-[#0e0720] hover:bg-[#160b33] border border-violet-400/30'
                      : 'text-violet-900 bg-white hover:bg-violet-50 border border-violet-300 shadow-sm'
                  }`}
                >
                  <span>Explore All Modules</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-violet-500/15 py-8 bg-[#06030e] text-xs text-violet-300/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-violet-200">SmartFlow</span>
            <span>—</span>
            <span>Hospital Intelligence & Resource Optimization</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Every Bed. Every Decision. Smarter.</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-violet-300 hover:text-white transition-colors cursor-pointer"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
