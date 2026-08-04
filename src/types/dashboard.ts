// Dashboard Mode Types
export type DashboardMode = "general" | "crisis";

// Media Sentiment Types
export type SentimentType = "positive" | "neutral" | "negative";

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export interface BankExposureData {
  name: string;
  value: number;
  trend: "up" | "down" | "stable";
  change: number;
}

export interface PerformanceMetrics {
  prValue: number;
  newsValue: number;
  prValueChange: number;
  newsValueChange: number;
  reach: number;
  engagement: number;
}

export interface NewsHeadline {
  id: string;
  text: string;
  source: string;
  timestamp: Date;
  sentiment: SentimentType;
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  severity: "high" | "medium" | "low";
  timeRemaining: number; // in seconds
  source: string;
}

export interface NewsTickerItem {
  id: string;
  headline: string;
  source: string;
  timestamp: Date;
  sentiment: SentimentType;
}
