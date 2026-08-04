'use client';

import { motion } from 'framer-motion';
import type { TickerItem } from '@/types/umkm';

/** Tag chips on dark navy — high contrast */
const TAG_STYLE: Record<TickerItem['tag'], { bg: string; color: string }> = {
  hoax: { bg: 'rgba(239, 68, 68, 0.22)', color: '#FCA5A5' },
  edu: { bg: 'rgba(16, 185, 129, 0.22)', color: '#6EE7B7' },
  media: { bg: 'rgba(191, 210, 227, 0.18)', color: '#D7E6F4' },
  isu: { bg: 'rgba(245, 158, 11, 0.22)', color: '#FCD34D' },
  program: { bg: 'rgba(56, 189, 248, 0.2)', color: '#7DD3FC' },
};

export function UMKMTicker({
  items,
  label = 'Update',
}: {
  items: TickerItem[];
  /** Left rail label (e.g. where Live KPI used to sit). */
  label?: string;
}) {
  const loop = [...items, ...items];
  return (
    <div
      className="umkm-news-ticker h-9 shrink-0 overflow-hidden flex items-center border-t"
      style={{
        background: 'var(--orange-deep)',
        borderColor: 'rgba(191, 210, 227, 0.22)',
      }}
      aria-label="News ticker"
    >
      <div
        className="shrink-0 h-full px-3 flex items-center text-[0.58rem] font-bold uppercase tracking-[0.14em] border-r z-10"
        style={{
          background: 'var(--ink)',
          borderColor: 'rgba(191, 210, 227, 0.28)',
          color: '#EBF1F7',
        }}
      >
        {label}
      </div>
      <div className="flex-1 overflow-hidden relative">
        <motion.div
          className="flex items-center whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        >
          {loop.map((item, i) => {
            const tag = TAG_STYLE[item.tag];
            return (
              <span
                key={`${item.tag}-${i}`}
                className="inline-flex items-center text-[0.74rem] font-medium"
                style={{ color: '#F2F5F5' }}
              >
                <span
                  className="text-[0.58rem] font-bold uppercase tracking-[0.06em] px-2 py-0.5 rounded mx-6"
                  style={{ background: tag.bg, color: tag.color }}
                >
                  {item.tagLabel}
                </span>
                {item.text}
              </span>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
