'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Pin, Heart, Repeat2, BadgeCheck } from 'lucide-react';
import type { HotPost } from '@/types/umkm';
import { cn } from '@/lib/utils';

const PLATFORM: Record<
  HotPost['platform'],
  { label: string; bg: string }
> = {
  tiktok: { label: 'TT', bg: '#111827' },
  x: { label: 'X', bg: '#0F1419' },
  news: { label: 'NEWS', bg: '#6B7280' },
  instagram: { label: 'IG', bg: '#E1306C' },
  facebook: { label: 'FB', bg: '#1877F2' },
};

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

function PostCard({
  post,
  pinned,
  onPin,
}: {
  post: HotPost;
  pinned: boolean;
  onPin: () => void;
}) {
  const plat = PLATFORM[post.platform];

  return (
    <article
      className={cn(
        'hot-post-card relative flex gap-2 rounded-lg border bg-white p-2 h-full min-h-0',
        pinned && 'hot-post-pinned',
      )}
      style={{ borderColor: pinned ? 'rgba(21,41,67,0.55)' : 'var(--line)' }}
    >
      <div
        className="hot-post-thumb shrink-0 w-14 rounded-md overflow-hidden relative self-stretch min-h-[72px]"
        style={{ background: post.thumbTone }}
        aria-hidden
      >
        <span className="absolute inset-0 opacity-30 bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.5))]" />
        <span
          className="absolute bottom-1 left-1 text-[0.4rem] font-bold text-white px-1 py-0.5 rounded"
          style={{ background: plat.bg }}
        >
          {plat.label}
        </span>
      </div>

      <div className="min-w-0 flex-1 flex flex-col">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[0.68rem] font-bold truncate" style={{ color: 'var(--ink)' }}>
            {post.handle}
          </span>
          {(post.verified || post.influencer) && (
            <span
              className="hot-post-badge shrink-0 inline-flex items-center gap-0.5 text-[0.4rem] font-bold uppercase px-1 py-0.5 rounded"
              style={{
                background: post.verified ? '#E8F6EE' : 'var(--amber)',
                color: post.verified ? 'var(--pos)' : 'var(--orange-deep)',
              }}
            >
              {post.verified ? <BadgeCheck className="w-2.5 h-2.5" /> : null}
              {post.verified ? 'Verified' : 'Top KOL'}
            </span>
          )}
          <button
            type="button"
            onClick={onPin}
            className={cn(
              'ml-auto shrink-0 p-0.5 rounded',
              pinned ? 'text-[var(--orange-deep)]' : 'text-[var(--ink-3)]',
            )}
            aria-label={pinned ? 'Unpin post' : 'Pin post'}
            title={pinned ? 'Unpin' : 'Pin'}
          >
            <Pin className={cn('w-3 h-3', pinned && 'fill-current')} />
          </button>
        </div>

        <p
          className="text-[0.62rem] leading-snug line-clamp-2 mt-1 flex-1"
          style={{ color: 'var(--ink-2)' }}
        >
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2 mt-1.5">
          <span className="inline-flex items-center gap-0.5 text-[0.5rem] font-semibold tabular-nums" style={{ color: 'var(--ink-3)' }}>
            <Heart className="w-2.5 h-2.5" /> {post.likes}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[0.5rem] font-semibold tabular-nums" style={{ color: 'var(--ink-3)' }}>
            <Repeat2 className="w-2.5 h-2.5" /> {post.retweets}
          </span>
          <a
            href={post.sourceUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-0.5 text-[0.5rem] font-bold"
            style={{ color: 'var(--orange-deep)' }}
            onClick={(e) => {
              if (!post.sourceUrl) e.preventDefault();
            }}
          >
            View source <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

/** Ringkasan: 1 card bergantian dari max 3 posts. */
export function HotPostCarousel({
  posts,
  mode = 'single',
}: {
  posts: HotPost[];
  mode?: 'single' | 'stack';
}) {
  const reducedMotion = usePrefersReducedMotion();
  const pool = useMemo(() => posts.slice(0, 3), [posts]);
  const [index, setIndex] = useState(0);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef(false);

  const activeIndex = useMemo(() => {
    if (!pool.length) return 0;
    if (pinnedId) {
      const pi = pool.findIndex((p) => p.id === pinnedId);
      if (pi >= 0) return pi;
    }
    return ((index % pool.length) + pool.length) % pool.length;
  }, [pool, index, pinnedId]);

  const current = pool[activeIndex] ?? null;

  const visible = useMemo(() => {
    if (!pool.length) return [];
    if (mode === 'single') return current ? [current] : [];
    // stack: up to 3, rotate window starting at index
    const pinned = pinnedId ? pool.find((p) => p.id === pinnedId) : undefined;
    const rest = pool.filter((p) => p.id !== pinnedId);
    if (!rest.length) return pinned ? [pinned] : [];
    const slots = pinned ? Math.min(2, rest.length) : Math.min(3, rest.length);
    const items: HotPost[] = [];
    for (let i = 0; i < slots; i++) {
      items.push(rest[(index + i) % rest.length]);
    }
    return pinned ? [pinned, ...items] : items;
  }, [mode, pool, current, index, pinnedId]);

  useEffect(() => {
    pauseRef.current = paused || Boolean(pinnedId);
  }, [paused, pinnedId]);

  useEffect(() => {
    if (pool.length <= 1) return;
    const ms = reducedMotion ? 8000 : 5000;
    const id = window.setInterval(() => {
      if (pauseRef.current) return;
      setIndex((i) => i + 1);
    }, ms);
    return () => clearInterval(id);
  }, [pool.length, reducedMotion]);

  const togglePin = useCallback((id: string) => {
    setPinnedId((prev) => (prev === id ? null : id));
  }, []);

  if (!pool.length || !visible.length) {
    return (
      <div className="text-[0.62rem]" style={{ color: 'var(--ink-3)' }}>
        No hot posts
      </div>
    );
  }

  return (
    <div
      className="hot-post-carousel flex flex-col h-full min-h-0 gap-1"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between shrink-0 px-0.5">
        <span className="text-[0.5rem] font-bold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
          Hot posts · {activeIndex + 1}/{pool.length}
        </span>
        <span className="text-[0.45rem] font-semibold" style={{ color: paused || pinnedId ? 'var(--orange-deep)' : 'var(--ink-3)' }}>
          {pinnedId ? 'Pinned' : paused ? 'Paused' : 'Autoplay'}
        </span>
      </div>

      <div className={cn('flex-1 min-h-0 overflow-hidden', mode === 'single' ? 'relative' : 'flex flex-col gap-1')}>
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'single' && current ? (
            <motion.div
              key={current.id}
              className="absolute inset-0"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <PostCard
                post={current}
                pinned={pinnedId === current.id}
                onPin={() => togglePin(current.id)}
              />
            </motion.div>
          ) : (
            visible.map((post) => (
              <motion.div
                key={post.id}
                layout={!reducedMotion}
                className="min-h-0"
                style={{ flex: '1 1 0' }}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <PostCard
                  post={post}
                  pinned={pinnedId === post.id}
                  onPin={() => togglePin(post.id)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1.5 shrink-0 py-0.5">
        {pool.map((p, i) => {
          const active = mode === 'single' ? i === activeIndex : visible.some((v) => v.id === p.id);
          return (
            <button
              key={p.id}
              type="button"
              aria-label={`Show ${p.handle}`}
              onClick={() => {
                setIndex(i);
                setPinnedId(null);
                setPaused(true);
                window.setTimeout(() => setPaused(false), 8000);
              }}
              className="hot-post-dot"
              style={{
                background: active ? 'var(--orange)' : 'var(--cream-2)',
                width: active ? 14 : 6,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
