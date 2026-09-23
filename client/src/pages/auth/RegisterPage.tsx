import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShieldCheck,
  Phone,
  UserCheck,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Wrench,
  Zap,
  CreditCard,
  MapPin
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState<'CUSTOMER' | 'WORKER'>((searchParams.get('role') as any) || 'CUSTOMER');
  const [workerStep, setWorkerStep] = useState(1);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('123456');
  const [societyId, setSocietyId] = useState('soc-varanasi');
  const [selectedSkill, setSelectedSkill] = useState('sk-elec');
  const [selectedSkillName, setSelectedSkillName] = useState('Electrician');
  const [govIdNumber, setGovIdNumber] = useState('•••• •••• 4912');
  const [bankUpi, setBankUpi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successWorker, setSuccessWorker] = useState<any | null>(null);

  const skillsList = [
    { id: 'sk-elec', name: 'Electrician', icon: '⚡' },
    { id: 'sk-plumb', name: 'Plumber', icon: '🔧' },
    { id: 'sk-carp', name: 'Carpenter', icon: '🪚' },
    { id: 'sk-paint', name: 'Painter', icon: '🎨' },
    { id: 'sk-clean', name: 'Cleaner', icon: '🧹' },
    { id: 'sk-ac', name: 'AC Technician', icon: '❄️' },
    { id: 'sk-driv', name: 'Driver', icon: '🚗' },
    { id: 'sk-care', name: 'Caregiver', icon: '❤️' }
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.register({
        name,
        phone,
        role,
        societyId,
        skills: [{ skillId: selectedSkill, name: selectedSkillName, experienceYears: 3 }]
      });

      if (res.success) {
        if (role === 'WORKER') {
          setSuccessWorker(res.worker);
        } else {
          await login(phone, '123456');
          navigate('/customer/dashboard');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-coop-700 text-white flex items-center justify-center font-black mx-auto mb-3 shadow-md">
          <ShieldCheck className="w-7 h-7 text-amber-300" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Join Sahakar Seva
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Cooperative Member Onboarding Portal • Transparent & Fair Work
        </p>
      </div>

      {/* Role Switcher Tabs */}
      {!successWorker && (
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-200/80 rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition ${
              role === 'CUSTOMER' ? 'bg-white text-coop-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Customer Account</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('WORKER')}
            className={`py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition ${
              role === 'WORKER' ? 'bg-white text-coop-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Join as Worker (कामगार)</span>
          </button>
        </div>
      )}

      {/* CUSTOMER REGISTRATION */}
      {role === 'CUSTOMER' && !successWorker && (
        <form onSubmit={handleRegister} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Customer Registration</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Chandra"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
            />
          </div>

          <div className="p-3 bg-coop-50 rounded-xl border border-coop-200 text-xs text-coop-900">
            For demonstration, OTP verification will automatically accept <b>123456</b>.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-coop-700 hover:bg-coop-800 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition shadow-md"
          >
            {isSubmitting ? 'Creating Account...' : 'Complete Customer Registration'}
          </button>
        </form>
      )}

      {/* WORKER LOW-LITERACY STEPPED ONBOARDING */}
      {role === 'WORKER' && !successWorker && (
        <form onSubmit={handleRegister} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-base text-slate-900">
                कामगार पंजीकरण (Worker Onboarding)
              </h3>
              <p className="text-[11px] text-slate-400">Step {workerStep} of 4 • Low-literacy friendly</p>
            </div>
            <span className="text-xs font-bold text-coop-700 bg-coop-50 px-2.5 py-1 rounded-lg">
              Cooperative Membership
            </span>
          </div>

          {/* Worker Step 1: Mobile & Name */}
          {workerStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. आपका नाम (Your Full Name)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="उदा. महेश कुमार (Mahesh Kumar)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. मोबाइल नंबर (Mobile Number)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
                />
              </div>

              <button
                type="button"
                disabled={!name || !phone}
                onClick={() => setWorkerStep(2)}
                className="w-full bg-coop-700 hover:bg-coop-800 disabled:opacity-40 text-white font-bold text-sm py-3 rounded-xl transition flex items-center justify-center space-x-2"
              >
                <span>आगे बढ़ें (Continue)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Worker Step 2: Choose Skill */}
          {workerStep === 2 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700">
                3. अपना मुख्य कौशल चुनें (Select Your Primary Skill)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {skillsList.map((sk) => (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => {
                      setSelectedSkill(sk.id);
                      setSelectedSkillName(sk.name);
                    }}
                    className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                      selectedSkill === sk.id
                        ? 'bg-coop-50 border-coop-600 ring-2 ring-coop-500 font-bold text-coop-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-3xl mb-1">{sk.icon}</span>
                    <span className="text-xs">{sk.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWorkerStep(1)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  पीछे (Back)
                </button>
                <button
                  type="button"
                  onClick={() => setWorkerStep(3)}
                  className="flex-1 bg-coop-700 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-1"
                >
                  <span>आगे बढ़ें (Next)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Worker Step 3: Cooperative Society Selection */}
          {workerStep === 3 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700">
                4. अपनी सहकारी समिति चुनें (Select Your Cooperative Society)
              </label>

              <div className="space-y-2">
                {[
                  { id: 'soc-varanasi', name: 'Varanasi Labour & Artisan Cooperative Society', dist: 'Dashashwamedh / Godowlia Ward' },
                  { id: 'soc-kashi', name: 'Kashi Technicians Sahakari Samiti', dist: 'Sigra / Mahmoorganj Ward' },
                  { id: 'soc-purvanchal', name: 'Purvanchal Shramik Seva Federation', dist: 'Cantonment / Orderly Bazaar' }
                ].map((soc) => (
                  <button
                    key={soc.id}
                    type="button"
                    onClick={() => setSocietyId(soc.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition ${
                      societyId === soc.id
                        ? 'bg-coop-50 border-coop-600 ring-2 ring-coop-500 font-bold text-coop-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-sm font-bold">{soc.name}</div>
                    <div className="text-xs text-slate-500">{soc.dist}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWorkerStep(2)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  पीछे (Back)
                </button>
                <button
                  type="button"
                  onClick={() => setWorkerStep(4)}
                  className="flex-1 bg-coop-700 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-1"
                >
                  <span>आगे बढ़ें (Next)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Worker Step 4: Govt ID Verification & Bank Details */}
          {workerStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  5. आधार / सरकारी पहचान पत्र (Aadhaar / Voter ID)
                </label>
                <input
                  type="text"
                  value={govIdNumber}
                  onChange={(e) => setGovIdNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  *Aadhaar is encrypted and only visible to your society secretary for membership approval.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  6. बैंक खाता या यूपीआई (Bank Account or UPI for Direct Earnings)
                </label>
                <input
                  type="text"
                  value={bankUpi}
                  onChange={(e) => setBankUpi(e.target.value)}
                  placeholder="e.g. mahesh@upi or Bank A/C 9182736450"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWorkerStep(3)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  पीछे (Back)
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-1 shadow-md"
                >
                  <span>{isSubmitting ? 'जमा हो रहा है...' : 'आवेदन जमा करें (Submit Onboarding)'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Success State for Worker */}
      {successWorker && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-md">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            आवेदन सफलतापूर्वक जमा हुआ! (Application Submitted)
          </h2>
          <div className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
            Verification Pending (सत्यापन लंबित)
          </div>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Your worker onboarding file has been transmitted to <b>{successWorker.societyName}</b>. Once the society secretary verifies your cooperative membership, your digital worker ID and public booking dispatch will activate automatically.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-xs font-mono text-left space-y-1">
            <div><b>Worker Name:</b> {successWorker.name}</div>
            <div><b>Temporary Worker ID:</b> {successWorker.workerId}</div>
            <div><b>Society:</b> {successWorker.societyName}</div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/admin/workers"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
            >
              Test as Society Admin to Approve →
            </Link>
            <Link
              to="/"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl"
            >
              Return Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
