-- ============================================================================
-- EVERSOLUNA — MIGRASI KEAMANAN RLS KHUSUS AKUN PEMILIK (AUTHENTICATED ONLY)
-- Jalankan script ini di menu "SQL Editor" pada Dashboard Supabase.
-- ============================================================================
-- Script ini mencabut akses publik/anonim (anon) dan mengunci seluruh tabel
-- agar HANYA pengguna yang sudah login (authenticated / akun pemilik)
-- yang dapat membaca, menambah, mengubah, dan menghapus data.
-- ============================================================================

-- 1. Pastikan RLS aktif di semua tabel pribadi
alter table public.daily_reminders enable row level security;
alter table public.future_notes enable row level security;
alter table public.journal_entries enable row level security;
alter table public.diary_entries enable row level security;
alter table public.monthly_goals enable row level security;

-- 2. Hapus policy publik lama (yang sebelumnya mengizinkan role anon)
drop policy if exists "Allow all access to daily_reminders" on public.daily_reminders;
drop policy if exists "Allow all access to future_notes" on public.future_notes;
drop policy if exists "Allow all access to journal_entries" on public.journal_entries;
drop policy if exists "Allow all access to diary_entries" on public.diary_entries;
drop policy if exists "Allow all access to monthly_goals" on public.monthly_goals;

-- Hapus juga jika policy pemilik sudah pernah dibuat sebelumnya (supaya idempoten)
drop policy if exists "Owner authenticated access on daily_reminders" on public.daily_reminders;
drop policy if exists "Owner authenticated access on future_notes" on public.future_notes;
drop policy if exists "Owner authenticated access on journal_entries" on public.journal_entries;
drop policy if exists "Owner authenticated access on diary_entries" on public.diary_entries;
drop policy if exists "Owner authenticated access on monthly_goals" on public.monthly_goals;

-- 3. Buat policy baru: HANYA untuk role `authenticated` (wajib memiliki sesi login valid)
create policy "Owner authenticated access on daily_reminders"
  on public.daily_reminders
  for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Owner authenticated access on future_notes"
  on public.future_notes
  for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Owner authenticated access on journal_entries"
  on public.journal_entries
  for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Owner authenticated access on diary_entries"
  on public.diary_entries
  for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Owner authenticated access on monthly_goals"
  on public.monthly_goals
  for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- 4. Cabut hak akses tabel dari role `anon` (pengunjung yang belum login)
revoke all on table public.daily_reminders from anon;
revoke all on table public.future_notes from anon;
revoke all on table public.journal_entries from anon;
revoke all on table public.diary_entries from anon;
revoke all on table public.monthly_goals from anon;

grant all on table public.daily_reminders to authenticated;
grant all on table public.future_notes to authenticated;
grant all on table public.journal_entries to authenticated;
grant all on table public.diary_entries to authenticated;
grant all on table public.monthly_goals to authenticated;
