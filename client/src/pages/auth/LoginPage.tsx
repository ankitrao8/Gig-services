import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ShieldCheck, Phone, KeyRound, ArrowRight, UserCheck, Briefcase, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, loginDemoPersona } = useAuth();
  const { t } = useLanguage();

  const [phone, setPhone] = useState('9999999999');
  const [otp, setOtp] = useState('123456');
  const [useOtp, setUseOtp] = useState(true);
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await login(phone, useOtp ? otp : undefined, !useOtp ? password : undefined);
    setIsLoading(false);

    if (res.success) {
      // Redirect based on role or default
      if (phone === '8888888888') {
        navigate('/worker/dashboard');
      } else if (phone === '7777777777') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } else {
      setError(res.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleDemoPreset = (role: 'CUSTOMER' | 'WORKER' | 'SOCIETY_ADMIN') => {
    if (role === 'CUSTOMER') {
      setPhone('9999999999');
      setOtp('123456');
    } else if (role === 'WORKER') {
      setPhone('8888888888');
      setOtp('123456');
    } else if (role === 'SOCIETY_ADMIN') {
      setPhone('7777777777');
      setOtp('123456');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-coop-700 text-white flex items-center justify-center font-black mx-auto mb-3 shadow-md">
          <ShieldCheck className="w-7 h-7 text-amber-300" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Sign In to Sahakar Seva
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Cooperative Gig Services Portal • Varanasi District Federation
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Demo Fast-Fill Bar */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Select Demo Persona (Instant Fill):</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoPreset('CUSTOMER')}
              className="py-1.5 px-2 bg-white hover:bg-amber-100 rounded-lg border border-amber-300 text-[11px] font-bold text-amber-900 text-center transition"
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoPreset('WORKER')}
              className="py-1.5 px-2 bg-white hover:bg-amber-100 rounded-lg border border-amber-300 text-[11px] font-bold text-amber-900 text-center transition"
            >
              🔨 Worker
            </button>
            <button
              type="button"
              onClick={() => handleDemoPreset('SOCIETY_ADMIN')}
              className="py-1.5 px-2 bg-white hover:bg-amber-100 rounded-lg border border-amber-300 text-[11px] font-bold text-amber-900 text-center transition"
            >
              🏛️ Admin
            </button>
          </div>
        </div>

        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                  +91
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
                  placeholder="9999999999"
                />
              </div>
            </div>

            {useOtp ? (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    One-Time Password (OTP)
                  </label>
                  <span className="text-[10px] text-coop-700 font-bold">Demo OTP: 123456</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-center tracking-widest font-mono text-base font-bold focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
                  placeholder="123456"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
                />
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setUseOtp(!useOtp)}
                className="text-coop-700 hover:text-coop-800 font-semibold"
              >
                {useOtp ? 'Sign in with Password instead' : 'Sign in with Phone OTP'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-coop-700 hover:bg-coop-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'Verifying...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-coop-700 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
