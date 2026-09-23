import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Worker, Booking } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SkillGraph } from '../../components/worker/SkillGraph';
import { DigitalWorkerIdCard } from '../../components/worker/DigitalWorkerIdCard';
import {
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  Star,
  Award,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertCircle,
  Bell,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorkerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [worker, setWorker] = useState<Worker | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkerDashboard();
  }, []);

  const fetchWorkerDashboard = async () => {
    setIsLoading(true);
    try {
      // Default to demo worker 1 (Ramesh Kumar)
      const res = await api.getWorkerById('wrk-1');
      if (res.worker) setWorker(res.worker);

      const bookingsRes = await api.getBookings();
      if (bookingsRes.bookings) {
        // Filter jobs assigned to wrk-1 or unassigned requests
        setBookings(bookingsRes.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobAction = async (bookingId: string, newStatus: string) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      setActionSuccessMsg(`Job #${bookingId} status updated to ${newStatus}`);
      setTimeout(() => setActionSuccessMsg(null), 4000);

      if (newStatus === 'COMPLETED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      fetchWorkerDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAvailability = async () => {
    if (!worker) return;
    const newStatus = worker.availabilityStatus === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
    try {
      await api.updateAvailability(worker.id, newStatus);
      setWorker({ ...worker, availabilityStatus: newStatus as any });
    } catch (err) {
      console.error(err);
    }
  };

  const pendingRequests = bookings.filter(b => b.status === 'REQUESTED');
  const activeJobs = bookings.filter(b => ['ACCEPTED', 'WORKER_ON_WAY', 'IN_PROGRESS'].includes(b.status));

  if (isLoading || !worker) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-12 h-12 border-4 border-coop-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading worker cooperative console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-12">
      {/* Toast alert */}
      {actionSuccessMsg && (
        <div className="fixed top-12 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2">
          ✓ {actionSuccessMsg}
        </div>
      )}

      {/* Header Profile & Live Availability Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative shrink-0">
            <img
              src={worker.profilePhoto}
              alt={worker.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-coop-500 shadow-xs"
            />
            <div className="absolute -bottom-1 -right-1 bg-coop-600 text-white p-1 rounded-full border-2 border-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {worker.name}
              </h1>
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                {worker.skillLevel}
              </span>
            </div>
            <div className="text-xs text-coop-800 font-bold mt-0.5">
              ID: {worker.workerId} • {worker.skills.map(s => s.name).join(', ')}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {worker.societyName}
            </div>
          </div>
        </div>

        {/* Availability Switch */}
        <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
          <div className="text-right text-xs">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Status</span>
            <span className={`font-bold ${worker.availabilityStatus === 'AVAILABLE' ? 'text-emerald-700' : 'text-slate-500'}`}>
              {worker.availabilityStatus}
            </span>
          </div>
          <button
            onClick={handleToggleAvailability}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              worker.availabilityStatus === 'AVAILABLE'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-300 hover:bg-slate-400 text-slate-800'
            }`}
          >
            {worker.availabilityStatus === 'AVAILABLE' ? 'Available (Online)' : 'Go Online'}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Today's Jobs</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">2</div>
          <span className="text-[10px] text-emerald-600 font-semibold">1 Active</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Today's Earnings</div>
          <div className="text-xl sm:text-2xl font-black text-coop-800 mt-1">₹700</div>
          <span className="text-[10px] text-slate-400 font-medium">Direct UPI</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Rating</div>
          <div className="text-xl sm:text-2xl font-black text-amber-500 mt-1 flex items-center justify-center">
            <Star className="w-4 h-4 fill-amber-400 mr-1" />
            {worker.averageRating}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">100+ reviews</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Skill Score</div>
          <div className="text-xl sm:text-2xl font-black text-coop-900 mt-1">
            {worker.skillScore}%
          </div>
          <span className="text-[10px] text-amber-600 font-bold uppercase">{worker.skillLevel}</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Completed Jobs</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {worker.completedJobs}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Lifetime</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">On-Time %</div>
          <div className="text-xl sm:text-2xl font-black text-blue-600 mt-1">
            {worker.onTimePercentage}%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">High Punctuality</span>
        </div>
      </div>

      {/* Incoming Job Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <span>Incoming Nearby Job Requests</span>
            {pendingRequests.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 animate-pulse">
                {pendingRequests.length} New
              </span>
            )}
          </h2>
          <span className="text-xs text-slate-400 font-medium">Varanasi Dispatch Radar</span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
            No pending requests awaiting your response. You are ready for next job.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-5 border-2 border-amber-400 shadow-md space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      REQUESTED ({req.bookingType})
                    </span>
                    <h4 className="font-black text-base text-slate-900 mt-1.5">
                      {req.serviceName} • {req.customerName}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      📞 {req.customerPhone}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-coop-800">₹{req.estimatedPrice}</span>
                    <div className="text-[10px] text-slate-400">Estimated Earnings</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-coop-600 shrink-0" />
                    <span className="truncate">{req.address}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Time: {req.scheduledDate} ({req.scheduledTime})</span>
                  </div>
                </div>

                {req.problemDescription && (
                  <p className="text-xs text-slate-600 italic">
                    "{req.problemDescription}"
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleJobAction(req.id, 'ACCEPTED')}
                    className="w-full bg-coop-700 hover:bg-coop-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>स्वीकारें (Accept)</span>
                  </button>
                  <button
                    onClick={() => handleJobAction(req.id, 'CANCELLED')}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition"
                  >
                    अस्वीकार करें (Reject)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Jobs Lifecycle Management */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900">
          Active Jobs In Progress
        </h2>

        {activeJobs.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
            No active ongoing service at this moment.
          </div>
        ) : (
          <div className="space-y-4">
            {activeJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">#{job.id}</span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      {job.serviceName} for {job.customerName}
                    </h3>
                    <p className="text-xs text-slate-500">📍 {job.address}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 self-start sm:self-auto">
                    Current Stage: {job.status}
                  </span>
                </div>

                {/* Progress Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  {job.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleJobAction(job.id, 'WORKER_ON_WAY')}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
                    >
                      रास्ते में हैं (I Am On The Way) →
                    </button>
                  )}
                  {job.status === 'WORKER_ON_WAY' && (
                    <button
                      onClick={() => handleJobAction(job.id, 'IN_PROGRESS')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
                    >
                      कार्य शुरू करें (Start Service) →
                    </button>
                  )}
                  {job.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleJobAction(job.id, 'COMPLETED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>कार्य संपन्न करें (Complete Job & Collect Payment)</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Skill Graph & Digital ID Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkillGraph worker={worker} />
        </div>
        <div>
          <DigitalWorkerIdCard worker={worker} showPrintButton={true} />
        </div>
      </div>
    </div>
  );
};
