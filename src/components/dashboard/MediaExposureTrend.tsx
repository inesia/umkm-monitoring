'use client';

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import type { BankExposureData } from '@/types/dashboard';
import { generateBankExposureData } from '@/lib/mockData';
import { REFRESH_INTERVALS } from '@/lib/constants';
import { BarChart3, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

export function MediaExposureTrend() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [data, setData] = useState<BankExposureData[]>(() => generateBankExposureData());
  const [lastUpdate, setLastUpdate] = useState<Date | null>(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateBankExposureData());
      setLastUpdate(new Date());
    }, REFRESH_INTERVALS.trend);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const bankNames = data.map(d => d.name);
    const values = data.map(d => d.value);
    const danantaraIndex = bankNames.indexOf('Danantara');

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      grid: {
        left: '8%',
        right: '4%',
        top: '18%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: bankNames,
        axisLine: { lineStyle: { color: '#E5E7EB', width: 2 } },
        axisLabel: { color: '#475569', fontSize: 11, fontWeight: 600 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
        axisLine: { show: false },
        axisLabel: { color: '#64748B', fontSize: 10, fontWeight: 500 },
      },
      series: [{
        name: 'Media Mentions',
        type: 'bar',
        data: values.map((value, idx) => ({
          value,
          itemStyle: {
            color: idx === danantaraIndex
              ? '#AF261D' // National Flag Red
              : '#64748B', // Slate 500
            borderRadius: [4, 4, 0, 0],
            shadowBlur: 0,
          },
        })),
        barWidth: '55%',
        label: {
          show: true,
          position: 'top',
          color: '#1C1A16', /* Dark Charcoal */
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
        },
      }],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        textStyle: { color: '#1C1A16', fontSize: 12, fontFamily: 'Inter, sans-serif' },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);',
      },
      animationDuration: 1000,
    };

    chartInstance.current.setOption(option, true);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  return (
    <div className="h-full bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-gray-50 border border-gray-100">
              <BarChart3 className="h-6 w-6 text-slate-800" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1C1A16] uppercase tracking-wide">
                Media Exposure
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                Danantara vs Top 10 Banks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white">
              <Radio className="h-3 w-3 text-red-700 animate-pulse" />
              <span className="text-xs font-bold text-red-700 uppercase">LIVE</span>
            </div>
            <span className="text-xs text-slate-500 font-bold" suppressHydrationWarning>
              {lastUpdate?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) || '--:--:--'}
            </span>
          </div>
        </div>
        <motion.div 
          ref={chartRef} 
          className="w-full h-[350px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      </div>
    </div>
  );
}
