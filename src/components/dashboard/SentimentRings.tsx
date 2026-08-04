'use client';

import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { motion } from 'framer-motion';

const FONT_INTER = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };

// STATIC DATA untuk presentasi - kurva sudah didesign smooth & landai
const COMPETITORS = [
  { name: 'Danantara', color: '#AF261D', avg: 92 },
  { name: 'Pertamina', color: '#94A3B8', avg: 87 },
  { name: 'PLN', color: '#64748B', avg: 83 },
  { name: 'Telkom', color: '#475569', avg: 89 },
  { name: 'MIND ID', color: '#334155', avg: 86 },
  { name: 'Mandiri', color: '#CBD5E1', avg: 84 },
  { name: 'BRI', color: '#E2E8F0', avg: 85 },
];

const STATIC_DATA = [
  { Danantara: 85, Pertamina: 82, PLN: 78, Telkom: 84, 'MIND ID': 81, Mandiri: 80, BRI: 79 },
  { Danantara: 86, Pertamina: 83, PLN: 79, Telkom: 85, 'MIND ID': 82, Mandiri: 81, BRI: 80 },
  { Danantara: 88, Pertamina: 84, PLN: 80, Telkom: 87, 'MIND ID': 83, Mandiri: 82, BRI: 81 },
  { Danantara: 90, Pertamina: 85, PLN: 81, Telkom: 90, 'MIND ID': 84, Mandiri: 82, BRI: 81 },
  { Danantara: 91, Pertamina: 86, PLN: 82, Telkom: 93, 'MIND ID': 85, Mandiri: 83, BRI: 82 },
  { Danantara: 93, Pertamina: 87, PLN: 83, Telkom: 96, 'MIND ID': 86, Mandiri: 84, BRI: 83 },
  { Danantara: 95, Pertamina: 88, PLN: 84, Telkom: 99, 'MIND ID': 87, Mandiri: 85, BRI: 84 },
  { Danantara: 96, Pertamina: 89, PLN: 85, Telkom: 102, 'MIND ID': 88, Mandiri: 86, BRI: 85 },
  { Danantara: 98, Pertamina: 90, PLN: 86, Telkom: 105, 'MIND ID': 89, Mandiri: 87, BRI: 86 },
  { Danantara: 99, Pertamina: 91, PLN: 87, Telkom: 107, 'MIND ID': 90, Mandiri: 88, BRI: 87 },
  { Danantara: 100, Pertamina: 92, PLN: 88, Telkom: 108, 'MIND ID': 91, Mandiri: 89, BRI: 88 },
  { Danantara: 101, Pertamina: 93, PLN: 89, Telkom: 109, 'MIND ID': 91, Mandiri: 90, BRI: 89 },
  { Danantara: 102, Pertamina: 93, PLN: 90, Telkom: 108, 'MIND ID': 92, Mandiri: 90, BRI: 89 },
  { Danantara: 102, Pertamina: 94, PLN: 90, Telkom: 106, 'MIND ID': 92, Mandiri: 91, BRI: 90 },
  { Danantara: 103, Pertamina: 94, PLN: 91, Telkom: 104, 'MIND ID': 92, Mandiri: 91, BRI: 90 },
  { Danantara: 103, Pertamina: 94, PLN: 91, Telkom: 101, 'MIND ID': 92, Mandiri: 91, BRI: 91 },
  { Danantara: 103, Pertamina: 94, PLN: 91, Telkom: 98, 'MIND ID': 92, Mandiri: 91, BRI: 91 },
  { Danantara: 103, Pertamina: 93, PLN: 91, Telkom: 96, 'MIND ID': 91, Mandiri: 91, BRI: 91 },
  { Danantara: 102, Pertamina: 93, PLN: 91, Telkom: 95, 'MIND ID': 91, Mandiri: 91, BRI: 91 },
  { Danantara: 102, Pertamina: 92, PLN: 91, Telkom: 94, 'MIND ID': 90, Mandiri: 90, BRI: 91 },
  { Danantara: 101, Pertamina: 92, PLN: 90, Telkom: 93, 'MIND ID': 90, Mandiri: 90, BRI: 91 },
  { Danantara: 100, Pertamina: 91, PLN: 90, Telkom: 92, 'MIND ID': 89, Mandiri: 89, BRI: 90 },
  { Danantara: 99, Pertamina: 90, PLN: 89, Telkom: 91, 'MIND ID': 88, Mandiri: 88, BRI: 90 },
  { Danantara: 98, Pertamina: 89, PLN: 89, Telkom: 91, 'MIND ID': 87, Mandiri: 87, BRI: 89 },
  { Danantara: 97, Pertamina: 88, PLN: 88, Telkom: 90, 'MIND ID': 86, Mandiri: 86, BRI: 88 },
  { Danantara: 95, Pertamina: 87, PLN: 87, Telkom: 90, 'MIND ID': 85, Mandiri: 85, BRI: 87 },
  { Danantara: 94, Pertamina: 86, PLN: 86, Telkom: 89, 'MIND ID': 84, Mandiri: 84, BRI: 86 },
  { Danantara: 92, Pertamina: 85, PLN: 85, Telkom: 88, 'MIND ID': 83, Mandiri: 83, BRI: 85 },
  { Danantara: 90, Pertamina: 84, PLN: 84, Telkom: 88, 'MIND ID': 82, Mandiri: 82, BRI: 84 },
  { Danantara: 89, Pertamina: 83, PLN: 83, Telkom: 87, 'MIND ID': 81, Mandiri: 81, BRI: 83 },
  { Danantara: 87, Pertamina: 82, PLN: 82, Telkom: 86, 'MIND ID': 80, Mandiri: 80, BRI: 82 },
  { Danantara: 86, Pertamina: 81, PLN: 81, Telkom: 85, 'MIND ID': 79, Mandiri: 79, BRI: 81 },
  { Danantara: 84, Pertamina: 80, PLN: 80, Telkom: 85, 'MIND ID': 78, Mandiri: 78, BRI: 80 },
  { Danantara: 83, Pertamina: 79, PLN: 79, Telkom: 84, 'MIND ID': 77, Mandiri: 77, BRI: 79 },
  { Danantara: 82, Pertamina: 79, PLN: 78, Telkom: 83, 'MIND ID': 77, Mandiri: 77, BRI: 78 },
  { Danantara: 81, Pertamina: 78, PLN: 78, Telkom: 82, 'MIND ID': 76, Mandiri: 76, BRI: 78 },
  { Danantara: 81, Pertamina: 78, PLN: 77, Telkom: 82, 'MIND ID': 76, Mandiri: 76, BRI: 77 },
  { Danantara: 81, Pertamina: 78, PLN: 77, Telkom: 81, 'MIND ID': 76, Mandiri: 76, BRI: 77 },
  { Danantara: 81, Pertamina: 78, PLN: 77, Telkom: 81, 'MIND ID': 76, Mandiri: 76, BRI: 77 },
  { Danantara: 81, Pertamina: 78, PLN: 77, Telkom: 80, 'MIND ID': 76, Mandiri: 76, BRI: 77 },
  { Danantara: 81, Pertamina: 78, PLN: 77, Telkom: 80, 'MIND ID': 76, Mandiri: 76, BRI: 78 },
  { Danantara: 82, Pertamina: 79, PLN: 78, Telkom: 81, 'MIND ID': 77, Mandiri: 77, BRI: 78 },
  { Danantara: 83, Pertamina: 79, PLN: 78, Telkom: 81, 'MIND ID': 78, Mandiri: 78, BRI: 79 },
  { Danantara: 84, Pertamina: 80, PLN: 79, Telkom: 82, 'MIND ID': 79, Mandiri: 79, BRI: 80 },
  { Danantara: 85, Pertamina: 81, PLN: 80, Telkom: 83, 'MIND ID': 80, Mandiri: 80, BRI: 81 },
  { Danantara: 86, Pertamina: 82, PLN: 81, Telkom: 84, 'MIND ID': 81, Mandiri: 81, BRI: 82 },
  { Danantara: 87, Pertamina: 83, PLN: 82, Telkom: 85, 'MIND ID': 82, Mandiri: 82, BRI: 83 },
  { Danantara: 89, Pertamina: 84, PLN: 83, Telkom: 86, 'MIND ID': 83, Mandiri: 83, BRI: 84 },
  { Danantara: 90, Pertamina: 85, PLN: 84, Telkom: 87, 'MIND ID': 84, Mandiri: 84, BRI: 85 },
  { Danantara: 92, Pertamina: 86, PLN: 85, Telkom: 88, 'MIND ID': 85, Mandiri: 85, BRI: 86 },
  { Danantara: 94, Pertamina: 87, PLN: 86, Telkom: 89, 'MIND ID': 86, Mandiri: 86, BRI: 87 },
  { Danantara: 95, Pertamina: 88, PLN: 87, Telkom: 90, 'MIND ID': 87, Mandiri: 87, BRI: 88 },
  { Danantara: 97, Pertamina: 89, PLN: 88, Telkom: 91, 'MIND ID': 88, Mandiri: 88, BRI: 89 },
  { Danantara: 98, Pertamina: 90, PLN: 89, Telkom: 92, 'MIND ID': 89, Mandiri: 89, BRI: 90 },
  { Danantara: 100, Pertamina: 91, PLN: 90, Telkom: 93, 'MIND ID': 90, Mandiri: 90, BRI: 91 },
  { Danantara: 101, Pertamina: 92, PLN: 91, Telkom: 94, 'MIND ID': 91, Mandiri: 91, BRI: 92 },
  { Danantara: 102, Pertamina: 93, PLN: 92, Telkom: 94, 'MIND ID': 92, Mandiri: 92, BRI: 92 },
  { Danantara: 103, Pertamina: 94, PLN: 93, Telkom: 95, 'MIND ID': 93, Mandiri: 93, BRI: 93 },
  { Danantara: 104, Pertamina: 94, PLN: 94, Telkom: 95, 'MIND ID': 93, Mandiri: 93, BRI: 94 },
  { Danantara: 105, Pertamina: 95, PLN: 94, Telkom: 96, 'MIND ID': 94, Mandiri: 94, BRI: 94 },
  { Danantara: 106, Pertamina: 95, PLN: 95, Telkom: 96, 'MIND ID': 95, Mandiri: 95, BRI: 95 },
];

