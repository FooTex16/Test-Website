import React, { useState } from 'react';
import { playSoundEffect } from '../utils/audio';

interface AdultGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'teacher' | 'parent') => void;
}

export const AdultGateModal: React.FC<AdultGateModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  const [num1] = useState(7);
  const [num2] = useState(8);
  const [inputVal, setInputVal] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  if (!isOpen) return null;

  const correctAnswer = num1 * num2; // 56

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (parseInt(inputVal.trim(), 10) === correctAnswer) {
      playSoundEffect('correct');
      setIsVerified(true);
      setErrorMsg(false);
    } else {
      playSoundEffect('hint');
      setErrorMsg(true);
    }
  };

  const handleClose = () => {
    setInputVal('');
    setErrorMsg(false);
    setIsVerified(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="w-full max-w-md rounded-3xl bg-white border-4 border-secondary p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-black text-xl">
              🔒
            </div>
            <div>
              <h3 className="font-display text-xl font-black text-on-surface">
                Gerbang Guru &amp; Orang Tua
              </h3>
              <p className="text-xs font-bold text-on-surface-variant">
                Khusus akses dewasa dan pendidik SD
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl hover:bg-surface-container flex items-center justify-center text-on-surface-variant font-black text-lg"
          >
            ✕
          </button>
        </div>

        {!isVerified ? (
          /* Step 1: Adult Verification Math Challenge */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-secondary-fixed/30 border border-secondary/20 flex flex-col gap-2">
              <span className="text-xs font-black text-secondary">
                Tantangan Verifikasi Dewasa:
              </span>
              <p className="text-base font-extrabold text-on-surface">
                Berapakah hasil dari:{' '}
                <span className="text-xl text-secondary font-black bg-white px-3 py-1 rounded-xl shadow-sm inline-block">
                  {num1} × {num2}
                </span>{' '}
                ?
              </p>
              <input
                type="number"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setErrorMsg(false);
                }}
                placeholder="Ketik angka jawaban..."
                autoFocus
                className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-outline-variant focus:border-secondary focus:ring-0 font-black text-lg text-center"
              />
              {errorMsg && (
                <span className="text-xs font-black text-error">
                  Jawaban belum tepat, silakan coba hitung kembali!
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-2xl bg-secondary text-white font-black text-base border-2 border-[#4f00d0] shadow-[0_4px_0_#4f00d0] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                Verifikasi Masuk
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="py-3.5 px-5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-black text-sm cursor-pointer"
              >
                Kembali
              </button>
            </div>

            {/* Adult Features Preview */}
            <div className="pt-2 border-t border-surface-container flex flex-col gap-1.5 text-xs font-bold text-on-surface-variant">
              <span>✓ Pantau radar capaian Kurikulum Merdeka SD</span>
              <span>✓ Atur batas waktu layar sehat (Screen Time Limiter)</span>
              <span>✓ Manajemen tugas kelas &amp; unduh laporan perkembangan anak</span>
            </div>
          </form>
        ) : (
          /* Step 2: Role Selection after Verification */
          <div className="flex flex-col gap-4 animate-in fade-in">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>Verifikasi Berhasil! Silakan pilih dasbor yang ingin Anda tuju:</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => {
                  playSoundEffect('click');
                  onSelectRole('teacher');
                  handleClose();
                }}
                className="p-4 rounded-2xl bg-surface-container-lowest border-2 border-secondary hover:bg-secondary-fixed/20 text-left flex items-center gap-3.5 shadow-sm active:translate-y-0.5 transition-all cursor-pointer group"
              >
                <span className="text-3xl p-2 rounded-xl bg-secondary-fixed">👨‍🏫</span>
                <div className="flex flex-col">
                  <span className="font-display font-black text-secondary text-base group-hover:underline">
                    Ruang Guru SD (Teacher Dashboard)
                  </span>
                  <span className="text-xs font-bold text-on-surface-variant">
                    Kelola kelas 5A, buat tugas bermisi, &amp; pantau siswa yang butuh bimbingan.
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  playSoundEffect('click');
                  onSelectRole('parent');
                  handleClose();
                }}
                className="p-4 rounded-2xl bg-surface-container-lowest border-2 border-primary-container hover:bg-primary-fixed/20 text-left flex items-center gap-3.5 shadow-sm active:translate-y-0.5 transition-all cursor-pointer group"
              >
                <span className="text-3xl p-2 rounded-xl bg-primary-fixed">👨‍👩‍👧</span>
                <div className="flex flex-col">
                  <span className="font-display font-black text-primary text-base group-hover:underline">
                    Ruang Orang Tua (Parent Dashboard)
                  </span>
                  <span className="text-xs font-bold text-on-surface-variant">
                    Laporan mingguan Rara, batas waktu layar, &amp; tips pendampingan hangat di rumah.
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
