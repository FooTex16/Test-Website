import React, { useState } from 'react';
import { CityBuilding } from '../../types';
import { CITY_BUILDINGS } from '../../data/eduverseData';
import { playSoundEffect, playTTS } from '../../utils/audio';

interface CityBaseViewProps {
  starShards: number;
  unlockedBuildingIds: string[];
  onUpgradeBuilding: (buildingId: string, cost: number) => void;
  onUnlockBuilding: (buildingId: string, cost: number) => void;
}

export const CityBaseView: React.FC<CityBaseViewProps> = ({
  starShards,
  unlockedBuildingIds,
  onUpgradeBuilding,
  onUnlockBuilding,
}) => {
  const [cityLevel, setCityLevel] = useState<number>(1);
  const [selectedBuilding, setSelectedBuilding] = useState<CityBuilding | null>(null);

  const buildings = CITY_BUILDINGS.map((b) => ({
    ...b,
    isUnlocked: unlockedBuildingIds.includes(b.id),
  }));

  const handleAction = (b: CityBuilding) => {
    if (!b.isUnlocked) {
      if (starShards >= b.costShards) {
        playSoundEffect('upgrade');
        playTTS(`Selamat! Kamu berhasil membangun ${b.name} di EduVerse City!`);
        onUnlockBuilding(b.id, b.costShards);
      } else {
        playSoundEffect('hint');
        playTTS(`Kamu membutuhkan ${b.costShards} Star Shards untuk membangun ${b.name}. Kumpulkan pecahan bintang dari misi belajar ya!`);
      }
    } else {
      if (starShards >= 10) {
        playSoundEffect('upgrade');
        playTTS(`Hebat! ${b.name} berhasil dinaikkan tingkatnya!`);
        onUpgradeBuilding(b.id, 10);
      } else {
        playSoundEffect('hint');
        playTTS(`Butuh 10 Star Shards untuk meningkatkan level bangunan ini.`);
      }
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 py-10 bg-surface-container-low" id="eduverse-city">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 text-left">
        {/* Section Header with Phase Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-black text-xs uppercase tracking-wide self-start">
              🏙️ Kotamu Bertumbuh
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">
              EduVerse City: Kotamu Tumbuh Saat Kamu Belajar!
            </h2>
            <p className="text-sm sm:text-base font-bold text-on-surface-variant">
              Setiap soal yang dipahami menumbuhkan pohon dan bangunan megah di pulau kotamu:
            </p>
          </div>

          {/* Level Switcher matching index 2.html */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border-2 border-surface-container-high self-start md:self-auto shadow-sm">
            <button
              onClick={() => {
                playSoundEffect('click');
                setCityLevel(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                cityLevel === 1
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Level 1 (Pondok Ceria)
            </button>
            <button
              onClick={() => {
                playSoundEffect('click');
                setCityLevel(6);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                cityLevel === 6
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Level 6 (Metropolis Sains)
            </button>
          </div>
        </div>

        {/* 6 City Landmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {buildings.map((b) => (
            <div
              key={b.id}
              className={`p-5 rounded-3xl bg-white border-3 shadow-[0_5px_0_#d6e2f8] flex flex-col justify-between gap-3 text-left transition-all ${
                b.isUnlocked
                  ? 'border-surface-container-high hover:-translate-y-1'
                  : 'border-dashed border-slate-300 opacity-90'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div
                  className={`w-full h-36 rounded-2xl bg-gradient-to-br ${b.bgGradient} flex items-center justify-center text-5xl relative border-2 ${b.borderTheme}`}
                >
                  <span className="animate-float">{b.emoji}</span>
                  <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white font-black text-[11px] border shadow-xs">
                    {b.isUnlocked ? `Level ${b.level} Aktif` : '🔒 Terkunci'}
                  </span>
                  {b.isUnlocked && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      ✓ Bersinar
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="font-display font-extrabold text-lg text-on-surface">
                    {b.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-on-surface-variant leading-relaxed">
                    {b.description}
                  </p>
                  <span className="text-xs font-black text-primary mt-1">
                    {b.bonusText}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-container flex items-center justify-between">
                {!b.isUnlocked ? (
                  <button
                    onClick={() => handleAction(b)}
                    className="w-full py-2.5 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed font-black text-xs border border-[#dba500] hover:brightness-105 active:translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Bangun Gedung Ini (💎 {b.costShards} Shards)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction(b)}
                    className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Tingkatkan Level (💎 10 Shards)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Healthy Habit & Intrinsic Reward Strip matching index 2.html */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white border-2 border-surface-container-high flex flex-col gap-1 text-center shadow-sm">
            <span className="text-3xl">✨</span>
            <span className="text-xs font-black text-on-surface">Spark Positif</span>
            <span className="text-[11px] font-bold text-on-surface-variant">Bukan judi / gacha</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border-2 border-surface-container-high flex flex-col gap-1 text-center shadow-sm">
            <span className="text-3xl">💎</span>
            <span className="text-xs font-black text-on-surface">Pecahan Bintang</span>
            <span className="text-[11px] font-bold text-on-surface-variant">Berani coba hal baru</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border-2 border-surface-container-high flex flex-col gap-1 text-center shadow-sm">
            <span className="text-3xl">🏅</span>
            <span className="text-xs font-black text-on-surface">Medali Ekspedisi</span>
            <span className="text-[11px] font-bold text-on-surface-variant">Bisa dicetak di rumah</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border-2 border-surface-container-high flex flex-col gap-1 text-center shadow-sm">
            <span className="text-3xl">⏱️</span>
            <span className="text-xs font-black text-on-surface">15 Menit Sehat</span>
            <span className="text-[11px] font-bold text-on-surface-variant">Pengingat istirahat mata</span>
          </div>
        </div>
      </div>
    </section>
  );
};
