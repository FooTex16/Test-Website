import React, { useState } from 'react';
import { playSoundEffect } from '../../utils/audio';

interface CyberShieldGameProps {
  onEarnRewards: (spark: number, shards: number) => void;
  onClose: () => void;
}

interface ShieldCard {
  title: string;
  emoji: string;
  type: 'safe' | 'secret';
  reason: string;
}

const CARDS: ShieldCard[] = [
  {
    title: 'Kata Sandi / Password Akun Kamu',
    emoji: '🔑',
    type: 'secret',
    reason: 'Password adalah kunci kamarmu, jangan pernah berikan kepada siapa pun kecuali orang tua!',
  },
  {
    title: 'Warna Favorit & Kartun Kesukaan',
    emoji: '🎨',
    type: 'safe',
    reason: 'Warna dan kartun kesukaan aman untuk diceritakan saat berkenalan dengan teman!',
  },
  {
    title: 'Alamat Rumah Lengkap & Nomor Telepon',
    emoji: '🏠',
    type: 'secret',
    reason: 'Alamat rumah adalah privasi penting demi keselamatan dan keamanan keluargamu!',
  },
  {
    title: 'Nama Panggilan Ceria di Game (Nickname)',
    emoji: '🚀',
    type: 'safe',
    reason: 'Nama panggilan keren aman digunakan agar nama lengkapmu tetap terlindungi!',
  },
  {
    title: 'Foto Kartu Identitas atau Dokumen Keluarga',
    emoji: '📄',
    type: 'secret',
    reason: 'Dokumen keluarga berisi nomor penting yang tidak boleh disebar sembarangan!',
  },
];

export const CyberShieldGame: React.FC<CyberShieldGameProps> = ({
  onEarnRewards,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isWon, setIsWon] = useState(false);

  const card = CARDS[currentIdx];

  const handleChoice = (choice: 'safe' | 'secret') => {
    if (isWon || feedback) return;

    if (choice === card.type) {
      playSoundEffect('correct');
      setFeedback(`Benar! 🛡️ ${card.reason}`);
      setScore(score + 1);

      setTimeout(() => {
        setFeedback(null);
        if (currentIdx + 1 < CARDS.length) {
          setCurrentIdx(currentIdx + 1);
        } else {
          setIsWon(true);
          playSoundEffect('fanfare');
          onEarnRewards(65, 5);
        }
      }, 1800);
    } else {
      playSoundEffect('hint');
      setFeedback(`Kurang tepat! 💡 ${card.reason}`);
      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl bg-slate-900 border-4 border-purple-500 shadow-[0_16px_0_#4c1d95] overflow-hidden text-white flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-700 to-indigo-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-float">💻</span>
          <div>
            <h3 className="font-display font-black text-lg text-white">
              Benteng Sandi &amp; Data Aman
            </h3>
            <p className="text-xs text-purple-200">
              Pilah data mana yang aman dan mana yang wajib dirahasiakan!
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

      {/* Progress */}
      <div className="px-5 py-2.5 bg-slate-800 flex items-center justify-between text-xs font-black text-slate-300">
        <span>Kartu: {currentIdx + 1} / {CARDS.length}</span>
        <span>Benteng Cyber: <span className="text-purple-400">{score} Berhasil</span></span>
      </div>

      {/* Play Area */}
      <div className="p-6 flex flex-col items-center gap-6 bg-radial from-purple-950 to-slate-900">
        {!isWon ? (
          <>
            {/* Card to sort */}
            <div className="w-full p-6 rounded-3xl bg-slate-800/90 border-2 border-purple-400/40 text-center flex flex-col items-center gap-3 shadow-lg">
              <span className="text-6xl animate-bounce">{card.emoji}</span>
              <h4 className="font-display font-black text-lg sm:text-xl text-white">
                "{card.title}"
              </h4>
              <p className="text-xs text-purple-300">
                Apakah informasi ini aman dibagikan atau harus dijaga rahasia?
              </p>
            </div>

            {/* Feedback Pop-up */}
            {feedback && (
              <div className="p-3.5 rounded-2xl bg-purple-900/80 border border-purple-400 text-xs sm:text-sm font-bold text-center animate-in fade-in">
                {feedback}
              </div>
            )}

            {/* Decision Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                onClick={() => handleChoice('safe')}
                disabled={!!feedback}
                className="py-4 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:translate-y-1 text-white font-display font-black text-sm sm:text-base border-2 border-emerald-400 shadow-[0_4px_0_#064e3b] transition-all cursor-pointer flex flex-col items-center gap-1"
              >
                <span className="text-2xl">🟢</span>
                <span>Aman Dibagikan</span>
              </button>

              <button
                onClick={() => handleChoice('secret')}
                disabled={!!feedback}
                className="py-4 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 active:translate-y-1 text-white font-display font-black text-sm sm:text-base border-2 border-rose-400 shadow-[0_4px_0_#881337] transition-all cursor-pointer flex flex-col items-center gap-1"
              >
                <span className="text-2xl">🔒</span>
                <span>Wajib Rahasia!</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center py-4 animate-in zoom-in">
            <span className="text-6xl">🛡️</span>
            <h4 className="font-display font-black text-2xl text-purple-400">
              Ksatria Siber EduVerse!
            </h4>
            <p className="text-sm text-slate-200">
              Hebat! Kamu sekarang tahu cara menjaga data diri tetap aman di internet!
            </p>
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-black text-sm">
              🎁 Hadiah Diraih: +65 Spark &amp; +5 Star Shards!
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
