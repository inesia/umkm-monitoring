'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { ChannelBar } from '@/types/umkm';
import { cn } from '@/lib/utils';

/** Brand colors from HTML Media Listening design */
const CHANNEL_META: {
  name: string;
  line: string;
  iconBg: string;
  aliases: string[];
}[] = [
  { name: 'TikTok', line: '#FE2C55', iconBg: '#111111', aliases: ['TikTok'] },
  { name: 'X (Twitter)', line: '#7DD3FC', iconBg: '#1d9bf0', aliases: ['X (Twitter)', 'X'] },
  { name: 'Instagram', line: '#F472B6', iconBg: 'ig', aliases: ['Instagram'] },
  { name: 'Facebook', line: '#93C5FD', iconBg: '#3b5998', aliases: ['Facebook'] },
  { name: 'YouTube', line: '#F87171', iconBg: '#ff0000', aliases: ['YouTube'] },
  { name: 'Online News', line: '#64748B', iconBg: '#6b7280', aliases: ['Online News', 'News'] },
  { name: 'Threads', line: '#18181B', iconBg: '#000000', aliases: ['Threads'] },
];

const CHANNEL_ORDER = CHANNEL_META.map((c) => c.name);

const IG_BG =
  'radial-gradient(circle at 30% 110%, #ffdb73, #fcaf45 20%, #f56040 45%, #d6249f 65%, #833ab4 90%)';

const TOP_MENTIONS = [
  'Video TikTok @infoumkm.id soal hoaks KUR',
  'Thread X: klarifikasi resmi mulai naik',
  'IG Reels testimoni pelaku usaha UMKM',
  'Post FB grup pedagang: tanya realisasi KUR',
  'YouTube clip kunjungan sentra sertifikasi',
  'Online news: liputan program digitalisasi',
  'Threads: opini target Sapa UMKM',
];

type HourPoint = {
  hour: string;
  values: Record<string, number>;
  total: number;
  mention: string;
};

type ScrubState = {
  hour: string;
  mention: string;
  total: number;
  breakdown: { name: string; value: number; color: string }[];
  x: number;
  y: number;
};

type ChartMode = 'merged' | 'split';

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

function hexAlpha(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function metaFor(name: string) {
  return (
    CHANNEL_META.find((c) => c.aliases.some((a) => name === a || name.startsWith(a))) ??
    CHANNEL_META[0]
  );
}

function ChannelIcon({ name }: { name: string }) {
  const m = metaFor(name);
  const bg = m.iconBg === 'ig' ? IG_BG : m.iconBg;
  return (
    <span
      className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center shrink-0 text-white"
      style={{ background: bg }}
      aria-hidden
    >
      {name.startsWith('TikTok') && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff">
          <path d="M16.5 3c.4 2.2 1.9 3.9 4.2 4.2v3.1c-1.5 0-2.9-.4-4.2-1.2v6.6c0 3.4-2.7 6.1-6.1 6.1S4.3 19.1 4.3 15.7s2.7-6.1 6.1-6.1c.4 0 .8 0 1.2.1v3.2c-.4-.1-.8-.2-1.2-.2-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9 2.9-1.3 2.9-2.9V3h3.2z" />
        </svg>
      )}
      {(name.startsWith('X') || name.includes('Twitter')) && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff">
          <path d="M23 4.5c-.85.38-1.76.63-2.72.75a4.75 4.75 0 0 0 2.08-2.62 9.5 9.5 0 0 1-3.01 1.15A4.74 4.74 0 0 0 11.1 8.1 13.44 13.44 0 0 1 1.64 3.16a4.74 4.74 0 0 0 1.47 6.32c-.77-.02-1.49-.24-2.12-.59v.06a4.74 4.74 0 0 0 3.8 4.65c-.7.19-1.44.22-2.14.08a4.75 4.75 0 0 0 4.43 3.29A9.5 9.5 0 0 1 0 19.54 13.4 13.4 0 0 0 7.26 21.6c8.7 0 13.46-7.2 13.46-13.46 0-.2 0-.41-.02-.61A9.6 9.6 0 0 0 23 4.5z" />
        </svg>
      )}
      {name === 'Instagram' && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.3" cy="6.7" r="1.1" fill="#fff" stroke="none" />
        </svg>
      )}
      {name === 'Facebook' && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="#fff">
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
        </svg>
      )}
      {name === 'YouTube' && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff">
          <path d="M22 8.5s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C16.4 5.3 12 5.3 12 5.3s-4.4 0-7.1.2c-.4 0-1.3.1-2.1.9C2.2 7 2 8.5 2 8.5S1.8 10.3 1.8 12v1.9c0 1.7.2 3.5.2 3.5s.2 1.5.8 2.1c.8.8 1.9.8 2.3.9 1.7.2 7 .2 7 .2s4.4 0 7.1-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.5V12c0-1.7-.2-3.5-.2-3.5z" />
          <path d="M9.8 15.5V9.9l5.4 2.8-5.4 2.8z" fill="#ff0000" />
        </svg>
      )}
      {name === 'Online News' && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8h7M6 11h7M6 14h4" strokeLinecap="round" />
          <rect x="15" y="8" width="4" height="4" />
        </svg>
      )}
      {name === 'Threads' && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
          <path d="M7 3.5C4.5 5.5 3.5 8.5 4 12c.5 4 3 8 8 8s7.5-4 8-8c.3-2.5-.3-4.5-1.5-6" />
          <path d="M9 8c0-1.5 1.2-2.5 3-2.5s3 1 3 2.7c0 1.3-.8 2-2 2.5-1.3.5-2 1.2-2 2.5v.5" />
          <circle cx="12" cy="17" r=".4" fill="#fff" stroke="none" />
        </svg>
      )}
    </span>
  );
}

