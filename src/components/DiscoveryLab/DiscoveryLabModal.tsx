import React, { useState } from 'react';
import { DiscoveryFact } from '../../types';
import { DISCOVERY_FACTS } from '../../data/eduverseData';
import { playTTS, playSoundEffect } from '../../utils/audio';

interface DiscoveryLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnRewards: (spark: number) => void;
}

export const DiscoveryLabModal: React.FC<DiscoveryLabModalProps> = ({
  isOpen,
  onClose,
  onEarnRewards,
}) => {
  const [selectedFact, setSelectedFact] = useState<DiscoveryFact>(DISCOVERY_FACTS[0]);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const isRevealed = revealedIds.includes(selectedFact.id);

  const handleReveal = () => {
    playSoundEffect('correct');
    setRevealedIds((prev) => [...prev, selectedFact.id]);
    playTTS(`${selectedFact.question} Jawabannya: ${selectedFact.fact} ${selectedFact.deepExplanation}`);
    onEarnRewards(selectedFact.sparkReward);
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
            <span className="text-3xl">🧪</span>
            <div>
              <h3 className="font-display font-black text-xl text-primary">
                Discovery Lab: Tahukah Kamu?
              </h3>
              <p className="text-xs font-bold text-on-surface-variant">
                Fakta sains menarik dan rasa ingin tahu alam semesta
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Fact Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {DISCOVERY_FACTS.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                playSoundEffect('click');
                setSelectedFact(f);
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs whitespace-nowrap transition-all cursor-pointer ${
                selectedFact.id === f.id
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span>{f.emoji} </span>
              <span>{f.question.slice(0, 24)}...</span>
            </button>
          ))}
        </div>

        {/* Question Display Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border-3 border-primary-container/40 flex flex-col items-center text-center gap-3">
          <span className="text-6xl p-3 rounded-2xl bg-white shadow-md animate-float">
            {selectedFact.emoji}
          </span>
          <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-container font-black text-xs uppercase">
            {selectedFact.category}
          </span>
          <h4 className="font-display text-2xl sm:text-3xl font-black text-on-surface max-w-xl">
            "{selectedFact.question}"
          </h4>
        </div>

        {/* Secret Fact Reveal */}
        {!isRevealed ? (
          <div className="p-6 rounded-2xl bg-surface-container-low border-2 border-dashed border-primary-container/60 flex flex-col items-center text-center gap-3">
            <span className="text-3xl">🔍</span>
            <p className="text-sm font-bold text-on-surface-variant max-w-md">
              Penasaran dengan jawabannya? Sentuh tombol di bawah untuk mengungkap rahasia sains ini!
            </p>
            <button
              onClick={handleReveal}
              className="btn-tactile-teal px-8 py-3 text-base flex items-center gap-2"
            >
              <span>Temukan Rahasianya!</span>
              <span>✨ +{selectedFact.sparkReward} Spark</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-primary-fixed/30 border-2 border-primary-container text-left flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-primary uppercase">
                  Jawaban Rahasia Olu:
                </span>
                <button
                  onClick={() =>
                    playTTS(`${selectedFact.fact} ${selectedFact.deepExplanation}`)
                  }
                  className="inline-flex items-center gap-1 text-xs font-black text-primary hover:underline"
                >
                  <span>🔊</span>
                  <span>Dengarkan</span>
                </button>
              </div>
              <p className="font-display text-lg font-black text-on-surface">
                {selectedFact.fact}
              </p>
              <p className="text-sm font-bold text-on-surface-variant leading-relaxed">
                {selectedFact.deepExplanation}
              </p>
            </div>

            {/* Safe Home Experiment Hint */}
            <div className="p-4 rounded-2xl bg-[#fff8e5] border-2 border-tertiary-container/40 flex items-start gap-3">
              <span className="text-2xl shrink-0">💡</span>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-tertiary uppercase">
                  Eksperimen Mini di Rumah:
                </span>
                <p className="text-xs sm:text-sm font-bold text-on-surface leading-snug mt-0.5">
                  {selectedFact.experimentHint}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-container">
          <span className="text-xs font-bold text-on-surface-variant">
            Rasa ingin tahu adalah awal dari segala penemuan besar!
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high font-black text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
