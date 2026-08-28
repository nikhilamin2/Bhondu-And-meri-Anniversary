import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Happy 10 Months, My Bhondu ❤️ | Our Romantic Journey',
  description: 'A romantic 10-month anniversary website and interactive photo journey for my love, featuring our cherished memories, romantic messages, background music, and a QR code to share.',
  openGraph: {
    title: 'Happy 10 Months, My Bhondu ❤️ | Our Romantic Journey',
    description: 'A romantic 10-month anniversary website and interactive photo journey for my love, featuring our cherished memories, romantic messages, background music, and a QR code to share.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Happy 10 Months, My Bhondu ❤️ | Our Romantic Journey',
    description: 'A romantic 10-month anniversary website and interactive photo journey for my love, featuring our cherished memories, romantic messages, background music, and a QR code to share.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
