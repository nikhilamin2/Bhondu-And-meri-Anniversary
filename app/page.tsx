'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_PHOTOS, PhotoItem } from '@/lib/photos-data';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { MusicPlayer } from '@/components/MusicPlayer';
import { romanticAudio } from '@/lib/audio';
import { OpeningScreen } from '@/components/OpeningScreen';
import { PhotoSlideshow } from '@/components/PhotoSlideshow';
import { FinalSection } from '@/components/FinalSection';
import { GalleryGrid } from '@/components/GalleryGrid';
import { PhotoManagerModal } from '@/components/PhotoManagerModal';

type AppView = 'opening' | 'slideshow' | 'final' | 'gallery';

export default function AnniversaryApp() {
  const [currentView, setCurrentView] = useState<AppView>('opening');
  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState<boolean>(false);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    let isSubscribed = true;

    async function initPhotos() {
      try {
        const res = await fetch('/api/photos');
        if (!isSubscribed) return;
        if (res.ok) {
          const data = await res.json();
          if (data.files && Array.isArray(data.files) && isSubscribed) {
            const map: Record<string, string> = {};
            data.files.forEach((f: { filename: string; url: string }) => {
              map[f.filename] = f.url;
            });

            setPhotoUrls((prev) => ({
              ...prev,
              ...map,
            }));

            if (data.files.length > 0) {
              setPhotos((prev) => {
                const updated = [...prev];
                data.files.forEach((f: { filename: string; url: string }, idx: number) => {
                  const existingIndex = updated.findIndex(
                    (p) => p.filename.toLowerCase() === f.filename.toLowerCase()
                  );
                  if (existingIndex !== -1) {
                    map[updated[existingIndex].filename] = f.url;
                  } else if (idx < updated.length) {
                    map[updated[idx].filename] = f.url;
                  }
                });
                return updated;
              });
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch photo directory:', err);
      }
    }

    initPhotos();

    return () => {
      isSubscribed = false;
    };
  }, [refreshKey]);

  const handleStartJourney = () => {
    if (romanticAudio && !romanticAudio.getIsPlaying()) {
      romanticAudio.start().catch(() => {});
    }
    setCurrentView('slideshow');
  };

  const handleFinishJourney = () => {
    setCurrentView('final');
  };

  const handleOpenGallery = () => {
    setCurrentView('gallery');
  };

  const handleReplaySlideshow = () => {
    setCurrentView('slideshow');
  };

  const handleBackToStart = () => {
    setCurrentView('opening');
  };

  const handleBackToFinal = () => {
    setCurrentView('final');
  };

  const firstPhoto = photos[0];
  const firstPhotoUrl = firstPhoto
    ? photoUrls[firstPhoto.filename] || photoUrls[firstPhoto.id] || `/photos/${encodeURIComponent(firstPhoto.filename)}`
    : undefined;

  return (
    <main
      id="anniversary-app-root"
      className="relative min-h-screen w-full overflow-x-hidden bg-[#050505] text-[#f8f8f8] font-sans selection:bg-pink-500/30 selection:text-pink-200"
    >
      {/* Artistic Flair Atmospheric Background Blurs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-40 z-0" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#4a1a1a] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#2a0a0a] blur-[150px]" />
        <div className="absolute top-[35%] right-[20%] h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[100px]" />
      </div>

      {/* Artistic Flair Radial Dot Matrix Pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Artistic Flair Floating Decorative Hearts */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-[15%] left-[10%] text-3xl text-pink-500/20">❤</div>
        <div className="absolute top-[45%] left-[45%] text-xl text-pink-500/10">❤</div>
        <div className="absolute bottom-[20%] right-[15%] text-2xl text-pink-500/20">❤</div>
        <div className="absolute top-[80%] left-[30%] text-lg text-pink-500/15">❤</div>
      </div>

      {/* Dynamic Romantic Floating Particles & Starfield */}
      <ParticlesBackground />

      {/* Floating Ambient Music Controller */}
      <MusicPlayer />

      {/* Main View Router with Fluid Transitions */}
      <AnimatePresence mode="wait">
        {currentView === 'opening' && (
          <motion.div
            key="view-opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <OpeningScreen
              onStartJourney={handleStartJourney}
              onOpenPhotoManager={() => setIsPhotoManagerOpen(true)}
              onOpenGallery={handleOpenGallery}
              firstPhotoUrl={firstPhotoUrl}
              photosCount={photos.length}
            />
          </motion.div>
        )}

        {currentView === 'slideshow' && (
          <motion.div
            key="view-slideshow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <PhotoSlideshow
              photos={photos}
              photoUrls={photoUrls}
              onFinishJourney={handleFinishJourney}
              onOpenPhotoManager={() => setIsPhotoManagerOpen(true)}
              onBackToStart={handleBackToStart}
            />
          </motion.div>
        )}

        {currentView === 'final' && (
          <motion.div
            key="view-final"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <FinalSection
              onOpenGallery={handleOpenGallery}
              onReplaySlideshow={handleReplaySlideshow}
            />
          </motion.div>
        )}

        {currentView === 'gallery' && (
          <motion.div
            key="view-gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <GalleryGrid
              photos={photos}
              photoUrls={photoUrls}
              onStartSlideshow={handleReplaySlideshow}
              onBackToFinal={handleBackToFinal}
              onOpenPhotoManager={() => setIsPhotoManagerOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Manager Modal for In-App Syncing */}
      <PhotoManagerModal
        isOpen={isPhotoManagerOpen}
        onClose={() => setIsPhotoManagerOpen(false)}
        photos={photos}
        photoUrls={photoUrls}
        onPhotosUpdated={() => setRefreshKey((k) => k + 1)}
      />
    </main>
  );
}
