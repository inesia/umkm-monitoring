'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Smartphone, X } from 'lucide-react';

export function MobileRotatePrompt() {
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => {
      if (typeof window === 'undefined') return;

      // 1. Mobile device check (UserAgent touch device or coarse pointer on small screen)
      const userAgent = navigator.userAgent || '';
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const isSmallScreen = window.innerWidth <= 900;
      const isMobileDevice = isMobileUA || (isCoarsePointer && isSmallScreen);

      // 2. Portrait orientation check (Height > Width)
      const isPortrait = window.innerHeight > window.innerWidth;

      setIsMobilePortrait(isMobileDevice && isPortrait);
    };

    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  if (!isMobilePortrait || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] bg-slate-950/92 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative flex flex-col items-center max-w-sm w-full bg-slate-900/90 rounded-3xl border border-slate-800 p-8 shadow-2xl">
          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
            title="Tutup Notifikasi"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Animated Rotation Graphic */}
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
            <motion.div
              className="relative text-emerald-400"
              animate={{ rotate: [0, 90, 90, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 0.8,
                ease: 'easeInOut',
              }}
            >
              <Smartphone className="w-16 h-16" strokeWidth={1.5} />
            </motion.div>
            <motion.div
              className="absolute text-emerald-300"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              <RotateCw className="w-20 h-20 opacity-40" strokeWidth={1} />
            </motion.div>
          </div>

          {/* Heading & Instructions */}
          <h2 className="text-xl xl:text-2xl font-extrabold font-heading text-white tracking-tight">
            Putar Layar Perangkat Anda
          </h2>
          <p className="text-sm text-slate-300 mt-2.5 leading-relaxed font-sans">
            Dashboard TV Monitoring UMKM dirancang penuh untuk tampilan <b>Landscape (Mendatar)</b>.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 w-full">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <span>📱 Putar smartphone ke posisi horizontal</span>
            </div>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-xs text-slate-400 hover:text-slate-200 underline mt-1 transition-colors"
            >
              Tetap lanjutkan dalam mode tegak
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
