'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { UMKMView } from '@/types/umkm';

export const VIEW_ORDER: UMKMView[] = ['ringkasan', 'krisis', 'program'];

export function nextViewOf(current: UMKMView): UMKMView {
  const idx = VIEW_ORDER.indexOf(current);
  return VIEW_ORDER[(idx + 1) % VIEW_ORDER.length];
}

type ViewRotatorProps = {
  activeView: UMKMView;
  onViewChange: (view: UMKMView) => void;
  intervalMs?: number;
  enabled?: boolean;
  onProgressChange?: (progress: number) => void;
  children: (view: UMKMView) => React.ReactNode;
};

export function ViewRotator({
  activeView,
  onViewChange,
  intervalMs = 75000,
  enabled = true,
  onProgressChange,
  children,
}: ViewRotatorProps) {
  const goNext = useCallback(() => {
    onViewChange(nextViewOf(activeView));
  }, [activeView, onViewChange]);

  useEffect(() => {
    if (!enabled) {
      onProgressChange?.(0);
      return;
    }
    onProgressChange?.(0);
    const tick = 100;
    const steps = intervalMs / tick;
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      onProgressChange?.((step / steps) * 100);
      if (step >= steps) {
        step = 0;
        goNext();
      }
    }, tick);
    return () => clearInterval(id);
  }, [enabled, intervalMs, activeView, goNext, onProgressChange]);

  return (
    <div className="relative flex-1 min-h-0 min-w-0 w-full flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 min-h-0 min-w-0 w-full h-full"
        >
          {children(activeView)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
