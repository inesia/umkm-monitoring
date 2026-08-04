import type {
  BankExposureData,
  SentimentData,
  PerformanceMetrics,
  AlertItem,
  NewsTickerItem,
  NewsHeadline,
  SentimentType,
} from '@/types/dashboard';
import { Danantara_BANKS } from './constants';

// Generate random bank exposure data
export function generateBankExposureData(): BankExposureData[] {
  return Danantara_BANKS.map((bank, index) => {
    const baseValue = index === 0 ? 850 : Math.floor(Math.random() * 600) + 200;
    const trends: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    
    return {
      name: bank,
      value: baseValue + Math.floor(Math.random() * 100),
      trend,
      change: Math.floor(Math.random() * 20) - 10,
    };
  }).sort((a, b) => b.value - a.value).slice(0, 10);
}

// Generate sentiment data for Danantara
export function generateSentimentData(): {
  danantara: SentimentData;
  danantaraGroup: SentimentData;
} {
  return {
    danantara: {
      positive: Math.floor(Math.random() * 30) + 50, // 50-80%
      neutral: Math.floor(Math.random() * 20) + 10, // 10-30%
      negative: Math.floor(Math.random() * 15) + 5, // 5-20%
    },
    danantaraGroup: {
      positive: Math.floor(Math.random() * 30) + 45,
      neutral: Math.floor(Math.random() * 25) + 15,
      negative: Math.floor(Math.random() * 20) + 10,
    },
  };
}

// Generate performance metrics
export function generatePerformanceMetrics(): PerformanceMetrics {
  return {
    prValue: Math.floor(Math.random() * 5000000000) + 2000000000, // 2B - 7B
    newsValue: Math.floor(Math.random() * 2000) + 1000, // 1000 - 3000 mentions
    prValueChange: Math.floor(Math.random() * 30) - 10,
    newsValueChange: Math.floor(Math.random() * 40) - 15,
    reach: Math.floor(Math.random() * 5000000) + 1000000, // 1M - 6M
    engagement: Math.floor(Math.random() * 500000) + 100000, // 100K - 600K
  };
}

// Generate alert items
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- reserved for future batch size
export function generateAlertItems(count: number = 5): AlertItem {
  const severities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
  const titles = [
    'Negative Sentiment Spike Detected',
    'Viral Social Media Post',
    'Competitor Announcement Impact',
    'Customer Complaint Trend',
    'Regulatory News Mention',
  ];
  
  const descriptions = [
    'Multiple negative mentions detected across social media platforms. Sentiment score dropped 8 pts in the last 4 hours. Top keywords: layanan, antre, lambat. Rekomendasi: pantau thread dan siapkan statement resmi.',
    'Twitter post gaining significant traction — immediate response recommended. Post telah di-retweet 340+ kali dalam 2 jam. Tim komunikasi krisis disarankan standby.',
    'BCA announced new product, potential competitive impact. Peluncuran produk digital competitor dapat mempengaruhi persepsi pasar. Disarankan evaluasi positioning Danantara.',
    'Increase in customer service complaints on digital channels. Keluhan naik 12% vs kemarin; mayoritas terkait antrean dan transaksi digital. Tim PR telah di-brief; respons publik disarankan dalam 2 jam.',
    'OJK announcement mentions banking sector regulations. Regulasi baru menyentuh sektor perbankan. Legal & compliance sedang review; siapkan FAQ untuk media.',
  ];
  
  const sources = ['Twitter', 'Facebook', 'Instagram', 'News Portal', 'LinkedIn'];
  
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const index = Math.floor(Math.random() * titles.length);
  
  return {
    id: `alert-${Date.now()}-${Math.random()}`,
    title: titles[index],
    description: descriptions[index],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 10 * 60 * 1000)), // Last 10 minutes
    severity,
    timeRemaining: Math.floor(Math.random() * 1800), // 0-30 minutes
    source: sources[Math.floor(Math.random() * sources.length)],
  };
}

