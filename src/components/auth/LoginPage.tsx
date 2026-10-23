import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const CrescentMoonStarIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.18"
    />
    <path
      d="M17.5 3.5L18.15 5.35L20 6L18.15 6.65L17.5 8.5L16.85 6.65L15 6L16.85 5.35L17.5 3.5Z"
      fill="currentColor"
    />
  </svg>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Masukkan email dan password akun pemilik.');
      return;
    }

    if (!supabase) {
      setErrorMessage('Konfigurasi Supabase belum ditemukan pada file .env.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error || !data.session) {
        if (
          error?.message?.toLowerCase().includes('invalid login credentials')
        ) {
          setErrorMessage('Email atau password tidak sesuai.');
        } else {
          setErrorMessage(
            error?.message || 'Gagal masuk. Periksa kembali akun pemilikmu.'
          );
        }
        return;
      }

      onLoginSuccess();
    } catch {
      setErrorMessage('Terjadi kendala jaringan saat menghubungi server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-50 via-cream-50 to-white flex flex-col justify-center items-center px-4 py-10 text-rosewood-900 select-none">
      <div className="w-full max-w-md animate-fade-in">
        {/* Card Login Utama */}
        <div className="rounded-3xl bg-gradient-to-b from-white via-white to-bloom-50/40 border border-bloom-200/80 p-7 sm:p-10 shadow-bloom-lg">
          {/* Brand Identity Eversoluna */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-bloom-300/80 bg-bloom-100/60 shadow-bloom mb-4">
              <img
                src="/eversoluna-avatar.png"
                alt="Eversoluna Avatar"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="inline-flex items-center gap-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-rosewood-900 leading-none">
                Eversoluna
              </h1>
              <CrescentMoonStarIcon className="w-5 h-5 text-bloom-600 shrink-0 -mt-0.5" />
            </div>

            <p className="text-xs sm:text-sm text-rosewood-500 mt-2">
              Ruang pribadi khusus pemilik. Silakan masuk untuk melanjutkan.
            </p>
          </div>

          {/* Form Login (Tanpa Sign Up / Registrasi Publik) */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold uppercase tracking-wider text-rosewood-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-bloom-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="nama@email.com"
                  className="w-full rounded-2xl border border-bloom-200 bg-cream-50/50 pl-11 pr-4 py-3 text-sm text-rosewood-900 placeholder:text-rosewood-400 focus:outline-none focus:ring-2 focus:ring-bloom-300 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold uppercase tracking-wider text-rosewood-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-bloom-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-bloom-200 bg-cream-50/50 pl-11 pr-11 py-3 text-sm text-rosewood-900 placeholder:text-rosewood-400 focus:outline-none focus:ring-2 focus:ring-bloom-300 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-rosewood-400 hover:text-rosewood-700 transition-colors"
                  aria-label={
                    showPassword ? 'Sembunyikan password' : 'Tampilkan password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-700 font-medium flex items-center gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold bg-gradient-to-r from-bloom-500 to-bloom-600 hover:from-bloom-600 hover:to-bloom-700 disabled:opacity-60 text-white shadow-bloom-sm transition-all"
            >
              <span>{isLoading ? 'Memverifikasi Sesi...' : 'Login'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-7 pt-5 border-t border-bloom-100 text-center">
            <p className="text-[11px] text-rosewood-400">
              Akses privat terlindungi • Hanya untuk akun pemilik Eversoluna
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
