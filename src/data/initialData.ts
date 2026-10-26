import {
  DailyReminder,
  DiaryEntry,
  FutureNote,
  JournalEntry,
  MonthlyGoal,
  MoodOption,
} from '../types/journal';

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'super_happy',
    label: 'Super Happy',
    subtitle: 'Full senyum & berenergi',
    dotColor: 'bg-bloom-500',
    badgeClass: 'bg-bloom-100 text-bloom-800 border-bloom-300',
    ringClass: 'ring-bloom-400 bg-bloom-100/80 border-bloom-400',
  },
  {
    id: 'happy',
    label: 'Happy',
    subtitle: 'Tenang, nyaman & good mood',
    dotColor: 'bg-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    ringClass: 'ring-emerald-300 bg-emerald-50/70 border-emerald-300',
  },
  {
    id: 'sad',
    label: 'Sad',
    subtitle: 'Lagi sendu & butuh ruang tenang',
    dotColor: 'bg-sky-400',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    ringClass: 'ring-sky-300 bg-sky-50/70 border-sky-300',
  },
  {
    id: 'annoyed',
    label: 'Annoyed',
    subtitle: 'Kesal, capek & kurang nyaman',
    dotColor: 'bg-rose-400',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    ringClass: 'ring-rose-300 bg-rose-50/70 border-rose-300',
  },
];

export const DEFAULT_REMINDERS: DailyReminder[] = [
  {
    id: 'rem-1',
    category: 'Afirmasi',
    text: 'Aku mengizinkan diriku bertumbuh dengan ritmeku sendiri, tanpa perlu terburu-buru menyamai langkah orang lain.',
    subtext: 'Melepas perbandingan sosial dan menghargai proses kecil setiap hari.',
  },
  {
    id: 'rem-2',
    category: 'Mindset',
    text: 'Ketenangan bukanlah ketiadaan kesibukan, melainkan kemampuan menjaga ruang hening di dalam hati.',
    subtext: 'Tarik napas dalam sebelum bereaksi terhadap hal di luar kendali.',
  },
  {
    id: 'rem-3',
    category: 'Prinsip Hidup',
    text: 'Batas yang sehat adalah bentuk kasih sayang paling jujur untuk menjaga energi dan ketulusanku.',
    subtext: 'Berkata tidak pada hal yang menguras jiwa berarti berkata ya pada kedamaian batin.',
  },
  {
    id: 'rem-4',
    category: 'Afirmasi',
    text: 'Hari ini aku memilih hadir sepenuhnya—mensyukuri hal sederhana yang sudah ada di genggamanku.',
    subtext: 'Kebahagiaan sering kali bersembunyi di balik rutinitas pagi yang tenang.',
  },
  {
    id: 'rem-5',
    category: 'Mindset',
    text: 'Istirahat bukanlah tanda kelemahan; bunga pun membutuhkan musim tenang sebelum kembali mekar.',
    subtext: 'Berikan jeda tanpa rasa bersalah saat tubuh dan pikiran memberi sinyal lelah.',
  },
  {
    id: 'rem-6',
    category: 'Prinsip Hidup',
    text: 'Rawat pikiran sebagaimana merawat taman pribadi: cabut kekhawatiran berlebih, sirami rasa syukur.',
    subtext: 'Apa yang kita beri perhatian setiap hari akan tumbuh menjadi realitas batin kita.',
  },
];

export function formatDateToYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getOffsetMonthKey(baseDate: Date, monthOffset: number): string {
  const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1);
  return formatMonthKey(d);
}

export function getOffsetDateYMD(baseDate: Date, dayOffset: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + dayOffset);
  return formatDateToYMD(d);
}

export function buildInitialJournals(now: Date): JournalEntry[] {
  const today = formatDateToYMD(now);
  const yesterday = getOffsetDateYMD(now, -1);
  const threeDaysAgo = getOffsetDateYMD(now, -3);

  return [
    {
      id: 'j-seed-1',
      entry_date: today,
      mood: 'happy',
      gratitude:
        'Secangkir teh hangat di pagi hari, kamar yang rapi, dan waktu tenang sebelum mulai beraktivitas.',
      to_reduce:
        'Buka media sosial tepat setelah bangun tidur dan overthinking hal yang belum tentu kejadian.',
      created_at: '07:30',
      updated_at: '07:30',
    },
    {
      id: 'j-seed-2',
      entry_date: yesterday,
      mood: 'super_happy',
      gratitude:
        'Ngobrol singkat yang seru, berhasil beresin fokus utama hari ini, dan bisa istirahat tepat waktu.',
      to_reduce:
        'Menunda jam tidur malam cuma karena pengen beresin semuanya sekaligus.',
      created_at: '21:15',
      updated_at: '21:15',
    },
    {
      id: 'j-seed-3',
      entry_date: threeDaysAgo,
      mood: 'annoyed',
      gratitude:
        'Hujan sore yang adem dan sempat baca buku favorit selama 20 menit.',
      to_reduce:
        'Mengiyakan ajakan atau permintaan mendadak pas jadwal sendiri lagi padat.',
      created_at: '20:40',
      updated_at: '20:40',
    },
  ];
}

