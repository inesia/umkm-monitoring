'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { MapBubble } from '@/types/umkm';
import { UMKMCard } from './UMKMCard';
import { cn } from '@/lib/utils';

const SENTIMENT_FILL = {
  neg: 'rgba(199,64,45,0.78)',
  pos: 'rgba(30,142,90,0.75)',
  neu: 'rgba(21,41,67,0.85)',
} as const;

const VIEW = { x: 0, y: 296, w: 1024, h: 430 };

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

function toMapPercent(b: MapBubble) {
  return {
    left: ((b.x - VIEW.x) / VIEW.w) * 100,
    top: ((b.y - VIEW.y) / VIEW.h) * 100,
  };
}

function pickWeighted(bubbles: MapBubble[], exclude?: string) {
  const pool = bubbles.filter((b) => b.name !== exclude);
  if (!pool.length) return bubbles[0];
  const weights = pool.map((b) => Math.sqrt(b.volume));
  const sum = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * sum;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

export function NationalIssueMap({
  bubbles,
  top,
}: {
  bubbles: MapBubble[];
  top: MapBubble[];
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [landPaths, setLandPaths] = useState('');
  const [activeName, setActiveName] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const pauseUntil = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const active = useMemo(
    () => bubbles.find((b) => b.name === activeName) ?? null,
    [bubbles, activeName],
  );

  useEffect(() => {
    let cancelled = false;
    fetch('/maps/indonesia-land.svg')
      .then((r) => r.text())
      .then((text) => {
        if (cancelled) return;
        const match = text.match(/<g class="indo-land"[^>]*>([\s\S]*?)<\/g>/);
        if (match) setLandPaths(match[1]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-rotate spotlight for TV standby
  useEffect(() => {
    if (!bubbles.length) return;
    setActiveName((prev) => prev ?? pickWeighted(bubbles).name);
    const id = window.setInterval(() => {
      if (Date.now() < pauseUntil.current) return;
      setPinned(false);
      setActiveName((prev) => pickWeighted(bubbles, prev ?? undefined).name);
    }, reducedMotion ? 8000 : 4500);
    return () => clearInterval(id);
  }, [bubbles, reducedMotion]);

  const pauseAuto = useCallback((ms = 10000) => {
    pauseUntil.current = Date.now() + ms;
  }, []);

  const selectBubble = useCallback(
    (b: MapBubble, pin = false) => {
      setActiveName(b.name);
      setPinned(pin);
      pauseAuto(pin ? 14000 : 8000);
    },
    [pauseAuto],
  );

  const onStageMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({
        rx: Math.max(-4, Math.min(4, -ny * 8)),
        ry: Math.max(-5, Math.min(5, nx * 10)),
      });
    },
    [reducedMotion],
  );

  const onStageLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 });
  }, []);

  const list = (top.length ? top : bubbles).slice(0, 5);
  const calloutPos = active ? toMapPercent(active) : null;

  return (
    <UMKMCard
      title="Peta Isu Nasional"
      subtitle="Bubble = volume · auto-spotlight standby"
      className="h-full"
      action={
        <div className="flex gap-3 text-[0.62rem] font-semibold" style={{ color: 'var(--ink-2)' }}>
          <span className="inline-flex items-center gap-1">
            <i className="w-2 h-2 rounded-full" style={{ background: SENTIMENT_FILL.neg }} /> Negatif
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="w-2 h-2 rounded-full" style={{ background: SENTIMENT_FILL.neu }} /> Campuran
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="w-2 h-2 rounded-full" style={{ background: SENTIMENT_FILL.pos }} /> Positif
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-[minmax(140px,180px)_1fr] gap-2 h-full min-h-0">
        <div
          className="border-r pr-2 overflow-y-auto no-scrollbar flex flex-col min-h-0"
          style={{ borderColor: 'var(--line)' }}
        >
          {list.map((item) => {
            const isActive = item.name === activeName;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => selectBubble(item, true)}
                className={cn(
                  'py-1.5 border-b last:border-0 shrink-0 text-left rounded-md px-1 -mx-1 transition-colors',
                  isActive && 'bg-[var(--cream)]',
                )}
                style={{ borderColor: 'var(--cream-2)' }}
              >
                <div className="flex justify-between text-[0.68rem] font-bold gap-1" style={{ color: 'var(--ink)' }}>
                  <span className="truncate pr-1">{item.name}</span>
                  <span className="tabular-nums shrink-0">{item.volume.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div
                    className="flex-1 h-1 rounded-full overflow-hidden flex"
                    style={{ background: 'var(--cream-2)' }}
                  >
                    <i style={{ width: `${item.socialPct}%`, background: 'var(--orange)' }} />
                    <i style={{ width: `${100 - item.socialPct}%`, background: '#3E3A34' }} />
                  </div>
                  <small className="text-[0.52rem] whitespace-nowrap" style={{ color: 'var(--ink-3)' }}>
                    {item.socialPct}% sosial
                  </small>
                </div>
                <div className="text-[0.56rem] mt-0.5 truncate" style={{ color: 'var(--ink-3)' }}>
                  {item.issue}
                </div>
              </button>
            );
          })}
        </div>

        <div
          ref={stageRef}
          className="map-stage relative min-h-0 rounded-lg overflow-hidden"
          style={{
            background: 'var(--cream)',
            perspective: '900px',
          }}
          onMouseMove={onStageMove}
          onMouseLeave={onStageLeave}
        >
          <div
            className="map-parallax absolute inset-0 origin-center"
            style={{
              transform: reducedMotion
                ? undefined
                : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(1.02)`,
              transition: 'transform 180ms ease-out',
              willChange: 'transform',
            }}
          >
            <svg
              viewBox="0 296 1024 430"
              className="w-full h-full block"
              role="img"
              aria-label="Peta sebaran isu Indonesia"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                className="indo-land"
                transform="translate(0,1024) scale(0.1,-0.1)"
                stroke="none"
                dangerouslySetInnerHTML={landPaths ? { __html: landPaths } : undefined}
              />
              <g id="bubbles">
                {bubbles.map((b, i) => {
                  const r = 5 + Math.sqrt(b.volume) * 0.3;
                  const isActive = b.name === activeName;
                  return (
                    <g
                      key={b.name}
                      className={cn('map-bubble-group', isActive && 'is-active')}
                      style={
                        {
                          cursor: 'pointer',
                          animationDelay: `${(i % 8) * 0.18}s`,
                        } as React.CSSProperties
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        selectBubble(b, true);
                      }}
                      onMouseEnter={() => selectBubble(b, false)}
                    >
                      {!reducedMotion && (
                        <circle
                          cx={b.x}
                          cy={b.y}
                          r={r}
                          className={cn('bubble-pulse-ring', `b-${b.sentiment}`)}
                          style={{ animationDelay: `${(i % 8) * 0.18}s` }}
                        />
                      )}
                      <circle
                        cx={b.x}
                        cy={b.y}
                        r={isActive ? r * 1.15 : r}
                        className={cn('bubble', `b-${b.sentiment}`, isActive && 'bubble-active')}
                      />
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          <AnimatePresence mode="wait">
            {active && calloutPos && (
              <motion.div
                key={active.name}
                className="map-auto-callout-anchor"
                style={{
                  left: `${calloutPos.left}%`,
                  top: `${calloutPos.top}%`,
                }}
                initial={
                  reducedMotion
                    ? { opacity: 1, x: '-50%', y: 'calc(-100% - 10px)' }
                    : { opacity: 0, x: '-50%', y: 'calc(-100% + 2px)', scale: 0.96 }
                }
                animate={{ opacity: 1, x: '-50%', y: 'calc(-100% - 10px)', scale: 1 }}
                exit={
                  reducedMotion
                    ? { opacity: 0, x: '-50%', y: 'calc(-100% - 10px)' }
                    : { opacity: 0, x: '-50%', y: 'calc(-100% - 18px)', scale: 0.98 }
                }
                transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="map-auto-callout">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <b style={{ color: 'var(--ink)' }}>{active.name}</b>
                    {pinned && (
                      <span className="text-[0.5rem] font-bold uppercase" style={{ color: 'var(--orange-deep)' }}>
                        Pin
                      </span>
                    )}
                  </div>
                  <div className="text-[0.68rem] tabular-nums font-semibold" style={{ color: 'var(--ink-2)' }}>
                    {active.volume.toLocaleString('id-ID')} mentions · 24 jam
                  </div>
                  <div className="text-[0.62rem] mt-1 leading-snug" style={{ color: 'var(--ink-3)' }}>
                    {active.issue}
                  </div>
                  <div className="map-tip-src mt-1.5">
                    <div className="map-tip-bar">
                      <i style={{ width: `${active.socialPct}%`, background: '#F58220' }} />
                      <i style={{ width: `${100 - active.socialPct}%`, background: '#3E3A34' }} />
                    </div>
                    <small style={{ whiteSpace: 'nowrap', color: '#8A7F72' }}>
                      {active.socialPct}% sosial
                    </small>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </UMKMCard>
  );
}
