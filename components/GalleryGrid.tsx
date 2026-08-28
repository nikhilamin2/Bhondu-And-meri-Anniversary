'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, Play, ArrowLeft, Download, UploadCloud, Sparkles } from 'lucide-react';
import { PhotoItem } from '@/lib/photos-data';

interface GalleryGridProps {
  photos: PhotoItem[];
  photoUrls: Record<string, string>;
  onStartSlideshow: () => void;
  onBackToFinal: () => void;
  onOpenPhotoManager: () => void;
}

export function GalleryGrid({
  photos,
  photoUrls,
  onStartSlideshow,
  onBackToFinal,
  onOpenPhotoManager,
}: GalleryGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  return (
    <div id="gallery-grid-view" className="min-h-screen w-full bg-black px-4 py-8 text-white sm:px-8">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <button
            id="btn-gallery-back"
            onClick={onBackToFinal}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-neutral-900/60 text-neutral-300 transition-colors hover:border-rose-500/30 hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl font-serif">
              Our 10 Months Gallery
            </h2>
            <p className="text-xs text-rose-300/80">Every cherished picture from our journey</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-gallery-start-slideshow"
            onClick={onStartSlideshow}
            className="flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-950/60 px-4 py-2 text-xs font-semibold text-rose-200 backdrop-blur-md transition-colors hover:bg-rose-900 shadow-sm"
          >
            <Play className="h-3.5 w-3.5 fill-rose-300" />
            <span>Play Slideshow</span>
          </button>

          <button
            id="btn-gallery-manage-photos"
            onClick={onOpenPhotoManager}
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/10 bg-neutral-900/80 px-3.5 py-2 text-xs text-neutral-300 hover:border-rose-500/30 hover:text-white"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Sync</span>
          </button>
        </div>
      </header>

      {/* Grid of Photos */}
      <main className="mx-auto my-8 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => {
          const url = photoUrls[photo.filename] || photoUrls[photo.id] || `/photos/${encodeURIComponent(photo.filename)}`;

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-rose-500/20 bg-neutral-950/80 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.3)]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                <img
                  src={url}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to placeholder box
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 transition-opacity group-hover:opacity-80" />

                {/* Date Tag */}
                {photo.dateTag && (
                  <span className="absolute top-2.5 left-2.5 rounded-full border border-white/10 bg-black/60 px-2.5 py-0.5 text-[10px] font-medium text-rose-200 backdrop-blur-md">
                    {photo.dateTag}
                  </span>
                )}

                <span className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-3.5 w-3.5 fill-rose-500" />
                </span>

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 text-left">
                  <h4 className="text-sm font-semibold text-white line-clamp-1 font-serif">
                    {photo.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-rose-200/80 line-clamp-2">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] max-w-3xl flex-col items-center overflow-hidden rounded-3xl border border-rose-500/30 bg-neutral-950 p-4 shadow-[0_0_50px_rgba(244,63,94,0.3)] sm:p-6"
            >
              <button
                id="btn-close-lightbox"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo"
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition-colors hover:bg-rose-950 hover:text-rose-200"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative max-h-[65vh] w-full overflow-hidden rounded-2xl">
                <img
                  src={
                    photoUrls[selectedPhoto.filename] ||
                    photoUrls[selectedPhoto.id] ||
                    `/photos/${encodeURIComponent(selectedPhoto.filename)}`
                  }
                  alt={selectedPhoto.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] w-full object-contain"
                />
              </div>

              <div className="mt-4 w-full text-center">
                <span className="text-xs uppercase tracking-widest text-rose-400 font-semibold">
                  {selectedPhoto.dateTag || 'Our 10 Months Memory'}
                </span>
                <h3 className="mt-1 text-lg font-bold text-white font-serif sm:text-xl">
                  {selectedPhoto.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
                  {selectedPhoto.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
