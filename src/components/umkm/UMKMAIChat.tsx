'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, Send, MessageCircle, UserPlus } from 'lucide-react';
import type { EscalationIssue } from '@/types/umkm';
import { cn } from '@/lib/utils';

/** Simulated WA Official UMKM desk (demo) */
const WA_OFFICIAL_NUMBER = '6281115002026';

type MsgAction = {
  id: string;
  label: string;
  kind: 'open-wa' | 'assign-wa';
};

type Msg = {
  id: string;
  role: 'ai' | 'me';
  html: string;
  actions?: MsgAction[];
};

function formatSla(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h} jam ${m} menit`;
}

function buildWaMessage(issue: EscalationIssue, extra?: string) {
  const active = issue.levels.find((l) => l.state === 'active');
  const lines = [
    `[Engagement Copilot] Assign isu ${issue.id}`,
    issue.title,
    `Level: ${active?.label ?? 'L2'} · ${active?.name ?? 'Tim Humas'}`,
    `SLA sisa: ~${formatSla(issue.slaSeconds)}`,
    extra ?? 'Mohon follow-up via WA Official UMKM.',
  ];
  return lines.join('\n');
}

function openWhatsApp(issue: EscalationIssue, extra?: string) {
  const url = `https://wa.me/${WA_OFFICIAL_NUMBER}?text=${encodeURIComponent(buildWaMessage(issue, extra))}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function buildReplies(issue: EscalationIssue): {
  keys: string[];
  html: string;
  actions: MsgAction[];
}[] {
  const active = issue.levels.find((l) => l.state === 'active');
  const sla = formatSla(issue.slaSeconds);
  const waActions: MsgAction[] = [
    { id: 'open-wa', label: 'Buka WhatsApp', kind: 'open-wa' },
    { id: 'assign-wa', label: 'Assign ke WA Desk', kind: 'assign-wa' },
  ];

  return [
    {
      keys: ['assign', 'tugaskan', 'whatsapp', 'wa official', 'wa desk', 'blast wa'],
      html: `<b>Assign ke WhatsApp Official</b><br/><br/>Isu <b>${issue.id}</b> siap ditugaskan ke <b>WA Desk UMKM</b> (${WA_OFFICIAL_NUMBER}).<br/><br/><b>Target:</b> ${active?.label ?? 'L2'} · ${active?.name ?? 'Tim Humas'} (${active?.assignee ?? 'on-call'})<br/><b>Kanal:</b> WA Official · blast / 1:1 desk<br/><b>SLA:</b> ~${sla}<br/><br/><b>Draft pesan WA:</b><br/>“Halo Desk — mohon handle ${issue.id}. Klarifikasi hoaks KUR cicilan ganda. Prioritas debitur terdampak & amplifier TikTok/X.”<br/><br/>Ketuk tombol di bawah untuk buka WhatsApp atau konfirmasi assign.`,
      actions: waActions,
    },
    {
      keys: ['ringkasan', 'summary', 'eksekutif', 'situasi', 'briefing'],
      html: `<b>Ringkasan situasi live</b><br/><br/><b>Isu aktif:</b> ${issue.id} — ${issue.title}<br/><br/>${issue.description}<br/><br/><b>Level berjalan:</b> ${active?.label ?? '—'} · ${active?.name ?? '—'} (${active?.status ?? '—'})<br/><b>Sisa SLA:</b> ~${sla}<br/><b>Severity:</b> ${issue.severity}<br/><br/>Mau rekomendasi respons, assign ke WhatsApp, atau draft klarifikasi?`,
      actions: [{ id: 'assign-wa', label: 'Assign ke WhatsApp', kind: 'assign-wa' }],
    },
    {
      keys: ['eskalasi', 'rekomendasi', 'l3', 'level 3', 'respon', 'respons'],
      html: `<b>Rekomendasi respons — ${issue.id}</b><br/><br/><b>Posisi:</b> ${active?.label ?? 'L2'} berjalan · sisa SLA ~${sla}.<br/><br/><b>Saran 3 langkah (simulasi):</b><br/>1) Setujui blast WA klarifikasi ke segmen debitur KUR terdampak.<br/>2) Siapkan stitch/reply di kanal sumber sebelum takedown selesai.<br/>3) Tahan eskalasi L3 60–90 menit; eskalasi otomatis jika velocity negatif tidak turun ≥30% saat SLA berakhir.<br/><br/><b>Draft respons singkat:</b><br/>“Hoaks cicilan ganda KUR dibantah. Gunakan kanal resmi KUR / Sapa UMKM. Laporkan phishing & petugas palsu ke WA Official.”<br/><br/>Assign ke WA Desk sekarang?`,
      actions: waActions,
    },
    {
      keys: ['draft', 'klarifikasi', 'rilis', 'pernyataan', 'jawaban'],
      html: `<b>Draft jawaban/klarifikasi (siap edit)</b><br/><br/><b>Judul:</b> Klarifikasi Hoaks KUR: Data Tidak Dipakai Tarik Cicilan Ganda<br/><br/><b>Isi:</b><br/>“Kementerian UMKM menegaskan klaim data KUR dipakai menarik cicilan ganda adalah hoaks. Debitur hanya dilayani melalui kanal resmi perbankan himbara / Sapa UMKM. Waspadai tautan phishing dan petugas palsu. Laporkan via WA Official UMKM.”<br/><br/>Terkait isu: <i>${issue.title}</i><br/><br/>Simulasi siap — kirim ke Tim Humas / WA Desk untuk approval?`,
      actions: [
        { id: 'open-wa', label: 'Kirim via WhatsApp', kind: 'open-wa' },
        { id: 'assign-wa', label: 'Assign ke WA Desk', kind: 'assign-wa' },
      ],
    },
    {
      keys: ['hoaks', 'kur', 'analisis', 'analisa', 'isu', 'cicilan'],
      html: `<b>Analisis isu — ${issue.id}</b><br/><br/>${issue.description}<br/><br/><b>Kerentanan narasi:</b> Hoaks menempel pada kekhawatiran cicilan KUR — bantahan generik kurang efektif.<br/><br/><b>Yang terbukti lebih kuat (simulasi):</b> klarifikasi resmi + kutipan media + kontra-narasi Digital Army + verifikasi via WA bot.<br/><br/><b>Next best action:</b> assign blast klarifikasi ke WA Official sebelum SLA habis.`,
      actions: [{ id: 'assign-wa', label: 'Assign ke WhatsApp', kind: 'assign-wa' }],
    },
    {
      keys: ['briefing', '1 halaman', 'halaman', 'mingguan', 'program'],
      html: `<b>Briefing 1 halaman — ${issue.id}</b><br/><br/>Disusun (simulasi): ringkasan situasi, kronologi singkat, peta sebaran, matriks respons L1–L3, dan 2 opsi keputusan dengan trade-off.<br/><br/><b>Isu:</b> ${issue.title}<br/><b>SLA tersisa:</b> ~${sla}<br/><br/>Siap diekspor PDF / dikirim ke pimpinan via WhatsApp.`,
      actions: [{ id: 'open-wa', label: 'Bagikan via WhatsApp', kind: 'open-wa' }],
    },
  ];
}

