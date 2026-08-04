'use client';

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { smoothDataset, calculateSeriesAverages, DataPoint } from '@/utils/chartDataProcessor';

/**
 * PREMIUM TV CHART COMPONENT
 * Designed for 10-foot UI (Smart TV Display)
 * 
 * Features:
 * - Moving Average Smoothing (window: 5)
 * - Monotone Cubic Interpolation
 * - Stroke Width: 4px minimum
 * - Area Gradient: 10-20% opacity
 * - Font Size: 20px+ for readability from 3 meters
 */

interface SeriesConfig {
  name: string;
  color: string;
  isPrimary?: boolean; // Untuk line utama yang lebih tebal & ada area fill
}

interface PremiumTVChartProps {
  /**
   * Raw dataset yang "keriting" - akan di-smooth otomatis
   * Format: [{ timestamp: '10:30', Danantara: 85, BCA: 83, ... }]
   */
  rawData: DataPoint[];
  
  /**
   * Konfigurasi series (brands, metrics, dll)
   */
  series: SeriesConfig[];
  
  /**
   * Window size untuk Moving Average (default: 5)
   */
  smoothingWindow?: number;
  
  /**
   * Title chart
   */
  title?: string;
  
  /**
   * Y-axis range
   */
  yAxisRange?: { min: number; max: number };
  
  /**
   * Show grid lines (default: false untuk clean look)
   */
  showGrid?: boolean;
  
  /**
   * Height preset untuk responsive layout
   */
  heightPreset?: 'compact' | 'medium' | 'large';
}

