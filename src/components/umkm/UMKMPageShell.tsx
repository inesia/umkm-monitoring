'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, Search, Monitor } from 'lucide-react';
import { BRAND } from '@/lib/constants';
import { cn } from '@/lib/utils';

type ActiveNav = 'tv' | 'search' | 'reports';

type UMKMPageShellProps = {
  title: string;
  subtitle: string;
  active: ActiveNav;
  children: React.ReactNode;
};

const NAV: { id: ActiveNav; href: string; label: string; icon: React.ReactNode }[] = [
  { id: 'tv', href: '/', label: 'TV Monitor', icon: <Monitor className="w-4 h-4" /> },
  { id: 'search', href: '/search', label: 'Search', icon: <Search className="w-4 h-4" /> },
  { id: 'reports', href: '/reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
];

export function UMKMPageShell({ title, subtitle, active, children }: UMKMPageShellProps) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }),
      );
      setCurrentTime(
        `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`,
      );
      setCurrentDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      );
    };
    update();
    const t = setInterval(update, 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="h-screen w-screen overflow-hidden relative flex flex-col"
      data-dashboard="umkm-page"
      style={{
        background:
          'radial-gradient(1100px 460px at 85% -10%, #FFE7CC 0%, rgba(255,231,204,0) 60%), linear-gradient(180deg,#FFF6EC 0%, #FFFDFB 460px)',
        color: 'var(--ink)',
      }}
    >
      <header
        className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-6 py-3 shrink-0 border-b backdrop-blur-md"
        style={{ background: 'rgba(255,255,255,0.88)', borderColor: 'var(--line)' }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="h-10 flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
          >
            <Image
              src={BRAND.logo}
              alt={`${BRAND.title} — ${BRAND.subtitle}`}
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
          <div className="w-px h-8" style={{ background: 'var(--line-2)' }} />
          <div>
            <h1 className="text-base font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
              {BRAND.title}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-[0.62rem] font-bold uppercase tracking-[0.16em]"
                style={{ color: 'var(--orange-deep)' }}
              >
                {BRAND.subtitle}
              </span>
              <span style={{ color: 'var(--line-2)' }}>·</span>
              <span className="text-[0.68rem]" style={{ color: 'var(--ink-3)' }}>
                {subtitle}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex items-center gap-1.5">
            {NAV.map((item) => {
              const isActive = item.id === active;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    'p-2 rounded-lg border shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]',
                    isActive ? 'text-white' : 'bg-white/80 hover:bg-white',
                  )}
                  style={
                    isActive
                      ? { background: 'var(--ink)', borderColor: 'var(--ink)', color: '#fff' }
                      : { borderColor: 'var(--line)', color: 'var(--ink-2)' }
                  }
                >
                  {item.icon}
                </Link>
              );
            })}
          </nav>

          <div
            className="px-4 py-2 rounded-lg flex items-center gap-3 shadow-sm border bg-white"
            style={{ borderColor: 'var(--line)' }}
          >
            <span className="text-[0.62rem] font-medium" style={{ color: 'var(--ink-3)' }} suppressHydrationWarning>
              {currentDate}
            </span>
            <div className="w-px h-3" style={{ background: 'var(--line-2)' }} />
            <span className="text-[0.72rem] font-bold tabular-nums" style={{ color: 'var(--ink)' }} suppressHydrationWarning>
              {currentTime} WIB
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto">{children}</main>

      <footer
        className="shrink-0 flex items-center justify-between gap-3 px-6 py-1.5 border-t"
        style={{ background: 'rgba(255,255,255,0.92)', borderColor: 'var(--line)' }}
      >
        <span
          className="text-[0.55rem] font-bold uppercase tracking-[0.12em]"
          style={{ color: 'var(--orange-deep)' }}
        >
          {BRAND.poweredBy}
        </span>
        <span className="text-[0.55rem] font-semibold text-right truncate" style={{ color: 'var(--ink-3)' }}>
          {BRAND.footer}
        </span>
      </footer>
    </div>
  );
}
