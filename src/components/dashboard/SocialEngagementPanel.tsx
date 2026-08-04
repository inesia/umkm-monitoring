'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ThumbsUp, Twitter } from 'lucide-react';

const FONT_INTER = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' };
const cardBase = 'h-full bg-white border border-gray-200 shadow-sm transition-all duration-300 rounded-md p-4 flex flex-col';

const TOP_POSTS = [
  {
    id: 1,
    text: '@BloombergAsia: Kinerja Himbara kuartal ini tembus rekor, setoran dividen ke Danantara diprediksi maksimal tahun ini. 📈 #FDI #BUMN',
    platform: 'Twitter/X',
    author: '@BloombergAsia',
    likes: 4.8,
    comments: 156,
    time: '45m lalu'
  },
  {
    id: 2,
    text: 'Danantara jajaki kemitraan strategis hilirisasi nikel dengan investor global. Langkah besar untuk kedaulatan ekonomi.',
    platform: 'Twitter/X',
    author: '@EcoWatcher',
    likes: 2.1,
    comments: 42,
    time: '2j lalu'
  },
  {
    id: 3,
    text: 'Stabilitas portofolio BUMN di bawah kendali Danantara menunjukkan tren positif di pasar global. #InvestasiIndonesia',
    platform: 'Twitter/X',
    author: '@MarketInsider',
    likes: 1.5,
    comments: 28,
    time: '5j lalu'
  }
];

export function SocialEngagementPanel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TOP_POSTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentPost = TOP_POSTS[currentIndex];

  return (
    <motion.div
      className={cardBase}
      style={FONT_INTER}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="dash-section font-medium uppercase tracking-[0.1em] text-slate-800"
        >
          Top Social Post
        </span>
        <div className="flex items-center gap-1.5">
          {TOP_POSTS.map((post, idx) => (
            <div
              key={post.id}
              className={`w-1.5 h-1.5 rounded-md transition-all duration-300 ${
                idx === currentIndex ? 'bg-[#1C1A16] w-4' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content: Post card with ticker */}
      <div className="flex-1 min-h-0 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPost.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/50 rounded-lg p-3 flex-1 min-h-0 flex flex-col"
          >
            {/* Badge & Platform */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="dash-meta font-bold text-white tabular-nums bg-gradient-to-r from-[#1C1A16] to-[#0088A8] px-2 py-0.5 rounded"
                  style={FONT_INTER}
                >
                  #{currentPost.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <Twitter className="w-3 h-3 text-sky-500" />
                  <span className="dash-meta font-semibold text-slate-600">{currentPost.platform}</span>
                </div>
              </div>
              <span className="dash-meta text-slate-400">{currentPost.time}</span>
            </div>
            
            {/* Post Text */}
            <p className="dash-body text-slate-700 leading-relaxed mb-2 flex-1">
              {currentPost.text}
            </p>

            {/* Author & Engagement inline */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <span className="dash-meta font-medium text-slate-500">{currentPost.author}</span>
              <div className="flex items-center gap-3 dash-meta">
                <span className="flex items-center gap-1 text-slate-600">
                  <ThumbsUp className="w-3 h-3" />
                  <span className="font-medium bg-gradient-to-b from-[#1C1A16] to-[#0088A8] bg-clip-text text-transparent">{currentPost.likes}K</span>
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MessageCircle className="w-3 h-3" />
                  <span className="font-medium">{currentPost.comments}</span>
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
