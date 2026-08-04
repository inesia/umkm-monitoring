import { NextResponse } from 'next/server';

/**
 * MOCK API ENDPOINT for Testing Real-time Charts
 * 
 * Returns random data point untuk testing PremiumTVChart
 * dengan real-time updates
 */

/**
 * Generate random value dengan trend
 */
function generateValue(base: number, volatility: number = 5): number {
  const noise = (Math.random() - 0.5) * volatility;
  const trend = (Math.random() - 0.5) * 2; // Small random trend
  
  return Math.max(0, Math.min(100, base + noise + trend));
}

/**
 * GET /api/mock-data
 * Returns single data point dengan current timestamp
 */
export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Generate current timestamp
  const timestamp = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  // Generate data point dengan random values
  // Sesuaikan dengan series yang Anda gunakan
  const dataPoint = {
    time: timestamp,
    
    // Competitor brands (untuk Sentiment/Benchmark)
    Danantara: generateValue(92, 3),
    BCA: generateValue(89, 3),
    Mandiri: generateValue(83, 4),
    BRI: generateValue(86, 3),
    Panin: generateValue(87, 3),
    Maybank: generateValue(84, 3),
    'CIMB Niaga': generateValue(85, 3),
    
    // Sentiment metrics
    Positive: generateValue(65, 8),
    Neutral: generateValue(25, 5),
    Negative: generateValue(10, 3),
    
    // System metrics
    CPU: generateValue(45, 15),
    Memory: generateValue(60, 10),
    Network: generateValue(30, 20),
    
    // Traffic metrics
    Mobile: generateValue(70, 10),
    Desktop: generateValue(30, 8),
    Organic: generateValue(50, 12),
    Paid: generateValue(30, 8),
    Social: generateValue(20, 6),
  };
  
  return NextResponse.json(dataPoint);
}

/**
 * POST /api/mock-data (optional)
 * Accept custom base values untuk controlled testing
 */
export async function POST(request: Request) {
  const body = await request.json();
  
  const timestamp = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  // Generate based on provided base values
  const dataPoint: Record<string, string | number> = { time: timestamp };

  Object.keys(body).forEach(key => {
    const baseValue = body[key];
    dataPoint[key] = generateValue(Number(baseValue), 5);
  });
  
  return NextResponse.json(dataPoint);
}
