import { MOOD_OPTIONS } from '../data/initialData';
import { MoodId, MoodOption } from '../types/journal';

export function getGreetingByHour(date: Date): {
  greeting: string;
  timeLabel: string;
  calmingOpening: string;
} {
  const hour = date.getHours();

  if (hour >= 4 && hour < 11) {
    return {
      greeting: 'Selamat Pagi',
      timeLabel: 'Waktu Pagi yang Teduh',
      calmingOpening:
        'Ambil napas perlahan. Biarkan pagi ini dimulai dengan lembut, tanpa tergesa-gesa, dan penuh ruang untuk hal-hal yang bermakna bagi hatimu.',
    };
  }
  if (hour >= 11 && hour < 15) {
    return {
      greeting: 'Selamat Siang',
      timeLabel: 'Jeda Siang yang Tenang',
      calmingOpening:
        'Di tengah kesibukan hari ini, izinkan dirimu berhenti sejenak. Teguk air hangat, rilekskan bahumu, dan sadari setiap langkah yang sudah kamu lalui.',
    };
  }
  if (hour >= 15 && hour < 18) {
    return {
      greeting: 'Selamat Sore',
      timeLabel: 'Senja & Refleksi Lembut',
      calmingOpening:
        'Hari mulai melambat. Terima kasih sudah hadir dan berusaha sebaik mungkin hari ini—kini saatnya menurunkan ritme dengan penuh syukur.',
    };
  }
  return {
    greeting: 'Selamat Malam',
    timeLabel: 'Ruang Hening Malam Hari',
    calmingOpening:
      'Lepaskan beban yang tidak perlu kamu bawa tidur malam ini. Ruang ini aman untuk mengurai pikiran, merayakan ketenangan, dan memeluk dirimu sendiri.',
  };
}

export function formatIndonesianFullDate(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatYMDToIndonesian(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return ymd;
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatYMDShort(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return ymd;
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatMonthKeyIndonesian(monthKey: string): string {
  const [y, m] = monthKey.split('-').map(Number);
  if (!y || !m) return monthKey;
  const dateObj = new Date(y, m - 1, 1);
  return dateObj.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}

export function shiftMonthKey(monthKey: string, delta: number): string {
  const [y, m] = monthKey.split('-').map(Number);
  const dateObj = new Date(y, m - 1 + delta, 1);
  const nextY = dateObj.getFullYear();
  const nextM = String(dateObj.getMonth() + 1).padStart(2, '0');
  return `${nextY}-${nextM}`;
}

export function getMoodMeta(moodId: MoodId): MoodOption {
  return MOOD_OPTIONS.find((m) => m.id === moodId) || MOOD_OPTIONS[0];
}
