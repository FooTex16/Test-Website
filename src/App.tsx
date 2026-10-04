import React, { useState, useEffect } from 'react';
import { StudentProfile, Quest } from './types';
import { INITIAL_STUDENT_PROFILE, QUESTS_DATA } from './data/eduverseData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WorldsExplorer } from './components/WorldsExplorer';
import { QuestSimulationSection } from './components/QuestSimulationSection';
import { MiniGamesHub } from './components/MiniGames/MiniGamesHub';
import { CityBaseView } from './components/EduVerseCity/CityBaseView';
import { StoryVerseModal } from './components/StoryVerse/StoryVerseModal';
import { DiscoveryLabModal } from './components/DiscoveryLab/DiscoveryLabModal';
import { AdultGateModal } from './components/AdultGateModal';
import { MedalsModal } from './components/MedalsModal';
import { OluChatModal } from './components/OluChatModal';
import { QuestPlayerModal } from './components/QuestPlayerModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { ScreenTimeAlert } from './components/ScreenTimeAlert';
import { Footer } from './components/Footer';
import { playSoundEffect, playTTS } from './utils/audio';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('eduverse_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_STUDENT_PROFILE;
      }
    }
    return INITIAL_STUDENT_PROFILE;
  });

  // Dynamic Quests state (allows Admin to add/edit/delete questions)
  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('eduverse_custom_quests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return QUESTS_DATA;
      }
    }
    return QUESTS_DATA;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher' | 'parent'>('student');
  const [isAdultGateOpen, setIsAdultGateOpen] = useState(false);
  const [isMedalsOpen, setIsMedalsOpen] = useState(false);
  const [isOluChatOpen, setIsOluChatOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);

  // Authentication & Hook Principle states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'hook' | 'login' | 'register'>('hook');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authUsername, setAuthUsername] = useState('Rara');

  // Screen time tracking
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [screenTimeLimit, setScreenTimeLimit] = useState(25);
  const [showScreenTimeAlert, setShowScreenTimeAlert] = useState(false);

  // Load saved auth session on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('eduverse_auth_user');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed.username) {
          setIsLoggedIn(true);
          const adminFlag = Boolean(parsed.isAdmin) || parsed.username === 'DeepCrips';
          setIsAdmin(adminFlag);
          setAuthUsername(parsed.username);
        }
      } catch (e) {
        console.error('Failed to parse saved auth:', e);
      }
    }
  }, []);

  // Save profile changes
  useEffect(() => {
    localStorage.setItem('eduverse_student_profile', JSON.stringify(profile));
  }, [profile]);

  // Session timer ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionMinutes((prev) => {
        const next = prev + 1;
        if (next >= screenTimeLimit && next % screenTimeLimit === 0) {
          setShowScreenTimeAlert(true);
        }
        return next;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [screenTimeLimit]);

  const handleUpdateQuests = (newQuests: Quest[]) => {
    setQuests(newQuests);
    localStorage.setItem('eduverse_custom_quests', JSON.stringify(newQuests));
  };

  const handleEarnRewards = (sparkDelta: number, shardDelta: number = 0) => {
    setProfile((prev) => {
      const nextSparks = prev.sparks + sparkDelta;
      const nextShards = prev.starShards + shardDelta;

      const nextMedals = [...prev.unlockedMedalIds];
      if (nextSparks >= 500 && !nextMedals.includes('penakluk-numeria')) {
        nextMedals.push('penakluk-numeria');
      }
      if (nextSparks >= 600 && !nextMedals.includes('penjelajah-mikrokosmos')) {
        nextMedals.push('penjelajah-mikrokosmos');
      }

      return {
        ...prev,
        sparks: nextSparks,
        starShards: nextShards,
        unlockedMedalIds: nextMedals,
        dailyExpedition: {
          ...prev.dailyExpedition,
          questDone: true,
        },
      };
    });
  };

  const handleCompleteQuest = (questId: string, spark: number, shard: number) => {
    setProfile((prev) => ({
      ...prev,
      completedQuestIds: Array.from(new Set([...prev.completedQuestIds, questId])),
    }));
    handleEarnRewards(spark, shard);
  };

  const handleUpgradeBuilding = (buildingId: string, cost: number) => {
    if (profile.starShards >= cost) {
      setProfile((prev) => ({
        ...prev,
        starShards: prev.starShards - cost,
      }));
    }
  };

  const handleUnlockBuilding = (buildingId: string, cost: number) => {
    if (profile.starShards >= cost) {
      setProfile((prev) => ({
        ...prev,
        starShards: prev.starShards - cost,
        unlockedBuildingIds: [...prev.unlockedBuildingIds, buildingId],
      }));
    }
  };

  const handleOpenQuestForWorld = (worldId: string) => {
    const matched = quests.find((q) => q.worldId === worldId) || quests[0];
    setActiveQuest(matched);
    setIsQuestModalOpen(true);
  };

  // Login Success Handler
  const handleLoginSuccess = (user: string, admin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
    setAuthUsername(user);

    if (!admin) {
      setProfile((prev) => ({
        ...prev,
        name: user,
        title: 'Kapten Terdaftar',
      }));
    }

    localStorage.setItem(
      'eduverse_auth_user',
      JSON.stringify({ username: user, isAdmin: admin, loginTime: Date.now() })
    );
  };

  const handleLogout = () => {
    playSoundEffect('click');
    playTTS('Akun berhasil keluar dengan aman.');
    localStorage.removeItem('eduverse_auth_user');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setAuthUsername('Rara');
    setCurrentRole('student');
    setProfile((prev) => ({
      ...prev,
      name: 'Rara',
      title: 'Kapten Bintang',
    }));
  };

  // ================= ROUTE 1: ADMIN DEDICATED DASHBOARD =================
  // If user is Admin (DeepCrips), completely hide student home and show Admin Control Panel!
  if (isAdmin) {
    return (
      <AdminDashboard
        quests={quests}
        onUpdateQuests={handleUpdateQuests}
        onLogoutAdmin={handleLogout}
      />
    );
  }

  // ================= ROUTE 2: TEACHER DASHBOARD =================
  if (currentRole === 'teacher') {
    return (
      <TeacherDashboard onBackToStudent={() => setCurrentRole('student')} />
    );
  }

  // ================= ROUTE 3: PARENT DASHBOARD =================
  if (currentRole === 'parent') {
    return (
      <ParentDashboard
        onBackToStudent={() => setCurrentRole('student')}
        screenTimeLimit={screenTimeLimit}
        onSetScreenTimeLimit={setScreenTimeLimit}
      />
    );
  }

  // ================= ROUTE 4: STUDENT EXPERIENCE (DEFAULT & GAMIFIED) =================
  return (
    <div className="min-h-screen bg-surface flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-container">
      {/* Accessible Responsive Header with 3 Blocks & Hamburger Menu */}
      <Header
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdultGate={() => setIsAdultGateOpen(true)}
        onOpenMedals={() => setIsMedalsOpen(true)}
        onOpenCity={() => setActiveTab('city')}
        onOpenOlu={() => setIsOluChatOpen(true)}
        sessionMinutes={sessionMinutes}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        authUsername={authUsername}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      <main className="w-full pt-20 flex-1">
        {/* TAB 1: HOME VIEW */}
        {activeTab === 'home' && (
          <>
            <HeroSection
              onStartAdventure={() => {
                const el = document.getElementById('dunia-belajar');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onTryMission={() => {
                const el = document.getElementById('simulasi-misi');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenOlu={() => setIsOluChatOpen(true)}
            />

            {/* 7 Learning Worlds with Phase Tabs */}
            <WorldsExplorer
              onSelectWorld={(w) => handleOpenQuestForWorld(w.id)}
              onOpenQuestForWorld={handleOpenQuestForWorld}
            />

            {/* Interactive Inline Quest Simulation (Hook Principle: Main Dulu, Login Kemudian) */}
            <QuestSimulationSection
              onEarnRewards={(spark, shard) => handleEarnRewards(spark, shard)}
              onExploreMoreQuests={() => {
                const secondQuest = quests[1] || quests[0];
                setActiveQuest(secondQuest);
                setIsQuestModalOpen(true);
              }}
              onQuizCompleted={() => {
                // Trigger Hook Principle pop-up if user is not logged in yet
                if (!isLoggedIn) {
                  setAuthModalMode('hook');
                  setIsAuthModalOpen(true);
                }
              }}
            />

            {/* Ask Olu Dialogue Stage */}
            <section className="w-full px-4 sm:px-6 py-10 bg-surface">
              <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-surface-container-low to-[#dff3ee] border-3 border-surface-container-high p-6 sm:p-8 shadow-[0_8px_0_#d6e2f8] flex flex-col md:flex-row items-center gap-6 sm:gap-8 text-left">
                {/* Olu Avatar */}
                <div className="flex flex-col items-center text-center gap-2 shrink-0">
                  <div
                    onClick={() => setIsOluChatOpen(true)}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-primary-container border-4 border-white shadow-[0_6px_0_#009a7d] flex items-center justify-center text-5xl sm:text-6xl relative cursor-pointer animate-float"
                  >
                    🤖
                    <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-black text-[11px] border border-[#dba500]">
                      ✨ Teman SD
                    </span>
                  </div>
                  <span className="font-display text-lg font-black text-on-surface">
                    Olu Penjelajah
                  </span>
                  <span className="text-xs font-extrabold text-primary">
                    Sabar &amp; Menyenangkan
                  </span>
                </div>

                {/* Chat Interaction */}
                <div className="flex-1 flex flex-col gap-4 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl sm:text-2xl font-black text-on-surface">
                      Ingin Tahu Sesuatu? Tanya Olu!
                    </h3>
                    <button
                      onClick={() => {
                        playSoundEffect('click');
                        playTTS(
                          'Cahaya matahari terdiri dari aneka warna pelangi! Udara di bumi menyebarkan warna biru lebih kuat, jadi langit kita terlihat biru indah! Di Galaksi Sains kita bisa membuat pelangi sendiri lho!'
                        );
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-surface-container-high text-xs font-bold text-primary hover:bg-surface-container-low cursor-pointer"
                    >
                      <span>🔊</span>
                      <span>Dengarkan</span>
                    </button>
                  </div>

                  {/* Answer Box */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-surface-container-high shadow-sm">
                    <p className="text-sm sm:text-base font-bold text-on-surface leading-relaxed">
                      "Cahaya matahari terdiri dari aneka warna pelangi! Udara di bumi menyebarkan warna biru lebih kuat, jadi langit kita terlihat biru indah! Di Galaksi Sains kita bisa membuat pelangi sendiri lho!"
                    </p>
                  </div>

                  {/* Quick Question Buttons for Kids */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        playSoundEffect('click');
                        playTTS(
                          'Cahaya matahari memiliki aneka warna pelangi dan warna biru paling kuat dihamburkan di atmosfer bumi!'
                        );
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-on-surface font-extrabold text-xs sm:text-sm border-2 border-surface-container-high shadow-sm active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      🌤️ Kenapa langit biru?
                    </button>
                    <button
                      onClick={() => {
                        playSoundEffect('click');
                        playTTS(
                          'Jangan takut salah! Di EduVerse, salah adalah tanda bahwa otak kita sedang belajar dan bertumbuh!'
                        );
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-on-surface font-extrabold text-xs sm:text-sm border-2 border-surface-container-high shadow-sm active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      🍕 Aku takut salah pecahan...
                    </button>
                    <button
                      onClick={() => setIsOluChatOpen(true)}
                      className="px-4 py-2 rounded-xl bg-secondary text-white font-extrabold text-xs sm:text-sm shadow-sm active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Tulis Pertanyaan Lainnya</span>
                      <span>➔</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Mini Games Hub */}
            <MiniGamesHub onEarnRewards={handleEarnRewards} />

            {/* EduVerse City View */}
            <CityBaseView
              starShards={profile.starShards}
              unlockedBuildingIds={profile.unlockedBuildingIds}
              onUpgradeBuilding={handleUpgradeBuilding}
              onUnlockBuilding={handleUnlockBuilding}
            />

            {/* Story & Discovery Teaser Strip */}
            <section className="w-full px-4 sm:px-6 py-8 bg-surface">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border-3 border-amber-200 shadow-sm flex flex-col justify-between gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2.5 rounded-2xl bg-white shadow-sm">📖</span>
                    <div>
                      <h4 className="font-display font-black text-lg text-amber-950">
                        StoryVerse: Dongeng Nusantara Bersuara
                      </h4>
                      <p className="text-xs font-bold text-amber-800">
                        Baca kisah Kancil Bintang &amp; Legenda Danau Toba dengan pemutar audio!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      playSoundEffect('click');
                      setIsStoryModalOpen(true);
                    }}
                    className="btn-tactile-yellow min-h-[46px] w-full text-xs font-black cursor-pointer"
                  >
                    Buka Perpustakaan Dongeng ➔
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-50 to-emerald-50 border-3 border-teal-200 shadow-sm flex flex-col justify-between gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2.5 rounded-2xl bg-white shadow-sm">🧪</span>
                    <div>
                      <h4 className="font-display font-black text-lg text-teal-950">
                        Discovery Lab: Rahasia Alam Semesta
                      </h4>
                      <p className="text-xs font-bold text-teal-800">
                        Mengapa daun hijau? Kenapa gurita punya 3 jantung? Temukan di sini!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      playSoundEffect('click');
                      setIsDiscoveryModalOpen(true);
                    }}
                    className="btn-tactile-teal min-h-[46px] w-full text-xs font-black cursor-pointer"
                  >
                    Buka Discovery Lab ➔
                  </button>
                </div>
              </div>
            </section>

            {/* Final CTA Strip */}
            <section className="w-full px-4 sm:px-6 py-10 bg-surface">
              <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-primary via-primary-container to-secondary p-6 sm:p-10 text-white shadow-[0_10px_0_#005140] flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
                <div className="flex flex-col gap-2 text-center sm:text-left max-w-xl">
                  <span className="px-3.5 py-1 rounded-full bg-white text-primary font-black text-xs uppercase tracking-wide self-center sm:self-start">
                    🚀 Petualangan Gratis
                  </span>
                  <h2 className="font-display text-2xl sm:text-4xl font-extrabold leading-tight">
                    Siap Lanjutkan Ekspedisimu Hari Ini?
                  </h2>
                  <p className="text-sm sm:text-base font-bold opacity-90">
                    Ayo bergabung bersama sahabat penjelajah cilik di seluruh Indonesia!
                  </p>
                </div>
                <button
                  onClick={() => {
                    playSoundEffect('click');
                    if (!isLoggedIn) {
                      setAuthModalMode('register');
                      setIsAuthModalOpen(true);
                    } else {
                      handleOpenQuestForWorld('numeria');
                    }
                  }}
                  className="min-h-[58px] inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed font-black text-base sm:text-lg border-2 border-[#dba500] shadow-[0_6px_0_#dba500] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all shrink-0 cursor-pointer"
                >
                  <span>🚀</span>
                  <span>{isLoggedIn ? 'LANJUTKAN MISI' : 'DAFTAR — 100% GRATIS'}</span>
                </button>
              </div>
            </section>
          </>
        )}

        {/* TAB 2: 7 WORLDS EXPLORER */}
        {activeTab === 'worlds' && (
          <WorldsExplorer
            onSelectWorld={(w) => handleOpenQuestForWorld(w.id)}
            onOpenQuestForWorld={handleOpenQuestForWorld}
          />
        )}

        {/* TAB 3: MINI GAMES */}
        {activeTab === 'games' && (
          <MiniGamesHub onEarnRewards={handleEarnRewards} />
        )}

        {/* TAB 4: STORYVERSE */}
        {activeTab === 'story' && (
          <div className="max-w-5xl mx-auto py-8 px-4 text-left">
            <div className="p-6 rounded-3xl bg-white border-2 border-surface-container-high shadow-sm flex flex-col gap-4">
              <h2 className="font-display text-2xl font-black text-on-surface">
                📖 StoryVerse: Dongeng Nusantara Bersuara
              </h2>
              <p className="text-sm font-bold text-on-surface-variant">
                Klik tombol di bawah untuk membuka pemutar buku cerita interaktif kami:
              </p>
              <button
                onClick={() => setIsStoryModalOpen(true)}
                className="btn-tactile-teal py-3 text-base flex items-center justify-center gap-2 max-w-sm cursor-pointer"
              >
                <span>Buka Pembaca Cerita</span>
                <span>📚</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: DISCOVERY LAB */}
        {activeTab === 'discovery' && (
          <div className="max-w-5xl mx-auto py-8 px-4 text-left">
            <div className="p-6 rounded-3xl bg-white border-2 border-surface-container-high shadow-sm flex flex-col gap-4">
              <h2 className="font-display text-2xl font-black text-on-surface">
                🧪 Discovery Lab &amp; Tahukah Kamu?
              </h2>
              <p className="text-sm font-bold text-on-surface-variant">
                Klik tombol di bawah untuk menjelajahi rahasia sains &amp; eksperimen rumahan:
              </p>
              <button
                onClick={() => setIsDiscoveryModalOpen(true)}
                className="btn-tactile-purple py-3 text-base flex items-center justify-center gap-2 max-w-sm cursor-pointer"
              >
                <span>Buka Discovery Lab</span>
                <span>🔬</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: EDUVERSE CITY */}
        {activeTab === 'city' && (
          <CityBaseView
            starShards={profile.starShards}
            unlockedBuildingIds={profile.unlockedBuildingIds}
            onUpgradeBuilding={handleUpgradeBuilding}
            onUnlockBuilding={handleUnlockBuilding}
          />
        )}
      </main>

      {/* Floating Olu Mascot Quick Trigger (Positioned safely to avoid blocking main content buttons) */}
      <button
        onClick={() => {
          playSoundEffect('click');
          setIsOluChatOpen(true);
        }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 p-2.5 sm:p-3 rounded-2xl bg-primary-container text-on-primary-container border-2 border-[#009a7d] shadow-[0_4px_0_#009a7d] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer animate-float"
        title="Bicara dengan Olu"
      >
        <span className="text-2xl sm:text-3xl">🤖</span>
        <div className="hidden lg:flex flex-col text-left">
          <span className="text-xs font-black">Tanya Olu</span>
          <span className="text-[9px] font-bold opacity-80 leading-none">Siap Bantu!</span>
        </div>
      </button>

      {/* Footer */}
      <Footer
        onOpenAdultGate={() => setIsAdultGateOpen(true)}
        onOpenMedals={() => setIsMedalsOpen(true)}
        onOpenOlu={() => setIsOluChatOpen(true)}
      />

      {/* Modals Suite */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        currentSparks={profile.sparks}
        currentShards={profile.starShards}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AdultGateModal
        isOpen={isAdultGateOpen}
        onClose={() => setIsAdultGateOpen(false)}
        onSelectRole={(role) => setCurrentRole(role)}
      />

      <MedalsModal
        isOpen={isMedalsOpen}
        onClose={() => setIsMedalsOpen(false)}
        profile={profile}
      />

      <OluChatModal
        isOpen={isOluChatOpen}
        onClose={() => setIsOluChatOpen(false)}
      />

      <StoryVerseModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        onEarnRewards={handleEarnRewards}
      />

      <DiscoveryLabModal
        isOpen={isDiscoveryModalOpen}
        onClose={() => setIsDiscoveryModalOpen(false)}
        onEarnRewards={(spark) => handleEarnRewards(spark, 2)}
      />

      <QuestPlayerModal
        quest={activeQuest}
        isOpen={isQuestModalOpen}
        onClose={() => setIsQuestModalOpen(false)}
        onCompleteQuest={handleCompleteQuest}
      />

      <ScreenTimeAlert
        isOpen={showScreenTimeAlert}
        onDismiss={() => setShowScreenTimeAlert(false)}
      />
    </div>
  );
}
