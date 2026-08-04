'use client';

import { useMemo } from 'react';
import { PremiumTVChart } from '@/components/dashboard/PremiumTVChart';
import { generateNoisyData, generateTimeLabels, DataPoint } from '@/utils/chartDataProcessor';

/**
 * TV DEMO PAGE
 * Showcase Premium Chart dengan data "keriting" yang di-smooth
 */

export default function TVDemoPage() {
  // Generate "noisy" raw data untuk simulasi
  const rawDataset = useMemo(() => {
    const dataCount = 60; // 60 data points
    
    // Generate noisy data untuk setiap brand/metric
    const danantaraData = generateNoisyData(85, dataCount, 0.3, 8);
    const bcaData = generateNoisyData(82, dataCount, 0.25, 7);
    const mandiriData = generateNoisyData(78, dataCount, 0.2, 9);
    const briData = generateNoisyData(80, dataCount, 0.22, 7);
    const paninData = generateNoisyData(76, dataCount, 0.18, 6);
    
    // Generate time labels (1 menit interval)
    const timeLabels = generateTimeLabels(dataCount, 60000, 'time');
    
    // Combine into dataset
    const dataset: DataPoint[] = [];
    for (let i = 0; i < dataCount; i++) {
      dataset.push({
        time: timeLabels[i],
        Danantara: danantaraData[i],
        BCA: bcaData[i],
        Mandiri: mandiriData[i],
        BRI: briData[i],
        Panin: paninData[i]
      });
    }
    
    return dataset;
  }, []);

  // Series configuration
  const seriesConfig = [
    { name: 'Danantara', color: '#1C1A16', isPrimary: true },
    { name: 'BCA', color: '#003399' },
    { name: 'Mandiri', color: '#F59E0B' },
    { name: 'BRI', color: '#00529C' },
    { name: 'Panin', color: '#005596' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      {/* Page Header */}
      <div className="max-w-[1920px] mx-auto mb-8">
        <div className="bg-white rounded-md shadow-sm p-8 border border-slate-200">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Premium TV Chart Demo
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Visualisasi data yang terlihat <span className="font-bold text-[#1C1A16]">SOLID & PREMIUM</span> untuk layar Smart TV.
            Data mentah yang &quot;keriting&quot; telah di-smooth menggunakan Moving Average (window: 5)
            dengan Monotone Cubic Interpolation.
          </p>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-[#1C1A16]/10 to-[#1C1A16]/20 p-4 rounded-md border border-[#1C1A16]/30">
              <div className="text-[#1C1A16] font-bold text-sm mb-1">Smoothing</div>
              <div className="text-[#1C1A16] text-xs">Moving Average (MA-5)</div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-md border border-blue-200">
              <div className="text-slate-900 font-bold text-sm mb-1">Interpolation</div>
              <div className="text-slate-700 text-xs">Monotone Cubic</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-md border border-purple-200">
              <div className="text-purple-900 font-bold text-sm mb-1">Stroke Width</div>
              <div className="text-purple-700 text-xs">4-6px (10-foot UI)</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-md border border-amber-200">
              <div className="text-amber-900 font-bold text-sm mb-1">Area Fill</div>
              <div className="text-amber-700 text-xs">Gradient 10-20%</div>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-md border border-rose-200">
              <div className="text-rose-900 font-bold text-sm mb-1">Typography</div>
              <div className="text-rose-700 text-xs">Inter 18-20px</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Variants */}
      <div className="max-w-[1920px] mx-auto space-y-8">
        {/* Large TV Display */}
        <div className="bg-white rounded-md shadow-sm p-4 border border-slate-200">
          <div className="mb-4 px-4">
            <h2 className="text-2xl font-bold text-slate-900">Large TV Display (600px height)</h2>
            <p className="text-slate-600">Optimal untuk layar 55&quot;+ pada jarak 3 meter</p>
          </div>
          <div className="h-[600px]">
            <PremiumTVChart
              rawData={rawDataset}
              series={seriesConfig}
              smoothingWindow={5}
              title="Competitor Sentiment Index"
              yAxisRange={{ min: 65, max: 105 }}
              showGrid={false}
              heightPreset="large"
            />
          </div>
        </div>

        {/* Medium Display */}
        <div className="bg-white rounded-md shadow-sm p-4 border border-slate-200">
          <div className="mb-4 px-4">
            <h2 className="text-2xl font-bold text-slate-900">Medium Display (400px height)</h2>
            <p className="text-slate-600">Untuk dashboard multi-panel</p>
          </div>
          <div className="h-[400px]">
            <PremiumTVChart
              rawData={rawDataset}
              series={seriesConfig}
              smoothingWindow={5}
              title="Brand Performance Trend"
              yAxisRange={{ min: 65, max: 105 }}
              showGrid={true}
              heightPreset="medium"
            />
          </div>
        </div>

        {/* Compact Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-md shadow-sm p-4 border border-slate-200">
            <div className="mb-4 px-4">
              <h2 className="text-xl font-bold text-slate-900">Compact - Smoothing Window 5</h2>
              <p className="text-slate-600 text-sm">Moving Average dengan window 5 (recommended)</p>
            </div>
            <div className="h-[280px]">
              <PremiumTVChart
                rawData={rawDataset}
                series={seriesConfig.slice(0, 3)} // Show 3 series only
                smoothingWindow={5}
                title="Top 3 Banks"
                yAxisRange={{ min: 70, max: 100 }}
                heightPreset="compact"
              />
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm p-4 border border-slate-200">
            <div className="mb-4 px-4">
              <h2 className="text-xl font-bold text-slate-900">Compact - Smoothing Window 10</h2>
              <p className="text-slate-600 text-sm">More aggressive smoothing (window 10)</p>
            </div>
            <div className="h-[280px]">
              <PremiumTVChart
                rawData={rawDataset}
                series={seriesConfig.slice(0, 3)} // Show 3 series only
                smoothingWindow={10}
                title="Top 3 Banks (Heavy Smooth)"
                yAxisRange={{ min: 70, max: 100 }}
                heightPreset="compact"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Example Section */}
      <div className="max-w-[1920px] mx-auto">
        <div className="bg-gradient-to-br from-[#1C1A16]/10 to-[#1C1A16]/20 rounded-md shadow-sm p-8 border border-[#1C1A16]/30">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            🔴 Real-time Integration Example
          </h2>
          <p className="text-lg text-slate-700 mb-6">
            Lihat <code className="bg-white px-2 py-1 rounded text-[#1C1A16] font-mono text-sm">RealtimeTVChart.tsx</code> untuk contoh
            integrasi dengan API real-time, auto-refresh, dan error handling.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-md p-6 border border-[#1C1A16]/30">
              <h3 className="font-bold text-lg mb-3 text-emerald-900">Features</h3>
              <ul className="space-y-2 text-slate-700">
                <li>✅ Auto-refresh dengan configurable interval</li>
                <li>✅ Data point limiting (keep last N points)</li>
                <li>✅ Loading & error states</li>
                <li>✅ Live indicator dengan pulse animation</li>
                <li>✅ Non-blocking error overlay</li>
                <li>✅ Retry mechanism</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-md p-6 border border-[#1C1A16]/30">
              <h3 className="font-bold text-lg mb-3 text-emerald-900">Usage Example</h3>
              <pre className="bg-slate-900 text-[#1C1A16] p-4 rounded-lg text-xs overflow-x-auto">
{`<RealtimeTVChart
  apiEndpoint="/api/mock-data"
  series={[
    { name: 'Danantara', color: '#1C1A16', 
      isPrimary: true },
    { name: 'BCA', color: '#003399' }
  ]}
  refreshInterval={60000}
  maxDataPoints={60}
  title="Real-time Metrics"
/>`}
              </pre>
            </div>
          </div>
          
          <div className="mt-6 bg-white rounded-md p-6 border border-[#1C1A16]/30">
            <h3 className="font-bold text-lg mb-3 text-emerald-900">Mock API Endpoint</h3>
            <p className="text-slate-700 mb-3">
              Sudah tersedia mock endpoint untuk testing: <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">/api/mock-data</code>
            </p>
            <div className="flex gap-4">
              <a 
                href="/api/mock-data" 
                target="_blank"
                className="px-6 py-3 bg-[#1C1A16] text-white rounded-lg font-semibold hover:bg-[#475569] transition-colors"
              >
                Test API Endpoint →
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>File:</span>
                <code className="bg-slate-100 px-2 py-1 rounded font-mono">src/app/api/mock-data/route.ts</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-[1920px] mx-auto mt-8">
        <div className="bg-gradient-to-r from-[#1C1A16] to-[#004854] rounded-md shadow-sm p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed">
            <div>
              <h4 className="font-bold text-lg mb-2 text-[#1C1A16]">Data Processing</h4>
              <ul className="space-y-2 text-white/90">
                <li>• <strong>Moving Average:</strong> Window size 5 untuk menghilangkan noise tanpa merusak tren</li>
                <li>• <strong>Monotone Cubic Interpolation:</strong> ECharts smooth + smoothMonotone: &apos;x&apos;</li>
                <li>• <strong>LTTB Sampling:</strong> Downsampling otomatis untuk performa optimal</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2 text-blue-300">Visual Design</h4>
              <ul className="space-y-2 text-white/90">
                <li>• <strong>Stroke Weight:</strong> 6px primary, 4px secondary (10-foot UI compliant)</li>
                <li>• <strong>Area Gradient:</strong> Linear gradient 20% → 10% → 0% opacity</li>
                <li>• <strong>Typography:</strong> Inter font, 18-20px labels, 16-24px legend</li>
                <li>• <strong>Glow Effect:</strong> Shadow blur 16px pada primary line untuk depth</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
