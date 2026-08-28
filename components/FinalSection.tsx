'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Image as ImageIcon, RotateCcw, Quote } from 'lucide-react';
import { QRCodeSection } from './QRCodeSection';

interface FinalSectionProps {
  onOpenGallery: () => void;
  onReplaySlideshow: () => void;
}

export function FinalSection({ onOpenGallery, onReplaySlideshow }: FinalSectionProps) {
  useEffect(() => {
    // Elegant romantic heart-themed confetti shower
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#ffffff'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#ffffff'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <section
      id="final-section"
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-16 text-center select-none"
    >
      {/* Background glow orb */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-rose-950/40 via-rose-600/15 to-transparent blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center"
      >
        {/* Floating Heart Emblem */}
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/20 to-pink-900/40 shadow-[0_0_35px_rgba(244,63,94,0.4)] backdrop-blur-xl"
        >
          <Heart className="h-8 w-8 fill-rose-500 text-rose-400" />
        </motion.div>

        {/* Mandatory Requested Text 1 */}
        <motion.h2
          id="final-title"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl font-serif"
        >
          Happy 10 Months, <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-rose-300 via-pink-200 to-rose-400 bg-clip-text text-transparent">
            My Love ❤️
          </span>
        </motion.h2>

        {/* Mandatory Requested Text 2 */}
        <motion.p
          id="final-subtitle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mb-8 max-w-xl text-lg font-medium leading-relaxed text-rose-100/90 sm:text-xl font-serif italic"
        >
          &ldquo;Thank you for being a beautiful part of my life.&rdquo;
        </motion.p>

        {/* Love Letter Note Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative mb-10 w-full max-w-xl rounded-2xl border border-rose-500/20 bg-neutral-950/70 p-6 sm:p-8 text-left shadow-2xl backdrop-blur-xl"
        >
          <Quote className="absolute top-4 right-4 h-8 w-8 text-rose-500/20" />
          
          <h4 className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
            A Letter To You
          </h4>
          <p className="text-sm sm:text-base leading-relaxed text-neutral-300">
            These past 10 months have been the happiest months of my life. Every laugh we shared,
            every silly pout, every late-night ride, and every quiet moment together has proven to me that
            you are my person. You bring joy, warmth, and peace into my world. I cherish you today,
            tomorrow, and forever.
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-rose-300/80">
            <span>Always & Forever Yours</span>
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-rose-400" />
              10 Months & Counting
            </span>
          </div>
        </motion.div>

        {/* Mandatory Button: "Our Memories ❤️" */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="mb-14 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            id="btn-our-memories"
            onClick={onOpenGallery}
            className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-rose-400/50 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 px-8 py-4 text-base font-semibold text-white shadow-[0_0_35px_rgba(244,63,94,0.45)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(244,63,94,0.7)] active:scale-95"
          >
            <ImageIcon className="h-5 w-5 text-rose-100" />
            <span>Our Memories ❤️</span>
          </button>

          <button
            id="btn-replay-journey"
            onClick={onReplaySlideshow}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/15 bg-neutral-900/60 px-6 py-4 text-sm font-medium text-neutral-300 backdrop-blur-md transition-colors hover:border-rose-500/40 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Replay Slideshow</span>
          </button>
        </motion.div>

        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-full"
        >
          <QRCodeSection />
        </motion.div>
      </motion.div>
    </section>
  );
}
