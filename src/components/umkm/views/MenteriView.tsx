'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, ShieldAlert } from 'lucide-react';
import type {
  UMKMDashboardData,
  SentimentTone,
  AuthorRank,
  MinisterProfile,
  UMKMKPI,
  SourceTotal,
} from '@/types/umkm';
import { NationalIssueMap } from '../NationalIssueMap';
import { MediaListeningChart } from '../MediaListeningChart';
import { TopKPIRibbon } from '../TopKPIRibbon';
import { SEPill } from '../UMKMCard';
import { cn } from '@/lib/utils';

const TONE_COLOR: Record<SentimentTone, string> = {
  pos: 'var(--pos)',
  neu: 'var(--ink-3)',
  neg: 'var(--neg)',
};

const PLATFORM_SHORT: Record<string, string> = {
  tiktok: 'TT',
  x: 'X',
  news: 'NEWS',
  instagram: 'IG',
  facebook: 'FB',
  youtube: 'YT',
  threads: 'TH',
};

const FEED_INTERVAL_MS = 10000;

function BentoCard({
  children,
  className,
  contentClassName,
  title,
  titleClassName,
  subtitle,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  title?: string;
  titleClassName?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'menteri-bento relative h-full min-h-0 max-h-full overflow-hidden rounded-2xl border bg-white flex flex-col',
        className,
      )}
      style={{ borderColor: 'var(--line)', boxShadow: 'var(--shadow-se)' }}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 px-4 pt-3 pb-2 shrink-0 min-w-0">
          <div className="min-w-0 flex-1 overflow-hidden">
            {title && (
              <h2
                className={cn(
                  "font-heading text-lg font-bold uppercase tracking-wider text-slate-900 truncate",
                  titleClassName
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[15px] mt-1 leading-snug truncate text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      )}
      <div className={cn("flex-1 min-h-0 min-w-0 px-4 pb-3 overflow-hidden", contentClassName)}>{children}</div>
    </section>
  );
}

/** Compact KPI row — Sentimen / Volume / SoV / Post per Sumber */
function MetricRibbon({ kpis, sources }: { kpis: UMKMKPI[]; sources: SourceTotal[] }) {
  return <TopKPIRibbon kpis={kpis} sources={sources} />;
}

/** Isu Teratas — highlighted side card (width matches Profil Menteri) */
function TopIssueHighlight({ kpis }: { kpis: UMKMKPI[] }) {
  const kpi = kpis.find((k) => k.id === 'topissue');
  const title = kpi?.value ?? 'Konflik kepentingan mitra';
  const subtitle = kpi?.delta ?? '410 rb reach • menunggu klarifikasi';

  return (
    <div
      className="h-full rounded-2xl border overflow-hidden flex flex-col min-h-0 relative bg-gradient-to-br from-red-50/95 via-amber-50/50 to-red-50/80"
      style={{
        borderColor: '#fecaca',
        boxShadow: 'var(--shadow-se)',
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
      }}
      role="region"
      aria-label="Isu Teratas"
    >
      <div className="px-3.5 pt-2.5 pb-1 shrink-0 flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0 animate-pulse" />
          <div className="font-heading text-[11px] font-bold uppercase tracking-[0.1em] truncate text-red-700/80">
            Isu Teratas
          </div>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white tracking-wider uppercase shrink-0 leading-none shadow-sm">
          High Alert
        </span>
      </div>

      <div className="flex-1 min-h-0 px-3.5 pb-2.5 flex flex-col justify-center gap-1.5 overflow-hidden">
        <h3 className="text-base xl:text-lg font-extrabold leading-tight text-red-900 line-clamp-2 tracking-tight">
          {title}
        </h3>
        <div className="w-full bg-red-100 rounded-full h-px overflow-hidden border border-red-200">
          <div className="bg-gradient-to-r from-amber-500 to-red-600 h-full w-[78%]" />
        </div>
        <div className="text-[11px] xl:text-xs font-medium text-red-700/80 truncate flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping shrink-0" />
          {subtitle}
        </div>
      </div>
    </div>
  );
}

