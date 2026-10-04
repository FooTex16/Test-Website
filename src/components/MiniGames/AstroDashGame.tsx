import React, { useState } from 'react';
import { playSoundEffect, playTTS } from '../../utils/audio';

interface AstroDashGameProps {
  onEarnRewards: (spark: number, shards: number) => void;
  onClose: () => void;
}

interface Question {
  equation: string;
  options: number[];
  correct: number;
  hint: string;
}

const QUESTIONS: Question[] = [
  { equation: '7 × 8 = ...', options: [54, 56, 64], correct: 56, hint: '7 dikali 8 adalah 56' },
  { equation: '1/2 + 1/2 = ...', options: [1, 2, 4], correct: 1, hint: 'Setengah ditambah setengah menjadi 1 utuh' },
  { equation: '120 ÷ 4 = ...', options: [25, 30, 40], correct: 30, hint: '12 puluhan dibagi 4 sama dengan 3 puluhan (30)' },
  { equation: '45 + 55 = ...', options: [90, 100, 110], correct: 100, hint: '45 ditambah 55 menghasilkan seratus bulat' },
  { equation: '9 × 6 = ...', options: [54, 48, 63], correct: 54, hint: '9 dikali 6 adalah 54' },
];

export const AstroDashGame: React.FC<AstroDashGameProps> = ({
  onEarnRewards,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const q = QUESTIONS[currentIdx];

  const handleSelect = (val: number) => {
    if (isGameOver || isWon) return;

    if (val === q.correct) {
      playSoundEffect('correct');
      const nextScore = score + 20;
      setScore(nextScore);

      if (currentIdx + 1 < QUESTIONS.length) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setIsWon(true);
        playSoundEffect('fanfare');
        onEarnRewards(80, 5);
      }
    } else {
      playSoundEffect('hint');
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setIsGameOver(true);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setIsWon(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl bg-slate-900 border-4 border-indigo-500 shadow-[0_16px_0_#2b1055] overflow-hidden text-white flex flex-col">
      {/* Game Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 to-indigo-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-float">🚀</span>
          <div>
            <h3 className="font-display font-black text-lg text-white">
              Astro Dash: Misi Numerik
            </h3>
            <p className="text-xs text-blue-200">
              Pilih gerbang angka yang tepat untuk roketmu!
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

      {/* Status Bar */}
      <div className="px-5 py-2.5 bg-slate-800/90 flex items-center justify-between text-xs font-black">
        <div className="flex items-center gap-1">
          <span>Nyawa:</span>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={i < lives ? 'text-red-500' : 'text-slate-600'}>
              ❤️
            </span>
          ))}
        </div>
        <div>Skor: <span className="text-amber-400">{score}</span> Poin</div>
        <div>Misi: <span className="text-blue-300">{currentIdx + 1}/{QUESTIONS.length}</span></div>
      </div>

      {/* Play Area */}
      <div className="p-6 flex flex-col items-center gap-6 min-h-[300px] justify-center bg-radial from-indigo-950 to-slate-900">
        {!isGameOver && !isWon && (
          <>
            {/* Rocket Animation Stage */}
            <div className="w-full flex justify-center py-4">
              <div className="p-4 rounded-3xl bg-indigo-900/60 border-2 border-indigo-400/40 text-center flex flex-col items-center gap-2">
                <span className="text-5xl animate-bounce">🚀</span>
                <span className="font-display font-black text-2xl text-amber-300 tracking-wider">
                  {q.equation}
                </span>
              </div>
            </div>

            {/* Answer Gates */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  className="py-4 px-3 rounded-2xl bg-gradient-to-b from-blue-600 to-indigo-800 hover:from-blue-500 hover:to-indigo-700 active:translate-y-1 font-display font-black text-xl text-white border-2 border-blue-400 shadow-[0_4px_0_#1e1b4b] cursor-pointer transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-400">
              💡 Petunjuk: {q.hint}
            </p>
          </>
        )}

        {isWon && (
          <div className="flex flex-col items-center gap-4 text-center py-4 animate-in zoom-in">
            <span className="text-6xl">🏆</span>
            <h4 className="font-display font-black text-2xl text-amber-400">
              Misi Angkasa Selesai!
            </h4>
            <p className="text-sm text-slate-200 max-w-sm">
              Hebat! Roketmu berhasil menembus semua gerbang berhitung dengan sempurna!
            </p>
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-black text-sm">
              🎁 Hadiah Diraih: +80 Spark &amp; +5 Star Shards!
            </div>
            <button
              onClick={() => {
                playSoundEffect('click');
                onClose();
              }}
              className="btn-tactile-teal min-h-[48px] px-8 text-sm font-black"
            >
              Kembali ke Hub Mini Games
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="flex flex-col items-center gap-4 text-center py-4 animate-in zoom-in">
            <span className="text-6xl">💥</span>
            <h4 className="font-display font-black text-2xl text-rose-400">
              Roket Kehabisan Energi!
            </h4>
            <p className="text-sm text-slate-300">
              Tidak apa-apa, ayo perbaiki navigasimu dan coba sekali lagi!
            </p>
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm cursor-pointer shadow-md"
            >
              Ulangi Misi ↺
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
