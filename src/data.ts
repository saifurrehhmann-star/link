import { CardData, GuestbookEntry, PresetPhoto } from './types';

export const defaultCardData: CardData = {
  id: 'card-1',
  eyebrow: 'Congratulations',
  heading: 'Wishing you both',
  headingEm: 'a beautiful new chapter',
  groomName: 'Hammad',
  brideName: 'Sanya',
  separator: '&',
  eventDate: '15 August 2026',
  message: 'May this new beginning be filled with quiet joys, shared dreams, and a partnership that only deepens with time. Warmest congratulations to you both.',
  signature: 'With love, Family & Friends',
  photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  photoCaption: 'Hammad & Sanya',
  sealInitials: 'H&S',
  theme: 'twilight-navy',
};

export const defaultGuestbookEntries: GuestbookEntry[] = [
  {
    id: 'g-1',
    author: 'Uncle Tariq & Aunt Aisha',
    relation: 'Family',
    message: 'Wishing Hammad & Sanya a lifetime of laughter, prosperity, and everlasting harmony. You look radiant together!',
    timestamp: 'August 5, 2026 at 2:15 PM',
    likes: 12,
  },
  {
    id: 'g-2',
    author: 'Farhan & Maria',
    relation: 'College Friends',
    message: 'So incredibly happy for both of you! May your journey ahead be blessed with countless adventures and unending love.',
    timestamp: 'August 5, 2026 at 3:40 PM',
    likes: 8,
  },
  {
    id: 'g-3',
    author: 'Zainab K.',
    relation: 'Cousin',
    message: 'Sending you endless love and prayers on your special milestone. Can’t wait to celebrate together in person!',
    timestamp: 'August 5, 2026 at 4:20 PM',
    likes: 5,
  },
];

export const presetPhotos: PresetPhoto[] = [
  {
    id: 'photo-1',
    name: 'Romantic Sunset Couple',
    category: 'Couples',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-2',
    name: 'Golden Elegance Wedding Rings',
    category: 'Rings',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-3',
    name: 'Serene Botanical Floral Arch',
    category: 'Floral',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-4',
    name: 'Elegant Hand in Hand Embrace',
    category: 'Couples',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-5',
    name: 'Soft Rose Gold Bouquet',
    category: 'Floral',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-6',
    name: 'Intimate Candlelit Dinner Table',
    category: 'Decor',
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
  },
];
