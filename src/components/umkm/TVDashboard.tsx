'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { UMKMView } from '@/types/umkm';
import { useUMKMData } from '@/hooks/useUMKMData';
import { UMKMHeader } from './UMKMHeader';
import { UMKMTicker } from './UMKMTicker';
import { UMKMFooter } from './UMKMFooter';
import { UMKMAIChat } from './UMKMAIChat';
import { ViewRotator, nextViewOf } from './ViewRotator';
import { MenteriView } from './views/MenteriView';
import { KrisisView } from './views/KrisisView';
import { ProgramView } from './views/ProgramView';
import { MobileRotatePrompt } from './MobileRotatePrompt';
import { PreSwitchToast } from './PreSwitchToast';

const TV_W = 1920;
const TV_H = 1080;

type TVDashboardProps = {
  kiosk?: boolean;
  autoRotate?: boolean;
  rotateIntervalMs?: number;
  initialView?: UMKMView;
};

export function TVDashboard({
  kiosk = true,
  autoRotate: autoRotateProp = true,
  rotateIntervalMs = 75000,
  initialView = 'menteri',
}: TVDashboardProps) {
  const [activeView, setActiveView] = useState<UMKMView>(initialView);
  const [isAutoRotate, setIsAutoRotate] = useState(autoRotateProp);
  const [isMouseHovered, setIsMouseHovered] = useState(false);
  const [timeframe, setTimeframe] = useState('24J');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [rotateProgress, setRotateProgress] = useState(0);
  const [aiAsk, setAiAsk] = useState<string | null>(null);
  const [tvScale, setTvScale] = useState(1);
  const [tvDimensions, setTvDimensions] = useState({ w: TV_W, h: TV_H });
  const stageRef = useRef<HTMLDivElement>(null);

  const { data, loading, error, lastSyncedAt, refresh } = useUMKMData({
    timeframe,
  });

  // Keyboard & TV Remote controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' || e.code === 'KeyP' || e.code === 'MediaPlayPause') {
        e.preventDefault();
        setIsAutoRotate((prev) => !prev);
      } else if (e.code === 'ArrowRight' || e.code === 'PageDown') {
        e.preventDefault();
        setActiveView((curr) => nextViewOf(curr));
      } else if (e.code === 'ArrowLeft' || e.code === 'PageUp') {
        e.preventDefault();
        setActiveView((curr) => {
          const order: UMKMView[] = ['menteri', 'program', 'krisis'];
          const idx = order.indexOf(curr);
          return order[(idx - 1 + order.length) % order.length];
        });
      } else if (e.key === '1') {
        setActiveView('menteri');
      } else if (e.key === '2') {
        setActiveView('program');
      } else if (e.key === '3') {
        setActiveView('krisis');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  /* Dynamic viewport scaling — full width & height without stretch */
  useEffect(() => {
    const fit = () => {
      const stage = stageRef.current;
      const w = stage?.clientWidth || window.innerWidth;
      const h = stage?.clientHeight || window.innerHeight;
      if (!w || !h) return;

      const baseScale = Math.min(w / TV_W, h / TV_H);
      const scale = Number.isFinite(baseScale) && baseScale > 0 ? baseScale : 1;

      setTvScale(scale);
      setTvDimensions({
        w: Math.max(TV_W, w / scale),
        h: Math.max(TV_H, h / scale),
      });
    };
    fit();
    window.addEventListener('resize', fit);
    document.addEventListener('fullscreenchange', fit);
    const el = stageRef.current;
    const ro = typeof ResizeObserver !== 'undefined' && el
      ? new ResizeObserver(fit)
      : null;
    if (el && ro) ro.observe(el);
    return () => {
      window.removeEventListener('resize', fit);
      document.removeEventListener('fullscreenchange', fit);
      ro?.disconnect();
    };
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
    <div className="umkm-tv-stage" data-dashboard="umkm-tv" ref={stageRef}>
      <div
        className="umkm-tv-viewport"
        style={{
          width: tvDimensions.w,
          height: tvDimensions.h,
          transform: `translate(-50%, -50%) scale(${tvScale})`,
          transformOrigin: 'center center',
        }}
      >
        <UMKMHeader
          activeView={activeView}
          onViewChange={onViewChange}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          currentTime={currentTime}
          currentDate={currentDate}
          autoRotate={isAutoRotate}
          onAutoRotateToggle={() => setIsAutoRotate((p) => !p)}
          kiosk={kiosk}
          syncStatus={{
            loading,
            error,
            lastSyncedAt,
            onRefresh: refresh,
          }}
        />

        <main
          className="umkm-tv-main"
          onMouseEnter={() => setIsMouseHovered(true)}
          onMouseLeave={() => setIsMouseHovered(false)}
        >
          <ViewRotator
            activeView={activeView}
            onViewChange={onViewChange}
            intervalMs={rotateIntervalMs}
            enabled={isAutoRotate && !isMouseHovered}
            onProgressChange={onProgressChange}
          >
            {(view) => {
              if (view === 'krisis') {
                return <KrisisView data={data} onAskAI={onAskAI} />;
              }
              if (view === 'program') {
                return <ProgramView data={data} onAskAI={onAskAI} />;
              }
              return <MenteriView data={data} onAskAI={onAskAI} />;
            }}
          </ViewRotator>
        </main>

        <UMKMTicker items={data.ticker} label="Update" />

        <UMKMFooter
          showProgress={isAutoRotate && !isMouseHovered}
          progress={rotateProgress}
          activeView={activeView}
          nextView={nextViewOf(activeView)}
          autoRotate={isAutoRotate}
          onToggleAutoRotate={() => setIsAutoRotate((p) => !p)}
          onPrevView={() => {
            const order: UMKMView[] = ['menteri', 'program', 'krisis'];
            const idx = order.indexOf(activeView);
            setActiveView(order[(idx - 1 + order.length) % order.length]);
          }}
          onNextView={() => setActiveView(nextViewOf(activeView))}
        />

        <UMKMAIChat
          escalation={data.escalation}
          externalAsk={aiAsk}
          onExternalAskConsumed={onAiAskConsumed}
        />

        {/* 5-second warning toast before tab switch */}
        <PreSwitchToast
          show={isAutoRotate && !isMouseHovered && rotateProgress >= 93}
          nextView={nextViewOf(activeView)}
          progress={rotateProgress}
          onPause={() => setIsAutoRotate(false)}
        />
      </div>

      <MobileRotatePrompt />
    </div>
  );
}
