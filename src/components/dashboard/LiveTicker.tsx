'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

const FONT_INTER = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };

const TICKER_ITEMS = [
  { type: 'STOCK', label: 'IDX', value: '7,320', change: '+0.45%', trend: 'up' as const },
  { type: 'NEWS', label: 'BREAKING', text: 'Danantara jajaki kemitraan strategis hilirisasi nikel dengan konsorsium global.' },
  { type: 'NEWS', label: 'BUMN', text: 'Sentimen positif pasar terhadap tata kelola BUMN di bawah portofolio Danantara.' },
  { type: 'STOCK', label: 'ICDX', value: '1,241', change: '+1.12%', trend: 'up' as const },
  { type: 'NEWS', label: 'ECONOMY', text: 'Stabilitas dividen BUMN perbankan diprediksi maksimal tahun ini.' },
  { type: 'NEWS', label: 'HILIRISASI', text: 'Proyek strategis nasional di sektor mineral menunjukkan progres signifikan.' },
];

export function LiveTicker() {
  return (
    <div
      className="h-12 w-full flex items-center overflow-hidden relative border-t border-slate-200/60 bg-white/40 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
      style={FONT_INTER}
    >
      {/* Live Feed tag - BNI orange */}
      <div className="h-full px-4 flex items-center gap-2 z-20 relative bg-[#AF261D] shrink-0">
        <Zap className="w-3 h-3 text-white/90" />
        <span className="text-white dash-meta font-medium uppercase tracking-[0.1em]">
          Live Feed
        </span>
      </div>

      {/* Scrolling area */}
      <div className="flex-1 relative flex items-center overflow-hidden bg-slate-50/30">
        <motion.div
          className="flex items-center gap-8 whitespace-nowrap px-6"
          animate={{ x: [0, -2000] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 group cursor-default">
              {item.type === 'STOCK' ? (
                <div className="flex items-center gap-2">
                  <span className="dash-meta font-medium uppercase tracking-[0.1em] text-slate-500" style={{ opacity: 0.7 }}>
                    {item.label}
                  </span>
                  <span className="dash-body font-semibold text-slate-800 tabular-nums tracking-[-0.02em]" style={FONT_INTER}>
                    {item.value}
                  </span>
                  <div className={`flex items-center gap-0.5 dash-meta font-semibold ${item.trend === 'up' ? 'text-[#1C1A16]' : 'text-red-500'}`}>
                    {item.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{item.change}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#AF261D]/10 text-[#AF261D] dash-meta font-semibold text-[#AF261D] uppercase tracking-[0.08em] border border-[#AF261D]/20 text-[0.65rem]">
                    {item.label}
                  </span>
                  <span className="dash-body-sm font-medium text-slate-700 group-hover:text-[#AF261D] transition-colors">
                    {item.text}
                  </span>
                </div>
              )}
              <div className="h-1 w-1 rounded-md bg-slate-300/80 shrink-0" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
