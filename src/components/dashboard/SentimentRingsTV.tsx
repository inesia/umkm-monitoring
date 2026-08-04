'use client';

import { useState } from 'react';
import { PremiumTVChart } from './PremiumTVChart';
import { DataPoint } from '@/utils/chartDataProcessor';

/**
 * SENTIMENT RINGS TV VERSION
 * Refactored version menggunakan PremiumTVChart
 * Dengan data smoothing & TV-optimized visuals
 */

// STATIC DATA untuk presentasi (sama dengan SentimentRings original)
const COMPETITORS = [
  { name: 'Danantara', color: '#AF261D', isPrimary: true },
  { name: 'Panin', color: '#94A3B8' },
  { name: 'Mandiri', color: '#64748B' },
  { name: 'BCA', color: '#475569' },
  { name: 'BRI', color: '#334155' },
  { name: 'Maybank', color: '#CBD5E1' },
  { name: 'CIMB Niaga', color: '#E2E8F0' },
];

const STATIC_DATA = [
  { Danantara: 85, Panin: 82, Mandiri: 78, BCA: 84, BRI: 81, Maybank: 80, 'CIMB Niaga': 79 },
  { Danantara: 86, Panin: 83, Mandiri: 79, BCA: 85, BRI: 82, Maybank: 81, 'CIMB Niaga': 80 },
  { Danantara: 88, Panin: 84, Mandiri: 80, BCA: 86, BRI: 83, Maybank: 82, 'CIMB Niaga': 81 },
  { Danantara: 90, Panin: 85, Mandiri: 81, BCA: 87, BRI: 84, Maybank: 82, 'CIMB Niaga': 81 },
  { Danantara: 91, Panin: 86, Mandiri: 82, BCA: 88, BRI: 85, Maybank: 83, 'CIMB Niaga': 82 },
  { Danantara: 93, Panin: 87, Mandiri: 83, BCA: 89, BRI: 86, Maybank: 84, 'CIMB Niaga': 83 },
  { Danantara: 95, Panin: 88, Mandiri: 84, BCA: 90, BRI: 87, Maybank: 85, 'CIMB Niaga': 84 },
  { Danantara: 96, Panin: 89, Mandiri: 85, BCA: 91, BRI: 88, Maybank: 86, 'CIMB Niaga': 85 },
  { Danantara: 98, Panin: 90, Mandiri: 86, BCA: 92, BRI: 89, Maybank: 87, 'CIMB Niaga': 86 },
  { Danantara: 99, Panin: 91, Mandiri: 87, BCA: 93, BRI: 90, Maybank: 88, 'CIMB Niaga': 87 },
  { Danantara: 100, Panin: 92, Mandiri: 88, BCA: 94, BRI: 91, Maybank: 89, 'CIMB Niaga': 88 },
  { Danantara: 101, Panin: 93, Mandiri: 89, BCA: 94, BRI: 91, Maybank: 90, 'CIMB Niaga': 89 },
  { Danantara: 102, Panin: 93, Mandiri: 90, BCA: 95, BRI: 92, Maybank: 90, 'CIMB Niaga': 89 },
  { Danantara: 102, Panin: 94, Mandiri: 90, BCA: 95, BRI: 92, Maybank: 91, 'CIMB Niaga': 90 },
  { Danantara: 103, Panin: 94, Mandiri: 91, BCA: 95, BRI: 92, Maybank: 91, 'CIMB Niaga': 90 },
  { Danantara: 103, Panin: 94, Mandiri: 91, BCA: 95, BRI: 92, Maybank: 91, 'CIMB Niaga': 91 },
  { Danantara: 103, Panin: 94, Mandiri: 91, BCA: 95, BRI: 92, Maybank: 91, 'CIMB Niaga': 91 },
  { Danantara: 103, Panin: 93, Mandiri: 91, BCA: 94, BRI: 91, Maybank: 91, 'CIMB Niaga': 91 },
  { Danantara: 102, Panin: 93, Mandiri: 91, BCA: 94, BRI: 91, Maybank: 91, 'CIMB Niaga': 91 },
  { Danantara: 102, Panin: 92, Mandiri: 91, BCA: 93, BRI: 90, Maybank: 90, 'CIMB Niaga': 91 },
  { Danantara: 101, Panin: 92, Mandiri: 90, BCA: 93, BRI: 90, Maybank: 90, 'CIMB Niaga': 91 },
  { Danantara: 100, Panin: 91, Mandiri: 90, BCA: 92, BRI: 89, Maybank: 89, 'CIMB Niaga': 90 },
  { Danantara: 99, Panin: 90, Mandiri: 89, BCA: 91, BRI: 88, Maybank: 88, 'CIMB Niaga': 90 },
  { Danantara: 98, Panin: 89, Mandiri: 89, BCA: 90, BRI: 87, Maybank: 87, 'CIMB Niaga': 89 },
  { Danantara: 97, Panin: 88, Mandiri: 88, BCA: 89, BRI: 86, Maybank: 86, 'CIMB Niaga': 88 },
  { Danantara: 95, Panin: 87, Mandiri: 87, BCA: 88, BRI: 85, Maybank: 85, 'CIMB Niaga': 87 },
  { Danantara: 94, Panin: 86, Mandiri: 86, BCA: 87, BRI: 84, Maybank: 84, 'CIMB Niaga': 86 },
  { Danantara: 92, Panin: 85, Mandiri: 85, BCA: 86, BRI: 83, Maybank: 83, 'CIMB Niaga': 85 },
  { Danantara: 90, Panin: 84, Mandiri: 84, BCA: 85, BRI: 82, Maybank: 82, 'CIMB Niaga': 84 },
  { Danantara: 89, Panin: 83, Mandiri: 83, BCA: 84, BRI: 81, Maybank: 81, 'CIMB Niaga': 83 },
  { Danantara: 87, Panin: 82, Mandiri: 82, BCA: 83, BRI: 80, Maybank: 80, 'CIMB Niaga': 82 },
  { Danantara: 86, Panin: 81, Mandiri: 81, BCA: 82, BRI: 79, Maybank: 79, 'CIMB Niaga': 81 },
  { Danantara: 84, Panin: 80, Mandiri: 80, BCA: 81, BRI: 78, Maybank: 78, 'CIMB Niaga': 80 },
  { Danantara: 83, Panin: 79, Mandiri: 79, BCA: 80, BRI: 77, Maybank: 77, 'CIMB Niaga': 79 },
  { Danantara: 82, Panin: 79, Mandiri: 78, BCA: 79, BRI: 77, Maybank: 77, 'CIMB Niaga': 78 },
  { Danantara: 81, Panin: 78, Mandiri: 78, BCA: 79, BRI: 76, Maybank: 76, 'CIMB Niaga': 78 },
  { Danantara: 81, Panin: 78, Mandiri: 77, BCA: 78, BRI: 76, Maybank: 76, 'CIMB Niaga': 77 },
  { Danantara: 81, Panin: 78, Mandiri: 77, BCA: 78, BRI: 76, Maybank: 76, 'CIMB Niaga': 77 },
  { Danantara: 81, Panin: 78, Mandiri: 77, BCA: 78, BRI: 76, Maybank: 76, 'CIMB Niaga': 77 },
  { Danantara: 81, Panin: 78, Mandiri: 77, BCA: 79, BRI: 76, Maybank: 76, 'CIMB Niaga': 78 },
  { Danantara: 82, Panin: 79, Mandiri: 78, BCA: 79, BRI: 77, Maybank: 77, 'CIMB Niaga': 78 },
  { Danantara: 83, Panin: 79, Mandiri: 78, BCA: 80, BRI: 78, Maybank: 78, 'CIMB Niaga': 79 },
  { Danantara: 84, Panin: 80, Mandiri: 79, BCA: 81, BRI: 79, Maybank: 79, 'CIMB Niaga': 80 },
  { Danantara: 85, Panin: 81, Mandiri: 80, BCA: 82, BRI: 80, Maybank: 80, 'CIMB Niaga': 81 },
  { Danantara: 86, Panin: 82, Mandiri: 81, BCA: 83, BRI: 81, Maybank: 81, 'CIMB Niaga': 82 },
  { Danantara: 87, Panin: 83, Mandiri: 82, BCA: 84, BRI: 82, Maybank: 82, 'CIMB Niaga': 83 },
  { Danantara: 89, Panin: 84, Mandiri: 83, BCA: 85, BRI: 83, Maybank: 83, 'CIMB Niaga': 84 },
  { Danantara: 90, Panin: 85, Mandiri: 84, BCA: 86, BRI: 84, Maybank: 84, 'CIMB Niaga': 85 },
  { Danantara: 92, Panin: 86, Mandiri: 85, BCA: 87, BRI: 85, Maybank: 85, 'CIMB Niaga': 86 },
  { Danantara: 94, Panin: 87, Mandiri: 86, BCA: 88, BRI: 86, Maybank: 86, 'CIMB Niaga': 87 },
  { Danantara: 95, Panin: 88, Mandiri: 87, BCA: 89, BRI: 87, Maybank: 87, 'CIMB Niaga': 88 },
  { Danantara: 97, Panin: 89, Mandiri: 88, BCA: 90, BRI: 88, Maybank: 88, 'CIMB Niaga': 89 },
  { Danantara: 98, Panin: 90, Mandiri: 89, BCA: 91, BRI: 89, Maybank: 89, 'CIMB Niaga': 90 },
  { Danantara: 100, Panin: 91, Mandiri: 90, BCA: 92, BRI: 90, Maybank: 90, 'CIMB Niaga': 91 },
  { Danantara: 101, Panin: 92, Mandiri: 91, BCA: 93, BRI: 91, Maybank: 91, 'CIMB Niaga': 92 },
  { Danantara: 102, Panin: 93, Mandiri: 92, BCA: 94, BRI: 92, Maybank: 92, 'CIMB Niaga': 92 },
  { Danantara: 103, Panin: 94, Mandiri: 93, BCA: 94, BRI: 93, Maybank: 93, 'CIMB Niaga': 93 },
  { Danantara: 104, Panin: 94, Mandiri: 94, BCA: 95, BRI: 93, Maybank: 93, 'CIMB Niaga': 94 },
  { Danantara: 105, Panin: 95, Mandiri: 94, BCA: 96, BRI: 94, Maybank: 94, 'CIMB Niaga': 94 },
  { Danantara: 106, Panin: 95, Mandiri: 95, BCA: 96, BRI: 95, Maybank: 95, 'CIMB Niaga': 95 },
];

function getInitialChartData(): DataPoint[] {
  const now = new Date();
  const points: DataPoint[] = [];
  STATIC_DATA.forEach((dataPoint, i) => {
    const time = new Date(now.getTime() - (STATIC_DATA.length - i - 1) * 60000)
      .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    points.push({ time, ...dataPoint });
  });
  return points;
}

export function SentimentRingsTV() {
  const [chartData] = useState<DataPoint[]>(getInitialChartData);

  return (
    <PremiumTVChart
      rawData={chartData}
      series={COMPETITORS}
      smoothingWindow={5}
      title="Competitor Benchmark"
      yAxisRange={{ min: 70, max: 110 }}
      showGrid={false}
      heightPreset="medium"
    />
  );
}
