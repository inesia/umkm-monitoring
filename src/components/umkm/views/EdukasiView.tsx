'use client';

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { Sparkles, Send } from 'lucide-react';
import type { UMKMDashboardData } from '@/types/umkm';
import { UMKMKPIGrid } from '../UMKMKPIGrid';
import { UMKMCard, SEPill, SEStatus } from '../UMKMCard';
import { cn } from '@/lib/utils';

function DenseBars({
  items,
}: {
  items: { name: string; pct: number; value: string; tone: 'orange' | 'green' | 'dark' }[];
}) {
  const barColor = {
    orange: 'linear-gradient(90deg,#A7F3D0,var(--orange))',
    green: 'linear-gradient(90deg,#9BD8B5,var(--pos))',
    dark: 'linear-gradient(90deg,#CFC6B8,#3E3A34)',
  };
  return (
    <div className="flex flex-col h-full min-h-0 gap-0.5">
      {items.map((item) => (
        <div
          key={item.name}
          className="flex-1 min-h-0 grid grid-cols-[70px_1fr_38px] gap-1.5 items-center text-[0.58rem]"
        >
          <span className="truncate font-semibold" style={{ color: 'var(--ink)' }}>
            {item.name}
          </span>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--cream-2)' }}>
            <i
              className="block h-full rounded-full"
              style={{ width: `${item.pct}%`, background: barColor[item.tone] }}
            />
          </div>
          <span className="text-right font-bold tabular-nums" style={{ color: 'var(--ink-2)' }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function OptInGrowthChart({
  series,
}: {
  series: UMKMDashboardData['eduGrowth'];
}) {
  const option = useMemo<EChartsOption>(
    () => ({
      animation: true,
      animationDuration: 600,
      grid: { left: 28, right: 10, top: 18, bottom: 22 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,252,247,0.96)',
        borderColor: '#E7DFD4',
        textStyle: { color: '#231E18', fontSize: 11 },
      },
      legend: {
        top: 0,
        right: 0,
        itemWidth: 10,
        itemHeight: 6,
        textStyle: { fontSize: 9, color: '#8A7F72' },
      },
      xAxis: {
        type: 'category',
        data: series.map((s) => s.week),
        axisLine: { lineStyle: { color: '#E7DFD4' } },
        axisTick: { show: false },
        axisLabel: { color: '#8A7F72', fontSize: 9 },
      },
      yAxis: [
        {
          type: 'value',
          name: 'rb',
          nameTextStyle: { fontSize: 8, color: '#8A7F72' },
          splitLine: { lineStyle: { color: '#F0E8DC', type: 'dashed' } },
          axisLabel: { color: '#8A7F72', fontSize: 9 },
        },
        {
          type: 'value',
          show: false,
        },
      ],
      series: [
        {
          name: 'Opt-in',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          data: series.map((s) => s.optin),
          lineStyle: { width: 2.2, color: '#137A4C' },
          itemStyle: { color: '#137A4C' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(19,122,76,0.28)' },
                { offset: 1, color: 'rgba(19,122,76,0.02)' },
              ],
            },
          },
          markLine: {
            symbol: 'none',
            label: {
              formatter: 'Mulai CAPI',
              fontSize: 9,
              color: '#E06A0A',
              position: 'insideEndTop',
            },
            lineStyle: { type: 'dashed', color: '#F58220', width: 1.2 },
            data: [{ xAxis: 'W4' }],
          },
        },
        {
          name: 'Sesi (rb)',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbol: 'none',
          data: series.map((s) => s.sessions),
          lineStyle: { width: 1.6, color: '#F58220' },
          itemStyle: { color: '#F58220' },
        },
      ],
    }),
    [series],
  );

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge
    />
  );
}

export function EdukasiView({
  data,
  onAskAI,
}: {
  data: UMKMDashboardData;
  onAskAI?: (prompt: string) => void;
}) {
  return (
    <div className="umkm-edukasi w-full h-full min-h-0">
      <div className="area-kpi">
        <UMKMKPIGrid items={data.eduKpis} columns={6} />
      </div>

      {/* Funnel + CTA */}
      <div className="area-funnel min-h-0">
        <UMKMCard
          title="Funnel Blast Edukasi Terakhir"
          subtitle="“Kenali Petugas Resmi UMKM” · gel. 2"
          tone="wa"
          className="h-full edu-card-tight"
        >
          <div className="flex flex-col h-full min-h-0 gap-1">
            <div className="flex-1 min-h-0 flex flex-col gap-1">
              {data.funnel.map((step) => (
                <div
                  key={step.label}
                  className="flex-1 min-h-0 grid grid-cols-[62px_1fr_34px] gap-1.5 items-center text-[0.6rem]"
                >
                  <span className="font-semibold truncate" style={{ color: 'var(--ink)' }}>
                    {step.label}
                  </span>
                  <div
                    className="h-full max-h-5 min-h-[16px] rounded-md flex items-center px-1.5 text-[0.5rem] font-bold text-white"
                    style={{
                      width: `${Math.max(step.pct, 14)}%`,
                      background: 'linear-gradient(90deg,#9FD9BC,#137A4C)',
                    }}
                  >
                    {step.value}
                  </div>
                  <span className="text-right font-bold tabular-nums" style={{ color: 'var(--ink-2)' }}>
                    {step.pct}%
                  </span>
                </div>
              ))}
            </div>
            <p className="shrink-0 text-[0.52rem] leading-snug" style={{ color: 'var(--ink-3)' }}>
              Aksi lanjut = verifikasi petugas via bot. Segmen UMKM merespons 1,8× lebih tinggi.
            </p>
            <button
              type="button"
              onClick={() =>
                onAskAI?.(
                  'Draft blast WA klarifikasi pajak untuk 642 rb kontak opt-in UMKM',
                )
              }
              className="shrink-0 w-full flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[0.62rem] font-bold text-white"
              style={{ background: '#137A4C' }}
            >
              <Send className="w-3 h-3" />
              Kirim Blast &quot;Klarifikasi Pajak&quot; — 642 rb kontak
            </button>
          </div>
        </UMKMCard>
      </div>

      {/* Intent + complaint flow */}
      <div className="area-intent min-h-0">
        <UMKMCard
          title="Intent & Kinerja Bot WA"
          subtitle="18.412 sesi · 24 jam"
          action={<SEPill tone="ok">Sehat</SEPill>}
          className="h-full edu-card-tight"
        >
          <div className="flex flex-col h-full min-h-0 gap-1.5">
            <div className="flex-[1.2] min-h-0">
              <DenseBars items={data.botIntents} />
            </div>
            <div
              className="shrink-0 rounded-md border px-2 py-1.5"
              style={{ borderColor: '#DDEFE3', background: '#F4FBF6' }}
            >
              <div
                className="text-[0.48rem] font-bold uppercase tracking-wider mb-1"
                style={{ color: '#137A4C' }}
              >
                Alur Pengaduan
              </div>
              <div className="grid grid-cols-3 gap-1">
                {data.eduComplaints.map((c) => (
                  <div key={c.label} className="min-w-0">
                    <b className="block text-[0.78rem] tabular-nums leading-none" style={{ color: 'var(--ink)' }}>
                      {c.value}
                    </b>
                    <span className="block text-[0.45rem] font-semibold truncate mt-0.5" style={{ color: 'var(--ink-2)' }}>
                      {c.label}
                    </span>
                    <span className="block text-[0.42rem]" style={{ color: 'var(--ink-3)' }}>
                      {c.note}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </UMKMCard>
      </div>

      {/* Opt-in growth chart */}
      <div className="area-growth min-h-0">
        <UMKMCard
          title="Pertumbuhan Opt-in & Interaksi"
          subtitle="6 minggu · kontak WA Official"
          className="h-full edu-card-tight"
        >
          <div className="h-full min-h-0">
            <OptInGrowthChart series={data.eduGrowth} />
          </div>
        </UMKMCard>
      </div>

      {/* Calendar */}
      <div className="area-cal min-h-0">
        <UMKMCard
          title="Kalender & Pipeline Konten Edukasi"
          subtitle={`${data.calendar.length} jadwal · 7 hari ke depan`}
          action={
            <button
              type="button"
              onClick={() => onAskAI?.('Minta AI buat draft konten edukasi UMKM untuk minggu ini')}
              className="inline-flex items-center gap-1 text-[0.55rem] font-bold px-2 py-1 rounded-full border"
              style={{
                borderColor: 'rgba(5,150,105,0.45)',
                background: '#E6F4EA',
                color: 'var(--orange-deep)',
              }}
            >
              <Sparkles className="w-3 h-3" /> + Minta AI buat draft
            </button>
          }
          className="h-full edu-card-tight"
        >
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
            <div
              className="grid grid-cols-[0.8fr_minmax(0,2.1fr)_0.95fr_0.95fr_0.7fr] gap-1 shrink-0 pb-1 text-[0.45rem] font-bold uppercase tracking-wider"
              style={{ color: 'var(--ink-3)' }}
            >
              <span>Jadwal</span>
              <span>Tema</span>
              <span>Kanal</span>
              <span>Format</span>
              <span>Status</span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col gap-1">
              {data.calendar.map((row, i) => (
                <div
                  key={row.schedule}
                  className={cn(
                    'flex-1 min-h-0 grid grid-cols-[0.8fr_minmax(0,2.1fr)_0.95fr_0.95fr_0.7fr] gap-1 items-center rounded-md border px-1.5 py-0.5',
                  )}
                  style={{
                    borderColor: 'var(--line)',
                    background: i % 2 === 0 ? '#fff' : 'var(--cream)',
                  }}
                >
                  <span className="text-[0.58rem] font-bold truncate" style={{ color: 'var(--ink)' }}>
                    {row.schedule}
                  </span>
                  <span className="text-[0.58rem] truncate" style={{ color: 'var(--ink)' }} title={row.theme}>
                    {row.theme}
                  </span>
                  <span className="text-[0.52rem] truncate" style={{ color: 'var(--ink-2)' }}>
                    {row.channel}
                  </span>
                  <span className="text-[0.5rem] truncate" style={{ color: 'var(--ink-3)' }}>
                    {row.format}
                  </span>
                  <div className="min-w-0">
                    <SEStatus label={row.status} tone={row.statusTone} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </UMKMCard>
      </div>

      {/* Channel performance + best content */}
      <div className="area-ch min-h-0">
        <UMKMCard
          title="Performa Konten Edukasi per Kanal"
          subtitle="Engagement rate · 7 hari"
          className="h-full edu-card-tight"
        >
          <div className="flex flex-col h-full min-h-0 gap-1.5">
            <div className="flex-1 min-h-0">
              <DenseBars items={data.eduChannels} />
            </div>
            <div
              className="shrink-0 rounded-md border px-2 py-1.5"
              style={{
                borderColor: 'rgba(5,150,105,0.35)',
                background: 'linear-gradient(135deg,#F0FDF4,#E6F4EA)',
              }}
            >
              <div
                className="text-[0.45rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--orange-deep)' }}
              >
                Best education content this week
              </div>
              <div className="text-[0.62rem] font-bold mt-0.5 leading-snug" style={{ color: 'var(--ink)' }}>
                {data.eduBestContent.title}
              </div>
              <div className="flex gap-2 mt-1 text-[0.52rem] font-semibold" style={{ color: 'var(--ink-2)' }}>
                <span>{data.eduBestContent.channel}</span>
                <span>ER {data.eduBestContent.er}</span>
                <span>{data.eduBestContent.views} views</span>
              </div>
            </div>
          </div>
        </UMKMCard>
      </div>
    </div>
  );
}
