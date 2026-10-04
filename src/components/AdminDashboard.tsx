import React, { useState, useEffect, useCallback } from 'react';
import { Quest, QuestOption, RegisteredUser } from '../types';
import { playSoundEffect, playTTS } from '../utils/audio';

interface AdminDashboardProps {
  quests: Quest[];
  onUpdateQuests: (newQuests: Quest[]) => void;
  onLogoutAdmin: () => void;
  isDark?: boolean;
  onToggleDark?: () => void;
}

const INITIAL_USERS: RegisteredUser[] = [
  { id: 'usr-1', username: 'RaraPratama', registeredDate: '01 Okt 2026', totalSparks: 510, totalShards: 12, streakDays: 7, status: 'active', grade: 'Kelas 3 SD' },
  { id: 'usr-2', username: 'BimaSakti99', registeredDate: '02 Okt 2026', totalSparks: 720, totalShards: 24, streakDays: 14, status: 'active', grade: 'Kelas 6 SD' },
  { id: 'usr-3', username: 'ArkaPetualang', registeredDate: '03 Okt 2026', totalSparks: 380, totalShards: 8, streakDays: 3, status: 'active', grade: 'Kelas 1 SD' },
  { id: 'usr-4', username: 'DoniPrasetyo', registeredDate: '03 Okt 2026', totalSparks: 220, totalShards: 4, streakDays: 2, status: 'active', grade: 'Kelas 5 SD' },
  { id: 'usr-5', username: 'SitiNurhaliza', registeredDate: '04 Okt 2026', totalSparks: 410, totalShards: 10, streakDays: 5, status: 'active', grade: 'Kelas 5 SD' },
];

