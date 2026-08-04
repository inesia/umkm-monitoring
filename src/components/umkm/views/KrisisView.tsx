'use client';

import { useMemo } from 'react';
import type { UMKMDashboardData, UMKMKPI } from '@/types/umkm';
import { SEPill, SEStatus } from '../UMKMCard';
import { Sparkles, ShieldAlert, Timer, TrendingUp, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

const SEV_COLOR = {
  high: 'var(--neg)',
  medium: '#d9822b',
  low: '#94a3b8',
};

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
                  'font-heading text-lg font-bold uppercase tracking-wider text-slate-900 truncate',
                  titleClassName,
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
      <div className={cn('flex-1 min-h-0 min-w-0 px-4 pb-3 overflow-hidden', contentClassName)}>
        {children}
      </div>
    </section>
  );
}

/** Rich Executive Crisis KPI Ribbon with Micro Graphics (Zero Wasted Whitespace) */
function KrisisKPIRibbon({ kpis }: { kpis: UMKMKPI[] }) {
  const kpiMap = useMemo(() => {
    return Object.fromEntries((kpis || []).map((k) => [k.id, k]));
  }, [kpis]);

  const kpiActive = kpiMap.active;
  const kpiSla = kpiMap.sla;
  const kpiReach = kpiMap.reach;
  const kpiSent = kpiMap.sentiment;

  // SVG Sparkline data for Reach Impact
  const sparkPoints = [180, 220, 310, 290, 380, 360, 410];
  const minVal = Math.min(...sparkPoints) * 0.9;
  const maxVal = Math.max(...sparkPoints) * 1.05;
  const width = 140;
  const height = 38;

  const coordList = sparkPoints.map((val, idx) => {
    const x = (idx / (sparkPoints.length - 1)) * width;
    const y = height - ((val - minVal) / (maxVal - minVal)) * height;
    return { x, y };
  });

  const linePath = coordList.reduce(
    (acc, curr, idx) => (idx === 0 ? `M ${curr.x},${curr.y}` : `${acc} L ${curr.x},${curr.y}`),
    '',
  );
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  // SVG Donut for Net Sentiment Krisis (84% Negatif)
  const r = 18;
  const circ = 2 * Math.PI * r;
  const negDash = (84 / 100) * circ;

  return (
    <div
      className="w-full h-full min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-4 select-none"
      style={{ borderColor: 'var(--line)', boxShadow: 'var(--shadow-se)' }}
    >
      {/* Col 1: Isu Aktif */}
      <div className="px-4 py-2.5 flex flex-col justify-between border-r border-slate-200/80 min-w-0 bg-white hover:bg-slate-50/50 transition-colors overflow-hidden">
        <div className="flex items-center justify-between gap-1.5 min-w-0 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse shrink-0" />
            <span className="text-xs xl:text-sm uppercase font-bold tracking-wider text-slate-500 font-heading truncate leading-none">
              {kpiActive?.label ?? 'Isu Aktif Dipantau'}
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300/60 shrink-0 leading-none">
            {kpiActive?.value ?? '4'} ISU
          </span>
        </div>

        <div className="my-0.5 flex items-center justify-between gap-2 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="text-2xl xl:text-3xl font-extrabold text-slate-900 font-koho tabular-nums leading-none truncate">
              {kpiActive?.value ?? '4'} <span className="text-xs xl:text-sm font-bold text-slate-500 font-sans">Isu Aktif</span>
            </div>
            {/* 4-segment severity bar */}
            <div className="w-full h-1.5 rounded-full overflow-hidden flex gap-0.5 bg-slate-100 mt-2">
              <div className="w-[50%] bg-rose-500 rounded-l-full" title="Tinggi (2 Isu)" />
              <div className="w-[25%] bg-amber-500" title="Sedang (1 Isu)" />
              <div className="w-[25%] bg-slate-400 rounded-r-full" title="Rendah (1 Isu)" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-[10px] xl:text-xs font-semibold text-slate-500 shrink-0 leading-none truncate">
          <span>2 Severity Tinggi • 1 Sedang • 1 Rendah</span>
        </div>
      </div>

      {/* Col 2: SLA Respon Kritis */}
      <div className="px-4 py-2.5 flex flex-col justify-between border-r border-slate-200/80 min-w-0 bg-rose-50/40 hover:bg-rose-50/70 transition-colors overflow-hidden">
        <div className="flex items-center justify-between gap-1.5 min-w-0 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <Timer className="w-3.5 h-3.5 text-rose-600 animate-spin shrink-0" />
            <span className="text-xs xl:text-sm uppercase font-bold tracking-wider text-rose-700 font-heading truncate leading-none">
              {kpiSla?.label ?? 'SLA Respon Kritis'}
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300/80 shrink-0 leading-none">
            SLA &lt; 2H
          </span>
        </div>

        <div className="my-0.5 flex flex-col justify-center min-w-0 flex-1">
          <div className="text-2xl xl:text-3xl font-extrabold text-rose-600 font-koho tabular-nums leading-none truncate">
            {kpiSla?.value ?? '1j 45m'} <span className="text-xs xl:text-sm font-bold text-rose-700 font-sans">sisa</span>
          </div>
          <div className="text-[11px] xl:text-xs font-bold text-slate-700 mt-1.5 truncate">
            ISU-0032 · Hoaks Pencairan KUR
          </div>
        </div>

        <div className="w-full h-1.5 rounded-full bg-rose-100 overflow-hidden shrink-0 mt-1">
          <div className="h-full bg-rose-600 rounded-full w-[78%]" />
        </div>
      </div>

      {/* Col 3: Total Reach & Impact */}
      <div className="px-4 py-2.5 flex flex-col justify-between border-r border-slate-200/80 min-w-0 bg-white hover:bg-slate-50/50 transition-colors overflow-hidden">
        <div className="flex items-center justify-between gap-1.5 min-w-0 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <TrendingUp className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <span className="text-xs xl:text-sm uppercase font-bold tracking-wider text-slate-500 font-heading truncate leading-none">
              {kpiReach?.label ?? 'Estimasi Jangkauan'}
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-300/60 shrink-0 leading-none">
            IMPACT
          </span>
        </div>

        <div className="my-0.5 flex items-center justify-between gap-2 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="text-2xl xl:text-3xl font-extrabold text-slate-900 font-koho tabular-nums leading-none truncate">
              {kpiReach?.value ?? '410 Rb'}
            </div>
            <div className="text-[11px] xl:text-xs font-bold text-slate-500 mt-1.5 truncate">
              {kpiReach?.delta ?? '72% dari TikTok & X'}
            </div>
          </div>

          {/* Micro Sparkline Curve */}
          <div className="w-[110px] h-[36px] shrink-0 relative overflow-hidden">
            <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
              <defs>
                <linearGradient id="crisisSparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#crisisSparkGrad)" />
              <path d={linePath} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-[10px] xl:text-xs font-semibold text-slate-500 shrink-0 leading-none truncate">
          <span>Potensi ekspansi media sosial 24 jam</span>
        </div>
      </div>

      {/* Col 4: Sentimen Krisis */}
      <div className="px-4 py-2.5 flex flex-col justify-between min-w-0 bg-white hover:bg-slate-50/50 transition-colors overflow-hidden">
        <div className="flex items-center justify-between gap-1.5 min-w-0 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="text-xs xl:text-sm uppercase font-bold tracking-wider text-slate-500 font-heading truncate leading-none">
              {kpiSent?.label ?? 'Sentimen Krisis'}
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300/60 shrink-0 leading-none">
            84% NEG
          </span>
        </div>

        <div className="my-0.5 flex items-center justify-between gap-2 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="text-2xl xl:text-3xl font-extrabold text-rose-600 font-koho tabular-nums leading-none truncate">
              {kpiSent?.value ?? '84% Negatif'}
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-slate-100 mt-2">
              <div style={{ width: '84%' }} className="bg-rose-500 h-full" title="Negatif 84%" />
              <div style={{ width: '12%' }} className="bg-slate-400 h-full" title="Netral 12%" />
              <div style={{ width: '4%' }} className="bg-emerald-500 h-full" title="Positif 4%" />
            </div>
          </div>

          {/* Micro Donut Ring */}
          <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r={r} fill="transparent" stroke="#e2e8f0" strokeWidth="5" />
              <circle
                cx="22"
                cy="22"
                r={r}
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="5"
                strokeDasharray={`${negDash} ${circ - negDash}`}
                strokeDashoffset={0}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-[10px] xl:text-xs font-semibold text-slate-500 shrink-0 leading-none truncate">
          <span>{kpiSent?.delta ?? '12% netral • 4% positif'}</span>
        </div>
      </div>
    </div>
  );
}

