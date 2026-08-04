'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import type { DigitalArmyTask, UMKMDashboardData } from '@/types/umkm';
import { UMKMCard, SEPill } from './UMKMCard';
import { cn } from '@/lib/utils';

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

function MiniSparkline({
  values,
  tone,
}: {
  values: number[];
  tone: DigitalArmyTask['pill'];
}) {
  const uid = useId().replace(/:/g, '');
  const path = useMemo(() => {
    if (!values.length) return '';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const w = 56;
    const h = 18;
    return values
      .map((v, i) => {
        const x = (i / Math.max(values.length - 1, 1)) * w;
        const y = h - ((v - min) / span) * (h - 2) - 1;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [values]);

  const stroke =
    tone === 'high' ? 'var(--orange-deep)' : tone === 'warn' ? 'var(--amber)' : 'var(--pos)';

  return (
    <svg width="56" height="18" viewBox="0 0 56 18" className="shrink-0" aria-hidden>
      <defs>
        <linearGradient id={`da-sp-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={`url(#da-sp-${uid})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActionTile({
  task,
  reducedMotion,
}: {
  task: DigitalArmyTask;
  reducedMotion: boolean;
}) {
  const isPriority = task.pill === 'high' || task.pillLabel.toUpperCase() === 'PRIORITAS';
  const bar =
    task.pill === 'high'
      ? 'linear-gradient(90deg,#DCE6F1,var(--orange-deep))'
      : task.pill === 'warn'
        ? 'linear-gradient(90deg,#DCE6F1,var(--amber))'
        : 'linear-gradient(90deg,#9BD8B5,var(--pos))';

  return (
    <div
      className={cn(
        'da-action-tile group relative flex flex-col min-h-0 rounded-lg border bg-white px-2 py-1.5 overflow-hidden',
        isPriority && 'da-tile-priority',
      )}
      style={{ borderColor: isPriority ? 'rgba(21,41,67,0.35)' : 'var(--line)' }}
    >
      {isPriority && (
        <span
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, var(--orange-deep), var(--orange))' }}
        />
      )}
      <div className="flex items-center justify-between gap-1 min-w-0">
        <b className="text-[0.62rem] font-bold truncate text-[#152943]">
          {task.headline}
        </b>
        {!isPriority && (
          <span
            className="text-[0.45rem] font-bold uppercase tracking-wide shrink-0 px-1 py-0.5 rounded"
            style={{
              color:
                task.pill === 'warn' ? 'var(--orange-deep)' : 'var(--pos)',
              background: task.pill === 'warn' ? '#EBF3FA' : '#E8F6EE',
            }}
          >
            {task.pillLabel}
          </span>
        )}
      </div>

      <div
        className="text-[0.62rem] font-bold leading-snug mt-1 line-clamp-1"
        style={{ color: 'var(--ink)' }}
        title={task.name}
      >
        {task.name}
      </div>
      <div className="text-[0.48rem] leading-tight line-clamp-1 mt-0.5" style={{ color: 'var(--ink-3)' }}>
        {task.meta}
      </div>

      <div className="mt-auto pt-1.5 flex items-end justify-between gap-1">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-[0.45rem] font-semibold mb-0.5" style={{ color: 'var(--ink-3)' }}>
            <span>Progress</span>
            <span className="tabular-nums">{task.progress}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--cream-2)' }}>
            <i className="block h-full rounded-full" style={{ width: `${task.progress}%`, background: bar }} />
          </div>
        </div>
        <MiniSparkline values={task.sparkline} tone={task.pill} />
      </div>

      <div className="da-tile-actions absolute inset-x-0 bottom-0 flex gap-1 p-1.5 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
        {task.actions.map((label) => (
          <button
            key={label}
            type="button"
            className="flex-1 rounded-md px-1 py-1 text-[0.5rem] font-bold text-white truncate"
            style={{ background: 'var(--ink)' }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DigitalArmyPanel({ data }: { data: UMKMDashboardData['digitalArmy'] }) {
  const reducedMotion = usePrefersReducedMotion();
  const tiles = data.tasks.slice(0, 6);

  return (
    <UMKMCard
      title="Digital Army"
      subtitle="Kontra-narasi & amplifikasi"
      action={<SEPill tone="ok">{data.active} Aktif</SEPill>}
      className="h-full"
    >
      <div className="flex flex-col h-full min-h-0 gap-1.5">
        <div className="grid grid-cols-3 gap-1 shrink-0">
          {data.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-md border px-1.5 py-1"
              style={{ background: 'var(--cream)', borderColor: 'var(--line)' }}
            >
              <b className="block text-[0.8rem] tabular-nums leading-none" style={{ color: 'var(--ink)' }}>
                {s.value}
              </b>
              <small
                className="text-[0.45rem] font-bold uppercase tracking-wide leading-tight"
                style={{ color: 'var(--ink-3)' }}
              >
                {s.label}
              </small>
            </div>
          ))}
        </div>

        <div className="da-action-grid flex-1 min-h-0 grid grid-cols-3 grid-rows-2 gap-1.5">
          {tiles.map((task) => (
            <ActionTile key={task.name} task={task} reducedMotion={reducedMotion} />
          ))}
        </div>
      </div>
    </UMKMCard>
  );
}
