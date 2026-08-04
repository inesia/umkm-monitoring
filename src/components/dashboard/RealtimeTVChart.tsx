'use client';

import { useEffect, useState, useCallback } from 'react';
import { PremiumTVChart } from './PremiumTVChart';
import { DataPoint } from '@/utils/chartDataProcessor';

/**
 * REALTIME TV CHART EXAMPLE
 * 
 * Shows how to integrate PremiumTVChart with:
 * - Real-time API data
 * - Auto-refresh
 * - Data point limiting (keep last N points)
 * - Error handling
 * - Loading states
 */

interface RealtimeTVChartProps {
  /**
   * API endpoint untuk fetch data
   * Expected response format: { timestamp: string, [metric]: number }
   */
  apiEndpoint: string;
  
  /**
   * Series configuration
   */
  series: Array<{ name: string; color: string; isPrimary?: boolean }>;
  
  /**
   * Refresh interval dalam milliseconds (default: 60000 = 1 menit)
   */
  refreshInterval?: number;
  
  /**
   * Max data points to keep (default: 60)
   */
  maxDataPoints?: number;
  
  /**
   * Chart title
   */
  title?: string;
  
  /**
   * Y-axis range
   */
  yAxisRange?: { min: number; max: number };
  
  /**
   * Height preset
   */
  heightPreset?: 'compact' | 'medium' | 'large';
}

export function RealtimeTVChart({
  apiEndpoint,
  series,
  refreshInterval = 60000,
  maxDataPoints = 60,
  title = 'Real-time Metrics',
  yAxisRange = { min: 0, max: 100 },
  heightPreset = 'medium'
}: RealtimeTVChartProps) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  /**
   * Fetch data dari API
   */
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      const response = await fetch(apiEndpoint);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const newPoint = await response.json();
      
      // Validate data point
      const hasAllSeries = series.every(s => s.name in newPoint);
      if (!hasAllSeries) {
        throw new Error('Missing series in API response');
      }
      
      // Add timestamp jika belum ada
      if (!newPoint.time && !newPoint.timestamp) {
        newPoint.time = new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }
      
      // Update data (keep last N points)
      setData(prev => {
        const updated = [...prev, newPoint];
        return updated.slice(-maxDataPoints);
      });
      
      setLastUpdate(new Date());
      setIsLoading(false);
      
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }, [apiEndpoint, series, maxDataPoints]);

  /**
   * Initial load + auto-refresh
   */
  useEffect(() => {
    // Initial fetch
    fetchData();
    
    // Setup interval
    const interval = setInterval(fetchData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  /**
   * Loading state
   */
  if (isLoading && data.length === 0) {
    return (
      <div className="h-full w-full glass-spatial rounded-md p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-md h-12 w-12 border-b-2 border-[#1C1A16] mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-slate-600">Loading data...</div>
        </div>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error && data.length === 0) {
    return (
      <div className="h-full w-full glass-spatial rounded-md p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <div className="text-xl font-semibold text-slate-900 mb-2">Failed to load data</div>
          <div className="text-sm text-slate-600 mb-4">{error}</div>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-[#1C1A16] text-white rounded-md font-semibold hover:bg-black transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Chart */}
      <PremiumTVChart
        rawData={data}
        series={series}
        smoothingWindow={5}
        title={title}
        yAxisRange={yAxisRange}
        heightPreset={heightPreset}
      />
      
      {/* Live Indicator */}
      <div className="absolute top-8 right-8 z-30">
        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-md shadow-sm border border-slate-200">
          {/* Pulse dot */}
          <div className="relative">
            <div className="w-3 h-3 bg-[#1C1A16] rounded-md"></div>
            <div className="absolute inset-0 w-3 h-3 bg-[#1C1A16] rounded-md animate-ping opacity-75"></div>
          </div>
          
          <div className="text-sm">
            <div className="font-bold text-slate-900">LIVE</div>
            {lastUpdate && (
              <div className="text-xs text-slate-600">
                {lastUpdate.toLocaleTimeString('id-ID', { hour12: false })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Error overlay (non-blocking) */}
      {error && data.length > 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg shadow-sm">
            <div className="text-sm text-red-800 font-semibold">
              ⚠️ Update failed: {error}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * USAGE EXAMPLES
 */

// Example 1: Simple sentiment monitoring
export function SentimentMonitorTV() {
  return (
    <RealtimeTVChart
      apiEndpoint="/api/sentiment/current"
      series={[
        { name: 'Positive', color: '#10b981', isPrimary: true },
        { name: 'Neutral', color: '#6b7280' },
        { name: 'Negative', color: '#ef4444' }
      ]}
      title="Sentiment Real-time"
      yAxisRange={{ min: 0, max: 100 }}
      heightPreset="large"
      refreshInterval={60000}
      maxDataPoints={60}
    />
  );
}

// Example 2: Brand performance tracking
export function BrandPerformanceTV() {
  return (
    <RealtimeTVChart
      apiEndpoint="/api/brands/performance"
      series={[
        { name: 'Danantara', color: '#AF261D', isPrimary: true },
        { name: 'BCA', color: '#475569' },
        { name: 'Mandiri', color: '#64748B' },
        { name: 'BRI', color: '#94A3B8' }
      ]}
      title="Brand Performance Index"
      yAxisRange={{ min: 70, max: 110 }}
      heightPreset="medium"
      refreshInterval={120000} // 2 minutes
      maxDataPoints={100}
    />
  );
}

// Example 3: System metrics
export function SystemMetricsTV() {
  return (
    <RealtimeTVChart
      apiEndpoint="/api/system/metrics"
      series={[
        { name: 'CPU', color: '#3b82f6', isPrimary: true },
        { name: 'Memory', color: '#8b5cf6' },
        { name: 'Network', color: '#06b6d4' }
      ]}
      title="System Performance"
      yAxisRange={{ min: 0, max: 100 }}
      heightPreset="compact"
      refreshInterval={5000} // 5 seconds
      maxDataPoints={120} // 10 minutes at 5s interval
    />
  );
}
