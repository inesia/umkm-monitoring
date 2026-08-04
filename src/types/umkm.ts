export type UMKMView = 'menteri' | 'program' | 'krisis';

export type SentimentTone = 'pos' | 'neu' | 'neg';
export type Severity = 'high' | 'medium' | 'low';
export type StatusTone = 'done' | 'proc' | 'rep' | 'rev';
export type ProgramStatus = 'on_track' | 'accelerate' | 'risk';

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

export interface TickerItem {
  tag: 'hoax' | 'edu' | 'media' | 'isu' | 'program';
  tagLabel: string;
  text: string;
}

export interface HotPost {
  id: string;
  handle: string;
  platform: 'tiktok' | 'x' | 'news' | 'instagram' | 'facebook' | 'youtube' | 'threads';
  excerpt: string;
  likes: string;
  retweets: string;
  tone: StatusTone;
  toneLabel: string;
  verified?: boolean;
  influencer?: boolean;
  sourceUrl?: string;
  thumbTone: string;
  score?: string;
}

/** Legacy panel types (kept for unused/optional panels) */
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

export interface MinisterProfile {
  name: string;
  title: string;
  since: string;
  cabinet: string;
  party: string;
  history: string;
  birth: string;
  photoNote: string;
}

export interface MinisterNewsItem {
  title: string;
  context: string;
  source: string;
  tone: SentimentTone;
  toneLabel: string;
  reach: string;
  time: string;
}

export interface PublicQuote {
  text: string;
  context: string;
  responses: string;
  supportPct: number;
}

export interface ActivitySchedule {
  title: string;
  when: string;
  where: string;
  media: string;
}

export interface DominantTopic {
  name: string;
  count: string;
}

export interface SourceTotal {
  label: string;
  value: string;
  kind: 'tweets' | 'posts' | 'articles';
}

export interface AuthorRank {
  name: string;
  site: string;
  mentions: number;
  engagement: number;
  followers: string;
  group: 'influential' | 'active' | 'portal';
}

export interface ProgramBoardItem {
  name: string;
  partner: string;
  target: string;
  realization: string;
  pct: number;
  trend: string;
  trendTone: 'up' | 'down' | 'flat';
  status: ProgramStatus;
  statusLabel: string;
}

export interface ProgramSentiment {
  name: string;
  posPct: number;
}

export interface ProgramConstraint {
  issue: string;
  program: string;
  level: 'monitor' | 'risk';
}

export interface RegionAchievement {
  name: string;
  pct: number;
  note?: string;
}

export interface ProgramMilestone {
  when: string;
  text: string;
}

export interface CrisisAmplifier {
  handle: string;
  note: string;
  platform: string;
  followers: string;
  reach: string;
  role: string;
  sentiment: string;
}

export interface CrisisChannelReach {
  channel: string;
  reach: string;
  posPct: number;
}

export interface UMKMDashboardData {
  kpis: UMKMKPI[];
  programKpis: UMKMKPI[];
  crisisKpis: UMKMKPI[];
  sentiment: {
    pos: number;
    neu: number;
    neg: number;
    net: number;
    posCount: string;
    neuCount: string;
    negCount: string;
  };
  emotions: { name: string; value: string; color: string }[];
  channels: ChannelBar[];
  mapBubbles: MapBubble[];
  mapTop: MapBubble[];
  escalation: EscalationIssue;
  keywords: { text: string; tone?: 'pos' | 'neg' }[];
  posts: HotPost[];
  crisisIssues: CrisisIssue[];
  crisisTimeline: TimelineEvent[];
  crisisAmplifiers: CrisisAmplifier[];
  crisisChannelReach: CrisisChannelReach[];
  crisisHashtags: string[];
  minister: MinisterProfile;
  ministerNews: MinisterNewsItem[];
  quotes: PublicQuote[];
  schedule: ActivitySchedule[];
  dominantTopics: DominantTopic[];
  sourceTotals: SourceTotal[];
  authors: AuthorRank[];
  personalInsight: string;
  programs: ProgramBoardItem[];
  programSentiment: ProgramSentiment[];
  programConstraints: ProgramConstraint[];
  regionAchievements: RegionAchievement[];
  milestones: ProgramMilestone[];
  ticker: TickerItem[];
  insight: string;
  programInsight: string;
  crisisInsight: string;
}
