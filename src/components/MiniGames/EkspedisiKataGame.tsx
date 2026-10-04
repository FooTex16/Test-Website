import React, { useState } from 'react';
import { playSoundEffect } from '../../utils/audio';

interface EkspedisiKataGameProps {
  onEarnRewards: (spark: number, shards: number) => void;
  onClose: () => void;
}

const WORDS = [
  { word: 'PELANGI', clue: 'Lengkungan warna-warni indah setelah hujan di langit 🌈', hint: 'P - E - L - A - N - G - I' },
  { word: 'BINTANG', clue: 'Benda langit yang berkelap-kelip indah saat malam hari ⭐', hint: 'B - I - N - T - A - N - G' },
  { word: 'SAHABAT', clue: 'Teman setia yang selalu saling tolong-menolong 🤝', hint: 'S - A - H - A - B - A - T' },
];

export const EkspedisiKataGame: React.FC<EkspedisiKataGameProps> = ({
  onEarnRewards,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [assembled, setAssembled] = useState<string[]>([]);
  const [isWon, setIsWon] = useState(false);

  const currentWordObj = WORDS[currentIdx];
  const targetLetters = currentWordObj.word.split('');

  // Scrambled letters pool
  const poolLetters = [...targetLetters].sort(() => 0.5 - Math.random());

  const handleAddLetter = (letter: string, poolIdx: number) => {
    if (isWon) return;
    playSoundEffect('click');

    const nextAssembled = [...assembled, letter];
    setAssembled(nextAssembled);

    // Check if word complete
    if (nextAssembled.length === targetLetters.length) {
      if (nextAssembled.join('') === currentWordObj.word) {
        playSoundEffect('correct');
        if (currentIdx + 1 < WORDS.length) {
          setTimeout(() => {
            setCurrentIdx(currentIdx + 1);
            setAssembled([]);
          }, 800);
        } else {
          setIsWon(true);
          playSoundEffect('fanfare');
          onEarnRewards(70, 5);
        }
      } else {
        playSoundEffect('hint');
        setTimeout(() => {
          setAssembled([]);
        }, 600);
      }
    }
  };

  const handleResetLetters = () => {
    setAssembled([]);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl bg-slate-900 border-4 border-amber-500 shadow-[0_16px_0_#78350f] overflow-hidden text-white flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 to-orange-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-float">📚</span>
          <div>
            <h3 className="font-display font-black text-lg text-white">
              Ekspedisi Kosa Kata Nusantara
            </h3>
            <p className="text-xs text-amber-200">
              Susun balok huruf sesuai petunjuk cerita!
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

      {/* Content */}
      <div className="p-6 flex flex-col items-center gap-6 bg-radial from-amber-950 to-slate-900">
        {!isWon ? (
          <>
            {/* Clue Box */}
            <div className="w-full p-4 rounded-2xl bg-amber-900/40 border border-amber-400/40 text-center">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider block mb-1">
                Kata #{currentIdx + 1} dari {WORDS.length}
              </span>
              <p className="text-sm sm:text-base font-bold text-white">
                "{currentWordObj.clue}"
              </p>
            </div>

            {/* Answer Slots */}
            <div className="flex gap-2 justify-center flex-wrap min-h-[56px] items-center">
              {targetLetters.map((_, i) => (
                <div
                  key={i}
                  className="w-11 h-12 rounded-xl bg-slate-800 border-2 border-amber-400/60 flex items-center justify-center font-display font-black text-xl text-amber-300 shadow-inner"
                >
                  {assembled[i] || ''}
                </div>
              ))}
            </div>

            {/* Letter Pool Buttons */}
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex gap-2 justify-center flex-wrap">
                {poolLetters.map((l, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddLetter(l, i)}
                    className="w-12 h-12 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-display font-black text-xl border-2 border-amber-200 shadow-[0_3px_0_#92400e] active:translate-y-1 transition-all cursor-pointer"
                  >
                    {l}
                  </button>
                ))}
              </div>

              <button
                onClick={handleResetLetters}
                className="text-xs font-black text-amber-300 hover:underline pt-2 cursor-pointer"
              >
                Hapus &amp; Ulangi Susunan Kata ↺
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center py-4 animate-in zoom-in">
            <span className="text-6xl">🎉</span>
            <h4 className="font-display font-black text-2xl text-amber-400">
              Pujangga Cilik Hebat!
            </h4>
            <p className="text-sm text-slate-200">
              Kamu berhasil menyusun semua kosa kata nusantara dengan tepat!
            </p>
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-black text-sm">
              🎁 Hadiah Diraih: +70 Spark &amp; +5 Star Shards!
            </div>
            <button
              onClick={() => {
                playSoundEffect('click');
                onClose();
              }}
              className="btn-tactile-teal min-h-[48px] px-8 text-sm font-black"
            >
              Kembali ke Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
