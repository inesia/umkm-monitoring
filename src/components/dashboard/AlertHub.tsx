'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { AlertItem } from '@/types/dashboard';
import { generateAlertItems, formatTimeRemaining } from '@/lib/mockData';
import { SLA_RESPONSE_TIME, REFRESH_INTERVALS } from '@/lib/constants';
import { AlertTriangle, Clock, Zap, TrendingUp, Activity, CheckCircle2, Users, Radio, X, Loader2, UserPlus, FileText, AlertOctagon, CheckCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FONT_INTER = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };

const QUICK_ACTION_TEAMS = [
  { id: 'pr', label: 'PR Lead' },
  { id: 'it', label: 'IT Lead' },
  { id: 'security', label: 'Security Lead' },
];

const springDrawer = { type: 'spring' as const, stiffness: 400, damping: 35 };

const CRISIS_TIMELINE = [
  { time: '13:40', label: 'Viral tweet detected' },
  { time: '13:41', label: 'Sentiment spike flagged' },
  { time: '13:42', label: 'PR Team notified' },
  { time: '13:43', label: 'Social Media Team assigned' },
  { time: '13:45', label: 'Draft response in review' },
  { time: '13:48', label: 'Legal brief requested' },
];

const IMPACT_SCORE = 7.5;
const CRISIS_ID = 'CR-2024-' + Math.floor(1000 + Math.random() * 9000);