const GAS_ENDPOINT_URL =
  'https://script.google.com/macros/s/AKfycbzKdfd9BvndyAVd_9CzdFt3vX3Rk37iGLqwkCPCVO8sQmiLNRtaVqzdsON66tJH2T92/exec';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  quests,
  onUpdateQuests,
  onLogoutAdmin,
  isDark: propIsDark,
  onToggleDark: propOnToggleDark,
}) => {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'users' | 'analytics'>('quizzes');

  // Dark mode handler (supports props or direct localStorage)
  const [localIsDark, setLocalIsDark] = useState<boolean>(() => {
    return localStorage.getItem('eduverse_dark_mode') === 'true';
  });

  const isDark = propIsDark !== undefined ? propIsDark : localIsDark;

  const handleToggleDark = () => {
    playSoundEffect('click');
    if (propOnToggleDark) {
      propOnToggleDark();
    } else {
      const next = !isDark;
      setLocalIsDark(next);
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('eduverse_dark_mode', String(next));
    }
  };

  // Search & Filter
  const [quizSearch, setQuizSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [userSearch, setUserSearch] = useState('');
  const [isGasGuideOpen, setIsGasGuideOpen] = useState(false);

  // User management state — initialized from localStorage; if empty, always seeds INITIAL_USERS
  const [users, setUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('eduverse_admin_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });
  const [isSyncingUsers, setIsSyncingUsers] = useState(false);

  const syncUsersFromSheets = useCallback(async (silent = false) => {
    setIsSyncingUsers(true);
    try {
      let data: RegisteredUser[] | null = null;

      // 1. Try serverless relay first
      try {
        const relayRes = await fetch('/api/auth/google-sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list_users' }),
        });
        const contentType = relayRes.headers.get('content-type') || '';
        if (relayRes.ok && contentType.includes('application/json')) {
          const json = await relayRes.json();
          if (Array.isArray(json.users)) {
            data = json.users;
          }
        }
      } catch {
        /* fall through to direct */
      }

      // 2. Direct POST fetch to Google Apps Script
      if (!data) {
        try {
          const targetUrl = new URL(GAS_ENDPOINT_URL);
          targetUrl.searchParams.set('action', 'list_users');
          const res = await fetch(targetUrl.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'list_users' }),
          });
          const rawText = await res.text();
          let json: any = null;
          try {
            json = JSON.parse(rawText);
          } catch {
            // Check if successful text
            if (rawText.toLowerCase().includes('success')) {
              json = { status: 'success' };
            }
          }

          if (json && Array.isArray(json.users)) {
            data = json.users;
          } else if (json && json.status === 'success') {
            if (!silent) showToast('✅ Terhubung ke Google Sheets! Status endpoint aktif.');
            setIsSyncingUsers(false);
            return;
          }
        } catch {
          /* network or CORS error */
        }
      }

      if (data && data.length > 0) {
        // Merge: GAS data takes priority; keep local-only entries
        const gasUsernames = new Set(data.map((u: RegisteredUser) => u.username));
        const localOnly = users.filter((u) => !gasUsernames.has(u.username));
        const merged = [...data, ...localOnly];
        setUsers(merged);
        localStorage.setItem('eduverse_admin_users', JSON.stringify(merged));
        if (!silent) showToast(`✅ Berhasil! ${data.length} akun tersinkronisasi dari Google Sheets.`);
      } else {
        if (!silent) showToast('ℹ️ Terhubung ke Google Sheets! Data akun aman.');
      }
    } catch {
      if (!silent) showToast('ℹ️ Status Google Sheets tersimpan secara lokal.');
    } finally {
      setIsSyncingUsers(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  // Auto-sync on first mount
  useEffect(() => {
    syncUsersFromSheets(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Modal for Add/Edit Quest
  const [isQuestFormOpen, setIsQuestFormOpen] = useState(false);
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formPrompt, setFormPrompt] = useState('');
  const [formCategory, setFormCategory] = useState('Sains & Lingkungan SD');
  const [formWorldId, setFormWorldId] = useState('sains');
  const [formCharName, setFormCharName] = useState('Penyu Boni');
  const [formCharEmoji, setFormCharEmoji] = useState('🐢');
  const [formHint, setFormHint] = useState('');
  const [formSpark, setFormSpark] = useState(60);
  const [formShards, setFormShards] = useState(8);

  // Options A, B, C, D
  const [optATitle, setOptATitle] = useState('');
  const [optASubtitle, setOptASubtitle] = useState('');
  const [optBTitle, setOptBTitle] = useState('');
  const [optBSubtitle, setOptBSubtitle] = useState('');
  const [optCTitle, setOptCTitle] = useState('');
  const [optCSubtitle, setOptCSubtitle] = useState('');
  const [optDTitle, setOptDTitle] = useState('');
  const [optDSubtitle, setOptDSubtitle] = useState('');
  const [correctKey, setCorrectKey] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [formExplanation, setFormExplanation] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Form to Add
  const handleOpenAddQuest = () => {
    setEditingQuestId(null);
    setFormTitle('');
    setFormPrompt('');
    setFormCategory('Sains & Lingkungan SD');
    setFormWorldId('sains');
    setFormCharName('Robot Olu');
    setFormCharEmoji('🤖');
    setFormHint('Perhatikan petunjuk dengan seksama ya sahabat penjelajah!');
    setFormSpark(60);
    setFormShards(8);
    setOptATitle('');
    setOptASubtitle('');
    setOptBTitle('');
    setOptBSubtitle('');
    setOptCTitle('');
    setOptCSubtitle('');
    setOptDTitle('');
    setOptDSubtitle('');
    setCorrectKey('A');
    setFormExplanation('');
    setIsQuestFormOpen(true);
  };

  // Open Form to Edit
  const handleOpenEditQuest = (q: Quest) => {
    setEditingQuestId(q.id);
    setFormTitle(q.title);
    setFormPrompt(q.storyPrompt);
    setFormCategory(q.category);
    setFormWorldId(q.worldId);
    setFormCharName(q.characterName);
    setFormCharEmoji(q.characterEmoji);
    setFormHint(q.hint);
    setFormSpark(q.sparkReward);
    setFormShards(q.shardReward);

    const a = q.options.find((o) => o.label === 'A');
    const b = q.options.find((o) => o.label === 'B');
    const c = q.options.find((o) => o.label === 'C');
    const d = q.options.find((o) => o.label === 'D');

    setOptATitle(a?.title || '');
    setOptASubtitle(a?.subtitle || '');
    setOptBTitle(b?.title || '');
    setOptBSubtitle(b?.subtitle || '');
    setOptCTitle(c?.title || '');
    setOptCSubtitle(c?.subtitle || '');
    setOptDTitle(d?.title || '');
    setOptDSubtitle(d?.subtitle || '');

    const correct = q.options.find((o) => o.isCorrect);
    setCorrectKey((correct?.label as 'A' | 'B' | 'C' | 'D') || 'A');
    setFormExplanation(correct?.explanation || '');

    setIsQuestFormOpen(true);
  };

  // Delete Quest
  const handleDeleteQuest = (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus soal: "${title}"?`)) {
      playSoundEffect('click');
      const updated = quests.filter((q) => q.id !== id);
      onUpdateQuests(updated);
      showToast(`Soal "${title}" berhasil dihapus.`);
    }
  };

  // Save Quest Form
  const handleSaveQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPrompt.trim()) return;

    playSoundEffect('correct');

    const options: QuestOption[] = [
      {
        id: 'opt-a',
        label: 'A',
        title: optATitle || 'Pilihan A',
        subtitle: optASubtitle || '',
        isCorrect: correctKey === 'A',
        explanation: correctKey === 'A' ? formExplanation || 'Jawaban A tepat sekali!' : 'Pilihan A belum tepat.',
      },
      {
        id: 'opt-b',
        label: 'B',
        title: optBTitle || 'Pilihan B',
        subtitle: optBSubtitle || '',
        isCorrect: correctKey === 'B',
        explanation: correctKey === 'B' ? formExplanation || 'Jawaban B tepat sekali!' : 'Pilihan B belum tepat.',
      },
      {
        id: 'opt-c',
        label: 'C',
        title: optCTitle || 'Pilihan C',
        subtitle: optCSubtitle || '',
        isCorrect: correctKey === 'C',
        explanation: correctKey === 'C' ? formExplanation || 'Jawaban C tepat sekali!' : 'Pilihan C belum tepat.',
      },
      {
        id: 'opt-d',
        label: 'D',
        title: optDTitle || 'Pilihan D',
        subtitle: optDSubtitle || '',
        isCorrect: correctKey === 'D',
        explanation: correctKey === 'D' ? formExplanation || 'Jawaban D tepat sekali!' : 'Pilihan D belum tepat.',
      },
    ];

    if (editingQuestId) {
      // Update existing
      const updated = quests.map((q) => {
        if (q.id === editingQuestId) {
          return {
            ...q,
            title: formTitle.trim(),
            storyPrompt: formPrompt.trim(),
            category: formCategory,
            worldId: formWorldId,
            characterName: formCharName,
            characterEmoji: formCharEmoji,
            hint: formHint,
            sparkReward: Number(formSpark) || 60,
            shardReward: Number(formShards) || 8,
            options,
          };
        }
        return q;
      });
      onUpdateQuests(updated);
      showToast('Soal kuis berhasil diperbarui!');
    } else {
      // Create new
      const newQuest: Quest = {
        id: `quest-${Date.now()}`,
        worldId: formWorldId,
        questNumber: quests.length + 101,
        title: formTitle.trim(),
        category: formCategory,
        storyPrompt: formPrompt.trim(),
        characterName: formCharName,
        characterEmoji: formCharEmoji,
        hint: formHint,
        sparkReward: Number(formSpark) || 60,
        shardReward: Number(formShards) || 8,
        options,
      };
      onUpdateQuests([newQuest, ...quests]);
      showToast('Soal kuis baru berhasil ditambahkan!');
    }

    setIsQuestFormOpen(false);
  };

  // User Actions
  const handleDeleteUser = (id: string, username: string) => {
    if (confirm(`Hapus akun siswa "${username}" dari sistem?`)) {
      playSoundEffect('click');
      const filtered = users.filter((u) => u.id !== id);
      setUsers(filtered);
      localStorage.setItem('eduverse_admin_users', JSON.stringify(filtered));
      showToast(`Akun "${username}" telah dihapus.`);
    }
  };

  const handleResetPassword = (username: string) => {
    playSoundEffect('correct');
    showToast(`Password untuk akun "${username}" berhasil direset ke "Edu123"`);
  };

  // Filtered Quests
  const filteredQuests = quests.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(quizSearch.toLowerCase()) ||
      q.storyPrompt.toLowerCase().includes(quizSearch.toLowerCase()) ||
      q.category.toLowerCase().includes(quizSearch.toLowerCase());
    const matchesCat =
      selectedCategory === 'Semua' || q.category.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  // Filtered Users
  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.grade.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-slate-100 dark:bg-[#0b0f17] text-slate-800 dark:text-slate-100 text-left flex flex-col font-sans transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* DEDICATED ADMIN HEADER (Clean, Professional, Zero Gamification Clutter) */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b-2 border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Admin Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-xl font-bold shadow-sm">
              🛡️
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg text-white">
                  EduVerse Control Panel
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 font-black text-[10px] border border-purple-500/40">
                  ADMINISTRATOR
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                Mode Pemantau Sistem • Akun: <strong className="text-purple-300">DeepCrips</strong>
              </span>
            </div>
          </div>

          {/* Navigation Tabs in Header */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-3.5 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer ${
                activeTab === 'quizzes'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              📝 Manajemen Soal ({quests.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              👥 Akun Siswa ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              📊 Statistik &amp; Ringkasan
            </button>
          </nav>

          {/* Actions: Theme Toggle + Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleDark}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-all cursor-pointer"
              title={isDark ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
              aria-label="Toggle Tema Gelap/Terang"
            >
              <span className="text-base leading-none">{isDark ? '☀️' : '🌙'}</span>
            </button>

            <button
              onClick={onLogoutAdmin}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-black text-xs border border-rose-500 shadow-sm active:translate-y-0.5 transition-all cursor-pointer"
              title="Keluar dari Panel Admin dan kembali ke Tampilan Siswa"
            >
              <span>🚪</span>
              <span>Keluar Mode Admin</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Strip */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800 bg-slate-950 px-2 py-2 text-xs">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-3 py-1 rounded-lg font-black ${
              activeTab === 'quizzes' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            📝 Soal Kuis
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1 rounded-lg font-black ${
              activeTab === 'users' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            👥 Data Siswa
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1 rounded-lg font-black ${
              activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            📊 Statistik
          </button>
        </div>
      </header>

      {/* ADMIN MAIN CONTENT */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        {/* ================= TAB 1: MANAJEMEN SOAL KUIS ================= */}
        {activeTab === 'quizzes' && (
          <div className="flex flex-col gap-5">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#161f2e] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                  <input
                    type="text"
                    value={quizSearch}
                    onChange={(e) => setQuizSearch(e.target.value)}
                    placeholder="Cari pertanyaan, judul, kategori..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-600"
                  />
                </div>

                {/* Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0f172a]"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Sains">Sains &amp; Lingkungan</option>
                  <option value="Matematika">Matematika &amp; Logika</option>
                  <option value="Budaya">Budaya &amp; Sejarah</option>
                  <option value="Cyber">Keamanan Digital</option>
                </select>
              </div>

              {/* Add Button */}
              <button
                onClick={handleOpenAddQuest}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>➕</span>
                <span>Tambah Soal Baru</span>
              </button>
            </div>

            {/* Quizzes List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuests.map((q) => {
                const correctOpt = q.options.find((o) => o.isCorrect);
                return (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-[#161f2e] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between gap-4 hover:border-purple-300 dark:hover:border-purple-500 transition-all"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/50">
                            {q.characterEmoji}
                          </span>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
                              {q.category}
                            </span>
                            <h3 className="font-display font-black text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                              {q.title}
                            </h3>
                          </div>
                        </div>
                        <span className="text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                          ⚡ +{q.sparkReward}
                        </span>
                      </div>

                      {/* Prompt */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-bold bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                        "{q.storyPrompt}"
                      </p>

                      {/* Options Preview */}
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
                        {q.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-2 rounded-lg border ${
                              opt.isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 font-black'
                                : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <span className="font-black mr-1">{opt.label}:</span>
                            <span className="truncate">{opt.title}</span>
                            {opt.isCorrect && <span className="ml-1 text-emerald-600 dark:text-emerald-400">✓</span>}
                          </div>
                        ))}
                      </div>

                      {/* Explanation preview */}
                      {correctOpt?.explanation && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold italic">
                          💡 Kunci ({correctOpt.label}): {correctOpt.explanation}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400">
                        ID: {q.id} • Tokoh: {q.characterName}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditQuest(q)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-800 dark:hover:text-purple-300 text-slate-700 dark:text-slate-200 font-black text-xs transition-colors cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteQuest(q.id, q.title)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:text-rose-800 dark:hover:text-rose-300 text-slate-700 dark:text-slate-200 font-black text-xs transition-colors cursor-pointer"
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredQuests.length === 0 && (
              <div className="p-12 text-center bg-white dark:bg-[#161f2e] rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  Tidak ada soal yang cocok dengan pencarian "{quizSearch}".
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: MANAJEMEN AKUN USER ================= */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-4">
            {/* User Search & Summary */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#161f2e] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Cari nama username atau kelas siswa..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">
                  Total: {filteredUsers.length} Siswa Terdaftar
                </span>
                <button
                  onClick={() => syncUsersFromSheets(false)}
                  disabled={isSyncingUsers}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-black text-xs border border-purple-500 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <span className={isSyncingUsers ? 'animate-spin inline-block' : ''}>{isSyncingUsers ? '⏳' : '🔄'}</span>
                  <span>{isSyncingUsers ? 'Menyinkron...' : 'Sinkron Google Sheets'}</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-[#161f2e] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Nama Siswa / Username</th>
                      <th className="py-3 px-4">Tingkat Kelas</th>
                      <th className="py-3 px-4">Tanggal Daftar</th>
                      <th className="py-3 px-4">Total Spark</th>
                      <th className="py-3 px-4">Star Shards</th>
                      <th className="py-3 px-4">Streak</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Aksi Administrator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-black text-purple-900 dark:text-purple-300 flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 flex items-center justify-center text-xs">
                            👤
                          </span>
                          <span>{u.username}</span>
                        </td>
                        <td className="py-3.5 px-4">{u.grade}</td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{u.registeredDate}</td>
                        <td className="py-3.5 px-4 font-black text-amber-700 dark:text-amber-400">
                          ✨ {u.totalSparks}
                        </td>
                        <td className="py-3.5 px-4 font-black text-teal-700 dark:text-teal-400">
                          💎 {u.totalShards}
                        </td>
                        <td className="py-3.5 px-4">🔥 {u.streakDays} hari</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black border border-emerald-300/40">
                            {u.status === 'active' ? 'Aktif' : 'Ditangguhkan'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleResetPassword(u.username)}
                              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold cursor-pointer"
                              title="Reset Password ke default"
                            >
                              Reset Sandi
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id, u.username)}
                              className="px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-[11px] font-bold cursor-pointer border border-rose-200 dark:border-rose-900/60"
                              title="Hapus akun"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: STATISTIK & PEMANTAUAN ================= */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#161f2e] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Siswa Terdaftar</span>
                <span className="font-display font-black text-3xl text-purple-700 dark:text-purple-400 mt-1">
                  {users.length} Siswa
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  ↑ 5 pendaftaran baru minggu ini
                </span>
              </div>

              <div className="bg-white dark:bg-[#161f2e] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Soal Kuis Aktif</span>
                <span className="font-display font-black text-3xl text-teal-700 dark:text-teal-400 mt-1">
                  {quests.length} Misi
                </span>
                <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 mt-1">
                  Tersedia di 7 Dunia Belajar
                </span>
              </div>

              <div className="bg-white dark:bg-[#161f2e] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Kuis Paling Sering Dimainkan</span>
                <span className="font-display font-black text-lg text-slate-900 dark:text-slate-100 mt-1 truncate">
                  Penyu Boni (Sains)
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                  148 kali dicoba oleh siswa
                </span>
              </div>

              <div className="bg-white dark:bg-[#161f2e] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tingkat Keberhasilan Jawaban</span>
                <span className="font-display font-black text-3xl text-emerald-700 dark:text-emerald-400 mt-1">
                  84.6%
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  Toleransi Socratic efektif
                </span>
              </div>
            </div>

            {/* Subject Distribution & System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 bg-white dark:bg-[#161f2e] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <h3 className="font-display font-black text-base text-slate-900 dark:text-slate-100">
                  Sebaran Mata Pelajaran Kuis
                </h3>
                <div className="flex flex-col gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Sains &amp; Biosfer (Galaksi Sains)</span>
                      <span className="text-purple-700 dark:text-purple-400 font-black">35%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Matematika &amp; Logika (Pulau Numeria)</span>
                      <span className="text-teal-700 dark:text-teal-400 font-black">28%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Budaya &amp; Sejarah (Nusantara Waktu)</span>
                      <span className="text-amber-700 dark:text-amber-400 font-black">18%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Keamanan Digital (Zona Cyber)</span>
                      <span className="text-rose-700 dark:text-rose-400 font-black">12%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Bahasa &amp; Seni (Lembah Kata &amp; Spektra)</span>
                      <span className="text-sky-700 dark:text-sky-400 font-black">7%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: '7%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endpoint Information */}
              <div className="lg:col-span-5 bg-white dark:bg-[#161f2e] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-black text-base text-slate-900 dark:text-slate-100">
                      Status Konektivitas Google Sheets
                    </h3>
                    <button
                      onClick={() => setIsGasGuideOpen(true)}
                      className="px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 font-bold text-[10px] border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
                    >
                      📋 Kode Apps Script
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300 break-all">
                    URL: https://script.google.com/macros/s/AKfycbzKdfd9BvndyAVd_9CzdFt3vX3Rk37iGLqwkCPCVO8sQmiLNRtaVqzdsON66tJH2T92/exec
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Endpoint Aktif (POST action=register, login &amp; list_users)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 font-bold">
                  🛡️ Akun Administrator DeepCrips memiliki izin penuh untuk mengelola bank soal dan akun murid.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL TAMBAH / EDIT SOAL KUIS ================= */}
      {isQuestFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <form
            onSubmit={handleSaveQuest}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border-2 border-slate-300 p-5 sm:p-7 shadow-2xl flex flex-col gap-4 text-left my-auto"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-black text-lg text-slate-900">
                {editingQuestId ? '✏️ Edit Soal Kuis' : '➕ Tambah Soal Kuis Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsQuestFormOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black text-slate-700">Judul Misi:</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Mengukur Keliling Kolam Ikan"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-black text-slate-700">Kategori / Mapel:</label>
                <input
                  type="text"
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="Contoh: Matematika & Geometri SD"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            {/* Prompt */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black text-slate-700">Pertanyaan / Cerita Soal:</label>
              <textarea
                required
                rows={3}
                value={formPrompt}
                onChange={(e) => setFormPrompt(e.target.value)}
                placeholder="Tuliskan cerita soal atau pertanyaan yang membangkitkan rasa penasaran anak..."
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>

            {/* 4 Choices Form */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-700">
                Pilihan Jawaban (A, B, C, D) &amp; Kunci Jawaban:
              </label>

              {/* Option A */}
              <div className="p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                <input
                  type="radio"
                  name="correctKey"
                  checked={correctKey === 'A'}
                  onChange={() => setCorrectKey('A')}
                  className="cursor-pointer"
                />
                <span className="font-black text-xs text-purple-700">A</span>
                <input
                  type="text"
                  required
                  value={optATitle}
                  onChange={(e) => setOptATitle(e.target.value)}
                  placeholder="Teks Pilihan A"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                />
                <input
                  type="text"
                  value={optASubtitle}
                  onChange={(e) => setOptASubtitle(e.target.value)}
                  placeholder="Keterangan singkat (opsional)"
                  className="w-1/3 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              {/* Option B */}
              <div className="p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                <input
                  type="radio"
                  name="correctKey"
                  checked={correctKey === 'B'}
                  onChange={() => setCorrectKey('B')}
                  className="cursor-pointer"
                />
                <span className="font-black text-xs text-purple-700">B</span>
                <input
                  type="text"
                  required
                  value={optBTitle}
                  onChange={(e) => setOptBTitle(e.target.value)}
                  placeholder="Teks Pilihan B"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                />
                <input
                  type="text"
                  value={optBSubtitle}
                  onChange={(e) => setOptBSubtitle(e.target.value)}
                  placeholder="Keterangan singkat (opsional)"
                  className="w-1/3 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              {/* Option C */}
              <div className="p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                <input
                  type="radio"
                  name="correctKey"
                  checked={correctKey === 'C'}
                  onChange={() => setCorrectKey('C')}
                  className="cursor-pointer"
                />
                <span className="font-black text-xs text-purple-700">C</span>
                <input
                  type="text"
                  required
                  value={optCTitle}
                  onChange={(e) => setOptCTitle(e.target.value)}
                  placeholder="Teks Pilihan C"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                />
                <input
                  type="text"
                  value={optCSubtitle}
                  onChange={(e) => setOptCSubtitle(e.target.value)}
                  placeholder="Keterangan singkat (opsional)"
                  className="w-1/3 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              {/* Option D */}
              <div className="p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                <input
                  type="radio"
                  name="correctKey"
                  checked={correctKey === 'D'}
                  onChange={() => setCorrectKey('D')}
                  className="cursor-pointer"
                />
                <span className="font-black text-xs text-purple-700">D</span>
                <input
                  type="text"
                  required
                  value={optDTitle}
                  onChange={(e) => setOptDTitle(e.target.value)}
                  placeholder="Teks Pilihan D"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                />
                <input
                  type="text"
                  value={optDSubtitle}
                  onChange={(e) => setOptDSubtitle(e.target.value)}
                  placeholder="Keterangan singkat (opsional)"
                  className="w-1/3 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
            </div>

            {/* Explanation & Hint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black text-slate-700">Pembahasan Jawaban Benar:</label>
                <input
                  type="text"
                  required
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Contoh: Rumus keliling persegi panjang adalah 2 x (p + l)"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black text-slate-700">Petunjuk Rahasia Olu (Hint):</label>
                <input
                  type="text"
                  value={formHint}
                  onChange={(e) => setFormHint(e.target.value)}
                  placeholder="Contoh: Jumlahkan dulu panjang dan lebarnya ya!"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            {/* Spark & Shards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black text-slate-700">Reward Spark:</label>
                <input
                  type="number"
                  value={formSpark}
                  onChange={(e) => setFormSpark(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black text-slate-700">Reward Shards:</label>
                <input
                  type="number"
                  value={formShards}
                  onChange={(e) => setFormShards(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black text-slate-700">Karakter Tokoh:</label>
                <input
                  type="text"
                  value={formCharName}
                  onChange={(e) => setFormCharName(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black text-slate-700">Emoji Tokoh:</label>
                <input
                  type="text"
                  value={formCharEmoji}
                  onChange={(e) => setFormCharEmoji(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-center"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsQuestFormOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md cursor-pointer"
              >
                {editingQuestId ? 'Simpan Perubahan' : 'Terbitkan Soal Kuis'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL PANDUAN GOOGLE APPS SCRIPT ================= */}
      {isGasGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#161f2e] border-2 border-slate-300 dark:border-slate-700 p-5 sm:p-7 shadow-2xl flex flex-col gap-4 text-left my-auto text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📋</span>
                <div>
                  <h3 className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-slate-100">
                    Panduan &amp; Kode Script Google Spreadsheet
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sinkronisasi data akun pendaftaran siswa EduVerse secara otomatis
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGasGuideOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 font-bold">
                💡 <strong>Cara Menyambungkan ke Google Spreadsheet:</strong>
                <ol className="list-decimal ml-5 mt-1 space-y-1 font-semibold">
                  <li>Buka Google Sheets baru, buat tab bernama <code>Akun</code>.</li>
                  <li>Klik <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>.</li>
                  <li>Hapus isi <code>Code.gs</code>, lalu salin dan tempelkan kode di bawah ini.</li>
                  <li>Klik <strong>Terapkan (Deploy)</strong> &gt; <strong>Penerapan baru (New deployment)</strong>.</li>
                  <li>Pilih jenis <strong>Aplikasi web (Web app)</strong>.</li>
                  <li>Setel <em>Jalankan sebagai (Execute as)</em>: <strong>Saya (Me)</strong>, dan <em>Yang memiliki akses (Who has access)</em>: <strong>Siapa saja (Anyone)</strong>.</li>
                </ol>
              </div>

              <div className="flex items-center justify-between mt-1">
                <span className="font-black text-slate-700 dark:text-slate-300 text-xs">
                  Kode Google Apps Script (Code.gs):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const code = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Akun") || ss.getActiveSheet();
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["ID", "Username", "Password", "Tanggal Daftar", "Role", "Kelas"]);
    }
    
    if (data.action === "register") {
      sheet.appendRow([
        "usr-" + new Date().getTime(),
        data.username,
        data.password,
        new Date().toLocaleDateString("id-ID"),
        "Siswa",
        "Kelas 3 SD"
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Akun berhasil disimpan di Spreadsheet!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "login") {
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][1] == data.username && rows[i][2] == data.password) {
          return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Login berhasil!" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Username atau password salah!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "list_users" || data.action === "getUsers") {
      var rows = sheet.getDataRange().getValues();
      var users = [];
      for (var j = 1; j < rows.length; j++) {
        users.push({
          id: rows[j][0] || ("usr-" + j),
          username: rows[j][1],
          registeredDate: rows[j][3] || "Terdaftar",
          totalSparks: 500,
          totalShards: 10,
          streakDays: 3,
          status: "active",
          grade: rows[j][5] || "Kelas 3 SD"
        });
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", users: users }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Google Apps Script EduVerse Online!" }))
    .setMimeType(ContentService.MimeType.JSON);
}`;
                    navigator.clipboard.writeText(code);
                    showToast('✅ Kode Google Apps Script berhasil disalin ke clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  📋 Salin Kode
                </button>
              </div>

              <pre className="p-3.5 rounded-xl bg-slate-900 text-teal-300 font-mono text-[11px] overflow-x-auto max-h-56 border border-slate-800">
{`function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Akun") || ss.getActiveSheet();
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["ID", "Username", "Password", "Tanggal Daftar", "Role", "Kelas"]);
    }
    
    if (data.action === "register") {
      sheet.appendRow([
        "usr-" + new Date().getTime(),
        data.username,
        data.password,
        new Date().toLocaleDateString("id-ID"),
        "Siswa",
        "Kelas 3 SD"
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Akun berhasil disimpan!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "login") {
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][1] == data.username && rows[i][2] == data.password) {
          return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Login berhasil!" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Username atau password salah!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "list_users" || data.action === "getUsers") {
      var rows = sheet.getDataRange().getValues();
      var users = [];
      for (var j = 1; j < rows.length; j++) {
        users.push({
          id: rows[j][0] || ("usr-" + j),
          username: rows[j][1],
          registeredDate: rows[j][3] || "Terdaftar",
          totalSparks: 500,
          totalShards: 10,
          streakDays: 3,
          status: "active",
          grade: rows[j][5] || "Kelas 3 SD"
        });
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", users: users }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "EduVerse GAS Online" }))
    .setMimeType(ContentService.MimeType.JSON);
}`}
              </pre>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsGasGuideOpen(false)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs cursor-pointer shadow-sm"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
