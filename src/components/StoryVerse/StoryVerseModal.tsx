import React, { useState } from 'react';
import { Story } from '../../types';
import { STORIES_DATA } from '../../data/eduverseData';
import { playTTS, playSoundEffect, stopTTS } from '../../utils/audio';

interface StoryVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnRewards: (spark: number, shards: number) => void;
}

export const StoryVerseModal: React.FC<StoryVerseModalProps> = ({
  isOpen,
  onClose,
  onEarnRewards,
}) => {
  const [selectedStory, setSelectedStory] = useState<Story>(STORIES_DATA[0]);
  const [pageIdx, setPageIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  if (!isOpen) return null;

  const currentPage = selectedStory.pages[pageIdx];

  const handleNextPage = () => {
    playSoundEffect('click');
    stopTTS();
    if (pageIdx + 1 < selectedStory.pages.length) {
      setPageIdx((p) => p + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handlePrevPage = () => {
    playSoundEffect('click');
    stopTTS();
    if (pageIdx > 0) {
      setPageIdx((p) => p - 1);
    }
  };

  const handleReadAloud = () => {
    playSoundEffect('click');
    playTTS(currentPage.text);
  };

  const handleAnswerQuiz = (idx: number) => {
    setQuizAnswer(idx);
    if (idx === selectedStory.question.correctIndex) {
      playSoundEffect('correct');
      setQuizFeedback(`Tepat sekali! 🎉 ${selectedStory.question.explanation}`);
      playTTS(`Tepat sekali! ${selectedStory.question.explanation}`);
      if (!hasCompleted) {
        setHasCompleted(true);
        onEarnRewards(selectedStory.sparkReward, 4);
      }
    } else {
      playSoundEffect('hint');
      setQuizFeedback('Belum pas, renungkan kembali pesan moral dari cerita di atas ya! 💡');
      playTTS('Belum pas, coba renungkan kembali pesan kebaikan dalam cerita ini ya!');
    }
  };

  const handleSelectAnotherStory = (s: Story) => {
    playSoundEffect('click');
    stopTTS();
    setSelectedStory(s);
    setPageIdx(0);
    setShowQuiz(false);
    setQuizAnswer(null);
    setQuizFeedback(null);
    setHasCompleted(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in"
    >
      <div className="w-full max-w-3xl rounded-3xl bg-white border-4 border-surface-container-high p-5 sm:p-7 shadow-2xl flex flex-col gap-5 text-left my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📖</span>
            <div>
              <h3 className="font-display font-black text-xl text-secondary">
                StoryVerse: Perpustakaan Dongeng Nusantara
              </h3>
              <p className="text-xs font-bold text-on-surface-variant">
                Kisah teladan berilustrasi dengan audio dongeng ramah anak
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopTTS();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Story Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STORIES_DATA.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelectAnotherStory(s)}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all cursor-pointer ${
                selectedStory.id === s.id
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span>{s.emoji} </span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {!showQuiz ? (
          /* Book Reader View */
          <div className="flex flex-col gap-4">
            {/* Illustration Canvas Box */}
            <div className="w-full h-48 sm:h-56 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-200 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
              <span className="text-6xl sm:text-7xl animate-float">
                {currentPage.emojiScene}
              </span>
              <p className="text-xs font-bold text-amber-800 bg-white/80 px-3 py-1 rounded-full mt-3 backdrop-blur-sm">
                Ilustrasi: {currentPage.illustrationDesc}
              </p>
              <span className="absolute top-3 right-3 text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                Halaman {pageIdx + 1} dari {selectedStory.pages.length}
              </span>
            </div>

            {/* Reading Text & Audio Play */}
            <div className="p-4 rounded-2xl bg-surface-container-low border-2 border-surface-container flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-secondary uppercase">
                  {selectedStory.category} • Asal: {selectedStory.origin}
                </span>
                <button
                  onClick={handleReadAloud}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed font-black text-xs hover:brightness-105 active:scale-95 cursor-pointer"
                >
                  <span>🔊</span>
                  <span>Bacakan Cerita Ini</span>
                </button>
              </div>

              <p className="font-display text-base sm:text-xl font-bold text-on-surface leading-relaxed">
                "{currentPage.text}"
              </p>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center justify-between pt-1">
              <button
                disabled={pageIdx === 0}
                onClick={handlePrevPage}
                className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-black text-xs disabled:opacity-40 cursor-pointer"
              >
                ← Halaman Sebelumnya
              </button>

              <button
                onClick={handleNextPage}
                className="btn-tactile-teal px-6 py-2.5 text-xs sm:text-sm font-black flex items-center gap-1.5"
              >
                <span>
                  {pageIdx + 1 < selectedStory.pages.length
                    ? 'Halaman Berikutnya ➔'
                    : 'Selesai & Kuis Pemahaman ➔'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Comprehension Quiz View */
          <div className="flex flex-col gap-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-secondary-fixed/40 border-2 border-secondary flex flex-col gap-1.5 text-left">
              <span className="text-xs font-black text-secondary uppercase">
                🎯 Kuis Pemahaman Membaca
              </span>
              <h4 className="font-display text-lg sm:text-xl font-black text-on-surface">
                {selectedStory.question.prompt}
              </h4>
            </div>

            {/* 4 Choices */}
            <div className="grid grid-cols-1 gap-2.5">
              {selectedStory.question.options.map((optText, idx) => {
                const isSelected = quizAnswer === idx;
                const isCorrect = idx === selectedStory.question.correctIndex;
                let optStyle =
                  'bg-surface-container-low border-surface-container-high hover:bg-surface-container';

                if (isSelected && isCorrect) {
                  optStyle = 'bg-primary-fixed border-primary-container text-on-primary-container';
                } else if (isSelected && !isCorrect) {
                  optStyle = 'bg-error-container border-error text-on-error-container';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerQuiz(idx)}
                    className={`p-3.5 rounded-2xl border-2 text-left font-bold text-sm transition-all cursor-pointer ${optStyle}`}
                  >
                    <span className="font-black mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span>{optText}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback box */}
            {quizFeedback && (
              <div className="p-3.5 rounded-2xl bg-surface-container-low border-2 border-surface-container flex items-start gap-2.5">
                <span className="text-2xl">🤖</span>
                <p className="text-xs sm:text-sm font-bold text-on-surface leading-relaxed">
                  {quizFeedback}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-surface-container">
              <button
                onClick={() => {
                  setShowQuiz(false);
                  setPageIdx(0);
                }}
                className="px-4 py-2 rounded-xl bg-surface-container text-xs font-bold text-on-surface"
              >
                Baca Ulang Cerita ↺
              </button>

              {hasCompleted && (
                <button
                  onClick={() => {
                    stopTTS();
                    onClose();
                  }}
                  className="btn-tactile-teal px-6 py-2.5 text-xs sm:text-sm"
                >
                  Simpan Hadiah &amp; Tutup ✓
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
