import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  BookHeart,
  MailOpen,
  Edit3,
  Trash2,
  Check,
  X,
  Calendar,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  Clock,
  Feather,
} from 'lucide-react';
import {
  DailyReminder,
  FutureNote,
  JournalEntry,
  PageId,
} from '../../types/journal';
import {
  formatIndonesianFullDate,
  getGreetingByHour,
  getMoodMeta,
} from '../../utils/dateUtils';
import { MoodIcon } from '../common/MoodIcon';

interface HomePageProps {
  now: Date;
  ownerName: string;
  onUpdateOwnerName: (name: string) => void;
  reminders: DailyReminder[];
  activeReminderIndex: number;
  onChangeReminderIndex: (nextIndex: number) => void;
  onAddCustomReminder: (payload: {
    category: DailyReminder['category'];
    text: string;
    subtext?: string;
  }) => void;
  onUpdateReminder: (
    id: string,
    payload: {
      category: DailyReminder['category'];
      text: string;
      subtext?: string;
    }
  ) => void;
  onDeleteReminder: (id: string) => void;
  todayEntries: JournalEntry[];
  latestEntry: JournalEntry | undefined;
  futureNote: FutureNote;
  onSaveFutureNote: (updates: Pick<FutureNote, 'title' | 'content' | 'targetDateLabel'>) => void;
  onNavigate: (page: PageId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  now,
  ownerName,
  onUpdateOwnerName,
  reminders,
  activeReminderIndex,
  onChangeReminderIndex,
  onAddCustomReminder,
  onUpdateReminder,
  onDeleteReminder,
  todayEntries,
  latestEntry,
  futureNote,
  onSaveFutureNote,
  onNavigate,
}) => {
  const { greeting, timeLabel, calmingOpening } = getGreetingByHour(now);
  const fullDateStr = formatIndonesianFullDate(now);

  // Maksimal 7 kuotes
  const MAX_REMINDERS = 7;
  const isMaxRemindersReached = reminders.length >= MAX_REMINDERS;

  // State untuk edit nama sapaan personal
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(ownerName);

  // State untuk form tambah kalimat Daily Reminder baru
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [remCategory, setRemCategory] = useState<DailyReminder['category']>('Afirmasi');
  const [remText, setRemText] = useState('');
  const [remError, setRemError] = useState('');

  // State untuk edit Daily Reminder
  const [isEditingReminder, setIsEditingReminder] = useState(false);
  const [editRemCategory, setEditRemCategory] = useState<DailyReminder['category']>('Afirmasi');
  const [editRemText, setEditRemText] = useState('');
  const [editRemError, setEditRemError] = useState('');

  // State konfirmasi hapus reminder
  const [confirmDeleteRemId, setConfirmDeleteRemId] = useState<string | null>(null);

  // State untuk edit Future Note
  const [isEditingFutureNote, setIsEditingFutureNote] = useState(false);
  const [fnTitle, setFnTitle] = useState(futureNote.title);
  const [fnTargetLabel, setFnTargetLabel] = useState(futureNote.targetDateLabel);
  const [fnContent, setFnContent] = useState(futureNote.content);
  const [fnError, setFnError] = useState('');

  const currentReminder: DailyReminder | undefined =
    reminders.length > 0 ? (reminders[activeReminderIndex] || reminders[0]) : undefined;

  const handlePrevReminder = () => {
    if (reminders.length <= 1) return;
    const nextIdx = (activeReminderIndex - 1 + reminders.length) % reminders.length;
    onChangeReminderIndex(nextIdx);
    setIsEditingReminder(false);
    setConfirmDeleteRemId(null);
  };

  const handleNextReminder = () => {
    if (reminders.length <= 1) return;
    const nextIdx = (activeReminderIndex + 1) % reminders.length;
    onChangeReminderIndex(nextIdx);
    setIsEditingReminder(false);
    setConfirmDeleteRemId(null);
  };

  const handleShuffleReminder = () => {
    if (reminders.length <= 1) return;
    let nextIdx = activeReminderIndex;
    while (nextIdx === activeReminderIndex) {
      nextIdx = Math.floor(Math.random() * reminders.length);
    }
    onChangeReminderIndex(nextIdx);
    setIsEditingReminder(false);
    setConfirmDeleteRemId(null);
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMaxRemindersReached) {
      setRemError('Maksimal kuota 7 quotes sudah tercapai. Hapus salah satu quote untuk menambah baru.');
      return;
    }
    if (!remText.trim()) {
      setRemError('Tuliskan kalimat pengingat atau afirmasi terlebih dahulu.');
      return;
    }
    onAddCustomReminder({
      category: remCategory,
      text: remText.trim(),
    });
    setRemText('');
    setRemError('');
    setIsAddingReminder(false);
  };

  const handleOpenEditReminder = () => {
    if (!currentReminder) return;
    setEditRemCategory(currentReminder.category);
    setEditRemText(currentReminder.text);
    setEditRemError('');
    setIsEditingReminder(true);
    setIsAddingReminder(false);
    setConfirmDeleteRemId(null);
  };

  const handleSaveEditReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReminder) return;
    if (!editRemText.trim()) {
      setEditRemError('Isi quote pengingat tidak boleh kosong.');
      return;
    }
    onUpdateReminder(currentReminder.id, {
      category: editRemCategory,
      text: editRemText.trim(),
    });
    setIsEditingReminder(false);
    setEditRemError('');
  };

  const handleConfirmDeleteReminder = (id: string) => {
    onDeleteReminder(id);
    setConfirmDeleteRemId(null);
    setIsEditingReminder(false);
    if (activeReminderIndex >= reminders.length - 1) {
      onChangeReminderIndex(Math.max(0, reminders.length - 2));
    }
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameDraft.trim()) {
      onUpdateOwnerName(nameDraft.trim());
    } else {
      setNameDraft(ownerName);
    }
    setIsEditingName(false);
  };

  const handleOpenEditFutureNote = () => {
    setFnTitle(futureNote.title);
    setFnTargetLabel(futureNote.targetDateLabel);
    setFnContent(futureNote.content);
    setFnError('');
    setIsEditingFutureNote(true);
  };

  const handleSubmitFutureNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fnContent.trim()) {
      setFnError('Pesan untuk masa depan tidak boleh kosong.');
      return;
    }
    onSaveFutureNote({
      title: fnTitle.trim() || 'Untuk Diriku di Masa Depan',
      content: fnContent.trim(),
      targetDateLabel: fnTargetLabel.trim() || 'Saat Membuka Kembali Ruang Ini',
    });
    setIsEditingFutureNote(false);
  };

  // Ringkasan jurnal hari ini
  const hasJournalToday = todayEntries.length > 0;
  const activeTodayEntry = todayEntries[0] || null;
  const displayMoodMeta = activeTodayEntry
    ? getMoodMeta(activeTodayEntry.mood)
    : latestEntry
    ? getMoodMeta(latestEntry.mood)
    : null;

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in pb-4">
      {/* 1. HERO GREETING — SEAMLESS & ANGGUN (TANPA CARD KOTAK TEBAL) */}
      <header className="pt-1 pb-1 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-bloom-200/80 text-xs font-medium text-bloom-800 shadow-bloom-sm">
            <Calendar className="w-3.5 h-3.5 text-bloom-600" />
            <span>{fullDateStr}</span>
            <span className="text-bloom-300">•</span>
            <span className="text-rosewood-600">{timeLabel}</span>
          </div>

          {!isEditingName ? (
            <button
              type="button"
              onClick={() => {
                setNameDraft(ownerName);
                setIsEditingName(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-rosewood-500 hover:text-bloom-700 transition-colors px-2.5 py-1 rounded-lg hover:bg-white/70"
              title="Ubah nama panggilan"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Sapaan</span>
            </button>
          ) : (
            <form onSubmit={handleSaveName} className="inline-flex items-center gap-1.5">
              <input
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="Nama panggilanmu"
                className="px-2.5 py-1 text-xs rounded-lg border border-bloom-300 bg-white text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-bloom-300"
                autoFocus
              />
              <button
                type="submit"
                className="p-1 rounded-lg bg-bloom-500 text-white hover:bg-bloom-600"
                title="Simpan"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="p-1 rounded-lg bg-cream-200 text-rosewood-700 hover:bg-cream-300"
                title="Batal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-rosewood-900 tracking-tight leading-tight">
            {greeting}, <span className="italic text-bloom-700">{ownerName}</span>.
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-rosewood-600 max-w-2xl leading-relaxed">
            {calmingOpening}
          </p>
        </div>
      </header>

      {/* 2. KARTU UTAMA DAILY REMINDER (AFIRMASI, MINDSET, PRINSIP HIDUP - MAKSIMAL 7) */}
      <section className="rounded-3xl bg-gradient-to-b from-white via-white to-bloom-50/40 border border-bloom-200/80 p-6 sm:p-8 shadow-bloom transition-all duration-300">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-bloom-100/90 border border-bloom-200 flex items-center justify-center text-bloom-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-rosewood-900">
              Daily Reminder
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {currentReminder && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-bloom-100/90 text-bloom-800 border border-bloom-200">
                {currentReminder.category}
              </span>
            )}
            {!isMaxRemindersReached && (
              <button
                type="button"
                onClick={() => {
                  setIsAddingReminder((prev) => !prev);
                  setIsEditingReminder(false);
                  setConfirmDeleteRemId(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-cream-100 hover:bg-bloom-100/60 text-rosewood-800 border border-bloom-200/70 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-bloom-700" />
                <span>Kalimat Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Konten Quote atau Mode Edit */}
        {currentReminder ? (
          !isEditingReminder ? (
            <div className="rounded-2xl bg-gradient-to-br from-cream-50 via-white to-bloom-50/60 border border-bloom-200/60 p-6 sm:p-7 my-2 space-y-4">
              <blockquote className="font-sans text-sm sm:text-base font-medium text-rosewood-800 leading-relaxed">
                “{currentReminder.text}”
              </blockquote>

              {/* Baris Tombol Edit & Hapus Quote (Bersih tanpa teks kategori) */}
              <div className="pt-2 flex items-center justify-end border-t border-bloom-200/50">
                {confirmDeleteRemId === currentReminder.id ? (
                  <div className="flex items-center gap-2 text-xs animate-fade-in">
                    <span className="text-rose-600 font-medium">Hapus quote ini?</span>
                    <button
                      type="button"
                      onClick={() => handleConfirmDeleteReminder(currentReminder.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors"
                    >
                      Hapus
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteRemId(null)}
                      className="px-2.5 py-1 rounded-lg bg-cream-200 text-rosewood-700 hover:bg-cream-300 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleOpenEditReminder}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-rosewood-600 hover:text-bloom-700 hover:bg-bloom-100/60 transition-colors"
                      title="Edit isi quote ini"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteRemId(currentReminder.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-rosewood-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus quote ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Mode Form Edit Quote Aktif */
            <form
              onSubmit={handleSaveEditReminder}
              className="rounded-2xl bg-gradient-to-br from-cream-50 via-white to-bloom-50/60 border border-bloom-300 p-5 sm:p-6 my-2 space-y-4 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-bloom-800">
                  Edit Quote Reminder
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingReminder(false)}
                  className="p-1 rounded-lg text-rosewood-400 hover:text-rosewood-700"
                  title="Batal edit"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['Afirmasi', 'Mindset', 'Prinsip Hidup'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setEditRemCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                      editRemCategory === cat
                        ? 'bg-bloom-500 text-white border-bloom-500 shadow-sm'
                        : 'bg-white text-rosewood-700 border-bloom-200 hover:bg-bloom-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div>
                <textarea
                  rows={3}
                  value={editRemText}
                  onChange={(e) => {
                    setEditRemText(e.target.value);
                    if (editRemError) setEditRemError('');
                  }}
                  className="w-full rounded-xl border border-bloom-200 bg-white px-3.5 py-2.5 text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-bloom-300"
                  placeholder="Isi kalimat reminder..."
                  autoFocus
                />
              </div>

              {editRemError && (
                <p className="text-xs text-rose-600 font-medium">{editRemError}</p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingReminder(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-rosewood-600 hover:bg-cream-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-bloom-600 hover:bg-bloom-700 text-white shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          )
        ) : (
          <div className="rounded-2xl bg-cream-50/60 border border-bloom-200/60 p-8 my-2 text-center space-y-3">
            <p className="text-sm text-rosewood-500">
              Belum ada quote pengingat harian.
            </p>
            <button
              type="button"
              onClick={() => setIsAddingReminder(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-bloom-600 hover:bg-bloom-700 text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Quote Pertama (Maks. 7)</span>
            </button>
          </div>
        )}

        {/* Kontrol Ganti Kalimat Bawaan */}
        {reminders.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              {reminders.map((rem, idx) => (
                <button
                  key={rem.id}
                  type="button"
                  onClick={() => {
                    onChangeReminderIndex(idx);
                    setIsEditingReminder(false);
                    setConfirmDeleteRemId(null);
                  }}
                  aria-label={`Pilih pengingat ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    idx === activeReminderIndex
                      ? 'w-7 bg-bloom-500'
                      : 'w-2 bg-bloom-200 hover:bg-bloom-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-xs text-rosewood-500">
                {activeReminderIndex + 1} dari {reminders.length} kalimat
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevReminder}
                disabled={reminders.length <= 1}
                className="p-2 rounded-xl border border-bloom-200/80 bg-white hover:bg-bloom-50 text-rosewood-700 transition-colors disabled:opacity-40"
                title="Kalimat sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleShuffleReminder}
                disabled={reminders.length <= 1}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-bloom-200/80 bg-white hover:bg-bloom-50 text-xs font-medium text-rosewood-800 transition-colors disabled:opacity-40"
              >
                <RefreshCw className="w-3.5 h-3.5 text-bloom-600" />
                <span>Ganti Kalimat</span>
              </button>
              <button
                type="button"
                onClick={handleNextReminder}
                disabled={reminders.length <= 1}
                className="p-2 rounded-xl border border-bloom-200/80 bg-white hover:bg-bloom-50 text-rosewood-700 transition-colors disabled:opacity-40"
                title="Kalimat berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Form Tambah Kalimat Pengingat Sendiri (Hanya jika belum mencapai 7) */}
        {isAddingReminder && !isMaxRemindersReached && (
          <form
            onSubmit={handleSaveReminder}
            className="mt-6 pt-6 border-t border-bloom-200/70 space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-rosewood-900">
                Tambah Kalimat Pengingat Baru
              </h4>
              <button
                type="button"
                onClick={() => {
                  setIsAddingReminder(false);
                  setRemError('');
                }}
                className="text-xs text-rosewood-500 hover:text-rosewood-800"
              >
                Tutup
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(['Afirmasi', 'Mindset', 'Prinsip Hidup'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setRemCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    remCategory === cat
                      ? 'bg-bloom-500 text-white border-bloom-500 shadow-sm'
                      : 'bg-white text-rosewood-700 border-bloom-200 hover:bg-bloom-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium text-rosewood-700 mb-1">
                Isi Reminder
              </label>
              <textarea
                rows={2}
                value={remText}
                onChange={(e) => {
                  setRemText(e.target.value);
                  if (remError) setRemError('');
                }}
                placeholder="Tulis afirmasi atau prinsip hidup yang ingin selalu kamu ingat..."
                className="w-full rounded-xl border border-bloom-200 bg-white px-3.5 py-2.5 text-sm text-rosewood-900 placeholder:text-rosewood-400 focus:outline-none focus:ring-2 focus:ring-bloom-300"
              />
            </div>

            {remError && <p className="text-xs text-rose-600 font-medium">{remError}</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingReminder(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-rosewood-600 hover:bg-cream-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-bloom-600 hover:bg-bloom-700 text-white shadow-sm transition-colors"
              >
                Simpan & Tampilkan
              </button>
            </div>
          </form>
        )}
      </section>

      {/* 3. ROW 2 KOLOM: MOOD & JURNAL (KIRI) DAN FUTURE NOTE (KANAN) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* KOLOM KIRI: MOOD & JURNAL HARI INI */}
        <section className="rounded-3xl bg-white border border-bloom-200/80 p-6 sm:p-7 shadow-bloom flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-bloom-100/80 border border-bloom-200 flex items-center justify-center text-bloom-700">
                  <BookHeart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-rosewood-900">
                    Mood & Jurnal Hari Ini
                  </h3>
                  <p className="text-xs text-rosewood-500">Check-in singkat harianmu</p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  hasJournalToday
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {hasJournalToday ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sudah Diisi ({todayEntries.length})</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Belum Diisi</span>
                  </>
                )}
              </span>
            </div>

            {activeTodayEntry && displayMoodMeta ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-bloom-50/80 via-cream-50 to-white border border-bloom-200/70">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-bloom-sm ${displayMoodMeta.badgeClass}`}
                  >
                    <MoodIcon mood={activeTodayEntry.mood} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-rosewood-900 block">
                      Mood: {displayMoodMeta.label}
                    </span>
                    <p className="text-xs text-rosewood-500 mt-0.5 truncate">
                      {displayMoodMeta.subtitle}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-cream-50/90 border border-cream-300/80 p-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-rosewood-500 mb-1">
                    Syukur Hari Ini
                  </p>
                  <p className="text-xs sm:text-sm text-rosewood-800 line-clamp-2 leading-relaxed">
                    “{activeTodayEntry.gratitude}”
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-bloom-50/50 border border-dashed border-bloom-300 p-5 text-center">
                <p className="text-sm font-semibold text-rosewood-900">
                  Hari ini belum ada catatan jurnal
                </p>
                <p className="text-xs text-rosewood-600 mt-1 leading-relaxed">
                  Yuk luangkan satu menit untuk mencatat perasaan dan rasa syukurmu.
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-bloom-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onNavigate('diary')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-rosewood-600 hover:text-bloom-700"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Buka Free Diary</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('journal')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-bloom-700 hover:text-bloom-800 group"
            >
              <span>{hasJournalToday ? 'Lihat / Tambah' : 'Isi Jurnal'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </section>

        {/* KOLOM KANAN: FUTURE NOTE (SURAT UNTUK MASA DEPAN) */}
        <section className="rounded-3xl bg-gradient-to-br from-white via-cream-50/90 to-bloom-100/50 border border-bloom-200/80 p-6 sm:p-7 shadow-bloom flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-bloom-100 border border-bloom-200 flex items-center justify-center text-bloom-700 shadow-bloom-sm">
                  <MailOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-rosewood-900">
                    Future Note
                  </h3>
                  <p className="text-xs text-rosewood-500">
                    Pesan hangat untuk dirimu nanti
                  </p>
                </div>
              </div>

              {!isEditingFutureNote && (
                <button
                  type="button"
                  onClick={handleOpenEditFutureNote}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-bloom-50 text-rosewood-800 border border-bloom-200/80 shadow-bloom-sm transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-bloom-700" />
                  <span>Ubah</span>
                </button>
              )}
            </div>

            {!isEditingFutureNote ? (
              <div className="rounded-2xl bg-white/90 border border-bloom-200/70 p-4 sm:p-5 shadow-bloom-sm space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-bloom-100">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-bloom-800">
                    <HeartHandshake className="w-3.5 h-3.5 text-bloom-600" />
                    <span>{futureNote.title}</span>
                  </div>
                  <span className="text-[11px] text-rosewood-500 bg-cream-100 px-2.5 py-0.5 rounded-full border border-cream-300">
                    {futureNote.targetDateLabel}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-rosewood-800 leading-relaxed whitespace-pre-line font-normal line-clamp-4">
                  {futureNote.content}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitFutureNote}
                className="rounded-2xl bg-white border border-bloom-200 p-4 space-y-3 animate-fade-in"
              >
                <div>
                  <input
                    type="text"
                    value={fnTitle}
                    onChange={(e) => setFnTitle(e.target.value)}
                    placeholder="Judul Catatan"
                    className="w-full rounded-xl border border-bloom-200 bg-cream-50/40 px-3 py-1.5 text-xs text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-bloom-300"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={fnTargetLabel}
                    onChange={(e) => setFnTargetLabel(e.target.value)}
                    placeholder="Momen pembukaan (contoh: Akhir Tahun)"
                    className="w-full rounded-xl border border-bloom-200 bg-cream-50/40 px-3 py-1.5 text-xs text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-bloom-300"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    value={fnContent}
                    onChange={(e) => {
                      setFnContent(e.target.value);
                      if (fnError) setFnError('');
                    }}
                    placeholder="Tuliskan harapan atau pengingat hangat untuk dirimu di masa depan..."
                    className="w-full rounded-xl border border-bloom-200 bg-cream-50/40 px-3 py-2 text-xs text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-bloom-300 leading-relaxed"
                  />
                </div>
                {fnError && <p className="text-xs text-rose-600 font-medium">{fnError}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingFutureNote(false)}
                    className="px-3 py-1 rounded-xl text-xs font-medium text-rosewood-600 hover:bg-cream-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 rounded-xl text-xs font-semibold bg-bloom-600 hover:bg-bloom-700 text-white shadow-sm"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-bloom-100/80 flex items-center justify-between text-[11px] text-rosewood-400">
            <span>Surat pribadi untuk masa depan</span>
            <span>{futureNote.updatedAt}</span>
          </div>
        </section>
      </div>
    </div>
  );
};
