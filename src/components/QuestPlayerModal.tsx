import React, { useState, useEffect } from 'react';
import { Quest, QuestOption } from '../types';
import { playSoundEffect, playTTS, stopTTS } from '../utils/audio';

interface QuestPlayerModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteQuest: (questId: string, spark: number, shard: number) => void;
}

export const QuestPlayerModal: React.FC<QuestPlayerModalProps> = ({
  quest,
  isOpen,
  onClose,
  onCompleteQuest,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedOptionId(null);
      setShowExplanation(false);
      setShowHint(false);
      setIsCompleted(false);
    } else {
      stopTTS();
    }
  }, [isOpen, quest]);

  if (!isOpen || !quest) return null;

  const handleSelectOption = (opt: QuestOption) => {
    if (showExplanation) return;
    setSelectedOptionId(opt.id);
    setShowExplanation(true);

    if (opt.isCorrect) {
      playSoundEffect('correct');
      setIsCompleted(true);
      playTTS(`Hebat sekali! Jawabanmu benar! ${opt.explanation}`);
    } else {
      playSoundEffect('hint');
      playTTS(`Hampir tepat! ${opt.explanation}. Coba baca kembali petunjuknya ya!`);
    }
  };

  const handleClaimReward = () => {
    playSoundEffect('fanfare');
    onCompleteQuest(quest.id, quest.sparkReward, quest.shardReward);
    onClose();
  };

  const selectedOpt = quest.options.find((o) => o.id === selectedOptionId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-white border-4 border-surface-container-high shadow-[0_16px_0_#d6e2f8] overflow-hidden text-left flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-primary to-primary-container text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
              {quest.characterEmoji || '🧭'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-white font-black text-[10px] uppercase">
                  Misi #{quest.questNumber}
                </span>
                <span className="text-xs font-extrabold text-teal-100">
                  {quest.category}
                </span>
              </div>
              <h2 className="font-display font-black text-lg sm:text-xl text-white">
                {quest.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playSoundEffect('click');
              stopTTS();
              onClose();
            }}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-black text-xl transition-all cursor-pointer"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Quest Rewards Strip */}
        <div className="px-5 py-2.5 bg-tertiary-fixed border-b border-tertiary-container/30 flex items-center justify-between text-xs font-black text-on-tertiary-fixed">
          <div className="flex items-center gap-3">
            <span>⚡ +{quest.sparkReward} Spark</span>
            <span>⭐ +{quest.shardReward} Star Shards</span>
          </div>
          <button
            onClick={() => {
              playSoundEffect('click');
              playTTS(`${quest.characterName} berkata: ${quest.storyPrompt}`);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-black underline cursor-pointer"
          >
            <span>🔊</span>
            <span>Bacakan Soal</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex flex-col gap-5 overflow-y-auto max-h-[60vh]">
          {/* NPC Dialogue Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border-2 border-surface-container-high flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-primary-container flex items-center justify-center text-3xl sm:text-4xl shadow-xs shrink-0 animate-float">
              {quest.characterEmoji}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="font-display font-black text-xs text-primary">
                {quest.characterName} Menyampaikan:
              </span>
              <p className="text-sm sm:text-base font-bold text-on-surface leading-relaxed">
                "{quest.storyPrompt}"
              </p>
            </div>
          </div>

          {/* Hint Trigger */}
          {quest.hint && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  playSoundEffect('hint');
                  setShowHint(!showHint);
                  if (!showHint) playTTS(`Petunjuk dari Olu: ${quest.hint}`);
                }}
                className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-xs border border-amber-200 transition-all cursor-pointer"
              >
                <span>💡</span>
                <span>{showHint ? 'Sembunyikan Petunjuk' : 'Minta Petunjuk Olu'}</span>
              </button>

              {showHint && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-2">
                  <span>🤖</span>
                  <span>"{quest.hint}"</span>
                </div>
              )}
            </div>
          )}

          {/* Options Grid */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-black text-on-surface-variant uppercase tracking-wider">
              Pilih Jawaban yang Benar:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quest.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let btnStyle = 'bg-white border-surface-container-high hover:border-primary text-on-surface shadow-xs';

                if (showExplanation) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-black shadow-md';
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 opacity-80';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    disabled={showExplanation}
                    className={`p-4 rounded-2xl border-3 text-left transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center font-black text-xs shrink-0">
                      {opt.label}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-display font-black text-sm">
                        {opt.title}
                      </span>
                      {opt.subtitle && (
                        <span className="text-xs font-bold opacity-80">
                          {opt.subtitle}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Explanation Card */}
          {showExplanation && selectedOpt && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border-3 animate-in fade-in flex flex-col gap-2 ${
                selectedOpt.isCorrect
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {selectedOpt.isCorrect ? '🎉' : '🤔'}
                </span>
                <span className="font-display font-black text-sm sm:text-base">
                  {selectedOpt.isCorrect
                    ? 'Luar Biasa, Jawabanmu Tepat!'
                    : 'Ayo Pelajari Konsep Ini:'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold leading-relaxed">
                {selectedOpt.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-surface-container-low border-t border-surface-container flex items-center justify-between">
          <button
            onClick={() => {
              playSoundEffect('click');
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-on-surface-variant font-extrabold text-xs border border-surface-container-high transition-all cursor-pointer"
          >
            Tutup Misi
          </button>

          {isCompleted && (
            <button
              onClick={handleClaimReward}
              className="btn-tactile-teal min-h-[48px] px-6 text-sm font-black flex items-center gap-2"
            >
              <span>Klaim Hadiah Bintang</span>
              <span>🎁</span>
            </button>
          )}

          {showExplanation && !isCompleted && (
            <button
              onClick={() => {
                setSelectedOptionId(null);
                setShowExplanation(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-black text-xs shadow-xs hover:brightness-105 cursor-pointer"
            >
              Coba Lagi ↺
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
