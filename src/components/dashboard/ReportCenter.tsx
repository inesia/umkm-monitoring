'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Mail,
  MessageCircle,
  Eye,
  Search,
  CalendarClock,
  CheckCircle2,
  X,
  ChevronRight,
} from 'lucide-react';
import { UMKMPageShell } from '@/components/umkm/UMKMPageShell';
import { UMKM_COLORS } from '@/lib/umkm-theme';

type PeriodKey = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

const FILTER_PILLS = [
  { id: 'all', label: 'All Reports' },
  { id: 'crisis', label: '#Crisis' },
  { id: 'sentiment', label: '#Sentiment' },
  { id: 'edu', label: '#Edukasi' },
  { id: 'takedown', label: '#Takedown' },
  { id: 'wa', label: '#WAOfficial' },
];

const SMART_SUGGESTIONS = [
  'Daily Engagement Brief',
  'Weekly Issue Review',
  'Crisis SLA Report',
  'Sentiment 24J',
  'Digital Army weekly',
  'WA funnel edukasi',
];

interface ReportItem {
  id: string;
  periodKey: PeriodKey;
  label: string;
  subtitle: string;
  lastGenerated: string;
  size: string;
  approvalStatus: 'Verified' | 'Pending' | 'In Review';
  isFeatured: boolean;
  tags: string[];
  keyFindings: string[];
  hasNewReport: boolean;
  thumbnail: 'chart' | 'pattern' | 'grid' | 'wave';
}

const REPORTS: ReportItem[] = [
  {
    id: 'r1',
    periodKey: 'daily',
    label: 'Daily',
    subtitle: 'Engagement Brief',
    lastGenerated: '2h ago',
    size: '3.8 MB',
    approvalStatus: 'Verified',
    isFeatured: false,
    tags: ['sentiment', 'crisis'],
    keyFindings: [
      '24.618 mentions (▲18%).',
      'Net sentiment +11 · tekanan hoaks pajak.',
      'ISU-0041 di L2, sisa SLA <2 jam.',
    ],
    hasNewReport: true,
    thumbnail: 'chart',
  },
  {
    id: 'r2',
    periodKey: 'weekly',
    label: 'Weekly',
    subtitle: 'Issue & Opportunity',
    lastGenerated: '1d ago',
    size: '7.4 MB',
    approvalStatus: 'Verified',
    isFeatured: false,
    tags: ['crisis', 'takedown'],
    keyFindings: [
      '7 isu aktif · 1 tinggi.',
      '17/41 konten hoaks di-takedown.',
      'Velocity negatif −18% sejak klarifikasi.',
    ],
    hasNewReport: false,
    thumbnail: 'pattern',
  },
  {
    id: 'r3',
    periodKey: 'monthly',
    label: 'Monthly',
    subtitle: 'Kanal Edukasi',
    lastGenerated: '5d ago',
    size: '11.2 MB',
    approvalStatus: 'In Review',
    isFeatured: false,
    tags: ['edu', 'wa'],
    keyFindings: [
      'Opt-in WA 642 rb (+38 rb minggu ini).',
      'CTR edukasi 21,4% · WA 2–5× lebih efektif.',
      'Bot deflection 86%.',
    ],
    hasNewReport: false,
    thumbnail: 'grid',
  },
  {
    id: 'r4',
    periodKey: 'quarterly',
    label: 'Quarterly',
    subtitle: 'Reputation & Coverage',
    lastGenerated: '2w ago',
    size: '22.0 MB',
    approvalStatus: 'Verified',
    isFeatured: true,
    tags: ['sentiment', 'edu', 'crisis'],
    keyFindings: [
      'Skor kesehatan isu rata-rata 82/100.',
      'Cakupan 38 provinsi · 514 kab/kota.',
      'Digital Army 248 personel aktif.',
    ],
    hasNewReport: true,
    thumbnail: 'wave',
  },
  {
    id: 'r5',
    periodKey: 'yearly',
    label: 'Yearly',
    subtitle: 'UMKM Year in Review',
    lastGenerated: '1m ago',
    size: '46.5 MB',
    approvalStatus: 'Verified',
    isFeatured: true,
    tags: ['sentiment', 'edu', 'wa'],
    keyFindings: [
      'Ringkasan fase CAPI lapangan.',
      'Tren sentimen & eskalasi sepanjang tahun.',
      'Board-ready summary untuk pimpinan BPS.',
    ],
    hasNewReport: false,
    thumbnail: 'chart',
  },
  {
    id: 'r6',
    periodKey: 'custom',
    label: 'Custom',
    subtitle: 'On-demand Report',
    lastGenerated: '—',
    size: '—',
    approvalStatus: 'Pending',
    isFeatured: false,
    tags: ['crisis'],
    keyFindings: ['Atur rentang tanggal, isu, dan kanal.'],
    hasNewReport: false,
    thumbnail: 'pattern',
  },
];

