import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { playTTS, playSoundEffect } from '../utils/audio';

interface HeaderProps {
  profile: StudentProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdultGate: () => void;
  onOpenMedals: () => void;
  onOpenCity: () => void;
  onOpenOlu: () => void;
  sessionMinutes: number;
  isLoggedIn: boolean;
  isAdmin: boolean;
  authUsername: string;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  setActiveTab,
  onOpenAdultGate,
  onOpenMedals,
  onOpenCity,
  onOpenOlu,
  sessionMinutes,
  isLoggedIn,
  isAdmin,
  authUsername,
  onOpenAuth,
  onLogout,
  isDark,
  onToggleDark,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    playSoundEffect('click');
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const NAV_ITEMS = [
    { id: 'home', label: '🏠 Beranda', emoji: '🏠', short: 'Beranda' },
    { id: 'worlds', label: '🗺️ 7 Dunia', emoji: '🗺️', short: '7 Dunia' },
    { id: 'games', label: '🎮 Mini Games', emoji: '🎮', short: 'Games' },
    { id: 'story', label: '📖 Cerita', emoji: '📖', short: 'Cerita' },
    { id: 'discovery', label: '🧪 Lab Fakta', emoji: '🧪', short: 'Lab' },
  ];

  return (
    <header className="fixed top-0 w-full z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b-2 border-surface-container-high shadow-sm">
      {/* ===== SINGLE ROW: Logo | Nav | Points | User ===== */}
      <div className="w-full px-2 sm:px-4 h-16 flex items-center gap-2">

        {/* BRAND (shrink-0 so it never collapses) */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-1.5 shrink-0 focus:outline-none cursor-pointer group"
          title="EduVerse Beranda"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-secondary to-primary-container flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform shrink-0">
            🪐
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="font-display text-lg font-black text-secondary tracking-tight leading-none">EduVerse</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-black text-[9px]">SD 1–6</span>
            </div>
          </div>
        </button>

        {/* DESKTOP NAV — only visible xl+ */}
        <nav className="hidden xl:flex items-center gap-0.5 bg-surface-container-low px-1.5 py-1 rounded-2xl border border-surface-container-high ml-1 shrink-0">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-2.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { playSoundEffect('click'); onOpenCity(); }}
            className="px-2.5 py-1.5 rounded-xl font-black text-xs text-on-surface-variant hover:text-on-surface transition-all cursor-pointer whitespace-nowrap"
          >
            🏙️ Kotaku
          </button>
        </nav>

        {/* MEDIUM NAV — visible md–xl (compact icon+text) */}
        <nav className="hidden md:flex xl:hidden items-center gap-0.5 bg-surface-container-low px-1 py-1 rounded-xl border border-surface-container-high ml-1 shrink-0 overflow-x-auto max-w-[260px] scrollbar-none">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-2 py-1 rounded-lg font-black text-[10px] transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === item.id
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.emoji} {item.short}
            </button>
          ))}
          <button
            onClick={() => { playSoundEffect('click'); onOpenCity(); }}
            className="px-2 py-1 rounded-lg font-black text-[10px] text-on-surface-variant hover:text-on-surface cursor-pointer whitespace-nowrap shrink-0"
          >
            🏙️ Kota
          </button>
        </nav>

        {/* SPACER */}
        <div className="flex-1" />

        {/* GAMIFIED POINTS STRIP — hidden on mobile */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => { playSoundEffect('click'); playTTS(`Kamu memiliki ${profile.sparks} Spark!`); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-black text-xs border-2 border-[#dba500] shadow-[0_2px_0_#dba500] active:translate-y-0.5 transition-all cursor-pointer"
            title="Spark Energi Belajar"
          >
            <span className="text-sm">✨</span>
            <span>{profile.sparks}</span>
            <span className="text-[9px] opacity-80">Spark</span>
          </button>

          <button
            onClick={() => { playSoundEffect('click'); onOpenCity(); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-primary-fixed text-on-primary-container font-black text-xs border-2 border-[#00c49f] shadow-[0_2px_0_#00c49f] active:translate-y-0.5 transition-all cursor-pointer"
            title="Star Shards"
          >
            <span className="text-sm">💎</span>
            <span>{profile.starShards}</span>
            <span className="text-[9px] opacity-80">Shards</span>
          </button>

          <div
            className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-[#ffebe6] text-[#c93b16] font-black text-xs border border-[#ffb4a2]"
            title="Streak Hari Belajar"
          >
            <span>🔥</span>
            <span>{profile.streakDays}h</span>
          </div>

          <button
            onClick={() => { playSoundEffect('click'); onOpenMedals(); }}
            className="p-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-amber-600 border border-surface-container-high transition-colors cursor-pointer"
            title="Medali"
          >
            <span className="text-base">🏅</span>
          </button>
        </div>

        {/* RIGHT: DARK TOGGLE + USER + GURU&ORTU + HAMBURGER */}
        <div className="flex items-center gap-1.5 shrink-0 ml-1">

          {/* Dark Mode Toggle */}
          <button
            onClick={() => { playSoundEffect('click'); onToggleDark(); }}
            className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high transition-all cursor-pointer"
            title={isDark ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
          >
            <span className="text-base leading-none">{isDark ? '☀️' : '🌙'}</span>
          </button>

          {/* User Auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border-2 border-primary-container shadow-[0_2px_0_#00c49f] max-w-[170px]">
              <span className="text-base shrink-0">🚀</span>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-xs font-black text-on-surface truncate max-w-[80px]">
                  Kapten {authUsername}
                </span>
                <span className="text-[9px] font-bold text-primary leading-none">Cloud ☁️</span>
              </div>
              <button
                onClick={onLogout}
                className="ml-1 px-1.5 py-0.5 rounded-lg bg-white hover:bg-rose-50 text-[9px] font-bold text-rose-600 border border-rose-200 cursor-pointer shrink-0"
                title="Keluar"
              >
                Keluar
              </button>
            </div>
          ) : (
            <button
              onClick={() => { playSoundEffect('click'); onOpenAuth('login'); }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed hover:brightness-105 border-2 border-secondary shadow-[0_2px_0_#4f00d0] font-black text-xs active:translate-y-0.5 transition-all cursor-pointer"
            >
              <span className="text-sm">🔑</span>
              <span className="hidden sm:inline">Masuk</span>
            </button>
          )}

          {/* Adult Gate — hidden on small */}
          <button
            type="button"
            onClick={() => { playSoundEffect('click'); onOpenAdultGate(); }}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-bold text-xs border-2 border-outline-variant shadow-[0_2px_0_#cbd5e1] active:translate-y-0.5 transition-all cursor-pointer"
            title="Ruang Guru & Orang Tua"
          >
            <span className="text-secondary text-sm">🔒</span>
            <span className="font-black text-secondary whitespace-nowrap">Guru & Ortu</span>
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border-2 border-surface-container-high transition-colors cursor-pointer"
            title="Menu Navigasi"
          >
            <span className="text-xl leading-none">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* ===== MOBILE EXPANDED MENU DRAWER ===== */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-b-2 border-surface-container-high px-4 py-4 shadow-xl flex flex-col gap-3 animate-in fade-in">
          {/* Mobile Points Strip */}
          <div className="flex items-center justify-around bg-surface-container-low p-2.5 rounded-2xl border border-surface-container">
            <div className="flex items-center gap-1 font-black text-xs text-amber-800">
              <span>✨</span><span>{profile.sparks} Spark</span>
            </div>
            <div className="flex items-center gap-1 font-black text-xs text-teal-800">
              <span>💎</span><span>{profile.starShards} Shards</span>
            </div>
            <div className="flex items-center gap-1 font-black text-xs text-rose-700">
              <span>🔥</span><span>{profile.streakDays}h</span>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-3 gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`p-2 rounded-xl font-black text-xs text-center transition-all ${
                  activeTab === item.id
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-low text-on-surface'
                }`}
              >
                <div className="text-lg">{item.emoji}</div>
                <div>{item.short}</div>
              </button>
            ))}
            <button
              onClick={() => { onOpenCity(); setMobileMenuOpen(false); }}
              className="p-2 rounded-xl font-black text-xs text-center bg-surface-container-low text-on-surface"
            >
              <div className="text-lg">🏙️</div>
              <div>Kota</div>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 pt-1 border-t border-surface-container">
            <button
              onClick={() => { onOpenMedals(); setMobileMenuOpen(false); }}
              className="flex-1 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-black text-xs text-center"
            >
              🏅 Medali
            </button>
            <button
              onClick={() => { onOpenAdultGate(); setMobileMenuOpen(false); }}
              className="flex-1 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-black text-xs text-center"
            >
              🔒 Guru & Ortu
            </button>
            <button
              onClick={() => { playSoundEffect('click'); onToggleDark(); setMobileMenuOpen(false); }}
              className="flex-1 py-2 rounded-xl bg-surface-container text-on-surface font-black text-xs text-center border border-surface-container-high"
            >
              {isDark ? '☀️ Terang' : '🌙 Gelap'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
