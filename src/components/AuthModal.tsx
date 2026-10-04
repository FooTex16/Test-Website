import React, { useState } from 'react';
import { playSoundEffect, playTTS } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string, isAdmin: boolean) => void;
  initialMode?: 'hook' | 'login' | 'register';
  currentSparks?: number;
  currentShards?: number;
}

const GAS_ENDPOINT_URL =
  'https://script.google.com/macros/s/AKfycbzKdfd9BvndyAVd_9CzdFt3vX3Rk37iGLqwkCPCVO8sQmiLNRtaVqzdsON66tJH2T92/exec';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'hook',
  currentSparks = 510,
  currentShards = 12,
}) => {
  const [view, setView] = useState<'hook' | 'form'>(initialMode === 'hook' ? 'hook' : 'form');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    initialMode === 'register' ? 'register' : 'login'
  );

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Validation
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isRegisterValid =
    username.trim().length >= 3 &&
    password.length >= 3 &&
    passwordsMatch;

  const isLoginValid = username.trim().length > 0 && password.length > 0;

  // Function to call GAS endpoint via proxy or direct
  const callGoogleSheetsAuth = async (action: 'register' | 'login', user: string, pass: string) => {
    // 1. Try our full-stack Express relay first (avoids any browser CORS issues)
    try {
      const relayRes = await fetch('/api/auth/google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, username: user, password: pass }),
      });
      if (relayRes.ok) {
        const data = await relayRes.json();
        return data;
      }
    } catch {
      // Fall through to direct fetch
    }

    // 2. Direct browser fetch to Google Apps Script
    const targetUrl = new URL(GAS_ENDPOINT_URL);
    targetUrl.searchParams.set('action', action);
    targetUrl.searchParams.set('username', user);
    targetUrl.searchParams.set('password', pass);

    const directRes = await fetch(targetUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action, username: user, password: pass }),
    });

    const text = await directRes.text();
    try {
      return JSON.parse(text);
    } catch {
      const isSuccess = text.toLowerCase().includes('success') || text.toLowerCase().includes('berhasil');
      return { status: isSuccess ? 'success' : 'info', message: text };
    }
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginValid || isLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    playSoundEffect('click');

    const cleanUser = username.trim();

    // 4. HARDCODED ADMIN BYPASS
    if (cleanUser === 'DeepCrips' && password === 'Admin') {
      playSoundEffect('fanfare');
      playTTS('Mode Pemantau Aktif! Selamat datang, Admin DeepCrips!');
      onLoginSuccess('DeepCrips', true);
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const result = await callGoogleSheetsAuth('login', cleanUser, password);

      // Check success response
      const isSuccess =
        result?.status === 'success' ||
        result?.result === 'success' ||
        result?.success === true ||
        (typeof result?.message === 'string' &&
          (result.message.toLowerCase().includes('berhasil') ||
            result.message.toLowerCase().includes('success')));

      if (isSuccess) {
        playSoundEffect('fanfare');
        playTTS(`Selamat datang kembali, Kapten ${cleanUser}! Progres petualanganmu aman!`);
        onLoginSuccess(cleanUser, false);
        onClose();
      } else {
        playSoundEffect('hint');
        const msg =
          result?.message ||
          'Username atau password belum cocok di database Google Sheets. Coba periksa kembali ya, Kapten!';
        setErrorMessage(msg);
      }
    } catch (err: any) {
      playSoundEffect('hint');
      setErrorMessage(
        'Terjadi kendala saat menyambung ke server Google Sheets. Silakan coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegisterValid || isLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    playSoundEffect('click');

    const cleanUser = username.trim();

    setIsLoading(true);
    try {
      const result = await callGoogleSheetsAuth('register', cleanUser, password);

      const isSuccess =
        result?.status === 'success' ||
        result?.result === 'success' ||
        result?.success === true ||
        (typeof result?.message === 'string' &&
          (result.message.toLowerCase().includes('berhasil') ||
            result.message.toLowerCase().includes('success')));

      if (isSuccess || !result?.status || result?.status === 'info') {
        playSoundEffect('correct');
        playTTS(`Hore! Pendaftaran akun Kapten ${cleanUser} berhasil tersimpan di sistem EduVerse!`);
        setSuccessMessage('🎉 Pendaftaran Berhasil! Akunmu telah tersimpan. Silakan klik Masuk.');

        // === Simpan user baru ke localStorage agar Admin Dashboard langsung melihatnya ===
        try {
          const today = new Date();
          const dateStr = today.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
          const newUser = {
            id: `usr-${Date.now()}`,
            username: cleanUser,
            registeredDate: dateStr,
            totalSparks: 0,
            totalShards: 0,
            streakDays: 0,
            status: 'active',
            grade: 'Kelas 1 SD',
          };
          const savedUsers = localStorage.getItem('eduverse_admin_users');
          const existingUsers = savedUsers ? JSON.parse(savedUsers) : [];
          const alreadyExists = existingUsers.some((u: { username: string }) => u.username === cleanUser);
          if (!alreadyExists) {
            localStorage.setItem('eduverse_admin_users', JSON.stringify([...existingUsers, newUser]));
          }
        } catch { /* non-critical */ }
        // ==================================================================================

        // Auto switch to login tab
        setTimeout(() => {
          setActiveTab('login');
          setSuccessMessage(null);
        }, 1800);

      } else {
        playSoundEffect('hint');
        const msg =
          result?.message ||
          'Pendaftaran belum berhasil. Kemungkinan username sudah terdaftar di Google Sheets.';
        setErrorMessage(msg);
      }
    } catch (err: any) {
      playSoundEffect('hint');
      setErrorMessage('Gagal menghubungi Google Sheets. Silakan periksa jaringan dan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in"
    >
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white border-4 border-primary-container p-5 sm:p-7 shadow-2xl flex flex-col gap-4 text-left my-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-black text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer z-10"
          title="Tutup Modal"
        >
          ✕
        </button>

        {/* 1. HOOK PRINCIPLE VIEW (Main Dulu, Login Kemudian) */}
        {view === 'hook' ? (
          <div className="flex flex-col items-center text-center gap-4 py-2">
            {/* Celebration Icon */}
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-secondary to-primary-container flex items-center justify-center text-5xl shadow-lg animate-float">
                🌟
              </div>
              <span className="absolute -bottom-2 -right-2 text-2xl animate-bounce">
                🚀
              </span>
            </div>

            {/* Motivational Persuasive Headline & Text */}
            <div className="flex flex-col gap-2 max-w-md">
              <span className="px-3.5 py-1 rounded-full bg-primary-fixed text-on-primary-container font-black text-xs uppercase tracking-wide self-center">
                Misi Berhasil Diselesaikan!
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-on-surface leading-tight">
                Wah, Kapten Hebat Sekali! 🌟
              </h2>
              <p className="font-bold text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Sayang banget kalau poin <strong className="text-amber-700">Spark (✨)</strong> dan{' '}
                <strong className="text-primary">Star Shards (💎)</strong> kamu hilang. Yuk, simpan
                progres petualanganmu dengan membuat akun atau masuk ke kapalmu!
              </p>
            </div>

            {/* Spark & Shards Pill Indicator */}
            <div className="flex items-center gap-2.5 bg-surface-container-low px-4 py-2 rounded-2xl border-2 border-surface-container-high">
              <span className="flex items-center gap-1 font-black text-sm text-amber-800">
                <span>✨</span> {currentSparks} Spark
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-black text-sm text-primary">
                <span>💎</span> {currentShards} Shards
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-extrabold text-secondary">Siap Disimpan!</span>
            </div>

            {/* Two Big Chunky Action Buttons */}
            <div className="flex flex-col gap-3 w-full pt-2">
              <button
                onClick={() => {
                  playSoundEffect('click');
                  setView('form');
                  setActiveTab('register');
                }}
                className="btn-tactile-teal min-h-[58px] w-full flex items-center justify-center gap-2.5 text-base sm:text-lg font-black"
              >
                <span>🚀</span>
                <span>Buat Akun Baru (Daftar)</span>
              </button>

              <button
                onClick={() => {
                  playSoundEffect('click');
                  setView('form');
                  setActiveTab('login');
                }}
                className="btn-tactile-white min-h-[56px] w-full flex items-center justify-center gap-2 text-base font-black text-secondary"
              >
                <span>🔑</span>
                <span>Sudah Punya Akun (Masuk)</span>
              </button>
            </div>

            {/* Soft skip button for kid autonomy */}
            <button
              onClick={onClose}
              className="text-xs font-bold text-on-surface-variant hover:text-on-surface underline pt-1 cursor-pointer"
            >
              Nanti Saja, Lanjut Main Dulu ➔
            </button>
          </div>
        ) : (
          /* 2. FORMULIR LOGIN / REGISTER MODAL */
          <div className="flex flex-col gap-4">
            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center text-2xl shadow-sm">
                {activeTab === 'register' ? '📝' : '🚀'}
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-on-surface">
                  {activeTab === 'register' ? 'Daftar Akun Penjelajah' : 'Masuk ke Kapal EduVerse'}
                </h3>
                <p className="text-xs font-bold text-on-surface-variant">
                  Tersinkronisasi otomatis dengan Google Sheets Database
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-1.5 rounded-2xl border-2 border-surface-container-high">
              <button
                type="button"
                onClick={() => {
                  playSoundEffect('click');
                  setActiveTab('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-secondary text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                🔑 Masuk (Login)
              </button>
              <button
                type="button"
                onClick={() => {
                  playSoundEffect('click');
                  setActiveTab('register');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                🚀 Buat Akun (Register)
              </button>
            </div>

            {/* Notification Alerts */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs font-bold flex items-start gap-2 animate-in fade-in">
                <span className="text-base">⚠️</span>
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs font-bold flex items-start gap-2 animate-in fade-in">
                <span className="text-base">🎉</span>
                <span className="leading-snug">{successMessage}</span>
              </div>
            )}

            {/* FORM MASUK (LOGIN) */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black text-on-surface">
                    Nama Akun / Username:
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: Rara atau DeepCrips"
                    className="px-4 py-3 rounded-2xl border-2 border-surface-container-high focus:border-secondary focus:ring-0 font-bold text-sm text-on-surface"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black text-on-surface">
                    Kata Sandi (Password):
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="px-4 py-3 rounded-2xl border-2 border-surface-container-high focus:border-secondary focus:ring-0 font-bold text-sm text-on-surface"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isLoginValid || isLoading}
                  className="btn-tactile-purple min-h-[54px] w-full flex items-center justify-center gap-2 text-base font-black disabled:opacity-50 mt-1"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin text-lg">⚙️</span>
                      <span>Mencocokkan ke Google Sheets...</span>
                    </>
                  ) : (
                    <>
                      <span>🔑</span>
                      <span>Masuk ke Akun Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORM DAFTAR (REGISTER) */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black text-on-surface">
                    Pilih Username Kapten:
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nama panggilan ceriamu (min. 3 huruf)"
                    className="px-4 py-3 rounded-2xl border-2 border-surface-container-high focus:border-primary-container focus:ring-0 font-bold text-sm text-on-surface"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black text-on-surface">
                    Kata Sandi Rahasia (Password):
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Buat kata sandi mudah diingat..."
                    className="px-4 py-3 rounded-2xl border-2 border-surface-container-high focus:border-primary-container focus:ring-0 font-bold text-sm text-on-surface"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black text-on-surface">
                    Ulangi Kata Sandi (Konfirmasi):
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik kembali kata sandi di atas..."
                    className={`px-4 py-3 rounded-2xl border-2 focus:ring-0 font-bold text-sm text-on-surface ${
                      confirmPassword.length > 0
                        ? passwordsMatch
                          ? 'border-emerald-400 bg-emerald-50/30'
                          : 'border-rose-400 bg-rose-50/30'
                        : 'border-surface-container-high focus:border-primary-container'
                    }`}
                  />
                  {/* Validation notice */}
                  {confirmPassword.length > 0 && (
                    <span
                      className={`text-[11px] font-black mt-0.5 ${
                        passwordsMatch ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {passwordsMatch
                        ? '✓ Kata sandi cocok dan siap didaftarkan!'
                        : '⚠️ Kata sandi konfirmasi belum sama! Silakan periksa kembali.'}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isRegisterValid || isLoading}
                  className="btn-tactile-teal min-h-[54px] w-full flex items-center justify-center gap-2 text-base font-black disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin text-lg">⚙️</span>
                      <span>Mendaftarkan ke Google Sheets...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Simpan Akun &amp; Daftar Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Hook button if child wants */}
            <div className="flex items-center justify-between pt-2 border-t border-surface-container text-xs font-bold text-on-surface-variant">
              <button
                type="button"
                onClick={() => setView('hook')}
                className="hover:text-primary underline cursor-pointer"
              >
                ← Kembali ke Pilihan Hadiah
              </button>
              <span>100% Aman &amp; Bebas Iklan</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
