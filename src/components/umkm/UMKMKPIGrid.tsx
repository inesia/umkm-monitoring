import type { UMKMKPI } from '@/types/umkm';
import { cn } from '@/lib/utils';

export function UMKMKPIGrid({
  items,
  columns = 6,
  showBar = true,
}: {
  items: UMKMKPI[];
  columns?: 4 | 6;
  /** Bottom progress bar — hide on Ringkasan (moved to top ticker). */
  showBar?: boolean;
}) {
  return (
    <div
      className={cn(
        'grid gap-2.5 shrink-0',
        columns === 4 ? 'grid-cols-4' : 'grid-cols-6',
      )}
    >
      {items.map((kpi) => (
        <div
          key={kpi.id}
          className="relative overflow-hidden rounded-[12px] border bg-white px-3 py-2.5"
          style={{ borderColor: 'var(--line)', boxShadow: 'var(--shadow-se)' }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{
              background:
                kpi.barTone === 'red'
                  ? 'linear-gradient(90deg, var(--neg), #E88A6F)'
                  : kpi.barTone === 'green'
                    ? 'linear-gradient(90deg, #137A4C, #4FBF8B)'
                    : 'linear-gradient(90deg, var(--orange-deep), var(--orange) 30%, var(--amber) 60%, var(--amber))',
            }}
          />
          <div
            className="text-[0.58rem] font-bold uppercase tracking-[0.13em]"
            style={{ color: 'var(--ink-3)' }}
          >
            {kpi.label}
          </div>
          <div
            className="text-[1.35rem] font-bold tracking-tight mt-0.5 tabular-nums leading-none"
            style={{ color: kpi.accent || 'var(--ink)' }}
          >
            {kpi.value}
          </div>
          <div
            className={cn(
              'text-[0.64rem] font-semibold mt-1',
              kpi.deltaTone === 'up' && 'text-[var(--pos)]',
              kpi.deltaTone === 'down' && 'text-[var(--neg)]',
              kpi.deltaTone === 'flat' && 'text-[var(--neu)]',
            )}
          >
            {kpi.delta}
          </div>
          {showBar && (
            <div
              className="h-[3px] rounded-full mt-2 overflow-hidden"
              style={{ background: 'var(--cream-2)' }}
            >
              <i
                className="block h-full rounded-full"
                style={{
                  width: `${kpi.bar}%`,
                  background:
                    kpi.barTone === 'red'
                      ? 'linear-gradient(90deg,#F5A08F,var(--neg))'
                      : kpi.barTone === 'green'
                        ? 'linear-gradient(90deg,#9BD8B5,var(--pos))'
                        : 'linear-gradient(90deg,#DCE6F1,var(--orange))',
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
