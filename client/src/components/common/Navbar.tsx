import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  ShieldCheck,
  Zap,
  PhoneCall,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Award,
  IdCard,
  Briefcase
} from 'lucide-react';

interface NavbarProps {
  onOpenEmergencyModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEmergencyModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, worker, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'WORKER') return '/worker/dashboard';
    if (user.role === 'SOCIETY_ADMIN' || user.role === 'FEDERATION_ADMIN') return '/admin/dashboard';
    return '/customer/dashboard';
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-7 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-coop-700 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:bg-coop-800 transition">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center">
                {t('app.name')}
                <span className="ml-1.5 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-coop-100 text-coop-800 border border-coop-200">
                  Cooperative
                </span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                {t('app.tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-700">
            <Link to="/services" className="hover:text-coop-700 transition">
              {t('nav.services')}
            </Link>
            <Link to="/#how-it-works" className="hover:text-coop-700 transition">
              {t('nav.howItWorks')}
            </Link>
            <Link to="/verify-worker/SKR-EL-10291-VERIFIED" className="hover:text-coop-700 transition flex items-center space-x-1 text-coop-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-coop-600" />
              <span>Verify Worker ID</span>
            </Link>

            {/* Emergency Service Button */}
            <button
              onClick={() => onOpenEmergencyModal ? onOpenEmergencyModal() : navigate('/services?emergency=true')}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-sm flex items-center space-x-1.5 transition animate-pulse hover:animate-none"
            >
              <span>🚨</span>
              <span>{t('app.emergencyBtn')}</span>
            </button>
          </div>

          {/* User Status / Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-medium text-slate-700 flex items-center space-x-1"
            >
              <span>🌐</span>
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-2 bg-coop-50 hover:bg-coop-100 text-coop-800 px-3 py-1.5 rounded-xl border border-coop-200 transition text-xs font-semibold"
                >
                  <img
                    src={user.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-coop-300"
                  />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-coop-700 px-3 py-1.5"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register?role=WORKER"
                  className="bg-coop-700 hover:bg-coop-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs"
                >
                  {t('nav.joinWorker')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => onOpenEmergencyModal ? onOpenEmergencyModal() : navigate('/services?emergency=true')}
              className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full"
            >
              🚨 Emergency
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Language:</span>
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-xs px-3 py-1 rounded-md bg-slate-100 font-semibold"
            >
              🌐 {language === 'en' ? 'Switch to हिन्दी' : 'Switch to English'}
            </button>
          </div>

          {user && (
            <div className="p-3 bg-coop-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <img
                  src={user.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900">{user.name}</div>
                  <div className="text-[11px] text-coop-800 font-medium">{user.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 font-semibold"
              >
                Logout
              </button>
            </div>
          )}

          <div className="space-y-1 text-sm font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              {t('nav.services')}
            </Link>
            <Link
              to={getDashboardLink()}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-coop-700 font-semibold hover:bg-coop-50"
            >
              {t('nav.dashboard')}
            </Link>
            <Link
              to="/verify-worker/SKR-EL-10291-VERIFIED"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Scan & Verify Worker ID
            </Link>
          </div>

          {!user && (
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold border border-slate-300 rounded-xl"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register?role=WORKER"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold bg-coop-700 text-white rounded-xl"
              >
                {t('nav.joinWorker')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
