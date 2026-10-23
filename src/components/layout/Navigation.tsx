import React from 'react';
import {
  BookHeart,
  Feather,
  Sparkles,
  Target,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { PageId } from '../../types/journal';

interface NavigationProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  hasJournalToday: boolean;
  diaryCount: number;
  currentMonthGoalsSummary: {
    completed: number;
    total: number;
  };
  ownerName: string;
  isConnectedToSupabase?: boolean;
  userEmail?: string;
  onLogout: () => void;
}

const NAV_ITEMS: {
  id: PageId;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'home',
    label: 'Daily Reminder',
    subtitle: 'Beranda & ketenangan hari ini',
    icon: Sparkles,
  },
  {
    id: 'journal',
    label: 'Daily Journal',
    subtitle: 'Mood, syukur & evaluasi',
    icon: BookHeart,
  },
  {
    id: 'diary',
    label: 'Free Diary',
    subtitle: 'Ruang cerita & pikiran bebas',
    icon: Feather,
  },
  {
    id: 'goals',
    label: 'Monthly Goals',
    subtitle: 'Niat & langkah bulanan',
    icon: Target,
  },
];

/**
 * Ikon bulan sabit dan bintang kecil minimalis berwarna soft pink / mauve
 * untuk ditampilkan sejajar horizontal di sebelah kanan tulisan "Eversoluna".
 */
const CrescentMoonStarIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Bulan Sabit Lembut */}
    <path
      d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.18"
    />
    {/* Bintang Kecil di Kanan Atas Bulan */}
    <path
      d="M17.5 3.5L18.15 5.35L20 6L18.15 6.65L17.5 8.5L16.85 6.65L15 6L16.85 5.35L17.5 3.5Z"
      fill="currentColor"
    />
  </svg>
);

export const Navigation: React.FC<NavigationProps> = ({
  activePage,
  onNavigate,
  hasJournalToday,
  diaryCount,
  currentMonthGoalsSummary,
  isConnectedToSupabase = false,
  userEmail,
  onLogout,
}) => {
  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-gradient-to-b from-white via-cream-50/90 to-bloom-50/70 border-r border-bloom-200/70 px-6 py-8 select-none z-30">
        {/* Brand Header (Avatar Foto Asli + Eversoluna + Ikon Bulan Bintang di Kanan) */}
        <div className="flex items-center gap-3.5 px-2 mb-10">
          <div className="w-11 h-11 rounded-2xl overflow-hidden border border-bloom-300/80 bg-bloom-100/60 shadow-bloom-sm shrink-0">
            <img
              src="/eversoluna-avatar.png"
              alt="Eversoluna Avatar"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="inline-flex items-center gap-2 min-w-0">
            <h1 className="font-serif text-[26px] font-semibold tracking-tight text-rosewood-900 leading-none truncate">
              Eversoluna
            </h1>
            <CrescentMoonStarIcon className="w-5 h-5 text-bloom-600 shrink-0 -mt-0.5" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2 flex-1" aria-label="Menu Utama">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-widest text-rosewood-400 mb-3">
            Menu Utama
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`w-full group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 border ${
                  isActive
                    ? 'bg-gradient-to-r from-bloom-100/90 via-bloom-50 to-white border-bloom-300/80 text-rosewood-900 shadow-bloom-sm'
                    : 'bg-transparent border-transparent text-rosewood-700 hover:bg-white/80 hover:border-bloom-200/60 hover:text-rosewood-900'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                    isActive
                      ? 'bg-bloom-500 text-white shadow-sm'
                      : 'bg-bloom-100/70 text-bloom-700 group-hover:bg-bloom-200/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold truncate">{item.label}</span>
                    {item.id === 'journal' && hasJournalToday && (
                      <span
                        title="Jurnal hari ini sudah terisi"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Terisi
                      </span>
                    )}
                    {item.id === 'diary' && diaryCount > 0 && (
                      <span className="text-[11px] font-medium text-rosewood-600 bg-cream-200/80 px-2 py-0.5 rounded-full">
                        {diaryCount}
                      </span>
                    )}
                    {item.id === 'goals' && currentMonthGoalsSummary.total > 0 && (
                      <span className="text-[11px] font-medium text-bloom-700 bg-bloom-100/80 px-2 py-0.5 rounded-full">
                        {currentMonthGoalsSummary.completed}/{currentMonthGoalsSummary.total}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-rosewood-500 truncate mt-0.5">{item.subtitle}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Subtle Daily Status Card & Logout Button at Bottom of Sidebar */}
        <div className="mt-auto pt-6 border-t border-bloom-200/50 space-y-3">
          <div className="rounded-2xl bg-gradient-to-br from-white via-cream-50 to-bloom-50/60 border border-bloom-200/70 p-4 shadow-bloom-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-rosewood-800">Status Hari Ini</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  hasJournalToday ? 'bg-emerald-500' : 'bg-bloom-400 animate-pulse-soft'
                }`}
              />
            </div>
            <p className="text-xs text-rosewood-600 leading-relaxed">
              {hasJournalToday
                ? 'Jurnal hari ini sudah terisi. Kamu bebas menulis cerita tambahan di Free Diary.'
                : 'Luangkan sejenak hari ini untuk mengisi Daily Journal.'}
            </p>
            <div className="mt-3 pt-2.5 border-t border-bloom-100 flex items-center justify-between text-[11px] text-rosewood-400">
              <span className="truncate max-w-[110px]" title={userEmail}>
                {userEmail || 'Database'}
              </span>
              <span
                className={`font-medium shrink-0 ${
                  isConnectedToSupabase ? 'text-emerald-600' : 'text-bloom-600'
                }`}
              >
                {isConnectedToSupabase ? 'Supabase Aktif' : 'Mode Lokal'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold text-rosewood-700 hover:text-rose-700 bg-white/90 hover:bg-rose-50/80 border border-bloom-200/80 hover:border-rose-200 transition-all shadow-bloom-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile & Tablet Top Bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-bloom-200/70 px-4 py-3.5">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-bloom-300/80 bg-bloom-100/60 shadow-bloom-sm shrink-0">
              <img
                src="/eversoluna-avatar.png"
                alt="Eversoluna Avatar"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 min-w-0">
              <h1 className="font-serif text-2xl font-semibold text-rosewood-900 leading-none truncate">
                Eversoluna
              </h1>
              <CrescentMoonStarIcon className="w-4 h-4 text-bloom-600 shrink-0 -mt-0.5" />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                hasJournalToday
                  ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200'
                  : 'bg-bloom-50 text-bloom-800 border-bloom-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  hasJournalToday ? 'bg-emerald-500' : 'bg-bloom-500'
                }`}
              />
              {hasJournalToday ? 'Jurnal Terisi' : 'Belum Isi Jurnal'}
            </span>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rosewood-700 hover:text-rose-700 bg-cream-100/90 hover:bg-rose-50 border border-bloom-200/80 transition-colors"
              title="Keluar dari sesi"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Bottom Navigation Bar */}
      <nav
        aria-label="Navigasi Mobile"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-bloom-200/80 px-2 py-2 shadow-bloom-lg"
      >
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-bloom-100/90 text-rosewood-900 font-semibold'
                    : 'text-rosewood-500 hover:text-rosewood-800 hover:bg-bloom-50/60'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'text-bloom-700 scale-105' : 'text-rosewood-500'
                    }`}
                  />
                  {item.id === 'journal' && hasJournalToday && (
                    <span className="absolute -top-0.5 -right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
