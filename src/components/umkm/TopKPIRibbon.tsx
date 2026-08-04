'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, TrendingUp, Radio, ShieldAlert, Newspaper, Instagram, Youtube } from 'lucide-react';
import type { SourceTotal, UMKMKPI } from '@/types/umkm';
import { AnimatePresence, motion } from 'framer-motion';

const SOURCE_ROLL_MS = 4500;

const SOURCE_META: Record<string, { short: string; kindLabel: string; bg: string }> = {
  'X / Tweets': { short: 'X', kindLabel: 'Tweets', bg: '#000000' },
  Instagram: {
    short: 'IG',
    kindLabel: 'Posts',
    bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
  },
  Facebook: { short: 'FB', kindLabel: 'Posts', bg: '#1877f2' },
  TikTok: { short: 'TT', kindLabel: 'Posts', bg: '#0f172a' },
  YouTube: { short: 'YT', kindLabel: 'Posts', bg: '#ff0000' },
  Threads: { short: 'TH', kindLabel: 'Posts', bg: '#000000' },
  'Online News': { short: 'News', kindLabel: 'Articles', bg: '#475569' },
};

function sourceMeta(label: string) {
  const l = label.toLowerCase();
  if (l.includes('news')) return SOURCE_META['Online News'];
  if (l.includes('tiktok')) return SOURCE_META['TikTok'];
  if (l.includes('twitter') || l.includes('tweets') || l.includes('x')) return SOURCE_META['X / Tweets'];
  if (l.includes('instagram')) return SOURCE_META['Instagram'];
  if (l.includes('facebook')) return SOURCE_META['Facebook'];
  if (l.includes('youtube')) return SOURCE_META['YouTube'];
  if (l.includes('threads')) return SOURCE_META['Threads'];
  return (
    SOURCE_META[label] ?? {
      short: label.slice(0, 2).toUpperCase(),
      kindLabel: 'Posts',
      bg: '#152943',
    }
  );
}