function ThumbnailBg({ type }: { type: ReportItem['thumbnail'] }) {
  const base = 'absolute inset-0 opacity-50';
  if (type === 'chart')
    return (
      <div
        className={`${base}`}
        style={{
          background: 'linear-gradient(135deg, rgba(5,150,105,0.12), transparent 55%, rgba(30,142,90,0.08))',
          filter: 'blur(28px)',
        }}
      />
    );
  if (type === 'pattern')
    return (
      <div
        className={base}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(5,150,105,0.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(4,120,87,0.1) 0%, transparent 50%)`,
          filter: 'blur(20px)',
        }}
      />
    );
  if (type === 'grid')
    return (
      <div
        className={`${base}`}
        style={{
          backgroundImage:
            'linear-gradient(rgba(191,210,227,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(191,210,227,0.9) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    );
  return (
    <div
      className={base}
      style={{
        background: 'linear-gradient(to top right, rgba(5,150,105,0.1), transparent, rgba(199,64,45,0.08))',
        filter: 'blur(30px)',
      }}
    />
  );
}

export function ReportCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredReports = useMemo(() => {
    let list = REPORTS;
    if (activeFilter !== 'all') {
      list = list.filter((r) => r.tags.includes(activeFilter));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          r.subtitle.toLowerCase().includes(q) ||
          r.tags.some((t) => t.includes(q)),
      );
    }
    return list;
  }, [activeFilter, searchQuery]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return SMART_SUGGESTIONS.slice(0, 4);
    const q = searchQuery.toLowerCase();
    return SMART_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 5);
  }, [searchQuery]);

  return (
    <UMKMPageShell title="Report Center" subtitle="Engagement intelligence archive" active="reports">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6 pb-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
              UMKM Engagement Reports
            </h2>
            <p className="mt-1 text-sm max-w-xl" style={{ color: 'var(--ink-3)' }}>
              Daily briefs, crisis SLA, edukasi funnel, dan export siap pimpinan.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs" style={{ color: 'var(--ink-3)' }}>
            <CalendarClock className="w-4 h-4" style={{ color: UMKM_COLORS.orangeDeep }} />
            <span className="font-bold uppercase tracking-widest">
              Daily · Weekly · Monthly · Quarterly · Yearly · Custom
            </span>
          </div>
        </div>

        <section className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--ink-3)' }} />
            <input
              type="text"
              placeholder="Cari laporan, tag, atau saran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
              style={{
                background: '#fff',
                borderColor: 'var(--line)',
                color: 'var(--ink)',
                boxShadow: 'var(--shadow-se)',
              }}
            />
            <AnimatePresence>
              {searchFocused && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-1 py-2 rounded-xl border bg-white z-30"
                  style={{ borderColor: 'var(--line)', boxShadow: 'var(--shadow-se)' }}
                >
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ink-3)' }}>
                    Smart suggestions
                  </p>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSearchQuery(s);
                      }}
                      className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-[var(--cream)]"
                      style={{ color: 'var(--ink)' }}
                    >
                      <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--ink-3)' }} />
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTER_PILLS.map((p) => {
              const active = activeFilter === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveFilter(p.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
                  style={
                    active
                      ? { background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)' }
                      : { background: '#fff', color: 'var(--ink-2)', borderColor: 'var(--line)' }
                  }
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report, i) => (
            <motion.article
              key={report.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group relative min-h-[280px] rounded-xl overflow-hidden border bg-white flex flex-col"
              style={{ borderColor: 'var(--line)', boxShadow: 'var(--shadow-se)' }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{
                  background:
                    'linear-gradient(90deg, var(--orange-deep), var(--orange) 30%, var(--amber) 60%, var(--amber))',
                }}
              />
              <ThumbnailBg type={report.thumbnail} />
              {report.isFeatured && (
                <div
                  className="absolute top-0 right-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl text-white"
                  style={{ background: UMKM_COLORS.orangeDeep }}
                >
                  Featured
                </div>
              )}

              <div className="relative flex-1 flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight" style={{ color: 'var(--ink)' }}>
                      {report.label}
                    </h3>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--ink-3)' }}>
                      {report.subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewReport(report)}
                    className="p-2 rounded-lg border bg-white transition-colors hover:bg-[var(--cream)]"
                    style={{ borderColor: 'var(--line)', color: 'var(--ink-2)' }}
                    title="Quick preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px]" style={{ color: 'var(--ink-3)' }}>
                  <span>Last: {report.lastGenerated}</span>
                  <span>Size: {report.size}</span>
                  <span className="flex items-center gap-1">
                    {report.approvalStatus === 'Verified' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: UMKM_COLORS.pos }} />
                        Verified
                      </>
                    ) : (
                      report.approvalStatus
                    )}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {report.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--cream-2)', color: UMKM_COLORS.orangeDeep }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 flex items-center gap-2 flex-wrap border-t" style={{ borderColor: 'var(--line)' }}>
                  <div className="flex items-center gap-1">
                    <button type="button" className="p-2 rounded-lg border bg-white" style={{ borderColor: 'var(--line)', color: 'var(--ink-2)' }} title="PDF">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 rounded-lg border bg-white" style={{ borderColor: 'var(--line)', color: 'var(--ink-2)' }} title="PowerPoint">
                      <Presentation className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 rounded-lg border bg-white" style={{ borderColor: 'var(--line)', color: 'var(--ink-2)' }} title="Excel">
                      <FileSpreadsheet className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <button type="button" className="relative p-2 rounded-lg border bg-white" style={{ borderColor: 'var(--line)', color: 'var(--ink-2)' }} title="WhatsApp">
                      <MessageCircle className="w-4 h-4" />
                      {report.hasNewReport && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white" style={{ background: UMKM_COLORS.neg }} />
                      )}
                    </button>
                    <button type="button" className="p-2 rounded-lg border bg-white" style={{ borderColor: 'var(--line)', color: 'var(--ink-2)' }} title="Email">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        {filteredReports.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: 'var(--ink-3)' }}>
            Tidak ada laporan yang cocok. Coba filter atau kata kunci lain.
          </p>
        )}
      </div>

      <AnimatePresence>
        {previewReport && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/35 backdrop-blur-sm z-40"
              onClick={() => setPreviewReport(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl border bg-white p-6 z-50"
              style={{ borderColor: 'var(--line)', boxShadow: 'var(--shadow-se)' }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-black tracking-tight" style={{ color: 'var(--ink)' }}>
                    {previewReport.label} — {previewReport.subtitle}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--ink-3)' }}>
                    Key findings · {previewReport.lastGenerated} · {previewReport.size}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewReport(null)}
                  className="p-2 rounded-lg"
                  style={{ color: 'var(--ink-3)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--ink-2)' }}>
                {previewReport.keyFindings.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span style={{ color: UMKM_COLORS.orangeDeep }}>•</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t flex gap-2" style={{ borderColor: 'var(--line)' }}>
                <button
                  type="button"
                  className="flex-1 py-2 rounded-xl text-white text-xs font-bold uppercase tracking-wide"
                  style={{ background: 'var(--ink)' }}
                >
                  Open full report
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewReport(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                  style={{ borderColor: 'var(--line)', color: 'var(--ink-2)' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </UMKMPageShell>
  );
}
