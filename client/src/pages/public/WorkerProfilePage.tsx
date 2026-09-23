import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Worker, Rating, Certificate } from '../../types';
import { SkillGraph } from '../../components/worker/SkillGraph';
import { DigitalWorkerIdCard } from '../../components/worker/DigitalWorkerIdCard';
import { CertificateCard } from '../../components/worker/CertificateCard';
import { BookingWizardModal } from '../../components/booking/BookingWizardModal';
import {
  ShieldCheck,
  Star,
  Clock,
  CheckCircle2,
  Calendar,
  Award,
  HeartPulse,
  QrCode,
  MapPin,
  ArrowLeft,
  Phone
} from 'lucide-react';

export const WorkerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [reviews, setReviews] = useState<Rating[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [welfare, setWelfare] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'idCard' | 'certificates' | 'reviews'>('overview');

  useEffect(() => {
    if (id) fetchWorkerData(id);
  }, [id]);

  const fetchWorkerData = async (workerId: string) => {
    setIsLoading(true);
    try {
      const res = await api.getWorkerById(workerId);
      if (res.worker) {
        setWorker(res.worker);
        setReviews(res.reviews || []);
        setCertificates(res.certificates || []);
        setWelfare(res.welfare || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-12 h-12 border-4 border-coop-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs">Loading verified worker cooperative dossier...</p>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h3 className="text-lg font-bold text-slate-800">Worker Profile Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          The requested technician may have updated credentials or is not in the cooperative directory.
        </p>
        <Link to="/services" className="inline-block mt-4 text-xs font-bold text-coop-700 bg-coop-50 px-4 py-2 rounded-xl">
          ← Return to Services Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/services"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Services</span>
        </Link>
      </div>

      {/* 1. Profile Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
          <div className="relative shrink-0">
            <img
              src={worker.profilePhoto}
              alt={worker.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-coop-500 shadow-md"
            />
            <div className="absolute -bottom-2 -right-1 bg-coop-600 text-white p-1 rounded-full border-2 border-white">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {worker.name}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-coop-100 text-coop-800 border border-coop-200 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-coop-700" />
                <span>Verified Cooperative Member</span>
              </span>
            </div>

            <div className="text-sm font-semibold text-coop-800">
              {worker.skills.map(s => s.name).join(' • ')}
            </div>

            <div className="text-xs text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{worker.societyName}</span>
            </div>

            <p className="text-xs text-slate-600 max-w-xl leading-relaxed pt-1">
              {worker.bio}
            </p>
          </div>
        </div>

        {/* Action & Rate Capsule */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center shrink-0 space-y-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting Service Rate</span>
            <div className="text-2xl font-black text-slate-900">₹{worker.startingPrice}</div>
            <span className="text-[10px] text-coop-700 font-semibold block">Includes ₹25 Welfare Fund</span>
          </div>

          <button
            onClick={() => setIsBookingOpen(true)}
            className="w-full bg-coop-700 hover:bg-coop-800 text-white text-xs font-bold py-3 px-6 rounded-xl transition shadow-md"
          >
            Book {worker.name.split(' ')[0]} Now
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview & Skill Score' },
          { id: 'idCard', label: 'Digital Worker ID Card' },
          { id: 'certificates', label: `Milestone Certificates (${certificates.length})` },
          { id: 'reviews', label: `Customer Reviews (${reviews.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-coop-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <SkillGraph worker={worker} />

            {/* Verification Credential details */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 text-xs">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">
                Cooperative Audit & Credential Status
              </h4>
              <div className="grid grid-cols-2 gap-3 text-slate-700 pt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Government ID Verification</span>
                  <span className="font-bold text-emerald-700">✓ Aadhaar Verified by Society</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Registered Cooperative</span>
                  <span className="font-bold">{worker.societyName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Health & Accident Insurance</span>
                  <span className="font-bold text-coop-800">✓ ACTIVE (Cooperative Shramik Cover)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Worker ID Code</span>
                  <span className="font-mono font-bold">{worker.workerId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar ID Card Preview */}
          <div className="space-y-4">
            <div className="text-center font-bold text-xs text-slate-600">
              Official Digital Worker Card
            </div>
            <DigitalWorkerIdCard worker={worker} showPrintButton={false} />
          </div>
        </div>
      )}

      {activeTab === 'idCard' && (
        <div className="flex flex-col items-center py-4">
          <DigitalWorkerIdCard worker={worker} showPrintButton={true} />
        </div>
      )}

      {activeTab === 'certificates' && (
        <div className="space-y-6">
          {certificates.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
              No milestone certificates issued yet. Milestones unlock at 50+ completed jobs.
            </div>
          ) : (
            certificates.map(cert => (
              <CertificateCard key={cert.id} certificate={cert} workerPhoto={worker.profilePhoto} />
            ))
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Verified Customer Reviews</span>
            <span className="text-[11px] text-slate-400">All reviews verified via completed payment</span>
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
              No public reviews submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{r.customerName}</span>
                    <div className="flex text-amber-500">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 italic">"{r.review}"</p>
                  <div className="text-[10px] text-slate-400">
                    Punctual on-time delivery: <b>{r.onTime ? 'YES' : 'NO'}</b> • {r.createdAt.split('T')[0]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Wizard Modal */}
      <BookingWizardModal
        worker={worker}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};
