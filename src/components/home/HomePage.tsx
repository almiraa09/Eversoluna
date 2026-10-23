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
    subtext: string;
  }) => void;
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
  todayEntries,
  latestEntry,
  futureNote,
  onSaveFutureNote,
  onNavigate,
}) => {
  const { greeting, timeLabel, calmingOpening } = getGreetingByHour(now);
  const fullDateStr = formatIndonesianFullDate(now);

  // State untuk edit nama sapaan personal
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(ownerName);

  // State untuk form tambah kalimat Daily Reminder baru
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [remCategory, setRemCategory] = useState<DailyReminder['category']>('Afirmasi');
  const [remText, setRemText] = useState('');
  const [remSubtext, setRemSubtext] = useState('');
  const [remError, setRemError] = useState('');

  // State untuk edit Future Note
  const [isEditingFutureNote, setIsEditingFutureNote] = useState(false);
  const [fnTitle, setFnTitle] = useState(futureNote.title);
  const [fnTargetLabel, setFnTargetLabel] = useState(futureNote.targetDateLabel);
  const [fnContent, setFnContent] = useState(futureNote.content);
  const [fnError, setFnError] = useState('');

  const currentReminder = reminders[activeReminderIndex] || reminders[0];

  const handlePrevReminder = () => {
    const nextIdx = (activeReminderIndex - 1 + reminders.length) % reminders.length;
    onChangeReminderIndex(nextIdx);
  };

  const handleNextReminder = () => {
    const nextIdx = (activeReminderIndex + 1) % reminders.length;
    onChangeReminderIndex(nextIdx);
  };

  const handleShuffleReminder = () => {
    if (reminders.length <= 1) return;
    let nextIdx = activeReminderIndex;
    while (nextIdx === activeReminderIndex) {
      nextIdx = Math.floor(Math.random() * reminders.length);
    }
    onChangeReminderIndex(nextIdx);
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remText.trim()) {
      setRemError('Tuliskan kalimat pengingat atau afirmasi terlebih dahulu.');
      return;
    }
    onAddCustomReminder({
      category: remCategory,
      text: remText,
      subtext: remSubtext,
    });
    setRemText('');
    setRemSubtext('');
    setRemError('');
    setIsAddingReminder(false);
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
    <div className="space-y-8 animate-fade-in">
      {/* 1. HERO GREETING — SAPAAN PERSONAL, TANGGAL & KALIMAT PEMBUKA */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-cream-50 to-bloom-100/60 border border-bloom-200/80 p-6 sm:p-9 shadow-bloom">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
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

        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-rosewood-900 tracking-tight leading-tight">
          {greeting}, <span className="italic text-bloom-700">{ownerName}</span>.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-rosewood-700 max-w-2xl leading-relaxed">
          {calmingOpening}
        </p>
      </section>

      {/* 2. KARTU DAILY REMINDER (AFIRMASI, MINDSET, PRINSIP HIDUP) */}
      <section className="rounded-3xl bg-gradient-to-b from-white via-white to-bloom-50/40 border border-bloom-200/80 p-6 sm:p-8 shadow-bloom transition-all duration-300">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-bloom-100/90 border border-bloom-200 flex items-center justify-center text-bloom-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-rosewood-800">
                Daily Reminder
              </h3>
              <p className="text-xs text-rosewood-500">
                Pegangan pikiran & ketenangan batin hari ini
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-bloom-100/90 text-bloom-800 border border-bloom-200">
              {currentReminder.category}
            </span>
            <button
              type="button"
              onClick={() => setIsAddingReminder((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-cream-100 hover:bg-bloom-100/60 text-rosewood-800 border border-bloom-200/70 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-bloom-700" />
              <span>Kalimat Baru</span>
            </button>
          </div>
        </div>

        {/* Isi Kutipan / Afirmasi Utama (Tanpa Subtext, Font Sans Bersih seperti Future Note) */}
        <div className="rounded-2xl bg-gradient-to-br from-cream-50 via-white to-bloom-50/60 border border-bloom-200/60 p-6 sm:p-7 my-2">
          <blockquote className="font-sans text-sm sm:text-base font-medium text-rosewood-800 leading-relaxed">
            “{currentReminder.text}”
          </blockquote>
        </div>

        {/* Kontrol Ganti Kalimat Bawaan */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            {reminders.map((rem, idx) => (
              <button
                key={rem.id}
                type="button"
                onClick={() => onChangeReminderIndex(idx)}
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
              className="p-2 rounded-xl border border-bloom-200/80 bg-white hover:bg-bloom-50 text-rosewood-700 transition-colors"
              title="Kalimat sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleShuffleReminder}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-bloom-200/80 bg-white hover:bg-bloom-50 text-xs font-medium text-rosewood-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-bloom-600" />
              <span>Ganti Kalimat</span>
            </button>
            <button
              type="button"
              onClick={handleNextReminder}
              className="p-2 rounded-xl border border-bloom-200/80 bg-white hover:bg-bloom-50 text-rosewood-700 transition-colors"
              title="Kalimat berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Tambah Kalimat Pengingat Sendiri */}
        {isAddingReminder && (
          <form
            onSubmit={handleSaveReminder}
            className="mt-6 pt-6 border-t border-bloom-200/70 space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-rosewood-900">
                Tambah Kalimat Pengingat Pribadi
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

      {/* 3. RINGKASAN MOOD & STATUS JURNAL HARI INI */}
      <section className="rounded-3xl bg-white border border-bloom-200/80 p-6 sm:p-7 shadow-bloom">
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            <div className="md:col-span-5 flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-bloom-50/80 via-cream-50 to-white border border-bloom-200/70">
              <div
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-bloom-sm ${displayMoodMeta.badgeClass}`}
              >
                <MoodIcon mood={activeTodayEntry.mood} className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-semibold text-rosewood-900 block">
                  Mood: {displayMoodMeta.label}
                </span>
                <p className="text-xs text-rosewood-500 mt-0.5">
                  {displayMoodMeta.subtitle}
                </p>
              </div>
            </div>

            <div className="md:col-span-7 rounded-2xl bg-cream-50/90 border border-cream-300/80 p-4 flex flex-col justify-center">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-rosewood-500 mb-1">
                Syukur Hari Ini
              </p>
              <p className="text-sm text-rosewood-800 line-clamp-2 leading-relaxed">
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
              Lagi ngerasa Happy, Super Happy, Sad, atau Annoyed hari ini? Yuk catat singkat di
              Daily Journal.
            </p>
          </div>
        )}

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
            <span>{hasJournalToday ? 'Lihat / Tambah Jurnal' : 'Isi Jurnal Sekarang'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* 4. FUTURE NOTE — CATATAN BAGI DIRI SENDIRI DI MASA DEPAN */}
      <section className="rounded-3xl bg-gradient-to-br from-white via-cream-50/90 to-bloom-100/50 border border-bloom-200/80 p-6 sm:p-8 shadow-bloom">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-bloom-100 border border-bloom-200 flex items-center justify-center text-bloom-700 shadow-bloom-sm">
              <MailOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-semibold text-rosewood-900">
                  Future Note
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/90 text-bloom-800 border border-bloom-200">
                  Surat Waktu Pribadi
                </span>
              </div>
              <p className="text-xs text-rosewood-500">
                Pesan hangat untuk dirimu sendiri di masa yang akan datang
              </p>
            </div>
          </div>

          {!isEditingFutureNote && (
            <button
              type="button"
              onClick={handleOpenEditFutureNote}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white hover:bg-bloom-50 text-rosewood-800 border border-bloom-200/80 shadow-bloom-sm transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-bloom-700" />
              <span>Ubah Surat Masa Depan</span>
            </button>
          )}
        </div>

        {!isEditingFutureNote ? (
          <div className="rounded-2xl bg-white/90 border border-bloom-200/70 p-6 sm:p-7 shadow-bloom-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-bloom-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-bloom-800">
                <HeartHandshake className="w-4 h-4 text-bloom-600" />
                <span>{futureNote.title}</span>
              </div>
              <span className="text-xs text-rosewood-500 bg-cream-100 px-3 py-1 rounded-full border border-cream-300">
                {futureNote.targetDateLabel}
              </span>
            </div>

            <p className="text-sm sm:text-base text-rosewood-800 leading-relaxed whitespace-pre-line font-normal">
              {futureNote.content}
            </p>

            <div className="mt-5 pt-3 border-t border-bloom-100/80 flex items-center justify-between text-xs text-rosewood-400">
              <span>Ditulis dengan tulus oleh dirimu hari ini</span>
              <span>{futureNote.updatedAt}</span>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmitFutureNote}
            className="rounded-2xl bg-white border border-bloom-200 p-5 sm:p-6 space-y-4 animate-fade-in"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-rosewood-700 mb-1">
                  Judul Catatan
                </label>
                <input
                  type="text"
                  value={fnTitle}
                  onChange={(e) => setFnTitle(e.target.value)}
                  placeholder="Untuk Diriku di Masa Depan"
                  className="w-full rounded-xl border border-bloom-200 bg-cream-50/40 px-3.5 py-2 text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-bloom-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-rosewood-700 mb-1">
                  Momen Pembukaan / Label Waktu
                </label>
                <input
                  type="text"
                  value={fnTargetLabel}
                  onChange={(e) => setFnTargetLabel(e.target.value)}
                  placeholder="Contoh: Dibuka saat akhir tahun / saat butuh semangat"
                  className="w-full rounded-xl border border-bloom-200 bg-cream-50/40 px-3.5 py-2 text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-bloom-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-rosewood-700 mb-1">
                Isi Pesan untuk Dirimu Nanti
              </label>
              <textarea
                rows={4}
                value={fnContent}
                onChange={(e) => {
                  setFnContent(e.target.value);
                  if (fnError) setFnError('');
                }}
                placeholder="Tuliskan harapan, pengingat hangat, atau apresiasi untuk dirimu di masa depan..."
                className="w-full rounded-xl border border-bloom-200 bg-cream-50/40 px-3.5 py-2.5 text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-bloom-300 leading-relaxed"
              />
            </div>

            {fnError && <p className="text-xs text-rose-600 font-medium">{fnError}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingFutureNote(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-rosewood-600 hover:bg-cream-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-bloom-600 hover:bg-bloom-700 text-white shadow-sm transition-colors"
              >
                Simpan Future Note
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};
