'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Sparkles } from 'lucide-react';
import { romanticAudio } from '@/lib/audio';

interface MusicPlayerProps {
  className?: string;
}

export function MusicPlayer({ className }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePlay = React.useCallback(async () => {
    if (customAudioUrl && customAudioRef.current) {
      if (isPlaying) {
        customAudioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await customAudioRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          console.warn('Autoplay prevented:', e);
        }
      }
      return;
    }

    if (romanticAudio) {
      const nowPlaying = romanticAudio.toggle();
      setIsPlaying(nowPlaying);
    }
  }, [customAudioUrl, isPlaying]);

  useEffect(() => {
    if (romanticAudio) {
      romanticAudio.setListener((playing) => {
        if (!customAudioUrl) {
          setIsPlaying(playing);
        }
      });
    }
  }, [customAudioUrl]);

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (romanticAudio && isPlaying) {
        romanticAudio.pause();
      }
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setIsPlaying(true);
      setTimeout(() => {
        if (customAudioRef.current) {
          customAudioRef.current.play().catch(console.warn);
        }
      }, 100);
    }
  };

  return (
    <div id="music-player-container" className="fixed top-4 right-4 sm:top-6 sm:right-8 z-50 flex items-center gap-2 sm:gap-3">
      {customAudioUrl && (
        <audio
          ref={customAudioRef}
          src={customAudioUrl}
          loop
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Artistic Flair Music Status Pill */}
      <div
        onClick={handleTogglePlay}
        className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3 sm:px-4 py-2 rounded-full backdrop-blur-md shadow-lg cursor-pointer hover:border-white/20 transition-all select-none"
      >
        <div
          className={`w-2 h-2 rounded-full transition-all ${
            isPlaying
              ? 'bg-pink-500 animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.9)]'
              : 'bg-white/30'
          }`}
        />
        <span className="text-[10px] uppercase tracking-widest text-white/80 font-medium">
          {isPlaying ? 'Our Melody' : 'Music: Paused'}
        </span>
      </div>

      {/* Circular Play / Pause Button */}
      <button
        id="btn-music-toggle"
        onClick={handleTogglePlay}
        aria-label={isPlaying ? 'Pause music' : 'Play romantic melody'}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md flex items-center justify-center transition-all text-white shadow-md active:scale-95 cursor-pointer"
      >
        {isPlaying ? (
          <Volume2 className="h-4 w-4 text-pink-300" />
        ) : (
          <VolumeX className="h-4 w-4 text-white/50" />
        )}
      </button>

      {/* Secret/Optional Custom Track Uploader */}
      <label
        id="btn-custom-song-upload"
        title="Upload your personal anniversary song (MP3)"
        className="cursor-pointer w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-pink-300 backdrop-blur-md transition-colors shadow-sm"
      >
        <Music className="h-3.5 w-3.5" />
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleCustomAudioUpload}
        />
      </label>
    </div>
  );
}