function PlatformLogo({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (l.includes('news')) {
    return <Newspaper className="w-4 h-4 text-white shrink-0" />;
  }
  if (l.includes('tiktok')) {
    return (
      <svg className="w-4 h-4 text-white fill-current shrink-0" viewBox="0 0 24 24">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 1 1-2.042-2.784v-3.56a6.438 6.438 0 1 0 5.487 6.344V9.61a8.214 8.214 0 0 0 4.77 1.522V7.687a4.847 4.847 0 0 1-1.005-1.001z" />
      </svg>
    );
  }
  if (l.includes('twitter') || l.includes('tweets') || l.includes('x')) {
    return (
      <svg className="w-3.5 h-3.5 text-white fill-current shrink-0" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (l.includes('facebook')) {
    return (
      <svg className="w-4 h-4 text-white fill-current shrink-0" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (l.includes('instagram')) {
    return <Instagram className="w-4 h-4 text-white shrink-0" />;
  }
  if (l.includes('youtube')) {
    return <Youtube className="w-4 h-4 text-white shrink-0" />;
  }
  if (l.includes('threads')) {
    return (
      <svg className="w-4 h-4 text-white fill-current shrink-0" viewBox="0 0 24 24">
        <path d="M12 21.75c-5.385 0-9.75-4.365-9.75-9.75S6.615 2.25 12 2.25s9.75 4.365 9.75 9.75c0 3.39-1.745 6.368-4.407 8.089-.356.23-.83.118-1.042-.25-.212-.368-.088-.84.269-1.05A8.22 8.22 0 0 0 20.25 12c0-4.556-3.694-8.25-8.25-8.25S3.75 7.444 3.75 12s3.694 8.25 8.25 8.25c2.186 0 4.18-.847 5.672-2.235.334-.31.861-.295 1.173.037.31.332.293.861-.039 1.171A9.704 9.704 0 0 1 12 21.75z" />
      </svg>
    );
  }
  return <Newspaper className="w-4 h-4 text-white shrink-0" />;
}

export interface TopKPIRibbonData {
  sentiment?: {
    positivePct: number;
    neutralPct: number;
    negativePct: number;
    mainText?: string;
    subText?: string;
  };
  volume?: {
    count: string;
    trendText: string;
    sparklineData?: number[];
  };
  shareOfVoice?: {
    pct: string;
    trendText: string;
    segments?: { color: string; pct: number; label: string }[];
  };
  topIssue?: {
    title: string;
    subtitle: string;
    reachCount?: string;
    isWarning?: boolean;
  };
}

interface TopKPIRibbonProps {
  data?: TopKPIRibbonData;
  kpis?: UMKMKPI[];
  /** When set, column 4 shows Post per Sumber roller (Isu Teratas moves to side card) */
  sources?: SourceTotal[];
  className?: string;
}

/**
 * TopKPIRibbon - 10-foot UI TV Dashboard Component for High-Level Executives.
 * Rich graphical density, prominent charts, zero wasted white space.
 */
export function TopKPIRibbon({ data, kpis, sources, className = '' }: TopKPIRibbonProps) {
  // Extract values if `kpis` array is passed
  const kpiMap = useMemo(() => {
    if (!kpis) return {};
    return Object.fromEntries(kpis.map((k) => [k.id, k]));
  }, [kpis]);

  const kpiSentiment = kpiMap.sentiment;
  const kpiVolume = kpiMap.volume;
  const kpiSov = kpiMap.sov;
  const kpiTopIssue = kpiMap.topissue;

  // Resolved Column 1: Sentimen Publik
  const sentiment = {
    positivePct: data?.sentiment?.positivePct ?? 68,
    neutralPct: data?.sentiment?.neutralPct ?? 24,
    negativePct: data?.sentiment?.negativePct ?? 8,
    mainText: data?.sentiment?.mainText ?? kpiSentiment?.value ?? '68% Positif',
    subText: data?.sentiment?.subText ?? kpiSentiment?.delta ?? '24% netral • 8% negatif',
  };

  // Resolved Column 2: Volume Pemberitaan
  const volume = {
    count: data?.volume?.count ?? kpiVolume?.value ?? '1.299',
    trendText: data?.volume?.trendText ?? kpiVolume?.delta ?? '▲ 12% dibanding minggu lalu',
    sparklineData: data?.volume?.sparklineData ?? [650, 780, 720, 910, 890, 1120, 1299],
  };

  // Resolved Column 3: Share of Voice
  const sov = {
    pct: data?.shareOfVoice?.pct ?? kpiSov?.value ?? '34%',
    trendText: data?.shareOfVoice?.trendText ?? kpiSov?.delta ?? '▲ 5 poin (29% -> 34%)',
    segments: data?.shareOfVoice?.segments ?? [
      { color: '#1f3b57', pct: 34, label: 'Kementerian' },
      { color: '#3b82f6', pct: 28, label: 'Program A' },
      { color: '#64748b', pct: 22, label: 'Mitra' },
      { color: '#cbd5e1', pct: 16, label: 'Lainnya' },
    ],
  };

  // Resolved Column 4: Isu Teratas (WARNING STATE)
  const isAwaitingKlarifikasi =
    kpiTopIssue?.delta?.toLowerCase().includes('klarifikasi') ||
    data?.topIssue?.isWarning ||
    true;

  const topIssue = {
    title: data?.topIssue?.title ?? kpiTopIssue?.value ?? 'Konflik kepentingan mitra',
    subtitle: data?.topIssue?.subtitle ?? kpiTopIssue?.delta ?? '410 rb reach • menunggu klarifikasi',
    reachCount: data?.topIssue?.reachCount ?? '410 rb reach',
    isWarning: isAwaitingKlarifikasi,
  };

  // Post per Sumber roller (column 4 when sources provided)
  const [srcIndex, setSrcIndex] = useState(0);
  const [srcProgress, setSrcProgress] = useState(0);
  const srcTotal = sources?.length ?? 0;

  useEffect(() => {
    if (srcTotal <= 1) return;
    setSrcProgress(0);
    const tick = 100;
    const steps = SOURCE_ROLL_MS / tick;
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      setSrcProgress((step / steps) * 100);
      if (step >= steps) {
        step = 0;
        setSrcIndex((i) => (i + 1) % srcTotal);
      }
    }, tick);
    return () => clearInterval(id);
  }, [srcIndex, srcTotal]);

  const currentSource = sources?.[srcIndex] ?? sources?.[0];
  const currentMeta = currentSource ? sourceMeta(currentSource.label) : null;
  const currentKind = currentSource
    ? currentSource.kind === 'tweets'
      ? 'Tweets'
      : currentSource.kind === 'articles'
        ? 'Articles'
        : currentMeta?.kindLabel ?? 'Posts'
    : '';

  // SVG Donut Math for Column 1 (r = 18, circumference = 2 * PI * 18 = 113.097)
  const r = 18;
  const circ = 2 * Math.PI * r;
  const posDash = (sentiment.positivePct / 100) * circ;
  const neuDash = (sentiment.neutralPct / 100) * circ;
  const negDash = (sentiment.negativePct / 100) * circ;

  // SVG Sparkline Math for Column 2
  const points = volume.sparklineData;
  const minVal = Math.min(...points) * 0.9;
  const maxVal = Math.max(...points) * 1.05;
  const width = 160;
  const height = 44;

  const getSvgCoords = (val: number, idx: number) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((val - minVal) / (maxVal - minVal)) * height;
    return { x, y };
  };

  const coordList = points.map((val, idx) => getSvgCoords(val, idx));
  const linePath = coordList.reduce(
    (acc, curr, idx) => (idx === 0 ? `M ${curr.x},${curr.y}` : `${acc} L ${curr.x},${curr.y}`),
    '',
  );
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  return (
    <div
      className={`w-full h-full min-h-0 bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-4 select-none ${className}`}
      style={{
        boxShadow: '0 2px 12px -2px rgba(31, 59, 87, 0.08)',
      }}
      role="region"
      aria-label="Top Executive KPI Ribbon"
    >
      {/* ---------------- COLUMN 1: SENTIMEN PUBLIK ---------------- */}
      <div className="px-4 py-2 flex flex-col justify-between border-r border-slate-200/80 min-w-0 bg-white hover:bg-slate-50/50 transition-colors overflow-hidden">
        <div className="flex items-center justify-between gap-1.5 min-w-0 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse shrink-0" />
            <span className="text-[11px] xl:text-xs uppercase font-medium tracking-wider text-slate-500 font-heading truncate leading-none">
              Sentimen Publik
            </span>
          </div>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100/80 text-emerald-800 border border-emerald-300/60 shrink-0 leading-none">
            {sentiment.positivePct}% POS
          </span>
        </div>

        <div className="my-0.5 flex items-center justify-between gap-2 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="text-2xl xl:text-3xl 2xl:text-4xl font-extrabold tracking-tight text-emerald-600 font-sans tabular-nums leading-none truncate">
              {sentiment.positivePct > 0 && !sentiment.mainText.includes('%')
                ? `${sentiment.positivePct}% Positif`
                : sentiment.mainText}
            </div>

            {/* Sub-bar distribution indicator to fill whitespace */}
            <div className="w-full h-1 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200/60 mt-1.5">
              <div style={{ width: `${sentiment.positivePct}%` }} className="bg-emerald-500 h-full" title={`Positif ${sentiment.positivePct}%`} />
              <div style={{ width: `${sentiment.neutralPct}%` }} className="bg-slate-400 h-full" title={`Netral ${sentiment.neutralPct}%`} />
              <div style={{ width: `${sentiment.negativePct}%` }} className="bg-red-500 h-full" title={`Negatif ${sentiment.negativePct}%`} />
            </div>
          </div>

          {/* Prominent Sleek SVG Donut Chart */}
          <div className="relative w-11 h-11 xl:w-12 xl:h-12 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
              <circle cx="22" cy="22" r={r} fill="transparent" stroke="#e2e8f0" strokeWidth="5" />
              <circle
                cx="22"
                cy="22"
                r={r}
                fill="transparent"
                stroke="#10b981"
                strokeWidth="5"
                strokeDasharray={`${posDash} ${circ - posDash}`}
                strokeDashoffset={0}
                strokeLinecap="round"
              />
              <circle
                cx="22"
                cy="22"
                r={r}
                fill="transparent"
                stroke="#94a3b8"
                strokeWidth="5"
                strokeDasharray={`${neuDash} ${circ - neuDash}`}
                strokeDashoffset={-posDash}
              />
              <circle
                cx="22"
                cy="22"
                r={r}
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="5"
                strokeDasharray={`${negDash} ${circ - negDash}`}
                strokeDashoffset={-(posDash + neuDash)}
              />
            </svg>
            <div className="absolute text-[10px] xl:text-[11px] font-black text-slate-800 tracking-tighter">
              {sentiment.positivePct}%
            </div>
          </div>
        </div>

        <div className="text-[11px] xl:text-xs font-normal text-slate-500 truncate leading-none shrink-0 flex justify-between">
          <span>{sentiment.subText}</span>
        </div>
      </div>

      {/* ---------------- COLUMN 2: VOLUME PEMBERITAAN ---------------- */}
      <div className="px-4 py-2 flex flex-col justify-between border-r border-slate-200/80 min-w-0 bg-white relative overflow-hidden hover:bg-slate-50/50 transition-colors">
        <div className="flex items-center justify-between gap-1.5 z-10 min-w-0 shrink-0">
          <span className="text-[11px] xl:text-xs uppercase font-medium tracking-wider text-slate-500 font-heading truncate leading-none">
            Volume Pemberitaan
          </span>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/60 uppercase tracking-wider shrink-0 leading-none">
            7H Trend
          </span>
        </div>

        <div className="my-0.5 flex items-center justify-between gap-2 z-10 min-w-0 flex-1">
          <div className="min-w-0">
            <div className="text-2xl xl:text-3xl 2xl:text-4xl font-extrabold tracking-tight text-slate-900 font-sans tabular-nums leading-none truncate">
              {volume.count}
            </div>
            <div className="flex items-center gap-1 text-[11px] xl:text-xs font-semibold text-emerald-600 mt-1 truncate">
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{volume.trendText}</span>
            </div>
          </div>

          {/* Expanded Rich SVG Sparkline Chart */}
          <div className="w-28 xl:w-36 h-10 xl:h-11 shrink-0">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="sparklineGradLarge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#sparklineGradLarge)" />
              <path
                d={linePath}
                fill="none"
                stroke="#10b981"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {coordList.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={i === coordList.length - 1 ? '4' : '2'}
                  fill={i === coordList.length - 1 ? '#059669' : '#10b981'}
                  opacity={i === coordList.length - 1 ? '1' : '0.6'}
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="text-[11px] xl:text-xs font-normal text-slate-400 truncate leading-none shrink-0 flex justify-between">
          <span>Rata-rata 185 post/hari</span>
          <span className="font-medium text-slate-500">Peak: 298</span>
        </div>
      </div>

      {/* ---------------- COLUMN 3: SHARE OF VOICE ---------------- */}
      <div className="px-4 py-2 flex flex-col justify-between border-r border-slate-200/80 min-w-0 bg-white hover:bg-slate-50/50 transition-colors overflow-hidden">
        <div className="flex items-center justify-between gap-1.5 min-w-0 shrink-0">
          <span className="text-[11px] xl:text-xs uppercase font-medium tracking-wider text-slate-500 font-heading truncate leading-none">
            Share of Voice
          </span>
          <span className="text-[10px] font-extrabold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200 shrink-0 leading-none">
            #1 Dominan
          </span>
        </div>

        <div className="my-0.5 min-w-0 flex-1 flex flex-col justify-center">
          <div className="flex items-baseline justify-between gap-2 min-w-0">
            <div className="text-2xl xl:text-3xl 2xl:text-4xl font-extrabold tracking-tight text-slate-800 font-sans tabular-nums leading-none truncate">
              {sov.pct}
            </div>
            <div className="text-[11px] xl:text-xs font-semibold text-emerald-600 truncate">
              ▲ 5 poin (29% → 34%)
            </div>
          </div>

          {/* Prominent Stacked Bar Chart across full column width */}
          <div
            className="w-full h-1 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200/60 my-1 gap-0.5"
            title="Distribution Share"
          >
            {sov.segments.map((seg, idx) => (
              <div
                key={idx}
                className="h-full rounded-sm transition-all"
                style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
              />
            ))}
          </div>
        </div>

        {/* Legend pills under stacked bar */}
        <div className="flex items-center justify-between text-[10px] xl:text-[11px] font-normal text-slate-500 truncate leading-none shrink-0">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#1f3b57]" />
            <span>Kementerian (34%)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
            <span>Mitra (28%)</span>
          </div>
        </div>
      </div>

      {/* ---------------- COLUMN 4: POST PER SUMBER (3 Horizontal Cards Side-by-Side) ---------------- */}
      {sources && sources.length > 0 ? (
        <div className="px-3 py-2 flex flex-col justify-between min-w-0 relative overflow-hidden bg-white select-none">
          <div className="flex items-center justify-between gap-1.5 min-w-0 shrink-0">
            <span className="text-[11px] xl:text-xs uppercase font-medium tracking-wider text-slate-500 font-heading truncate leading-none">
              Post per Sumber
            </span>
            <span className="text-[10px] font-bold tabular-nums text-slate-400 shrink-0">
              {srcTotal <= 3 ? `${srcTotal}/${srcTotal}` : `${((srcIndex + 2) % srcTotal) + 1}/${srcTotal}`}
            </span>
          </div>

          <div className="my-0.5 min-w-0 flex-1 flex items-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={srcIndex}
                className="grid grid-cols-3 gap-2.5 w-full items-center min-w-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {(sources.length <= 3
                  ? sources
                  : [
                      sources[srcIndex % srcTotal],
                      sources[(srcIndex + 1) % srcTotal],
                      sources[(srcIndex + 2) % srcTotal],
                    ]
                ).map((src) => {
                  const meta = sourceMeta(src.label);
                  const kind =
                    src.kind === 'tweets'
                      ? 'Tweets'
                      : src.kind === 'articles'
                        ? 'Articles'
                        : meta.kindLabel ?? 'Posts';
                  return (
                    <div
                      key={src.label}
                      className="flex items-center gap-2 min-w-0 overflow-hidden"
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs"
                        style={{ background: meta.bg }}
                      >
                        <PlatformLogo label={src.label} />
                      </span>
                      <div className="min-w-0 overflow-hidden flex-1">
                        <b className="block text-base xl:text-lg 2xl:text-xl font-bold font-koho text-slate-900 tabular-nums leading-none truncate">
                          {src.value}
                        </b>
                        <span className="block text-[10px] xl:text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                          {src.label} · {kind}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="h-px shrink-0 w-full bg-slate-100 overflow-hidden rounded-full mt-0.5">
            <div
              className="h-full rounded-full transition-[width] duration-100 linear"
              style={{
                background: 'linear-gradient(90deg, #0b192c, #1f3b57)',
                width: srcTotal <= 3 ? '100%' : `${srcProgress}%`,
              }}
            />
          </div>
        </div>
      ) : (
        <div
          className={`px-4 py-2 flex flex-col justify-between min-w-0 relative overflow-hidden transition-all ${
            topIssue.isWarning
              ? 'bg-gradient-to-br from-red-50/90 via-amber-50/40 to-red-50/70 border-l-4 border-l-red-500'
              : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between gap-1.5 min-w-0 shrink-0">
            <div className="flex items-center gap-1 min-w-0">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 animate-pulse" />
              <span className="text-[11px] xl:text-xs uppercase font-medium tracking-wider text-red-700/80 font-heading truncate leading-none">
                Isu Teratas
              </span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white tracking-wider uppercase shrink-0 leading-none shadow-sm">
              High Alert
            </span>
          </div>
          <div className="my-0.5 min-w-0 flex-1 flex flex-col justify-center">
            <h3 className="text-base xl:text-lg 2xl:text-xl font-extrabold leading-tight text-red-900 line-clamp-1 tracking-tight">
              {topIssue.title}
            </h3>
            <div className="w-full bg-red-100 rounded-full h-px mt-1.5 overflow-hidden border border-red-200">
              <div className="bg-gradient-to-r from-amber-500 to-red-600 h-full w-[78%]" />
            </div>
          </div>
          <div className="text-[11px] xl:text-xs font-normal text-red-700/80 truncate flex items-center justify-between leading-none shrink-0">
            <span className="truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping shrink-0" />
              {topIssue.subtitle}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopKPIRibbon;