const DOWNSAMPLE_STEP = 10;

function getInitialChartData(): { time: string; [key: string]: number | string }[] {
  const now = new Date();
  const points: { time: string; [key: string]: number | string }[] = [];
  STATIC_DATA.forEach((dataPoint, i) => {
    const time = new Date(now.getTime() - (STATIC_DATA.length - i - 1) * 60000).toLocaleTimeString('id-ID', { hour12: false });
    points.push({ time, ...dataPoint });
  });
  return points.filter((_, i) => i % DOWNSAMPLE_STEP === 0);
}

export function SentimentRings() {
  const [chartData, setChartData] = useState<{ time: string; [key: string]: number | string }[]>(getInitialChartData);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [danantaraPulse, setBniPulse] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Track window size untuk responsive font sizes
  useEffect(() => {
    const checkSize = () => {
      setIsLargeScreen(window.innerWidth >= 1280);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prevData => {
        if (prevData.length === 0) return prevData;

        const updated = [...prevData];
        const lastIndex = updated.length - 1;
        const lastPoint = { ...updated[lastIndex] };

        COMPETITORS.forEach(comp => {
          const currentValue = lastPoint[comp.name] as number;
          if (typeof currentValue === 'number') {
            const offset = (Math.random() * 4) - 2;
            const newValue = Math.max(70, Math.min(110, currentValue + offset));
            lastPoint[comp.name] = Math.round(newValue * 10) / 10;
          }
        });

        updated[lastIndex] = lastPoint;
        setLastUpdate(new Date());
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setBniPulse(prev => !prev);
    }, 1500);

    return () => clearInterval(pulseInterval);
  }, []);

  const getOption = () => {
    // Responsive font sizes based on viewport
    const baseFontSize = isLargeScreen ? 12 : 11;
    const labelFontSize = isLargeScreen ? 10 : 9;
    const gridRight = isLargeScreen ? 70 : 60;
    
    return {
    animation: true,
    animationDuration: 2000,
    animationEasing: 'ease-in-out',
    grid: {
      top: 10,
      right: gridRight,
      bottom: 10,
      left: 10,
      containLabel: false
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: 'rgba(226, 232, 240, 0.8)',
      textStyle: { color: '#1e293b', fontFamily: 'Inter, system-ui, sans-serif', fontSize: baseFontSize },
      padding: [8, 12],
      axisPointer: {
        type: 'line',
        lineStyle: { color: '#cbd5e1', width: 1, type: 'solid' }
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.map(d => d.time),
      show: false
    },
    yAxis: {
      type: 'value',
      min: 70,
      max: 110,
      splitLine: { show: false },
      axisLabel: { show: false }
    },
    series: COMPETITORS.map(comp => ({
      name: comp.name,
      type: 'line',
      smooth: true,
      smoothMonotone: 'x',
      showSymbol: false,
      itemStyle: { color: comp.color },
      clip: false,
      lineStyle: { 
        width: comp.name === 'Danantara' ? 5 : 4,
        shadowColor: comp.name === 'Danantara' ? 'rgba(28, 26, 22, 0.4)' : undefined,
        shadowBlur: comp.name === 'Danantara' ? 16 : 0,
        shadowOffsetY: comp.name === 'Danantara' ? 3 : 0,
        cap: 'round',
        join: 'round',
      },
      areaStyle: undefined, // Tidak ada gradasi, hanya line saja
      data: chartData.map(d => d[comp.name]),
      endLabel: {
        show: true,
        formatter: (params: { seriesName?: string }) => params.seriesName ?? '',
        color: '#0f172a',
        fontSize: labelFontSize,
        fontWeight: 600,
        padding: [2, 6],
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 999,
        borderColor: comp.color,
        borderWidth: 1.5,
      },
      markPoint: {
        symbol: 'circle',
        symbolSize: comp.name === 'Danantara' ? (isLargeScreen ? 16 : 14) : (isLargeScreen ? 8 : 7),
        label: { show: false },
        data: [
          { 
             coord: [chartData.length - 1, chartData[chartData.length - 1]?.[comp.name]],
             itemStyle: {
                color: comp.color,
                borderColor: '#fff',
                borderWidth: comp.name === 'Danantara' ? (isLargeScreen ? 3.5 : 3) : (isLargeScreen ? 2.5 : 2),
                shadowColor: comp.name === 'Danantara' ? comp.color : comp.color,
                shadowBlur: comp.name === 'Danantara' ? (danantaraPulse ? 24 : 12) : 4,
                shadowOffsetY: 0
             }
          }
        ]
      }
    }))
  };
  };

  const currentDanantara = chartData.length > 0 ? (chartData[chartData.length - 1]['Danantara'] as number) : 0;

  return (
    <motion.div 
      className="h-full w-full bg-white border border-gray-200 rounded-md p-4 flex flex-col relative overflow-hidden"
      style={FONT_INTER}
    >
      {/* Unified Header */}
      <div className="flex items-start justify-between mb-2.5 relative z-10">
        <div>
          <span
            className="dash-section font-medium uppercase tracking-[0.1em] text-slate-800 block mb-1.5"
          >
            Portfolio Exposure
          </span>
          <div className="flex items-baseline gap-2">
            <span className="dash-num-xl font-semibold tracking-[-0.02em] text-[#1C1A16] leading-none tabular-nums" style={FONT_INTER}>
              {currentDanantara}
            </span>
            <span className="dash-meta font-medium text-slate-500" style={{ opacity: 0.6 }}>Media Mentions</span>
          </div>
        </div>

        {/* Compact Legend Pills (Top Right) */}
        <div className="flex flex-wrap gap-1.5 max-w-[280px] justify-end">
           {COMPETITORS.map(comp => (
              <div key={comp.name} className="flex items-center gap-1 bg-white/60 px-2 py-0.5 rounded-md border border-slate-200/60">
                 <span className="w-1.5 h-1.5 rounded-md" style={{ backgroundColor: comp.color }}></span>
                 <span className="dash-meta font-semibold text-slate-700">{comp.name}</span>
                 <span className="dash-meta font-mono text-slate-500">{comp.avg}</span>
              </div>
           ))}
        </div>
      </div>

      {/* Chart - Responsive container untuk 1440x900 dan layar lainnya */}
      <div className="flex-1 w-full flex items-center justify-center relative z-0 animate-float min-h-0">
        <div className="w-full h-full max-w-full mx-auto chart-container" style={{ maxHeight: '100%', aspectRatio: '16/9' }}>
          <ReactECharts
            key={`chart-${isLargeScreen}`}
            option={getOption()}
            style={{ height: '100%', width: '100%', minHeight: '200px' }}
            opts={{ renderer: 'svg' }}
            notMerge={false}
            lazyUpdate={false}
          />
        </div>
      </div>

      {/* Market Sentiment Summary - Bottom-Left Corner (subtle insight) */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-none max-w-[55%]">
        <p 
          className="dash-meta leading-snug tracking-wide text-slate-400"
          style={{ fontFamily: 'Inter, system-ui, sans-serif', opacity: 0.7 }}
        >
          Danantara maintains lead in Portfolio Engagement (↑ 4.2%) while Pertamina gains in Sector Stability
        </p>
      </div>

      {/* Live Feed Indicator (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-20">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-200/50 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-md bg-[#1C1A16] animate-pulse"></div>
          <span className="dash-meta font-medium text-slate-600">
            Live · {lastUpdate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
