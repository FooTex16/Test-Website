import React from 'react';
import { playSoundEffect } from '../utils/audio';

interface FooterProps {
  onOpenAdultGate: () => void;
  onOpenMedals: () => void;
  onOpenOlu: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdultGate,
  onOpenMedals,
  onOpenOlu,
}) => {
  return (
    <footer className="w-full bg-white border-t-2 border-surface-container-high py-8 px-4 sm:px-6 mt-12 text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-secondary to-primary-container flex items-center justify-center text-xl shadow-sm text-white">
              🪐
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-extrabold text-secondary">
                EduVerse Indonesia
              </span>
              <span className="text-xs font-bold text-on-surface-variant">
                Semesta Belajar Interaktif SD • Jelajahi Duniamu, Temukan Jawabanmu
              </span>
            </div>
          </div>

          {/* Quick Safe Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-extrabold text-on-surface-variant">
            <span className="flex items-center gap-1 text-primary">
              <span>🛡️</span> 100% Bebas Iklan
            </span>
            <span>•</span>
            <span>Kepatuhan UU PDP Anak</span>
            <span>•</span>
            <button
              onClick={() => {
                playSoundEffect('click');
                onOpenMedals();
              }}
              className="text-amber-700 underline hover:text-amber-900 cursor-pointer"
            >
              Medali Ekspedisi
            </button>
            <span>•</span>
            <button
              onClick={() => {
                playSoundEffect('click');
                onOpenOlu();
              }}
              className="text-primary underline hover:text-primary-dark cursor-pointer"
            >
              Tanya Robot Olu
            </button>
            <span>•</span>
            <button
              onClick={() => {
                playSoundEffect('click');
                onOpenAdultGate();
              }}
              className="text-secondary underline hover:text-purple-900 cursor-pointer font-black"
            >
              Mode Guru / Orang Tua 🔒
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-on-surface-variant border-t border-surface-container pt-4 text-center sm:text-left">
          <p>
            © 2026 EduVerse Indonesia. Dibuat dengan cinta untuk generasi masa depan Indonesia.
          </p>
          <p className="text-[11px] text-slate-400">
            Mendukung Kurikulum Merdeka Fase A (Kls 1–2), Fase B (Kls 3–4), dan Fase C (Kls 5–6).
          </p>
        </div>
      </div>
    </footer>
  );
};
