import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  DEFAULT_REMINDERS,
  INITIAL_FUTURE_NOTE,
  buildInitialDiaries,
  buildInitialGoals,
  buildInitialJournals,
} from '../data/initialData';
import {
  DailyReminder,
  DiaryEntry,
  FutureNote,
  JournalEntry,
  MonthlyGoal,
} from '../types/journal';

export interface InitialAppData {
  ownerName: string;
  reminders: DailyReminder[];
  futureNote: FutureNote;
  journalEntries: JournalEntry[];
  diaryEntries: DiaryEntry[];
  monthlyGoals: MonthlyGoal[];
  isConnectedToSupabase: boolean;
}

/**
 * Service Repository untuk Eversoluna.
 * Terhubung langsung ke Supabase apabila variabel environment VITE_SUPABASE_URL
 * dan VITE_SUPABASE_ANON_KEY sudah diisi di file `.env`.
 * Jika belum diisi, otomatis berjalan dengan local fallback agar aplikasi tidak pernah crash.
 */
export const bloomRepository = {
  createId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  },

  formatCurrentTime(): string {
    const now = new Date();
    return now
      .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      .replace('.', ':');
  },

  // --- LOAD SELURUH DATA AWAL DARI SUPABASE ---
  async fetchAllInitialData(now: Date): Promise<InitialAppData> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        ownerName: 'Almira',
        reminders: DEFAULT_REMINDERS,
        futureNote: INITIAL_FUTURE_NOTE,
        journalEntries: buildInitialJournals(now),
        diaryEntries: buildInitialDiaries(now),
        monthlyGoals: buildInitialGoals(now),
        isConnectedToSupabase: false,
      };
    }

    try {
      const [
        remindersRes,
        futureNoteRes,
        journalsRes,
        diariesRes,
        goalsRes,
      ] = await Promise.all([
        supabase
          .from('daily_reminders')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('future_notes')
          .select('*')
          .eq('id', 'primary')
          .maybeSingle(),
        supabase
          .from('journal_entries')
          .select('*')
          .order('entry_date', { ascending: false })
          .order('created_timestamp', { ascending: false }),
        supabase
          .from('diary_entries')
          .select('*')
          .order('entry_date', { ascending: false })
          .order('created_timestamp', { ascending: false }),
        supabase
          .from('monthly_goals')
          .select('*')
          .order('created_at', { ascending: true }),
      ]);

      const reminders: DailyReminder[] =
        remindersRes.data && remindersRes.data.length > 0
          ? remindersRes.data.map((r) => ({
              id: r.id,
              category: r.category,
              text: r.text,
              subtext: r.subtext,
              isCustom: r.is_custom,
            }))
          : DEFAULT_REMINDERS;

      const ownerName: string = futureNoteRes.data?.owner_name || 'Almira';

      const futureNote: FutureNote = futureNoteRes.data
        ? {
            id: futureNoteRes.data.id,
            title: futureNoteRes.data.title,
            content: futureNoteRes.data.content,
            targetDateLabel: futureNoteRes.data.target_date_label,
            updatedAt: futureNoteRes.data.updated_at,
          }
        : INITIAL_FUTURE_NOTE;

      const journalEntries: JournalEntry[] = (journalsRes.data || []).map(
        (j) => ({
          id: j.id,
          entry_date: j.entry_date,
          mood: j.mood,
          gratitude: j.gratitude,
          to_reduce: j.to_reduce,
          created_at: j.created_at,
          updated_at: j.updated_at,
        })
      );

      const diaryEntries: DiaryEntry[] = (diariesRes.data || []).map((d) => ({
        id: d.id,
        entry_date: d.entry_date,
        title: d.title,
        content: d.content,
        created_at: d.created_at,
        updated_at: d.updated_at,
      }));

      const monthlyGoals: MonthlyGoal[] = (goalsRes.data || []).map((g) => ({
        id: g.id,
        month_key: g.month_key,
        title: g.title,
        description: g.description || '',
        is_completed: g.is_completed,
        created_at: g.created_at,
      }));

      return {
        ownerName,
        reminders,
        futureNote,
        journalEntries,
        diaryEntries,
        monthlyGoals,
        isConnectedToSupabase: true,
      };
    } catch (err) {
      console.error('Gagal memuat data dari Supabase, menggunakan data lokal:', err);
      return {
        ownerName: 'Almira',
        reminders: DEFAULT_REMINDERS,
        futureNote: INITIAL_FUTURE_NOTE,
        journalEntries: buildInitialJournals(now),
        diaryEntries: buildInitialDiaries(now),
        monthlyGoals: buildInitialGoals(now),
        isConnectedToSupabase: false,
      };
    }
  },

  // --- JOURNAL ENTRIES ---
  async createJournalEntry(
    payload: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>
  ): Promise<JournalEntry> {
    const timeStr = this.formatCurrentTime();

    if (supabase) {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          entry_date: payload.entry_date,
          mood: payload.mood,
          gratitude: payload.gratitude,
          to_reduce: payload.to_reduce,
          created_at: timeStr,
          updated_at: timeStr,
        })
        .select('*')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          entry_date: data.entry_date,
          mood: data.mood,
          gratitude: data.gratitude,
          to_reduce: data.to_reduce,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
      }
      console.error('Supabase createJournalEntry error:', error);
    }

    return {
      ...payload,
      id: this.createId('journal'),
      created_at: timeStr,
      updated_at: timeStr,
    };
  },

  async updateJournalEntry(
    existing: JournalEntry,
    updates: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>
  ): Promise<JournalEntry> {
    const updatedTime = this.formatCurrentTime();

    if (supabase) {
      const { data, error } = await supabase
        .from('journal_entries')
        .update({
          entry_date: updates.entry_date,
          mood: updates.mood,
          gratitude: updates.gratitude,
          to_reduce: updates.to_reduce,
          updated_at: updatedTime,
        })
        .eq('id', existing.id)
        .select('*')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          entry_date: data.entry_date,
          mood: data.mood,
          gratitude: data.gratitude,
          to_reduce: data.to_reduce,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
      }
      console.error('Supabase updateJournalEntry error:', error);
    }

    return {
      ...existing,
      ...updates,
      updated_at: updatedTime,
    };
  },

  async deleteJournalEntry(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Supabase deleteJournalEntry error:', error);
      }
    }
  },

  // --- FREE DIARY ENTRIES ---
  async createDiaryEntry(
    payload: Omit<DiaryEntry, 'id' | 'created_at' | 'updated_at'>
  ): Promise<DiaryEntry> {
    const timeStr = this.formatCurrentTime();

    if (supabase) {
      const { data, error } = await supabase
        .from('diary_entries')
        .insert({
          entry_date: payload.entry_date,
          title: payload.title,
          content: payload.content,
          created_at: timeStr,
          updated_at: timeStr,
        })
        .select('*')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          entry_date: data.entry_date,
          title: data.title,
          content: data.content,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
      }
      console.error('Supabase createDiaryEntry error:', error);
    }

    return {
      ...payload,
      id: this.createId('diary'),
      created_at: timeStr,
      updated_at: timeStr,
    };
  },

  async updateDiaryEntry(
    existing: DiaryEntry,
    updates: Omit<DiaryEntry, 'id' | 'created_at' | 'updated_at'>
  ): Promise<DiaryEntry> {
    const updatedTime = this.formatCurrentTime();

    if (supabase) {
      const { data, error } = await supabase
        .from('diary_entries')
        .update({
          entry_date: updates.entry_date,
          title: updates.title,
          content: updates.content,
          updated_at: updatedTime,
        })
        .eq('id', existing.id)
        .select('*')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          entry_date: data.entry_date,
          title: data.title,
          content: data.content,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
      }
      console.error('Supabase updateDiaryEntry error:', error);
    }

    return {
      ...existing,
      ...updates,
      updated_at: updatedTime,
    };
  },

  async deleteDiaryEntry(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Supabase deleteDiaryEntry error:', error);
      }
    }
  },

  // --- MONTHLY GOALS ---
  async createMonthlyGoal(payload: {
    month_key: string;
    title: string;
    description?: string;
  }): Promise<MonthlyGoal> {
    const cleanTitle = payload.title.trim();
    const cleanDesc = (payload.description || '').trim();

    if (supabase) {
      const { data, error } = await supabase
        .from('monthly_goals')
        .insert({
          month_key: payload.month_key,
          title: cleanTitle,
          description: cleanDesc,
          is_completed: false,
        })
        .select('*')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          month_key: data.month_key,
          title: data.title,
          description: data.description || '',
          is_completed: data.is_completed,
          created_at: data.created_at,
        };
      }
      console.error('Supabase createMonthlyGoal error:', error);
    }

    return {
      id: this.createId('goal'),
      month_key: payload.month_key,
      title: cleanTitle,
      description: cleanDesc,
      is_completed: false,
      created_at: new Date().toISOString(),
    };
  },

  async updateMonthlyGoal(
    existing: MonthlyGoal,
    updates: Partial<Pick<MonthlyGoal, 'title' | 'description' | 'is_completed'>>
  ): Promise<MonthlyGoal> {
    const merged: MonthlyGoal = {
      ...existing,
      ...updates,
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('monthly_goals')
        .update({
          title: merged.title,
          description: merged.description,
          is_completed: merged.is_completed,
        })
        .eq('id', existing.id)
        .select('*')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          month_key: data.month_key,
          title: data.title,
          description: data.description || '',
          is_completed: data.is_completed,
          created_at: data.created_at,
        };
      }
      console.error('Supabase updateMonthlyGoal error:', error);
    }

    return merged;
  },

  async deleteMonthlyGoal(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase
        .from('monthly_goals')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Supabase deleteMonthlyGoal error:', error);
      }
    }
  },

  // --- DAILY REMINDERS ---
  async createCustomReminder(payload: {
    category: DailyReminder['category'];
    text: string;
    subtext: string;
  }): Promise<DailyReminder> {
    const cleanText = payload.text.trim();
    const cleanSubtext = payload.subtext.trim() || 'Catatan pengingat pribadi';

    if (supabase) {
      const { data, error } = await supabase
        .from('daily_reminders')
        .insert({
          category: payload.category,
          text: cleanText,
          subtext: cleanSubtext,
          is_custom: true,
        })
        .select('*')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          category: data.category,
          text: data.text,
          subtext: data.subtext,
          isCustom: data.is_custom,
        };
      }
      console.error('Supabase createCustomReminder error:', error);
    }

    return {
      id: this.createId('rem'),
      category: payload.category,
      text: cleanText,
      subtext: cleanSubtext,
      isCustom: true,
    };
  },

  // --- FUTURE NOTE & OWNER NAME ---
  async updateFutureNote(
    existing: FutureNote,
    updates: Pick<FutureNote, 'title' | 'content' | 'targetDateLabel'>,
    ownerName?: string
  ): Promise<FutureNote> {
    const updatedLabel = `Diperbarui pukul ${this.formatCurrentTime()}`;

    if (supabase) {
      const upsertPayload: Record<string, string> = {
        id: 'primary',
        title: updates.title,
        content: updates.content,
        target_date_label: updates.targetDateLabel,
        updated_at: updatedLabel,
      };
      if (ownerName) {
        upsertPayload.owner_name = ownerName;
      }

      const { data, error } = await supabase
        .from('future_notes')
        .upsert(upsertPayload)
        .select('*')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          content: data.content,
          targetDateLabel: data.target_date_label,
          updatedAt: data.updated_at,
        };
      }
      console.error('Supabase updateFutureNote error:', error);
    }

    return {
      ...existing,
      ...updates,
      updatedAt: updatedLabel,
    };
  },

  async updateOwnerName(ownerName: string, currentFutureNote: FutureNote): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('future_notes').upsert({
        id: 'primary',
        owner_name: ownerName,
        title: currentFutureNote.title,
        content: currentFutureNote.content,
        target_date_label: currentFutureNote.targetDateLabel,
        updated_at: currentFutureNote.updatedAt,
      });
      if (error) {
        console.error('Supabase updateOwnerName error:', error);
      }
    }
  },
};
