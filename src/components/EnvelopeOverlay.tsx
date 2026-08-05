import React from 'react';
import { CardData } from '../types';
import { Volume2, VolumeX, Sparkles, Edit3, Share2, Heart, Download } from 'lucide-react';

interface EnvelopeOverlayProps {
  cardData: CardData;
  isOpen: boolean;
  isOpening: boolean;
  soundOn: boolean;
  onOpen: () => void;
  onToggleSound: (e: React.MouseEvent) => void;
  onCustomizeClick: (e: React.MouseEvent) => void;
}

export const EnvelopeOverlay: React.FC<EnvelopeOverlayProps> = ({
  cardData,
  isOpen,
  isOpening,
  soundOn,
  onOpen,
  onToggleSound,
  onCustomizeClick,
}) => {
  if (isOpen) return null;

  return (
    <div
      onClick={onOpen}
      id="giftOverlay"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 p-6 cursor-pointer select-none transition-all duration-1000 ease-in-out ${
        isOpening ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
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
      {/* Subtle floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="particle animate-drift absolute rounded-full bg-white/60"
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

      {/* Floating 3D Gift Envelope */}
      <div className={`relative w-[160px] h-[112px] sm:w-[180px] sm:h-[126px] ${isOpening ? '' : 'animate-float-envelope'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#f4f8fb] to-white border border-[#c3d4e3] shadow-2xl rounded-sm" />
        
        {/* Flap */}
        <div
          className={`absolute top-0 left-0 w-0 h-0 border-l-[80px] sm:border-l-[90px] border-l-transparent border-r-[80px] sm:border-r-[90px] border-r-transparent border-t-[62px] sm:border-t-[70px] border-t-[#eef3f8] origin-top transition-transform duration-700 ease-in-out drop-shadow-md ${
            isOpening ? 'rotate-x-180 scale-y-[-1]' : ''
          }`}
          style={{ transformOrigin: 'top center' }}
        />

        {/* Wax Seal */}
        <div
          className={`absolute top-[42px] sm:top-[48px] left-1/2 -translate-x-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-radial from-[#4a6f92] to-[#0b1a2b] shadow-lg border-[1.5px] border-[#f3dfa3]/70 flex items-center justify-center z-10 transition-all duration-300 ${
            isOpening ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
          }`}
        >
          <span className="font-serif-display font-medium text-xs sm:text-sm tracking-widest text-[#f3dfa3]">
            {cardData.sealInitials || 'H&S'}
          </span>
        </div>
      </div>

      {/* Tap Invitation Label */}
      <div className="text-center text-white/80 font-sans-clean font-light text-xs sm:text-sm tracking-[0.28em] uppercase transition-opacity duration-300">
        A special gift for you
        <br />
        <span className="text-amber-200/90 font-serif-display lowercase italic tracking-normal text-base text-gold-light mt-1 block">
          — tap envelope to open —
        </span>
      </div>

      {/* Top Bar Actions on Envelope */}
      <div className="flex items-center gap-3 mt-2 z-20" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onToggleSound}
          type="button"
          aria-label="Toggle ambient music"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3.5 py-1.5 text-white/80 hover:text-white font-sans-clean text-[10px] tracking-wider uppercase transition-all duration-200"
        >
          {soundOn ? <Volume2 className="w-3.5 h-3.5 text-amber-200" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          <span>{soundOn ? 'Sound On' : 'Muted'}</span>
        </button>

        <button
          onClick={onCustomizeClick}
          type="button"
          className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-300/40 rounded-full px-3.5 py-1.5 text-amber-100 hover:text-white font-sans-clean text-[10px] tracking-wider uppercase transition-all duration-200"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Customize Card</span>
        </button>
      </div>
    </div>
  );
};
