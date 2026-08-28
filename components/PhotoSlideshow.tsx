'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Heart,
  Sparkles,
  ArrowRight,
  UploadCloud,
  Layers,
  X
} from 'lucide-react';
import { PhotoItem } from '@/lib/photos-data';

interface PhotoSlideshowProps {
  photos: PhotoItem[];
  photoUrls: Record<string, string>; // Maps filename or id to loaded URL/blob
  onFinishJourney: () => void;
  onOpenPhotoManager: () => void;
  onBackToStart: () => void;
}

export function PhotoSlideshow({
  photos,
  photoUrls,
  onFinishJourney,
  onOpenPhotoManager,
  onBackToStart,
}: PhotoSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [direction, setDirection] = useState<number>(1);
  const [showInterstitial, setShowInterstitial] = useState<boolean>(false);
  const [interstitialText, setInterstitialText] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentPhoto = photos[currentIndex] || photos[0];
  const currentUrl = currentPhoto ? (photoUrls[currentPhoto.filename] || photoUrls[currentPhoto.id] || `/photos/${encodeURIComponent(currentPhoto.filename)}`) : '';

  // Interstitial messages between certain photos as requested
  const checkAndTriggerInterstitial = useCallback((targetIndex: number, nextFn: () => void) => {
    const photo = photos[targetIndex];
    if (photo?.interstitialMessage && targetIndex !== 0) {
      setInterstitialText(photo.interstitialMessage);
      setShowInterstitial(true);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    nextFn();
  }, [photos]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setImageLoaded(false);
    setImageError(false);

    if (currentIndex < photos.length - 1) {
      const nextIdx = currentIndex + 1;
      const nextPhoto = photos[nextIdx];
      if (nextPhoto?.interstitialMessage) {
        setInterstitialText(nextPhoto.interstitialMessage);
        setShowInterstitial(true);
      } else {
        setCurrentIndex(nextIdx);
      }
    } else {
      // Reached the end! Move to the final romantic section
      onFinishJourney();
    }
  }, [currentIndex, photos, onFinishJourney]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setImageLoaded(false);
    setImageError(false);
    setShowInterstitial(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const dismissInterstitial = useCallback(() => {
    setShowInterstitial(false);
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : prev));
  }, [photos.length]);

  // Touch Swipe Handlers for mobile phones
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipeLeft = distance > 50;
    const isSwipeRight = distance < -50;

    if (isSwipeLeft) {
      if (showInterstitial) dismissInterstitial();
      else handleNext();
    } else if (isSwipeRight) {
      if (showInterstitial) setShowInterstitial(false);
      else handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (showInterstitial) dismissInterstitial();
        else handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (showInterstitial) setShowInterstitial(false);
        else handlePrev();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen?.().catch(() => {});
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, showInterstitial, isFullscreen, dismissInterstitial]);

  // Slideshow Auto-advance Timer
  useEffect(() => {
    if (!isPlaying || showInterstitial) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalTime = 5500; // 5.5 seconds per slide
    timerRef.current = setInterval(() => {
      handleNext();
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, showInterstitial, handleNext]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 30 },
        opacity: { duration: 0.65 },
        scale: { duration: 0.65 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      scale: 1.04,
      transition: { duration: 0.5 },
    }),
  };

  return (
    <div
      ref={containerRef}
      id="photo-slideshow-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-black text-white select-none"
    >
      {/* Dynamic Ambient Background Blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        {currentUrl && !imageError && (
          <img
            src={currentUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover blur-3xl scale-125"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/75" />
      </div>

      {/* Top Header Navigation Bar */}
      <header
        id="slideshow-header"
        className="relative z-30 flex items-center justify-between px-4 py-4 sm:px-8 sm:py-5"
      >
        <div className="flex items-center gap-3">
          <button
            id="btn-slideshow-back"
            onClick={onBackToStart}
            aria-label="Back to opening"
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-neutral-300 backdrop-blur-md transition-colors hover:border-rose-500/40 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Opening</span>
          </button>

          {/* Progress Pill */}
          <div
            id="slideshow-counter"
            className="flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-950/30 px-3 py-1 text-xs font-medium text-rose-200 backdrop-blur-md"
          >
            <Heart className="h-3 w-3 fill-rose-500 text-rose-400" />
            <span>
              {String(currentIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-slideshow-autoplay"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all ${
              isPlaying
                ? 'border-rose-500/40 bg-rose-950/50 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'border-white/10 bg-black/40 text-neutral-300 hover:border-rose-500/30'
            }`}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>

          <button
            id="btn-slideshow-fullscreen"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-neutral-300 backdrop-blur-md transition-colors hover:border-rose-500/30 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          <button
            id="btn-slideshow-manage-photos"
            onClick={onOpenPhotoManager}
            title="Manage or upload photos"
            className="flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-950/40 px-3 py-1.5 text-xs text-rose-200 backdrop-blur-md transition-colors hover:bg-rose-900/60"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Sync Photos</span>
          </button>
        </div>
      </header>

      {/* Main Slideshow Stage */}
      <main id="slideshow-stage" className="relative z-20 flex flex-1 items-center justify-center px-3 py-2 sm:px-12">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {showInterstitial ? (
            /* Romantic Interstitial Message Screen */
            <motion.div
              key="interstitial"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto flex max-w-xl flex-col items-center justify-center p-6 text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/40 bg-gradient-to-tr from-rose-600/30 to-pink-900/40 shadow-[0_0_35px_rgba(244,63,94,0.4)] backdrop-blur-xl">
                <Sparkles className="h-8 w-8 text-rose-300" />
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-2xl font-semibold tracking-tight text-rose-100 sm:text-4xl font-serif italic"
              >
                &ldquo;{interstitialText}&rdquo;
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.4 }}
                className="mb-8 text-sm text-rose-200/70"
              >
                10 Months with you, and my love keeps growing.
              </motion.p>

              <button
                id="btn-continue-interstitial"
                onClick={dismissInterstitial}
                className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all hover:scale-105 active:scale-95"
              >
                <span>Continue Our Story</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            /* Current Photo Card */
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative flex h-full max-h-[78vh] w-full max-w-4xl flex-col items-center justify-center"
            >
              {/* Photo Frame with soft rose glow and glass frame */}
              <div className="group relative flex max-h-[66vh] w-full items-center justify-center overflow-hidden rounded-2xl border border-rose-500/20 bg-neutral-950/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                {/* Loading state indicator */}
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950/90 text-rose-300">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-500/20 border-t-rose-500" />
                    <span className="text-xs tracking-wider uppercase opacity-70">Unveiling memory...</span>
                  </div>
                )}

                {/* Graceful Fallback if image not yet on disk */}
                {imageError ? (
                  <div className="flex h-72 w-full flex-col items-center justify-center gap-4 p-8 text-center bg-gradient-to-b from-neutral-900 to-black">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-rose-500/30 bg-rose-950/50 text-rose-300">
                      <Heart className="h-7 w-7 fill-rose-500 text-rose-400" />
                    </div>
                    <div className="max-w-md">
                      <p className="text-sm font-medium text-rose-200">
                        Memory #{currentIndex + 1}: {currentPhoto.title}
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        File: {currentPhoto.filename}
                      </p>
                    </div>
                    <button
                      onClick={onOpenPhotoManager}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-950/80 px-4 py-2 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-900"
                    >
                      <UploadCloud className="h-3.5 w-3.5" />
                      <span>Upload / Sync This Photo</span>
                    </button>
                  </div>
                ) : (
                  <motion.img
                    src={currentUrl}
                    alt={currentPhoto?.title || 'Our Anniversary Photo'}
                    referrerPolicy="no-referrer"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                      setImageError(true);
                      setImageLoaded(true);
                    }}
                    animate={{
                      scale: [1, 1.04],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'linear',
                    }}
                    className="max-h-[66vh] w-auto max-w-full rounded-xl object-contain shadow-2xl transition-opacity duration-500"
                    style={{ opacity: imageLoaded ? 1 : 0 }}
                  />
                )}

                {/* Subtle Date Tag */}
                {currentPhoto?.dateTag && (
                  <div className="absolute top-3 left-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-medium text-rose-200/90 backdrop-blur-md">
                    {currentPhoto.dateTag}
                  </div>
                )}
              </div>

              {/* Romantic Caption Bar */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-3 flex flex-col items-center px-4 text-center"
              >
                <h3 className="text-base font-semibold text-white sm:text-xl font-serif">
                  {currentPhoto.title}
                </h3>
                <p className="mt-1 max-w-lg text-xs leading-relaxed text-rose-200/85 sm:text-sm">
                  {currentPhoto.caption}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next / Previous Navigation Buttons (Desktop & Touch Clickers) */}
        {!showInterstitial && (
          <>
            <button
              id="btn-slideshow-prev"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous photo"
              className={`absolute left-2 sm:left-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all ${
                currentIndex === 0
                  ? 'opacity-20 cursor-not-allowed border-white/5 bg-black/20 text-neutral-600'
                  : 'border-white/10 bg-neutral-950/60 text-white hover:border-rose-500/40 hover:bg-rose-950/40 hover:text-rose-200 active:scale-95 shadow-lg'
              }`}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              id="btn-slideshow-next"
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-2 sm:right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-rose-500/30 bg-neutral-950/70 text-white backdrop-blur-md transition-all hover:border-rose-400 hover:bg-rose-950/50 hover:text-rose-200 active:scale-95 shadow-[0_0_20px_rgba(244,63,94,0.25)]"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </main>

      {/* Bottom Thumbnail Strip and Timeline Bar */}
      <footer id="slideshow-footer" className="relative z-30 flex flex-col gap-2 px-4 pb-4 sm:px-8">
        {/* Animated Progress Timer Line */}
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            key={`${currentIndex}-${isPlaying}`}
            initial={{ width: '0%' }}
            animate={{ width: isPlaying && !showInterstitial ? '100%' : '0%' }}
            transition={{
              duration: isPlaying && !showInterstitial ? 5.5 : 0,
              ease: 'linear',
            }}
            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400"
          />
        </div>

        {/* Thumbnail scrubber */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-[80vw]">
            {photos.map((p, idx) => {
              const pUrl = photoUrls[p.filename] || photoUrls[p.id] || `/photos/${encodeURIComponent(p.filename)}`;
              const isActive = idx === currentIndex;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setImageLoaded(false);
                    setImageError(false);
                    setShowInterstitial(false);
                    setCurrentIndex(idx);
                  }}
                  className={`group relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border transition-all ${
                    isActive
                      ? 'border-rose-400 ring-2 ring-rose-500/50 scale-105'
                      : 'border-white/10 opacity-50 hover:opacity-100'
                  }`}
                  aria-label={`Jump to photo ${idx + 1}`}
                >
                  <img
                    src={pUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback thumbnail icon
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Jump to Final Love Note Button */}
          <button
            id="btn-jump-to-finish"
            onClick={onFinishJourney}
            className="hidden sm:inline-flex shrink-0 items-center gap-1 text-xs text-rose-300/80 hover:text-rose-200 transition-colors"
          >
            <span>Our Final Note</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </footer>
    </div>
  );
}
