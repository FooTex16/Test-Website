import React, { useState } from 'react';
import { AstroDashGame } from './AstroDashGame';
import { ScienceLabGame } from './ScienceLabGame';
import { EkspedisiKataGame } from './EkspedisiKataGame';
import { CyberShieldGame } from './CyberShieldGame';
import { playSoundEffect } from '../../utils/audio';

interface MiniGamesHubProps {
  onEarnRewards: (spark: number, shards: number) => void;
}

export const MiniGamesHub: React.FC<MiniGamesHubProps> = ({ onEarnRewards }) => {
  const [activeGame, setActiveGame] = useState<'astro' | 'science' | 'word' | 'cyber' | null>(null);

  const games = [
    {
      id: 'astro',
      title: 'Astro Dash: Misi Numerik',
      world: 'Pulau Numeria',
      emoji: '🚀',
      desc: 'Meluncur di angkasa dan pilih lintasan gerbang dengan hasil matematika yang benar!',
      reward: '80 Spark • 5 Shards',
      color: 'from-blue-600 to-indigo-800',
      badge: 'Matematika SD',
    },
    {
      id: 'science',
      title: 'Lab Daur Air & Fotosintesis',
      world: 'Galaksi Sains',
      emoji: '🔬',
      desc: 'Eksperimen virtual aman: campurkan matahari, air, awan, dan tunas untuk menumbuhkan pohon bunga!',
      reward: '75 Spark • 6 Shards',
      color: 'from-emerald-600 to-teal-800',
      badge: 'Sains Alam',
    },
    {
      id: 'word',
      title: 'Ekspedisi Kosa Kata',
      world: 'Lembah Kata',
      emoji: '📚',
      desc: 'Kumpulkan huruf balok warna-warni untuk merangkai kosakata nusantara berdasarkan petunjuk bergambar!',
      reward: '70 Spark • 5 Shards',
      color: 'from-amber-500 to-orange-700',
      badge: 'Bahasa Indonesia',
    },
    {
      id: 'cyber',
      title: 'Benteng Sandi & Data Aman',
      world: 'Zona Cyber Cerdas',
      emoji: '💻',
      desc: 'Pilah mana informasi yang aman diceritakan ke teman dan mana data rahasia yang wajib dijaga!',
      reward: '65 Spark • 5 Shards',
      color: 'from-purple-600 to-violet-900',
      badge: 'Etika & Keamanan Digital',
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 py-10 bg-surface">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 text-left">
        <div className="flex flex-col gap-1">
          <span className="px-3.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-black text-xs uppercase tracking-wide self-start">
            🎮 Area Permainan Edukatif
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">
            Mini Games Edukasi Terpadu
          </h2>
          <p className="text-sm sm:text-base font-bold text-on-surface-variant">
            Bermain sambil memperkuat konsep pelajaran sekolah dengan cara yang seru dan menyenangkan:
          </p>
        </div>

        {/* 4 Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {games.map((g) => (
            <div
              key={g.id}
              className="p-5 rounded-3xl bg-white border-3 border-surface-container-high shadow-[0_6px_0_#d6e2f8] flex flex-col justify-between gap-4 group hover:-translate-y-1.5 transition-all"
            >
              <div className="flex flex-col gap-3">
                <div
                  className={`w-full h-36 rounded-2xl bg-gradient-to-tr ${g.color} flex items-center justify-center text-5xl shadow-inner relative`}
                >
                  <span className="group-hover:scale-110 transition-transform">{g.emoji}</span>
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/40 text-white font-black text-[11px] backdrop-blur-sm">
                    {g.badge}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-black text-primary uppercase">
                    {g.world}
                  </span>
                  <h3 className="font-display font-black text-lg text-on-surface">
                    {g.title}
                  </h3>
                  <p className="text-xs font-bold text-on-surface-variant leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg text-center border border-amber-200">
                  ⚡ Hadiah: {g.reward}
                </span>

                <button
                  onClick={() => {
                    playSoundEffect('click');
                    setActiveGame(g.id as any);
                  }}
                  className="min-h-[50px] w-full flex items-center justify-center gap-2 rounded-2xl bg-primary-container text-on-primary-container font-black text-sm border-2 border-[#009a7d] shadow-[0_3px_0_#009a7d] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  <span>Mainkan Game</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Modal */}
      {activeGame && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in"
        >
          <div className="my-auto w-full">
            {activeGame === 'astro' && (
              <AstroDashGame
                onEarnRewards={onEarnRewards}
                onClose={() => setActiveGame(null)}
              />
            )}
            {activeGame === 'science' && (
              <ScienceLabGame
                onEarnRewards={onEarnRewards}
                onClose={() => setActiveGame(null)}
              />
            )}
            {activeGame === 'word' && (
              <EkspedisiKataGame
                onEarnRewards={onEarnRewards}
                onClose={() => setActiveGame(null)}
              />
            )}
            {activeGame === 'cyber' && (
              <CyberShieldGame
                onEarnRewards={onEarnRewards}
                onClose={() => setActiveGame(null)}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};