/** KPI ribbon + Isu Teratas side card (width = Profil Menteri) */
function RibbonStack({
  kpis,
  sources,
}: {
  kpis: UMKMKPI[];
  sources: SourceTotal[];
}) {
  return (
    <div className="h-full min-h-0 grid grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_290px] gap-2.5 overflow-hidden">
      <div className="min-h-0 min-w-0 overflow-hidden">
        <MetricRibbon kpis={kpis} sources={sources} />
      </div>
      <div className="min-h-0 min-w-0 overflow-hidden">
        <TopIssueHighlight kpis={kpis} />
      </div>
    </div>
  );
}

/** 3. Feed & News Carousel — TV 10-foot font scale, 3 items per page number */
function FeedCarousel({ data }: { data: UMKMDashboardData }) {
  const [mode, setMode] = useState<'news' | 'social'>('news');
  const [page, setPage] = useState(0);
  const [progress, setProgress] = useState(0);

  const items = useMemo(() => {
    return mode === 'news' ? data.ministerNews : data.posts;
  }, [mode, data.ministerNews, data.posts]);

  const totalPages = Math.max(1, Math.ceil(items.length / 3));

  // Reset page when mode changes
  useEffect(() => {
    setPage(0);
  }, [mode]);

  // Auto-rotate pages every 8 seconds
  useEffect(() => {
    setProgress(0);
    const tick = 100;
    const intervalMs = 8000;
    const steps = intervalMs / tick;
    let step = 0;

    const id = setInterval(() => {
      step += 1;
      setProgress((step / steps) * 100);
      if (step >= steps) {
        step = 0;
        setPage((p) => (p + 1) % totalPages);
      }
    }, tick);

    return () => clearInterval(id);
  }, [mode, totalPages, page]);

  // Get exact 3 items for current page
  const currentItems = useMemo(() => {
    const start = page * 3;
    return items.slice(start, start + 3);
  }, [items, page]);

  return (
    <BentoCard
      title={mode === 'news' ? 'Pemberitaan Terkait Menteri' : 'Monitoring Media Sosial'}
      action={
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex rounded-full border p-0.5 gap-0.5 bg-slate-100 border-slate-200">
            {(['news', 'social'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className="px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors"
                style={
                  mode === key
                    ? { background: 'var(--ink)', color: '#fff' }
                    : { color: 'var(--ink-3)' }
                }
              >
                {key === 'news' ? 'Berita' : 'Sosial'}
              </button>
            ))}
          </div>

          {/* Page Number Buttons (1, 2...) — Displaying 3 data per page */}
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5">
            <span className="text-[10px] font-bold text-slate-500 mr-0.5">Hal</span>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPage(idx);
                  setProgress(0);
                }}
                className={cn(
                  'w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center transition-all',
                  page === idx
                    ? 'bg-emerald-600 text-white shadow-xs scale-110'
                    : 'text-slate-600 hover:bg-slate-200',
                )}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <SEPill tone="live">Live</SEPill>
        </div>
      }
    >
      <div className="relative h-full min-h-0 flex flex-col overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 rounded-full overflow-hidden mb-2 shrink-0 bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>

        <div className="flex-1 min-h-0 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {mode === 'news' ? (
              <motion.div
                key={`news-page-${page}`}
                className="absolute inset-0 flex flex-col gap-2 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {(currentItems as typeof data.ministerNews).map((n) => (
                  <div
                    key={n.title}
                    className="flex-1 min-h-0 grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 items-center rounded-xl border px-4 py-2 overflow-hidden shadow-2xs"
                    style={{
                      borderColor: 'var(--line)',
                      borderLeftWidth: 5,
                      borderLeftColor: TONE_COLOR[n.tone],
                      background: '#fff',
                    }}
                  >
                    <div className="min-w-0 overflow-hidden">
                      <b className="block text-xs xl:text-sm font-bold text-slate-900 truncate leading-tight">
                        {n.title}
                      </b>
                      <span className="block text-xs font-normal text-slate-500 mt-0.5 truncate">
                        {n.source} · {n.time}
                      </span>
                    </div>
                    <span className="text-base xl:text-lg font-extrabold tabular-nums shrink-0 text-slate-800">
                      {n.reach}
                    </span>
                    <span className="text-xs xl:text-sm font-extrabold min-w-[4rem] text-right shrink-0" style={{ color: TONE_COLOR[n.tone] }}>
                      {n.toneLabel}
                    </span>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`social-page-${page}`}
                className="absolute inset-0 flex flex-col gap-2 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {(currentItems as typeof data.posts).map((p) => (
                  <div
                    key={p.id}
                    className="flex-1 min-h-0 grid grid-cols-[45px_minmax(0,1fr)_auto] gap-3 items-center rounded-xl border px-4 py-2 overflow-hidden shadow-2xs bg-white border-slate-200"
                  >
                    <span
                      className="text-xs font-black text-white text-center rounded-lg py-1.5 shrink-0"
                      style={{ background: '#152943' }}
                    >
                      {PLATFORM_SHORT[p.platform] ?? '·'}
                    </span>
                    <div className="min-w-0 overflow-hidden">
                      <b className="block text-xs xl:text-sm font-bold text-slate-900 truncate leading-tight">
                        {p.handle}
                      </b>
                      <span className="block text-xs font-normal leading-snug line-clamp-1 mt-0.5 text-slate-600">
                        {p.excerpt}
                      </span>
                    </div>
                    <div className="text-right shrink-0 overflow-hidden">
                      <span
                        className="block text-xs xl:text-sm font-extrabold"
                        style={{
                          color: p.toneLabel.includes('Neg')
                            ? 'var(--neg)'
                            : p.toneLabel.includes('Pos')
                              ? 'var(--pos)'
                              : 'var(--ink-3)',
                        }}
                      >
                        {p.toneLabel}
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-slate-500">
                        {p.score ?? p.likes}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </BentoCard>
  );
}