export function KrisisView({
  data,
  onAskAI,
}: {
  data: UMKMDashboardData;
  onAskAI?: (prompt: string) => void;
}) {
  return (
    <div className="umkm-krisis w-full h-full min-h-0">
      {/* 1. Top Crisis Executive KPI Ribbon */}
      <div className="area-kpi">
        <KrisisKPIRibbon kpis={data.crisisKpis} />
      </div>

      {/* 2. Papan Isu — Semua Isu Aktif (8 Columns) */}
      <div className="area-board">
        <BentoCard
          title="Papan Isu — Semua Isu Aktif"
          subtitle={`${data.crisisIssues.length} isu dipantau · diurutkan berdasarkan tingkat urgensi & sisa waktu SLA`}
          action={<SEPill tone="live">Live</SEPill>}
        >
          <div className="flex flex-col h-full min-h-0 overflow-hidden gap-1.5">
            <div className="shrink-0 grid grid-cols-[minmax(0,2.4fr)_1fr_1fr_0.8fr_1fr_0.8fr] gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs xl:text-sm font-heading font-bold uppercase tracking-wider text-slate-500">
              <span>Isu / Program</span>
              <span>Kanal</span>
              <span>Mentions</span>
              <span>SLA</span>
              <span>PIC</span>
              <span className="text-center">Status</span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col gap-1 overflow-hidden">
              {data.crisisIssues.slice(0, 6).map((issue) => (
                <div
                  key={issue.title}
                  className="shrink-0 grid grid-cols-[minmax(0,2.4fr)_1fr_1fr_0.8fr_1fr_0.8fr] gap-2 items-center rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-1 overflow-hidden"
                  style={{
                    borderLeftWidth: 4,
                    borderLeftColor: SEV_COLOR[issue.severity],
                  }}
                >
                  <div className="min-w-0">
                    <b className="block text-xs xl:text-sm font-bold text-slate-900 truncate leading-tight">
                      {issue.title}
                    </b>
                    <span className="block text-[10px] xl:text-xs text-slate-500 font-medium truncate mt-0.5">
                      {issue.detail}
                    </span>
                  </div>
                  <span className="text-xs xl:text-sm text-slate-700 font-medium truncate">
                    {issue.source}
                  </span>
                  <span className="text-xs xl:text-sm font-koho font-bold text-slate-900 tabular-nums truncate">
                    {issue.mentions}
                  </span>
                  <span
                    className="text-xs xl:text-sm font-bold font-koho tabular-nums truncate"
                    style={{ color: issue.severity === 'high' ? 'var(--neg)' : 'var(--ink)' }}
                  >
                    {issue.sla}
                  </span>
                  <span className="text-xs xl:text-sm text-slate-700 font-medium truncate">
                    {issue.pic}
                  </span>
                  <div className="text-center">
                    <SEStatus label={issue.status} tone={issue.statusTone} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>
      </div>

      {/* 3. Top Akun Penyebar & Amplifier (4 Columns) */}
      <div className="area-esc">
        <BentoCard
          title="Akun Penyebar & Amplifier"
          subtitle={`${data.escalation.id} · Hoaks KUR`}
        >
          <div className="flex flex-col h-full min-h-0 justify-between gap-2 overflow-hidden">
            <div className="flex-1 min-h-0 flex flex-col gap-1.5 overflow-hidden">
              {data.crisisAmplifiers.map((a) => (
                <div
                  key={a.handle}
                  className="shrink-0 rounded-xl border border-slate-200/70 bg-slate-50/60 px-3 py-1.5 flex items-center justify-between gap-2 overflow-hidden"
                >
                  <div className="min-w-0 flex-1">
                    <b className="block text-xs xl:text-sm font-bold text-slate-900 truncate leading-tight">
                      {a.handle}
                    </b>
                    <span className="block text-[10px] xl:text-xs text-slate-500 font-medium truncate mt-0.5">
                      {a.note} · {a.platform}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <b className="block text-xs xl:text-sm font-koho font-bold text-slate-900 tabular-nums">
                      {a.reach}
                    </b>
                    <span className="text-[10px] xl:text-xs font-semibold text-rose-600 block">
                      {a.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                onAskAI?.(
                  'Minta AI buat rekomendasi akun prioritas untuk diajak klarifikasi bersama',
                )
              }
              className="shrink-0 w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs xl:text-sm font-extrabold text-white shadow-sm transition-transform active:scale-[0.99]"
              style={{ background: 'var(--ink)' }}
            >
              <Sparkles className="w-4 h-4" />
              Engagement Copilot · Rekomendasi Klarifikasi
            </button>
          </div>
        </BentoCard>
      </div>

      {/* 4. Kronologi Krisis (4 Columns) */}
      <div className="area-tl">
        <BentoCard
          title="Kronologi Krisis"
          subtitle={`${data.escalation.id} · dimulai 28 Jul 19.10 WIB`}
        >
          <div className="relative pl-4 h-full min-h-0 flex flex-col gap-1.5 overflow-hidden font-normal">
            <span
              className="absolute left-[5px] top-2 bottom-2 w-0.5"
              style={{ background: 'var(--line)' }}
            />
            {data.crisisTimeline.map((ev) => (
              <div key={ev.time} className="relative shrink-0">
                <span
                  className="absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                  style={{
                    background:
                      ev.tone === 'crit'
                        ? 'var(--neg)'
                        : ev.tone === 'good'
                          ? 'var(--pos)'
                          : '#d9822b',
                    boxShadow: '0 0 0 1.5px var(--line)',
                  }}
                />
                <div className="text-[10px] xl:text-xs font-heading font-bold uppercase tracking-wider text-slate-500">
                  {ev.time}
                </div>
                <div className="text-xs xl:text-sm font-bold text-slate-900 leading-snug mt-0.5">
                  {ev.text}
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

      {/* 5. Sentimen & Reach per Kanal (4 Columns) */}
      <div className="area-take">
        <BentoCard
          title="Reach per Kanal"
          subtitle="Estimasi jangkauan isu Hoaks KUR (ISU-0032)"
        >
          <div className="flex flex-col h-full min-h-0 gap-1.5 overflow-hidden">
            {data.crisisChannelReach.map((c) => (
              <div
                key={c.channel}
                className="shrink-0 rounded-xl border border-slate-200/70 bg-slate-50/60 px-3 py-1.5 flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <b className="block text-xs xl:text-sm font-bold text-slate-900 truncate">
                    {c.channel}
                  </b>
                  <span className="text-[10px] xl:text-xs text-slate-500 font-medium block mt-0.5">
                    {c.reach} reach
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <b
                    className="block text-xs xl:text-sm font-koho font-bold tabular-nums"
                    style={{ color: c.posPct >= 50 ? 'var(--pos)' : 'var(--neg)' }}
                  >
                    {c.posPct}% Positif
                  </b>
                  <span className="text-[10px] xl:text-xs font-medium text-slate-500 block">
                    {100 - c.posPct}% Negatif
                  </span>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

      {/* 6. Hashtag & Naratif Terkait Isu (4 Columns) */}
      <div className="area-mx">
        <BentoCard
          title="Hashtag & Naratif"
          subtitle="Tagar & frasa dominan · isu aktif"
        >
          <div className="flex flex-wrap content-start gap-2 h-full min-h-0 overflow-hidden py-1">
            {data.crisisHashtags.map((tag, i) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border px-3 py-1 text-xs xl:text-sm font-bold shadow-2xs transition-transform hover:scale-105"
                style={{
                  borderColor: i < 4 ? '#F0B8B0' : i < 8 ? '#F5D4A0' : 'var(--line)',
                  background: i < 4 ? '#FDECEC' : i < 8 ? '#FFF4E5' : 'var(--cream)',
                  color: i < 4 ? 'var(--neg)' : i < 8 ? '#C26A00' : 'var(--ink)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
