'use client';

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import type { SentimentData } from '@/types/dashboard';
import { generateSentimentData } from '@/lib/mockData';
import { REFRESH_INTERVALS } from '@/lib/constants';
import { Heart, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function ReputationSuite() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [sentimentData, setSentimentData] = useState<{ danantara: SentimentData; danantaraGroup: SentimentData } | null>(() => generateSentimentData());

  useEffect(() => {
    const interval = setInterval(() => {
      setSentimentData(generateSentimentData());
    }, REFRESH_INTERVALS.sentiment);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!chartRef.current || !sentimentData) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#E5E7EB',
        textStyle: { color: '#1C1A16', fontFamily: 'Inter, sans-serif' },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);',
      },
      legend: {
        bottom: '5%',
        left: 'center',
        textStyle: { color: '#475569', fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif' },
        itemWidth: 12,
        itemHeight: 12,
      },
      series: [
        {
          name: 'Danantara',
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['25%', '45%'],
          label: { show: true, color: '#1C1A16', fontSize: 11, fontWeight: 700, formatter: '{d}%', fontFamily: 'Inter, sans-serif' },
          itemStyle: { borderRadius: 4, borderColor: '#FFFFFF', borderWidth: 2 },
          emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.1)' } },
          data: [
            { value: sentimentData.danantara.positive, name: 'Positive', itemStyle: { color: '#1C1A16' } },
            { value: sentimentData.danantara.neutral, name: 'Neutral', itemStyle: { color: '#94A3B8' } },
            { value: sentimentData.danantara.negative, name: 'Negative', itemStyle: { color: '#AF261D' } },
          ],
        },
        {
          name: 'Danantara Group',
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['75%', '45%'],
          label: { show: true, color: '#1C1A16', fontSize: 11, fontWeight: 700, formatter: '{d}%', fontFamily: 'Inter, sans-serif' },
          itemStyle: { borderRadius: 4, borderColor: '#FFFFFF', borderWidth: 2 },
          emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.1)' } },
          data: [
            { value: sentimentData.danantaraGroup.positive, name: 'Positive', itemStyle: { color: '#1C1A16' } },
            { value: sentimentData.danantaraGroup.neutral, name: 'Neutral', itemStyle: { color: '#94A3B8' } },
            { value: sentimentData.danantaraGroup.negative, name: 'Negative', itemStyle: { color: '#AF261D' } },
          ],
        },
      ],
    };

    chartInstance.current.setOption(option, true);
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sentimentData]);

  if (!sentimentData) return null;

  const danantaraScore = sentimentData.danantara.positive - sentimentData.danantara.negative;
  const groupScore = sentimentData.danantaraGroup.positive - sentimentData.danantaraGroup.negative;

  return (
    <div className="h-full bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-gray-50 border border-gray-100 shadow-sm">
              <Heart className="h-5 w-5 text-slate-800" />
            </div>
            <h2 className="text-lg font-bold text-[#1C1A16] uppercase tracking-wider">
              Reputation Suite
            </h2>
          </div>
          
          {/* Score Cards */}
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm">
              <span className="text-xs text-slate-500 font-bold mr-2">Danantara</span>
              <span className={`text-lg font-bold ${danantaraScore > 0 ? 'text-[#1C1A16]' : 'text-[#AF261D]'}`}>
                {danantaraScore > 0 ? '+' : ''}{danantaraScore}
              </span>
            </div>
            <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm">
              <span className="text-xs text-slate-500 font-bold mr-2">GROUP</span>
              <span className={`text-lg font-bold ${groupScore > 0 ? 'text-[#1C1A16]' : 'text-[#AF261D]'}`}>
                {groupScore > 0 ? '+' : ''}{groupScore}
              </span>
            </div>
          </div>
        </div>
 
        {/* Chart Labels */}
        <div className="flex justify-around mb-2">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-md bg-[#1C1A16] flex items-center justify-center">
              <span className="text-xs font-bold text-white">Danantara</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <Building2 className="h-4 w-4 text-slate-800" />
            </div>
            <span className="text-xs font-bold text-slate-600 uppercase">Group</span>
          </div>
        </div>

        <motion.div 
          ref={chartRef} 
          className="w-full h-[200px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      </div>
    </div>
  );
}