export function PremiumTVChart({
  rawData,
  series,
  smoothingWindow = 5,
  title = 'Trend Analysis',
  yAxisRange = { min: 70, max: 110 },
  showGrid = false,
  heightPreset = 'medium'
}: PremiumTVChartProps) {
  // Apply Moving Average smoothing
  const smoothedData = useMemo(() => {
    if (rawData.length === 0) return [];
    
    const seriesKeys = series.map(s => s.name);
    return smoothDataset(rawData, seriesKeys, smoothingWindow);
  }, [rawData, series, smoothingWindow]);

  // Calculate averages for legend
  const averages = useMemo(() => {
    if (smoothedData.length === 0) return {};
    const seriesKeys = series.map(s => s.name);
    return calculateSeriesAverages(smoothedData, seriesKeys);
  }, [smoothedData, series]);

  // Get primary value (for hero number display)
  const primarySeries = series.find(s => s.isPrimary) || series[0];
  const currentValue = smoothedData.length > 0 
    ? smoothedData[smoothedData.length - 1][primarySeries.name] 
    : 0;

  // Height mapping untuk TV display
  const heightMap = {
    compact: '280px',
    medium: '400px',
    large: '600px'
  };

  const getOption = () => ({
    animation: true,
    animationDuration: 1200,
    animationEasing: 'cubicOut',
    
    grid: {
      top: 60,
      right: 100, // Extra space untuk end labels
      bottom: 60,
      left: 80,
      containLabel: true
    },
    
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(148, 163, 184, 0.3)',
      borderWidth: 1,
      textStyle: { 
        color: '#fff', 
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 18, // TV-friendly size
        fontWeight: 500
      },
      padding: [16, 20],
      axisPointer: {
        type: 'line',
        lineStyle: { 
          color: 'rgba(148, 163, 184, 0.5)', 
          width: 2, 
          type: 'solid' 
        }
      },
      formatter: (params: unknown) => {
        if (!Array.isArray(params)) return '';
        
        const time = (params[0] as { axisValue?: string })?.axisValue || '';
        let html = `<div style="font-size: 16px; opacity: 0.7; margin-bottom: 8px;">${time}</div>`;
        
        params.forEach((param: { value?: number | string; color?: string; seriesName?: string }) => {
          const value = typeof param.value === 'number' 
            ? param.value.toFixed(1) 
            : param.value;
          
          html += `
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
              <span style="display: inline-block; width: 12px; height: 12px; background: ${param.color}; border-radius: 50%;"></span>
              <span style="font-weight: 600; min-width: 100px;">${param.seriesName}</span>
              <span style="font-weight: 700; font-size: 20px;">${value}</span>
            </div>
          `;
        });
        
        return html;
      }
    },
    
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: smoothedData.map(d => d.time || d.timestamp || ''),
      axisLine: { 
        lineStyle: { color: 'rgba(148, 163, 184, 0.2)', width: 2 } 
      },
      axisTick: { 
        show: false 
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 18, // TV-friendly
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 600,
        interval: Math.floor(smoothedData.length / 6), // Show ~6 labels max
        formatter: (value: string) => value
      }
    },
    
    yAxis: {
      type: 'value',
      min: yAxisRange.min,
      max: yAxisRange.max,
      splitLine: { 
        show: showGrid,
        lineStyle: { 
          color: 'rgba(148, 163, 184, 0.1)',
          width: 1,
          type: 'dashed'
        }
      },
      axisLine: {
        show: true,
        lineStyle: { color: 'rgba(148, 163, 184, 0.2)', width: 2 }
      },
      axisTick: { 
        show: false 
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 20, // TV-friendly
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 700,
        margin: 16
      }
    },
    
    series: series.map(seriesConfig => {
      const isPrimary = seriesConfig.isPrimary || false;
      
      return {
        name: seriesConfig.name,
        type: 'line',
        
        // MONOTONE CUBIC INTERPOLATION - garis lengkung smooth
        smooth: true,
        smoothMonotone: 'x', // Prevents overshoot
        
        showSymbol: false,
        sampling: 'lttb', // Downsampling untuk performa
        
        itemStyle: { 
          color: seriesConfig.color 
        },
        
        // STROKE WIDTH - minimal 4px untuk 10-foot UI
        lineStyle: { 
          width: isPrimary ? 6 : 4,
          color: seriesConfig.color,
          // Visual glow untuk primary line
          shadowColor: isPrimary ? `${seriesConfig.color}80` : 'transparent',
          shadowBlur: isPrimary ? 16 : 0,
          shadowOffsetY: isPrimary ? 4 : 0,
          cap: 'round',
          join: 'round',
        },
        
        // AREA GRADIENT - opacity 10-20% untuk primary series
        areaStyle: isPrimary ? {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { 
              offset: 0, 
              color: `${seriesConfig.color}33` // 20% opacity (33 hex)
            },
            { 
              offset: 0.5, 
              color: `${seriesConfig.color}1A` // 10% opacity (1A hex)
            },
            { 
              offset: 1, 
              color: `${seriesConfig.color}00` // 0% opacity
            }
          ])
        } : undefined,
        
        data: smoothedData.map(d => d[seriesConfig.name]),
        
        clip: false,
        
        // End label - badge kecil di ujung line
        endLabel: {
          show: true,
          formatter: '{a}',
          color: '#0f172a',
          fontSize: 16,
          fontWeight: 'bold',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: [6, 12],
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 999,
          borderColor: seriesConfig.color,
          borderWidth: 2,
          distance: 20
        },
        
        // Dot di akhir line untuk emphasis
        markPoint: {
          symbol: 'circle',
          symbolSize: isPrimary ? 16 : 12,
          label: { show: false },
          data: [
            { 
              coord: [
                smoothedData.length - 1, 
                smoothedData[smoothedData.length - 1]?.[seriesConfig.name]
              ],
              itemStyle: {
                color: seriesConfig.color,
                borderColor: '#fff',
                borderWidth: 3,
                shadowColor: seriesConfig.color,
                shadowBlur: 12,
                shadowOffsetY: 4
              }
            }
          ],
          animation: true,
          animationDuration: 800
        }
      };
    })
  });

  if (smoothedData.length === 0) {
    return (
      <div className="h-full w-full glass-spatial rounded-md p-8 flex items-center justify-center">
        <div className="text-slate-400 text-xl font-medium">Loading chart...</div>
      </div>
    );
  }

  return (
    <motion.div 
      className="h-full w-full glass-spatial rounded-md p-8 flex flex-col relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header - TV Optimized */}
      <div className="flex items-start justify-between mb-6 z-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-[#1C1A16] to-[#475569] rounded-md text-white shadow-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#1C1A16] tracking-tight">
              {title}
            </h2>
          </div>
          
          {/* Hero Number */}
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-xl font-semibold text-slate-500">Current</span>
            <span className="text-5xl font-bold text-[#1C1A16] tracking-tight">
              {typeof currentValue === 'number' ? currentValue.toFixed(1) : currentValue}
            </span>
          </div>
        </div>

        {/* Legend - TV Optimized (20px+ font) */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {series.map(s => (
            <div key={s.name} className="flex items-center gap-3">
              <span 
                className="w-4 h-4 rounded-md shadow-md" 
                style={{ backgroundColor: s.color }}
              />
              <span className="text-base font-bold text-slate-700 uppercase tracking-wide">
                {s.name}
              </span>
              <span className="text-lg font-mono font-bold text-slate-900">
                ~{averages[s.name] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full relative z-0" style={{ minHeight: heightMap[heightPreset] }}>
        <ReactECharts 
          option={getOption()} 
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>

      {/* Smoothing Info Badge */}
      <div className="absolute bottom-6 left-8 z-20">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-md border border-slate-200 shadow-sm">
          <span className="text-sm font-semibold text-slate-600">
            Smoothed (MA-{smoothingWindow})
          </span>
        </div>
      </div>

      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent pointer-events-none rounded-md" />
    </motion.div>
  );
}
