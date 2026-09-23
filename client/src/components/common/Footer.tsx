import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-coop-600 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {t('app.name')}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('app.subTagline')}
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 flex items-center space-x-2">
              <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cooperative Owned • Fair Wages • Worker Welfare Guaranteed</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/services?category=Electrical" className="hover:text-white transition">Electrician</Link></li>
              <li><Link to="/services?category=Plumbing" className="hover:text-white transition">Plumber</Link></li>
              <li><Link to="/services?category=Woodwork" className="hover:text-white transition">Carpenter</Link></li>
              <li><Link to="/services?category=Cooling" className="hover:text-white transition">AC & Appliance Repair</Link></li>
              <li><Link to="/services?category=Sanitation" className="hover:text-white transition">Deep Home Cleaning</Link></li>
              <li><Link to="/services?emergency=true" className="text-red-400 hover:text-red-300 font-semibold transition">Emergency 24x7 Services</Link></li>
            </ul>
          </div>

          {/* Cooperative Societies */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Participating Societies
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Varanasi Labour & Artisan Cooperative</li>
              <li>Kashi Technicians Sahakari Samiti</li>
              <li>Purvanchal Shramik Seva Federation</li>
              <li className="pt-1">
                <Link to="/verify-worker/SKR-EL-10291-VERIFIED" className="text-amber-400 hover:text-amber-300 font-medium">
                  → Public Worker ID Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Governance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Cooperative Support
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-coop-400" />
                <span>Toll-Free Helpline: 1800-202-6089</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-coop-400" />
                <span>support@sahakarseva.coop.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-coop-400" />
                <span>Dashashwamedh Ward, Varanasi, UP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Sahakar Seva Cooperative Platform (Problem Statement 26089). All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0 text-[11px]">
            <span>Fair Work Certified</span>
            <span>•</span>
            <span>Cooperative Shramik Insurance</span>
            <span>•</span>
            <span>Zero Exploitation Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