const CHIPS = [
  { label: 'Ringkasan isu aktif', q: 'Buat ringkasan situasi isu aktif' },
  { label: 'Assign ke WhatsApp', q: 'Assign isu aktif ke WhatsApp Official' },
  { label: 'Rekomendasi respons', q: 'Rekomendasi eskalasi dan respons' },
  { label: 'Draft klarifikasi', q: 'Draft klarifikasi resmi' },
];

const WELCOME =
  'Halo — saya <b>Engagement Copilot</b> (simulasi). Saya bisa bantu ringkasan isu, <b>assign ke WhatsApp Official</b>, rekomendasi respons, atau draft klarifikasi. Ketuk ikon WA untuk chat desk terkait.';

function aiReply(q: string, issue: EscalationIssue): Pick<Msg, 'html' | 'actions'> {
  const lq = q.toLowerCase();
  const hit = buildReplies(issue).find((c) => c.keys.some((k) => lq.includes(k)));
  if (hit) return { html: hit.html, actions: hit.actions };
  return {
    html: `Saya mencatat: “<b>${q}</b>”.<br/><br/>Simulasi terhubung ke <b>${issue.id}</b> (SLA ~${formatSla(issue.slaSeconds)}). Coba: assign ke WhatsApp, ringkasan situasi, rekomendasi respons, atau draft klarifikasi.`,
    actions: [
      { id: 'open-wa', label: 'Buka WhatsApp', kind: 'open-wa' },
      { id: 'assign-wa', label: 'Assign ke WA Desk', kind: 'assign-wa' },
    ],
  };
}

