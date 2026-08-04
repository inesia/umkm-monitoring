'use client';

type UMKMViewProgressBarProps = {
  progress: number;
  activeView: string;
  nextView: string;
};

export function UMKMViewProgressBar({
  progress,
  activeView,
  nextView,
}: UMKMViewProgressBarProps) {
  return (
    <div
      className="umkm-view-progress h-1.5 shrink-0 overflow-hidden"
      style={{ background: '#E8D9C8' }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Auto-rotate from ${activeView} to ${nextView}`}
    >
      <div
        className="h-full transition-[width] duration-100 ease-linear"
        style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
          background:
            'linear-gradient(90deg, var(--orange-deep), var(--orange) 45%, var(--amber))',
        }}
      />
    </div>
  );
}
