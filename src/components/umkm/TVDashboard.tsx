'use client';

import { useEffect, useState, useCallback } from 'react';
import type { UMKMView } from '@/types/umkm';
import { useUMKMData } from '@/hooks/useSE2026Data';
import { UMKMHeader } from './UMKMHeader';
import { UMKMTicker } from './UMKMTicker';
import { UMKMViewProgressBar } from './UMKMViewProgressBar';
import { UMKMFooter } from './UMKMFooter';
import { UMKMAIChat } from './UMKMAIChat';
import { ViewRotator, nextViewOf } from './ViewRotator';
import { RingkasanView } from './views/RingkasanView';
import { KrisisView } from './views/KrisisView';
import { EdukasiView } from './views/EdukasiView';

type TVDashboardProps = {
  kiosk?: boolean;
  autoRotate?: boolean;
  rotateIntervalMs?: number;
  initialView?: UMKMView;
};

export function TVDashboard({
  kiosk = true,
  autoRotate = true,
  rotateIntervalMs = 75000,
  initialView = 'ringkasan',
}: TVDashboardProps) {
  const [activeView, setActiveView] = useState<UMKMView>(initialView);
  const [timeframe, setTimeframe] = useState('24J');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [rotateProgress, setRotateProgress] = useState(0);
  const [aiAsk, setAiAsk] = useState<string | null>(null);

  const { data, loading, error, lastSyncedAt, refresh } = useUMKMData({
    timeframe,
  });

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
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!kiosk || typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('kiosk') !== '1') return;

    const enter = () => {
      document.documentElement.requestFullscreen?.().catch(() => {});
      window.removeEventListener('click', enter);
      window.removeEventListener('keydown', enter);
    };
    window.addEventListener('click', enter);
    window.addEventListener('keydown', enter);
    return () => {
      window.removeEventListener('click', enter);
      window.removeEventListener('keydown', enter);
    };
  }, [kiosk]);

  const onViewChange = useCallback((view: UMKMView) => setActiveView(view), []);
  const onProgressChange = useCallback((p: number) => setRotateProgress(p), []);
  const onAskAI = useCallback((prompt: string) => setAiAsk(prompt), []);
  const onAiAskConsumed = useCallback(() => setAiAsk(null), []);

  return (
    <div className="umkm-tv-stage" data-dashboard="umkm-tv">
      <div className="umkm-tv-viewport">
        <UMKMHeader
          activeView={activeView}
          onViewChange={onViewChange}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          currentTime={currentTime}
          currentDate={currentDate}
          autoRotate={autoRotate}
          kiosk={kiosk}
          syncStatus={{
            loading,
            error,
            lastSyncedAt,
            onRefresh: refresh,
          }}
        />

        <main className="umkm-tv-main">
          <ViewRotator
            activeView={activeView}
            onViewChange={onViewChange}
            intervalMs={rotateIntervalMs}
            enabled={autoRotate}
            onProgressChange={onProgressChange}
          >
            {(view) => {
              if (view === 'krisis') {
                return <KrisisView data={data} onAskAI={onAskAI} />;
              }
              if (view === 'program') return <EdukasiView data={data} onAskAI={onAskAI} />;
              return (
                <RingkasanView
                  data={data}
                  onOpenWarRoom={() => setActiveView('krisis')}
                  onAskAI={onAskAI}
                />
              );
            }}
          </ViewRotator>
        </main>

        <UMKMTicker items={data.ticker} label="Update" />

        {autoRotate && (
          <UMKMViewProgressBar
            progress={rotateProgress}
            activeView={activeView}
            nextView={nextViewOf(activeView)}
          />
        )}

        <UMKMFooter />

        <UMKMAIChat
          escalation={data.escalation}
          externalAsk={aiAsk}
          onExternalAskConsumed={onAiAskConsumed}
        />
      </div>
    </div>
  );
}
