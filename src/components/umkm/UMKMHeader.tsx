'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BRAND } from '@/lib/constants';
import type { UMKMView } from '@/types/umkm';
import { cn } from '@/lib/utils';
import { Maximize, Minimize } from 'lucide-react';

const VIEWS: { id: UMKMView; label: string; badge?: number }[] = [
  { id: 'menteri', label: 'Menteri' },
  { id: 'program', label: 'Kementerian & Program' },
  { id: 'krisis', label: 'Isu & Krisis', badge: 1 },
];

const RANGES = ['1J', '6J', '24J', '7H'];

type UMKMHeaderProps = {
  activeView: UMKMView;
  onViewChange?: (view: UMKMView) => void;
  timeframe?: string;
  onTimeframeChange?: (tf: string) => void;
  currentTime: string;
  currentDate: string;
  autoRotate?: boolean;
  onAutoRotateToggle?: () => void;
  kiosk?: boolean;
  syncStatus?: {
    loading: boolean;
    error: string | null;
    lastSyncedAt: Date | null;
    onRefresh?: () => void;
  };
};

export function UMKMHeader({
  activeView,
  onViewChange,
  timeframe = '24J',
  onTimeframeChange,
  currentTime,
  currentDate,
  autoRotate = false,
  onAutoRotateToggle,
  kiosk = false,
  syncStatus,
}: UMKMHeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const syncLabel = syncStatus?.error
    ? 'Sync error'
    : syncStatus?.loading
      ? 'Syncing…'
      : syncStatus?.lastSyncedAt
        ? `Synced ${syncStatus.lastSyncedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
        : 'Live';

  return (
    <header className="umkm-tv-header shrink-0 border-b backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.92)', borderColor: 'var(--line)' }}>
      <div className="h-full px-5 py-2 flex items-center gap-4 w-full">
        <div className="flex items-center gap-3 shrink-0">
          <Image
            src={BRAND.logo}
            alt={`${BRAND.title} — ${BRAND.subtitle}`}
            width={160}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
          <div>
            <div className="text-sm font-heading font-bold leading-tight" style={{ color: 'var(--ink)' }}>
              {BRAND.title}
            </div>
            <div
              className="font-heading text-[0.62rem] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'var(--orange-deep)' }}
            >
              {BRAND.subtitle}
            </div>
          </div>
        </div>

        <div className="w-px h-8 shrink-0" style={{ background: 'var(--line-2)' }} />

        <div className="hidden lg:block shrink-0">
          <div className="text-[0.58rem] font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--ink-3)' }}>
            Periode
          </div>
          <div className="text-[0.78rem] font-semibold mt-0.5" style={{ color: 'var(--ink)' }}>
            {BRAND.phase}
          </div>
        </div>

        <div className="w-px h-8 hidden lg:block shrink-0" style={{ background: 'var(--line-2)' }} />

        <div className="hidden xl:block shrink-0">
          <div className="text-[0.58rem] font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--ink-3)' }}>
            Cakupan
          </div>
          <div className="text-[0.78rem] font-semibold mt-0.5" style={{ color: 'var(--ink)' }}>
            {BRAND.coverage}
          </div>
        </div>

        <div
          className="flex p-0.5 rounded-full ml-auto border shrink-0"
          style={{ background: 'var(--cream-2)', borderColor: 'var(--line)' }}
          role="tablist"
        >
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={activeView === v.id}
              onClick={() => onViewChange?.(v.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-[0.78rem] font-bold transition-all whitespace-nowrap',
                activeView === v.id ? 'text-white' : '',
              )}
              style={
                activeView === v.id
                  ? { background: 'var(--ink)', color: '#fff' }
                  : { color: 'var(--ink-3)' }
              }
            >
              {v.label}
              {v.badge != null && (
                <span className="ml-1.5 inline-block min-w-4 text-center text-[0.58rem] rounded-full px-1 bg-[var(--neg)] text-white align-top">
                  {v.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-1 shrink-0">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onTimeframeChange?.(r)}
              className="px-2.5 py-1.5 rounded-lg text-[0.68rem] font-bold border transition-all"
              style={
                timeframe === r
                  ? {
                      background: 'linear-gradient(135deg, var(--orange), var(--orange-deep))',
                      color: '#fff',
                      borderColor: 'transparent',
                    }
                  : {
                      background: '#fff',
                      color: 'var(--ink-3)',
                      borderColor: 'var(--line)',
                    }
              }
            >
              {r}
            </button>
          ))}
        </div>

        {syncStatus && (
          <button
            type="button"
            onClick={() => syncStatus.onRefresh?.()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[0.62rem] font-bold shrink-0"
            style={{
              background: '#fff',
              borderColor: syncStatus.error ? 'var(--neg)' : 'var(--line)',
              color: syncStatus.error ? 'var(--neg)' : 'var(--ink-3)',
            }}
            title="Refresh data"
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                syncStatus.loading && 'animate-pulse',
              )}
              style={{
                background: syncStatus.error
                  ? 'var(--neg)'
                  : syncStatus.loading
                    ? 'var(--amber)'
                    : 'var(--pos)',
              }}
            />
            {syncLabel}
          </button>
        )}

        <button
          type="button"
          onClick={toggleFullscreen}
          className="flex items-center justify-center p-2 rounded-lg border text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 transition-all shrink-0 cursor-pointer shadow-xs"
          style={{ borderColor: 'var(--line)' }}
          title={isFullscreen ? 'Keluar Layar Penuh (ESC)' : 'Layar Penuh (Full Screen)'}
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </button>

        <div className="text-right shrink-0 leading-tight min-w-[7rem]">
          <div className="text-base font-bold tabular-nums" style={{ color: 'var(--ink)' }}>
            {currentTime} WIB
          </div>
          <div className="text-[0.62rem] font-semibold" style={{ color: 'var(--ink-3)' }}>
            {currentDate}
          </div>
        </div>
      </div>
    </header>
  );
}
