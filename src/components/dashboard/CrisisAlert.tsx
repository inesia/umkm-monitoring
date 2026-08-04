'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Timer } from 'lucide-react';

export function CrisisAlert() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins in seconds

  // Simulating alert for demo
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500); 
    return () => clearTimeout(timer);
  }, []);

  // Countdown Logic
  useEffect(() => {
    if (!isVisible || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isVisible, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           className="fixed bottom-24 right-10 z-50 w-[380px] glass-floating-alert rounded-md overflow-hidden shadow-sm"
           initial={{ opacity: 0, y: 100, scale: 0.9 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, y: 100, scale: 0.9 }}
           transition={{ type: "spring", stiffness: 250, damping: 25 }}
        >
          <div className="p-5 relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-md animate-pulse">
                  <AlertCircle className="h-5 w-5 text-[#AF261D]" />
                </div>
                <div>
                   <h3 className="text-base font-bold text-slate-800 leading-tight">Negative Issue</h3>
                   <span className="text-[10px] font-bold text-[#AF261D] uppercase tracking-wide">Action Required</span>
                </div>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
              Spike in negative sentiment detected regarding &quot;Mobile Banking Failure&quot; in Region 2.
            </p>

            {/* Countdown Clock */}
            <div className="bg-white/60 rounded-md p-3 flex items-center justify-between border border-white/80">
               <div className="flex items-center gap-2">
                 <Timer className="h-4 w-4 text-[#AF261D]" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase">SLA Countdown</span>
               </div>
               <span className="text-2xl font-bold font-mono tracking-tighter text-[#AF261D]">
                 {formatTime(timeLeft)}
               </span>
            </div>
            
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-700/10 rounded-md blur-2xl -z-10 pointer-events-none" />
          </div>
          
          {/* Progress Bar Bottom */}
          <div className="h-1 w-full bg-red-100">
            <motion.div 
              className="h-full bg-[#AF261D]" 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 1800, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
