import React, { useState, useMemo } from 'react';
import {
  BookHeart,
  Calendar,
  CheckCircle2,
  Edit3,
  Trash2,
  Plus,
  Heart,
  MinusCircle,
  Sparkles,
  Clock,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { JournalEntry, MoodId } from '../../types/journal';
import { MOOD_OPTIONS } from '../../data/initialData';
import {
  formatYMDShort,
  formatYMDToIndonesian,
  getMoodMeta,
} from '../../utils/dateUtils';
import { MoodIcon } from '../common/MoodIcon';

interface DailyJournalPageProps {
  todayYMD: string;
  entries: JournalEntry[];
  onCreateEntry: (payload: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateEntry: (
    id: string,
    payload: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>
  ) => void;
  onDeleteEntry: (id: string) => void;
}

export const DailyJournalPage: React.FC<DailyJournalPageProps> = ({
  todayYMD,
  entries,
  onCreateEntry,
  onUpdateEntry,
  onDeleteEntry,
}) => {
  // Form State (Tanpa tingkat kestabilan & tanpa diary bebas)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [entryDate, setEntryDate] = useState<string>(todayYMD);
  const [selectedMood, setSelectedMood] = useState<MoodId>('happy');
  const [gratitude, setGratitude] = useState<string>('');
  const [toReduce, setToReduce] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [feedbackBanner, setFeedbackBanner] = useState<string>('');

  // History & Detail View State
  const [filterDate, setFilterDate] = useState<string>('ALL');
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(
    entries[0]?.id || null
  );
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Cek apakah hari ini sudah punya entri jurnal
  const todayEntries = useMemo(
    () => entries.filter((e) => e.entry_date === todayYMD),
    [entries, todayYMD]
  );
  const hasTodayEntry = todayEntries.length > 0;

  // Daftar tanggal unik untuk filter riwayat
  const uniqueDates = useMemo(() => {
    const set = new Set(entries.map((e) => e.entry_date));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [entries]);

  // Urutkan entri berdasarkan tanggal terbaru
  const filteredEntries = useMemo(() => {
    const list =
      filterDate === 'ALL'
        ? entries
        : entries.filter((item) => item.entry_date === filterDate);
    return [...list].sort((a, b) => {
      if (a.entry_date !== b.entry_date) {
        return b.entry_date.localeCompare(a.entry_date);
      }
      return b.created_at.localeCompare(a.created_at);
    });
  }, [entries, filterDate]);

  const resetForm = (targetDate = todayYMD) => {
    setEditingEntryId(null);
    setEntryDate(targetDate);
    setSelectedMood('happy');
    setGratitude('');
    setToReduce('');
    setFormError('');
  };

  const handleSelectForEdit = (entry: JournalEntry) => {
    setEditingEntryId(entry.id);
    setEntryDate(entry.entry_date);
    setSelectedMood(entry.mood);
    setGratitude(entry.gratitude);
    setToReduce(entry.to_reduce);
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!entryDate) {
      setFormError('Pilih tanggal jurnal terlebih dahulu.');
      return;
    }
    if (!gratitude.trim() && !toReduce.trim()) {
      setFormError(
        'Isi setidaknya hal yang disyukuri atau hal yang ingin dikurangi hari ini.'
      );
      return;
    }

    const payload = {
      entry_date: entryDate,
      mood: selectedMood,
      gratitude: gratitude.trim() || '-',
      to_reduce: toReduce.trim() || '-',
    };

    if (editingEntryId) {
      onUpdateEntry(editingEntryId, payload);
      setFeedbackBanner('Catatan jurnal berhasil diperbarui.');
      setExpandedEntryId(editingEntryId);
    } else {
      onCreateEntry(payload);
      setFeedbackBanner('Jurnal harian berhasil disimpan.');
    }

    resetForm(entryDate);
    setTimeout(() => setFeedbackBanner(''), 3500);
  };

  const handleConfirmDelete = (id: string) => {
    onDeleteEntry(id);
    if (editingEntryId === id) {
      resetForm(todayYMD);
    }
    if (expandedEntryId === id) {
      setExpandedEntryId(null);
    }
    setConfirmDeleteId(null);
    setFeedbackBanner('Catatan jurnal telah dihapus.');
    setTimeout(() => setFeedbackBanner(''), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER & INDIKATOR STATUS JURNAL HARI INI */}
      <section className="rounded-2xl bg-gradient-to-r from-white via-cream-50/90 to-bloom-50/70 border border-bloom-200/80 px-5 py-4 sm:px-7 sm:py-5 shadow-bloom-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-bloom-100/90 border border-bloom-200 flex items-center justify-center text-bloom-700 shadow-bloom-sm shrink-0">
              <BookHeart className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-bloom-700">
                Daily Journal
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-rosewood-900 leading-tight">
                Check-In Harian
              </h2>
            </div>
          </div>

          {/* Indikator Jurnal Hari Ini */}
          <div
            className={`rounded-xl px-3.5 py-2.5 border flex items-center gap-2.5 ${
              hasTodayEntry
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                : 'bg-white/90 border-bloom-200 text-rosewood-800'
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 shrink-0 ${
                hasTodayEntry ? 'text-emerald-600' : 'text-bloom-600'
              }`}
            />
            <div className="text-xs">
              <span className="font-semibold">
                {hasTodayEntry
                  ? `Hari Ini Sudah Diisi (${todayEntries.length})`
                  : 'Hari Ini Belum Diisi'}
              </span>
              <span className="text-rosewood-400 mx-1.5">•</span>
              <span className="text-[11px] opacity-80">
                {formatYMDShort(todayYMD)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {feedbackBanner && (
        <div className="rounded-2xl bg-bloom-100/90 border border-bloom-300 px-4 py-3 text-xs sm:text-sm font-medium text-rosewood-900 flex items-center justify-between shadow-bloom-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-bloom-700 shrink-0" />
            <span>{feedbackBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackBanner('')}
            className="text-xs text-rosewood-500 hover:text-rosewood-800 ml-4"
          >
            Tutup
          </button>
        </div>
      )}

      {/* LAYOUT UTAMA: FORM JURNAL & RIWAYAT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* KOLOM KIRI: FORM JURNAL HARIAN */}
        <section className="xl:col-span-7 rounded-3xl bg-white border border-bloom-200/80 p-6 sm:p-8 shadow-bloom">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-bloom-100">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-rosewood-900">
                {editingEntryId ? 'Edit Jurnal' : 'Isi Jurnal Hari Ini'}
              </h3>
              <p className="text-xs text-rosewood-500 mt-0.5">
                {editingEntryId
                  ? 'Memperbarui catatan yang dipilih'
                  : 'Catat poin penting harimu dengan santai'}
              </p>
            </div>

            {editingEntryId ? (
              <button
                type="button"
                onClick={() => resetForm(todayYMD)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-cream-100 hover:bg-cream-200 text-rosewood-700 border border-cream-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Batal Edit</span>
              </button>
            ) : (
              hasTodayEntry && (
                <span className="text-[11px] font-medium text-bloom-700 bg-bloom-50 px-3 py-1 rounded-full border border-bloom-200">
                  + Catatan Tambahan
                </span>
              )
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Tanggal Jurnal */}
            <div>
              <label
                htmlFor="journal-date"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rosewood-700 mb-2"
              >
                <Calendar className="w-3.5 h-3.5 text-bloom-600" />
                <span>Tanggal</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  id="journal-date"
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="rounded-xl border border-bloom-200 bg-cream-50/50 px-4 py-2.5 text-sm font-medium text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-bloom-300"
                />
                <span className="text-xs text-rosewood-500">
                  {formatYMDToIndonesian(entryDate)}
                </span>
                {entryDate !== todayYMD && (
                  <button
                    type="button"
                    onClick={() => setEntryDate(todayYMD)}
                    className="text-xs font-medium text-bloom-700 hover:underline"
                  >
                    Hari Ini
                  </button>
                )}
              </div>
            </div>

            {/* 2. Mood Harian (4 Pilihan Simpel & Minimalis Tanpa Emoji Berlebihan) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-rosewood-700 mb-2.5">
                Mood Hari Ini
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {MOOD_OPTIONS.map((mood) => {
                  const isSelected = selectedMood === mood.id;
                  return (
                    <button
                      key={mood.id}
                      type="button"
                      onClick={() => setSelectedMood(mood.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? `${mood.ringClass} ring-2 shadow-bloom-sm`
                          : 'bg-cream-50/40 border-bloom-200/60 hover:bg-bloom-50/50 hover:border-bloom-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center border ${mood.badgeClass}`}
                        >
                          <MoodIcon mood={mood.id} className="w-3.5 h-3.5" />
                        </span>
                        <span className={`w-2 h-2 rounded-full ${mood.dotColor}`} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-rosewood-900">{mood.label}</p>
                        <p className="text-[11px] text-rosewood-500 leading-tight mt-0.5">
                          {mood.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Hal yang Disyukuri Hari Ini */}
            <div>
              <label
                htmlFor="journal-gratitude"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rosewood-700 mb-2"
              >
                <Heart className="w-3.5 h-3.5 text-bloom-600" />
                <span>Hal yang Disyukuri Hari Ini</span>
              </label>
              <textarea
                id="journal-gratitude"
                rows={3}
                value={gratitude}
                onChange={(e) => {
                  setGratitude(e.target.value);
                  if (formError) setFormError('');
                }}
                placeholder="Apa hal kecil atau sederhana yang bikin kamu bersyukur hari ini?"
                className="w-full rounded-2xl border border-bloom-200 bg-cream-50/40 px-4 py-3 text-sm text-rosewood-900 placeholder:text-rosewood-400 focus:outline-none focus:ring-2 focus:ring-bloom-300 leading-relaxed"
              />
            </div>

            {/* 4. Hal yang Perlu Dikurangi atau Dijauhi */}
            <div>
              <label
                htmlFor="journal-reduce"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rosewood-700 mb-2"
              >
                <MinusCircle className="w-3.5 h-3.5 text-bloom-600" />
                <span>Hal yang Perlu Dikurangi / Dijauhi</span>
              </label>
              <textarea
                id="journal-reduce"
                rows={3}
                value={toReduce}
                onChange={(e) => {
                  setToReduce(e.target.value);
                  if (formError) setFormError('');
                }}
                placeholder="Kebiasaan atau hal apa yang pengen kamu kurangi biar pikiran lebih tenang?"
                className="w-full rounded-2xl border border-bloom-200 bg-cream-50/40 px-4 py-3 text-sm text-rosewood-900 placeholder:text-rosewood-400 focus:outline-none focus:ring-2 focus:ring-bloom-300 leading-relaxed"
              />
            </div>

            {formError && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-700 font-medium">
                {formError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => resetForm(entryDate)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-rosewood-600 hover:bg-cream-200 transition-colors"
              >
                Reset
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-bloom-500 to-bloom-600 hover:from-bloom-600 hover:to-bloom-700 text-white shadow-bloom-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{editingEntryId ? 'Simpan Perubahan' : 'Simpan Jurnal'}</span>
              </button>
            </div>
          </form>
        </section>

        {/* KOLOM KANAN: RIWAYAT JURNAL BERDASARKAN TANGGAL */}
        <section className="xl:col-span-5 space-y-4">
          <div className="rounded-3xl bg-white border border-bloom-200/80 p-6 shadow-bloom">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-rosewood-900">
                  Riwayat Jurnal
                </h3>
                <p className="text-xs text-rosewood-500">
                  {entries.length} catatan tersimpan
                </p>
              </div>

              {/* Filter Tanggal */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-bloom-600" />
                <select
                  aria-label="Filter tanggal riwayat jurnal"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="rounded-xl border border-bloom-200 bg-cream-50 px-2.5 py-1.5 text-xs font-medium text-rosewood-800 focus:outline-none focus:ring-2 focus:ring-bloom-300"
                >
                  <option value="ALL">Semua Tanggal ({entries.length})</option>
                  {uniqueDates.map((d) => (
                    <option key={d} value={d}>
                      {d === todayYMD ? `Hari Ini (${formatYMDShort(d)})` : formatYMDShort(d)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredEntries.length === 0 ? (
              <div className="rounded-2xl bg-cream-50/70 border border-dashed border-bloom-200 p-8 text-center">
                <p className="text-sm font-semibold text-rosewood-800">
                  Belum ada catatan jurnal
                </p>
                <p className="text-xs text-rosewood-500 mt-1">
                  Isi form di sebelah kiri untuk mulai mencatat jurnal harianmu.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredEntries.map((entry) => {
                  const moodMeta = getMoodMeta(entry.mood);
                  const isToday = entry.entry_date === todayYMD;
                  const isExpanded = expandedEntryId === entry.id;
                  const isBeingEdited = editingEntryId === entry.id;

                  return (
                    <article
                      key={entry.id}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isBeingEdited
                          ? 'bg-bloom-50/70 border-bloom-400 ring-2 ring-bloom-200'
                          : isExpanded
                          ? 'bg-gradient-to-b from-white to-cream-50/70 border-bloom-300 shadow-bloom-sm'
                          : 'bg-cream-50/40 border-bloom-200/70 hover:bg-white hover:border-bloom-300'
                      }`}
                    >
                      {/* Header Kartu Riwayat */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          setExpandedEntryId(isExpanded ? null : entry.id)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setExpandedEntryId(isExpanded ? null : entry.id);
                          }
                        }}
                        className="p-4 cursor-pointer flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${moodMeta.badgeClass}`}
                          >
                            <MoodIcon mood={entry.mood} className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold text-rosewood-900">
                                {formatYMDShort(entry.entry_date)}
                              </span>
                              {isToday && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Hari Ini
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${moodMeta.badgeClass}`}
                              >
                                {moodMeta.label}
                              </span>
                            </div>
                            <p className="text-xs text-rosewood-600 line-clamp-1 mt-1">
                              {entry.gratitude}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-1 text-[11px] text-rosewood-400">
                            <Clock className="w-3 h-3" />
                            {entry.updated_at}
                          </span>
                        </div>
                      </div>

                      {/* Isi Lengkap Jurnal (Saat Dibuka) */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 border-t border-bloom-100 space-y-2.5 text-xs animate-fade-in">
                          <div className="rounded-xl bg-white p-3 border border-bloom-100">
                            <span className="font-semibold text-bloom-800 block mb-1">
                              Hal yang Disyukuri:
                            </span>
                            <p className="text-rosewood-800 leading-relaxed whitespace-pre-line">
                              {entry.gratitude}
                            </p>
                          </div>

                          <div className="rounded-xl bg-white p-3 border border-bloom-100">
                            <span className="font-semibold text-rosewood-700 block mb-1">
                              Perlu Dikurangi / Dijauhi:
                            </span>
                            <p className="text-rosewood-700 leading-relaxed whitespace-pre-line">
                              {entry.to_reduce}
                            </p>
                          </div>

                          {/* Tombol Aksi Edit & Hapus */}
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-[11px] text-rosewood-400">
                              {formatYMDToIndonesian(entry.entry_date)}
                            </span>

                            {confirmDeleteId === entry.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-rose-700 font-medium">
                                  Hapus?
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleConfirmDelete(entry.id)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-semibold hover:bg-rose-700"
                                >
                                  Ya
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2.5 py-1 rounded-lg bg-cream-200 text-rosewood-700 text-[11px]"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSelectForEdit(entry)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-bloom-100/80 hover:bg-bloom-200/80 text-bloom-800 font-medium transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(entry.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
