-- ============================================================================
-- EVERSOLUNA — SUPABASE DATABASE SCHEMA
-- Jalankan seluruh script ini di menu "SQL Editor" pada Dashboard Supabase.
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. TABEL DAILY REMINDERS (Afirmasi, Mindset & Prinsip Hidup)
create table if not exists public.daily_reminders (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('Afirmasi', 'Mindset', 'Prinsip Hidup')),
  text text not null,
  subtext text not null default 'Catatan pengingat pribadi',
  is_custom boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. TABEL FUTURE NOTES (Surat Waktu Pribadi & Nama Sapaan Pemilik)
create table if not exists public.future_notes (
  id text primary key default 'primary',
  owner_name text not null default 'Almira',
  title text not null,
  content text not null,
  target_date_label text not null,
  updated_at text not null default 'Baru saja diperbarui',
  updated_timestamp timestamptz not null default now()
);

-- 3. TABEL JOURNAL ENTRIES (Daily Journal: Mood, Syukur, Hal yang Dikurangi)
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null,
  mood text not null check (mood in ('super_happy', 'happy', 'sad', 'annoyed')),
  gratitude text not null default '-',
  to_reduce text not null default '-',
  created_at text not null,
  updated_at text not null,
  created_timestamp timestamptz not null default now()
);

create index if not exists idx_journal_entries_date
  on public.journal_entries (entry_date desc, created_timestamp desc);

-- 4. TABEL DIARY ENTRIES (Free Diary — Cerita & Pemikiran Bebas)
create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null,
  title text not null default 'Catatan Diary',
  content text not null,
  created_at text not null,
  updated_at text not null,
  created_timestamp timestamptz not null default now()
);

create index if not exists idx_diary_entries_date
  on public.diary_entries (entry_date desc, created_timestamp desc);

-- 5. TABEL MONTHLY GOALS (Target Bulanan & Riwayat Lintas Bulan)
create table if not exists public.monthly_goals (
  id uuid primary key default gen_random_uuid(),
  month_key text not null, -- Format YYYY-MM, contoh: '2026-10'
  title text not null,
  description text not null default '',
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_monthly_goals_month_key
  on public.monthly_goals (month_key, created_at asc);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES (KHUSUS AKUN PEMILIK TERAUTENTIKASI)
-- Hanya sesi yang sudah login via Supabase Auth (authenticated) yang diizinkan
-- membaca, menambah, mengubah, dan menghapus data.
-- ============================================================================

alter table public.daily_reminders enable row level security;
alter table public.future_notes enable row level security;
alter table public.journal_entries enable row level security;
alter table public.diary_entries enable row level security;
alter table public.monthly_goals enable row level security;

drop policy if exists "Allow all access to daily_reminders" on public.daily_reminders;
drop policy if exists "Owner authenticated access on daily_reminders" on public.daily_reminders;
create policy "Owner authenticated access on daily_reminders"
  on public.daily_reminders for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "Allow all access to future_notes" on public.future_notes;
drop policy if exists "Owner authenticated access on future_notes" on public.future_notes;
create policy "Owner authenticated access on future_notes"
  on public.future_notes for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "Allow all access to journal_entries" on public.journal_entries;
drop policy if exists "Owner authenticated access on journal_entries" on public.journal_entries;
create policy "Owner authenticated access on journal_entries"
  on public.journal_entries for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "Allow all access to diary_entries" on public.diary_entries;
drop policy if exists "Owner authenticated access on diary_entries" on public.diary_entries;
create policy "Owner authenticated access on diary_entries"
  on public.diary_entries for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "Allow all access to monthly_goals" on public.monthly_goals;
drop policy if exists "Owner authenticated access on monthly_goals" on public.monthly_goals;
create policy "Owner authenticated access on monthly_goals"
  on public.monthly_goals for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

revoke all on table public.daily_reminders from anon;
revoke all on table public.future_notes from anon;
revoke all on table public.journal_entries from anon;
revoke all on table public.diary_entries from anon;
revoke all on table public.monthly_goals from anon;

-- ============================================================================
-- DATA AWAL (DEFAULT REMINDERS & FUTURE NOTE)
-- ============================================================================

insert into public.future_notes (id, owner_name, title, content, target_date_label, updated_at)
values (
  'primary',
  'Almira',
  'Untuk Diriku di Masa Depan',
  'Terima kasih sudah bertahan dan memilih jalan yang lembut hari demi hari. Ingatlah bahwa kamu tidak harus menjadi sempurna untuk layak merasa damai. Saat kamu membaca catatan ini nanti, semoga hatimu semakin lapang, langkahmu semakin ringan, dan kamu bangga pada ketenangan yang sedang kamu bangun hari ini.',
  'Refleksi Akhir Tahun • Saat Membuka Kembali Ruang Ini',
  'Tersimpan di Supabase'
)
on conflict (id) do nothing;

insert into public.daily_reminders (category, text, subtext, is_custom)
select * from (
  values
    ('Afirmasi', 'Aku mengizinkan diriku bertumbuh dengan ritmeku sendiri, tanpa perlu terburu-buru menyamai langkah orang lain.', 'Melepas perbandingan sosial dan menghargai proses kecil setiap hari.', false),
    ('Mindset', 'Ketenangan bukanlah ketiadaan kesibukan, melainkan kemampuan menjaga ruang hening di dalam hati.', 'Tarik napas dalam sebelum bereaksi terhadap hal di luar kendali.', false),
    ('Prinsip Hidup', 'Batas yang sehat adalah bentuk kasih sayang paling jujur untuk menjaga energi dan ketulusanku.', 'Berkata tidak pada hal yang menguras jiwa berarti berkata ya pada kedamaian batin.', false),
    ('Afirmasi', 'Hari ini aku memilih hadir sepenuhnya—mensyukuri hal sederhana yang sudah ada di genggamanku.', 'Kebahagiaan sering kali bersembunyi di balik rutinitas pagi yang tenang.', false),
    ('Mindset', 'Istirahat bukanlah tanda kelemahan; bunga pun membutuhkan musim tenang sebelum kembali mekar.', 'Berikan jeda tanpa rasa bersalah saat tubuh dan pikiran memberi sinyal lelah.', false),
    ('Prinsip Hidup', 'Rawat pikiran sebagaimana merawat taman pribadi: cabut kekhawatiran berlebih, sirami rasa syukur.', 'Apa yang kita beri perhatian setiap hari akan tumbuh menjadi realitas batin kita.', false)
) as seed(category, text, subtext, is_custom)
where not exists (select 1 from public.daily_reminders limit 1);
