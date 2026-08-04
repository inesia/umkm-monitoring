import { BRAND } from '@/lib/constants';

/** Footer strip — attribution + confidentiality notice */
export function UMKMFooter() {
  return (
    <footer
      className="umkm-tv-footer shrink-0 flex items-center justify-between gap-3 px-4 py-1 border-t"
      style={{
        background: 'rgba(255,255,255,0.92)',
        borderColor: 'var(--line)',
      }}
    >
      <span
        className="text-[0.55rem] font-bold uppercase tracking-[0.12em] shrink-0"
        style={{ color: 'var(--orange-deep)' }}
      >
        {BRAND.poweredBy}
      </span>
      <span
        className="text-[0.55rem] font-semibold text-right truncate min-w-0"
        style={{ color: 'var(--ink-3)' }}
      >
        {BRAND.footer}
      </span>
    </footer>
  );
}
