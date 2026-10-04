import React, { useState } from 'react';
import { playSoundEffect } from '../utils/audio';

interface ParentDashboardProps {
  onBackToStudent: () => void;
  screenTimeLimit: number;
  onSetScreenTimeLimit: (minutes: number) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  onBackToStudent,
  screenTimeLimit,
  onSetScreenTimeLimit,
}) => {
  const [selectedLimit, setSelectedLimit] = useState(screenTimeLimit);

  const handleSaveLimit = (min: number) => {
    playSoundEffect('correct');
    setSelectedLimit(min);
    onSetScreenTimeLimit(min);
  };

  return (
    <div className="w-full min-h-screen bg-surface-container-low py-8 px-4 sm:px-6 text-left">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Parent Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border-2 border-surface-container-high shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-primary-fixed text-on-primary-container flex items-center justify-center text-3xl shadow-sm">
              👨‍👩‍👧
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-container">
                  RUANG ORANG TUA
                </span>
                <span className="text-xs font-bold text-on-surface-variant">Laporan Mingguan Rara</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-on-surface">
                Perkembangan Belajar Anak
              </h1>
            </div>
          </div>

          <button
            onClick={onBackToStudent}
            className="px-4 py-2.5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-black text-xs cursor-pointer"
          >
            Kembali ke Mode Anak ➔
          </button>
        </div>

        {/* Weekly Report Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border-2 border-surface-container-high shadow-sm flex flex-col gap-1">
            <span className="text-xs font-bold text-on-surface-variant">Waktu Belajar Pekan Ini</span>
            <span className="font-display text-3xl font-black text-secondary">2 Jam 35 Menit</span>
            <span className="text-xs text-emerald-600 font-bold mt-1">✓ Seimbang dengan istirahat</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border-2 border-surface-container-high shadow-sm flex flex-col gap-1">
            <span className="text-xs font-bold text-on-surface-variant">Total Aktivitas Diselesaikan</span>
            <span className="font-display text-3xl font-black text-primary">23 Misi &amp; Cerita</span>
            <span className="text-xs text-on-surface-variant font-bold mt-1">87% tingkat keberhasilan</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border-2 border-surface-container-high shadow-sm flex flex-col gap-1">
            <span className="text-xs font-bold text-on-surface-variant">Spark Streak</span>
            <span className="font-display text-3xl font-black text-amber-600">🔥 7 Hari Berturut</span>
            <span className="text-xs text-amber-700 font-bold mt-1">Konsistensi terbangun baik</span>
          </div>
        </div>

        {/* Strengths and Guidance Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Kuat */}
          <div className="p-5 rounded-3xl bg-white border-2 border-surface-container-high shadow-sm flex flex-col gap-3">
            <h3 className="font-display font-black text-base text-emerald-800 flex items-center gap-2">
              <span>🌟</span>
              <span>Materi Yang Dikuasai Dengan Sangat Baik</span>
            </h3>

            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-950">
                <span>✓ Perkalian &amp; Logika Angka Cepat</span>
                <span className="font-black text-emerald-700">95% Nilai</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-950">
                <span>✓ Sains Daur Air &amp; Ekosistem Penyu Boni</span>
                <span className="font-black text-emerald-700">92% Nilai</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-950">
                <span>✓ Dongeng Nusantara &amp; Nilai Gotong Royong</span>
                <span className="font-black text-emerald-700">90% Nilai</span>
              </div>
            </div>
          </div>

          {/* Perlu Pendampingan */}
          <div className="p-5 rounded-3xl bg-white border-2 border-surface-container-high shadow-sm flex flex-col gap-3">
            <h3 className="font-display font-black text-base text-amber-800 flex items-center gap-2">
              <span>💡</span>
              <span>Area Yang Perlu Pendampingan Santai</span>
            </h3>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-black text-amber-950">
                <span>⚠ Pecahan Sederhana (Bagian Pizza/Kue)</span>
                <span className="text-amber-800">Perlu Latihan Konkret</span>
              </div>
              <p className="text-xs font-bold text-amber-900 leading-relaxed">
                Rara terkadang masih bingung membedakan bagian yang dimakan dengan bagian sisa pecahan.
              </p>
              <div className="p-2.5 rounded-xl bg-white text-xs font-bold text-slate-700 border border-amber-200 mt-1">
                <strong>Tips Orang Tua:</strong> Saat memotong buah apel atau roti di rumah, ajak Rara menghitung: "Jika dipotong 4 bagian dan Ayah makan 1, sisa berapa potong?" Pendekatan nyata ini sangat membantu Rara!
              </div>
            </div>
          </div>
        </div>

        {/* Screen Time Limiter Settings */}
        <div className="p-6 rounded-3xl bg-white border-2 border-surface-container-high shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-black text-lg text-on-surface">
                ⏱️ Pengaturan Batas Waktu Layar Sehat
              </h3>
              <p className="text-xs font-bold text-on-surface-variant">
                Saat waktu habis, EduVerse akan memunculkan animasi istirahat mata yang ramah.
              </p>
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Aktif: {selectedLimit} Menit
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[15, 25, 40].map((mins) => (
              <button
                key={mins}
                onClick={() => handleSaveLimit(mins)}
                className={`p-4 rounded-2xl border-2 font-black text-sm flex items-center justify-between transition-all cursor-pointer ${
                  selectedLimit === mins
                    ? 'bg-secondary text-white border-secondary shadow-md'
                    : 'bg-surface-container-low border-surface-container text-on-surface hover:bg-surface-container'
                }`}
              >
                <span>{mins} Menit Belajar</span>
                <span>{selectedLimit === mins ? '✓ Dipilih' : 'Pilih'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
