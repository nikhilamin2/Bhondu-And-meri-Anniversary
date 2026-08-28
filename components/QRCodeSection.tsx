'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode as QrIcon, Copy, Check, Share2, Smartphone } from 'lucide-react';

interface QRCodeSectionProps {
  customUrl?: string;
}

export function QRCodeSection({ customUrl }: QRCodeSectionProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Derive siteUrl cleanly
  const siteUrl =
    customUrl ||
    (typeof window !== 'undefined'
      ? window.location.href
      : process.env.NEXT_PUBLIC_APP_URL || 'https://ais-dev-i4zwepdwxseybsfrrtlp2o-889587836088.asia-southeast1.run.app');

  useEffect(() => {
    let isMounted = true;

    // Generate crisp QR code data URL asynchronously
    QRCode.toDataURL(siteUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
        }
      })
      .catch((err) => {
        console.error('QR code generation failed:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [siteUrl]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Happy 10 Months, My Love ❤️',
          text: 'Open our anniversary memories and photo story 💕',
          url: siteUrl,
        });
      } catch (err) {
        console.warn('Share cancelled:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      id="qr-code-section"
      className="relative mx-auto flex w-full max-w-md flex-col items-center rounded-3xl border border-rose-500/25 bg-gradient-to-b from-neutral-900/90 to-black p-6 text-center shadow-[0_0_50px_rgba(244,63,94,0.18)] backdrop-blur-xl sm:p-8"
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-950/40 px-3.5 py-1 text-xs font-medium text-rose-300">
        <Smartphone className="h-3.5 w-3.5" />
        <span>Open On Your Phone</span>
      </div>

      <h3 className="text-xl font-bold tracking-tight text-white font-serif">
        Scan On Her Mobile Screen
      </h3>
      <p className="mt-1 text-xs text-neutral-400">
        Perfect for scanning together during your anniversary date.
      </p>

      {/* High-contrast QR Code frame */}
      <div
        id="qr-code-frame"
        className="relative my-6 flex h-64 w-64 items-center justify-center rounded-2xl border-4 border-rose-500/30 bg-white p-3 shadow-[0_0_40px_rgba(244,63,94,0.35)]"
      >
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Anniversary Website QR Code"
            className="h-full w-full object-contain rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-neutral-400">
            <QrIcon className="h-10 w-10 animate-pulse text-rose-500" />
            <span className="text-xs">Generating QR...</span>
          </div>
        )}
      </div>

      {/* Mandatory exact phrase from prompt */}
      <p
        id="qr-code-caption"
        className="text-base font-semibold text-rose-300 drop-shadow-sm font-serif"
      >
        Scan this ❤️ to open our memories
      </p>

      {/* Share / Copy buttons */}
      <div className="mt-5 flex w-full items-center gap-2">
        <button
          id="btn-copy-site-link"
          onClick={handleCopyLink}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-neutral-800/80 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:border-rose-500/40 hover:bg-neutral-800"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-neutral-400" />
              <span>Copy Direct Link</span>
            </>
          )}
        </button>

        <button
          id="btn-share-site"
          onClick={handleNativeShare}
          className="flex items-center justify-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-950/60 px-4 py-2.5 text-xs font-medium text-rose-200 transition-colors hover:bg-rose-900"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
