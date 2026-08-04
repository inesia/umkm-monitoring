'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, Sparkles, UserPlus, RotateCcw } from 'lucide-react';
import type { EscalationIssue, EscalationLevel } from '@/types/umkm';
import { UMKMCard, SEPill } from './UMKMCard';
import { cn } from '@/lib/utils';

const ACCENT = {
  L1: '#0B192C',
  L2: '#152943',
  L3: '#1F3B57',
} as const;

const AI_TICKER = [
  'Minta AI buat briefing 1 halaman',
  'Analisis isu & rekomendasi respons',
  'Draft klarifikasi resmi siap edit',
  'Simulasi eskalasi L3 sebelum putuskan',
];

function formatSla(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

function statusBadge(state: EscalationLevel['state']) {
  if (state === 'done') return { label: 'SELESAI', tone: 'done' as const };
  if (state === 'active') return { label: 'BERJALAN', tone: 'active' as const };
  return { label: 'SIAGA', tone: 'pending' as const };
}

function levelAccent(label: string) {
  if (label === 'L1') return ACCENT.L1;
  if (label === 'L2') return ACCENT.L2;
  return ACCENT.L3;
}

type EscalationPanelProps = {
  data: EscalationIssue;
  variant?: 'menteri' | 'krisis' | 'ringkasan';
  onOpenWarRoom?: () => void;
  onAskAI?: (prompt: string) => void;
};

function FlipTile({
  level,
  flipped,
  onFlip,
  arrive,
  reducedMotion,
  onWarRoom,
  onAssign,
  layout = 'stack',
}: {
  level: EscalationLevel;
  flipped: boolean;
  onFlip: () => void;
  arrive?: boolean;
  reducedMotion: boolean;
  onWarRoom: () => void;
  onAssign: () => void;
  layout?: 'stack' | 'rotate';
}) {
  const accent = levelAccent(level.label);
  const badge = statusBadge(level.state);
  const evidence = level.evidence?.length
    ? level.evidence
    : [level.desc, 'Bukti detail belum terlampir'];

  return (
    <div
      className={cn(
        'esc-flip-tile min-h-0 w-full',
        layout === 'rotate' ? 'h-full' : 'flex-1',
        arrive && !reducedMotion && 'esc-l1-arrive',
        flipped && 'is-flipped',
        reducedMotion && 'esc-flip-reduced',
      )}
    >
      <div
        className="esc-flip-inner"
        style={{
          transitionDuration: reducedMotion ? '0ms' : '280ms',
        }}
      >
        {/* Front */}
        <button
          type="button"
          className="esc-flip-face esc-flip-front"
          style={{ borderColor: `${accent}55`, boxShadow: `inset 3px 0 0 ${accent}` }}
          onClick={onFlip}
          aria-expanded={flipped}
          aria-label={`${level.label} ${level.name}, ${badge.label}. Ketuk untuk lihat bukti`}
        >
          <div className="flex items-start gap-1.5 h-full min-h-0">
            <span
              className="w-6 h-6 rounded-md flex items-center justify-center text-[0.55rem] font-bold shrink-0 text-white"
              style={{ background: accent }}
            >
              {level.label}
            </span>
            <div className="min-w-0 flex-1 flex flex-col h-full text-left">
              <div className="flex items-center justify-between gap-1">
                <div className="text-[0.64rem] font-bold truncate" style={{ color: 'var(--ink)' }}>
                  {level.name}
                </div>
                <span className={cn('esc-status-badge', `tone-${badge.tone}`)}>{badge.label}</span>
              </div>
              <div
                className="text-[0.52rem] leading-tight line-clamp-2 mt-0.5"
                style={{ color: 'var(--ink-3)' }}
              >
                {level.desc}
              </div>
              <div
                className="mt-auto pt-0.5 text-[0.48rem] font-semibold uppercase tracking-wide"
                style={{ color: accent }}
              >
                Flip · evidence
              </div>
            </div>
          </div>
        </button>

        {/* Back */}
        <div
          className="esc-flip-face esc-flip-back"
          style={{ borderColor: `${accent}66`, boxShadow: `inset 3px 0 0 ${accent}` }}
        >
          <div className="flex flex-col h-full min-h-0 gap-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[0.58rem] font-bold" style={{ color: accent }}>
                {level.label} · Evidence
              </span>
              <button
                type="button"
                className="text-[0.48rem] font-bold uppercase flex items-center gap-0.5"
                style={{ color: 'var(--ink-3)' }}
                onClick={onFlip}
              >
                <RotateCcw className="w-2.5 h-2.5" /> Back
              </button>
            </div>
            <ul className="flex-1 min-h-0 overflow-hidden space-y-0.5">
              {evidence.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="text-[0.5rem] leading-snug line-clamp-1 pl-1.5 border-l-2"
                  style={{ color: 'var(--ink-2)', borderColor: accent }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                onClick={onWarRoom}
                className="flex-1 flex items-center justify-center gap-1 rounded-md px-1.5 py-1 text-[0.52rem] font-bold text-white"
                style={{ background: 'var(--ink)' }}
              >
                <Zap className="w-2.5 h-2.5" /> War Room
              </button>
              <button
                type="button"
                onClick={onAssign}
                className="flex-1 flex items-center justify-center gap-1 rounded-md px-1.5 py-1 text-[0.52rem] font-bold border"
                style={{ borderColor: accent, color: accent, background: '#fff' }}
              >
                <UserPlus className="w-2.5 h-2.5" /> Assign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EscalationPanel({
  data,
  variant = 'menteri',
  onOpenWarRoom,
  onAskAI,
}: EscalationPanelProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [sla, setSla] = useState(data.slaSeconds);
  const [tipIndex, setTipIndex] = useState(0);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [l1Arrive, setL1Arrive] = useState(false);
  const [assignMsg, setAssignMsg] = useState<string | null>(null);
  const activeIdx = Math.max(
    0,
    data.levels.findIndex((l) => l.state === 'active'),
  );
  const [rotateIdx, setRotateIdx] = useState(activeIdx >= 0 ? activeIdx : 0);
  const pauseRotateUntil = useRef(0);

  useEffect(() => {
    setSla(data.slaSeconds);
    const id = setInterval(() => setSla((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [data.slaSeconds]);

  useEffect(() => {
    const id = setInterval(() => {
      setTipIndex((i) => (i + 1) % AI_TICKER.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Ringkasan: auto-cycle one level card at a time
  useEffect(() => {
    if ((variant !== 'menteri' && variant !== 'ringkasan') || data.levels.length < 2) return;
    const ms = reducedMotion ? 7000 : 4200;
    const id = window.setInterval(() => {
      if (Date.now() < pauseRotateUntil.current) return;
      setFlippedId(null);
      setRotateIdx((i) => (i + 1) % data.levels.length);
    }, ms);
    return () => clearInterval(id);
  }, [variant, data.levels.length, reducedMotion]);

  // New L1 arrival cue (on issue change + periodic standby demo)
  useEffect(() => {
    setL1Arrive(true);
    const t = window.setTimeout(() => setL1Arrive(false), reducedMotion ? 0 : 420);
    return () => clearTimeout(t);
  }, [data.id, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || variant !== 'krisis') return;
    const id = window.setInterval(() => {
      setL1Arrive(true);
      window.setTimeout(() => setL1Arrive(false), 420);
    }, 52000);
    return () => clearInterval(id);
  }, [reducedMotion, variant]);

  useEffect(() => {
    if (!assignMsg) return;
    const t = window.setTimeout(() => setAssignMsg(null), 2200);
    return () => clearTimeout(t);
  }, [assignMsg]);

  const slaCritical = sla < 3600;
  const warRoomLabel =
    variant === 'krisis' ? 'Eskalasi ke Level 3' : 'Open War Room';
  const warRoomClick =
    variant === 'krisis'
      ? () => onAskAI?.('Rekomendasi eskalasi ke Level 3 sekarang')
      : () => onOpenWarRoom?.();

  const aiPrompt =
    variant === 'krisis'
      ? 'Analisis isu hoaks pajak dan rekomendasi eskalasi'
      : 'Buat briefing 1 halaman isu hoaks pajak';

  const handleAssign = useCallback(
    (level: EscalationLevel) => {
      setAssignMsg(`Assigned · ${level.label} → WA Official`);
      onAskAI?.(
        `Assign ${level.label} (${level.name}) ke WhatsApp Official untuk isu ${data.id}`,
      );
    },
    [onAskAI, data.id],
  );

  const toggleFlip = useCallback((id: string) => {
    pauseRotateUntil.current = Date.now() + 10000;
    setFlippedId((prev) => (prev === id ? null : id));
  }, []);

  const selectRotate = useCallback((idx: number) => {
    pauseRotateUntil.current = Date.now() + 10000;
    setFlippedId(null);
    setRotateIdx(idx);
  }, []);

  const rotatingLevel = data.levels[rotateIdx] ?? data.levels[0];
  const showStack = variant === 'krisis';

  return (
    <UMKMCard
      title={variant === 'krisis' ? 'Protokol Eskalasi' : 'Eskalasi Isu'}
      action={
        <SEPill tone="high">{variant === 'krisis' ? data.id : 'L1 / L2 / L3'}</SEPill>
      }
      tone="esc"
      className="h-full"
    >
      <div className="flex flex-col h-full min-h-0 gap-1.5">
        <div
          className={cn(
            'esc-sla-timer shrink-0 rounded-lg border bg-white px-2.5 py-1.5 flex items-center gap-2.5',
            slaCritical && !reducedMotion && 'esc-sla-critical',
          )}
          style={{
            borderColor: slaCritical ? 'rgba(220,38,38,0.45)' : 'var(--line)',
            background: slaCritical ? '#FFF5F5' : '#fff',
          }}
        >
          <div className="min-w-0">
            <div
              className={cn(
                'esc-sla-digits text-[1.35rem] font-bold tabular-nums leading-none tracking-tight',
                slaCritical && 'text-[#DC2626]',
              )}
              style={{ color: slaCritical ? undefined : 'var(--neg)' }}
            >
              {formatSla(sla)}
            </div>
            <div className="text-[0.5rem] font-bold uppercase tracking-wide mt-0.5" style={{ color: 'var(--ink-3)' }}>
              SLA L2 · {data.id}
            </div>
          </div>
          <div className="min-w-0 flex-1 border-l pl-2" style={{ borderColor: 'var(--cream-2)' }}>
            <div className="text-[0.66rem] font-bold leading-snug line-clamp-2" style={{ color: 'var(--ink)' }}>
              {data.title}
            </div>
            <div className="flex gap-1 mt-1">
              <button
                type="button"
                onClick={warRoomClick}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.52rem] font-bold text-white"
                style={{ background: 'var(--ink)' }}
              >
                <Zap className="w-2.5 h-2.5" /> {warRoomLabel}
              </button>
              <button
                type="button"
                onClick={() => handleAssign(data.levels.find((l) => l.state === 'active') ?? data.levels[0])}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.52rem] font-bold border"
                style={{ borderColor: 'var(--line)', color: 'var(--ink-2)', background: 'var(--cream)' }}
              >
                <UserPlus className="w-2.5 h-2.5" /> Assign
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {assignMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[0.55rem] font-semibold px-1 shrink-0"
              style={{ color: ACCENT.L1 }}
            >
              {assignMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {showStack ? (
          <div className="flex-1 min-h-0 flex flex-col gap-1.5">
            {data.levels.map((lvl) => (
              <FlipTile
                key={lvl.id}
                level={lvl}
                flipped={flippedId === lvl.id}
                onFlip={() => toggleFlip(lvl.id)}
                arrive={lvl.label === 'L1' && l1Arrive}
                reducedMotion={reducedMotion}
                onWarRoom={warRoomClick}
                onAssign={() => handleAssign(lvl)}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2 shrink-0 px-0.5">
              <div className="flex gap-1">
                {data.levels.map((lvl, idx) => {
                  const accent = levelAccent(lvl.label);
                  const on = idx === rotateIdx;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => selectRotate(idx)}
                      className="text-[0.5rem] font-bold px-1.5 py-0.5 rounded-md border transition-colors"
                      style={{
                        borderColor: on ? accent : 'var(--line)',
                        background: on ? `${accent}18` : '#fff',
                        color: on ? accent : 'var(--ink-3)',
                      }}
                      aria-label={`Tampilkan ${lvl.label}`}
                      aria-pressed={on}
                    >
                      {lvl.label}
                    </button>
                  );
                })}
              </div>
              <span className="text-[0.48rem] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
                Auto-rotate
              </span>
            </div>

            <div className="flex-1 min-h-0 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={rotatingLevel.id}
                  className="absolute inset-0"
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <FlipTile
                    level={rotatingLevel}
                    flipped={flippedId === rotatingLevel.id}
                    onFlip={() => toggleFlip(rotatingLevel.id)}
                    arrive={rotatingLevel.label === 'L1' && l1Arrive}
                    reducedMotion={reducedMotion}
                    onWarRoom={warRoomClick}
                    onAssign={() => handleAssign(rotatingLevel)}
                    layout="rotate"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => onAskAI?.(aiPrompt)}
          className="se-esc-ai-ticker relative shrink-0 overflow-hidden rounded-lg border text-left"
          style={{
            borderColor: 'rgba(5,150,105,0.4)',
            background: 'linear-gradient(90deg, #E6F4EA, #F0FDF4 50%, #D1FAE5)',
          }}
          aria-label="Buka Engagement Copilot untuk analisis AI"
        >
          <span className="relative flex items-center gap-2 px-2.5 py-1.5">
            <span
              className="se-esc-ai-pulse w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--orange), var(--orange-deep))' }}
            >
              <Sparkles className="w-3 h-3" />
            </span>
            <span className="min-w-0 flex-1">
              <span
                className="block text-[0.5rem] font-bold uppercase tracking-[0.12em]"
                style={{ color: 'var(--orange-deep)' }}
              >
                Engagement Copilot · Ketuk untuk analisis AI
              </span>
              <span className="relative block h-[1rem] mt-0.5 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={tipIndex}
                    className="absolute inset-x-0 top-0 text-[0.62rem] font-semibold truncate"
                    style={{ color: 'var(--ink)' }}
                    initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={{ duration: reducedMotion ? 0 : 0.45, ease: 'easeInOut' }}
                  >
                    {AI_TICKER[tipIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </span>
        </button>
      </div>
    </UMKMCard>
  );
}
