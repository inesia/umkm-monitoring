'use client';

import { motion } from 'framer-motion';
import type { TickerItem } from '@/types/umkm';

const TAG_STYLE = {
  hoax: { bg: '#FDEAE7', color: 'var(--neg)' },
  edu: { bg: '#E8F6EE', color: 'var(--pos)' },
  media: { bg: 'var(--cream-2)', color: 'var(--orange-deep)' },
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
        background: 'linear-gradient(90deg, #E6F4EA 0%, #F0FDF4 40%, #E6F4EA 100%)',
        borderColor: 'var(--line)',
      }}
      aria-label="News ticker"
    >
      <div
        className="shrink-0 h-full px-3 flex items-center text-[0.58rem] font-bold uppercase tracking-[0.14em] border-r z-10"
        style={{
          background: 'rgba(255,249,242,0.96)',
          borderColor: 'var(--line)',
          color: 'var(--orange-deep)',
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
                className="inline-flex items-center text-[0.74rem]"
                style={{ color: 'var(--ink)' }}
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
