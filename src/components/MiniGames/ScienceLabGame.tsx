import React, { useState } from 'react';
import { playSoundEffect } from '../../utils/audio';

interface ScienceLabGameProps {
  onEarnRewards: (spark: number, shards: number) => void;
  onClose: () => void;
}

export const ScienceLabGame: React.FC<ScienceLabGameProps> = ({
  onEarnRewards,
  onClose,
}) => {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [plantStage, setPlantStage] = useState(0); // 0: seed, 1: sprout, 2: blooming flower, 3: golden tree
  const [message, setMessage] = useState('Pilih elemen yang dibutuhkan tanaman untuk fotosintesis!');
  const [isWon, setIsWon] = useState(false);

  const elements = [
    { id: 'sun', name: 'Cahaya Matahari', emoji: '☀️', correct: true },
    { id: 'water', name: 'Air Murni', emoji: '💧', correct: true },
    { id: 'air', name: 'Karbondioksida (CO₂)', emoji: '💨', correct: true },
    { id: 'rock', name: 'Batu Karang', emoji: '🪨', correct: false },
    { id: 'fire', name: 'Api Membara', emoji: '🔥', correct: false },
    { id: 'nutrients', name: 'Pupuk Alami', emoji: '🌱', correct: true },
  ];

  const handleSelectElement = (elem: typeof elements[0]) => {
    if (isWon) return;

    if (selectedElements.includes(elem.id)) return;

    if (!elem.correct) {
      playSoundEffect('hint');
      setMessage(`Aduh! ${elem.name} tidak dibutuhkan untuk fotosintesis.`);
      return;
    }

    playSoundEffect('correct');
    const updated = [...selectedElements, elem.id];
    setSelectedElements(updated);

    const nextStage = updated.length;
    setPlantStage(nextStage);

    if (nextStage === 1) {
      setMessage('Bagus! Benih mulai menyerap nutrisi dan membuka cangkangnya!');
    } else if (nextStage === 2) {
      setMessage('Hebat! Tunas hijau mulai tumbuh tinggi mencari cahaya matahari!');
    } else if (nextStage === 3) {
      setMessage('Luar biasa! Daun-daun mulai memasak makanan dengan klorofil!');
    } else if (nextStage >= 4) {
      setIsWon(true);
      playSoundEffect('fanfare');
      setMessage('Selamat! Tanamanmu mekar menjadi Pohon Emas Sains yang bercahaya!');
      onEarnRewards(75, 6);
    }
  };

  const plantEmojis = ['🌰', '🌱', '🌿', '🌸', '🌳✨'];

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl bg-slate-900 border-4 border-emerald-500 shadow-[0_16px_0_#064e3b] overflow-hidden text-white flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 to-teal-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-float">🔬</span>
          <div>
            <h3 className="font-display font-black text-lg text-white">
              Lab Daur Air &amp; Fotosintesis
            </h3>
            <p className="text-xs text-emerald-200">
              Campurkan unsur fotosintesis untuk menumbuhkan tanaman ajaib!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playSoundEffect('click');
            onClose();
          }}
          className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-black cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Lab Area */}
      <div className="p-6 flex flex-col items-center gap-6 bg-radial from-emerald-950 to-slate-900">
        {/* Plant Growth Visualizer */}
        <div className="w-full flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-800/80 border-2 border-emerald-400/30">
          <div className="text-7xl sm:text-8xl mb-3 animate-float transition-all">
            {plantEmojis[plantStage]}
          </div>
          <p className="text-sm font-bold text-emerald-300 text-center max-w-sm">
            {message}
          </p>
        </div>

        {/* Elements Selector */}
        {!isWon ? (
          <div className="w-full flex flex-col gap-2">
            <span className="text-xs font-black text-slate-400">
              Pilih Elemen Laboratorium:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {elements.map((elem) => {
                const isUsed = selectedElements.includes(elem.id);
                return (
                  <button
                    key={elem.id}
                    onClick={() => handleSelectElement(elem)}
                    disabled={isUsed}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all cursor-pointer ${
                      isUsed
                        ? 'bg-emerald-900/40 border-emerald-500/40 opacity-40'
                        : 'bg-slate-800 border-slate-700 hover:border-emerald-400 hover:bg-slate-750'
                    }`}
                  >
                    <span className="text-2xl">{elem.emoji}</span>
                    <span className="text-xs font-black text-left">{elem.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center py-2 animate-in zoom-in">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-black text-sm">
              🎁 Hadiah Diraih: +75 Spark &amp; +6 Star Shards!
            </div>
            <button
              onClick={() => {
                playSoundEffect('click');
                onClose();
              }}
              className="btn-tactile-teal min-h-[48px] px-8 text-sm font-black"
            >
              Simpan &amp; Kembali
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
