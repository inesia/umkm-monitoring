'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const FONT_INTER = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };
const cardBase = 'h-full bg-white border border-gray-200 shadow-sm transition-all duration-300 rounded-md p-4 flex flex-col';

const PEOPLE = [
  { name: 'Dirut Pertamina', mentions: 12 },
  { name: 'Dirut Telkom', mentions: 28 },
  { name: 'Menteri BUMN', mentions: 35 },
  { name: 'Dirut Mandiri', mentions: 18 },
];

export function PeopleCapitalPanel() {
  const totalMentions = PEOPLE.reduce((sum, p) => sum + p.mentions, 0);

  return (
    <motion.div
      className={cardBase}
      style={FONT_INTER}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className="dash-section font-medium uppercase tracking-[0.1em] text-slate-800"
        >
          People Mentions
        </span>
        <div className="flex items-center gap-1.5">
          <span className="dash-body font-bold tabular-nums bg-gradient-to-b from-[#1C1A16] to-[#0088A8] bg-clip-text text-transparent" style={FONT_INTER}>
            {totalMentions}
          </span>
          <span className="dash-meta font-medium text-slate-500" style={{ opacity: 0.6 }}>Total</span>
        </div>
      </div>

      {/* Main Content: List of people */}
      <div className="flex-1 min-h-0 space-y-1.5">
        {PEOPLE.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-3 bg-white/50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="dash-body-sm font-medium text-slate-700 truncate">{p.name}</span>
            </div>
            <span className="dash-body font-semibold text-[#1C1A16] tabular-nums shrink-0">{p.mentions}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
