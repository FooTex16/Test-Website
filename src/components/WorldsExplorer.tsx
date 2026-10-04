import React, { useState } from 'react';
import { World, PhaseGrade } from '../types';
import { WORLDS_DATA } from '../data/eduverseData';
import { playTTS, playSoundEffect } from '../utils/audio';

interface WorldsExplorerProps {
  onSelectWorld: (world: World) => void;
  onOpenQuestForWorld: (worldId: string) => void;
}

export const WorldsExplorer: React.FC<WorldsExplorerProps> = ({
  onSelectWorld,
  onOpenQuestForWorld,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<PhaseGrade>('all');
  const [selectedWorldDetail, setSelectedWorldDetail] = useState<World | null>(null);

  const filteredWorlds = WORLDS_DATA.filter((w) => {
    if (selectedPhase === 'all') return true;
    if (w.phaseKey === 'all') return true;
    return w.phaseKey === selectedPhase;
  });

  const primaryWorlds = filteredWorlds.slice(0, 3);
  const secondaryWorlds = filteredWorlds.slice(3);

  return (
    <section className="w-full px-4 sm:px-6 py-10 bg-surface" id="dunia-belajar">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Section Header + Audio Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 text-left">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-container font-black text-xs uppercase tracking-wide">
                Peta Kurikulum SD
              </span>
              <button
                onClick={() => {
                  playSoundEffect('click');
                  playTTS(
                    'Pilih Dunia Petualanganmu. Ada matematika di Pulau Numeria, eksperimen di Galaksi Sains, dan dongeng di Lembah Kata!'
                  );
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border-2 border-surface-container-high text-xs font-bold text-primary hover:bg-surface-container-low cursor-pointer"
                title="Dengarkan penjelasan"
              >
                <span>🔊</span>
                <span>Baca Suara</span>
              </button>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">
              Pilih Dunia Petualanganmu
            </h2>
            <p className="text-sm sm:text-base font-bold text-on-surface-variant">
              Klik pulau belajar sesuai minat atau kelasmu di sekolah dasar:
            </p>
          </div>

          {/* Phase Tabs (Fase A, B, C SD) */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-surface-container-low p-1.5 rounded-2xl border-2 border-surface-container-high self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => {
                playSoundEffect('click');
                setSelectedPhase('all');
              }}
              className={`px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                selectedPhase === 'all'
                  ? 'bg-primary-container text-on-primary-container shadow-[0_2px_0_#009a7d]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Semua Fase
            </button>
            <button
              onClick={() => {
                playSoundEffect('click');
                setSelectedPhase('a');
              }}
              className={`px-3.5 py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                selectedPhase === 'a'
                  ? 'bg-primary-container text-on-primary-container shadow-[0_2px_0_#009a7d]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Fase A (Kls 1-2)
            </button>
            <button
              onClick={() => {
                playSoundEffect('click');
                setSelectedPhase('b');
              }}
              className={`px-3.5 py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                selectedPhase === 'b'
                  ? 'bg-primary-container text-on-primary-container shadow-[0_2px_0_#009a7d]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Fase B (Kls 3-4)
            </button>
            <button
              onClick={() => {
                playSoundEffect('click');
                setSelectedPhase('c');
              }}
              className={`px-3.5 py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                selectedPhase === 'c'
                  ? 'bg-primary-container text-on-primary-container shadow-[0_2px_0_#009a7d]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Fase C (Kls 5-6)
            </button>
          </div>
        </div>

        {/* 3 Large Primary World Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {primaryWorlds.map((world) => (
            <div
              key={world.id}
              className="world-card rounded-3xl bg-white border-3 border-surface-container-high p-5 shadow-[0_6px_0_#d6e2f8] flex flex-col justify-between gap-4 group text-left hover:-translate-y-1 transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="w-full h-44 rounded-2xl bg-surface-container-low overflow-hidden relative border-2 border-surface-container-high">
                  <img
                    src={world.imageUrl}
                    alt={world.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-white/90 font-black text-xs text-primary border border-surface-container-high">
                    🟢 Siap Dijelajahi
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-tertiary-fixed font-black text-xs text-on-tertiary-fixed border border-[#dba500]">
                    ✨ +{world.sparkReward} Spark
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{world.emoji}</span>
                    <h3 className="font-display text-xl font-extrabold text-on-surface">
                      {world.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      playSoundEffect('click');
                      playTTS(world.audioDescription);
                    }}
                    className="p-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary"
                    title="Dengarkan cerita pulau"
                  >
                    <span>🔊</span>
                  </button>
                </div>

                <p className="text-sm font-bold text-on-surface-variant leading-relaxed">
                  {world.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {world.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface-variant"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    playSoundEffect('click');
                    onOpenQuestForWorld(world.id);
                  }}
                  className={`min-h-[54px] w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-base transition-all ${
                    world.id === 'numeria'
                      ? 'btn-tactile-teal'
                      : world.id === 'sains'
                      ? 'btn-tactile-purple'
                      : 'btn-tactile-yellow'
                  }`}
                >
                  <span>Masuki {world.name}</span>
                  <span>➔</span>
                </button>

                <button
                  onClick={() => {
                    playSoundEffect('click');
                    setSelectedWorldDetail(world);
                  }}
                  className="text-xs font-extrabold text-primary hover:underline text-center py-1"
                >
                  Lihat Target Capaian Belajar 👁️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Secondary Tactile Worlds Mini Grid */}
        {secondaryWorlds.length > 0 && (
          <div className="flex flex-col gap-3 pt-2 text-left">
            <h3 className="text-sm font-black uppercase tracking-wider text-on-surface-variant">
              Dunia Ekspedisi Tambahan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {secondaryWorlds.map((world) => (
                <div
                  key={world.id}
                  onClick={() => {
                    playSoundEffect('click');
                    onOpenQuestForWorld(world.id);
                  }}
                  className="p-4 rounded-2xl bg-white border-2 border-surface-container-high flex flex-col justify-between gap-2.5 shadow-sm hover:-translate-y-1 hover:border-primary-container transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{world.emoji}</span>
                    <h4 className="font-extrabold text-sm text-on-surface">{world.name}</h4>
                  </div>
                  <p className="text-xs font-bold text-on-surface-variant leading-snug">
                    {world.description}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-black text-primary">Jelajahi Misi ➔</span>
                    <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      ✨ +{world.sparkReward}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* World Learning Objectives Modal */}
      {selectedWorldDetail && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="w-full max-w-lg rounded-3xl bg-white border-4 border-surface-container-high p-6 shadow-2xl flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedWorldDetail.emoji}</span>
                <div>
                  <h3 className="font-display text-xl font-black text-on-surface">
                    {selectedWorldDetail.name}
                  </h3>
                  <span className="text-xs font-bold text-primary">
                    {selectedWorldDetail.phase}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorldDetail(null)}
                className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-black"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-secondary">
                🎯 Target Capaian Kurikulum SD:
              </h4>
              <ul className="flex flex-col gap-1.5 text-xs sm:text-sm font-bold text-on-surface">
                {selectedWorldDetail.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-black">✓</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                const w = selectedWorldDetail;
                setSelectedWorldDetail(null);
                onOpenQuestForWorld(w.id);
              }}
              className="btn-tactile-teal py-3 text-base flex items-center justify-center gap-2"
            >
              <span>Mulai Petualangan {selectedWorldDetail.name}</span>
              <span>🚀</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
