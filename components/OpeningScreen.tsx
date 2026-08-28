'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Image as ImageIcon, Camera } from 'lucide-react';
import QRCode from 'qrcode';

interface OpeningScreenProps {
  onStartJourney: () => void;
  onOpenPhotoManager: () => void;
  onOpenGallery: () => void;
  firstPhotoUrl?: string;
  photosCount: number;
}

export function OpeningScreen({
  onStartJourney,
  onOpenPhotoManager,
  onOpenGallery,
  firstPhotoUrl,
  photosCount,
}: OpeningScreenProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const siteUrl =
      typeof window !== 'undefined'
        ? window.location.href
        : process.env.NEXT_PUBLIC_APP_URL || 'https://ais-dev-i4zwepdwxseybsfrrtlp2o-889587836088.asia-southeast1.run.app';

    QRCode.toDataURL(siteUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.warn('QR preview gen failed:', err));
  }, []);

  return (
    <section
      id="opening-screen"
      className="relative flex min-h-screen w-full flex-col justify-between p-6 sm:p-12 z-10 max-w-7xl mx-auto select-none"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-between items-center mb-8 sm:mb-12"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-full border border-pink-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.3)] bg-pink-500/10">
            <span className="text-pink-500 text-sm">❤️</span>
          </div>
          <div className="text-xs tracking-[0.2em] uppercase font-medium text-pink-200/70">
            Our Eternal Journey
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
            <span className="text-[10px] uppercase tracking-widest text-white/80">
              Playing: Romantic Melody
            </span>
          </div>
        </div>
      </motion.header>

      {/* Main Content Split: Left Info + Right Framed Preview */}
      <main className="flex-1 flex flex-col lg:flex-row gap-10 lg:gap-14 items-center justify-center my-auto">
        {/* Left Column: Narrative, Headings & Action Buttons */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="w-full lg:w-1/2 flex flex-col justify-center gap-6 text-left"
        >
          <div className="space-y-2">
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-pink-400 text-lg font-serif italic tracking-wide"
            >
              Celebrating us...
            </motion.h2>

            <motion.h1
              id="opening-main-title"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="text-4xl sm:text-6xl md:text-7xl font-serif leading-tight text-white"
            >
              Happy 10 Months,<br />
              <span className="text-pink-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                My Bhondu ❤️
              </span>
            </motion.h1>
          </div>

          <motion.p
            id="opening-subtitle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-base sm:text-lg text-white/60 font-light leading-relaxed max-w-md italic"
          >
            &ldquo;Every moment with you is special. These ten months have been the most beautiful chapter of my life, and I would choose you again and again.&rdquo;
          </motion.p>

          {/* Action Button Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="flex flex-wrap gap-4 mt-2"
          >
            <button
              id="btn-start-journey"
              onClick={onStartJourney}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-full font-medium tracking-wide shadow-lg shadow-pink-900/40 transition-all flex items-center gap-3 active:scale-95 cursor-pointer"
            >
              <span>Start Our Journey</span>
              <span className="text-xl">❤️</span>
            </button>

            <button
              id="btn-open-memories"
              onClick={onOpenGallery}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full font-medium tracking-wide backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              Our Memories
            </button>
          </motion.div>

          {/* Photos manager helper */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-3 pt-1"
          >
            <button
              id="btn-manage-photos"
              onClick={onOpenPhotoManager}
              className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-pink-300 transition-colors"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>{photosCount > 0 ? `${photosCount} memories synced` : 'Sync our 11 photos'}</span>
            </button>
            <span className="text-white/20 text-xs">•</span>
            <span className="text-xs text-pink-300/60 font-serif italic">304 days together</span>
          </motion.div>
        </motion.div>

        {/* Right Column: Artistic Framed Card + Floated QR Badge */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="w-full lg:w-1/2 flex items-center justify-center relative py-6"
        >
          {/* Ambient pink aura glow */}
          <div className="absolute -inset-4 bg-pink-500/10 blur-[80px] rounded-full pointer-events-none" />

          {/* Artistic Glass Card Frame */}
          <div className="relative w-full max-w-[420px] h-[460px] sm:h-[540px] p-4 bg-white/5 border border-white/20 rounded-[2.5rem] backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="w-full h-full rounded-[1.8rem] bg-[#1a1a1a] flex items-center justify-center relative overflow-hidden group">
              {/* Inner Photo or Placeholder Teaser */}
              {firstPhotoUrl ? (
                <div className="relative h-full w-full">
                  <img
                    src={firstPhotoUrl}
                    alt="Our memory preview"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <div className="flex flex-col items-center justify-center gap-3 text-center p-8 z-20">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-pink-500/30 flex items-center justify-center mb-3 bg-white/5 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
                      <Camera className="h-8 w-8 text-pink-400" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] text-pink-200/70 font-medium">
                      Slideshow Preview
                    </span>
                    <p className="text-white/40 text-xs px-6 italic font-serif leading-relaxed">
                      [ Your 11 cherished photos will appear here with smooth transitions and cinematic zooms ]
                    </p>
                  </div>
                </>
              )}

              {/* Bottom Card Timeline Tracker */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <p className="text-white text-base sm:text-lg font-serif italic mb-2">
                  10 months of us...
                </p>
                <div className="w-full h-[2px] bg-white/20 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Floated QR Code Badge Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-8 p-4 sm:p-5 bg-white/5 border border-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl flex items-center gap-4 max-w-[240px] z-30"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white p-1.5 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Anniversary site QR code"
                  className="h-full w-full object-contain rounded"
                />
              ) : (
                <div className="h-full w-full border-2 border-black flex items-center justify-center text-black text-xs font-bold">
                  QR
                </div>
              )}
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">
                Scan this ❤️
              </span>
              <span className="text-xs font-medium text-white/80 leading-tight">
                To open our memories
              </span>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer Timeline */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-end border-t border-white/5 pt-8 gap-4"
      >
        <div className="space-y-1 text-left">
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/30">The Timeline</div>
          <div className="flex gap-6 sm:gap-8 text-xs font-medium tracking-widest text-white/60 italic">
            <span>Month 01</span>
            <span>Month 05</span>
            <span className="text-pink-400 font-semibold drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">
              Month 10
            </span>
            <span>Forever</span>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-white/40 text-[11px] italic font-serif">
            Created with love for a very special person
          </p>
          <p className="text-pink-300/60 text-[10px] uppercase tracking-widest mt-1">
            Forever & Always — 2024
          </p>
        </div>
      </motion.footer>
    </section>
  );
}

