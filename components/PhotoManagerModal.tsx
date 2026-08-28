'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UploadCloud, CheckCircle2, AlertCircle, Image as ImageIcon, Heart, RefreshCw } from 'lucide-react';
import { PhotoItem } from '@/lib/photos-data';

interface PhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: PhotoItem[];
  photoUrls: Record<string, string>;
  onPhotosUpdated: () => void;
}

export function PhotoManagerModal({
  isOpen,
  onClose,
  photos,
  photoUrls,
  onPhotosUpdated,
}: PhotoManagerModalProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFilesUpload = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadStatus('Saving photos to public/photos...');

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setUploadStatus(`Saved ${data.savedFiles?.length || files.length} photo(s) successfully!`);
        onPhotosUpdated();
        setTimeout(() => {
          setUploadStatus(null);
        }, 3000);
      } else {
        setUploadStatus('Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Failed to upload photos:', err);
      setUploadStatus('Error uploading photos.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-rose-500/30 bg-neutral-950 p-6 shadow-[0_0_50px_rgba(244,63,94,0.25)] text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-500/30 bg-rose-950/60 text-rose-300">
                <UploadCloud className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif">Sync Our 11 Photos</h3>
                <p className="text-xs text-neutral-400">
                  Save all 11 photos directly into the project bundle
                </p>
              </div>
            </div>

            <button
              id="btn-close-photo-manager"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-neutral-900 text-neutral-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Upload Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
              isDragOver
                ? 'border-rose-400 bg-rose-950/40'
                : 'border-white/15 bg-neutral-900/40 hover:border-rose-500/40 hover:bg-neutral-900/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFilesUpload(e.target.files);
              }}
            />

            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-500/30 bg-rose-950/50 text-rose-300 mb-3">
              {isUploading ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : (
                <UploadCloud className="h-6 w-6" />
              )}
            </div>

            <p className="text-sm font-semibold text-white">
              {isUploading ? 'Uploading photos...' : 'Drag & drop our 11 photos here'}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              or tap to browse files from your computer / phone
            </p>

            {uploadStatus && (
              <div className="mt-3 flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-950/80 px-3 py-1 text-xs text-rose-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-rose-400" />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>

          {/* List of 11 Configured Slots */}
          <div className="mt-4 flex-1 overflow-y-auto pr-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-300 mb-2">
              Configured Memory Slots ({photos.length})
            </h4>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {photos.map((p, idx) => {
                const url = photoUrls[p.filename] || photoUrls[p.id] || `/photos/${encodeURIComponent(p.filename)}`;
                const isSynced = Boolean(photoUrls[p.filename]);

                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-900/60 p-2.5 text-left"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-800 border border-white/10">
                      <img
                        src={url}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-neutral-500">
                        {idx + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        {idx + 1}. {p.title}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">
                        {p.filename}
                      </p>
                    </div>

                    {isSynced ? (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-950/80 text-emerald-400" title="Photo bundled">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-950/80 text-rose-400" title="Ready to upload">
                        <Heart className="h-3 w-3 fill-rose-500/40" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-4 border-t border-white/10 pt-3 text-center text-xs text-neutral-400">
            <span>
              All uploaded photos are stored in <code className="text-rose-300">public/photos/</code> and bundled with your site.
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
