'use client';

import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const FONT_INTER = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };
const cardBase = 'h-full bg-white border border-gray-200 shadow-sm transition-all duration-300 rounded-md p-4 flex flex-col';

const CHANNELS = [
  { label: 'Intl (Tier-1 Financial)', pct: 78, color: 'bg-[#1C1A16]/90' },
  { label: 'Social', pct: 12, color: 'bg-[#AF261D]/80' },
  { label: 'Online', pct: 6, color: 'bg-slate-400/90' },
  { label: 'TV/Radio', pct: 4, color: 'bg-slate-300/90' },
];

const GEO = [
  { region: 'Nasional', share: 78 },
  { region: 'Lokal', share: 15 },
  { region: 'Intl', share: 7 },
];

export function ChannelGeoPanel() {
  return (
    <motion.div
      className={cardBase}
      style={FONT_INTER}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="dash-section font-medium uppercase tracking-[0.1em] text-slate-800"
        >
          Media Channel
        </span>
        <div className="flex items-center gap-1.5">
          <span className="dash-body font-bold tabular-nums bg-gradient-to-b from-[#1C1A16] to-[#475569] bg-clip-text text-transparent" style={FONT_INTER}>
            78%
          </span>
          <span className="dash-meta font-medium text-slate-500" style={{ opacity: 0.6 }}>Intl</span>
          {/* <div className="w-px h-3 bg-slate-300/50" />
          <Globe className="w-3 h-3 text-slate-400" />
          <span className="dash-meta font-medium text-slate-500" style={{ opacity: 0.6 }}>All Regions</span> */}
        </div>
      </div>

      {/* Main Content: Channel bars + Geo breakdown */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-2">
        {/* Left: Channel bars */}
        <div className="space-y-1">
          {CHANNELS.map((c) => (
            <div key={c.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="dash-meta font-medium text-slate-600">{c.label}</span>
                <span className="dash-meta font-semibold text-slate-700 tabular-nums">{c.pct}%</span>
              </div>
              <div className="h-1.5 bg-slate-200/60 rounded-md overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-md ${c.color}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right: Geo breakdown */}
        <div className="space-y-1">
          {GEO.map((g) => (
            <div key={g.region} className="flex items-center justify-between bg-white/50 rounded-lg px-2 py-1.5">
              <span className="dash-meta font-medium text-slate-600">{g.region}</span>
              <span className="dash-body font-semibold text-[#1C1A16] tabular-nums">{g.share}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
