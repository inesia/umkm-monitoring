'use client';

import { useMemo } from 'react';
import type { UMKMDashboardData, ProgramStatus, UMKMKPI } from '@/types/umkm';
import { SEPill } from '../UMKMCard';
import { Sparkles, Radio, TrendingUp, PieChart, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_STYLE: Record<ProgramStatus, { bg: string; color: string; border: string }> = {
  on_track: { bg: '#E8F6EE', color: '#137A4C', border: '#B7E0C8' },
  accelerate: { bg: '#FFF4E5', color: '#C26A00', border: '#F5D4A0' },
  risk: { bg: '#FDECEC', color: '#C7402D', border: '#F0B8B0' },
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

/** Rich Executive KPI Ribbon with Micro Graphics (Zero Wasted Whitespace) */
function ProgramKPIRibbon({ kpis }: { kpis: UMKMKPI[] }) {
  const kpiMap = useMemo(() => {
    return Object.fromEntries((kpis || []).map((k) => [k.id, k]));
  }, [kpis]);

  const kpiActive = kpiMap.active;
  const kpiVolume = kpiMap.volume;
  const kpiSov = kpiMap.sov;
  const kpiIssue = kpiMap.topissue;

  // SVG Sparkline data for Volume
  const sparkPoints = [210, 245, 230, 285, 310, 290, 356];
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

  // SVG Donut for SOV (41%)
  const r = 18;
  const circ = 2 * Math.PI * r;
  const sovDash = (41 / 100) * circ;

  return (
    <div
      className="w-full h-full min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-4 select-none"
      style={{ borderColor: 'var(--line)', boxShadow: 'var(--shadow-se)' }}
    >
      {/* Col 1: Program Aktif */}
      <div className="px-4 py-2.5 flex flex-col justify-between border-r border-slate-200/80 min-w-0 bg-white hover:bg-slate-50/50 transition-colors overflow-hidden">
        <div className="flex items-center justify-between gap-1.5 min-w-0 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse shrink-0" />
            <span className="text-xs xl:text-sm uppercase font-bold tracking-wider text-slate-500 font-heading truncate leading-none">
              {kpiActive?.label ?? 'Program Aktif'}
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100/80 text-emerald-800 border border-emerald-300/60 shrink-0 leading-none">
            {kpiActive?.value ?? '6'} AKTIF
          </span>
        </div>

        <div className="my-0.5 flex items-center justify-between gap-2 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="text-2xl xl:text-3xl font-extrabold text-slate-900 font-koho tabular-nums leading-none truncate">
              {kpiActive?.value ?? '6'} <span className="text-xs xl:text-sm font-bold text-slate-500 font-sans">Program Prioritas</span>
            </div>
            {/* 6-segment status bar */}
            <div className="w-full h-1.5 rounded-full overflow-hidden flex gap-0.5 bg-slate-100 mt-2">
              <div className="flex-1 bg-emerald-500 rounded-l-full" title="On Track" />
              <div className="flex-1 bg-emerald-500" title="On Track" />
              <div className="flex-1 bg-emerald-500" title="On Track" />
              <div className="flex-1 bg-emerald-500" title="On Track" />
              <div className="flex-1 bg-amber-500" title="Akselerasi" />
              <div className="flex-1 bg-rose-500 rounded-r-full" title="Risiko" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-[10px] xl:text-xs font-semibold text-slate-500 shrink-0 leading-none truncate">
          <span>4 On Track • 1 Akselerasi • 1 Risiko</span>
        </div>
      </div>

      {/* Col 2: Volume Pemberitaan */}
      <div className="px-4 py-2.5 flex flex-col justify-between border-r border-slate-200/80 min-w-0 bg-white hover:bg-slate-50/50 transition-colors overflow-hidden">
        <div className="flex items-center justify-between gap-1.5 min-w-0 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-xs xl:text-sm uppercase font-bold tracking-wider text-slate-500 font-heading truncate leading-none">
              {kpiVolume?.label ?? 'Volume Pemberitaan'}
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100/80 text-emerald-800 border border-emerald-300/60 shrink-0 leading-none">
            TOP 7D
          </span>
        </div>

        <div className="my-0.5 flex items-center justify-between gap-2 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="text-2xl xl:text-3xl font-extrabold text-slate-900 font-koho tabular-nums leading-none truncate">
              {kpiVolume?.value ?? '356'} <span className="text-xs xl:text-sm font-bold text-slate-500 font-sans">Berita</span>
            </div>
            <div className="text-[11px] xl:text-xs font-bold text-emerald-600 mt-1.5 truncate">
              Realisasi KUR (Tertinggi)
            </div>
          </div>

          {/* Micro Sparkline Curve */}
          <div className="w-[110px] h-[36px] shrink-0 relative overflow-hidden">
            <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
              <defs>
                <linearGradient id="volSparkGradProg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#volSparkGradProg)" />
              <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-[10px] xl:text-xs font-semibold text-slate-500 shrink-0 leading-none truncate">
          <span>▲ +18% tren percakapan mingguan</span>
        </div>
      </div>

      {/* Col 3: Share of Voice */}
      <div className="px-4 py-2.5 flex flex-col justify-between border-r border-slate-200/80 min-w-0 bg-white hover:bg-slate-50/50 transition-colors overflow-hidden">
        <div className="flex items-center justify-between gap-1.5 min-w-0 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <PieChart className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="text-xs xl:text-sm uppercase font-bold tracking-wider text-slate-500 font-heading truncate leading-none">
              {kpiSov?.label ?? 'Share of Voice'}
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-sky-100/80 text-sky-800 border border-sky-300/60 shrink-0 leading-none">
            {kpiSov?.delta?.split(' ')[0] ?? '▲ +6P'}
          </span>
        </div>

        <div className="my-0.5 flex items-center justify-between gap-2 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="text-2xl xl:text-3xl font-extrabold text-sky-600 font-koho tabular-nums leading-none truncate">
              {kpiSov?.value ?? '41%'}
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-slate-100 mt-2">
              <div style={{ width: '41%' }} className="bg-sky-500 h-full" title="KUR 41%" />
              <div style={{ width: '28%' }} className="bg-indigo-500 h-full" title="Digitalisasi 28%" />
              <div style={{ width: '18%' }} className="bg-emerald-500 h-full" title="Koperasi 18%" />
              <div style={{ width: '13%' }} className="bg-slate-300 h-full" title="Lainnya 13%" />
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
                stroke="#0284c7"
                strokeWidth="5"
                strokeDasharray={`${sovDash} ${circ - sovDash}`}
                strokeDashoffset={0}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-[10px] xl:text-xs font-semibold text-slate-500 shrink-0 leading-none truncate">
          <span>{kpiSov?.delta ?? '▲ 6 poin (35% → 41%)'}</span>
        </div>
      </div>

      {/* Col 4: Isu Program Teratas */}
      <div className="px-4 py-2.5 flex flex-col justify-between min-w-0 bg-rose-50/40 hover:bg-rose-50/70 transition-colors overflow-hidden">
        <div className="flex items-center justify-between gap-1.5 min-w-0 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-bounce shrink-0" />
            <span className="text-xs xl:text-sm uppercase font-bold tracking-wider text-rose-700 font-heading truncate leading-none">
              {kpiIssue?.label ?? 'Isu Program Teratas'}
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300/80 shrink-0 leading-none">
            PERHATIAN
          </span>
        </div>

        <div className="my-0.5 flex flex-col justify-center min-w-0 flex-1">
          <b className="block text-xs xl:text-sm font-bold text-slate-900 truncate leading-tight">
            {kpiIssue?.value ?? 'Keterlambatan pencairan KUR'}
          </b>
          <p className="text-[11px] xl:text-xs font-semibold text-rose-600 mt-1 truncate">
            {kpiIssue?.delta ?? '268 rb reach · dipantau tim krisis'}
          </p>
        </div>

        <div className="w-full h-1.5 rounded-full bg-rose-100 overflow-hidden shrink-0 mt-1">
          <div className="h-full bg-rose-500 rounded-full w-[65%]" />
        </div>
      </div>
    </div>
  );
}

export function ProgramView({
  data,
  onAskAI,
}: {
  data: UMKMDashboardData;
  onAskAI?: (prompt: string) => void;
}) {
  return (
    <div className="umkm-program w-full h-full min-h-0">
      {/* 1. Top Executive KPI Ribbon with Micro Graphics */}
      <div className="area-kpi">
        <ProgramKPIRibbon kpis={data.programKpis} />
      </div>

      {/* 2. Papan Program (8 Columns) */}
      <div className="area-board">
        <BentoCard
          title="Papan Program — Progres & Status"
          subtitle={`${data.programs.length} program prioritas · diurutkan berdasarkan tingkat risiko capaian`}
          action={<SEPill tone="live">Live</SEPill>}
        >
          <div className="flex flex-col h-full min-h-0 overflow-hidden gap-1.5">
            <div className="shrink-0 grid grid-cols-[minmax(0,1.8fr)_1fr_1fr_0.8fr_1fr] gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs xl:text-sm font-heading font-bold uppercase tracking-wider text-slate-500">
              <span>Program</span>
              <span>Target</span>
              <span>Realisasi</span>
              <span>Tren</span>
              <span className="text-center">Status</span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col gap-1 overflow-hidden">
              {data.programs.slice(0, 6).map((p) => {
                const st = STATUS_STYLE[p.status];
                return (
                  <div
                    key={p.name}
                    className="shrink-0 grid grid-cols-[minmax(0,1.8fr)_1fr_1fr_0.8fr_1fr] gap-2 items-center rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-1 overflow-hidden"
                  >
                    <div className="min-w-0">
                      <b className="block text-xs xl:text-sm font-bold text-slate-900 truncate leading-tight">
                        {p.name}
                      </b>
                      <span className="block text-[10px] xl:text-xs text-slate-500 font-medium truncate mt-0.5">
                        {p.partner}
                      </span>
                      <div className="w-full h-1 rounded-full bg-slate-200 overflow-hidden mt-0.5">
                        <i
                          className="block h-full rounded-full"
                          style={{
                            width: `${p.pct}%`,
                            background:
                              p.status === 'risk'
                                ? 'var(--neg)'
                                : p.status === 'accelerate'
                                  ? '#d9822b'
                                  : 'var(--pos)',
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs xl:text-sm text-slate-700 font-medium truncate">
                      {p.target}
                    </span>
                    <span className="text-xs xl:text-sm font-koho font-bold text-slate-900 tabular-nums truncate">
                      {p.realization}
                    </span>
                    <span
                      className="text-xs xl:text-sm font-bold truncate flex items-center gap-1"
                      style={{
                        color:
                          p.trendTone === 'up'
                            ? 'var(--pos)'
                            : p.trendTone === 'down'
                              ? 'var(--neg)'
                              : 'var(--ink-3)',
                      }}
                    >
                      {p.trendTone === 'up' ? '▲' : p.trendTone === 'down' ? '▼' : '●'} {p.trend}
                    </span>
                    <div className="text-center">
                      <span
                        className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap"
                        style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}
                      >
                        {p.statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </BentoCard>
      </div>

      {/* 3. Sentimen per Program (4 Columns) */}
      <div className="area-senti">
        <BentoCard title="Sentimen per Program" subtitle="Media & media sosial, 7 hari">
          <div className="flex flex-col h-full min-h-0 overflow-hidden gap-1.5">
            {data.programSentiment.map((s) => (
              <div
                key={s.name}
                className="shrink-0 flex flex-col justify-center gap-1 rounded-xl border border-slate-200/70 bg-slate-50/60 px-3 py-1.5"
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="text-xs xl:text-sm font-bold text-slate-900 truncate">
                    {s.name}
                  </span>
                  <b className="text-xs xl:text-sm font-koho font-bold text-emerald-600 tabular-nums shrink-0">
                    {s.posPct}% Positif
                  </b>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <i
                    className="block h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                    style={{ width: `${s.posPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

      {/* 4. Kendala Implementasi Lapangan (4 Columns) */}
      <div className="area-constraints">
        <BentoCard title="Kendala Lapangan" subtitle="Isu kritis & hambatan operasional">
          <div className="flex flex-col h-full min-h-0 justify-between gap-2 overflow-hidden">
            <div className="flex-1 min-h-0 flex flex-col gap-1.5 overflow-hidden">
              {data.programConstraints.map((c) => (
                <div
                  key={c.issue}
                  className="shrink-0 rounded-xl border px-3 py-2 flex items-start justify-between gap-2 bg-slate-50/70"
                  style={{
                    borderColor: c.level === 'risk' ? '#F0B8B0' : 'var(--line)',
                    background: c.level === 'risk' ? '#FDECEC' : '#fff',
                  }}
                >
                  <div className="min-w-0">
                    <b className="block text-xs xl:text-sm font-bold text-slate-900 leading-snug">
                      {c.issue}
                    </b>
                    <span className="text-[10px] xl:text-xs text-slate-500 font-medium mt-0.5 block">
                      {c.program}
                    </span>
                  </div>
                  <span
                    className="shrink-0 text-[10px] xl:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      background: c.level === 'risk' ? '#C7402D' : '#FFF4E5',
                      color: c.level === 'risk' ? '#fff' : '#C26A00',
                    }}
                  >
                    {c.level === 'risk' ? 'RISIKO' : 'MONITOR'}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onAskAI?.('Buat ringkasan mingguan program untuk pimpinan')}
              className="shrink-0 w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs xl:text-sm font-extrabold text-white shadow-sm transition-transform active:scale-[0.99]"
              style={{ background: 'var(--ink)' }}
            >
              <Sparkles className="w-4 h-4" />
              Engagement Copilot · Briefing Mingguan
            </button>
          </div>
        </BentoCard>
      </div>

      {/* 5. Sebaran Capaian per Wilayah (4 Columns) */}
      <div className="area-regions">
        <BentoCard
          title="Capaian per Wilayah"
          subtitle="5 provinsi capaian tertinggi (gabungan program)"
        >
          <div className="flex flex-col h-full min-h-0 justify-between gap-2 overflow-hidden">
            <div className="flex-1 min-h-0 flex flex-col gap-1.5 overflow-hidden">
              {data.regionAchievements.map((r) => (
                <div
                  key={r.name}
                  className="shrink-0 rounded-xl border border-slate-200/70 bg-slate-50/60 px-3 py-1.5 flex items-center justify-between gap-2"
                >
                  <span className="text-xs xl:text-sm font-bold text-slate-900 truncate min-w-[85px]">
                    {r.name}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden mx-1">
                    <i
                      className="block h-full rounded-full"
                      style={{
                        width: `${r.pct}%`,
                        background:
                          r.pct < 40
                            ? 'var(--neg)'
                            : r.pct < 70
                              ? 'linear-gradient(90deg,#F5D4A0,#C26A00)'
                              : 'linear-gradient(90deg,#9BD8B5,var(--pos))',
                      }}
                    />
                  </div>
                  <b
                    className={cn('text-xs xl:text-sm font-koho font-bold tabular-nums shrink-0')}
                    style={{ color: r.pct < 40 ? 'var(--neg)' : 'var(--ink)' }}
                  >
                    {r.pct}%
                  </b>
                </div>
              ))}
            </div>
            {data.regionAchievements.some((r) => r.note) && (
              <p className="text-xs text-slate-500 font-medium italic shrink-0">
                Catatan: Papua memerlukan perhatian khusus (capaian di bawah 40%).
              </p>
            )}
          </div>
        </BentoCard>
      </div>

      {/* 6. Milestone & Timeline Program (4 Columns) */}
      <div className="area-milestones">
        <BentoCard title="Timeline & Milestone" subtitle="Target & agenda strategis program">
          <div className="flex flex-col h-full min-h-0 justify-between gap-2 overflow-hidden">
            <div className="flex-1 min-h-0 relative pl-4 flex flex-col gap-1.5 overflow-hidden">
              <span
                className="absolute left-[5px] top-2 bottom-2 w-0.5"
                style={{ background: 'var(--line)' }}
              />
              {data.milestones.map((m) => (
                <div key={m.when} className="relative shrink-0">
                  <span
                    className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{ background: 'var(--orange)', boxShadow: '0 0 0 1.5px var(--line)' }}
                  />
                  <div className="text-[10px] xl:text-xs font-heading font-bold uppercase tracking-wider text-slate-500">
                    {m.when}
                  </div>
                  <div className="text-xs xl:text-sm font-bold text-slate-900 leading-snug mt-0.5">
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <p
              className="text-xs leading-relaxed rounded-xl border px-3 py-2 shrink-0 font-medium"
              style={{ borderColor: 'var(--line)', background: 'var(--cream)', color: 'var(--ink-2)' }}
            >
              {data.programInsight}
            </p>
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
