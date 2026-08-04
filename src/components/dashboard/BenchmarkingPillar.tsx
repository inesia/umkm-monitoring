'use client';

import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';
import { PieChart, Zap } from 'lucide-react';

const FONT_INTER = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };

export function BenchmarkingPillar() {
  const [data, setData] = useState([
    { value: 45, name: 'Positive' },
    { value: 35, name: 'Neutral' },
    { value: 20, name: 'Negative' }
  ]);
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
      setData(prev => {
        const p = Math.max(30, Math.min(60, prev[0].value + (Math.random() - 0.5) * 5));
        const n = Math.max(10, Math.min(30, prev[2].value + (Math.random() - 0.5) * 3));
        const neu = 100 - p - n;
        return [
          { value: p, name: 'Positive' },
          { value: neu, name: 'Neutral' },
          { value: n, name: 'Negative' }
        ];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getOption = () => {
    // Responsive font sizes untuk donut chart - dikurangi agar tidak kepotong
    const baseFontSize = isLargeScreen ? 11 : 10;
    const valFontSize = isLargeScreen ? 14 : 13;
    const nameFontSize = isLargeScreen ? 9 : 8;
    
    return {
    tooltip: { show: false },
    series: [
      {
        name: 'Sentiment Distribution',
        type: 'pie',
        radius: ['45%', '65%'], // Dikecilkan dari 60-80% agar lebih banyak ruang untuk label
        center: ['50%', '40%'],
        avoidLabelOverlap: true, // Aktifkan untuk mencegah overlap
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: (params: { value: number; name: string }) => `{val|${Math.round(params.value)}}\n{name|${params.name.toUpperCase()}}`,
          fontSize: baseFontSize,
          fontFamily: 'Inter, system-ui, sans-serif',
          rich: {
            val: { fontSize: valFontSize, fontWeight: 700 },
            name: { fontSize: nameFontSize, fontWeight: 600, lineHeight: isLargeScreen ? 14 : 12 }
          }
        },
        labelLine: { 
          show: true, 
          length: isLargeScreen ? 12 : 10, // Diperpanjang agar label lebih jauh
          length2: isLargeScreen ? 6 : 5, 
          smooth: false 
        },
        data: data.map(item => {
          const isPos = item.name === 'Positive';
          const isNeg = item.name === 'Negative';
          const labelColor = isPos ? '#1C1A16' : isNeg ? '#AF261D' : '#64748b';
          return {
            ...item,
            itemStyle: {
              color: isPos ? 'rgba(28, 26, 22, 0.85)' : isNeg ? '#AF261D' : 'rgba(203, 213, 225, 0.9)'
            },
            label: { color: labelColor },
            labelLine: { lineStyle: { color: labelColor } }
          };
        }),
        emphasis: { scale: false, label: { show: false }, itemStyle: {} },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: () => Math.random() * 200
      }
    ]
  };
  };

  return (
    <motion.div
      className="h-full w-full min-h-0 rounded-md flex flex-col items-center justify-between overflow-hidden bg-white border border-gray-200 shadow-sm transition-all duration-300 p-6"
      style={FONT_INTER}
      whileHover={{ y: -2 }}
    >
      <div className="w-full flex items-center justify-between mb-1 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-md bg-gradient-to-br from-red-200/80 to-rose-300/60 shadow-sm">
            <PieChart className="h-3.5 w-3.5 text-red-900/80" />
          </div>
          <h2
            className="dash-section font-semibold uppercase tracking-[0.12em] text-slate-800"
          >
            Live Dist.
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50/80 border border-red-100/60 shadow-sm">
          <Zap className="h-2.5 w-2.5 text-red-700/90 fill-red-700/90 animate-pulse" />
          <span className="dash-meta font-semibold text-red-900/80 uppercase tracking-[0.08em]">Live</span>
        </div>
      </div>

      <div className="flex-1 w-full relative min-h-[18rem] min-w-[15.625rem] flex items-center justify-center">
        {/* Responsive Chart Container - scales dengan container, dengan padding untuk label */}
        <div className="w-full h-full max-w-full mx-auto flex items-center justify-center chart-container" style={{ maxWidth: 'min(100%, 500px)', maxHeight: 'min(100%, 500px)', padding: '0px' }}>
          <ReactECharts
            key={`donut-${isLargeScreen}`}
            option={getOption()}
            style={{ height: '100%', width: '100%', minHeight: '170px' }}
            opts={{ renderer: 'svg' }}
            notMerge={false}
            lazyUpdate={false}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span
              className="dash-meta font-medium uppercase tracking-[0.1em] text-slate-500 block"
              style={{ opacity: 0.6 }}
            >
              Sentiment
            </span>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
