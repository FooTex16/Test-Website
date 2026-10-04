import React, { useState } from 'react';
import { playTTS, playSoundEffect } from '../utils/audio';

interface QuestSimulationSectionProps {
  onEarnRewards: (spark: number, shard: number) => void;
  onExploreMoreQuests: () => void;
  onQuizCompleted?: () => void;
}

export const QuestSimulationSection: React.FC<QuestSimulationSectionProps> = ({
  onEarnRewards,
  onExploreMoreQuests,
  onQuizCompleted,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>(
    'Sentuh salah satu pilihan jawaban di atas! Jangan takut salah, kita belajar bersama ya.'
  );
  const [hasAwarded, setHasAwarded] = useState(false);
  const [hasTriggeredHook, setHasTriggeredHook] = useState(false);

  const options = [
    {
      id: 'a',
      label: 'A',
      title: 'Jalur Utara Palung',
      subtitle: 'Suhu Air: 18°C (Cukup Dingin)',
      correct: false,
    },
    {
      id: 'b',
      label: 'B',
      title: 'Jalur Terumbu Karang',
      subtitle: 'Suhu Air: 28°C (Hangat Ideal)',
      correct: true,
    },
    {
      id: 'c',
      label: 'C',
      title: 'Jalur Muara Es',
      subtitle: 'Suhu Air: 14°C (Sangat Dingin)',
      correct: false,
    },
    {
      id: 'd',
      label: 'D',
      title: 'Jalur Laut Dalam Gelap',
      subtitle: 'Suhu Air: 8°C (Beku Dingin)',
      correct: false,
    },
  ];

  const handleKidAnswer = (opt: typeof options[0]) => {
    setSelectedOptionId(opt.id);
    if (opt.correct) {
      setIsCorrect(true);
      setFeedbackText(
        'Hore! Jawabanmu Tepat Sekali! 🎉 Boni sangat senang berenang di air hangat 28°C perairan Raja Ampat. +60 Spark dan +8 Star Shards ditambahkan ke kotamu!'
      );
      playSoundEffect('correct');
      playTTS(
        'Hore! Hebat sekali, jawabanmu tepat! Boni berenang riang di perairan hangat 28 derajat celcius. Kamu mendapatkan 60 Spark dan 8 Star Shards!'
      );
      if (!hasAwarded) {
        onEarnRewards(60, 8);
        setHasAwarded(true);
      }
    } else {
      setIsCorrect(false);
      setFeedbackText(
        `Hampir benar! 💡 Suhu di ${opt.title} agak terlalu dingin untuk Boni. Ingat ya, penyu butuh air hangat antara 27°C sampai 29°C. Coba periksa angka pilihan lain yuk!`
      );
      playSoundEffect('hint');
      playTTS(
        'Hampir benar! Coba ingat kembali, Boni butuh air hangat antara 27 sampai 29 derajat celcius. Sentuh pilihan lain ya!'
      );
    }

    // Trigger Hook Principle pop-up after child answers (correct or wrong)
    if (onQuizCompleted && !hasTriggeredHook) {
      setHasTriggeredHook(true);
      setTimeout(() => {
        onQuizCompleted();
      }, 1400);
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 py-10 bg-surface-container-low" id="simulasi-misi">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="text-center flex flex-col items-center gap-1">
          <span className="px-4 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-black text-xs uppercase tracking-wide">
            🎮 Uji Coba Langsung Misi Belajar
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">
            Ayo Bantu Penyu Boni!
          </h2>
          <p className="text-sm sm:text-base font-bold text-on-surface-variant">
            Pilihlah jawaban dengan menekan kartu besar di bawah ini:
          </p>
        </div>

        {/* Quest Card Container */}
        <div className="rounded-3xl bg-white border-4 border-surface-container-high p-5 sm:p-8 shadow-[0_8px_0_#d6e2f8] flex flex-col gap-6 text-left">
          {/* Quest Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-surface-container">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-black text-xs">
                MISI EKSPEDISI #402
              </span>
              <span className="text-xs font-extrabold text-on-surface-variant">
                Sains &amp; Lingkungan SD
              </span>
            </div>
            {/* Question TTS Audio Button */}
            <button
              onClick={() => {
                playSoundEffect('click');
                playTTS(
                  'Misi Ekspedisi! Membantu Penyu Sisik Menemukan Arus Hangat. Penyu kecil bernama Boni butuh air hangat bersuhu 27 derajat sampai 29 derajat celcius agar kuat berenang ke Raja Ampat. Jalur manakah yang harus dipilih Boni?'
                );
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed font-bold text-xs border border-[#dba500] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>🔊</span>
              <span>Baca Soal (Audio)</span>
            </button>
          </div>

          {/* Quest Story Prompt */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#dff7ee] flex items-center justify-center text-3xl shrink-0 border-2 border-primary-container shadow-sm animate-float">
              🐢
            </div>
            <div className="flex flex-col gap-1 text-left flex-1">
              <h3 className="font-display text-xl sm:text-2xl font-black text-on-surface">
                Membantu Penyu Boni Menemukan Arus Hangat
              </h3>
              <p className="text-base sm:text-lg font-bold text-on-surface-variant leading-relaxed">
                Penyu kecil bernama Boni butuh air hangat bersuhu{' '}
                <strong className="text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded-lg">
                  27°C sampai 29°C
                </strong>{' '}
                agar kuat berenang ke Raja Ampat. Jalur manakah yang harus dipilih Boni?
              </p>
            </div>
          </div>

          {/* 4 Large Distinct Tactile Choice Cards in a 2x2 Grid (Min height 64px) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let cardStyle =
                'bg-surface-container-low border-surface-container-high shadow-[0_4px_0_#cbd9f4] hover:bg-surface-container';

              if (isSelected && isCorrect === true) {
                cardStyle = 'bg-primary-fixed border-primary-container shadow-[0_4px_0_#00c49f]';
              } else if (isSelected && isCorrect === false) {
                cardStyle = 'bg-error-container border-error shadow-[0_4px_0_#d92d20]';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleKidAnswer(opt)}
                  className={`quiz-option-btn min-h-[64px] p-4 rounded-2xl border-3 text-left flex items-center gap-4 active:translate-y-1 active:shadow-none transition-all cursor-pointer ${cardStyle}`}
                >
                  <span className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center font-black text-lg text-primary shrink-0">
                    {opt.label}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-base font-black text-on-surface">{opt.title}</span>
                    <span className="text-xs font-bold text-on-surface-variant">{opt.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Olu Warm Feedback Bubble */}
          <div
            className={`p-4 rounded-2xl border-2 flex items-start gap-3.5 transition-all ${
              isCorrect === true
                ? 'bg-primary-fixed/40 border-primary-container'
                : isCorrect === false
                ? 'bg-secondary-fixed/40 border-secondary'
                : 'bg-surface-container-low border-surface-container'
            }`}
          >
            <span className="text-2xl shrink-0">🤖</span>
            <div className="flex flex-col text-left flex-1">
              <span className="text-xs font-black text-secondary">
                {isCorrect === true
                  ? 'Komentar Bahagia Olu:'
                  : isCorrect === false
                  ? 'Petunjuk Ramah Olu:'
                  : 'Sapaan Ramah Olu:'}
              </span>
              <p className="text-sm font-bold text-on-surface mt-0.5 leading-relaxed">
                {feedbackText}
              </p>
            </div>
            {isCorrect === true && (
              <button
                onClick={() => {
                  playSoundEffect('click');
                  onExploreMoreQuests();
                }}
                className="px-4 py-2 rounded-xl bg-secondary text-white font-black text-xs shrink-0 hover:brightness-105 active:translate-y-0.5"
              >
                Misi Lainnya ➔
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