/** 1a. National Issue Map Bento Card */
function NationalMapBento({ data }: { data: UMKMDashboardData }) {
  return (
    <BentoCard
      title="SEBARAN ISU NASIONAL"
      action={<SEPill tone="live">Live</SEPill>}
      contentClassName="p-0 relative overflow-hidden"
    >
      <div className="relative h-full w-full min-h-0 overflow-hidden bg-[#eef4fa]">
        <NationalIssueMap bubbles={data.mapBubbles} top={data.mapTop} bare />
      </div>
    </BentoCard>
  );
}

/** 1b. Top Authors & Briefing Bento Card */
function TopAuthorsBento({
  data,
  onAskAI,
}: {
  data: UMKMDashboardData;
  onAskAI?: (prompt: string) => void;
}) {
  const groups = [
    { id: 'influential' as const, label: 'Influential' },
    { id: 'active' as const, label: 'Active' },
    { id: 'portal' as const, label: 'Portal News' },
  ];
  const [group, setGroup] = useState<(typeof groups)[number]['id']>('influential');

  const ranked: AuthorRank[] = useMemo(
    () => data.authors.filter((a) => a.group === group).slice(0, 7),
    [data.authors, group],
  );

  return (
    <BentoCard
      title="TOP AUTHORS"
      action={
        <span className="text-[11px] xl:text-xs font-semibold text-slate-500 whitespace-nowrap">
          Kontributor tertinggi · 7 hari
        </span>
      }
      contentClassName="px-3 pb-2.5"
    >
      <div className="flex flex-col h-full min-h-0 overflow-hidden gap-1.5">
        <div className="shrink-0 flex gap-1 rounded-full p-0.5 bg-slate-100">
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              className="flex-1 px-1.5 py-1 rounded-full text-[10px] xl:text-[11px] font-bold truncate transition-colors"
              style={
                group === g.id
                  ? { background: 'var(--ink)', color: '#fff' }
                  : { color: 'var(--ink-3)' }
              }
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="shrink-0 grid grid-cols-[minmax(0,1.4fr)_44px_56px_minmax(0,1fr)] gap-1 px-1 text-[9px] xl:text-[10px] font-bold uppercase tracking-wide text-slate-400">
          <span>Authors</span>
          <span className="text-right">Men</span>
          <span className="text-right">Eng</span>
          <span className="text-right">Followers</span>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-1">
          {ranked.map((a, i) => (
            <div
              key={`${a.group}-${a.name}-${a.site}-${i}`}
              className="shrink-0 grid grid-cols-[minmax(0,1.4fr)_44px_56px_minmax(0,1fr)] gap-1 items-center rounded-lg px-1.5 py-1 overflow-hidden border border-slate-200/60 bg-slate-50/70"
            >
              <div className="min-w-0 flex items-center gap-1.5 overflow-hidden">
                <span
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold text-white"
                  style={{ background: 'var(--ink)' }}
                >
                  {a.name.replace(/^@/, '').charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 overflow-hidden">
                  <b className="block text-[11px] xl:text-xs font-bold text-slate-900 truncate leading-tight">
                    {a.name}
                  </b>
                  <span className="block text-[9px] xl:text-[10px] font-medium text-slate-500 truncate">
                    {a.site}
                  </span>
                </div>
              </div>
              <span className="text-[11px] xl:text-xs font-bold tabular-nums text-right text-slate-800">
                {a.mentions.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] xl:text-xs font-bold tabular-nums text-right text-slate-800">
                {a.engagement.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] xl:text-[11px] font-semibold tabular-nums text-right text-slate-600 truncate">
                {a.followers}
              </span>
            </div>
          ))}
        </div>

        <div className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-2 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="font-heading text-[9px] xl:text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Copilot Briefing
            </div>
            <p className="text-[10px] xl:text-[11px] font-medium text-slate-700 line-clamp-2 mt-0.5 leading-snug">
              {data.personalInsight}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onAskAI?.(
                'Buat briefing 1 halaman untuk isu tudingan konflik kepentingan mitra program',
              )
            }
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] xl:text-xs font-extrabold text-white shrink-0 shadow-sm"
            style={{ background: 'var(--ink)' }}
          >
            <Sparkles className="w-3 h-3" />
            Briefing
          </button>
        </div>
      </div>
    </BentoCard>
  );
}

