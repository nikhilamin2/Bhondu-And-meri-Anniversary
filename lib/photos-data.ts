export interface PhotoItem {
  id: string;
  filename: string;
  title: string;
  caption: string;
  dateTag?: string;
  interstitialMessage?: string; // Romantic quote shown before/after this photo
}

export const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: "photo-1",
    filename: "WhatsApp Image 2026-08-28 at 1.57.42 PM.jpeg",
    title: "Our Warm Hugs & Sweet Smiles",
    caption: "The way you hold me makes the whole world fade away.",
    dateTag: "Month 1",
    interstitialMessage: "Every moment with you is special ❤️",
  },
  {
    id: "photo-2",
    filename: "WhatsApp Image 2026-08-28 at 1.57.42 PM (1).jpeg",
    title: "Silly Pouty Faces",
    caption: "Never a dull second when I'm being goofy with you, my Bhondu.",
    dateTag: "Month 2",
  },
  {
    id: "photo-3",
    filename: "WhatsApp Image 2026-08-28 at 1.57.42 PM (2).jpeg",
    title: "Holding You Close",
    caption: "Wrapped in your warmth under the open sky.",
    dateTag: "Month 3",
    interstitialMessage: "10 months of us ❤️",
  },
  {
    id: "photo-4",
    filename: "WhatsApp Image 2026-08-28 at 1.57.43 PM.jpeg",
    title: "Water Adventures & Big Splashes",
    caption: "Soaking up the sun and making waves together.",
    dateTag: "Month 4",
  },
  {
    id: "photo-5",
    filename: "WhatsApp Image 2026-08-28 at 1.57.43 PM (1).jpeg",
    title: "Leaning On My Favorite Person",
    caption: "Resting my head on your shoulder is where I find peace.",
    dateTag: "Month 5",
    interstitialMessage: "And I would choose you again and again.",
  },
  {
    id: "photo-6",
    filename: "WhatsApp Image 2026-08-28 at 1.57.45 PM.jpeg",
    title: "Late Night Drives & Heartfelt Talks",
    caption: "Every journey with you feels like home.",
    dateTag: "Month 6",
  },
  {
    id: "photo-7",
    filename: "WhatsApp Image 2026-08-28 at 1.57.46 PM.jpeg",
    title: "The Most Beautiful Woman in Red",
    caption: "You take my breath away every single time you dress up.",
    dateTag: "Month 7",
    interstitialMessage: "You turn ordinary days into my favorite memories ❤️",
  },
  {
    id: "photo-8",
    filename: "WhatsApp Image 2026-08-28 at 1.57.46 PM (1).jpeg",
    title: "Date Nights & Celebrations",
    caption: "Raising a toast to us, our bond, and our unending laughter.",
    dateTag: "Month 8",
  },
  {
    id: "photo-9",
    filename: "WhatsApp Image 2026-08-28 at 1.57.47 PM.jpeg",
    title: "Cheek-to-Cheek Loveliness",
    caption: "Forever your biggest fan and your happiest companion.",
    dateTag: "Month 9",
    interstitialMessage: "Thank you for being the sweetest part of my life ❤️",
  },
  {
    id: "photo-10",
    filename: "WhatsApp Image 2026-08-28 at 1.57.48 PM.jpeg",
    title: "Mirror Reflections of Us",
    caption: "Just look at us — two souls madly, truly in love.",
    dateTag: "Month 10",
  },
  {
    id: "photo-11",
    filename: "WhatsApp Image 2026-08-28 at 1.57.49 PM.jpeg",
    title: "A Kiss That Stops Time",
    caption: "Here is to 10 months of magic, and a lifetime more to go.",
    dateTag: "Today & Forever",
    interstitialMessage: "Happy 10 Months, My Love ❤️",
  },
];
