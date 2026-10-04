import React from 'react';
import { playSoundEffect, playTTS } from '../utils/audio';

interface HeroSectionProps {
  onStartAdventure: () => void;
  onTryMission: () => void;
  onOpenOlu: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAdventure,
  onTryMission,
  onOpenOlu,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface py-12 sm:py-16 px-4 sm:px-6">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-8 text-4xl opacity-20 select-none animate-float">🌟</div>
      <div className="absolute top-24 right-12 text-5xl opacity-20 select-none animate-float" style={{ animationDelay: '1.2s' }}>🪐</div>
      <div className="absolute bottom-6 left-1/4 text-4xl opacity-15 select-none animate-float" style={{ animationDelay: '2s' }}>🚀</div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
        {/* Left Column: Hero Text & Actions */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed border border-primary text-on-primary-container text-xs sm:text-sm font-black shadow-xs">
            <span className="text-base animate-pulse">✨</span>
            <span>Semesta Belajar Interaktif Anak SD Kelas 1–6</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-on-surface leading-tight tracking-tight">
            Belajar Jadi Petualangan Seru di{' '}
            <span className="text-primary underline decoration-tertiary-container decoration-wavy decoration-3">
              EduVerse!
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg font-bold text-on-surface-variant max-w-2xl leading-relaxed">
            Taklukkan 7 Dunia Pengetahuan Nusantara, bangun kotamu sendiri dengan kepingan Star Shards, dan berteman dengan Robot Olu yang selalu siap membantu!
          </p>

          {/* Accessible Audio Read-Aloud Button */}
          <button
            onClick={() => {
              playSoundEffect('click');
              playTTS(
                'Selamat datang di EduVerse! Semesta belajar interaktif untuk anak SD. Ayo jelajahi 7 dunia belajar, selesaikan misi seru, dan kumpulkan bintang!'
              );
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-surface-container-high text-xs font-black text-primary hover:bg-surface-container-low transition-all shadow-xs cursor-pointer"
            title="Dengarkan pembacaan teks ini"
          >
            <span>🔊</span>
            <span>Dengarkan Suara Pembuka</span>
          </button>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
            <button
              onClick={() => {
                playSoundEffect('click');
                onStartAdventure();
              }}
              className="btn-tactile-teal min-w-[200px] px-6 text-sm sm:text-base font-black flex items-center justify-center gap-2"
            >
              <span>Mulai Petualangan</span>
              <span>🚀</span>
            </button>

            <button
              onClick={() => {
                playSoundEffect('click');
                onTryMission();
              }}
              className="btn-tactile-yellow min-w-[180px] px-6 text-sm sm:text-base font-black flex items-center justify-center gap-2"
            >
              <span>Coba Misi Cepat</span>
              <span>⚡</span>
            </button>

            <button
              onClick={() => {
                playSoundEffect('click');
                onOpenOlu();
              }}
              className="btn-tactile-white min-w-[170px] px-5 text-sm sm:text-base font-black flex items-center justify-center gap-2"
            >
              <span>Tanya Robot Olu</span>
              <span>🤖</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-3 text-xs font-extrabold text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 text-base">🛡️</span>
              <span>100% Aman &amp; Tanpa Iklan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 text-base">🏆</span>
              <span>Kurikulum Merdeka SD</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-500 text-base">⏱️</span>
              <span>Pengingat Istirahat Layar</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Visual Showcase */}
        <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-surface-container-lowest dark:bg-[#161f2e] border-4 border-surface-container-high dark:border-slate-700 shadow-[0_12px_0_#d6e2f8] dark:shadow-[0_12px_0_#0f172a] transition-all">
            {/* Top Banner inside card */}
            <div className="flex items-center justify-between pb-4 border-b border-surface-container-high dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-2xl shadow-sm">
                  🧭
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-on-surface">Peta Ekspedisi Harian</h3>
                  <p className="text-xs font-bold text-primary dark:text-teal-400">Status: Siap Meluncur</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-black text-xs border border-tertiary-container">
                ⭐ 7 Hari Beruntun
              </span>
            </div>

            {/* Middle Feature Highlights */}
            <div className="grid grid-cols-2 gap-3 py-5">
              <div className="p-3.5 rounded-2xl bg-surface-container-low dark:bg-[#1f2a3e] border border-surface-container dark:border-slate-700 flex flex-col gap-1">
                <span className="text-2xl">🧮</span>
                <span className="font-display font-black text-sm text-on-surface">Pulau Numeria</span>
                <span className="text-[11px] font-bold text-on-surface-variant">Pecahan Pizza &amp; Logika</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low dark:bg-[#1f2a3e] border border-surface-container dark:border-slate-700 flex flex-col gap-1">
                <span className="text-2xl">🔬</span>
                <span className="font-display font-black text-sm text-on-surface">Galaksi Sains</span>
                <span className="text-[11px] font-bold text-on-surface-variant">Daur Air &amp; Planet Mars</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low dark:bg-[#1f2a3e] border border-surface-container dark:border-slate-700 flex flex-col gap-1">
                <span className="text-2xl">📚</span>
                <span className="font-display font-black text-sm text-on-surface">Lembah Kata</span>
                <span className="text-[11px] font-bold text-on-surface-variant">Dongeng Kancil &amp; Kosakata</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low dark:bg-[#1f2a3e] border border-surface-container dark:border-slate-700 flex flex-col gap-1">
                <span className="text-2xl">🏙️</span>
                <span className="font-display font-black text-sm text-on-surface">EduVerse City</span>
                <span className="text-[11px] font-bold text-on-surface-variant">Bangun Kota Impianmu</span>
              </div>
            </div>

            {/* Olu Floating Dialog Bubble */}
            <div className="p-4 rounded-2xl bg-primary-fixed/30 dark:bg-primary-fixed/20 border-2 border-primary-container dark:border-teal-500/40 flex items-center gap-3">
              <div
                onClick={onOpenOlu}
                className="w-12 h-12 rounded-2xl bg-surface-container-lowest dark:bg-[#1e293b] border-2 border-primary-container flex items-center justify-center text-2xl shadow-xs cursor-pointer hover:scale-105 transition-transform shrink-0"
              >
                🤖
              </div>
              <p className="text-xs font-bold text-on-surface leading-snug">
                "Halo Sahabat Cilik! Aku <span className="font-black text-primary dark:text-teal-400">Olu</span>. Klik aku jika kamu butuh bantuan atau ingin bertanya rahasia sains apa saja!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
