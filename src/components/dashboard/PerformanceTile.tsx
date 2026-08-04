'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FONT_INTER = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };

const cardBase = 'relative overflow-hidden rounded-md flex flex-col items-start text-left bg-white border border-gray-200 shadow-sm transition-all duration-300';

export function SummaryTiles() {
  const [timeLeft, setTimeLeft] = useState(1694);
  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 1800), 1000);
    return () => clearInterval(interval);
  }, []);
  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const compactMicro = 'mt-auto w-full pt-1.5 border-t border-slate-200/60 bg-slate-50/40 -mx-2.5 px-2.5 pb-1.5 rounded-b-xl';

  return (
    <div className="h-full w-full grid grid-cols-2 gap-2 font-sans text-slate-900 overflow-hidden" style={FONT_INTER}>
      {/* SLA WATCH - Compact dengan semua elemen, spacing optimal untuk 1440x800 */}
      <div className={`${cardBase} p-2 flex flex-col justify-between min-h-0 overflow-hidden`}>
        <div className="flex flex-col">
          <span className="dash-meta font-medium uppercase tracking-[0.1em] text-slate-800 block mb-0.5" style={{ opacity: 0.6, fontSize: '0.65rem' }}>Portfolio Responsiveness</span>
          <span className="dash-num-lg font-semibold tabular-nums leading-none tracking-[-0.02em] text-slate-800" style={{ ...FONT_INTER, fontSize: '1.4rem' }}>{formatTime(timeLeft)}</span>
          <span className="dash-meta font-medium uppercase tracking-[0.08em] text-slate-500 mt-0.5 block" style={{ opacity: 0.6, fontSize: '0.65rem' }}>Deadline Approaching</span>
        </div>
        <div className={compactMicro}>
          <span className="dash-meta text-slate-500" style={{ fontSize: '0.65rem' }}>Avg: 12m</span>
          <div className="w-full h-0.5 bg-slate-200/60 rounded-md overflow-hidden mt-1">
            <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full rounded-md bg-gradient-to-r from-amber-200/90 to-red-500/80" />
          </div>
        </div>
      </div>
      
      {/* TIERING - Compact dengan semua elemen, spacing optimal untuk 1440x800 */}
      <div className={`${cardBase} p-2 flex flex-col justify-between min-h-0 overflow-hidden`}>
        <div className="flex flex-col">
          <span className="dash-meta font-medium uppercase tracking-[0.1em] text-slate-500 block mb-0.5" style={{ opacity: 0.6, fontSize: '0.65rem' }}>Tiering</span>
          <span className="dash-num-lg font-semibold tracking-[-0.02em] text-[#1C1A16] leading-none tabular-nums" style={{ ...FONT_INTER, fontSize: '1.4rem' }}>82%</span>
          <span className="dash-meta font-medium uppercase tracking-[0.08em] text-slate-500 mt-0.5 block" style={{ opacity: 0.6, fontSize: '0.65rem' }}>Tier 1 Focus</span>
        </div>
        <div className={compactMicro}>
          <span className="inline-flex items-center dash-meta font-medium text-[#1C1A16] bg-[#1C1A16]/10 px-1.5 py-0.5 rounded-md" style={{ fontSize: '0.65rem' }}>+2.4%</span>
          <div className="w-full h-0.5 bg-slate-200/60 rounded-md overflow-hidden mt-1.5">
            <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full rounded-md bg-gradient-to-r from-[#1C1A16]/90 to-[#334155]/80" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PerformanceTile() {
  const [timeLeft, setTimeLeft] = useState(1694);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 1800), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const floatVar = (delay: number) => ({
    animate: { y: [0, -2, 0] },
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const, delay }
  });

  const microSection = 'mt-auto w-full pt-3 border-t border-slate-200/60 bg-slate-50/40 -mx-5 px-5 pb-3 rounded-b-xl';

  return (
    <div className="h-full w-full flex flex-col gap-6 font-sans text-slate-900" style={FONT_INTER}>
      <div className="grid grid-cols-2 gap-6">
        {/* SLA WATCH */}
        <motion.div className={`${cardBase} p-5 h-fit flex flex-col`} {...floatVar(0)}>
          <span className="dash-body-sm font-medium uppercase tracking-[0.1em] text-slate-800 block mb-2" style={{ opacity: 0.6 }}>Portfolio Responsiveness</span>
          <span className="dash-num-xl font-semibold tabular-nums leading-none block tracking-[-0.02em] text-slate-800" style={FONT_INTER}>{formatTime(timeLeft)}</span>
          <span className="dash-body font-medium uppercase tracking-[0.08em] text-slate-500 mt-1.5 block" style={{ opacity: 0.6 }}>Deadline Approaching</span>
          <div className={microSection}>
            <span className="dash-body-sm text-slate-500">Avg. Response: 12m</span>
            <div className="w-full h-1 bg-slate-200/60 rounded-md overflow-hidden mt-2">
              <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full rounded-md bg-gradient-to-r from-amber-200/90 to-red-500/80" />
            </div>
          </div>
        </motion.div>

        {/* TIERING */}
        <motion.div className={`${cardBase} p-5 h-fit flex flex-col`} {...floatVar(0.2)}>
          <span className="dash-body-sm font-medium uppercase tracking-[0.1em] text-slate-500 block mb-2" style={{ opacity: 0.6 }}>Tiering</span>
          <span className="dash-num-xl font-semibold tracking-[-0.02em] text-[#1C1A16] leading-none tabular-nums" style={FONT_INTER}>82%</span>
          <span className="dash-body font-medium uppercase tracking-[0.08em] text-slate-500 mt-1.5 block" style={{ opacity: 0.6 }}>Tier 1 Focus</span>
          <div className={microSection}>
            <span className="inline-flex items-center dash-body-sm font-medium text-[#1C1A16] bg-[#1C1A16]/10 px-2 py-1 rounded-md">+2.4% vs last hour</span>
            <div className="w-full h-1 bg-slate-200/60 rounded-md overflow-hidden mt-3">
              <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full rounded-md bg-gradient-to-r from-[#1C1A16]/90 to-[#334155]/80" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* GROUP GOVERNANCE */}
      <motion.div className={`${cardBase} flex-1 min-h-0 p-5`} {...floatVar(0.4)}>
        <div className="w-full flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className="dash-body-sm font-medium uppercase tracking-[0.1em] text-slate-800"
            >
              Sectoral Watch
            </span>
          
          </div>
          <span className="dash-meta text-slate-400 font-medium">4 entities · Avg 94</span>
          <span className="dash-meta font-semibold text-[#1C1A16] uppercase tracking-[0.06em] bg-[#1C1A16]/10 px-2.5 py-1 rounded-md">
            Healthy
          </span>
        </div>
        <div className="w-full grid grid-cols-2 gap-3 flex-1 min-h-0">
          {[
            { name: 'Sektor Energi', code: 'ENERGY', score: 98, sentiment: '+5.2%', alerts: 0 },
            { name: 'Sektor Finansial', code: 'FINANCE', score: 95, sentiment: '+3.8%', alerts: 1 },
            { name: 'Sektor Mineral', code: 'MINERAL', score: 92, sentiment: '+2.1%', alerts: 0 },
            { name: 'Sektor Telco & Infra', code: 'TELCO', score: 91, sentiment: '+1.8%', alerts: 0 }
          ].map((sub) => (
            <div
              key={sub.name}
              className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-200"
            >
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-1">
                  <span className="dash-body font-semibold text-slate-700 truncate">{sub.name}</span>
                  <span className="dash-meta font-mono font-medium text-slate-400 shrink-0">{sub.code}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="dash-hero font-semibold text-[#1C1A16] leading-none tracking-[-0.02em]">{sub.score}</span>
                  <span className="dash-meta font-medium text-[#1C1A16] bg-[#1C1A16]/10 px-1.5 py-0.5 rounded">
                    {sub.sentiment}
                  </span>
                  {sub.alerts > 0 && (
                    <span className="dash-meta font-medium text-amber-600/80 bg-amber-50/70 px-1.5 py-0.5 rounded">
                      1 alert
                    </span>
                  )}
                </div>
              </div>
              <div className="w-14 shrink-0">
                <div className="w-full h-1.5 bg-slate-200/50 rounded-md overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sub.score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#1C1A16]/90 to-[#334155]/80 rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
