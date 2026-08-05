export interface CardData {
  id: string;
  eyebrow: string;
  heading: string;
  headingEm: string;
  groomName: string;
  brideName: string;
  separator: string;
  eventDate: string;
  message: string;
  signature: string;
  photoUrl: string;
  photoCaption?: string;
  sealInitials: string;
  theme: 'twilight-navy' | 'rose-gold' | 'emerald-gold' | 'champagne-cream';
}

export interface GuestbookEntry {
  id: string;
  author: string;
  relation: string;
  message: string;
  timestamp: string;
  likes: number;
}

export interface PresetPhoto {
  id: string;
  name: string;
  url: string;
  category: string;
}
