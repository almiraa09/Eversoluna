import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Calendar,
} from 'lucide-react';
import { DiaryEntry } from '../../types/journal';
import { formatYMDShort } from '../../utils/dateUtils';

interface FreeDiaryPageProps {
  todayYMD: string;
  entries: DiaryEntry[];
  onCreateDiary: (payload: Omit<DiaryEntry, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateDiary: (
    id: string,
    payload: Omit<DiaryEntry, 'id' | 'created_at' | 'updated_at'>
  ) => void;
  onDeleteDiary: (id: string) => void;
}

export const FreeDiaryPage: React.FC<FreeDiaryPageProps> = ({
  todayYMD,
  entries,
  onCreateDiary,
  onUpdateDiary,
  onDeleteDiary,
}) => {
  const [isWriting, setIsWriting] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entryDate, setEntryDate] = useState<string>(todayYMD);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Hardcoded: diary yang baru ditambahkan / tanggal terbaru selalu muncul paling atas
  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      if (a.entry_date !== b.entry_date) {
        return b.entry_date.localeCompare(a.entry_date);
      }
      return 0;
    });
  }, [entries]);

  const openNewForm = () => {
    setEditingId(null);
    setEntryDate(todayYMD);
    setTitle('');
    setContent('');
    setFormError('');
    setIsWriting(true);
  };

  const openEditForm = (entry: DiaryEntry) => {
    setEditingId(entry.id);
    setEntryDate(entry.entry_date);
    setTitle(entry.title);
    setContent(entry.content);
    setFormError('');
    setIsWriting(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setIsWriting(false);
    setEditingId(null);
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setFormError('Isi catatan tidak boleh kosong.');
      return;
    }

    const payload = {
      entry_date: entryDate,
      title: title.trim() || 'Catatan Diary',
      content: content.trim(),
    };

    if (editingId) {
      onUpdateDiary(editingId, payload);
    } else {
      onCreateDiary(payload);
    }

    closeForm();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Baris Atas: Judul Singkat & Tombol Tambah Catatan Diary */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-3xl font-semibold text-rosewood-900">
          Diary
        </h2>

        {!isWriting && (
          <button
            type="button"
            onClick={openNewForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold bg-bloom-600 hover:bg-bloom-700 text-white shadow-bloom-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Catatan Diary</span>
          </button>
        )}
      </div>

      {/* Form Input (Hanya muncul saat tombol Tambah / Edit diklik) */}
      {isWriting && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white border border-bloom-200 p-5 sm:p-6 shadow-bloom space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-rosewood-900">
              {editingId ? 'Edit Catatan Diary' : 'Catatan Diary Baru'}
            </span>
            <button
              type="button"
              onClick={closeForm}
              className="p-1.5 rounded-xl text-rosewood-400 hover:text-rosewood-700 hover:bg-cream-100"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-bloom-200 bg-cream-50/50 px-3 py-2">
              <Calendar className="w-4 h-4 text-bloom-600 shrink-0" />
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-rosewood-900 focus:outline-none"
              />
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul singkat (opsional)"
              className="sm:col-span-2 rounded-xl border border-bloom-200 bg-cream-50/50 px-3.5 py-2 text-sm text-rosewood-900 placeholder:text-rosewood-400 focus:outline-none focus:ring-2 focus:ring-bloom-300"
            />
          </div>

          <textarea
            rows={7}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (formError) setFormError('');
            }}
            placeholder="Tulis ceritamu di sini..."
            className="w-full rounded-xl border border-bloom-200 bg-cream-50/30 px-4 py-3 text-sm text-rosewood-900 placeholder:text-rosewood-400 focus:outline-none focus:ring-2 focus:ring-bloom-300 leading-relaxed"
            autoFocus
          />

          {formError && <p className="text-xs text-rose-600">{formError}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 rounded-xl text-xs font-medium text-rosewood-600 hover:bg-cream-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-bloom-600 hover:bg-bloom-700 text-white transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      )}

      {/* Riwayat Diary */}
      <div className="rounded-2xl bg-white border border-bloom-200/80 divide-y divide-bloom-100 shadow-bloom-sm">
        {sortedEntries.length === 0 ? (
          <div className="p-8 text-center text-sm text-rosewood-400">
            Belum ada riwayat diary.
          </div>
        ) : (
          sortedEntries.map((entry) => (
            <article key={entry.id} className="p-5 sm:p-6 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-bloom-700">
                      {formatYMDShort(entry.entry_date)}
                    </span>
                    <span className="text-xs text-rosewood-400">• {entry.updated_at}</span>
                  </div>
                  <h3 className="text-base font-semibold text-rosewood-900 mt-0.5">
                    {entry.title}
                  </h3>
                </div>

                {confirmDeleteId === entry.id ? (
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteDiary(entry.id);
                        setConfirmDeleteId(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-medium"
                    >
                      Hapus
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2.5 py-1 rounded-lg bg-cream-200 text-rosewood-700"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditForm(entry)}
                      className="p-1.5 rounded-lg text-rosewood-400 hover:text-bloom-700 hover:bg-bloom-50 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(entry.id)}
                      className="p-1.5 rounded-lg text-rosewood-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-sm text-rosewood-700 leading-relaxed whitespace-pre-line">
                {entry.content}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
