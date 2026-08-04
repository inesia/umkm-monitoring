'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type CarouselSlide = {
  id: string;
  label: string;
  children: React.ReactNode;
};

type RightColumnCarouselProps = {
  slides: CarouselSlide[];
  className?: string;
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    filter: 'blur(4px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export function RightColumnCarousel({ slides, className = '' }: RightColumnCarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= slides.length) return;
    setPage(([prev]) => [index, index > prev ? 1 : -1]);
  }, [slides.length]);

  const goPrev = useCallback(() => goTo(page - 1), [page, goTo]);
  const goNext = useCallback(() => goTo(page + 1), [page, goTo]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest?.('input, textarea, [contenteditable]')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goPrev, goNext]);

  const current = slides[page];
  const hasPrev = page > 0;
  const hasNext = page < slides.length - 1;

  return (
    <div className={`relative h-full min-h-0 flex flex-col ${className}`} role="region" aria-label="Dashboard panels carousel">
      {/* Arrow controls - vertically centered on sides */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            disabled={!hasPrev}
            aria-label="Previous panel"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-md bg-white/80 backdrop-blur-sm border border-white/90 shadow-sm flex items-center justify-center text-slate-600 hover:bg-white hover:text-[#1C1A16] hover:scale-110 disabled:opacity-40 disabled:pointer-events-none disabled:hover:scale-100 transition-all duration-200 -translate-x-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1A16] focus-visible:ring-offset-2"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!hasNext}
            aria-label="Next panel"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-md bg-white/80 backdrop-blur-sm border border-white/90 shadow-sm flex items-center justify-center text-slate-600 hover:bg-white hover:text-[#1C1A16] hover:scale-110 disabled:opacity-40 disabled:pointer-events-none disabled:hover:scale-100 transition-all duration-200 translate-x-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1A16] focus-visible:ring-offset-2"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Slide content - overflow hidden for slide effect */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 flex flex-col"
          >
            {current?.children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 pt-3 pb-1 shrink-0">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Go to ${slide.label}`}
              aria-current={idx === page ? 'true' : undefined}
              className={`rounded-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1A16] focus-visible:ring-offset-1 ${
                idx === page
                  ? 'w-6 h-2 bg-[#1C1A16]'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
