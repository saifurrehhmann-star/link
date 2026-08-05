import React, { useState } from 'react';
import { GuestbookEntry } from '../types';
import { MessageSquare, Heart, Send, Sparkles, User, UserCheck } from 'lucide-react';

interface GuestbookSectionProps {
  entries: GuestbookEntry[];
  onAddEntry: (entry: Omit<GuestbookEntry, 'id' | 'timestamp' | 'likes'>) => void;
  onLikeEntry: (id: string) => void;
  groomName: string;
  brideName: string;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  entries,
  onAddEntry,
  onLikeEntry,
  groomName,
  brideName,
}) => {
  const [author, setAuthor] = useState('');
  const [relation, setRelation] = useState('Friend / Well-wisher');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    setIsSubmitting(true);
    onAddEntry({
      author: author.trim(),
      relation: relation.trim(),
      message: message.trim(),
    });

    setAuthor('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-xl mt-12 bg-white/95 backdrop-blur-sm border border-[#c3d4e3] rounded-2xl shadow-xl p-6 sm:p-8 text-[#14293f] relative overflow-hidden">
      {/* Decorative top rule */}
      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#caa24f] to-transparent mx-auto mb-4" />

      <div className="text-center mb-6">
        <h3 className="font-serif-display font-medium text-2xl sm:text-3xl text-[#14293f] flex items-center justify-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#caa24f]" />
          Guestbook &amp; Blessings
        </h3>
        <p className="font-sans-clean text-xs sm:text-sm text-[#47607a] mt-1">
          Leave a heartfelt note or wish for {groomName} &amp; {brideName}
        </p>
      </div>

      {/* Add New Entry Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-[#eef3f8]/60 border border-[#c3d4e3]/80 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#7d97ac] mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Uncle Farhan & Family"
              className="w-full bg-white border border-[#c3d4e3] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#caa24f] text-[#14293f]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#7d97ac] mb-1">
              Relation / Connection
            </label>
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="w-full bg-white border border-[#c3d4e3] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#caa24f] text-[#14293f]"
            >
              <option value="Family">Family</option>
              <option value="Close Friend">Close Friend</option>
              <option value="College / School Friend">College / School Friend</option>
              <option value="Colleague / Work">Colleague</option>
              <option value="Well-wisher">Well-wisher</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#7d97ac] mb-1">
            Blessing / Wish Message
          </label>
          <textarea
            required
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Write your love and prayers for ${groomName} & ${brideName}...`}
            className="w-full bg-white border border-[#c3d4e3] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#caa24f] text-[#14293f] leading-relaxed"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#14293f] hover:bg-[#0b1a2b] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
          >
            <Send className="w-3.5 h-3.5 text-[#f3dfa3]" />
            Post Blessing
          </button>
        </div>
      </form>

      {/* Guestbook List */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <p className="text-center text-xs text-slate-500 italic py-4">
            No blessings added yet. Be the first to leave a heartfelt wish!
          </p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="p-3.5 bg-white border border-slate-200/80 rounded-xl hover:border-[#caa24f]/60 transition-all shadow-sm space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#14293f] text-[#f3dfa3] font-serif-display font-bold text-xs flex items-center justify-center">
                    {entry.author.charAt(0)}
                  </div>
                  <div>
                    <span className="font-serif-display font-semibold text-sm text-[#14293f] block leading-none">
                      {entry.author}
                    </span>
                    <span className="text-[10px] text-[#7d97ac] font-sans-clean">
                      {entry.relation} • {entry.timestamp}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onLikeEntry(entry.id)}
                  type="button"
                  className="flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-full transition-colors"
                >
                  <Heart className="w-3 h-3 fill-rose-500" />
                  <span>{entry.likes}</span>
                </button>
              </div>

              <p className="text-xs text-slate-700 font-sans-clean leading-relaxed pl-8 italic">
                "{entry.message}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
