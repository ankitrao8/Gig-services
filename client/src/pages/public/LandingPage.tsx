import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { EmergencyModal } from '../../components/booking/EmergencyModal';
import {
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Sparkles,
  Sprout,
  Car,
  HeartPulse,
  Home,
  Snowflake,
  ShieldCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  IndianRupee,
  Clock,
  QrCode,
  AlertTriangle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  const categories = [
    { id: 'sk-elec', name: 'Electrician', icon: Zap, color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { id: 'sk-plumb', name: 'Plumber', icon: Wrench, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'sk-carp', name: 'Carpenter', icon: Hammer, color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'sk-paint', name: 'Painter', icon: Paintbrush, color: 'bg-rose-100 text-rose-700 border-rose-200' },
    { id: 'sk-clean', name: 'Cleaner', icon: Sparkles, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { id: 'sk-gard', name: 'Gardener', icon: Sprout, color: 'bg-lime-100 text-lime-700 border-lime-200' },
    { id: 'sk-driv', name: 'Driver', icon: Car, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { id: 'sk-care', name: 'Caregiver', icon: HeartPulse, color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'sk-dom', name: 'Domestic Helper', icon: Home, color: 'bg-teal-100 text-teal-700 border-teal-200' },
    { id: 'sk-ac', name: 'AC Technician', icon: Snowflake, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-gradient-to-b from-coop-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 bg-coop-100 border border-coop-300 text-coop-900 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight">
              <ShieldCheck className="w-4 h-4 text-coop-700" />
              <span>COOPERATIVE-OWNED DIGITAL MARKETPLACE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
              Trusted Local Services.<br />
              <span className="text-coop-700">Powered by Cooperatives.</span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Find verified electricians, plumbers, carpenters, caregivers, cleaners and more near you. Transparent rates, zero middleman exploitation.
            </p>

            {/* Location & Service Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center bg-white p-2 rounded-2xl shadow-xl border border-slate-200">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-coop-600" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What service do you need? (e.g. Electrician, AC Repair)"
                className="w-full px-3 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
              />
              <button
                type="submit"
                className="bg-coop-700 hover:bg-coop-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow-md whitespace-nowrap"
              >
                Find Service
              </button>
            </form>

            {/* Hero Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/services"
                className="bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-md"
              >
                Find a Service
              </Link>
              <button
                onClick={() => setIsEmergencyOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-md flex items-center space-x-2 animate-pulse hover:animate-none"
              >
                <span>🚨</span>
                <span>Book Emergency Service</span>
              </button>
              <Link
                to="/register?role=WORKER"
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition"
              >
                Join as a Worker
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('categories.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {t('categories.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/services?service=${c.id}`)}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-coop-500 hover:shadow-lg transition-all text-center group flex flex-col items-center justify-center"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border ${c.color} group-hover:scale-110 transition`}>
                <c.icon className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-coop-700 transition">
                {c.name}
              </h3>
              <span className="text-[10px] text-slate-400 mt-1">Verified Technicians</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl text-white p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Simple 6-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              How Sahakar Seva Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              From finding nearby certified cooperative workers to live tracking, transparent payments, and verified reviews.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
            {[
              { step: '1', title: 'Find Service', desc: 'Browse nearby verified workers on map' },
              { step: '2', title: 'Choose Worker', desc: 'Inspect skill level, ratings & QR ID' },
              { step: '3', title: 'Book Slot', desc: 'Select Instant, Scheduled or Emergency' },
              { step: '4', title: 'Live Track', desc: 'Follow worker on way in real time' },
              { step: '5', title: 'Pay Safely', desc: 'Digital UPI/Card with GST receipt' },
              { step: '6', title: 'Verified Rate', desc: 'Rate only after completed job' }
            ].map((st) => (
              <div key={st.step} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="w-8 h-8 rounded-full bg-coop-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-3 shadow-md">
                  {st.step}
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white mb-1">{st.title}</h4>
                <p className="text-[10px] text-slate-400">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY SAHAKAR SEVA? (COOPERATIVE ADVANTAGES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Sahakar Seva?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Built on cooperative values: mutual support, fair work conditions, and high civic trust.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Cooperative Verified',
              desc: 'Every technician is verified by their local registered cooperative society before accepting bookings.',
              icon: ShieldCheck
            },
            {
              title: 'Transparent Pricing',
              desc: 'Zero surge pricing tricks. Standard cooperative rates with explicit ₹20 tech fee and ₹25 welfare contribution.',
              icon: IndianRupee
            },
            {
              title: 'Digital Payments & Invoices',
              desc: 'Instant UPI, RuPay, card or cash support with compliant GST invoices generated on completion.',
              icon: Award
            },
            {
              title: 'Worker Welfare Fund',
              desc: 'Every completed job automatically funds medical insurance and accident protection for cooperative workers.',
              icon: HeartPulse
            },
            {
              title: '24x7 Emergency Services',
              desc: 'Fast priority dispatch matching closest available technicians within 15-minute emergency ETAs.',
              icon: Zap
            },
            {
              title: 'QR Worker ID Cards',
              desc: 'Customers scan public QR codes to verify worker identity without leaking private personal data.',
              icon: QrCode
            }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-coop-500 transition">
              <div className="w-10 h-10 rounded-2xl bg-coop-50 text-coop-700 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WORKER & COOPERATIVE JOIN SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* For Workers */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-coop-900 to-coop-950 text-white shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              For Skilled Technicians
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Your Skill. Your Work.<br />Your Cooperative.
            </h3>
            <p className="text-xs sm:text-sm text-coop-200 leading-relaxed">
              Join thousands of skilled gig workers. Enjoy collective bargaining, direct earnings into your bank account, automatic skill progression, digital worker ID cards, and free health insurance coverage.
            </p>
          </div>
          <div className="pt-6">
            <Link
              to="/register?role=WORKER"
              className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-md"
            >
              <span>Register as Cooperative Worker</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* For Cooperatives */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              For Societies & Federations
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Digitize Your Workforce.<br />Strengthen Your Society.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Empower your cooperative members with modern mobile job dispatch, AI demand forecasting, fraud-proof ratings, and transparent digital audit trails.
            </p>
          </div>
          <div className="pt-6">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 bg-coop-600 hover:bg-coop-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-md"
            >
              <span>Society Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. STATISTICS (DEMO VALUES CLEARLY LABELED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-100 border border-slate-200 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl sm:text-4xl font-black text-coop-800">10,000+</div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Verified Workers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-coop-800">50,000+</div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Services Completed</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-coop-800">95%</div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-coop-800">100+</div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Cooperative Societies</div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 italic">
            *Demonstration platform metrics for Problem Statement ID: 26089 prototype evaluation.
          </p>
        </div>
      </section>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
    </div>
  );
};
