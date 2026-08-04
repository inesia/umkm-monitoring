'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const FONT_INTER = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };
const cardBase = 'h-full bg-white border border-gray-200 shadow-sm transition-all duration-300 rounded-md p-4 flex flex-col';

const ENTITIES = [
  { name: 'Sektor Energi', score: 98, sentiment: '+5.2%' },
  { name: 'Sektor Finansial', score: 95, sentiment: '+3.8%' },
  { name: 'Sektor Mineral', score: 92, sentiment: '+2.1%' },
  { name: 'Sektor Telco & Infra', score: 91, sentiment: '+1.8%' }
];

export function GroupGovernance() {
  const avg = Math.round(ENTITIES.reduce((sum, e) => sum + e.score, 0) / ENTITIES.length);

  return (
    <motion.div
      className={cardBase}
      style={FONT_INTER}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="dash-section font-medium uppercase tracking-[0.1em] text-slate-800"
        >
          Sectoral Watch
        </span>
        <div className="flex items-center gap-1.5">
          {/* <span className="dash-body font-bold tabular-nums bg-gradient-to-b from-[#1C1A16] to-[#475569] bg-clip-text text-transparent" style={FONT_INTER}>
            {avg}
          </span>
          <span className="dash-meta font-medium text-slate-500" style={{ opacity: 0.6 }}>Avg</span> */}
          <div className="w-px h-3 bg-slate-300/50" />
          <Shield className="w-3 h-3 text-[#1C1A16]" />
          <span className="dash-meta font-semibold text-[#1C1A16] uppercase tracking-[0.06em]">Healthy</span>
        </div>
      </div>

      {/* Main Content: 4 entities grid */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-1.5">
        {ENTITIES.map((e) => (
          <div key={e.name} className="flex flex-col justify-between bg-white/50 rounded-lg px-2 py-1.5">
            <span className="dash-meta font-medium text-slate-600 mb-0.5 truncate" style={{ fontSize: '0.65rem' }}>{e.name}</span>
            <div className="space-y-0.5">
              <div className="flex items-baseline justify-between">
                <span className="dash-num-hero font-semibold text-[#1C1A16] tabular-nums leading-none">{e.score}</span>
                <span className="dash-meta font-medium text-[#1C1A16] bg-[#1C1A16]/10 px-1.5 py-0.5 rounded">{e.sentiment}</span>
              </div>
              <div className="w-full h-1 bg-slate-200/60 rounded-md overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${e.score}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#1C1A16]/90 to-[#334155]/80 rounded-md"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
