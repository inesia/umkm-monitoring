"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SentimentRings } from "@/components/dashboard/SentimentRings";
import { BenchmarkingPillar } from "@/components/dashboard/BenchmarkingPillar";
import { SummaryTiles } from '@/components/dashboard/PerformanceTile';
import { AlertHub } from '@/components/dashboard/AlertHub';
import { LiveTicker } from '@/components/dashboard/LiveTicker';
import { PeopleCapitalPanel } from '@/components/dashboard/PeopleCapitalPanel';
import { ChannelGeoPanel } from '@/components/dashboard/ChannelGeoPanel';
import { SocialEngagementPanel } from '@/components/dashboard/SocialEngagementPanel';
import { GroupGovernance } from '@/components/dashboard/GroupGovernance';
import type { DashboardMode } from "@/types/dashboard";
import { BRAND } from "@/lib/constants";
import { ChevronRight, FileText, Search, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout() {
  const [viewState, setViewState] = useState<
    "login" | "transition" | "dashboard"
  >("login");
  const [mode, setMode] = useState<DashboardMode>('general');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [timeframe, setTimeframe] = useState<string>('24H');
  const [syncCountdown, setSyncCountdown] = useState<number>(45);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const CARD_COUNT = 8;

  // Auto-highlight loop: every 10s highlight next card (TV focus)
  useEffect(() => {
    const interval = setInterval(() => {
      setFocusedCardIndex((prev) => (prev + 1) % CARD_COUNT);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const cardFocusClass = (index: number) =>
    focusedCardIndex === index
      ? 'ring-2 ring-[#059669]/50 shadow-[0_12px_40px_rgba(5,150,105,0.18)]'
      : '';

  // Initialize time on client-side only
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }));
      setCurrentDate(new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncCountdown(prev => {
        if (prev <= 1) return 45;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    setViewState("transition");
    setTimeout(() => {
      setViewState("dashboard");
    }, 1800);
  };

  const noiseDataUri = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' fill='black' opacity='1'/%3E%3C/svg%3E";

  // Force light theme - no toggle, always light
  const theme = 'light';

  return (
    <div 
      className="h-screen w-screen bg-mesh-animated text-slate-800 overflow-hidden relative selection:bg-[#1C1A16]/20 font-sans transition-colors duration-300"
      data-theme={theme}
      style={{ 
        backgroundColor: 'var(--bg-color)', 
        color: 'var(--text-body)' 
      }}
    >
      {/* ... (Noise & Login View - No Changes) ... */}
      
      {/* VIEW 1: LOGIN (iCloud Style) */}
      {viewState === "login" && (
        <motion.div
          key="login"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm"
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Image
              src={BRAND.logo}
              alt={BRAND.title}
              width={140}
              height={52}
              className="h-14 w-auto object-contain"
            />
          </motion.div>

          <h2 className="text-lg font-medium tracking-tight mb-2" style={{ color: 'var(--ink)' }}>
            {BRAND.subtitle}
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--ink-3)' }}>
            Media Listening &amp; Engagement Dashboard
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="group relative px-7 py-2.5 bg-white/70 hover:bg-white backdrop-blur-md rounded-xl border shadow-sm flex items-center gap-2.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
            style={{ borderColor: 'var(--line)' }}
          >
            <span className="text-sm font-bold group-hover:text-[var(--ink)]" style={{ color: 'var(--ink-2)' }}>
              Masuk Dashboard
            </span>
            <div className="w-5 h-5 rounded-lg flex items-center justify-center shadow-md" style={{ background: 'var(--ink)' }}>
              <ChevronRight className="h-3.5 w-3.5 text-white" />
            </div>
          </motion.button>

          <p className="fixed bottom-10 text-[9px] font-bold uppercase tracking-[0.4em]" style={{ color: 'var(--ink-3)' }}>
            {BRAND.title}
          </p>
        </motion.div>
      )}

      {/* VIEW 2: TRANSITION (Logo Zoom) */}
      {viewState === "transition" && (
        <motion.div
          key="transition"
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-3xl"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1, 30], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="relative w-48 h-48"
          >
            <Image
              src={BRAND.logo}
              alt={BRAND.title}
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>
      )}

      {/* VIEW 3: DASHBOARD */}
      <AnimatePresence mode="wait">
      {viewState === "dashboard" && (
          <motion.div key="dashboard" className="absolute inset-0" data-dashboard="executive">
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between pointer-events-none ${mode === 'crisis' ? 'z-[110]' : 'z-40'}`}>
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex items-center gap-4 pointer-events-auto"
              >
                 {/* Logo & Title (Stays Same) */}
                 <Link href="/" className="h-10 flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2">
                  <Image
                    src={BRAND.logo}
                    alt={BRAND.title}
                    width={120}
                    height={40}
                    className="h-9 w-auto object-contain"
                  />
                </Link>
                <div className="h-8 w-px" style={{ background: 'var(--line-2)' }} />
                <div>
                  <div className="flex items-baseline gap-2">
                    <h1 className="text-sm font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
                      {BRAND.title}
                    </h1>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: 'var(--orange-deep)' }}>
                      {BRAND.subtitle}
                    </span>
                  </div>
                   <div className="flex items-center gap-3 mt-0.5">
                    <span className="dash-meta font-medium" style={{ color: 'var(--ink-3)' }}>
                      {BRAND.phase}
                    </span>
                    <span className="text-[var(--line-2)]">·</span>
                    <span className="dash-meta font-medium" style={{ color: 'var(--ink-3)' }}>
                      {BRAND.coverage}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex items-center gap-3 pointer-events-auto"
              >
                {/* Reports & Search (Icon Only) */}
                <nav className="flex items-center gap-2 mr-1">
                  <Link
                    href="/reports"
                    className="p-2 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-sm text-slate-600 hover:text-[#1C1A16] hover:bg-white/80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1A16]"
                    title="Reports"
                  >
                    <FileText className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/search"
                    className="p-2 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-sm text-slate-600 hover:text-[#1C1A16] hover:bg-white/80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1A16]"
                    title="Search"
                  >
                    <Search className="w-4 h-4" />
                  </Link>
                </nav>
                
                {/* ... General/Crisis Toggle ... */}
                <div className="p-1 rounded-full flex items-center shadow-sm border mr-2" style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}>
                  <button
                    onClick={() => setMode('general')}
                    className={`px-4 py-2 rounded-full dash-meta font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${mode === 'general' ? 'text-white shadow-sm focus-visible:ring-[#F58220]' : 'hover:opacity-80 focus-visible:ring-slate-400'}`}
                    style={mode === 'general' ? { background: 'var(--ink)' } : { color: 'var(--ink-3)' }}
                  >
                    Ringkasan
                  </button>
                  <button
                    onClick={() => setMode('crisis')}
                    className={`px-4 py-2 rounded-full dash-meta font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${mode === 'crisis' ? 'text-white shadow-sm focus-visible:ring-[#C7402D]' : 'hover:opacity-80 focus-visible:ring-slate-400'}`}
                    style={mode === 'crisis' ? { background: 'var(--neg)' } : { color: 'var(--ink-3)' }}
                  >
                    Krisis
                  </button>
                </div>

                {/* Range Selector (Rentang) */}
                <div className="flex items-center gap-2 mr-2">
                  <span className="dash-meta font-medium uppercase tracking-[0.1em] text-slate-500 shrink-0" style={{ opacity: 0.6 }}>
                    Rentang
                  </span>
                  <div className="p-1 rounded-lg flex items-center gap-1 shadow-sm border" style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}>
                    {['1H', '6H', '24H', '7D'].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-2.5 py-1.5 rounded-lg dash-meta font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                          timeframe === tf
                            ? 'text-white focus-visible:ring-[#F58220]'
                            : 'hover:opacity-80 focus-visible:ring-slate-400'
                        }`}
                        style={
                          timeframe === tf
                            ? { background: 'linear-gradient(135deg, var(--orange), var(--orange-deep))' }
                            : { color: 'var(--ink-3)' }
                        }
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Display (Top Right) */}
                <div className="px-4 py-2 rounded-lg flex items-center gap-3 shadow-sm border" style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}>
                  <span className="dash-meta font-medium" style={{ color: 'var(--ink-3)' }} suppressHydrationWarning>
                    {currentDate}
                  </span>
                  <div className="w-px h-3" style={{ background: 'var(--line-2)' }} />
                  <span className="dash-body-sm font-bold tabular-nums" style={{ color: 'var(--ink)' }} suppressHydrationWarning>
                    {currentTime} WIB
                  </span>
                </div>

              </motion.div>
            </header>

            {/* Main Content */}
            <div style={mode === 'crisis' ? { filter: 'blur(40px) brightness(0.3)', pointerEvents: 'none', transition: 'filter 0.4s ease' } : undefined}>
            <main className="absolute inset-0 z-10 h-screen overflow-hidden pt-[4.75rem] pb-[4rem] px-[1.5rem]">
               {/* Ambient Glow */}
               {mode === 'crisis' && (
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, rgba(220,38,38,0.06) 100%)', boxShadow: 'inset 0 0 100px rgba(220,38,38,0.04)' }} />
               )}

                <div className="grid grid-cols-12 gap-4 h-full w-full mx-auto relative z-[1]" style={{ gridTemplateRows: 'minmax(0, 1fr) minmax(11rem, 13rem)' }}>
                  
                  {/* Col 1–6: Competitor Benchmark */}
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: viewState === 'dashboard' ? 0.4 : 0 }}
                    style={{ gridColumn: mode === 'crisis' ? 'span 3' : 'span 6', gridRow: '1', opacity: mode === 'crisis' ? 0.85 : 1, filter: mode === 'crisis' ? 'blur(20px) brightness(0.5)' : 'none', transition: 'opacity 0.3s ease, filter 0.3s ease' }}
                    className={`h-full min-h-0 rounded-md transition-all duration-500 ${cardFocusClass(0)}`}
                  >
                    <SentimentRings />
                  </motion.div>

                  {/* Col 7–9: Benchmarking + Tiles */}
                  <div className="col-span-3 row-start-1 flex flex-col gap-3 min-h-0">
                    <motion.div
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      style={{ opacity: mode === 'crisis' ? 0.85 : 1, filter: mode === 'crisis' ? 'blur(20px) brightness(0.5)' : 'none' }}
                      className={`flex-[2] min-h-0 rounded-md transition-all duration-500 ${cardFocusClass(1)}`}
                    >
                      <BenchmarkingPillar />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.55 }}
                      style={{ opacity: mode === 'crisis' ? 0.85 : 1, filter: mode === 'crisis' ? 'blur(20px) brightness(0.5)' : 'none' }}
                      className={`flex-[0.7] min-h-0 rounded-md transition-all duration-500 ${cardFocusClass(2)}`}
                    >
                      <SummaryTiles />
                    </motion.div>
                  </div>

                  {/* Col 10–12: Alert Hub */}
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className={`col-span-3 row-start-1 min-h-0 rounded-md transition-all duration-500 ${cardFocusClass(3)}`}
                  >
                    {mode !== 'crisis' && <AlertHub onDeclareCrisis={() => setMode('crisis')} />}
                  </motion.div>

                  {/* Row 2: Bottom Cards */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} style={{ opacity: mode === 'crisis' ? 0.85 : 1, filter: mode === 'crisis' ? 'blur(20px) brightness(0.5)' : 'none', transition: 'opacity 0.3s ease, filter 0.3s ease' }} className={`col-span-3 row-start-2 min-h-0 rounded-md transition-all duration-500 ${cardFocusClass(4)}`}>
                    <PeopleCapitalPanel />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.75 }} style={{ opacity: mode === 'crisis' ? 0.85 : 1, filter: mode === 'crisis' ? 'blur(20px) brightness(0.5)' : 'none', transition: 'opacity 0.3s ease, filter 0.3s ease' }} className={`col-span-3 row-start-2 min-h-0 rounded-md transition-all duration-500 ${cardFocusClass(5)}`}>
                    <ChannelGeoPanel />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} style={{ opacity: mode === 'crisis' ? 0.85 : 1, filter: mode === 'crisis' ? 'blur(20px) brightness(0.5)' : 'none', transition: 'opacity 0.3s ease, filter 0.3s ease' }} className={`col-span-3 row-start-2 min-h-0 rounded-md transition-all duration-500 ${cardFocusClass(6)}`}>
                    <GroupGovernance />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.85 }} style={{ opacity: mode === 'crisis' ? 0.85 : 1, filter: mode === 'crisis' ? 'blur(20px) brightness(0.5)' : 'none', transition: 'opacity 0.3s ease, filter 0.3s ease' }} className={`col-span-3 row-start-2 min-h-0 rounded-md transition-all duration-500 ${cardFocusClass(7)}`}>
                    <SocialEngagementPanel />
                  </motion.div>
                </div>
              </main>
            </div>
          </motion.div>
      )}
      </AnimatePresence>
      
      {/* Crisis Overlay */}
      {mode === 'crisis' && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          aria-modal
          role="dialog"
          aria-label="Crisis Command Center"
        >
          <div className="absolute inset-0 pointer-events-auto" aria-hidden />
          <motion.div
            className="w-[65%] h-[65%] min-w-[480px] min-h-[420px] max-w-[1200px] max-h-[85vh] pointer-events-auto relative z-10 rounded-md overflow-hidden shadow-sm"
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <AlertHub isCrisis isCentered onClose={() => setMode('general')} onDeclareCrisis={() => setMode('crisis')} />
          </motion.div>
        </div>
      )}

      {/* Bottom Ticker */}
      {viewState === "dashboard" && (
        <motion.div
            className="fixed bottom-0 left-0 right-0 z-50"
            data-dashboard="executive"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
          >
            <LiveTicker />
        </motion.div>
      )}
    </div>
  );
}
