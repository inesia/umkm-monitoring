'use client';

import type { TakedownItem } from '@/types/umkm';
import { UMKMCard } from './UMKMCard';
import { cn } from '@/lib/utils';

const SEVERITY_BAR = {
  high: '#DC2626',
  medium: '#F59E0B',
  low: '#16A34A',
} as const;

const SOURCE_LABEL: Record<TakedownItem['source'], string> = {
  tiktok: 'TT',
  facebook: 'FB',
  x: 'X',
  web: 'WEB',
  instagram: 'IG',
};

const SOURCE_BG: Record<TakedownItem['source'], string> = {
  tiktok: '#111827',
  facebook: '#1877F2',
  x: '#0F1419',
  web: '#6B7280',
  instagram: '#E1306C',
};

const CHIP_STYLE: Record<string, { bg: string; border: string; color: string }> = {
  Identified: { bg: 'var(--cream)', border: 'var(--line)', color: 'var(--ink)' },
  Reported: { bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
  'In Process': { bg: '#FFF7ED', border: '#FDBA74', color: '#C2410C' },
  Takedown: { bg: '#E8F6EE', border: '#C4E6D2', color: '#137A4C' },
};

function TakedownRow({ item }: { item: TakedownItem }) {
  return (
    <div
      className="td-row group relative flex-1 min-h-0 flex items-stretch gap-0 rounded-md border bg-white overflow-hidden"
      style={{ borderColor: 'var(--line)' }}
    >
      <span
        className="w-[3px] shrink-0 self-stretch"
        style={{ background: SEVERITY_BAR[item.severity] }}
        aria-hidden
      />

      <div className="flex-1 min-w-0 flex items-center gap-1.5 px-1.5 py-1">
        <span
          className="w-5 h-5 rounded-md flex items-center justify-center text-[0.42rem] font-bold text-white shrink-0"
          style={{ background: SOURCE_BG[item.source] }}
          title={item.channel}
        >
          {SOURCE_LABEL[item.source]}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-1">
            <b
              className="text-[0.62rem] font-semibold leading-snug truncate"
              style={{ color: 'var(--ink)' }}
              title={item.title}
            >
              {item.title}
            </b>
            <span className="text-[0.52rem] font-bold tabular-nums shrink-0" style={{ color: 'var(--ink-2)' }}>
              {item.reach}
            </span>
          </div>

          <div className="td-row-preview text-[0.48rem] leading-tight truncate mt-0.5" style={{ color: 'var(--ink-3)' }}>
            {item.preview}
          </div>

          <div className="td-row-meta text-[0.45rem] font-semibold truncate" style={{ color: 'var(--orange-deep)' }}>
            {item.time} · {item.channel}
          </div>
        </div>

        <div className="td-row-actions flex flex-col gap-0.5 shrink-0">
          <button type="button" className="td-action td-action-takedown">
            Takedown
          </button>
          <div className="flex gap-0.5">
            <button type="button" className="td-action td-action-muted">
              Report
            </button>
            <button type="button" className="td-action td-action-muted">
              Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TakedownPanel({
  data,
  variant = 'menteri',
}: {
  data: {
    chips: { value: string; label: string; highlight?: boolean }[];
    items: TakedownItem[];
  };
  variant?: 'menteri' | 'krisis' | 'ringkasan';
}) {
  const items = variant === 'krisis' ? data.items.slice(0, 4) : data.items.slice(0, 2);

  return (
    <UMKMCard title="Takedown Hoaks" subtitle="Sosial & portal · 7 hari" className="h-full">
      <div className="flex flex-col h-full min-h-0 gap-1.5">
        <div className="flex gap-1 shrink-0">
          {data.chips.map((c) => {
            const style = CHIP_STYLE[c.label] ?? CHIP_STYLE.Identified;
            return (
              <div
                key={c.label}
                className={cn(
                  'td-status-pill flex-1 text-center rounded-md border py-1 px-0.5',
                  c.highlight && 'td-status-pill-hot',
                )}
                style={{
                  background: style.bg,
                  borderColor: style.border,
                }}
              >
                <b className="block text-[0.8rem] tabular-nums leading-none" style={{ color: style.color }}>
                  {c.value}
                </b>
                <small
                  className="text-[0.42rem] font-bold uppercase tracking-wide leading-tight"
                  style={{ color: 'var(--ink-3)' }}
                >
                  {c.label}
                </small>
              </div>
            );
          })}
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-1 overflow-hidden">
          {items.map((item) => (
            <TakedownRow key={item.title} item={item} />
          ))}
        </div>
      </div>
    </UMKMCard>
  );
}
