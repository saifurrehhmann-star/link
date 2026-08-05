import React, { useState, useEffect } from 'react';
import { CardData } from '../types';
import { Sparkles, Wand2, Image as ImageIcon, Heart, Check, RefreshCw } from 'lucide-react';
import { presetPhotos } from '../data';

interface CustomizerModalProps {
  cardData: CardData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: CardData) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  cardData,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CardData>(cardData);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiTone, setAiTone] = useState('heartfelt & warm');
  const [activeTab, setActiveTab] = useState<'details' | 'photo' | 'theme'>('details');

  useEffect(() => {
    setFormData(cardData);
  }, [cardData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof CardData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      sealInitials:
        field === 'groomName' || field === 'brideName'
          ? `${(field === 'groomName' ? value : prev.groomName).charAt(0)}&${(field === 'brideName' ? value : prev.brideName).charAt(0)}`
          : prev.sealInitials,
    }));
  };

  const handleGenerateAiMessage = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/generate-blessing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groomName: formData.groomName,
          brideName: formData.brideName,
          tone: aiTone,
        }),
      });
      const data = await res.json();
      if (data.message) {
        setFormData((prev) => ({ ...prev, message: data.message }));
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-display text-xl font-semibold text-amber-200">
              Personalize Wedding Card
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-sans-clean px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 px-6">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-medium uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Names & Message
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`py-3 px-4 text-xs font-medium uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'photo'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Photo & Image
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`py-3 px-4 text-xs font-medium uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'theme'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Color Theme
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
                    Groom Name
                  </label>
                  <input
                    type="text"
                    value={formData.groomName}
                    onChange={(e) => handleChange('groomName', e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 text-white"
                    placeholder="e.g. Hammad"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
                    Bride Name
                  </label>
                  <input
                    type="text"
                    value={formData.brideName}
                    onChange={(e) => handleChange('brideName', e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 text-white"
                    placeholder="e.g. Sanya"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
                    Eyebrow Banner
                  </label>
                  <input
                    type="text"
                    value={formData.eyebrow}
                    onChange={(e) => handleChange('eyebrow', e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 text-white"
                    placeholder="e.g. Congratulations"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
                    Event Date
                  </label>
                  <input
                    type="text"
                    value={formData.eventDate}
                    onChange={(e) => handleChange('eventDate', e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 text-white"
                    placeholder="e.g. 15 August 2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
                  Headline Text
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.heading}
                    onChange={(e) => handleChange('heading', e.target.value)}
                    className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 text-white"
                    placeholder="e.g. Wishing you both"
                  />
                  <input
                    type="text"
                    value={formData.headingEm}
                    onChange={(e) => handleChange('headingEm', e.target.value)}
                    className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 text-amber-200 italic"
                    placeholder="e.g. a beautiful new chapter"
                  />
                </div>
              </div>

              {/* AI Writer Assistant */}
              <div className="p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                    AI Blessing Writer (Gemini 2.5)
                  </span>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="bg-slate-900 text-xs text-amber-200 border border-amber-500/40 rounded px-2 py-0.5 focus:outline-none"
                  >
                    <option value="heartfelt & warm">Heartfelt & Warm</option>
                    <option value="poetic & romantic">Poetic & Romantic</option>
                    <option value="formal & solemn">Formal & Traditional</option>
                    <option value="joyful & humorous">Joyful & Lively</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAiMessage}
                  disabled={isGeneratingAi}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-all shadow-md disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Composing AI Blessing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Auto-Write Poetic Blessing
                    </>
                  )}
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
                  Card Message
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-400 text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
                  Signature / Sign-off
                </label>
                <input
                  type="text"
                  value={formData.signature}
                  onChange={(e) => handleChange('signature', e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 text-white"
                  placeholder="e.g. With love, Family & Friends"
                />
              </div>
            </div>
          )}

          {activeTab === 'photo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
                  Custom Image URL or Base64
                </label>
                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={(e) => handleChange('photoUrl', e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 text-white font-mono text-xs"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                  Or Pick a Curated Preset Photo
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {presetPhotos.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleChange('photoUrl', preset.url)}
                      className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                        formData.photoUrl === preset.url
                          ? 'border-amber-400 ring-2 ring-amber-400/50'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-20 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-[10px] text-white text-center font-medium">
                        {preset.name}
                      </div>
                      {formData.photoUrl === preset.url && (
                        <div className="absolute top-1 right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                Select Visual Palette
              </label>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    id: 'twilight-navy',
                    title: 'Twilight Navy & Gold',
                    bg: 'bg-slate-900 border-amber-500/40 text-amber-200',
                  },
                  {
                    id: 'rose-gold',
                    title: 'Rose Gold & Blush',
                    bg: 'bg-rose-950 border-rose-400/40 text-rose-200',
                  },
                  {
                    id: 'emerald-gold',
                    title: 'Emerald & Gold',
                    bg: 'bg-emerald-950 border-amber-400/40 text-emerald-200',
                  },
                  {
                    id: 'champagne-cream',
                    title: 'Champagne & Warm Cream',
                    bg: 'bg-stone-900 border-amber-300/40 text-amber-100',
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, theme: t.id as CardData['theme'] }))}
                    className={`p-4 rounded-xl border-2 text-left flex flex-col justify-between h-20 transition-all ${t.bg} ${
                      formData.theme === t.id
                        ? 'ring-2 ring-amber-400 border-amber-400'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className="font-serif-display text-sm font-semibold">{t.title}</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-70">
                      {formData.theme === t.id ? 'Active Theme' : 'Click to select'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg shadow-lg transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
