import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { MEDALS_DATA } from '../data/eduverseData';
import { playSoundEffect, playTTS } from '../utils/audio';

interface MedalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
}

export const MedalsModal: React.FC<MedalsModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  if (!isOpen) return null;

  const unlockedCount = profile.unlockedMedalIds.length;
  const totalMedals = MEDALS_DATA.length;

  const filteredMedals = MEDALS_DATA.filter((m) => {
    const isUnlocked = profile.unlockedMedalIds.includes(m.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white border-4 border-surface-container-high shadow-[0_16px_0_#d6e2f8] overflow-hidden text-left">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
              🏅
            </div>
            <div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-white">
                Koleksi Medali Prestasi
              </h2>
              <p className="text-xs sm:text-sm font-bold text-amber-100">
                {unlockedCount} dari {totalMedals} Medali Berhasil Diraih!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSoundEffect('click');
              onClose();
            }}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-black text-xl transition-all cursor-pointer"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-3 bg-surface-container-low border-b border-surface-container flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Semua ({totalMedals})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filter === 'unlocked'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Terkumpul ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filter === 'locked'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-white text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Belum Terbuka ({totalMedals - unlockedCount})
          </button>
        </div>

        {/* Medals Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMedals.map((medal) => {
            const isUnlocked = profile.unlockedMedalIds.includes(medal.id);
            return (
              <div
                key={medal.id}
                onClick={() => {
                  playSoundEffect(isUnlocked ? 'fanfare' : 'click');
                  playTTS(`${medal.title}. ${medal.description}`);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 relative ${
                  isUnlocked
                    ? 'bg-amber-50/60 border-amber-300 hover:border-amber-400 hover:shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm ${
                    isUnlocked ? 'bg-white' : 'bg-slate-200 grayscale'
                  }`}
                >
                  {medal.emoji}
                </div>

                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-display font-black text-sm text-on-surface truncate">
                      {medal.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase shrink-0 ${
                        medal.rarity === 'Legendary'
                          ? 'bg-purple-100 text-purple-800'
                          : medal.rarity === 'Epic'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {medal.rarity}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-on-surface-variant leading-relaxed line-clamp-2">
                    {medal.description}
                  </p>

                  <div className="text-[10px] font-extrabold text-slate-500 pt-1">
                    {isUnlocked ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <span>✓</span> Terbuka ({medal.dateUnlocked || 'Hari Ini'})
                      </span>
                    ) : (
                      <span>🔒 Syarat: {medal.criteria}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-low border-t border-surface-container flex items-center justify-between">
          <p className="text-xs font-bold text-on-surface-variant">
            💡 Selesaikan quest harian &amp; tantangan mini games untuk menambah medali!
          </p>
          <button
            onClick={() => {
              playSoundEffect('click');
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
