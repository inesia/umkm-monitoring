import { UMKM_MOCK } from '@/lib/umkm-mock';
import type { UMKMDashboardData, UMKMKPI } from '@/types/umkm';

function jitterInt(base: number, pct = 0.02): number {
  const delta = base * pct * (Math.random() * 2 - 1);
  return Math.max(0, Math.round(base + delta));
}

function formatId(n: number): string {
  return n.toLocaleString('id-ID');
}

function parseMentions(value: string): number {
  return Number(value.replace(/\./g, '').replace(/,/g, '')) || 0;
}

function liveKpis(kpis: UMKMKPI[]): UMKMKPI[] {
  return kpis.map((kpi) => {
    if (kpi.id === 'volume' || kpi.id === 'mentions') {
      const n = jitterInt(parseMentions(kpi.value), 0.015);
      if (!Number.isFinite(n) || n === 0) return kpi;
      return { ...kpi, value: formatId(n) };
    }
    return kpi;
  });
}

/** Build a fresh dashboard payload (optionally with live jitter). */
export function buildUMKMPayload(options?: {
  live?: boolean;
  timeframe?: string;
}): UMKMDashboardData & {
  meta: {
    generatedAt: string;
    timezone: string;
    timeframe: string;
    source: 'mock' | 'live-mock';
  };
} {
  const live = options?.live ?? true;
  const timeframe = options?.timeframe ?? '24J';
  const base = structuredClone(UMKM_MOCK);

  if (live) {
    base.kpis = liveKpis(base.kpis);
    base.programKpis = liveKpis(base.programKpis);
    base.crisisKpis = liveKpis(base.crisisKpis);

    const elapsed = Math.floor(Math.random() * 45);
    base.escalation.slaSeconds = Math.max(0, base.escalation.slaSeconds - elapsed);

    const wobble = Math.round((Math.random() - 0.5) * 2);
    base.sentiment = {
      ...base.sentiment,
      net: base.sentiment.net + wobble,
      neg: Math.min(40, Math.max(18, base.sentiment.neg + wobble)),
      pos: Math.min(45, Math.max(28, base.sentiment.pos - wobble)),
    };

    base.mapBubbles = base.mapBubbles.map((b) => ({
      ...b,
      volume: jitterInt(b.volume, 0.03),
    }));
    base.mapTop = base.mapBubbles
      .slice()
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);
  }

  return {
    ...base,
    meta: {
      generatedAt: new Date().toISOString(),
      timezone: 'Asia/Jakarta',
      timeframe,
      source: live ? 'live-mock' : 'mock',
    },
  };
}
