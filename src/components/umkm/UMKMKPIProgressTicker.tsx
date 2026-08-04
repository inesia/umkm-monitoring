'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { UMKMKPI } from '@/types/umkm';
import { cn } from '@/lib/utils';

function barGradient(tone?: UMKMKPI['barTone']) {
  if (tone === 'red') return 'linear-gradient(90deg,#F5A08F,var(--neg))';
  if (tone === 'green') return 'linear-gradient(90deg,#9BD8B5,var(--pos))';
  return 'linear-gradient(90deg,#DCE6F1,var(--orange))';
}

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

/** Parse "24.618", "128,4 jt", "+11", "82/100", "−18%" into numeric + suffix. */
function parseKPIValue(raw: string): {
  prefix: string;
  target: number;
  decimals: number;
  decimalSep: ',' | '.';
  suffix: string;
  thousandSep: '.' | ',' | null;
} {
  const m = raw.match(/^([^0-9+−-]*)([+−-]?)([\d.,]+)(.*)$/);
  if (!m) {
    return {
      prefix: '',
      target: 0,
      decimals: 0,
      decimalSep: ',',
      suffix: raw,
      thousandSep: null,
    };
  }
  const [, pre, sign, num, suf] = m;
  const prefix = `${pre}${sign}`;
  const hasCommaDecimal = /,\d{1,2}$/.test(num) && !/\.\d{3}/.test(num);
  const decimalSep: ',' | '.' = hasCommaDecimal ? ',' : '.';
  const thousandSep: '.' | ',' | null = hasCommaDecimal
    ? null
    : num.includes('.')
      ? '.'
      : num.includes(',')
        ? ','
        : null;

  let normalized = num;
  if (hasCommaDecimal) {
    normalized = num.replace(/\./g, '').replace(',', '.');
  } else if (thousandSep === '.') {
    normalized = num.replace(/\./g, '');
  } else if (thousandSep === ',') {
    normalized = num.replace(/,/g, '');
  }

  const target = parseFloat(normalized) || 0;
  const frac = normalized.split('.')[1];
  const decimals = frac ? frac.length : 0;

  return { prefix, target, decimals, decimalSep, suffix: suf, thousandSep };
}

