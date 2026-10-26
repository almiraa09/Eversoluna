-- Migration: Tambah kolom is_pinned pada tabel diary_entries
-- Jalankan di SQL Editor Supabase jika tabel sudah dibuat sebelumnya

alter table public.diary_entries
  add column if not exists is_pinned boolean not null default false;

create index if not exists idx_diary_entries_date
  on public.diary_entries (is_pinned desc, entry_date desc, created_timestamp desc);
