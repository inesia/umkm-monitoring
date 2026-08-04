'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Pause, RotateCw } from 'lucide-react';
import type { UMKMView } from '@/types/umkm';

const VIEW_LABEL: Record<UMKMView, string> = {
  menteri: 'Menteri',
  program: 'Kementerian & Program',
  krisis: 'Isu & Krisis',
};

type PreSwitchToastProps = {
  show: boolean;
  nextView: UMKMView;
  progress: number;
  onPause: () => void;
};

export function PreSwitchToast({
  show,
  nextView,
  progress,
  onPause,
}: PreSwitchToastProps) {
  if (!show) return null;

  // Approximate remaining seconds (from 93% to 100%)
  const secondsLeft = Math.max(1, Math.ceil(((100 - progress) / 7) * 5));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[9990] flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/95 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md select-none"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <RotateCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
          <span className="text-xs xl:text-sm font-semibold truncate">
            Berpindah ke <b className="text-emerald-400 font-extrabold">{VIEW_LABEL[nextView]}</b> dalam {secondsLeft} detik...
          </span>
        </div>

        <button
          type="button"
          onClick={onPause}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-transform active:scale-95 shrink-0 shadow-sm"
          title="Tekan Space atau Klik untuk Jeda Putaran"
        >
          <Pause className="w-3.5 h-3.5 fill-current" />
          <span>JEDA PUTARAN</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
