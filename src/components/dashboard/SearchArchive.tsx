'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Tag,
  Plus,
  Download,
  Calendar,
  Hash,
  Globe,
  MessageCircle,
  Newspaper,
  Radio,
  LayoutGrid,
  FileBarChart,
  PlusCircle,
  CheckSquare,
  Square,
  Check,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { UMKMPageShell } from '@/components/umkm/UMKMPageShell';
import { UMKM_COLORS } from '@/lib/umkm-theme';

const ACCENT = UMKM_COLORS.orange;

const CHANNEL_PILLS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Semua Media', icon: <LayoutGrid className="w-3 h-3" /> },
  { id: 'Online', label: 'Online', icon: <Globe className="w-3 h-3" /> },
  { id: 'Social', label: 'Social', icon: <MessageCircle className="w-3 h-3" /> },
  { id: 'Cetak', label: 'Cetak', icon: <Newspaper className="w-3 h-3" /> },
  { id: 'TV/Radio', label: 'TV/Radio', icon: <Radio className="w-3 h-3" /> },
];

const TONE_PILLS = [
  { id: 'positive', label: 'Positif' },
  { id: 'neutral', label: 'Netral' },
  { id: 'negative', label: 'Negatif' },
];

const INSTANT_SUGGESTIONS = [
  { id: '1', text: 'hoaks pajak UMKM', count: 4216, type: 'trending' as const },
  { id: '2', text: 'petugas palsu OTP', count: 1318, type: 'trending' as const },
  { id: '3', text: 'klarifikasi UU 16/1997', count: 892, type: 'mention' as const },
  { id: '4', text: 'Tiga TIR edukasi', count: 640, type: 'mention' as const },
  { id: '5', text: 'WA Official verifikasi petugas', count: 512, type: 'trending' as const },
];

interface Clipping {
  id: number;
  title: string;
  source: string;
  channel: string;
  date: string;
  tone: 'positive' | 'neutral' | 'negative';
  tag: string;
  reach?: string;
  shares?: string;
}

const MOCK_CLIPPINGS: Clipping[] = [
  {
    id: 1,
    title: 'Klarifikasi BPS: data UMKM dilindungi UU No. 16/1997 — bukan untuk pajak',
    source: 'BPS Statistics',
    channel: 'Social',
    date: '7 Jul 2026',
    tone: 'positive',
    tag: 'Klarifikasi',
    reach: '2,8 jt',
  },
  {
    id: 2,
    title: 'Video viral klaim “sensus = sensor pajak UMKM” masih beredar di TikTok',
    source: 'TikTok',
    channel: 'Social',
    date: '7 Jul 2026',
    tone: 'negative',
    tag: 'Hoaks',
    shares: '12,4 rb',
  },
  {
    id: 3,
    title: 'Liputan pencanangan UMKM Banjarbaru: tone positif di media lokal',
    source: 'Portal Kalsel',
    channel: 'Online',
    date: '6 Jul 2026',
    tone: 'positive',
    tag: 'Pencanangan',
    reach: '860 rb',
  },
  {
    id: 4,
    title: 'Laporan petugas palsu minta OTP di Bekasi & Depok — tiket WA Official',
    source: 'Facebook',
    channel: 'Social',
    date: '6 Jul 2026',
    tone: 'negative',
    tag: 'Penipuan',
    reach: '3,1 jt',
  },
  {
    id: 5,
    title: 'TVRI & TV nasional tayangkan door-to-door CAPI dengan framing edukatif',
    source: 'TVRI',
    channel: 'TV/Radio',
    date: '7 Jul 2026',
    tone: 'positive',
    tag: 'Edukasi',
    reach: 'est. 4,1%',
  },
  {
    id: 6,
    title: 'Advertorial Tiga TIR di 6 media cetak nasional edisi hari ini',
    source: 'Kompas',
    channel: 'Cetak',
    date: '7 Jul 2026',
    tone: 'neutral',
    tag: 'Tiga TIR',
    reach: '1,2 jt',
  },
];

interface TopicItem {
  id: string;
  name: string;
  query: string;
  count: number;
  sparkline24h: number[];
  hasNegativeSpike: boolean;
}

