import { BRAND } from '@/lib/constants';

type UMKMFooterProps = {
  /** 0–100 view-rotate progress; footer background fills as progress bar */
  progress?: number;
  activeView?: string;
  nextView?: string;
  showProgress?: boolean;
};

/** Footer strip — attribution + confidentiality; background doubles as rotate progress */
export function UMKMFooter({
  progress = 0,
  activeView,
  nextView,
  showProgress = false,
}: UMKMFooterProps) {
  const pct = Math.min(100, Math.max(0, progress));
  const active = showProgress;

  return (
    <footer
      className="umkm-tv-footer relative shrink-0 flex items-center justify-between gap-3 px-4 py-2 border-t overflow-hidden"
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
      {active && (
        <div
          className="absolute inset-y-0 left-0 transition-[width] duration-100 ease-linear"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #d4e4f4 0%, #c5daf0 70%, #b8d2eb 100%)',
          }}
          aria-hidden
        >
          {/* Pulsing leading edge */}
          <div
            className="umkm-footer-progress-head absolute inset-y-0 right-0 w-1.5"
            style={{
              background: 'linear-gradient(180deg, #7eb8e8, #4a90c8, #3b7ab0)',
            }}
          />
        </div>
      )}

      <span
        className="relative z-[1] text-[0.6rem] font-extrabold uppercase tracking-[0.14em] shrink-0"
        style={{ color: '#152943' }}
      >
        {BRAND.poweredBy}
      </span>
      <span
        className="relative z-[1] text-[0.58rem] font-semibold text-right truncate min-w-0"
        style={{ color: '#5f6b76' }}
      >
        {BRAND.footer}
      </span>
    </footer>
  );
}