export function AlertHub({
  isCrisis = false,
  isCentered = false,
  onClose,
  onDeclareCrisis,
}: {
  isCrisis?: boolean;
  isCentered?: boolean;
  onClose?: () => void;
  onDeclareCrisis?: () => void;
}) {
  const [alert, setAlert] = useState<AlertItem | null>(() => generateAlertItems(1));
  const [timeRemaining, setTimeRemaining] = useState<number>(() => generateAlertItems(1).timeRemaining);
  const [processing, setProcessing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(false);
  const [buttonScale, setButtonScale] = useState(1);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const handleRespond = useCallback(() => {
    setButtonScale(0.98);
    const t1 = setTimeout(() => setButtonScale(1), 120);
    setProcessing(true);
    const t2 = setTimeout(() => {
      setProcessing(false);
      setDrawerOpen(true);
    }, 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setAssignDropdownOpen(false);
  }, []);

  const handleQuickAction = useCallback(
    (action: 'assign' | 'briefing' | 'crisis' | 'resolve', teamLabel?: string) => {
      if (action === 'assign' && teamLabel) {
        showToast(`Action logged. ${teamLabel} has been notified via Internal Command API.`);
      } else if (action === 'briefing') {
        showToast('Action logged. Briefing requested; summary will be sent to CEO via WhatsApp/Email.');
      } else if (action === 'crisis') {
        showToast('Crisis mode activated. Dashboard switched to Command Center.');
        onDeclareCrisis?.();
      } else if (action === 'resolve') {
        showToast('Alert acknowledged and moved to History.');
      }
      closeDrawer();
    },
    [showToast, closeDrawer, onDeclareCrisis]
  );

  useEffect(() => {
    const alertInterval = setInterval(() => {
      const newAlert = generateAlertItems(1);
      setAlert(newAlert);
      setTimeRemaining(newAlert.timeRemaining);
    }, REFRESH_INTERVALS.alerts);

    return () => clearInterval(alertInterval);
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  if (!alert) return null;

  const percentageRemaining = (timeRemaining / SLA_RESPONSE_TIME) * 100;
  const isUrgent = percentageRemaining < 25;
  const isWarning = percentageRemaining < 50 && !isUrgent;
  const isHighOrMedium = alert.severity === 'high' || alert.severity === 'medium';

  const drawerAndToastPortal =
    typeof document !== 'undefined' &&
    createPortal(
      <>
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 z-[200]"
                onClick={closeDrawer}
                aria-hidden
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={springDrawer}
                className="fixed top-0 right-0 bottom-0 h-screen w-full max-w-sm bg-white shadow-sm z-[201] flex flex-col"
                style={FONT_INTER}
                role="dialog"
                aria-label="Quick Actions"
              >
                <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Quick Actions</h2>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1A16]"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-2">
                  <div className="relative">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAssignDropdownOpen((o) => !o)}
                      className="w-full flex items-center justify-between gap-2 py-3 px-4 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-sm font-semibold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1A16]"
                    >
                      <span className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-[#1C1A16]" />
                        Assign to Team
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${assignDropdownOpen ? 'rotate-180' : ''}`} />
                    </motion.button>
                    <AnimatePresence>
                      {assignDropdownOpen && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden mt-1 rounded-lg border border-slate-200 bg-white shadow-sm"
                        >
                          {QUICK_ACTION_TEAMS.map((t) => (
                            <li key={t.id}>
                              <button
                                type="button"
                                onClick={() => handleQuickAction('assign', t.label)}
                                className="w-full py-2.5 px-4 text-left text-sm font-medium text-slate-700 hover:bg-[#1C1A16]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1C1A16]"
                              >
                                {t.label}
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickAction('briefing')}
                    className="w-full flex items-center gap-2 py-3 px-4 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-sm font-semibold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1A16]"
                  >
                    <FileText className="w-4 h-4 text-[#1C1A16]" />
                    Request Briefing
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickAction('crisis')}
                    className="w-full flex items-center gap-2 py-3 px-4 rounded-md bg-[#AF261D]/10 text-[#AF261D] hover:bg-[#AF261D]/20 border border-[#AF261D]/40 text-left text-sm font-semibold text-[#AF261D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AF261D]"
                  >
                    <AlertOctagon className="w-4 h-4" />
                    Declare Portfolio Crisis
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickAction('resolve')}
                    className="w-full flex items-center gap-2 py-3 px-4 rounded-md bg-[#1C1A16]/10 hover:bg-[#1C1A16]/20 border border-[#1C1A16]/40 text-left text-sm font-semibold text-[#1C1A16] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1A16]"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Resolve / Acknowledge
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed bottom-6 right-6 max-w-sm px-4 py-3 rounded-md bg-slate-800 text-white text-xs font-medium shadow-sm z-[300]"
              style={FONT_INTER}
              role="status"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </>,
      document.body
    );

  if (isCrisis) {
    const isBig = isCentered;
    return (
      <>
      <div
        className="h-full w-full bg-white border border-gray-200 shadow-sm transition-all duration-300 rounded-md overflow-hidden flex flex-col p-4"
        style={FONT_INTER}
      >
        {/* Same style as Alert Hub: title + Close + badge */}
        <div className="flex items-center justify-between mb-2.5 shrink-0">
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-500" style={{ opacity: 0.6 }}>
            Command Center
          </span>
          <div className="flex items-center gap-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-800 hover:bg-white/60 border border-slate-200/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1A16] focus-visible:ring-offset-1"
              >
                <X className="w-3.5 h-3.5" />
                Close
              </button>
            )}
            <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-md bg-[#AF261D]/20 text-[#AF261D] border border-[#AF261D]/40">
              Crisis
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-hidden">
          {/* SLA Countdown — massive, high-contrast Danantara Orange */}
          <div className="shrink-0 rounded-md bg-slate-100 border border-slate-200 p-4 flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Time to respond (SLA)</span>
            <div className={`font-bold tabular-nums text-[#AF261D] ${isBig ? 'text-6xl' : 'text-4xl'}`} style={FONT_INTER}>
              {formatTimeRemaining(timeRemaining)}
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-md overflow-hidden mt-3">
              <motion.div
                className="h-full rounded-md bg-gradient-to-r from-[#AF261D] to-[#1C1A16]"
                initial={{ width: '100%' }}
                animate={{ width: `${percentageRemaining}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[10px] font-medium text-slate-500 mt-1">{percentageRemaining.toFixed(0)}% remaining</span>
          </div>

          {/* 3-column — Crisis Timeline | Impact Analysis | Live Team Status (compact height, no extra whitespace) */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="rounded-lg border border-slate-200 bg-slate-50/90 p-2.5 overflow-hidden">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#1C1A16] block mb-1.5">Crisis Timeline</span>
              <div className="space-y-1 max-h-[88px] overflow-y-auto no-scrollbar">
                {CRISIS_TIMELINE.map((e, i) => (
                  <div key={i} className="flex items-baseline gap-2 text-[10px]">
                    <span className="font-mono font-semibold text-slate-600 shrink-0">{e.time}</span>
                    <span className="text-slate-700 truncate">{e.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50/90 p-2.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#1C1A16] block mb-1">Impact Analysis</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#AF261D] tabular-nums" style={FONT_INTER}>{IMPACT_SCORE}</span>
                <span className="text-[10px] text-slate-500">/10 Risk</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-md overflow-hidden mt-1.5">
                <div className="h-full rounded-md bg-gradient-to-r from-[#AF261D] to-[#1C1A16]" style={{ width: `${IMPACT_SCORE * 10}%` }} />
              </div>
              <p className="text-[9px] text-slate-600 mt-1">High exposure · Escalation recommended</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50/90 p-2.5 flex flex-col justify-center min-h-[88px]">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#1C1A16] block mb-1">Live Team Status</span>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1C1A16] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] font-semibold text-slate-500 block">Assigned</span>
                  <span className="text-[11px] font-semibold text-slate-800">PR Lead, Social Media Team</span>
                </div>
              </div>
            </div>
          </div>

          {/* RESPOND NOW — Quick Action (same as normal hub) */}
          <motion.button
            type="button"
            onClick={handleRespond}
            disabled={processing}
            animate={{
              scale: processing ? 0.98 : buttonScale === 0.98 ? 0.98 : [1, 1.02, 1],
              boxShadow: processing
                ? '0 4px 14px rgba(0,0,0,0.15)'
                : [
                    '0 0 20px rgba(175, 38, 29,0.4)',
                    '0 0 40px rgba(175, 38, 29,0.55)',
                    '0 0 20px rgba(175, 38, 29,0.4)',
                  ],
            }}
            transition={{
              scale: { duration: 0.12 },
              boxShadow: { duration: 0.75, repeat: processing ? 0 : Infinity, ease: 'easeInOut' },
            }}
            className="shrink-0 w-full py-4 rounded-md font-bold uppercase tracking-wider text-sm bg-[#AF261D] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AF261D] focus-visible:ring-offset-2 hover:bg-[#d04a1a] active:scale-[0.98]"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 inline mr-2" />
                Escalate Now
              </>
            )}
          </motion.button>

          {/* Crisis ID + Live Sync — official record */}
          <div className="shrink-0 flex items-center justify-between pt-3 border-t border-slate-200 text-[10px] text-slate-500">
            <span className="font-mono font-semibold">Crisis ID: {CRISIS_ID}</span>
            <span className="flex items-center gap-1.5 font-semibold text-[#1C1A16]">
              <Radio className="w-3.5 h-3.5" />
              Live Sync
            </span>
          </div>
        </div>
      </div>
      {drawerAndToastPortal}
    </>
    );
  }

  return (
    <>
    <div 
      className="h-full bg-white border border-gray-200 shadow-sm transition-all duration-300 rounded-md p-4 flex flex-col"
      style={FONT_INTER}
    >
      {/* Header: Title + Badge only (no duplicate timer) */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <span
          className="dash-section font-medium uppercase tracking-[0.1em] text-slate-800"
        >
          Issue Escalation
        </span>
        <span className={`dash-meta font-semibold uppercase px-2 py-0.5 rounded-md ${
          alert.severity === 'high' 
            ? 'text-red-600 bg-red-50' 
            : alert.severity === 'medium'
            ? 'text-slate-600 bg-slate-50'
            : 'text-slate-600 bg-slate-50'
        }`}>
          {alert.severity}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col min-h-0 gap-2"
        >
          {/* 2-Column: Timer & Contextual Details */}
          <div className="grid grid-cols-2 gap-2 shrink-0">
            <div className="bg-white/60 rounded-lg p-2 flex flex-col items-center justify-center border border-slate-200/60">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="h-3 w-3 text-slate-500" />
                <span className="dash-meta font-medium text-slate-500 uppercase tracking-[0.06em]">Time Left</span>
              </div>
              <div className={`text-2xl font-bold tabular-nums mb-1 ${
                isUrgent ? 'text-red-600' : isWarning ? 'text-slate-600' : 'text-[#1C1A16]'
              }`} style={FONT_INTER}>
                {formatTimeRemaining(timeRemaining)}
              </div>
              <div className="w-full h-1 bg-slate-200/60 rounded-md overflow-hidden">
                <motion.div
                  className={`h-full rounded-md ${
                    isUrgent ? 'bg-gradient-to-r from-red-500/90 to-red-400/80' 
                    : isWarning ? 'bg-gradient-to-r from-rose-500/90 to-rose-400/80' 
                    : 'bg-gradient-to-r from-[#1C1A16]/90 to-[#475569]/80'
                  }`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${percentageRemaining}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="dash-meta font-medium text-slate-500 mt-1">{percentageRemaining.toFixed(0)}% Remaining</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="bg-white/60 rounded-lg p-1.5 border border-slate-200/60">
                <span className="dash-meta font-medium text-slate-500 uppercase tracking-[0.06em] block mb-0.5">Issue Type</span>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className={`h-3 w-3 ${isUrgent ? 'text-red-600' : 'text-slate-600'}`} />
                  <span className="dash-body-sm font-semibold text-slate-700">Portfolio Crisis Alert</span>
                </div>
              </div>
              <div className="bg-white/60 rounded-lg p-1.5 border border-slate-200/60">
                <span className="dash-meta font-medium text-slate-500 uppercase tracking-[0.06em] block mb-0.5">Impact</span>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3 text-[#1C1A16]" />
                  <span className="dash-body-sm font-semibold text-slate-700">High Exposure</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Complaint Trend - rich content so card is not empty */}
          <div className="flex-1 min-h-0 flex flex-col bg-white/60 rounded-lg p-2 border border-slate-200/60 overflow-hidden">
            <h3 className="dash-body-sm font-semibold text-slate-800 mb-1 shrink-0">Lonjakan Sentimen Sektor Finansial</h3>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <p className="dash-body-sm text-slate-600 leading-relaxed mb-2">
                Terdeteksi lonjakan sentimen negatif pada Sektor Finansial (Mandiri) terkait gangguan layanan IT. Potensi eksposur nasional tinggi.
              </p>
              <p className="dash-body-sm text-slate-600 leading-relaxed">
                Rekomendasi: Pantau respons krisis PR Mandiri dalam SLA 2 jam ke depan. Koordinasi dengan tim teknis Mandiri untuk update resolusi sistem.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2 pt-2 border-t border-slate-200/60 shrink-0 dash-meta">
              <span className="font-medium text-slate-500">Source: {alert.source}</span>
              <span className="text-slate-400">·</span>
              <span className="font-medium text-slate-500">Detected: {alert.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
              <span className="text-slate-400">·</span>
              <span className="font-medium text-slate-600">Action: Respond within SLA</span>
            </div>
          </div>

          {/* Daily Pulse - Integrated 2-column grid - Hidden di ≤1440px, shown di >1440px */}
          <div className="daily-pulse-section grid grid-cols-2 gap-1.5 shrink-0">
            <div className="bg-white/50 rounded-lg px-2 py-1.5 border border-slate-200/60 flex items-center gap-2">
              <Activity className="w-3 h-3 text-[#1C1A16] shrink-0" />
              <div className="min-w-0">
                <span className="dash-meta font-medium text-slate-500 block text-[0.65rem]">Mentions</span>
                <span className="dash-body-sm font-bold text-slate-800 tabular-nums" style={FONT_INTER}>12.4K</span>
                <span className="dash-meta text-slate-500 ml-1 text-[0.65rem]">Neutral</span>
              </div>
            </div>
            <div className="bg-white/50 rounded-lg px-2 py-1.5 border border-slate-200/60 flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-slate-600 shrink-0" />
              <div className="min-w-0">
                <span className="dash-meta font-medium text-slate-500 block text-[0.65rem]">Top Channel</span>
                <span className="dash-body-sm font-bold text-slate-800" style={FONT_INTER}>Twitter/X</span>
              </div>
            </div>
            <div className="bg-white/50 rounded-lg px-2 py-1.5 border border-slate-200/60 flex items-center gap-2 col-span-2">
              <CheckCircle2 className="w-3 h-3 text-[#1C1A16] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="dash-meta font-medium text-slate-500 block text-[0.65rem]">System Health</span>
                <span className="dash-body-sm font-bold text-[#1C1A16] tabular-nums" style={FONT_INTER}>99.9%</span>
                <span className="dash-meta text-[#1C1A16] ml-1 text-[0.65rem]">Stable</span>
              </div>
            </div>
          </div>

          {/* RESPOND NOW - Quick Action: ripple/scale, then Processing → Drawer */}
          <motion.button
            type="button"
            onClick={handleRespond}
            disabled={processing}
            animate={{
              scale: buttonScale,
              boxShadow: !processing && isHighOrMedium
                ? isUrgent
                  ? ['0 0 12px rgba(220,38,38,0.35)', '0 0 24px rgba(220,38,38,0.5)', '0 0 12px rgba(220,38,38,0.35)']
                  : ['0 0 12px rgba(28, 26, 22,0.35)', '0 0 24px rgba(28, 26, 22,0.5)', '0 0 12px rgba(28, 26, 22,0.35)']
                : '0 4px 14px rgba(0,0,0,0.12)',
            }}
            transition={{
              scale: { duration: 0.12 },
              boxShadow: { duration: 2.5, repeat: processing ? 0 : Infinity, ease: 'easeInOut' },
            }}
            className={`shrink-0 w-full py-2.5 rounded-lg font-semibold uppercase tracking-wider dash-body-sm transition-colors shadow-md hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] ${
              isUrgent
                ? 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400'
                : 'bg-[#1C1A16] text-white hover:bg-black focus-visible:ring-[#1C1A16]'
            }`}
          >
            {processing ? (
              <>
                <Loader2 className="h-3 w-3 inline mr-1.5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-3 w-3 inline mr-1.5" />
                Escalate Now
              </>
            )}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
    {drawerAndToastPortal}
    </>
  );
}
