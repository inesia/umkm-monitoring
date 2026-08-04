'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { ChannelBar } from '@/types/umkm';

const CHANNEL_COLORS: Record<string, string> = {
  TikTok: '#0B192C',
  'X (Twitter)': '#152943',
  X: '#152943',
  Instagram: '#1F3B57',
  Facebook: '#2B4C6F',
};

const CHANNEL_ORDER = ['TikTok', 'X (Twitter)', 'Instagram', 'Facebook'];

const TOP_MENTIONS = [
  'Video “sensus = pajak” viral di TikTok UMKM',
  'Thread X: klarifikasi UU 16/1997 mulai naik',
  'IG Reels testimoni pelaku usaha UMKM',
  'Post FB grup pedagang: tanya jadwal CAPI',
  'Stitch balasan BPS vs hoaks OTP petugas',
  'Repost massal clip radio Tiga TIR',
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

function buildSeries(channels: ChannelBar[]): {
  hours: string[];
  names: string[];
  points: HourPoint[];
  anomalyIdx: number | null;
} {
  const named = CHANNEL_ORDER.map((name) => {
    const found = channels.find(
      (c) => c.name === name || c.name.startsWith(name.split(' ')[0]),
    );
    return { name, pct: found?.pct ?? 10 };
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
      const spike = h === 11 || h === 12 ? 1.55 : h === 19 ? 1.22 : 1;
      const v = Math.round(weight * 120 * wave * spike * 14);
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
  const threshold = mean * 1.45;
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

export function MediaListeningChart({ channels }: { channels: ChannelBar[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const { hours, names, points, anomalyIdx } = useMemo(
    () => buildSeries(channels),
    [channels],
  );
  const [scrub, setScrub] = useState<ScrubState | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReactECharts>(null);

  const option = useMemo<EChartsOption>(() => {
    const series = names.map((name) => ({
      name,
      type: 'line' as const,
      stack: 'total',
      smooth: true,
      showSymbol: false,
      sampling: 'lttb' as const,
      lineStyle: {
        width: 1.5,
        color: CHANNEL_COLORS[name] ?? '#FFB74D',
      },
      areaStyle: {
        color: hexAlpha(CHANNEL_COLORS[name] ?? '#FFB74D', 0.6),
        opacity: 1,
      },
      emphasis: { focus: 'series' as const },
      data: points.map((p) => p.values[name]),
      animationDuration: reducedMotion ? 0 : 900,
      animationEasing: 'cubicOut' as const,
      animationDurationUpdate: reducedMotion ? 0 : 900,
    }));

    const markPoint =
      anomalyIdx != null
        ? {
            symbol: 'circle',
            symbolSize: 1,
            data: [
              {
                name: 'spike',
                coord: [hours[anomalyIdx], points[anomalyIdx].total],
                itemStyle: { color: 'transparent' },
              },
            ],
          }
        : undefined;

    return {
      animation: !reducedMotion,
      animationDuration: reducedMotion ? 0 : 900,
      animationEasing: 'cubicOut',
      color: names.map((n) => CHANNEL_COLORS[n]),
      grid: { left: 32, right: 10, top: 28, bottom: 22 },
      legend: {
        top: 0,
        left: 0,
        itemWidth: 10,
        itemHeight: 6,
        itemGap: 10,
        textStyle: { fontSize: 9, color: '#8A7F72' },
        data: names,
      },
      xAxis: {
        type: 'category',
        data: hours,
        boundaryGap: false,
        axisLabel: {
          fontSize: 9,
          color: '#8A7F72',
          interval: 3,
        },
        axisLine: { lineStyle: { color: '#E6D2BA' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        splitNumber: 3,
        axisLabel: { fontSize: 9, color: '#8A7F72' },
        splitLine: { lineStyle: { color: '#F1E3D2', type: 'dashed' } },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      tooltip: { show: false },
      series: [
        ...series,
        // invisible total line for axis pointer / anomaly anchor
        {
          name: '_total',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 0, opacity: 0 },
          areaStyle: { opacity: 0 },
          data: points.map((p) => p.total),
          markPoint,
          tooltip: { show: false },
          silent: true,
          z: 0,
        },
      ],
      axisPointer: {
        show: true,
        type: 'line',
        snap: true,
        label: { show: false },
        lineStyle: { color: '#152943', width: 1, type: 'dashed' },
        triggerTooltip: false,
      },
    };
  }, [hours, names, points, anomalyIdx, reducedMotion]);

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
      let y = 40;
      if (chart) {
        try {
          const pixel = chart.convertToPixel({ xAxisIndex: 0 }, hour);
          const rect = wrapRef.current.getBoundingClientRect();
          x = typeof pixel === 'number' ? pixel : Array.isArray(pixel) ? pixel[0] : rect.width / 2;
          y = 36;
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
          color: CHANNEL_COLORS[n],
        })),
        x,
        y,
      });
    },
    [hours, points, names],
  );

  const clearScrub = useCallback(() => setScrub(null), []);

  const anomalyLeft =
    anomalyIdx != null && hours.length > 1
      ? `${(anomalyIdx / (hours.length - 1)) * 100}%`
      : null;

  return (
    <div ref={wrapRef} className="relative h-full min-h-[120px] w-full overflow-hidden">
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: '100%', width: '100%', minHeight: 120 }}
        opts={{ renderer: 'canvas' }}
        notMerge
        lazyUpdate
        onEvents={{
          updateAxisPointer: onAxisPointer,
          globalout: clearScrub,
        }}
      />

      {anomalyLeft != null && (
        <div
          className="ml-anomaly-badge absolute top-1 z-10 -translate-x-1/2"
          style={{ left: `clamp(28px, ${anomalyLeft}, calc(100% - 28px))` }}
          title="Volume spike terdeteksi"
        >
          <span className="ml-anomaly-dot" />
          Spike
        </div>
      )}

      <AnimatePresence>
        {scrub && (
          <motion.div
            className="ml-scrub-popup absolute z-20 pointer-events-auto"
            style={{
              left: Math.min(
                Math.max(8, scrub.x - 110),
                (wrapRef.current?.clientWidth ?? 280) - 228,
              ),
              top: scrub.y,
            }}
            initial={
              reducedMotion ? { opacity: 1 } : { opacity: 0, y: 0 }
            }
            animate={
              reducedMotion ? { opacity: 1 } : { opacity: 1, y: -6 }
            }
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }}
          >
            <div className="text-[0.52rem] font-bold uppercase tracking-wider mb-1" style={{ color: '#8A7F72' }}>
              {scrub.hour} WIB · {scrub.total.toLocaleString('id-ID')} mentions
            </div>
            <div className="text-[0.72rem] font-semibold leading-snug mb-1.5" style={{ color: 'var(--ink)' }}>
              {scrub.mention}
            </div>
            <div className="space-y-0.5 mb-2">
              {scrub.breakdown.map((b) => (
                <div
                  key={b.name}
                  className="flex items-center justify-between gap-2 text-[0.6rem]"
                  style={{ color: 'var(--ink-2)' }}
                >
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <i className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: b.color }} />
                    <span className="truncate">{b.name}</span>
                  </span>
                  <b className="tabular-nums shrink-0">{b.value}</b>
                </div>
              ))}
            </div>
            <a
              href="#source"
              className="inline-flex items-center gap-1 text-[0.62rem] font-bold px-2 py-1 rounded-md border bg-white"
              style={{ borderColor: 'var(--line)', color: 'var(--orange-deep)' }}
              onClick={(e) => e.preventDefault()}
            >
              <ExternalLink className="w-3 h-3" />
              Open source
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