const MOCK_TOPICS: TopicItem[] = [
  {
    id: 't1',
    name: 'Hoaks Pajak UMKM',
    query: 'sensus pajak OR "data untuk pajak"',
    count: 4216,
    sparkline24h: [40, 55, 80, 120, 180, 220, 260, 300, 280, 250, 210, 190, 170, 160, 155, 150, 148, 145],
    hasNegativeSpike: true,
  },
  {
    id: 't2',
    name: 'Petugas Palsu / OTP',
    query: 'petugas palsu OTP transfer',
    count: 1318,
    sparkline24h: [60, 62, 70, 75, 80, 85, 90, 95, 100, 98, 96, 94, 92, 90, 88, 86, 85, 84],
    hasNegativeSpike: true,
  },
  {
    id: 't3',
    name: 'Edukasi Tiga TIR',
    query: '#TigaTIR OR "kenali petugas resmi"',
    count: 1840,
    sparkline24h: [40, 42, 48, 55, 62, 70, 78, 85, 92, 100, 110, 120, 130, 140, 150, 160, 170, 180],
    hasNegativeSpike: false,
  },
];

const TONE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  positive: { bg: '#E8F6EE', color: UMKM_COLORS.pos, border: '#C4E6D2' },
  neutral: { bg: 'var(--cream)', color: UMKM_COLORS.ink2, border: 'var(--line)' },
  negative: { bg: '#FDEAE7', color: UMKM_COLORS.neg, border: '#F5C9C1' },
};

function MiniSparkline({ data, className = '' }: { data: number[]; className?: string }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg className={className} width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        opacity={0.9}
      />
    </svg>
  );
}

function SourceIcon({ source }: { source: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg text-[10px] font-bold uppercase shrink-0 border"
      style={{
        width: 28,
        height: 28,
        background: 'var(--cream-2)',
        borderColor: 'var(--line)',
        color: 'var(--ink-2)',
      }}
    >
      {source.charAt(0)}
    </div>
  );
}

const pillActive = {
  background: 'var(--ink)',
  color: '#fff',
  borderColor: 'var(--ink)',
};
const pillIdle = {
  background: '#fff',
  color: 'var(--ink-2)',
  borderColor: 'var(--line)',
};

