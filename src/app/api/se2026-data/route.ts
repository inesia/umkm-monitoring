import { NextResponse } from 'next/server';
import { buildUMKMPayload } from '@/lib/umkm-data';

/** @deprecated Prefer GET /api/umkm-data */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get('timeframe') ?? '24J';
  const live = searchParams.get('live') !== '0';
  await new Promise((r) => setTimeout(r, 40));
  return NextResponse.json(buildUMKMPayload({ live, timeframe }), {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