// Generate news ticker items
export function generateNewsTickerItems(count: number = 20): NewsTickerItem[] {
  const headlines = [
    'Danantara Launches New Digital Banking Features for SME Customers',
    'Indonesian Banking Sector Shows Strong Q4 Growth',
    'Danantara Expands Branch Network in Eastern Indonesia',
    'Digital Payment Transactions Surge 45% Year-over-Year',
    'Danantara Announces Strategic Partnership with Tech Startup',
    'Banking Regulator Updates Capital Requirements',
    'Danantara Mobile App Receives Industry Recognition Award',
    'Indonesian Economy Shows Positive GDP Growth',
    'Danantara Introduces AI-Powered Customer Service',
    'Foreign Investment in Indonesian Banks Increases',
    'Danantara Reports Record-Breaking Loan Portfolio Growth',
    'Fintech Competition Drives Banking Innovation',
    'Danantara Subsidiary Launches Islamic Banking Products',
    'Central Bank Maintains Steady Interest Rates',
    'Danantara Foundation Announces New CSR Initiative',
    'Digital Banking Adoption Reaches New Milestone',
    'Danantara Strengthens Cybersecurity Infrastructure',
    'Banking Sector Embraces Green Finance Initiatives',
    'Danantara Receives Top Employer Award 2026',
    'Indonesia\'s Payment System Modernization Progress',
  ];
  
  const sources = [
    'Kompas',
    'Tempo',
    'Detik Finance',
    'Kontan',
    'Bisnis Indonesia',
    'CNBC Indonesia',
    'Reuters',
    'Bloomberg',
  ];
  
  const sentiments: SentimentType[] = ['positive', 'neutral', 'negative'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `ticker-${i}`,
    headline: headlines[i % headlines.length],
    source: sources[Math.floor(Math.random() * sources.length)],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 60 * 60 * 1000)),
    sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
  }));
}

// Format currency for Indonesian Rupiah
export function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `Rp ${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(2)}M`;
  }
  return `Rp ${value.toLocaleString('id-ID')}`;
}

// Format time remaining
export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Generate news headlines for ticker
export function generateNewsHeadlines(count: number = 15): NewsHeadline[] {
  const headlines = [
    'Danantara Launches New Digital Banking Features for SME Customers',
    'Indonesian Banking Sector Shows Strong Q4 Growth',
    'Danantara Expands Branch Network in Eastern Indonesia',
    'Digital Payment Transactions Surge 45% Year-over-Year',
    'Danantara Announces Strategic Partnership with Tech Startup',
    'Banking Regulator Updates Capital Requirements',
    'Danantara Mobile App Receives Industry Recognition Award',
    'Indonesian Economy Shows Positive GDP Growth',
    'Danantara Introduces AI-Powered Customer Service',
    'Foreign Investment in Indonesian Banks Increases',
    'Danantara Reports Record-Breaking Loan Portfolio Growth',
    'Fintech Competition Drives Banking Innovation',
    'Danantara Subsidiary Launches Islamic Banking Products',
    'Central Bank Maintains Steady Interest Rates',
    'Danantara Foundation Announces New CSR Initiative',
    'Digital Banking Adoption Reaches New Milestone',
    'Danantara Strengthens Cybersecurity Infrastructure',
    'Banking Sector Embraces Green Finance Initiatives',
    'Danantara Receives Top Employer Award 2026',
    'Indonesia Payment System Modernization Progress',
    'Danantara Partners with Government on Financial Inclusion',
    'Banking Sector Digital Transformation Accelerates',
    'Danantara Wins Best Corporate Governance Award',
    'New Regulations Strengthen Financial Sector Stability',
    'Danantara Launches Sustainability-Linked Loans Program',
  ];
  
  const sources = [
    'Kompas',
    'Tempo',
    'Detik Finance',
    'Kontan',
    'Bisnis Indonesia',
    'CNBC Indonesia',
    'Reuters',
    'Bloomberg',
    'Jakarta Post',
    'Antara News',
  ];
  
  const sentimentWeights = [...Array(5).fill('positive'), ...Array(3).fill('neutral'), 'negative', 'negative'];

  return Array.from({ length: count }, (_, i) => ({
    id: `headline-${i}-${Date.now()}`,
    text: headlines[Math.floor(Math.random() * headlines.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 60 * 60 * 1000)),
    sentiment: sentimentWeights[Math.floor(Math.random() * sentimentWeights.length)] as SentimentType,
  }));
}
