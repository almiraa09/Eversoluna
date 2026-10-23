import React, { useState, useMemo } from 'react';
import {
  Target,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Edit3,
  Trash2,
  X,
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { MonthlyGoal } from '../../types/journal';
import { formatMonthKeyIndonesian, shiftMonthKey } from '../../utils/dateUtils';

interface MonthlyGoalsPageProps {
  currentMonthKey: string;
  selectedMonthKey: string;
  onSelectMonthKey: (monthKey: string) => void;
  allGoals: MonthlyGoal[];
  onAddGoal: (payload: { month_key: string; title: string; description: string }) => void;
  onToggleGoal: (id: string) => void;
  onUpdateGoal: (id: string, updates: { title: string; description: string }) => void;
  onDeleteGoal: (id: string) => void;
}

export const MonthlyGoalsPage: React.FC<MonthlyGoalsPageProps> = ({
  currentMonthKey,
  selectedMonthKey,
  onSelectMonthKey,
  allGoals,
  onAddGoal,
  onToggleGoal,
  onUpdateGoal,
  onDeleteGoal,
}) => {
  // Form Tambah Goal Baru
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [formError, setFormError] = useState('');

  // State Edit Goal
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // State Konfirmasi Hapus
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filter status tampilan
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Ambil daftar goal khusus bulan yang sedang dipilih
  const monthGoals = useMemo(
    () => allGoals.filter((g) => g.month_key === selectedMonthKey),
    [allGoals, selectedMonthKey]
  );

  const filteredMonthGoals = useMemo(() => {
    if (statusFilter === 'completed') return monthGoals.filter((g) => g.is_completed);
    if (statusFilter === 'pending') return monthGoals.filter((g) => !g.is_completed);
    return monthGoals;
  }, [monthGoals, statusFilter]);

  const totalCount = monthGoals.length;
  const completedCount = monthGoals.filter((g) => g.is_completed).length;
  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Ringkasan riwayat bulan-bulan yang memiliki data
  const monthHistorySummary = useMemo(() => {
    const map = new Map<string, { total: number; completed: number }>();
    allGoals.forEach((g) => {
      const curr = map.get(g.month_key) || { total: 0, completed: 0 };
      curr.total += 1;
      if (g.is_completed) curr.completed += 1;
      map.set(g.month_key, curr);
    });
    if (!map.has(currentMonthKey)) {
      map.set(currentMonthKey, { total: 0, completed: 0 });
    }
    return Array.from(map.entries())
      .map(([monthKey, stats]) => ({ monthKey, ...stats }))
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [allGoals, currentMonthKey]);

  const handlePrevMonth = () => {
    onSelectMonthKey(shiftMonthKey(selectedMonthKey, -1));
    setEditingGoalId(null);
  };

  const handleNextMonth = () => {
    onSelectMonthKey(shiftMonthKey(selectedMonthKey, 1));
    setEditingGoalId(null);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Tuliskan judul goal bulanan terlebih dahulu.');
      return;
    }
    onAddGoal({
      month_key: selectedMonthKey,
      title: newTitle.trim(),
      description: newDescription.trim(),
    });
    setNewTitle('');
    setNewDescription('');
    setFormError('');
  };

  const startEditingGoal = (goal: MonthlyGoal) => {
    setEditingGoalId(goal.id);
    setEditTitle(goal.title);
    setEditDescription(goal.description);
  };

  const handleSaveEditGoal = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    onUpdateGoal(id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
    });
    setEditingGoalId(null);
  };

  const isCurrentMonth = selectedMonthKey === currentMonthKey;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. HEADER & NAVIGASI BULAN SEBELUMNYA / BERIKUTNYA */}
      <section className="rounded-3xl bg-gradient-to-br from-white via-cream-50 to-bloom-100/60 border border-bloom-200/80 p-6 sm:p-8 shadow-bloom">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-bloom-700 mb-2">
              <Target className="w-4 h-4" />
              <span>Monthly Goals & Mindful Intentions</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-rosewood-900">
              Fokus & Langkah Bulanan
            </h2>
            <p className="mt-1.5 text-sm text-rosewood-600 max-w-xl leading-relaxed">
              Tetapkan target yang realistis dan bermakna setiap bulan. Seluruh riwayat bulan
              sebelumnya maupun rencana bulan berikutnya tersimpan rapi.
            </p>
          </div>

          {/* Kontrol Navigasi Bulan & Tahun */}
          <div className="flex flex-col sm:items-end gap-2">
            <div className="inline-flex items-center gap-2 bg-white/95 border border-bloom-200/90 rounded-2xl p-1.5 shadow-bloom-sm">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2.5 rounded-xl hover:bg-bloom-50 text-rosewood-700 transition-colors"
                title="Bulan Sebelumnya"
                aria-label="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-4 py-1 text-center min-w-[165px]">
                <div className="flex items-center justify-center gap-1.5 text-xs text-bloom-700 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isCurrentMonth ? 'Bulan Berjalan' : 'Arsip / Rencana'}</span>
                </div>
                <p className="font-serif text-xl font-semibold text-rosewood-900">
                  {formatMonthKeyIndonesian(selectedMonthKey)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2.5 rounded-xl hover:bg-bloom-50 text-rosewood-700 transition-colors"
                title="Bulan Berikutnya"
                aria-label="Bulan Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {!isCurrentMonth && (
              <button
                type="button"
                onClick={() => onSelectMonthKey(currentMonthKey)}
                className="text-xs font-semibold text-bloom-700 hover:text-bloom-800 underline underline-offset-4"
              >
                Kembali ke Bulan Ini ({formatMonthKeyIndonesian(currentMonthKey)})
              </button>
            )}
          </div>
        </div>

        {/* Baris Riwayat Bulan Cepat (Menjaga dan menampilkan data antarbulan) */}
        <div className="mt-6 pt-5 border-t border-bloom-200/60 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-medium text-rosewood-500 shrink-0 mr-1">
            Riwayat Bulan:
          </span>
          {monthHistorySummary.map((item) => {
            const active = item.monthKey === selectedMonthKey;
            return (
              <button
                key={item.monthKey}
                type="button"
                onClick={() => onSelectMonthKey(item.monthKey)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all shrink-0 flex items-center gap-2 ${
                  active
                    ? 'bg-bloom-600 text-white border-bloom-600 shadow-sm'
                    : 'bg-white/80 text-rosewood-700 border-bloom-200/80 hover:bg-bloom-50'
                }`}
              >
                <span>{formatMonthKeyIndonesian(item.monthKey)}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    active ? 'bg-bloom-700 text-bloom-50' : 'bg-bloom-100 text-bloom-800'
                  }`}
                >
                  {item.completed}/{item.total}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. KARTU PROGRESS BAR & PERSENTASE BULAN TERPILIH */}
      <section className="rounded-3xl bg-white border border-bloom-200/80 p-6 sm:p-7 shadow-bloom">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rosewood-500">
              Pencapaian {formatMonthKeyIndonesian(selectedMonthKey)}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-rosewood-900 mt-0.5">
              {completedCount} dari {totalCount} Target Selesai
            </h3>
          </div>

          <div className="text-right">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-bloom-700">
              {progressPercentage}%
            </span>
            <p className="text-xs text-rosewood-500">
              {progressPercentage === 100 && totalCount > 0
                ? 'Seluruh target bulan ini telah tercapai 🌸'
                : 'Terus melangkah dengan ritme yang tenang'}
            </p>
          </div>
        </div>

        <div className="w-full h-3.5 rounded-full bg-bloom-100/90 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-bloom-400 via-bloom-500 to-bloom-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </section>

      {/* 3. GRID FORM TAMBAH GOAL & DAFTAR CHECKLIST GOALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Tambah Goal Baru */}
        <section className="lg:col-span-5 rounded-3xl bg-white border border-bloom-200/80 p-6 sm:p-7 shadow-bloom">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-bloom-100 border border-bloom-200 flex items-center justify-center text-bloom-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-semibold text-rosewood-900">
                Tambah Goal Baru
              </h3>
              <p className="text-xs text-rosewood-500">
                Untuk bulan {formatMonthKeyIndonesian(selectedMonthKey)}
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label
                htmlFor="goal-title"
                className="block text-xs font-semibold uppercase tracking-wider text-rosewood-700 mb-1.5"
              >
                Judul Goal <span className="text-bloom-600">*</span>
              </label>
              <input
                id="goal-title"
                type="text"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  if (formError) setFormError('');
                }}
                placeholder="Contoh: Membaca 2 buku mindfulness"
                className="w-full rounded-2xl border border-bloom-200 bg-cream-50/40 px-4 py-2.5 text-sm text-rosewood-900 placeholder:text-rosewood-400 focus:outline-none focus:ring-2 focus:ring-bloom-300"
              />
            </div>

            <div>
              <label
                htmlFor="goal-desc"
                className="block text-xs font-semibold uppercase tracking-wider text-rosewood-700 mb-1.5"
              >
                Deskripsi / Langkah Kecil (Opsional)
              </label>
              <textarea
                id="goal-desc"
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Catat alasan atau langkah sederhana agar goal ini terasa ringan dijalankan..."
                className="w-full rounded-2xl border border-bloom-200 bg-cream-50/40 px-4 py-2.5 text-sm text-rosewood-900 placeholder:text-rosewood-400 focus:outline-none focus:ring-2 focus:ring-bloom-300 leading-relaxed"
              />
            </div>

            {formError && (
              <p className="text-xs text-rose-600 font-medium">{formError}</p>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-bloom-500 to-bloom-600 hover:from-bloom-600 hover:to-bloom-700 text-white shadow-bloom-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambahkan ke {formatMonthKeyIndonesian(selectedMonthKey)}</span>
            </button>
          </form>
        </section>

        {/* Daftar Checklist Goals Bulan Ini */}
        <section className="lg:col-span-7 rounded-3xl bg-white border border-bloom-200/80 p-6 sm:p-7 shadow-bloom">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-bloom-100">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-rosewood-900">
                Daftar Target ({formatMonthKeyIndonesian(selectedMonthKey)})
              </h3>
              <p className="text-xs text-rosewood-500">
                Centang target yang telah selesai, atau sesuaikan kapan saja
              </p>
            </div>

            {/* Filter Status */}
            <div className="inline-flex rounded-xl bg-cream-100 p-1 border border-bloom-200/60">
              {(
                [
                  { id: 'all', label: `Semua (${totalCount})` },
                  { id: 'pending', label: `Proses (${totalCount - completedCount})` },
                  { id: 'completed', label: `Selesai (${completedCount})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === tab.id
                      ? 'bg-white text-rosewood-900 shadow-sm'
                      : 'text-rosewood-600 hover:text-rosewood-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredMonthGoals.length === 0 ? (
            <div className="rounded-2xl bg-cream-50/70 border border-dashed border-bloom-200 p-10 text-center">
              <p className="text-2xl mb-2">🌱</p>
              <p className="text-sm font-semibold text-rosewood-900">
                {totalCount === 0
                  ? `Belum ada target untuk ${formatMonthKeyIndonesian(selectedMonthKey)}`
                  : 'Tidak ada target pada filter status ini'}
              </p>
              <p className="text-xs text-rosewood-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {totalCount === 0
                  ? 'Tambahkan target bulanan pertamamu melalui formulir di samping untuk mulai merancang bulan yang tenang.'
                  : 'Ubah filter di kanan atas untuk melihat daftar goal lainnya.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMonthGoals.map((goal) => {
                const isEditing = editingGoalId === goal.id;

                return (
                  <div
                    key={goal.id}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                      goal.is_completed
                        ? 'bg-gradient-to-r from-bloom-50/50 via-cream-50/60 to-white border-bloom-200/70'
                        : 'bg-white border-bloom-200 hover:border-bloom-300 shadow-bloom-sm'
                    }`}
                  >
                    {isEditing ? (
                      <form
                        onSubmit={(e) => handleSaveEditGoal(e, goal.id)}
                        className="space-y-3 animate-fade-in"
                      >
                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-rosewood-600 mb-1">
                            Judul Goal
                          </label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full rounded-xl border border-bloom-300 bg-white px-3.5 py-2 text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-bloom-300"
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-rosewood-600 mb-1">
                            Deskripsi Opsional
                          </label>
                          <textarea
                            rows={2}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full rounded-xl border border-bloom-300 bg-white px-3.5 py-2 text-xs text-rosewood-800 focus:outline-none focus:ring-2 focus:ring-bloom-300"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingGoalId(null)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-cream-200 text-rosewood-700"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Batal</span>
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-bloom-600 text-white hover:bg-bloom-700"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Simpan</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-start justify-between gap-3.5">
                        {/* Checklist Button & Content */}
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => onToggleGoal(goal.id)}
                            aria-label={
                              goal.is_completed
                                ? `Tandai "${goal.title}" belum selesai`
                                : `Tandai "${goal.title}" selesai`
                            }
                            className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                              goal.is_completed
                                ? 'bg-bloom-500 border-bloom-500 text-white shadow-sm'
                                : 'bg-white border-bloom-300 text-transparent hover:border-bloom-500'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          <div
                            onClick={() => onToggleGoal(goal.id)}
                            className="cursor-pointer flex-1 min-w-0"
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4
                                className={`text-sm font-semibold transition-colors ${
                                  goal.is_completed
                                    ? 'line-through text-rosewood-400'
                                    : 'text-rosewood-900'
                                }`}
                              >
                                {goal.title}
                              </h4>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  goal.is_completed
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-cream-100 text-rosewood-600 border border-cream-300'
                                }`}
                              >
                                {goal.is_completed ? (
                                  <>
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    <span>Selesai</span>
                                  </>
                                ) : (
                                  <>
                                    <Circle className="w-2.5 h-2.5" />
                                    <span>Belum Selesai</span>
                                  </>
                                )}
                              </span>
                            </div>

                            {goal.description && (
                              <p
                                className={`text-xs mt-1 leading-relaxed ${
                                  goal.is_completed ? 'text-rosewood-400' : 'text-rosewood-600'
                                }`}
                              >
                                {goal.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Aksi Edit & Hapus */}
                        <div className="flex items-center gap-1 shrink-0">
                          {confirmDeleteId === goal.id ? (
                            <div className="flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteGoal(goal.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="text-[11px] font-semibold text-rose-700 hover:underline"
                              >
                                Hapus
                              </button>
                              <span className="text-rose-300">|</span>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-[11px] text-rosewood-600"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditingGoal(goal)}
                                className="p-2 rounded-xl text-rosewood-500 hover:text-bloom-700 hover:bg-bloom-50 transition-colors"
                                title="Edit Goal"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(goal.id)}
                                className="p-2 rounded-xl text-rosewood-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Hapus Goal"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
