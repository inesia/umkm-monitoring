import { cn } from '@/lib/utils';

type UMKMCardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  ribbon?: 'orange' | 'red' | 'green' | 'none';
  tone?: 'default' | 'esc' | 'wa';
};

export function UMKMCard({
  children,
  className,
  title,
  subtitle,
  action,
  ribbon = 'none',
  tone = 'default',
}: UMKMCardProps) {
  return (
    <div
      className={cn(
        'relative h-full min-h-0 overflow-hidden rounded-[12px] border p-3 flex flex-col',
        tone === 'esc' && 'bg-gradient-to-b from-[#FFFDFB] to-[#FFF5EA]',
        tone === 'wa' && 'bg-gradient-to-b from-white to-[#F4FBF6]',
        tone === 'default' && 'bg-white',
        className,
      )}
      style={{
        borderColor: tone === 'wa' ? '#DDEFE3' : 'var(--line)',
        boxShadow: 'var(--shadow-se)',
      }}
    >
      {ribbon !== 'none' && (
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background:
              ribbon === 'red'
                ? 'linear-gradient(90deg, var(--neg), #E88A6F)'
                : ribbon === 'green'
                  ? 'linear-gradient(90deg, #137A4C, #4FBF8B)'
                  : 'linear-gradient(90deg, var(--orange-deep), var(--orange) 30%, var(--amber) 60%, var(--amber))',
          }}
        />
      )}
      {(title || action) && (
        <div className="flex items-start justify-between gap-2 mb-2 shrink-0">
          <div className="min-w-0">
            {title && (
              <div
                className="text-[0.68rem] font-bold uppercase tracking-[0.16em]"
                style={{ color: 'var(--ink-2)' }}
              >
                {title}
              </div>
            )}
            {subtitle && (
              <div className="text-[0.7rem] mt-0.5" style={{ color: 'var(--ink-3)' }}>
                {subtitle}
              </div>
            )}
          </div>
          {action}
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

export function SEPill({
  children,
  tone = 'live',
}: {
  children: React.ReactNode;
  tone?: 'live' | 'ok' | 'warn' | 'high' | 'med';
}) {
  const styles: Record<string, { bg: string; color: string }> = {
    live: { bg: '#FFECEC', color: 'var(--neg)' },
    ok: { bg: '#E8F6EE', color: 'var(--pos)' },
    warn: { bg: '#FFF4E5', color: 'var(--orange-deep)' },
    high: { bg: '#FDEAE7', color: 'var(--neg)' },
    med: { bg: '#FFF6DB', color: '#9A7A00' },
  };
  const s = styles[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[0.58rem] font-bold uppercase tracking-[0.06em] px-2.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}
    >
      {(tone === 'live' || tone === 'high') && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}

export function SEStatus({
  label,
  tone,
}: {
  label: string;
  tone: 'done' | 'proc' | 'rep' | 'rev';
}) {
  const map = {
    done: { bg: '#E8F6EE', color: 'var(--pos)' },
    proc: { bg: '#EBF3FA', color: 'var(--orange-deep)' },
    rep: { bg: '#EFEBFF', color: '#5B4DB8' },
    rev: { bg: '#FDEAE7', color: 'var(--neg)' },
  };
  const s = map[tone];
  return (
    <span
      className="text-[0.58rem] font-bold uppercase tracking-[0.04em] px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}
    >
      {label}
    </span>
  );
}

export function ChannelBars({
  items,
}: {
  items: { name: string; pct: number; value: string; tone: 'orange' | 'green' | 'dark' }[];
}) {
  const barColor = {
    orange: 'linear-gradient(90deg, #DCE6F1, var(--orange))',
    green: 'linear-gradient(90deg,#9BD8B5,var(--pos))',
    dark: 'linear-gradient(90deg,#CFC6B8,#3E3A34)',
  };
  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div
          key={item.name}
          className="grid grid-cols-[88px_1fr_46px] gap-2 items-center text-[0.74rem]"
        >
          <span className="truncate" style={{ color: 'var(--ink)' }}>
            {item.name}
          </span>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--cream-2)' }}>
            <i
              className="block h-full rounded-full"
              style={{ width: `${item.pct}%`, background: barColor[item.tone] }}
            />
          </div>
          <span className="text-right font-semibold tabular-nums" style={{ color: 'var(--ink-2)' }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
