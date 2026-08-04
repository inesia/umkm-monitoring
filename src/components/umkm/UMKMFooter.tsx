import { BRAND } from '@/lib/constants';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UMKMView } from '@/types/umkm';

type UMKMFooterProps = {
  /** 0–100 view-rotate progress; footer background fills as progress bar */
  progress?: number;
  activeView?: UMKMView;
  nextView?: UMKMView;
  showProgress?: boolean;
  autoRotate?: boolean;
  onToggleAutoRotate?: () => void;
  onPrevView?: () => void;
  onNextView?: () => void;
};

/** Footer strip — attribution + confidentiality; background doubles as rotate progress */
export function UMKMFooter({
  progress = 0,
  activeView,
  nextView,
  showProgress = false,
  autoRotate = true,
  onToggleAutoRotate,
  onPrevView,
  onNextView,
}: UMKMFooterProps) {
  const pct = Math.min(100, Math.max(0, progress));
  const active = showProgress;

  return (
    <footer
      className="umkm-tv-footer relative shrink-0 flex items-center justify-between gap-3 px-4 py-0.5 border-t overflow-hidden select-none"
      style={{ borderColor: 'var(--line)' }}
      role={active ? 'progressbar' : undefined}
      aria-valuenow={active ? Math.round(pct) : undefined}
      aria-valuemin={active ? 0 : undefined}
      aria-valuemax={active ? 100 : undefined}
      aria-label={
        active && activeView && nextView
          ? `Auto-rotate from ${activeView} to ${nextView}`
          : undefined
      }
    >
      {/* Soft track */}
      <div className="absolute inset-0" style={{ background: '#eef3f8' }} aria-hidden />

      {/* Soft progress fill — text stays dark on top */}
      {active && (() => {
        const isNearEnd = pct >= 85;
        return (
          <div
            className="absolute inset-y-0 left-0 transition-[width,background-color] duration-150 ease-linear"
            style={{
              width: `${pct}%`,
              background: isNearEnd
                ? 'linear-gradient(90deg, #d4e4f4 0%, #fee2e2 60%, #fca5a5 100%)'
                : 'linear-gradient(90deg, #d4e4f4 0%, #c5daf0 70%, #b8d2eb 100%)',
            }}
            aria-hidden
          >
            {/* Pulsing leading edge — turns glowing red when approaching tab switch */}
            <div
              className={cn(
                'umkm-footer-progress-head absolute inset-y-0 right-0 transition-all duration-300',
                isNearEnd ? 'w-2 animate-pulse' : 'w-1.5',
              )}
              style={{
                background: isNearEnd
                  ? 'linear-gradient(180deg, #f87171, #ef4444, #b91c1c)'
                  : 'linear-gradient(180deg, #7eb8e8, #4a90c8, #3b7ab0)',
                boxShadow: isNearEnd
                  ? '0 0 10px rgba(239, 68, 68, 0.9)'
                  : '0 0 4px rgba(59, 130, 246, 0.4)',
              }}
            />
          </div>
        );
      })()}

      {/* Left: Powered By attribution */}
      <span
        className="relative z-[1] text-[0.58rem] font-extrabold uppercase tracking-[0.14em] shrink-0"
        style={{ color: '#152943' }}
      >
        {BRAND.poweredBy}
      </span>

      {/* Center: Confidentiality notice */}
      <span
        className="relative z-[1] text-[0.56rem] font-semibold text-center truncate min-w-0 flex-1 px-2"
        style={{ color: '#5f6b76' }}
      >
        {BRAND.footer}
      </span>

      {/* Right: Mini TV Player Controller */}
      <div className="relative z-[2] flex items-center gap-1 shrink-0 bg-white/90 backdrop-blur-xs rounded-full px-1.5 py-0.5 border border-slate-300/80 shadow-2xs">
        {/* Prev Tab */}
        <button
          type="button"
          onClick={onPrevView}
          className="p-0.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors cursor-pointer"
          title="Tab Sebelumnya (← / PageUp)"
        >
          <SkipBack className="w-2.5 h-2.5 fill-current" />
        </button>

        {/* Play / Pause Toggle */}
        <button
          type="button"
          onClick={onToggleAutoRotate}
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold transition-all cursor-pointer shadow-2xs leading-none uppercase tracking-wider',
            autoRotate
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-amber-500 hover:bg-amber-600 text-white',
          )}
          title={autoRotate ? 'Klik untuk Pause (Space / Remote)' : 'Klik untuk Autoplay (Space / Remote)'}
        >
          {autoRotate ? (
            <>
              <Pause className="w-2.5 h-2.5 fill-current" />
              <span>Autoplay</span>
            </>
          ) : (
            <>
              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
              <span>Pause</span>
            </>
          )}
        </button>

        {/* Next Tab */}
        <button
          type="button"
          onClick={onNextView}
          className="p-0.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors cursor-pointer"
          title="Tab Berikutnya (→ / PageDown)"
        >
          <SkipForward className="w-2.5 h-2.5 fill-current" />
        </button>
      </div>
    </footer>
  );
}
