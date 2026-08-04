import type { UMKMDashboardData, WAStat } from '@/types/umkm';
import { UMKMCard, SEPill, SEStatus } from './UMKMCard';
import { MediaListeningChart } from './MediaListeningChart';
import { HotPostCarousel } from './HotPostCarousel';

export { DigitalArmyPanel } from './DigitalArmyPanel';
export { TakedownPanel } from './TakedownPanel';

export function WAOfficialPanel({
  data,
}: {
  data: {
    badge: string;
    stats: WAStat[];
    intents: { label: string; pct: string }[];
  };
}) {
  return (
    <UMKMCard title="WA Official UMKM" tone="wa" className="h-full">
      <div
        className="inline-flex items-center gap-1.5 text-[0.58rem] font-bold px-2.5 py-1 rounded-full mb-2"
        style={{ background: '#E8F6EE', color: '#137A4C' }}
      >
        {data.badge}
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {data.stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border bg-white px-2 py-1.5"
            style={{ borderColor: '#DFF0E5' }}
          >
            <b className="block text-[0.95rem] tabular-nums" style={{ color: 'var(--ink)' }}>
              {s.value}
            </b>
            <small className="text-[0.5rem] font-bold uppercase" style={{ color: 'var(--ink-3)' }}>
              {s.label}
            </small>
          </div>
        ))}
      </div>
      {data.intents.map((intent) => (
        <div
          key={intent.label}
          className="flex justify-between py-1 border-b last:border-0 text-[0.7rem]"
          style={{ borderColor: '#ECF6EF', color: 'var(--ink)' }}
        >
          <span>{intent.label}</span>
          <b className="tabular-nums" style={{ color: 'var(--ink-2)' }}>
            {intent.pct}
          </b>
        </div>
      ))}
    </UMKMCard>
  );
}

export function SentimentPanel({
  sentiment,
  emotions,
}: {
  sentiment: UMKMDashboardData['sentiment'];
  emotions: UMKMDashboardData['emotions'];
}) {
  const total = sentiment.pos + sentiment.neu + sentiment.neg;
  const posDeg = (sentiment.pos / total) * 360;
  const neuDeg = (sentiment.neu / total) * 360;

  return (
    <UMKMCard title="Sentimen & Roda Emosi" subtitle="24 jam · seluruh kanal" className="h-full">
      <div className="flex flex-col h-full min-h-0 gap-2">
        {/* Sentiment — compact top */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="relative w-[72px] h-[72px] rounded-full shrink-0"
            style={{
              background: `conic-gradient(#1E8E5A 0deg ${posDeg}deg, #D9CFC2 ${posDeg}deg ${posDeg + neuDeg}deg, #C7402D ${posDeg + neuDeg}deg 360deg)`,
            }}
          >
            <div className="absolute inset-[14px] rounded-full bg-white flex flex-col items-center justify-center">
              <b className="text-[0.95rem] leading-none" style={{ color: 'var(--pos)' }}>
                +{sentiment.net}
              </b>
              <small
                className="text-[0.45rem] font-bold uppercase tracking-wider"
                style={{ color: 'var(--ink-3)' }}
              >
                Net
              </small>
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-1 text-[0.65rem]">
            <div className="grid grid-cols-[8px_1fr_auto_auto] gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-sm bg-[#1E8E5A]" />
              <span className="truncate">Positif</span>
              <b className="tabular-nums">{sentiment.pos}%</b>
              <small className="tabular-nums" style={{ color: 'var(--ink-3)' }}>
                {sentiment.posCount}
              </small>
            </div>
            <div className="grid grid-cols-[8px_1fr_auto_auto] gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-sm bg-[#D9CFC2]" />
              <span className="truncate">Netral</span>
              <b className="tabular-nums">{sentiment.neu}%</b>
              <small className="tabular-nums" style={{ color: 'var(--ink-3)' }}>
                {sentiment.neuCount}
              </small>
            </div>
            <div className="grid grid-cols-[8px_1fr_auto_auto] gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-sm bg-[#C7402D]" />
              <span className="truncate">Negatif</span>
              <b className="tabular-nums">{sentiment.neg}%</b>
              <small className="tabular-nums" style={{ color: 'var(--ink-3)' }}>
                {sentiment.negCount}
              </small>
            </div>
          </div>
        </div>

        {/* Emotions — fills remaining height, no empty bottom */}
        <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-4 gap-x-2 gap-y-0">
          {emotions.map((e) => (
            <div
              key={e.name}
              className="flex items-center gap-1.5 min-h-0 px-1.5 rounded-md border"
              style={{ borderColor: 'var(--cream-2)', background: 'var(--cream)' }}
            >
              <i className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: e.color }} />
              <span className="flex-1 truncate text-[0.62rem]" style={{ color: 'var(--ink)' }}>
                {e.name}
              </span>
              <b className="tabular-nums text-[0.62rem] shrink-0" style={{ color: 'var(--ink-2)' }}>
                {e.value}
              </b>
            </div>
          ))}
        </div>
      </div>
    </UMKMCard>
  );
}

export function TimelinePanel({
  channels,
  insight,
}: {
  channels: UMKMDashboardData['channels'];
  insight: string;
}) {
  return (
    <UMKMCard
      title="Media Listening — 24h"
      subtitle="Realtime stacked area · multi-kanal"
      action={<SEPill tone="live">Live</SEPill>}
      className="h-full"
    >
      <div className="flex flex-col h-full min-h-0 gap-1.5">
        <div className="flex-1 min-h-0">
          <MediaListeningChart channels={channels} />
        </div>
        <div
          className="shrink-0 pt-1.5 border-t border-dashed text-[0.7rem] leading-snug"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-3)' }}
        >
          {insight}
        </div>
      </div>
    </UMKMCard>
  );
}

export function KeywordsPanel({
  keywords,
  posts,
}: {
  keywords: UMKMDashboardData['keywords'];
  posts: UMKMDashboardData['posts'];
}) {
  return (
    <UMKMCard title="Topik & Konten Berpengaruh" subtitle="Hot posts · momentum 24 jam" className="h-full">
      <div className="flex flex-col h-full min-h-0 gap-1.5">
        <div className="flex flex-wrap gap-1 shrink-0 content-start max-h-[28%] overflow-hidden">
          {keywords.slice(0, 8).map((kw) => (
            <span
              key={kw.text}
              className="text-[0.52rem] font-semibold px-1.5 py-0.5 rounded-full border"
              style={
                kw.tone === 'neg'
                  ? { background: '#FDEAE7', borderColor: '#F5C9C1', color: 'var(--neg)' }
                  : kw.tone === 'pos'
                    ? { background: '#E8F6EE', borderColor: '#C4E6D2', color: 'var(--pos)' }
                    : { background: 'var(--cream)', borderColor: 'var(--line)', color: 'var(--ink)' }
              }
            >
              {kw.text}
            </span>
          ))}
        </div>
        <div className="flex-1 min-h-0">
          <HotPostCarousel posts={posts.slice(0, 3)} mode="single" />
        </div>
      </div>
    </UMKMCard>
  );
}
