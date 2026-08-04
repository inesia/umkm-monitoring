/**
 * Kementerian UMKM Engagement Center — Design tokens
 */
export const UMKM_COLORS = {
  ink: '#152943', // navy-dark
  ink2: '#1f3b57', // navy
  ink3: '#5f6b76', // grey
  paper: '#ffffff',
  cream: '#ebf1f7', // surface
  cream2: '#f2f5f5', // grey-light
  line: '#bfd2e3', // border
  line2: '#bfd2e3',
  orange: '#152943', // Dominant Dark Navy
  orangeDeep: '#0b192c', // Midnight Navy
  amber: '#dce6f1', // Ice Blue Tint
  pos: '#10b981', // emerald green (subtle positive accent)
  neg: '#ef4444', // red
  neu: '#06b6d4', // cyan
} as const;

export const UMKM_BRAND = {
  title: 'Kementerian UMKM',
  subtitle: 'Engagement Center',
  phase: 'Pemantauan Digital',
  coverage: 'Nasional',
  logo: '/logo-kemenkopukm.svg',
  poweredBy: 'Dashboard by Ripple10',
  footer:
    'Kementerian UMKM Engagement Center · Data ilustratif untuk konsep desain · Rahasia — Internal',
} as const;

export const UMKM_RADIUS = '12px';

export const UMKM_SHADOW =
  '0 1px 2px rgba(31,59,87,.05), 0 6px 20px -12px rgba(31,59,87,.14)';