function buildSeries(channels: ChannelBar[]) {
  const named = CHANNEL_ORDER.map((name) => {
    const found = channels.find((c) =>
      metaFor(name).aliases.some((a) => c.name === a || c.name.startsWith(a)),
    );
    return { name, pct: found?.pct ?? 8 };
  });
  const totalPct = named.reduce((s, c) => s + c.pct, 0) || 1;
  const hours = Array.from({ length: 25 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

  const points: HourPoint[] = hours.map((hour, h) => {
    const values: Record<string, number> = {};
    let total = 0;
    named.forEach((ch, idx) => {
      const weight = ch.pct / totalPct;
      const wave =
        0.55 +
        0.32 * Math.sin((h / 24) * Math.PI * 2 + idx * 0.8) +
        0.12 * Math.sin((h / 8) * Math.PI + idx);
      const spike = h === 19 || h === 20 || h === 21 ? 1.85 : h === 11 || h === 12 ? 1.35 : 1;
      const v = Math.round(weight * 95 * wave * spike * 12);
      values[ch.name] = v;
      total += v;
    });
    return {
      hour,
      values,
      total,
      mention: TOP_MENTIONS[h % TOP_MENTIONS.length],
    };
  });

  const mean = points.reduce((s, p) => s + p.total, 0) / points.length;
  const threshold = mean * 1.4;
  let anomalyIdx: number | null = null;
  let max = 0;
  points.forEach((p, i) => {
    if (p.total > threshold && p.total > max) {
      max = p.total;
      anomalyIdx = i;
    }
  });

  return { hours, names: named.map((n) => n.name), points, anomalyIdx };
}

export function MediaListeningChart({
  channels,
  caption,
  mode = 'merged',
}: {
  channels: ChannelBar[];
  caption?: string;
  mode?: ChartMode;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const { hours, names, points, anomalyIdx } = useMemo(
    () => buildSeries(channels),
    [channels],
  );
  const [scrub, setScrub] = useState<ScrubState | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReactECharts>(null);

  const option = useMemo<EChartsOption>(() => {
    const stacked = mode === 'merged';
    const series = names.map((name) => {
      const color = metaFor(name).line;
      return {
        name,
        type: 'line' as const,
        stack: stacked ? 'total' : undefined,
        smooth: true,
        showSymbol: false,
        sampling: 'lttb' as const,
        lineStyle: {
          width: stacked ? 1 : 1.5,
          color,
          opacity: 0.95,
          shadowBlur: stacked ? 2 : 4,
          shadowColor: hexAlpha(color, 0.45),
        },
        areaStyle: stacked
          ? {
              color: {
                type: 'linear' as const,
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: hexAlpha(color, 0.55) },
                  { offset: 1, color: hexAlpha(color, 0.05) },
                ],
              },
            }
          : {
              color: hexAlpha(color, 0.05),
            },
        emphasis: { focus: 'series' as const },
        data: points.map((p) => p.values[name]),
        animationDuration: reducedMotion ? 0 : 900,
        animationEasing: 'cubicOut' as const,
      };
    });

    return {
      animation: !reducedMotion,
      animationDuration: reducedMotion ? 0 : 900,
      color: names.map((n) => metaFor(n).line),
      grid: { left: 42, right: 12, top: 16, bottom: 28 },
      legend: { show: false },
      xAxis: {
        type: 'category',
        data: hours,
        boundaryGap: false,
        axisLabel: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#5f6b76',
          fontFamily: 'var(--font-ubuntu)',
          interval: (_: number, value: string) =>
            ['00:00', '06:00', '12:00', '18:00', '24:00'].includes(value),
        },
        axisLine: { lineStyle: { color: 'rgba(31,59,87,0.3)', width: 2 } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        splitNumber: 3,
        axisLabel: { fontSize: 14, fontWeight: 'bold', color: '#5f6b76', fontFamily: 'var(--font-ubuntu)' },
        splitLine: {
          lineStyle: { color: 'rgba(31,59,87,0.15)', type: 'dashed' },
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      tooltip: { show: false },
      series: names.map((name) => {
        const color = metaFor(name).line;
        return {
          name,
          type: 'line' as const,
          stack: mode === 'merged' ? 'total' : undefined,
          smooth: true,
          showSymbol: false,
          sampling: 'lttb' as const,
          lineStyle: {
            width: mode === 'merged' ? 1.5 : 2,
            color,
            opacity: 0.95,
            shadowBlur: 3,
            shadowColor: hexAlpha(color, 0.45),
          },
          areaStyle: mode === 'merged'
            ? {
                color: {
                  type: 'linear' as const,
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: hexAlpha(color, 0.65) },
                    { offset: 1, color: hexAlpha(color, 0.1) },
                  ],
                },
              }
            : {
                color: hexAlpha(color, 0.1),
              },
          silent: true,
          data: points.map((p) => p.values[name]),
          animationDuration: reducedMotion ? 0 : 900,
          animationEasing: 'cubicOut' as const,
        };
      }),
      axisPointer: {
        show: true,
        type: 'line',
        snap: true,
        label: { show: false },
        lineStyle: { color: '#152943', width: 2, type: 'dashed' },
        triggerTooltip: false,
      },
    };
  }, [hours, names, points, mode, reducedMotion]);

  const onAxisPointer = useCallback(
    (params: { axesInfo?: { value?: string | number }[] }) => {
      const axisVal = params?.axesInfo?.[0]?.value;
      if (axisVal == null || !wrapRef.current) return;
      const hour = String(axisVal);
      const idx = hours.indexOf(hour);
      if (idx < 0) return;
      const point = points[idx];
      const chart = chartRef.current?.getEchartsInstance();
      let x = 0;
      if (chart) {
        try {
          const pixel = chart.convertToPixel({ xAxisIndex: 0 }, hour);
          x = typeof pixel === 'number' ? pixel : Array.isArray(pixel) ? pixel[0] : 0;
        } catch {
          x = (idx / Math.max(1, hours.length - 1)) * wrapRef.current.clientWidth;
        }
      }
      setScrub({
        hour: point.hour,
        mention: point.mention,
        total: point.total,
        breakdown: names.map((n) => ({
          name: n,
          value: point.values[n],
          color: metaFor(n).line,
        })),
        x,
        y: 28,
      });
    },
    [hours, points, names],
  );

  const showScrubAt = useCallback(
    (idx: number) => {
      if (!wrapRef.current || idx < 0 || idx >= points.length) return;
      const point = points[idx];
      const hour = hours[idx];
      const chart = chartRef.current?.getEchartsInstance();
      let x =
        (idx / Math.max(1, hours.length - 1)) * wrapRef.current.clientWidth;
      if (chart) {
        try {
          const pixel = chart.convertToPixel({ xAxisIndex: 0 }, hour);
          x = typeof pixel === 'number' ? pixel : Array.isArray(pixel) ? pixel[0] : x;
          chart.dispatchAction({
            type: 'updateAxisPointer',
            currTrigger: 'mousemove',
            x: typeof pixel === 'number' ? pixel : Array.isArray(pixel) ? pixel[0] : x,
            y: 40,
          });
        } catch {
          /* ignore */
        }
      }
      setScrub({
        hour: point.hour,
        mention: point.mention,
        total: point.total,
        breakdown: names.map((n) => ({
          name: n,
          value: point.values[n],
          color: metaFor(n).line,
        })),
        x,
        y: 28,
      });
    },
    [hours, points, names],
  );

  /* TV hands-free auto-scrub along the 24H timeline */
  useEffect(() => {
    if (reducedMotion || points.length === 0) return;
    let idx = anomalyIdx ?? 8;
    showScrubAt(idx);
    const id = window.setInterval(() => {
      idx = (idx + 1) % points.length;
      showScrubAt(idx);
    }, 3200);
    return () => clearInterval(id);
  }, [points.length, anomalyIdx, reducedMotion, showScrubAt, mode]);

  const clearScrub = useCallback(() => setScrub(null), []);

  const anomalyLeft =
    anomalyIdx != null && hours.length > 1
      ? `${(anomalyIdx / (hours.length - 1)) * 100}%`
      : null;

  return (
    <div className="flex flex-col h-full min-h-0 gap-2 overflow-hidden">
      <div className="flex-1 min-h-0 w-full flex gap-4 overflow-hidden">
        {/* Chart Area */}
        <div ref={wrapRef} className="relative flex-1 min-w-0 overflow-hidden">
          <ReactECharts
            ref={chartRef}
            option={option}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
            notMerge
            lazyUpdate
          />

          {/* Significantly Larger SPIKE Badge with Time Label */}
          {anomalyLeft != null && (
            <div
              className="absolute top-2 z-10 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-sm shadow-lg shadow-red-500/40 tracking-widest uppercase border-2 border-white ring-4 ring-red-500/20 whitespace-nowrap"
              style={{ left: `clamp(75px, ${anomalyLeft}, calc(100% - 100px))` }}
              title="Volume spike terdeteksi"
            >
              <span className="w-2 h-2 rounded-full bg-white shrink-0 animate-pulse" />
              SPIKE • 19:00–22:00
            </div>
          )}
        </div>

        {/* Right Side Stats Legend */}
        <div className="w-[140px] xl:w-[180px] shrink-0 flex flex-col justify-center gap-3 border-l pl-4 border-slate-200/60 overflow-hidden">
          {channels.map((ch) => (
            <div key={ch.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <ChannelIcon name={ch.name} />
                <span className="text-xs font-normal text-slate-500 truncate">
                  {ch.name === 'X (Twitter)' ? 'X' : ch.name}
                </span>
              </div>
              <span className="text-sm font-extrabold text-slate-900 tabular-nums shrink-0">
                {ch.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {caption ? (
        <div className="shrink-0 p-3 rounded-xl bg-blue-50/80 border border-blue-100/50 flex items-start gap-2.5 mt-1">
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-white">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <p 
            className="text-xs xl:text-sm font-normal leading-snug text-blue-900 [&>strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: caption }}
          />
        </div>
      ) : null}
    </div>
  );
}