function formatCounted(
  value: number,
  decimals: number,
  decimalSep: ',' | '.',
  thousandSep: '.' | ',' | null,
) {
  const fixed = value.toFixed(decimals);
  const [intPart, frac] = fixed.split('.');
  let intFmt = intPart;
  if (thousandSep === '.') {
    intFmt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  } else if (thousandSep === ',') {
    intFmt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  if (decimals > 0) {
    return `${intFmt}${decimalSep}${frac}`;
  }
  return intFmt;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function useCountUp(raw: string, durationMs: number, enabled: boolean) {
  const parsed = useMemo(() => parseKPIValue(raw), [raw]);
  const [display, setDisplay] = useState(() =>
    enabled
      ? `${parsed.prefix}${formatCounted(0, parsed.decimals, parsed.decimalSep, parsed.thousandSep)}${parsed.suffix}`
      : raw,
  );

  useEffect(() => {
    if (!enabled) {
      setDisplay(raw);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const v = parsed.target * easeOutCubic(t);
      setDisplay(
        `${parsed.prefix}${formatCounted(v, parsed.decimals, parsed.decimalSep, parsed.thousandSep)}${parsed.suffix}`,
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [raw, durationMs, enabled, parsed]);

  return display;
}

function SparklineBar({
  progress,
  tone,
  reducedMotion,
}: {
  progress: number;
  tone?: UMKMKPI['barTone'];
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const color =
      tone === 'red' ? '#C7402D' : tone === 'green' ? '#1E8E5A' : '#F58220';
    const target = Math.max(0, Math.min(100, progress)) / 100;

    if (reducedMotion) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#F1E3D2';
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, h / 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(0, 0, w * target, h, h / 2);
      ctx.fill();
      return;
    }

    let raf = 0;
    const start = performance.now();
    const duration = 900;

    const draw = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const stream = easeOutCubic(t);
      const fillW = w * target * stream;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#F1E3D2';
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, h / 2);
      ctx.fill();

      // streaming fill L→R
      const grad = ctx.createLinearGradient(0, 0, fillW, 0);
      grad.addColorStop(0, tone === 'green' ? '#9BD8B5' : tone === 'red' ? '#F5A08F' : '#DCE6F1');
      grad.addColorStop(1, color);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(0, 0, Math.max(0, fillW), h, h / 2);
      ctx.fill();

      // sparkle head
      if (t < 1 && fillW > 2) {
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.beginPath();
        ctx.ellipse(fillW - 2, h / 2, 3, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      if (t < 1) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [progress, tone, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-1.5 rounded-full"
      aria-hidden
    />
  );
}

function KPIChip({
  kpi,
  reducedMotion,
}: {
  kpi: UMKMKPI;
  reducedMotion: boolean;
}) {
  const display = useCountUp(kpi.value, 700, !reducedMotion);
  const isUp = kpi.deltaTone === 'up';
  const isDown = kpi.deltaTone === 'down';
  const numberColor = isUp ? '#0B5F3A' : isDown ? '#D35400' : kpi.accent || 'var(--ink)';

  return (
    <span
      className="inline-flex items-center gap-3 px-4 py-2 mx-1.5 rounded-[10px] border bg-white shrink-0"
      style={{ borderColor: 'var(--line)', boxShadow: 'var(--shadow-se)' }}
    >
      <span className="flex flex-col gap-0.5 min-w-0">
        <span
          className="text-[0.55rem] font-bold uppercase tracking-[0.12em] whitespace-nowrap"
          style={{ color: '#6B7280' }}
        >
          {kpi.label}
        </span>
        <span className="inline-flex items-baseline gap-2">
          <span className="relative inline-flex items-center justify-center">
            {isUp && !reducedMotion && (
              <span className="kpi-halo" aria-hidden />
            )}
            <span
              className="relative text-[1.05rem] font-bold tabular-nums leading-none whitespace-nowrap"
              style={{ color: numberColor }}
            >
              {display}
            </span>
          </span>
          <span
            className={cn(
              'text-[0.62rem] font-semibold whitespace-nowrap',
              isUp && 'text-[var(--pos)]',
              isDown && 'text-[var(--neg)]',
              kpi.deltaTone === 'flat' && 'text-[var(--neu)]',
            )}
          >
            {kpi.delta}
          </span>
        </span>
      </span>
      <span className="flex flex-col gap-1 w-[4.5rem] shrink-0">
        <SparklineBar
          progress={kpi.bar}
          tone={kpi.barTone}
          reducedMotion={reducedMotion}
        />
        <span
          className="text-[0.55rem] font-bold tabular-nums text-right"
          style={{ color: '#6B7280' }}
        >
          {kpi.bar}%
        </span>
      </span>
    </span>
  );
}

export function UMKMKPIProgressTicker({ items }: { items: UMKMKPI[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const loop = [...items, ...items];

  return (
    <div
      className="h-full min-h-[3.25rem] overflow-hidden flex items-center rounded-[12px] border bg-white px-1"
      style={{ borderColor: 'var(--line)', boxShadow: 'var(--shadow-se)' }}
      aria-label="KPI ticker"
    >
      <div
        className="shrink-0 h-[calc(100%-8px)] my-1 px-2.5 flex items-center text-[0.58rem] font-bold uppercase tracking-[0.14em] border-r"
        style={{ borderColor: 'var(--line)', color: 'var(--orange-deep)' }}
      >
        KPI
      </div>
      <div className="flex-1 overflow-hidden relative">
        <motion.div
          className="flex items-center whitespace-nowrap py-1"
          animate={reducedMotion ? undefined : { x: ['0%', '-50%'] }}
          transition={
            reducedMotion
              ? undefined
              : { duration: 48, repeat: Infinity, ease: 'linear' }
          }
        >
          {loop.map((kpi, i) => (
            <KPIChip
              key={`${kpi.id}-${i}`}
              kpi={kpi}
              reducedMotion={reducedMotion}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
