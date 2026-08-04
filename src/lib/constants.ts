import { UMKM_COLORS, UMKM_BRAND } from './umkm-theme';

export const BRAND_COLORS = {
  primary: UMKM_COLORS.ink,
  accent: UMKM_COLORS.orange,
  accentDeep: UMKM_COLORS.orangeDeep,
  positive: UMKM_COLORS.pos,
  negative: UMKM_COLORS.neg,
} as const;

/** @deprecated Use BRAND_COLORS — kept for gradual migration */
export const Danantara_COLORS = {
  blue: UMKM_COLORS.ink,
  orange: UMKM_COLORS.orange,
  blueLight: UMKM_COLORS.amber,
  blueDark: UMKM_COLORS.orangeDeep,
} as const;

/** @deprecated Legacy mock entities — replace with UMKM channels/regions later */
export const Danantara_BANKS = [
  'UMKM',
  'BPS Pusat',
  'TikTok',
  'Instagram',
  'X',
  'WhatsApp',
  'Media Online',
  'TV/Radio',
  'Portal Daerah',
  'Digital Army',
] as const;

export const BRAND = UMKM_BRAND;

export const SLA_RESPONSE_TIME = 30 * 60; // 30 minutes in seconds

export const REFRESH_INTERVALS = {
  trend: 30000,
  alerts: 10000,
  sentiment: 60000,
  ticker: 5000,
  /** Full UMKM TV dashboard poll */
  dashboard: 30000,
  sla: 1000,
} as const;
