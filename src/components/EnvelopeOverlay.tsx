import React from 'react';
import { CardData } from '../types';
import { Volume2, VolumeX } from 'lucide-react';

interface EnvelopeOverlayProps {
  cardData: CardData;
  isOpen: boolean;
  isOpening: boolean;
  soundOn: boolean;
  onOpen: () => void;
  onToggleSound: (e: React.MouseEvent) => void;
  onCustomizeClick?: (e: React.MouseEvent) => void;
}

export const EnvelopeOverlay: React.FC<EnvelopeOverlayProps> = ({
  cardData,
  isOpen,
  isOpening,
  soundOn,
  onOpen,
  onToggleSound,
}) => {
  if (isOpen) return null;

  return (
    <div
      onClick={onOpen}
      id="giftOverlay"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 sm:gap-6 p-4 sm:p-6 cursor-pointer select-none transition-all duration-700 ease-in-out ${
        isOpening ? 'opacity-0 pointer-events-none delay-1000' : 'opacity-100'
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
      <div className={`relative w-[190px] h-[133px] sm:w-[230px] sm:h-[160px] ${isOpening ? '' : 'animate-float-envelope'}`}>
        {/* Envelope back body */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f4f8fb] to-white border border-[#c3d4e3] shadow-2xl rounded-sm z-10" />
        
        {/* Letter Card sliding UP out of envelope during opening */}
        <div
          className={`absolute inset-x-2 bottom-2 top-2 bg-gradient-to-b from-white to-slate-50 border border-[#caa24f]/70 rounded-xs shadow-2xl z-25 flex flex-col items-center justify-center p-3 text-center transition-all duration-700 ease-out ${
            isOpening
              ? '-translate-y-36 sm:-translate-y-48 opacity-100 scale-110 delay-300'
              : 'translate-y-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-[#caa24f] to-transparent mb-1" />
          <span className="font-serif-display text-sm sm:text-base font-bold text-[#14293f] leading-snug">
            {cardData.groomName} &amp; {cardData.brideName}
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#caa24f] font-serif-display italic mt-0.5 tracking-wide">
            {cardData.eventDate}
          </span>
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-[#caa24f] to-transparent mt-1" />
        </div>

        {/* Envelope Flap */}
        <div
          className={`absolute top-0 left-0 w-0 h-0 border-l-[95px] sm:border-l-[115px] border-l-transparent border-r-[95px] sm:border-r-[115px] border-r-transparent border-t-[72px] sm:border-t-[86px] border-t-[#eef3f8] origin-top transition-transform duration-500 ease-in-out drop-shadow-md z-20 ${
            isOpening ? '[transform:rotateX(180deg)]' : ''
          }`}
          style={{ transformOrigin: 'top center' }}
        />

        {/* Wax Seal */}
        <div
          className={`absolute top-[50px] sm:top-[60px] left-1/2 -translate-x-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-radial from-[#4a6f92] to-[#0b1a2b] shadow-xl border-[1.5px] border-[#f3dfa3]/80 flex items-center justify-center z-30 transition-all duration-300 ${
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
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-1.5 text-white/80 hover:text-white font-sans-clean text-[11px] tracking-wider uppercase transition-all duration-200 shadow-sm"
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-amber-200" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          <span>{soundOn ? 'Sound On' : 'Muted'}</span>
        </button>
      </div>
    </div>
  );
};
