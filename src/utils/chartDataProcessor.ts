/**
 * Data Processing Utilities for Premium TV Dashboard Charts
 * Handles smoothing, interpolation, and data transformation
 */

export interface DataPoint {
  [key: string]: number | string;
}

/**
 * Moving Average dengan window size configurable
 * Menghilangkan fluktuasi kecil tanpa merusak tren utama
 */
export function applyMovingAverage(
  data: number[],
  windowSize: number = 5
): number[] {
  if (data.length === 0) return [];
  if (windowSize < 2) return data;

  const result: number[] = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;

    // Calculate window boundaries
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(data.length - 1, i + halfWindow);

    // Sum values in window
    for (let j = start; j <= end; j++) {
      sum += data[j];
      count++;
    }

    result.push(sum / count);
  }

  return result;
}

/**
 * Smooth dataset dengan Moving Average untuk semua series
 */
export function smoothDataset(
  dataset: DataPoint[],
  seriesKeys: string[],
  windowSize: number = 5
): DataPoint[] {
  if (dataset.length === 0) return [];

  const smoothedData: DataPoint[] = [];

  // Extract raw values for each series
  const seriesData: { [key: string]: number[] } = {};
  seriesKeys.forEach(key => {
    seriesData[key] = dataset.map(d => (typeof d[key] === 'number' ? d[key] : 0));
  });

  // Apply moving average to each series
  const smoothedSeries: { [key: string]: number[] } = {};
  seriesKeys.forEach(key => {
    smoothedSeries[key] = applyMovingAverage(seriesData[key], windowSize);
  });

  // Reconstruct dataset
  for (let i = 0; i < dataset.length; i++) {
    const point: DataPoint = {};
    
    // Copy non-numeric fields (like time, labels)
    Object.keys(dataset[i]).forEach(key => {
      if (!seriesKeys.includes(key)) {
        point[key] = dataset[i][key];
      }
    });

    // Add smoothed values
    seriesKeys.forEach(key => {
      point[key] = Math.round(smoothedSeries[key][i] * 100) / 100;
    });

    smoothedData.push(point);
  }

  return smoothedData;
}

/**
 * Generate timestamps untuk data points (mundur dari sekarang)
 */
export function generateTimeLabels(
  count: number,
  intervalMs: number = 60000,
  format: 'time' | 'datetime' | 'date' = 'time'
): string[] {
  const now = new Date();
  const labels: string[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * intervalMs);
    
    let label = '';
    switch (format) {
      case 'time':
        label = timestamp.toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        break;
      case 'datetime':
        label = timestamp.toLocaleString('id-ID', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        break;
      case 'date':
        label = timestamp.toLocaleDateString('id-ID', {
          month: 'short',
          day: 'numeric'
        });
        break;
    }
    
    labels.push(label);
  }

  return labels;
}

/**
 * Calculate average untuk setiap series
 */
export function calculateSeriesAverages(
  dataset: DataPoint[],
  seriesKeys: string[]
): { [key: string]: number } {
  const averages: { [key: string]: number } = {};

  seriesKeys.forEach(key => {
    const values = dataset
      .map(d => d[key])
      .filter(v => typeof v === 'number') as number[];
    
    if (values.length > 0) {
      const sum = values.reduce((acc, val) => acc + val, 0);
      averages[key] = Math.round(sum / values.length);
    } else {
      averages[key] = 0;
    }
  });

  return averages;
}

/**
 * Detect peak points untuk annotations
 */
export function findPeaks(
  data: number[],
  threshold: number = 0.8
): number[] {
  const peaks: number[] = [];
  
  for (let i = 1; i < data.length - 1; i++) {
    const prev = data[i - 1];
    const curr = data[i];
    const next = data[i + 1];
    
    // Local maximum
    if (curr > prev && curr > next) {
      const maxValue = Math.max(...data);
      const minValue = Math.min(...data);
      const range = maxValue - minValue;
      
      // Only significant peaks
      if (range > 0 && (curr - minValue) / range >= threshold) {
        peaks.push(i);
      }
    }
  }
  
  return peaks;
}

/**
 * Generate synthetic "noisy" data untuk demo
 */
export function generateNoisyData(
  baseValue: number,
  count: number,
  trend: number = 0.1,
  volatility: number = 5
): number[] {
  const data: number[] = [];
  let currentValue = baseValue;
  
  for (let i = 0; i < count; i++) {
    // Add random noise
    const noise = (Math.random() - 0.5) * volatility;
    // Add trend
    const trendValue = i * trend;
    
    currentValue = baseValue + trendValue + noise;
    data.push(Math.round(currentValue * 100) / 100);
  }
  
  return data;
}
