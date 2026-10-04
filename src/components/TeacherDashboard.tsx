import React, { useState } from 'react';
import { TeacherAssignment } from '../types';
import { TEACHER_ASSIGNMENTS_DATA } from '../data/eduverseData';
import { playSoundEffect } from '../utils/audio';

interface TeacherDashboardProps {
  onBackToStudent: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBackToStudent }) => {
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(TEACHER_ASSIGNMENTS_DATA);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newWorld, setNewWorld] = useState('Pulau Numeria');
  const [newDueDate, setNewDueDate] = useState('20 Okt 2026');
  const [newReward, setNewReward] = useState('100');

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    playSoundEffect('correct');
    const created: TeacherAssignment = {
      id: `asg-${Date.now()}`,
      title: newTitle.trim(),
      world: newWorld,
      targetClass: 'Kelas 5A',
      dueDate: newDueDate,
      questionsCount: 10,
      sparkReward: parseInt(newReward, 10) || 100,
      completionRate: 0,
    };

    setAssignments([created, ...assignments]);
    setNewTitle('');
    setShowCreateModal(false);
  };

  return (
    <div className="w-full min-h-screen bg-surface-container-low py-8 px-4 sm:px-6 text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Teacher Cockpit Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border-2 border-surface-container-high shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center text-3xl shadow-sm">
              👨‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                  KURIKULUM MERDEKA SD
                </span>
                <span className="text-xs font-bold text-on-surface-variant">SD Negeri Cendekia 01</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-on-surface">
                Dasbor Guru: Kelas 5A
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-tactile-purple min-h-[46px] px-5 py-2 text-xs font-black flex items-center gap-1.5"
            >
              <span>+ Buat Quest Tugas</span>
            </button>
            <button
              onClick={onBackToStudent}
              className="px-4 py-2.5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-black text-xs"
            >
              Kembali ke Mode Anak ➔
            </button>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border-2 border-surface-container-high shadow-sm flex flex-col">
            <span className="text-xs font-bold text-on-surface-variant">Total Siswa</span>
            <span className="text-3xl font-display font-black text-on-surface mt-1">32 Siswa</span>
            <span className="text-[11px] font-bold text-emerald-600 mt-1">✓ 100% Terdaftar</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border-2 border-surface-container-high shadow-sm flex flex-col">
            <span className="text-xs font-bold text-on-surface-variant">Progres Rata-rata</span>
            <span className="text-3xl font-display font-black text-primary mt-1">82%</span>
            <span className="text-[11px] font-bold text-primary mt-1">↑ Naik 7% dari minggu lalu</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border-2 border-surface-container-high shadow-sm flex flex-col">
            <span className="text-xs font-bold text-on-surface-variant">Aktif Belajar Hari Ini</span>
            <span className="text-3xl font-display font-black text-secondary mt-1">27 Anak</span>
            <span className="text-[11px] font-bold text-secondary mt-1">84% Kehadiran digital</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border-2 border-surface-container-high shadow-sm flex flex-col">
            <span className="text-xs font-bold text-on-surface-variant">Perlu Pendampingan</span>
            <span className="text-3xl font-display font-black text-rose-600 mt-1">5 Anak</span>
            <span className="text-[11px] font-bold text-rose-600 mt-1">Materi: Pecahan Campuran</span>
          </div>
        </div>

        {/* Kurikulum Merdeka Competence Radar + Attention Alert */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Competence Checklist (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-3xl border-2 border-surface-container-high shadow-sm flex flex-col gap-4">
            <h3 className="font-display font-black text-lg text-on-surface flex items-center gap-2">
              <span>📊</span>
              <span>Capaian Pembelajaran Fase C (Kelas 5)</span>
            </h3>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex items-center justify-between text-xs font-black mb-1">
                  <span>Matematika: Pecahan Senilai &amp; Geometri Bangun Ruang</span>
                  <span className="text-primary">78% Tuntas</span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-primary-container rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-black mb-1">
                  <span>IPAS: Daur Air &amp; Ekosistem Rantai Makanan</span>
                  <span className="text-secondary">88% Tuntas</span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-black mb-1">
                  <span>Bahasa Indonesia: Kosakata Dongeng &amp; Teks Informasi</span>
                  <span className="text-amber-600">85% Tuntas</span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-black mb-1">
                  <span>Pendidikan Pancasila: Keragaman Rumah Adat 38 Provinsi</span>
                  <span className="text-emerald-700">92% Tuntas</span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Students Attention Alert (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border-2 border-surface-container-high shadow-sm flex flex-col gap-3">
            <h3 className="font-display font-black text-lg text-on-surface flex items-center gap-2">
              <span>⚠️</span>
              <span>Daftar Siswa Butuh Dukungan</span>
            </h3>

            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-rose-950">Doni Prasetyo</h4>
                  <p className="text-[11px] font-bold text-rose-800">Sering keliru di penyederhanaan pecahan</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold text-[10px]">
                  54% Skor
                </span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-rose-950">Siti Nurhaliza</h4>
                  <p className="text-[11px] font-bold text-rose-800">Belum menyelesaikan misi daur air</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold text-[10px]">
                  60% Skor
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-emerald-950">Rara Pratama (Bintang Pekan Ini)</h4>
                  <p className="text-[11px] font-bold text-emerald-800">Menyelesaikan 14 misi &amp; 7 hari streak</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                  96% Skor
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Management Table */}
        <div className="bg-white p-5 rounded-3xl border-2 border-surface-container-high shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-lg text-on-surface">
              Daftar Tugas &amp; Misi Terbit
            </h3>
            <span className="text-xs font-bold text-on-surface-variant">
              Tugas otomatis disinkronkan ke dashboard anak
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-surface-container text-xs font-black text-on-surface-variant uppercase">
                  <th className="py-2.5 px-3">Judul Tugas</th>
                  <th className="py-2.5 px-3">Dunia</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3">Batas Waktu</th>
                  <th className="py-2.5 px-3">Hadiah Spark</th>
                  <th className="py-2.5 px-3">Capaian Kelas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-xs font-bold text-on-surface">
                {assignments.map((asg) => (
                  <tr key={asg.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-3 font-extrabold text-secondary">{asg.title}</td>
                    <td className="py-3 px-3">{asg.world}</td>
                    <td className="py-3 px-3">{asg.targetClass}</td>
                    <td className="py-3 px-3">{asg.dueDate}</td>
                    <td className="py-3 px-3 text-amber-700">⚡ +{asg.sparkReward}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black">
                        {asg.completionRate}% Siswa
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Buat Tugas Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAssignment}
            className="w-full max-w-md rounded-3xl bg-white border-4 border-secondary p-6 shadow-2xl flex flex-col gap-4 text-left"
          >
            <h3 className="font-display font-black text-xl text-on-surface">
              Buat Quest Tugas Baru
            </h3>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-black text-on-surface">Judul Tugas:</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Operasi Hitung Campuran"
                className="px-3.5 py-2.5 rounded-xl border border-surface-container-high font-bold text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-black text-on-surface">Pilih Dunia Belajar:</label>
              <select
                value={newWorld}
                onChange={(e) => setNewWorld(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-surface-container-high font-bold text-xs"
              >
                <option value="Pulau Numeria">Pulau Numeria (Matematika)</option>
                <option value="Galaksi Sains">Galaksi Sains (IPAS)</option>
                <option value="Lembah Kata">Lembah Kata (Bahasa Indonesia)</option>
                <option value="Nusantara Waktu">Nusantara Waktu (Budaya)</option>
                <option value="Zona Cyber Cerdas">Zona Cyber (Keamanan Digital)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black text-on-surface">Batas Tanggal:</label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-surface-container-high font-bold text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black text-on-surface">Reward Spark:</label>
                <input
                  type="number"
                  value={newReward}
                  onChange={(e) => setNewReward(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-surface-container-high font-bold text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 btn-tactile-purple py-2.5 text-xs text-center"
              >
                Terbitkan Tugas
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 rounded-xl bg-surface-container text-xs font-bold"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
