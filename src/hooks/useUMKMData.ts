'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { UMKM_MOCK } from '@/lib/umkm-mock';
import type { UMKMDashboardData } from '@/types/umkm';
import { REFRESH_INTERVALS } from '@/lib/constants';

export type UMKMApiPayload = UMKMDashboardData & {
  meta?: {
    generatedAt: string;
    timezone: string;
    timeframe: string;
    source: string;
  };
};

type UseUMKMDataOptions = {
  timeframe?: string;
  refreshMs?: number;
  enabled?: boolean;
};

export function useUMKMData(options: UseUMKMDataOptions = {}) {
  const {
    timeframe = '24J',
    refreshMs = REFRESH_INTERVALS.dashboard,
    enabled = true,
  } = options;

  const [data, setData] = useState<UMKMDashboardData>(UMKM_MOCK);
  const [meta, setMeta] = useState<UMKMApiPayload['meta']>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(
        `/api/umkm-data?timeframe=${encodeURIComponent(timeframe)}`,
        { signal: controller.signal, cache: 'no-store' },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as UMKMApiPayload;
      const { meta: nextMeta, ...dashboard } = json;
      setData(dashboard);
      setMeta(nextMeta);
      setLastSyncedAt(new Date());
      setError(null);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError((err as Error).message || 'Failed to load UMKM data');
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    if (!enabled) {
      setData(UMKM_MOCK);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchData();
    const id = setInterval(fetchData, refreshMs);
    return () => {
      clearInterval(id);
      abortRef.current?.abort();
    };
  }, [enabled, fetchData, refreshMs]);

  return {
    data,
    meta,
    loading,
    error,
    lastSyncedAt,
    refresh: fetchData,
  };
}

/** @deprecated Use useUMKMData */
export const useSE2026Data = useUMKMData;
