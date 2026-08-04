'use client';

import { motion } from 'framer-motion';

const TAGS = [
  { label: 'Service Quality', weight: 1.0 },
  { label: 'Digital Banking', weight: 0.9 },
  { label: 'Convenience', weight: 0.75 },
  { label: 'Trust', weight: 0.8 },
  { label: 'Innovation', weight: 0.7 },
  { label: 'Corporate Banking', weight: 0.6 },
  { label: 'SME Support', weight: 0.55 },
  { label: 'Sustainability', weight: 0.5 },
];

export function BrandPerceptionPanel() {
  // Mock metrics for pitching
  const prValue = 'Rp 5,2 M';
  const newsValue = 'Rp 3,8 M';
  const engagement = '1,2M';

  return (
    <motion.div
      className="glass-spatial-card w-full h-full flex flex-col rounded-md p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header & Metrics */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[9px] font-light text-slate-400 uppercase tracking-[0.25em]">
            Brand Perception
          </p>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
            Danantara & Group · Realtime View
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              PR Value
            </span>
            <span className="text-sm font-bold text-[#1C1A16] tabular-nums">
              {prValue}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              News Value
            </span>
            <span className="text-sm font-bold text-sky-600 tabular-nums">
              {newsValue}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              Engagement
            </span>
            <span className="text-sm font-bold text-[#AF261D] tabular-nums">
              {engagement}
            </span>
          </div>
        </div>
      </div>

      {/* Tag Cloud / Word Cloud Lite */}
      <div className="flex-1 min-h-0 mt-1">
        <div className="flex flex-wrap gap-1.5">
          {TAGS.map((tag, idx) => (
            <span
              key={tag.label}
              className="rounded-md px-2.5 py-1 bg-slate-50 text-slate-600"
              style={{
                fontSize: `${8 + tag.weight * 6}px`,
                opacity: 0.8 + tag.weight * 0.2,
                transform: `translateY(${(idx % 3) * 2 - 2}px)`,
              }}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Hint */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.2em] text-slate-400">
          Word Cloud Snapshot
        </span>
        <span className="text-[8px] text-slate-400">
          Top drivers from last 24h
        </span>
      </div>
    </motion.div>
  );
}

