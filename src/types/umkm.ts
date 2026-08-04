export type UMKMView = 'ringkasan' | 'krisis' | 'program';

export type SentimentTone = 'pos' | 'neu' | 'neg';
export type Severity = 'high' | 'medium' | 'low';
export type StatusTone = 'done' | 'proc' | 'rep' | 'rev';

export interface UMKMKPI {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaTone: 'up' | 'down' | 'flat';
  bar: number;
  barTone?: 'orange' | 'green' | 'red';
  accent?: string;
}

export interface MapBubble {
  name: string;
  /** SVG cx on Indonesia map viewBox (0 296 1024 430) */
  x: number;
  /** SVG cy on Indonesia map viewBox */
  y: number;
  volume: number;
  sentiment: SentimentTone;
  socialPct: number;
  issue: string;
}

export interface EscalationLevel {
  id: string;
  label: string;
  name: string;
  desc: string;
  status: string;
  state: 'done' | 'active' | 'pending';
  evidence?: string[];
  assignee?: string;
}

export interface EscalationIssue {
  id: string;
  title: string;
  description: string;
  slaSeconds: number;
  severity: Severity;
  levels: EscalationLevel[];
}

export interface DigitalArmyTask {
  name: string;
  meta: string;
  progress: number;
  pill: 'high' | 'warn' | 'ok';
  pillLabel: string;
  headline: string;
  sparkline: number[];
  actions: [string, string];
}

export interface TakedownItem {
  title: string;
  meta: string;
  status: StatusTone;
  statusLabel: string;
  source: 'tiktok' | 'facebook' | 'x' | 'web' | 'instagram';
  reach: string;
  time: string;
  channel: string;
  severity: 'high' | 'medium' | 'low';
  preview: string;
}

export interface WAStat {
  value: string;
  label: string;
}

export interface ChannelBar {
  name: string;
  pct: number;
  value: string;
  tone: 'orange' | 'green' | 'dark';
}

export interface CrisisIssue {
  title: string;
  detail: string;
  source: string;
  mentions: string;
  sla: string;
  pic: string;
  status: string;
  statusTone: StatusTone;
  severity: Severity;
}

export interface TimelineEvent {
  time: string;
  text: string;
  tone: 'crit' | 'good' | 'neutral';
}

export interface FunnelStep {
  label: string;
  value: string;
  pct: number;
}

export interface CalendarItem {
  schedule: string;
  theme: string;
  channel: string;
  format: string;
  status: string;
  statusTone: StatusTone;
}

export interface TickerItem {
  tag: 'hoax' | 'edu' | 'media';
  tagLabel: string;
  text: string;
}

export interface HotPost {
  id: string;
  handle: string;
  platform: 'tiktok' | 'x' | 'news' | 'instagram' | 'facebook';
  excerpt: string;
  likes: string;
  retweets: string;
  tone: StatusTone;
  toneLabel: string;
  verified?: boolean;
  influencer?: boolean;
  sourceUrl?: string;
  thumbTone: string;
}

export interface UMKMDashboardData {
  kpis: UMKMKPI[];
  crisisKpis: UMKMKPI[];
  eduKpis: UMKMKPI[];
  sentiment: { pos: number; neu: number; neg: number; net: number; posCount: string; neuCount: string; negCount: string };
  emotions: { name: string; value: string; color: string }[];
  channels: ChannelBar[];
  mapBubbles: MapBubble[];
  mapTop: MapBubble[];
  escalation: EscalationIssue;
  digitalArmy: { active: number; stats: { value: string; label: string }[]; tasks: DigitalArmyTask[] };
  takedown: { chips: { value: string; label: string; highlight?: boolean }[]; items: TakedownItem[] };
  wa: { badge: string; stats: WAStat[]; intents: { label: string; pct: string }[] };
  keywords: { text: string; tone?: 'pos' | 'neg' }[];
  posts: HotPost[];
  crisisIssues: CrisisIssue[];
  crisisTimeline: TimelineEvent[];
  funnel: FunnelStep[];
  botIntents: ChannelBar[];
  calendar: CalendarItem[];
  eduChannels: ChannelBar[];
  eduGrowth: { week: string; optin: number; sessions: number }[];
  eduComplaints: { label: string; value: string; note: string }[];
  eduBestContent: { title: string; channel: string; er: string; views: string };
  ticker: TickerItem[];
  insight: string;
}