/** 2a. Kutipan & Agenda Bento Card */
function QuotesAgendaBento({ data }: { data: UMKMDashboardData }) {
  const quotes = data.quotes.slice(0, 3);
  const schedule = data.schedule.slice(0, 3);

  return (
    <BentoCard title="KUTIPAN & AGENDA">
      <div className="flex flex-col h-full min-h-0 justify-between overflow-hidden gap-2">
        {/* 3 Prominent Quotes */}
        <div className="flex-1 min-h-0 flex flex-col justify-between gap-1">
          <div className="text-[10px] xl:text-[11px] font-heading font-bold uppercase tracking-wider text-slate-500 shrink-0">
            KUTIPAN MEDIA
          </div>
          {quotes.map((q) => (
            <div
              key={q.text.slice(0, 28)}
              className="shrink-0 rounded-xl border px-3 py-1.5 flex flex-col justify-center bg-slate-50/60 border-slate-200/80 shadow-2xs"
            >
              <p className="text-xs xl:text-sm font-bold text-slate-900 leading-tight line-clamp-1">
                &ldquo;{q.text}&rdquo;
              </p>
              <div className="flex justify-between items-center gap-2 mt-0.5 text-[10px] xl:text-[11px] font-semibold text-slate-500">
                <span className="truncate">{q.context}</span>
                <b className="shrink-0 text-emerald-600 font-extrabold">{q.supportPct}% Support</b>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Schedule Items */}
        <div className="flex-1 min-h-0 flex flex-col justify-between gap-1 pt-1.5 border-t border-slate-200/80">
          <div className="text-[10px] xl:text-[11px] font-heading font-bold uppercase tracking-wider text-slate-500 shrink-0">
            JADWAL AGENDA
          </div>
          {schedule.map((s) => (
            <div
              key={s.title}
              className="shrink-0 flex items-center justify-between gap-2 rounded-xl border px-3 py-1.5 bg-slate-50/60 border-slate-200/80 shadow-2xs"
            >
              <div className="min-w-0 overflow-hidden">
                <b className="block text-xs xl:text-sm font-bold text-slate-900 truncate leading-tight">
                  {s.title}
                </b>
                <span className="text-[10px] xl:text-[11px] font-medium text-slate-500 truncate block mt-0.5">
                  {s.when} · {s.where}
                </span>
              </div>
              <span
                className="text-[9px] xl:text-[10px] font-extrabold shrink-0 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200"
              >
                {s.media}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}

/** 2b. Profil Menteri Bento Card */
function MinisterProfileBento({ minister }: { minister: MinisterProfile }) {
  const ministerInfo = useMemo(() => [
    "Menjabat 21 Okt 2024 — Kabinet Merah Putih",
    "Kader Partai Golkar",
    "Anggota DPR RI 2018–2024",
    "Lahir 10 September 1980"
  ], []);

  const [infoIndex, setInfoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setInfoIndex((prev) => (prev + 1) % ministerInfo.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [ministerInfo.length]);

  return (
    <BentoCard title="PROFIL MENTERI" contentClassName="p-0 relative">
      <div className="relative h-full w-full overflow-hidden bg-slate-900 flex flex-col justify-end">
        <img
          src="/images/pak-mentri-maman.jpg"
          alt={minister.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          onError={(e) => {
             e.currentTarget.style.display = 'none';
          }}
        />

        {/* Bottom Overlay with Name, Role Subtitle, and Ticker */}
        <div className="relative z-10 w-full p-4 pt-16 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col gap-0.5">
          <b className="block text-white text-lg xl:text-2xl font-bold leading-tight drop-shadow-md">
            {minister.name}
          </b>
          <span className="block text-white/90 text-xs xl:text-sm font-medium leading-snug drop-shadow-md">
            Menteri Usaha Mikro, Kecil, dan Menengah RI
          </span>

          {/* Info Ticker */}
          <div className="relative h-6 overflow-hidden mt-1.5 pt-0.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={infoIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 text-white/80 text-xs font-normal flex items-center drop-shadow-md truncate"
              >
                {ministerInfo[infoIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

/** Sentiment + Topics — 10-foot TV Scale */
function SentimentTopics({ data }: { data: UMKMDashboardData }) {
  const s = data.sentiment;
  const total = s.pos + s.neu + s.neg;
  const posDeg = (s.pos / total) * 360;
  const neuDeg = (s.neu / total) * 360;

  return (
    <BentoCard title="SENTIMEN & TOPIK" titleClassName="font-koho font-bold text-slate-800 tracking-wide">
      <div className="flex flex-col h-full min-h-0 justify-between overflow-hidden gap-3">
        {/* Top Section: Larger Donut + Breakdown Below (Left) + 8 Emotion Pills Stacked Vertically in 1 Column (Right) */}
        <div className="shrink-0 grid grid-cols-[auto_1fr] items-center gap-4 overflow-hidden py-0.5">
          {/* Left Column: Enlarged Donut + Breakdown Below */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div
              className="relative w-[125px] h-[125px] xl:w-[135px] xl:h-[135px] rounded-full shrink-0 shadow-sm"
              style={{
                background: `conic-gradient(#10b981 0deg ${posDeg}deg, #94a3b8 ${posDeg}deg ${posDeg + neuDeg}deg, #ef4444 ${posDeg + neuDeg}deg 360deg)`,
              }}
            >
              <div className="absolute inset-[18px] rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                <span className="text-2xl xl:text-3xl font-koho font-bold text-slate-900 leading-none">
                  +{s.net}
                </span>
                <span className="font-ubuntu font-normal text-slate-500 text-[9px] xl:text-[10px] mt-0.5 uppercase tracking-wider">
                  NET SCORE
                </span>
              </div>
            </div>

            {/* Sentiment Breakdown below Donut */}
            <div className="flex items-center gap-2.5 text-xs">
              {[
                { label: 'Positif', pct: s.pos, color: '#10b981' },
                { label: 'Netral', pct: s.neu, color: '#94a3b8' },
                { label: 'Negatif', pct: s.neg, color: '#ef4444' },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs shrink-0" style={{ background: row.color }} />
                  <span className="font-ubuntu font-normal text-slate-600 text-[11px] xl:text-xs">
                    {row.label}
                  </span>
                  <span className="tabular-nums font-koho font-bold text-slate-900 text-xs">
                    {row.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 8 Emotion Pills Stacked Vertically in 1 Column */}
          <div className="flex flex-col justify-between h-full gap-1 flex-1 min-w-0 pl-1">
            {data.emotions.slice(0, 8).map((e) => (
              <div
                key={e.name}
                className="flex items-center justify-between gap-2 rounded-md border border-slate-200/90 bg-slate-50/70 px-2.5 py-1"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                  <span className="truncate font-ubuntu font-normal text-slate-700 text-xs">
                    {e.name}
                  </span>
                </div>
                <span className="tabular-nums font-koho font-bold text-slate-900 text-xs shrink-0">
                  {e.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Dominant Topics (Fills remaining height) */}
        <div className="flex-1 min-h-0 flex flex-col justify-between pt-2 border-t border-slate-200/80 overflow-hidden gap-2">
          <div className="font-koho font-bold text-slate-800 tracking-wide text-xs xl:text-sm shrink-0">
            TOPIK DOMINAN UTAMA
          </div>
          <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden gap-1.5 pb-1">
            {data.dominantTopics.slice(0, 4).map((t, i) => (
              <div key={t.name} className="shrink-0 flex flex-col justify-center gap-0.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[11px] font-koho font-bold text-white shrink-0"
                    style={{ background: 'var(--ink)' }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="truncate font-ubuntu font-normal text-slate-800 text-xs xl:text-sm block leading-tight">
                      {t.name}
                    </span>
                    <div className="w-full h-[2px] rounded-full bg-slate-100 overflow-hidden mt-0.5">
                      <div
                        className="h-full rounded-full bg-slate-700"
                        style={{ width: `${Math.max(15, 100 - i * 22)}%` }}
                      />
                    </div>
                  </div>
                  <div className="tabular-nums shrink-0 flex items-baseline gap-1">
                    <span className="font-koho font-bold text-slate-900 text-xs xl:text-sm">
                      {t.count.replace(' berita', '')}
                    </span>
                    <span className="font-ubuntu font-normal text-slate-500 text-[11px] xl:text-xs">
                      berita
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

function ListeningBento({ data }: { data: UMKMDashboardData }) {
  const [mode, setMode] = useState<'merged' | 'split'>('merged');

  return (
    <BentoCard
      title="Media Listening — 24H"
      subtitle="Realtime · 7 kanal · klarifikasi otomatis"
      action={
        <div className="flex items-center gap-3">
          <div
            className="inline-flex rounded-full p-0.5 gap-0.5 shrink-0"
            style={{ background: 'var(--cream)' }}
            role="tablist"
          >
            {(
              [
                { id: 'merged', label: 'Gabungan' },
                { id: 'split', label: 'Split per Kanal' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={mode === tab.id}
                onClick={() => setMode(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                  mode === tab.id ? 'text-[#06202f]' : ''
                }`}
                style={
                  mode === tab.id
                    ? {
                        background: 'linear-gradient(135deg,#2dd4bf,#38bdf8)',
                        boxShadow: '0 2px 10px rgba(56,189,248,.35)',
                      }
                    : { color: 'var(--ink-3)' }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
          <SEPill tone="live">Live</SEPill>
        </div>
      }
    >
      <MediaListeningChart channels={data.channels} caption={data.insight} mode={mode} />
    </BentoCard>
  );
}

/**
 * Menteri TV Bento — 10-foot UI, no page scroll.
 * Header (Period / filters / time) is owned by UMKMHeader and left untouched.
 */
export function MenteriView({
  data,
  onAskAI,
}: {
  data: UMKMDashboardData;
  onAskAI?: (prompt: string) => void;
}) {
  return (
    <div className="umkm-menteri h-full min-h-0">
      <div className="area-ribbon">
        <RibbonStack kpis={data.kpis} sources={data.sourceTotals} />
      </div>
      <div className="area-listen">
        <ListeningBento data={data} />
      </div>
      <div className="area-senti">
        <SentimentTopics data={data} />
      </div>
      <div className="area-agenda grid grid-cols-[1fr_260px] xl:grid-cols-[1fr_290px] gap-2.5 h-full min-h-0 overflow-hidden">
        <QuotesAgendaBento data={data} />
        <MinisterProfileBento minister={data.minister} />
      </div>
      <div className="area-feed">
        <FeedCarousel data={data} />
      </div>
      <div className="area-map grid grid-cols-[5fr_3fr] gap-3.5 h-full min-h-0 overflow-hidden">
        <NationalMapBento data={data} />
        <TopAuthorsBento data={data} onAskAI={onAskAI} />
      </div>
    </div>
  );
}
