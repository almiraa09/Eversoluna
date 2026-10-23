export type PageId = 'home' | 'journal' | 'diary' | 'goals';

export type MoodId = 'super_happy' | 'happy' | 'sad' | 'annoyed';

export interface MoodOption {
  id: MoodId;
  label: string;
  subtitle: string;
  dotColor: string;
  badgeClass: string;
  ringClass: string;
}

export interface DailyReminder {
  id: string;
  category: 'Afirmasi' | 'Mindset' | 'Prinsip Hidup';
  text: string;
  subtext: string;
  isCustom?: boolean;
}

export interface FutureNote {
  id: string;
  title: string;
  content: string;
  targetDateLabel: string;
  updatedAt: string;
}

/**
 * Struktur entri Daily Journal (tanpa tingkat kestabilan & tanpa diary bebas).
 * Dirancang menyerupai skema tabel `journal_entries` pada Supabase.
 */
export interface JournalEntry {
  id: string;
  entry_date: string; // YYYY-MM-DD
  mood: MoodId;
  gratitude: string; // Hal yang disyukuri hari ini
  to_reduce: string; // Hal yang perlu dikurangi atau dijauhi
  created_at: string; // HH:mm
  updated_at: string;
}

/**
 * Struktur entri Free Diary (halaman terpisah khusus menulis cerita/pemikiran bebas).
 * Dirancang menyerupai skema tabel `diary_entries` pada Supabase.
 */
export interface DiaryEntry {
  id: string;
  entry_date: string; // YYYY-MM-DD
  title: string;
  content: string;
  created_at: string; // HH:mm
  updated_at: string;
}

/**
 * Struktur item Monthly Goal.
 * Dirancang menyerupai skema tabel `monthly_goals` pada Supabase.
 */
export interface MonthlyGoal {
  id: string;
  month_key: string; // Format YYYY-MM, contoh: "2026-10"
  title: string;
  description: string; // Opsional
  is_completed: boolean;
  created_at: string;
}