export function buildInitialDiaries(now: Date): DiaryEntry[] {
  const today = formatDateToYMD(now);
  const twoDaysAgo = getOffsetDateYMD(now, -2);

  return [
    {
      id: 'd-seed-1',
      entry_date: today,
      title: 'Memulai hari dengan lebih pelan',
      content:
        'Hari ini rasanya jauh lebih ringan. Aku sadar kalau pagi hari nggak langsung buru-buru cek notifikasi HP, kepala jadi punya ruang buat bernapas. Nggak semua hal harus direspons saat itu juga. Semoga sisa hari ini tetap tenang dan nyaman.',
      is_pinned: false,
      created_at: '08:00',
      updated_at: '08:00',
    },
    {
      id: 'd-seed-2',
      entry_date: twoDaysAgo,
      title: 'Catatan kecil soal batasan diri',
      content:
        'Minggu ini sempat ngerasa agak keteteran karena terlalu banyak hal yang pengen diberesin barengan. Tapi setelah ditulis satu-satu di sini, ternyata nggak serumit yang ada di pikiran. Pelan-pelan belajar buat bilang cukup dan istirahat pas badan udah kasih sinyal capek.',
      is_pinned: false,
      created_at: '21:30',
      updated_at: '21:30',
    },
  ];
}

export function buildInitialGoals(now: Date): MonthlyGoal[] {
  const currentMonth = formatMonthKey(now);
  const prevMonth = getOffsetMonthKey(now, -1);
  const nextMonth = getOffsetMonthKey(now, 1);

  return [
    // Bulan Ini
    {
      id: 'g-curr-1',
      month_key: currentMonth,
      title: 'Menulis Daily Journal minimal 20 hari bulan ini',
      description: 'Meluangkan beberapa menit setiap hari untuk cek mood dan rasa syukur.',
      is_completed: true,
      created_at: '2026-10-01T08:00:00Z',
    },
    {
      id: 'g-curr-2',
      month_key: currentMonth,
      title: 'Rutinitas pagi tanpa layar (No-Screen Morning) 30 menit pertama',
      description: 'Minum air hangat dan peregangan ringan sebelum menyentuh ponsel.',
      is_completed: true,
      created_at: '2026-10-01T08:05:00Z',
    },
    {
      id: 'g-curr-3',
      month_key: currentMonth,
      title: 'Menyelesaikan 2 buku bacaan favorit',
      description: 'Membaca minimal 10 halaman setiap malam sebelum tidur.',
      is_completed: false,
      created_at: '2026-10-02T09:00:00Z',
    },
    {
      id: 'g-curr-4',
      month_key: currentMonth,
      title: 'Decluttering meja kerja dan kamar setiap akhir pekan',
      description: 'Menjaga ruang fisik tetap bersih dan lega agar pikiran ikut jernih.',
      is_completed: true,
      created_at: '2026-10-03T10:00:00Z',
    },
    {
      id: 'g-curr-5',
      month_key: currentMonth,
      title: 'Olahraga ringan / jalan pagi 3 kali seminggu',
      description: 'Fokus pada kebugaran tubuh, bukan intensitas yang membebani.',
      is_completed: false,
      created_at: '2026-10-04T07:00:00Z',
    },

    // Bulan Sebelumnya
    {
      id: 'g-prev-1',
      month_key: prevMonth,
      title: 'Tidur sebelum pukul 22.30 di hari kerja',
      description: 'Membangun kualitas istirahat malam yang konsisten.',
      is_completed: true,
      created_at: '2026-09-01T08:00:00Z',
    },
    {
      id: 'g-prev-2',
      month_key: prevMonth,
      title: 'Mengurangi konsumsi kafein berlebih di sore hari',
      description: 'Mengganti kopi sore dengan teh chamomile atau air mineral.',
      is_completed: true,
      created_at: '2026-09-02T08:00:00Z',
    },
    {
      id: 'g-prev-3',
      month_key: prevMonth,
      title: 'Menyusun anggaran pribadi yang rapi',
      description: 'Mencatat pengeluaran esensial dan ruang tabungan masa depan.',
      is_completed: true,
      created_at: '2026-09-05T08:00:00Z',
    },
    {
      id: 'g-prev-4',
      month_key: prevMonth,
      title: 'Jeda istirahat mata dari layar setiap sore',
      description: 'Berhenti sejenak 10 menit setelah selesai beraktivitas.',
      is_completed: false,
      created_at: '2026-09-07T08:00:00Z',
    },

    // Bulan Berikutnya
    {
      id: 'g-next-1',
      month_key: nextMonth,
      title: 'Membuat evaluasi refleksi akhir tahun secara tertulis',
      description: 'Merayakan pertumbuhan dan pelajaran berharga sepanjang tahun.',
      is_completed: false,
      created_at: '2026-10-20T08:00:00Z',
    },
    {
      id: 'g-next-2',
      month_key: nextMonth,
      title: 'Detoks digital 1 hari setiap akhir pekan',
      description: 'Menghabiskan waktu dengan hal-hal offline yang menenangkan.',
      is_completed: false,
      created_at: '2026-10-20T08:10:00Z',
    },
  ];
}

export const INITIAL_FUTURE_NOTE: FutureNote = {
  id: 'fn-1',
  title: 'Untuk Diriku di Masa Depan',
  content:
    'Terima kasih sudah bertahan dan memilih jalan yang lembut hari demi hari. Ingatlah bahwa kamu tidak harus menjadi sempurna untuk layak merasa damai. Saat kamu membaca catatan ini nanti, semoga hatimu semakin lapang, langkahmu semakin ringan, dan kamu bangga pada ketenangan yang sedang kamu bangun hari ini.',
  targetDateLabel: 'Refleksi Akhir Tahun • Saat Membuka Kembali Ruang Ini',
  updatedAt: 'Baru saja diperbarui',
};
