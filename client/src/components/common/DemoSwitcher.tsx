import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Sparkles,
  UserCheck,
  Briefcase,
  ShieldCheck,
  QrCode,
  TrendingUp,
  BarChart3,
  X,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

export const DemoSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loginDemoPersona } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSwitchPersona = async (role: 'CUSTOMER' | 'WORKER' | 'SOCIETY_ADMIN', targetRoute: string) => {
    await loginDemoPersona(role);
    navigate(targetRoute);
    setIsOpen(false);
  };

  return (
    <>
      {/* Global Top Banner: DEMO MODE Indicator */}
      <div className="bg-gradient-to-r from-amber-600 via-coop-700 to-amber-700 text-white text-xs py-1.5 px-4 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2 font-medium">
          <span className="bg-amber-400/30 text-amber-100 uppercase tracking-widest text-[10px] px-2 py-0.5 rounded font-bold border border-amber-300/40">
            {t('app.demoMode')}
          </span>
          <span className="hidden sm:inline text-amber-100">
            Sahakar Seva • Cooperative Gig Services Platform (Problem Statement 26089)
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {/* Active Persona indicator */}
          <div className="flex items-center space-x-1.5 bg-black/20 px-2 py-0.5 rounded text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              {user?.role === 'CUSTOMER' && 'Customer: Sunita Sharma'}
              {user?.role === 'WORKER' && 'Worker: Ramesh Kumar (Gold)'}
              {(user?.role === 'SOCIETY_ADMIN' || user?.role === 'FEDERATION_ADMIN') && 'Admin: Varanasi Coop'}
              {!user && 'Guest'}
            </span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="bg-white/20 hover:bg-white/30 text-white font-medium px-2 py-0.5 rounded text-[11px] transition flex items-center space-x-1"
            title="Switch Language (English / हिन्दी)"
          >
            <span>🌐</span>
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Floating Hackathon Demo Launcher Button */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-900 text-amber-400 hover:bg-black font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-2xl border border-amber-500/50 flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all group"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>🎯 Hackathon Demo</span>
          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Modal / Popover drawer */}
        {isOpen && (
          <div className="absolute bottom-12 right-0 w-80 sm:w-96 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 p-5 mt-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-sm text-white">Judge & Evaluator Showcase</h4>
                  <p className="text-[11px] text-slate-400">1-Click instant walkthrough shortcuts</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <p className="text-[11px] text-slate-400 font-medium">PERSONA SWITCHER:</p>
              
              <button
                onClick={() => handleSwitchPersona('CUSTOMER', '/customer/dashboard')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition ${
                  user?.role === 'CUSTOMER'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Customer Demo</div>
                    <div className="text-[10px] text-slate-400">Sunita Sharma (Bookings, Invoices, Ratings)</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">9999999999</span>
              </button>

              <button
                onClick={() => handleSwitchPersona('WORKER', '/worker/dashboard')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition ${
                  user?.role === 'WORKER'
                    ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Worker Demo</div>
                    <div className="text-[10px] text-slate-400">Ramesh Kumar (Job Requests, Skill Graph, ID Card)</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-400">8888888888</span>
              </button>

              <button
                onClick={() => handleSwitchPersona('SOCIETY_ADMIN', '/admin/dashboard')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition ${
                  user?.role === 'SOCIETY_ADMIN' || user?.role === 'FEDERATION_ADMIN'
                    ? 'bg-blue-950/60 border-blue-500 text-blue-200'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Society Admin Demo</div>
                    <div className="text-[10px] text-slate-400">Dr. Rajesh Tripathi (Verifications, Societies)</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-blue-400">7777777777</span>
              </button>

              <div className="pt-2 border-t border-slate-800">
                <p className="text-[11px] text-slate-400 font-medium mb-1.5">FEATURE DIRECT LINKS:</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      navigate('/verify-worker/SKR-EL-10291-VERIFIED');
                      setIsOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-center transition"
                  >
                    <QrCode className="w-4 h-4 text-purple-400 mb-1" />
                    <span className="text-[10px]">QR Verification</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/admin/forecast');
                      setIsOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-center transition"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400 mb-1" />
                    <span className="text-[10px]">AI Forecast</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/admin/analytics');
                      setIsOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-center transition"
                  >
                    <BarChart3 className="w-4 h-4 text-sky-400 mb-1" />
                    <span className="text-[10px]">Analytics</span>
                  </button>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] flex items-start space-x-1.5 mt-2">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>All actions (Book, Accept, Pay, Verify, Rate) update live data in real time. Mock OTP is <b>123456</b>.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
