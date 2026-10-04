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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    playSoundEffect('click');
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b-2 border-surface-container-high shadow-sm">
      <div className="max-w-7xl mx-auto h-20 px-3 sm:px-6 flex items-center justify-between gap-3">
        {/* ================= BLOK 1 (LEFT): BRAND & DESKTOP NAV ================= */}
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none cursor-pointer"
          >
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-tr from-secondary to-primary-container flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform">
              🪐
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display text-xl sm:text-2xl font-black text-secondary tracking-tight">
                  EduVerse
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-black text-[10px] sm:text-[11px]">
                  SD 1–6
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-black text-primary tracking-wide hidden xs:inline">
                Semesta Belajar Ceria
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-2xl border border-surface-container-high ml-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              🏠 Beranda
            </button>
            <button
              onClick={() => handleNavClick('worlds')}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                activeTab === 'worlds'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              🗺️ 7 Dunia
            </button>
            <button
              onClick={() => handleNavClick('games')}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                activeTab === 'games'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              🎮 Mini Games
            </button>
            <button
              onClick={() => handleNavClick('story')}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                activeTab === 'story'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              📖 Cerita
            </button>
            <button
              onClick={() => handleNavClick('discovery')}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                activeTab === 'discovery'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              🧪 Lab Fakta
            </button>
            <button
              onClick={() => {
                playSoundEffect('click');
                onOpenCity();
              }}
              className="px-3 py-1.5 rounded-xl font-black text-xs text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-1 cursor-pointer"
            >
              🏙️ Kotaku
            </button>
          </nav>
        </div>

        {/* ================= BLOK 2 (CENTER): GAMIFIED POINTS STRIP ================= */}
        <div className="hidden md:flex items-center gap-2">
          {/* Spark Points Counter */}
          <button
            onClick={() => {
              playSoundEffect('click');
              playTTS(
                `Kamu memiliki ${profile.sparks} Spark energi belajar! Terus selesaikan misi untuk menyalakan semesta EduVerse!`
              );
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-black text-xs border-2 border-[#dba500] shadow-[0_2px_0_#dba500] active:translate-y-0.5 transition-all cursor-pointer"
            title="Spark Energi Belajar"
          >
            <span className="text-base">✨</span>
            <span className="font-extrabold">{profile.sparks}</span>
            <span className="text-[10px] font-black opacity-80">Spark</span>
          </button>

          {/* Star Shards Counter */}
          <button
            onClick={() => {
              playSoundEffect('click');
              onOpenCity();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-container font-black text-xs border-2 border-[#00c49f] shadow-[0_2px_0_#00c49f] active:translate-y-0.5 transition-all cursor-pointer"
            title="Star Shards untuk Membangun Kota"
          >
            <span className="text-base">💎</span>
            <span className="font-extrabold">{profile.starShards}</span>
            <span className="text-[10px] font-black opacity-80">Shards</span>
          </button>

          {/* Spark Streak */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#ffebe6] text-[#c93b16] font-black text-xs border border-[#ffb4a2]"
            title="Spark Streak Hari Belajar Berturut-turut"
          >
            <span>🔥</span>
            <span>{profile.streakDays}h</span>
          </div>

          {/* Medals Shortcut */}
          <button
            onClick={() => {
              playSoundEffect('click');
              onOpenMedals();
            }}
            className="p-1.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-amber-600 border border-surface-container-high transition-colors cursor-pointer"
            title="Medali Ekspedisi"
          >
            <span className="text-base">🏅</span>
          </button>
        </div>

        {/* ================= BLOK 3 (RIGHT): USER PROFILE & ACCESS ================= */}
        <div className="flex items-center gap-2">
          {/* User Auth Display */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border-2 border-primary-container shadow-[0_2px_0_#00c49f]">
              <span className="text-base">🚀</span>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-on-surface truncate max-w-[90px] sm:max-w-[120px]">
                  Kapten {authUsername}
                </span>
                <span className="text-[9px] font-bold text-primary leading-none">
                  Tersimpan di Cloud
                </span>
              </div>
              <button
                onClick={onLogout}
                className="ml-1 px-2 py-0.5 rounded-lg bg-white hover:bg-rose-50 text-[10px] font-bold text-rose-600 border border-rose-200 cursor-pointer"
                title="Keluar Akun"
              >
                Keluar
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                playSoundEffect('click');
                onOpenAuth('login');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-secondary-fixed text-on-secondary-fixed hover:brightness-105 border-2 border-secondary shadow-[0_2px_0_#4f00d0] font-black text-xs active:translate-y-0.5 transition-all cursor-pointer"
              title="Masuk atau Buat Akun Baru"
            >
              <span className="text-sm">🔑</span>
              <span>Masuk / Daftar</span>
            </button>
          )}

          {/* Protected Adult Gate (Ruang Guru & Ortu) */}
          <button
            type="button"
            onClick={() => {
              playSoundEffect('click');
              onOpenAdultGate();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-bold text-xs border-2 border-outline-variant shadow-[0_2px_0_#cbd5e1] active:translate-y-0.5 transition-all cursor-pointer"
            title="Ruang Khusus Guru & Orang Tua"
          >
            <span className="text-secondary text-sm">🔒</span>
            <span className="font-black text-secondary">Guru &amp; Ortu</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface border-2 border-surface-container-high transition-colors cursor-pointer"
            title="Menu Navigasi"
          >
            <span className="text-xl leading-none">
              {mobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {/* ================= MOBILE EXPANDED MENU DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b-2 border-surface-container-high px-4 py-4 shadow-xl flex flex-col gap-3 animate-in fade-in">
          {/* Mobile Points Strip */}
          <div className="flex items-center justify-around bg-surface-container-low p-2.5 rounded-2xl border border-surface-container">
            <div className="flex items-center gap-1 font-black text-xs text-amber-800">
              <span>✨</span>
              <span>{profile.sparks} Spark</span>
            </div>
            <div className="flex items-center gap-1 font-black text-xs text-teal-800">
              <span>💎</span>
              <span>{profile.starShards} Shards</span>
            </div>
            <div className="flex items-center gap-1 font-black text-xs text-rose-700">
              <span>🔥</span>
              <span>{profile.streakDays}h Streak</span>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-2.5 rounded-xl font-black text-xs text-left transition-all ${
                activeTab === 'home'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-low text-on-surface'
              }`}
            >
              🏠 Beranda Petualangan
            </button>
            <button
              onClick={() => handleNavClick('worlds')}
              className={`p-2.5 rounded-xl font-black text-xs text-left transition-all ${
                activeTab === 'worlds'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-low text-on-surface'
              }`}
            >
              🗺️ 7 Dunia Belajar
            </button>
            <button
              onClick={() => handleNavClick('games')}
              className={`p-2.5 rounded-xl font-black text-xs text-left transition-all ${
                activeTab === 'games'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-low text-on-surface'
              }`}
            >
              🎮 4 Mini Games
            </button>
            <button
              onClick={() => handleNavClick('story')}
              className={`p-2.5 rounded-xl font-black text-xs text-left transition-all ${
                activeTab === 'story'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-low text-on-surface'
              }`}
            >
              📖 Dongeng Bersuara
            </button>
            <button
              onClick={() => handleNavClick('discovery')}
              className={`p-2.5 rounded-xl font-black text-xs text-left transition-all ${
                activeTab === 'discovery'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-low text-on-surface'
              }`}
            >
              🧪 Lab Fakta Sains
            </button>
            <button
              onClick={() => {
                onOpenCity();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl font-black text-xs text-left bg-surface-container-low text-on-surface"
            >
              🏙️ Bangun Kotaku
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-surface-container">
            <button
              onClick={() => {
                onOpenMedals();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-black text-xs text-center"
            >
              🏅 Medali Ekspedisi
            </button>
            <button
              onClick={() => {
                onOpenAdultGate();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-black text-xs text-center"
            >
              🔒 Ruang Guru &amp; Ortu
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
