import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import {
  DEFAULT_REMINDERS,
  INITIAL_FUTURE_NOTE,
  formatDateToYMD,
  formatMonthKey,
} from './data/initialData';
import {
  DailyReminder,
  DiaryEntry,
  FutureNote,
  JournalEntry,
  MonthlyGoal,
  PageId,
} from './types/journal';
import { supabase } from './lib/supabase';
import { bloomRepository } from './services/bloomRepository';
import { Navigation } from './components/layout/Navigation';
import { HomePage } from './components/home/HomePage';
import { DailyJournalPage } from './components/journal/DailyJournalPage';
import { FreeDiaryPage } from './components/diary/FreeDiaryPage';
import { MonthlyGoalsPage } from './components/goals/MonthlyGoalsPage';
import { LoginPage } from './components/auth/LoginPage';

export function App() {
  const [now] = useState<Date>(() => new Date());
  const todayYMD = useMemo(() => formatDateToYMD(now), [now]);
  const currentMonthKey = useMemo(() => formatMonthKey(now), [now]);

  // State Autentikasi Supabase
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Navigasi Halaman (Home, Daily Journal, Free Diary, Monthly Goals)
  const [activePage, setActivePage] = useState<PageId>('home');
  const [isConnectedToSupabase, setIsConnectedToSupabase] =
    useState<boolean>(false);

  // State Pemilik Ruang Pribadi
  const [ownerName, setOwnerName] = useState<string>('Almira');

  // State 1: Daily Reminders & Future Note (Halaman Home)
  const [reminders, setReminders] = useState<DailyReminder[]>(DEFAULT_REMINDERS);
  const [activeReminderIndex, setActiveReminderIndex] = useState<number>(0);
  const [futureNote, setFutureNote] = useState<FutureNote>(INITIAL_FUTURE_NOTE);

  // State 2: Daily Journal Entries (Halaman Daily Journal)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // State 3: Free Diary Entries (Halaman tersendiri khusus Diary Bebas)
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  // State 4: Monthly Goals (Halaman Monthly Goals)
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>([]);
  const [selectedGoalMonthKey, setSelectedGoalMonthKey] =
    useState<string>(currentMonthKey);

  // Fungsi muat data pribadi hanya saat sesi terautentikasi
  const loadAuthenticatedData = useCallback(async () => {
    const data = await bloomRepository.fetchAllInitialData(now);
    setOwnerName(data.ownerName);
    setReminders(data.reminders);
    setFutureNote(data.futureNote);
    setJournalEntries(data.journalEntries);
    setDiaryEntries(data.diaryEntries);
    setMonthlyGoals(data.monthlyGoals);
    setIsConnectedToSupabase(data.isConnectedToSupabase);
  }, [now]);

  // Periksa sesi login saat aplikasi dibuka & dengarkan perubahan sesi (login/logout)
  useEffect(() => {
    if (!supabase) {
      setIsAuthChecking(false);
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMounted) return;
      setSession(currentSession);
      setIsAuthChecking(false);
      if (currentSession) {
        loadAuthenticatedData();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      if (nextSession) {
        loadAuthenticatedData();
      } else {
        // Bersihkan state pribadi di memori ketika logout
        setJournalEntries([]);
        setDiaryEntries([]);
        setMonthlyGoals([]);
        setActivePage('home');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadAuthenticatedData]);

  // Handler saat berhasil login dari halaman LoginPage -> arahkan ke Home
  const handleLoginSuccess = () => {
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler Logout -> akhiri sesi Supabase Auth dengan benar
  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setActivePage('home');
  };

  // Data turunan untuk indikator & ringkasan Home
  const todayEntries = useMemo(
    () => journalEntries.filter((entry) => entry.entry_date === todayYMD),
    [journalEntries, todayYMD]
  );

  const currentMonthGoals = useMemo(
    () => monthlyGoals.filter((goal) => goal.month_key === currentMonthKey),
    [monthlyGoals, currentMonthKey]
  );

  const currentMonthGoalsSummary = useMemo(
    () => ({
      completed: currentMonthGoals.filter((g) => g.is_completed).length,
      total: currentMonthGoals.length,
    }),
    [currentMonthGoals]
  );

  const handleNavigate = (page: PageId) => {
    const docWithTransition = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (typeof docWithTransition.startViewTransition === 'function') {
      docWithTransition.startViewTransition(() => {
        setActivePage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else {
      setActivePage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- HANDLERS HOME ---
  const handleUpdateOwnerName = async (newName: string) => {
    setOwnerName(newName);
    await bloomRepository.updateOwnerName(newName, futureNote);
  };

  const handleAddCustomReminder = async (payload: {
    category: DailyReminder['category'];
    text: string;
    subtext?: string;
  }) => {
    const created = await bloomRepository.createCustomReminder(payload);
    setReminders((prev) => [created, ...prev]);
    setActiveReminderIndex(0);
  };

  const handleUpdateReminder = async (
    id: string,
    payload: {
      category: DailyReminder['category'];
      text: string;
      subtext?: string;
    }
  ) => {
    const existing = reminders.find((r) => r.id === id);
    if (!existing) return;
    const updated = await bloomRepository.updateDailyReminder(existing, payload);
    setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const handleDeleteReminder = async (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    await bloomRepository.deleteDailyReminder(id);
  };

  const handleSaveFutureNote = async (
    updates: Pick<FutureNote, 'title' | 'content' | 'targetDateLabel'>
  ) => {
    const updated = await bloomRepository.updateFutureNote(
      futureNote,
      updates,
      ownerName
    );
    setFutureNote(updated);
  };

  // --- HANDLERS DAILY JOURNAL ---
  const handleCreateJournalEntry = async (
    payload: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>
  ) => {
    const newEntry = await bloomRepository.createJournalEntry(payload);
    setJournalEntries((prev) => [newEntry, ...prev]);
  };

  const handleUpdateJournalEntry = async (
    id: string,
    payload: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>
  ) => {
    const target = journalEntries.find((item) => item.id === id);
    if (!target) return;
    const updated = await bloomRepository.updateJournalEntry(target, payload);
    setJournalEntries((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
  };

  const handleDeleteJournalEntry = async (id: string) => {
    setJournalEntries((prev) => prev.filter((item) => item.id !== id));
    await bloomRepository.deleteJournalEntry(id);
  };

  // --- HANDLERS FREE DIARY ---
  const handleCreateDiaryEntry = async (
    payload: Omit<DiaryEntry, 'id' | 'created_at' | 'updated_at'>
  ) => {
    const newDiary = await bloomRepository.createDiaryEntry(payload);
    setDiaryEntries((prev) => [newDiary, ...prev]);
  };

  const handleUpdateDiaryEntry = async (
    id: string,
    payload: Omit<DiaryEntry, 'id' | 'created_at' | 'updated_at'>
  ) => {
    const target = diaryEntries.find((item) => item.id === id);
    if (!target) return;
    const updated = await bloomRepository.updateDiaryEntry(target, payload);
    setDiaryEntries((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
  };

  const handleTogglePinDiary = async (id: string) => {
    const target = diaryEntries.find((item) => item.id === id);
    if (!target) return;
    const updated = await bloomRepository.togglePinDiaryEntry(target);
    setDiaryEntries((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
  };

  const handleDeleteDiaryEntry = async (id: string) => {
    setDiaryEntries((prev) => prev.filter((item) => item.id !== id));
    await bloomRepository.deleteDiaryEntry(id);
  };

  // --- HANDLERS MONTHLY GOALS ---
  const handleAddGoal = async (
    payload: {
      month_key: string;
      title: string;
      description: string;
    }
  ) => {
    const created = await bloomRepository.createMonthlyGoal(payload);
    setMonthlyGoals((prev) => [...prev, created]);
  };

  const handleToggleGoal = async (id: string) => {
    const target = monthlyGoals.find((g) => g.id === id);
    if (!target) return;
    const nextState = !target.is_completed;
    setMonthlyGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, is_completed: nextState } : goal
      )
    );
    const updated = await bloomRepository.updateMonthlyGoal(target, {
      is_completed: nextState,
    });
    setMonthlyGoals((prev) =>
      prev.map((goal) => (goal.id === id ? updated : goal))
    );
  };

  const handleUpdateGoal = async (
    id: string,
    updates: { title: string; description: string }
  ) => {
    const target = monthlyGoals.find((g) => g.id === id);
    if (!target) return;
    const updated = await bloomRepository.updateMonthlyGoal(target, updates);
    setMonthlyGoals((prev) =>
      prev.map((goal) => (goal.id === id ? updated : goal))
    );
  };

  const handleDeleteGoal = async (id: string) => {
    setMonthlyGoals((prev) => prev.filter((goal) => goal.id !== id));
    await bloomRepository.deleteMonthlyGoal(id);
  };

  // Tampilan loading lembut saat memeriksa sesi login awal
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-50 via-cream-50 to-white flex items-center justify-center p-6 text-rosewood-700">
        <div className="flex flex-col items-center gap-3 animate-pulse-soft">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-bloom-300 shadow-bloom-sm">
            <img
              src="/eversoluna-avatar.png"
              alt="Eversoluna"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-serif text-xl text-rosewood-800">Eversoluna</p>
        </div>
      </div>
    );
  }

  // Lindungi semua halaman pribadi (Home, Daily Journal, Free Diary, Monthly Goals) jika belum login
  if (!session) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-50 via-cream-50 to-white text-rosewood-900">
      {/* Sidebar Desktop & Navigasi Mobile */}
      <Navigation
        activePage={activePage}
        onNavigate={handleNavigate}
        hasJournalToday={todayEntries.length > 0}
        diaryCount={diaryEntries.length}
        currentMonthGoalsSummary={currentMonthGoalsSummary}
        ownerName={ownerName}
        isConnectedToSupabase={isConnectedToSupabase}
        userEmail={session.user.email}
        onLogout={handleLogout}
      />

      {/* Area Konten Utama */}
      <div className="lg:pl-72 pb-24 lg:pb-12">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-10">
          {activePage === 'home' && (
            <HomePage
              now={now}
              ownerName={ownerName}
              onUpdateOwnerName={handleUpdateOwnerName}
              reminders={reminders}
              activeReminderIndex={activeReminderIndex}
              onChangeReminderIndex={setActiveReminderIndex}
              onAddCustomReminder={handleAddCustomReminder}
              onUpdateReminder={handleUpdateReminder}
              onDeleteReminder={handleDeleteReminder}
              todayEntries={todayEntries}
              latestEntry={journalEntries[0]}
              futureNote={futureNote}
              onSaveFutureNote={handleSaveFutureNote}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'journal' && (
            <DailyJournalPage
              todayYMD={todayYMD}
              entries={journalEntries}
              onCreateEntry={handleCreateJournalEntry}
              onUpdateEntry={handleUpdateJournalEntry}
              onDeleteEntry={handleDeleteJournalEntry}
            />
          )}

          {activePage === 'diary' && (
            <FreeDiaryPage
              todayYMD={todayYMD}
              entries={diaryEntries}
              onCreateDiary={handleCreateDiaryEntry}
              onUpdateDiary={handleUpdateDiaryEntry}
              onTogglePinDiary={handleTogglePinDiary}
              onDeleteDiary={handleDeleteDiaryEntry}
            />
          )}

          {activePage === 'goals' && (
            <MonthlyGoalsPage
              currentMonthKey={currentMonthKey}
              selectedMonthKey={selectedGoalMonthKey}
              onSelectMonthKey={setSelectedGoalMonthKey}
              allGoals={monthlyGoals}
              onAddGoal={handleAddGoal}
              onToggleGoal={handleToggleGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
