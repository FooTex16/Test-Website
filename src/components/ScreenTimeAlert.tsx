import React from 'react';
import { playTTS, playSoundEffect } from '../utils/audio';

interface ScreenTimeAlertProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const ScreenTimeAlert: React.FC<ScreenTimeAlertProps> = ({ isOpen, onDismiss }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white border-4 border-primary-container p-6 sm:p-8 text-center flex flex-col items-center gap-4 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-5xl animate-bounce">
          👀🌿
        </div>

        <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-container font-black text-xs uppercase">
          Waktunya Istirahatkan Matamu!
        </span>

        <h3 className="font-display text-2xl font-black text-on-surface">
          Hebat! Sesi Belajarmu Selesai
        </h3>

        <p className="text-sm font-bold text-on-surface-variant leading-relaxed">
          Kamu sudah menjelajah selama 25 menit. Yuk, kedipkan mata, regangkan tangan ke atas,
          minum segelas air putih, dan pandang benda hijau yang jauh di luar jendela selama 2 menit!
        </p>

        <div className="flex items-center gap-3 w-full pt-2">
          <button
            onClick={() => {
              playSoundEffect('click');
              playTTS('Ayo istirahatkan matamu sejenak! Minum air putih dan regangkan tubuhmu ya!');
            }}
            className="flex-1 py-3 rounded-2xl bg-surface-container hover:bg-surface-container-high text-xs font-black"
          >
            🔊 Dengar Suara Olu
          </button>
          <button
            onClick={() => {
              playSoundEffect('click');
              onDismiss();
            }}
            className="flex-1 btn-tactile-teal py-3 text-xs font-black"
          >
            Saya Siap Lanjut ✓
          </button>
        </div>
      </div>
    </div>
  );
};
