'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { MapBubble, SentimentTone } from '@/types/umkm';
import { cn } from '@/lib/utils';

const SENTIMENT_META: Record<
  SentimentTone,
  { fill: string; ring: string; label: string; bar: string }
> = {
  pos: {
    fill: 'rgba(16, 185, 129, 0.82)',
    ring: 'rgba(16, 185, 129, 0.45)',
    label: 'Positif',
    bar: '#10b981',
  },
  neu: {
    fill: 'rgba(245, 158, 11, 0.85)',
    ring: 'rgba(245, 158, 11, 0.45)',
    label: 'Netral',
    bar: '#f59e0b',
  },
  neg: {
    fill: 'rgba(239, 68, 68, 0.82)',
    ring: 'rgba(239, 68, 68, 0.45)',
    label: 'Negatif',
    bar: '#ef4444',
  },
};

/** Logical map content box (matches indonesia-land.svg) */
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

/** Map SVG viewBox point → % inside the stage, accounting for letterboxing */
function svgToStagePercent(
  svg: SVGSVGElement,
  stage: HTMLElement,
  x: number,
  y: number,
) {
  const ctm = svg.getScreenCTM();
  if (!ctm) {
    return {
      left: ((x - VIEW.x) / VIEW.w) * 100,
      top: ((y - VIEW.y) / VIEW.h) * 100,
    };
  }
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const screen = pt.matrixTransform(ctm);
  const rect = stage.getBoundingClientRect();
  return {
    left: ((screen.x - rect.left) / rect.width) * 100,
    top: ((screen.y - rect.top) / rect.height) * 100,
  };
}

/** Callout opens away from the anchor — opposite side of the map edge */
function getCalloutClasses(left: number, top: number, name?: string) {
  let vertical = top >= 52 ? 'is-above' : 'is-below';
  let horizontal = left <= 28 ? 'is-right' : left >= 68 ? 'is-left' : 'is-center';

  if (name) {
    const n = name.toLowerCase();
    // 1. DKI, Jabar, Jateng, Jatim, dan Bali: posisinya di atas titik (is-above)
    if (
      n.includes('dki') ||
      n.includes('jakarta') ||
      n.includes('jawa') ||
      n.includes('jabar') ||
      n.includes('jateng') ||
      n.includes('jatim') ||
      n.includes('bali')
    ) {
      vertical = 'is-above';
    }

    // 2. Papua: pindah ke kiri (is-left)
    if (n.includes('papua')) {
      horizontal = 'is-left';
    }
  }

  return ['map-auto-callout-anchor', vertical, horizontal];
}

function bubbleRadius(volume: number) {
  return 6.5 + Math.sqrt(volume) * 0.38;
}

function formatMentions(n: number) {
  return n.toLocaleString('id-ID');
}

function nextIndex(len: number, current: number) {
  if (len <= 0) return 0;
  return (current + 1) % len;
}

