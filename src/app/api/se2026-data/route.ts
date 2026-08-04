import { NextResponse } from 'next/server';
import { buildUMKMPayload } from '@/lib/se2026-data';

/**
 * GET /api/umkm-data
 * Returns UMKM Engagement Center dashboard payload.
 *
 * Query:
 *  - timeframe: 1J | 6J | 24J | 7H (default 24J)
 *  - live: 0 to disable jitter (default live)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get('timeframe') ?? '24J';
  const live = searchParams.get('live') !== '0';

  // Light delay to mimic upstream listening API
  await new Promise((r) => setTimeout(r, 40));

  const payload = buildUMKMPayload({ live, timeframe });

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
