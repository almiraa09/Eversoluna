import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY
)?.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('project-id-kamu')
);

/**
 * Konfigurasi Supabase Client yang aman untuk frontend (hanya menggunakan publishable/anon key).
 * Sesi login disimpan di browser (persistSession: true, autoRefreshToken: true)
 * sehingga tetap bertahan di laptop maupun HP tanpa membuat akun otomatis.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'eversoluna_auth_session',
      },
    })
  : null;