export function NationalIssueMap({
  bubbles = [],
  top = [],
  bare = false,
}: {
  bubbles?: MapBubble[];
  top?: MapBubble[];
  bare?: boolean;
}) {
  const reducedMotion = usePrefersReducedMotion();
  /** Stable id — avoid useId() SSR/client mismatch under AnimatePresence */
  const shadowId = 'national-map-land-shadow';
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);
  const [landPaths, setLandPaths] = useState('');
  const [layoutTick, setLayoutTick] = useState(0);

  const defaultName = useMemo(() => {
    const ranked = top.length ? top : [...bubbles].sort((a, b) => b.volume - a.volume);
    return ranked[0]?.name ?? bubbles[0]?.name ?? null;
  }, [bubbles, top]);

  const [activeName, setActiveName] = useState<string | null>(defaultName);
  const pauseUntil = useRef(0);
  const spotIndex = useRef(0);

  useEffect(() => {
    setActiveName((prev) => {
      if (prev && bubbles.some((b) => b.name === prev)) return prev;
      return defaultName;
    });
  }, [bubbles, defaultName]);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Recalculate callout when stage / SVG size changes
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => setLayoutTick((n) => n + 1));
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted || !bubbles.length) return;
    const id = window.setInterval(() => {
      if (Date.now() < pauseUntil.current) return;
      spotIndex.current = nextIndex(bubbles.length, spotIndex.current);
      setActiveName(bubbles[spotIndex.current]?.name ?? null);
    }, reducedMotion ? 8000 : 4200);
    return () => clearInterval(id);
  }, [mounted, bubbles, reducedMotion]);

  useEffect(() => {
    if (!bubbles.length || !activeName) return;
    const idx = bubbles.findIndex((b) => b.name === activeName);
    if (idx >= 0) spotIndex.current = idx;
  }, [bubbles, activeName]);

  const pauseAuto = useCallback((ms = 10000) => {
    pauseUntil.current = Date.now() + ms;
  }, []);

  const selectBubble = useCallback(
    (b: MapBubble) => {
      const idx = bubbles.findIndex((x) => x.name === b.name);
      if (idx >= 0) spotIndex.current = idx;
      setActiveName(b.name);
      pauseAuto(10000);
    },
    [bubbles, pauseAuto],
  );

  const active = useMemo(
    () => bubbles.find((b) => b.name === activeName) ?? null,
    [bubbles, activeName],
  );

  const calloutPos = useMemo(() => {
    if (!active || !mounted) return null;
    const svg = svgRef.current;
    const stage = stageRef.current;
    if (svg && stage) {
      // layoutTick intentionally read so we recompute after resize
      void layoutTick;
      return svgToStagePercent(svg, stage, active.x, active.y);
    }
    return {
      left: ((active.x - VIEW.x) / VIEW.w) * 100,
      top: ((active.y - VIEW.y) / VIEW.h) * 100,
    };
  }, [active, mounted, layoutTick]);

  const calloutClasses = calloutPos && active
    ? getCalloutClasses(calloutPos.left, calloutPos.top, active.name)
    : ['map-auto-callout-anchor'];
  const sentiment = active ? SENTIMENT_META[active.sentiment] : null;

  return (
    <div className={cn('map-card flex flex-col h-full w-full min-h-0', !bare && 'rounded-xl border')}>
      <div ref={stageRef} className="map-stage relative flex-1 min-h-0 w-full overflow-hidden">
        <div className="map-ocean absolute inset-0" aria-hidden />

        <svg
          ref={svgRef}
          viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
          className="map-svg relative z-[1] w-full h-full block"
          role="img"
          aria-label="Peta sebaran isu Indonesia"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id={shadowId} x="-8%" y="-8%" width="116%" height="116%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1f3b57" floodOpacity="0.08" />
            </filter>
          </defs>
          <g
            className="indo-land"
            transform="translate(0,1024) scale(0.1,-0.1)"
            stroke="none"
            filter={`url(#${shadowId})`}
            suppressHydrationWarning
            dangerouslySetInnerHTML={landPaths ? { __html: landPaths } : undefined}
          />
          <g id="bubbles" className="map-bubbles">
            {bubbles.map((b, i) => {
              const r = bubbleRadius(b.volume);
              const isActive = b.name === activeName;
              const meta = SENTIMENT_META[b.sentiment];
              return (
                <g
                  key={b.name}
                  className={cn('map-bubble-group', isActive && 'is-active')}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectBubble(b);
                  }}
                  onMouseEnter={() => selectBubble(b)}
                >
                  {mounted && !reducedMotion && (
                    <circle
                      cx={b.x}
                      cy={b.y}
                      r={r}
                      fill="none"
                      stroke={meta.ring}
                      strokeWidth={1.4}
                      className="bubble-pulse-ring"
                      style={{ animationDelay: `${(i % 8) * 0.18}s` }}
                    />
                  )}
                  <circle
                    cx={b.x}
                    cy={b.y}
                    r={isActive ? r * 1.15 : r}
                    fill={meta.fill}
                    stroke="#fff"
                    strokeWidth={isActive ? 2.4 : 1.8}
                    className={cn('bubble', isActive && 'bubble-active')}
                    style={
                      isActive
                        ? { filter: `drop-shadow(0 0 7px ${meta.ring})` }
                        : undefined
                    }
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {mounted && (
          <AnimatePresence mode="wait">
            {active && calloutPos && sentiment && (
              <motion.div
                key={active.name}
                className={cn(...calloutClasses)}
                style={{
                  left: `${calloutPos.left}%`,
                  top: `${calloutPos.top}%`,
                }}
                initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="map-auto-callout">
                  <div className="flex items-start justify-between gap-2">
                    <b>{active.name}</b>
                    <span
                      className="map-tone-pill"
                      style={{ color: sentiment.bar, background: `${sentiment.bar}18` }}
                    >
                      {sentiment.label}
                    </span>
                  </div>
                  <div className="map-callout-meta">
                    {formatMentions(active.volume)} mentions · 7 hari
                  </div>
                  <div className="map-callout-issue">{active.issue.split(' · ')[0]}</div>
                  <div className="map-tip-src">
                    <div className="map-tip-bar">
                      <i style={{ width: `${active.socialPct}%`, background: sentiment.bar }} />
                    </div>
                    <small style={{ color: sentiment.bar }}>
                      {active.socialPct}% {sentiment.label.toLowerCase()}
                    </small>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <div className="map-legend-overlay" aria-label="Legenda sentimen">
          {(
            [
              ['pos', 'Positif'],
              ['neu', 'Netral'],
              ['neg', 'Negatif'],
            ] as const
          ).map(([key, label]) => (
            <span key={key}>
              <i style={{ background: SENTIMENT_META[key].fill }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
