import React, { useState, useEffect, useRef } from 'react';
import { CardData, GuestbookEntry } from './types';
import { defaultCardData, defaultGuestbookEntries } from './data';
import { audioSynth } from './lib/audio';
import { EnvelopeOverlay } from './components/EnvelopeOverlay';
import { CustomizerModal } from './components/CustomizerModal';
import { GuestbookSection } from './components/GuestbookSection';
import {
  Volume2,
  VolumeX,
  Edit3,
  Share2,
  Heart,
  Check,
  Sparkles,
  Download,
  Copy,
  MessageSquare,
  Eye,
  Gift
} from 'lucide-react';

export default function App() {
  const [cardData, setCardData] = useState<CardData>(() => {
    const saved = localStorage.getItem('celebration_card_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.signature === 'With love, Family & Friends' || !parsed.signature) {
          return {
            ...parsed,
            signature: 'With endless love, Your Best Friend',
            message: 'To my best friend on your special milestone! May this new chapter bring you and your partner endless laughter, shared dreams, and a love that only deepens with time. Always here for you both!'
          };
        }
        return parsed;
      } catch { return defaultCardData; }
    }
    return defaultCardData;
  });

  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>(() => {
    const saved = localStorage.getItem('celebration_guestbook_entries');
    if (saved) {
      try { return JSON.parse(saved); } catch { return defaultGuestbookEntries; }
    }
    return defaultGuestbookEntries;
  });

  const [isCardOpened, setIsCardOpened] = useState(false);
  const [isOpeningEnvelope, setIsOpeningEnvelope] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'card' | 'guestbook'>('card');

  const photoFrameRef = useRef<HTMLDivElement>(null);

  // Parallax tilt effect
  useEffect(() => {
    if (!isCardOpened || !photoFrameRef.current) return;

    const frame = photoFrameRef.current;
    const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
    const maxTilt = 6;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let animId: number;

    const tick = () => {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      if (frame) {
        frame.style.transform = `rotateX(${curX.toFixed(2)}deg) rotateY(${curY.toFixed(2)}deg)`;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    if (!isTouch) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = frame.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (window.innerWidth / 2);
        const dy = (e.clientY - cy) / (window.innerHeight / 2);
        targetX = Math.max(-1, Math.min(1, -dy)) * maxTilt;
        targetY = Math.max(-1, Math.min(1, dx)) * maxTilt;
      };

      const handleMouseLeave = () => {
        targetX = 0;
        targetY = 0;
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        cancelAnimationFrame(animId);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    } else {
      let gyroActive = false;
      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.beta === null || e.gamma === null) return;
        gyroActive = true;
        targetX = Math.max(-maxTilt, Math.min(maxTilt, (e.beta - 45) * -0.25));
        targetY = Math.max(-maxTilt, Math.min(maxTilt, e.gamma * 0.25));
      };

      window.addEventListener('deviceorientation', handleOrientation);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, [isCardOpened]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('celebration_card_data', JSON.stringify(cardData));
  }, [cardData]);

  useEffect(() => {
    localStorage.setItem('celebration_guestbook_entries', JSON.stringify(guestbookEntries));
  }, [guestbookEntries]);

  const handleOpenCard = () => {
    if (isOpeningEnvelope || isCardOpened) return;
    setIsOpeningEnvelope(true);

    if (soundOn) {
      audioSynth.start();
    }

    setTimeout(() => {
      setIsCardOpened(true);
      setIsOpeningEnvelope(false);
    }, 1650);
  };

  const handleToggleSound = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newSoundState = !soundOn;
    setSoundOn(newSoundState);
    audioSynth.setMuted(!newSoundState);
    if (newSoundState && isCardOpened && !audioSynth.getIsPlaying()) {
      audioSynth.start();
    }
  };

  const handleSaveCardData = (updated: CardData) => {
    setCardData(updated);
  };

  const handleAddGuestbookEntry = (entry: Omit<GuestbookEntry, 'id' | 'timestamp' | 'likes'>) => {
    const newEntry: GuestbookEntry = {
      ...entry,
      id: `g-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }) + ` at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      likes: 1,
    };
    setGuestbookEntries((prev) => [newEntry, ...prev]);
    audioSynth.playChime();
  };

  const handleLikeGuestbookEntry = (id: string) => {
    setGuestbookEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
  };

  const handleShareCard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      className="min-h-screen min-h-[100dvh] w-full font-sans-clean text-[#14293f] relative overflow-x-hidden flex flex-col items-center justify-between transition-colors duration-1000"
      style={{
        background:
          cardData.theme === 'rose-gold'
            ? 'linear-gradient(180deg, #2a1b24 0%, #1f121a 45%, #2d141e 100%)'
            : cardData.theme === 'emerald-gold'
            ? 'linear-gradient(180deg, #0d231e 0%, #081714 45%, #102d27 100%)'
            : cardData.theme === 'champagne-cream'
            ? 'linear-gradient(180deg, #2b2620 0%, #1c1813 45%, #302921 100%)'
            : 'linear-gradient(180deg, #0b1a2b 0%, #14293f 45%, #1c3350 100%)',
      }}
    >
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_80%_85%,rgba(255,255,255,0.05),transparent_45%)]" />

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="particle animate-drift absolute rounded-full bg-white/40"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              left: `${Math.random() * 100}vw`,
              bottom: '-5%',
              animationDuration: `${10 + Math.random() * 10}s`,
              animationDelay: `-${Math.random() * 14}s`,
              ['--dx' as string]: `${Math.random() * 30 - 15}px`,
            }}
          />
        ))}
      </div>

      {/* Gift Envelope Intro Overlay */}
      <EnvelopeOverlay
        cardData={cardData}
        isOpen={isCardOpened}
        isOpening={isOpeningEnvelope}
        soundOn={soundOn}
        onOpen={handleOpenCard}
        onToggleSound={handleToggleSound}
        onCustomizeClick={() => setIsCustomizerOpen(true)}
      />

      {/* Top Floating Control Bar */}
      {isCardOpened && (
        <header className="sticky top-0 z-40 w-full bg-slate-950/60 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between text-white/90">
          <div className="flex items-center gap-2">
            <span className="font-serif-display text-lg font-medium text-amber-200 hidden sm:inline">
              {cardData.groomName} &amp; {cardData.brideName}
            </span>
            <span className="text-xs font-sans-clean text-slate-300 sm:hidden">
              {cardData.groomName} &amp; {cardData.brideName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSound}
              type="button"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-amber-200 transition-all flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans-clean"
              title={soundOn ? 'Mute Music' : 'Play Music'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-amber-200" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span className="hidden sm:inline">{soundOn ? 'Sound On' : 'Muted'}</span>
            </button>

            <button
              onClick={handleShareCard}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Container Stage */}
      <main className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-8 z-10">
        {isCardOpened && (
          <div className="w-full flex flex-col items-center justify-center max-w-2xl py-6 [perspective:1000px]">
            {/* The Luxury Main Celebration Card */}
            <div
              id="celebrationCard"
              className="relative w-full max-w-[440px] bg-white p-8 sm:p-12 shadow-2xl rounded-sm border border-slate-200 animate-card-popup"
            >
                {/* Inner double border */}
                <div className="absolute inset-3 border border-[#c3d4e3] pointer-events-none" />

                {/* Photo frame section with 3D tilt */}
                <div className="flex justify-center mb-6 perspective-700">
                  <div
                    ref={photoFrameRef}
                    className="relative w-full max-w-[260px] p-2 bg-white shadow-[0_12px_28px_rgba(20,41,63,0.18),0_0_0_1px_#c3d4e3,0_0_42px_6px_rgba(240,200,105,0.22)] transition-transform duration-100 ease-out rounded-sm"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="absolute -inset-3.5 bg-[radial-gradient(circle,rgba(240,200,105,0.28),transparent_70%)] -z-10 pointer-events-none" />
                    <img
                      src={cardData.photoUrl}
                      alt={`${cardData.groomName} & ${cardData.brideName}`}
                      className="w-full h-auto object-cover rounded-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-1 border border-[#c3d4e3] pointer-events-none" />
                  </div>
                </div>

                {/* Eyebrow */}
                <div className="text-center font-sans-clean font-normal text-[11px] tracking-[0.32em] uppercase text-[#7d97ac]">
                  {cardData.eyebrow}
                </div>

                {/* Heading */}
                <h1 className="text-center font-serif-display font-medium text-2xl sm:text-3xl sm:leading-snug text-[#14293f] mt-3">
                  {cardData.heading}
                  <br />
                  <em className="font-serif-display italic font-medium text-[#0b1a2b]">
                    {cardData.headingEm}
                  </em>
                </h1>

                {/* Metallic Gold Divider */}
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#caa24f] via-[#f3dfa3] to-transparent my-6 mx-auto" />

                {/* Couple Names */}
                <div className="flex items-baseline justify-center text-center font-serif-display font-medium text-2xl sm:text-3xl tracking-wide text-[#14293f]">
                  <span>{cardData.groomName}</span>
                  <span className="text-[#7d97ac] mx-2.5 text-lg italic text-[0.62em] relative -top-0.5">
                    {cardData.separator}
                  </span>
                  <span>{cardData.brideName}</span>
                </div>

                {/* Date */}
                <div className="flex items-center justify-center gap-2.5 text-center font-sans-clean font-normal text-xs tracking-[0.14em] uppercase text-[#7d97ac] mt-3">
                  <span className="w-4 h-px bg-[#c3d4e3]" />
                  <span>{cardData.eventDate}</span>
                  <span className="w-4 h-px bg-[#c3d4e3]" />
                </div>

                {/* Message */}
                <p className="text-center font-sans-clean font-light text-sm sm:text-base leading-relaxed text-[#47607a] max-w-xs mx-auto mt-6">
                  {cardData.message}
                </p>

                {/* Signature */}
                <div className="text-center mt-6">
                  <span className="block w-6 h-px bg-gradient-to-r from-transparent via-[#caa24f] to-transparent mx-auto mb-2" />
                  <span className="font-serif-display italic font-medium text-base text-[#7d97ac]">
                    {cardData.signature}
                  </span>
                </div>
              </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="w-full text-center py-4 text-xs font-sans-clean text-slate-400/60 z-10">
        Created with ❤️ for Hammad &amp; Sanya’s Celebration
      </footer>

      {/* Customizer Drawer/Modal */}
      <CustomizerModal
        cardData={cardData}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onSave={handleSaveCardData}
      />
    </div>
  );
}