export function SearchArchive() {
  const [query, setQuery] = useState('');
  const [channelFilters, setChannelFilters] = useState<string[]>([]);
  const [toneFilter, setToneFilter] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const instantResults = useMemo(() => {
    if (!query.trim()) return INSTANT_SUGGESTIONS.slice(0, 5);
    const q = query.toLowerCase();
    return INSTANT_SUGGESTIONS.filter((s) => s.text.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  const filteredClippings = useMemo(() => {
    let list = MOCK_CLIPPINGS;
    if (channelFilters.length && !channelFilters.includes('all')) {
      list = list.filter((c) => channelFilters.includes(c.channel));
    }
    if (toneFilter) list = list.filter((c) => c.tone === toneFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.source.toLowerCase().includes(q) ||
          c.tag.toLowerCase().includes(q),
      );
    }
    return list;
  }, [channelFilters, toneFilter, query]);

  const toggleChannel = (id: string) => {
    if (id === 'all') {
      setChannelFilters([]);
      return;
    }
    setChannelFilters((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredClippings.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredClippings.map((c) => c.id)));
  };

  return (
    <UMKMPageShell title="Search & Archive" subtitle="Media listening discovery" active="search">
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
        <section className="col-span-12">
          <div ref={searchRef} className="relative">
            <div
              className="rounded-xl border bg-white p-4 flex flex-col sm:flex-row gap-3"
              style={{ borderColor: 'var(--line)', boxShadow: 'var(--shadow-se)' }}
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--ink-3)' }} />
                <input
                  type="text"
                  placeholder="Keyword, media, atau isu UMKM..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all"
                  style={{ borderColor: 'var(--line)', background: 'var(--cream)', color: 'var(--ink)' }}
                />
                <AnimatePresence>
                  {searchFocused && instantResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full left-0 right-0 mt-2 rounded-xl border bg-white overflow-hidden z-50"
                      style={{ borderColor: 'var(--line)', boxShadow: 'var(--shadow-se)' }}
                    >
                      <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-b" style={{ color: 'var(--ink-3)', borderColor: 'var(--cream-2)' }}>
                        Instant Results
                      </p>
                      {instantResults.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setQuery(s.text);
                            setSearchFocused(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-[var(--cream)] transition-colors"
                        >
                          <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                            {s.text}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: 'var(--ink-3)' }}>
                            {s.type === 'trending' && <TrendingUp className="w-3 h-3" style={{ color: ACCENT }} />}
                            {s.count.toLocaleString('id-ID')} mentions
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  className="px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border"
                  style={pillIdle}
                >
                  <Filter className="w-3.5 h-3.5" />
                  Filter
                </button>
                <button
                  className="px-4 py-3 rounded-xl text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${UMKM_COLORS.orange}, ${UMKM_COLORS.orangeDeep})` }}
                >
                  <Search className="w-3.5 h-3.5" />
                  Search
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {CHANNEL_PILLS.map((p) => {
                const active = (p.id === 'all' && channelFilters.length === 0) || channelFilters.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleChannel(p.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors"
                    style={active ? pillActive : pillIdle}
                  >
                    {p.icon}
                    {p.label}
                  </button>
                );
              })}
              <span className="w-px h-5 self-center mx-1" style={{ background: 'var(--line-2)' }} />
              {TONE_PILLS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setToneFilter(toneFilter === p.id ? null : p.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors"
                  style={toneFilter === p.id ? pillActive : pillIdle}
                >
                  Tone: {p.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="col-span-12">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase flex items-center gap-2" style={{ color: 'var(--ink-3)' }}>
              <Hash className="w-3.5 h-3.5" />
              Saved Topics
            </p>
            <button className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: UMKM_COLORS.orangeDeep }}>
              <Plus className="w-3.5 h-3.5" />
              New Topic
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_TOPICS.map((t) => (
              <motion.div
                key={t.id}
                className="rounded-xl p-4 flex flex-col gap-3 border bg-white"
                style={{ borderColor: 'var(--line)', boxShadow: 'var(--shadow-se)' }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
                    {t.name}
                  </p>
                  {t.hasNegativeSpike && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shrink-0"
                      style={{ background: '#FDEAE7', color: 'var(--neg)', borderColor: '#F5C9C1' }}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Priority
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-mono" style={{ color: 'var(--ink-3)' }}>
                  {t.query}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <MiniSparkline data={t.sparkline24h} />
                  <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--ink-3)' }}>
                    {t.count.toLocaleString('id-ID')} mentions
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="col-span-12 pb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: 'var(--ink-3)' }}>
              Hasil Pencarian · {filteredClippings.length}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setBulkMode(!bulkMode)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border"
                style={bulkMode ? pillActive : pillIdle}
              >
                {bulkMode ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                Bulk Action
              </button>
              {bulkMode && (
                <button onClick={selectAll} className="px-3 py-2 rounded-lg text-[10px] font-bold uppercase border" style={pillIdle}>
                  {selectedIds.size === filteredClippings.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
              <div className="flex items-center rounded-lg border overflow-hidden bg-white" style={{ borderColor: 'var(--line)' }}>
                <button className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase" style={{ color: 'var(--ink-2)' }}>
                  <FileBarChart className="w-3.5 h-3.5" />
                  Summary
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase border-l" style={{ color: 'var(--ink-2)', borderColor: 'var(--line)' }}>
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add to Report
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase border-l" style={{ color: UMKM_COLORS.orangeDeep, borderColor: 'var(--line)' }}>
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredClippings.map((row) => {
              const tone = TONE_STYLES[row.tone];
              return (
                <motion.article
                  key={row.id}
                  layout
                  className="rounded-xl border bg-white overflow-hidden"
                  style={{ borderColor: 'var(--line)', boxShadow: 'var(--shadow-se)' }}
                >
                  <div className="flex items-start gap-4 p-4">
                    {bulkMode && (
                      <button
                        onClick={() => toggleSelect(row.id)}
                        className="mt-0.5 flex items-center justify-center rounded border w-5 h-5 shrink-0"
                        style={
                          selectedIds.has(row.id)
                            ? { borderColor: 'var(--ink)', background: 'var(--ink)', color: '#fff' }
                            : { borderColor: 'var(--line)', background: '#fff' }
                        }
                      >
                        {selectedIds.has(row.id) ? <Check className="w-3 h-3" /> : null}
                      </button>
                    )}
                    <SourceIcon source={row.source} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold leading-snug" style={{ color: 'var(--ink)' }}>
                        {row.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]" style={{ color: 'var(--ink-3)' }}>
                        <span className="font-medium">{row.source}</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {row.date}
                        </span>
                        {(row.reach || row.shares) && (
                          <>
                            <span>·</span>
                            <span className="font-medium" style={{ color: 'var(--ink-2)' }}>
                              {row.reach && `Reach: ${row.reach}`}
                              {row.shares && `Shared ${row.shares}`}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border"
                          style={{ background: tone.bg, color: tone.color, borderColor: tone.border }}
                        >
                          {row.tone}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
                          style={{ background: 'var(--cream)', color: 'var(--ink-2)', borderColor: 'var(--line)' }}
                        >
                          <Tag className="w-3 h-3" />
                          {row.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      </div>
    </UMKMPageShell>
  );
}