export function UMKMAIChat({
  escalation,
  externalAsk,
  onExternalAskConsumed,
}: {
  escalation: EscalationIssue;
  externalAsk?: string | null;
  onExternalAskConsumed?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [assignNote, setAssignNote] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 'welcome', role: 'ai', html: WELCOME, actions: [
      { id: 'open-wa', label: 'Buka WhatsApp', kind: 'open-wa' },
      { id: 'assign-wa', label: 'Assign ke WA Desk', kind: 'assign-wa' },
    ] },
  ]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const askRef = useRef<(q: string) => void>(() => {});

  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing, open, assignNote]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!assignNote) return;
    const t = window.setTimeout(() => setAssignNote(null), 2800);
    return () => clearTimeout(t);
  }, [assignNote]);

  const confirmAssignWa = () => {
    const active = escalation.levels.find((l) => l.state === 'active');
    setAssignNote(
      `Assigned ${escalation.id} · ${active?.label ?? 'L2'} → WA Official Desk`,
    );
    setMsgs((m) => [
      ...m,
      {
        id: `ai-assign-${Date.now()}`,
        role: 'ai',
        html: `<b>Assign dikonfirmasi (simulasi)</b><br/><br/>Tiket <b>${escalation.id}</b> diteruskan ke <b>WhatsApp Official UMKM</b>.<br/>PIC desk: ${active?.assignee ?? 'WA on-call'} · level ${active?.label ?? 'L2'}.<br/><br/>Status: <b>BERJALAN</b> di antrian blast / respons 1:1. Buka WhatsApp untuk kirim briefing ke desk.`,
        actions: [{ id: 'open-wa', label: 'Buka WhatsApp sekarang', kind: 'open-wa' }],
      },
    ]);
    setOpen(true);
  };

  const handleAction = (action: MsgAction) => {
    if (action.kind === 'open-wa') {
      openWhatsApp(
        escalation,
        action.label.toLowerCase().includes('kirim') || action.label.toLowerCase().includes('bagikan')
          ? 'Mohon review draft klarifikasi dari Engagement Copilot.'
          : undefined,
      );
      return;
    }
    confirmAssignWa();
  };

  const ask = (q: string) => {
    const text = q.trim();
    if (!text || typing) return;
    setInput('');
    setOpen(true);
    const meId = `me-${Date.now()}`;
    setMsgs((m) => [...m, { id: meId, role: 'me', html: text }]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      const reply = aiReply(text, escalation);
      setMsgs((m) => [
        ...m,
        { id: `ai-${Date.now()}`, role: 'ai', html: reply.html, actions: reply.actions },
      ]);
    }, 900 + Math.random() * 500);
  };
  askRef.current = ask;

  useEffect(() => {
    if (!externalAsk) return;
    askRef.current(externalAsk);
    onExternalAskConsumed?.();
  }, [externalAsk, onExternalAskConsumed]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Engagement Copilot"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="se-ai-panel fixed z-[90] flex flex-col overflow-hidden rounded-2xl border"
            style={{
              right: 22,
              bottom: 96,
              width: 372,
              maxWidth: 'calc(100vw - 32px)',
              height: 480,
              maxHeight: 'calc(100vh - 140px)',
              background: 'linear-gradient(180deg, #f4f8fc 0%, #e8f0f7 100%)',
              borderColor: '#bfd2e3',
              boxShadow: '0 24px 60px -18px rgba(31, 59, 87, 0.35)',
            }}
          >
            <div
              className="flex items-center gap-2.5 px-3.5 py-3 border-b shrink-0"
              style={{
                background: 'linear-gradient(135deg, #eef4fa, #dce6f1)',
                borderColor: '#bfd2e3',
              }}
            >
              <div
                className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #1f3b57, #0b192c)' }}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[0.84rem] font-bold" style={{ color: '#152943' }}>
                  Engagement Copilot
                </div>
                <div className="text-[0.62rem] font-semibold" style={{ color: '#5f6b76' }}>
                  Simulasi · eskalasi · WhatsApp desk
                </div>
              </div>
              <button
                type="button"
                aria-label="Buka WhatsApp Official"
                title="WhatsApp Official UMKM"
                onClick={() => openWhatsApp(escalation)}
                className="se-ai-wa-btn shrink-0 w-8 h-8 rounded-[10px] flex items-center justify-center text-white"
                style={{ background: '#25D366' }}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md"
                style={{ color: '#5f6b76' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {assignNote && (
              <div
                className="px-3 py-1.5 text-[0.62rem] font-bold shrink-0 border-b"
                style={{
                  background: '#ECFDF5',
                  color: '#15803D',
                  borderColor: '#BBF7D0',
                }}
              >
                {assignNote}
              </div>
            )}

            <div
              ref={bodyRef}
              className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 min-h-0"
              style={{ background: 'linear-gradient(180deg, #f7fafc 0%, #eef4fa 55%, #e7eef6 100%)' }}
            >
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'max-w-[92%] flex flex-col gap-1.5',
                    m.role === 'ai' ? 'self-start' : 'self-end',
                  )}
                >
                  <div
                    className={cn(
                      'px-3 py-2 rounded-xl text-[0.75rem] leading-snug',
                      m.role === 'ai'
                        ? 'bg-white/95 border rounded-bl-sm'
                        : 'text-white rounded-br-sm',
                    )}
                    style={
                      m.role === 'ai'
                        ? { borderColor: '#bfd2e3', color: '#152943' }
                        : { background: 'linear-gradient(135deg, #1f3b57, #0b192c)' }
                    }
                    dangerouslySetInnerHTML={{ __html: m.html }}
                  />
                  {m.role === 'ai' && m.actions && m.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 px-0.5">
                      {m.actions.map((a) => (
                        <button
                          key={`${m.id}-${a.id}`}
                          type="button"
                          onClick={() => handleAction(a)}
                          className="inline-flex items-center gap-1 text-[0.62rem] font-bold px-2.5 py-1.5 rounded-full border bg-white"
                          style={
                            a.kind === 'open-wa'
                              ? { borderColor: '#86EFAC', color: '#15803D', background: '#F0FDF4' }
                              : { borderColor: '#bfd2e3', color: '#1f3b57', background: '#f4f8fc' }
                          }
                        >
                          {a.kind === 'open-wa' ? (
                            <MessageCircle className="w-3 h-3" />
                          ) : (
                            <UserPlus className="w-3 h-3" />
                          )}
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div
                  className="self-start bg-white/95 border px-3 py-2.5 rounded-xl rounded-bl-sm"
                  style={{ borderColor: '#bfd2e3' }}
                >
                  <span className="se-ai-typing">
                    <i /><i /><i />
                  </span>
                </div>
              )}
            </div>

            <div
              className="flex gap-1.5 flex-wrap px-3 pb-2 shrink-0"
              style={{ background: '#e8f0f7' }}
            >
              {CHIPS.map((c) => (
                <button
                  key={c.q}
                  type="button"
                  onClick={() => ask(c.q)}
                  className="text-[0.64rem] font-bold px-2.5 py-1.5 rounded-full border bg-white/90"
                  style={{
                    borderColor: c.q.toLowerCase().includes('whatsapp')
                      ? '#86EFAC'
                      : '#bfd2e3',
                    color: c.q.toLowerCase().includes('whatsapp')
                      ? '#15803D'
                      : '#1f3b57',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div
              className="flex gap-2 px-3 py-2.5 border-t shrink-0"
              style={{ borderColor: '#bfd2e3', background: '#eef4fa' }}
            >
              <button
                type="button"
                aria-label="Buka WhatsApp"
                title="WhatsApp Official"
                onClick={() => openWhatsApp(escalation)}
                className="rounded-[10px] w-10 shrink-0 flex items-center justify-center text-white"
                style={{ background: '#25D366' }}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') ask(input);
                }}
                placeholder="Assign WA / tanya isu…"
                className="flex-1 rounded-[10px] border px-3 py-2 text-[0.76rem] outline-none bg-white"
                style={{ borderColor: '#bfd2e3', color: '#152943' }}
              />
              <button
                type="button"
                onClick={() => ask(input)}
                className="rounded-[10px] px-3.5 font-bold text-[0.74rem] text-white flex items-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #1f3b57, #0b192c)' }}
              >
                <Send className="w-3.5 h-3.5" />
                Kirim
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label={open ? 'Tutup Engagement Copilot' : 'Buka Engagement Copilot'}
        onClick={() => setOpen((v) => !v)}
        className="se-ai-fab fixed z-[90] w-14 h-14 rounded-full border-0 text-white flex items-center justify-center cursor-pointer"
        style={{
          right: 22,
          bottom: 56,
          background: 'linear-gradient(135deg, #1f3b57, #0b192c)',
          boxShadow: '0 10px 28px -6px rgba(31, 59, 87, 0.55)',
        }}
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>
    </>
  );
}
