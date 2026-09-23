import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { Booking, Worker } from '../../types';
import { EmergencyModal } from '../../components/booking/EmergencyModal';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  FileText,
  AlertTriangle,
  ArrowRight,
  Zap,
  Wrench,
  Search,
  CheckCircle2,
  Receipt
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [nearbyWorkers, setNearbyWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, workersRes] = await Promise.all([
        api.getBookings(),
        api.getWorkers({ maxDistance: 10 })
      ]);

      if (bookingsRes.bookings) setBookings(bookingsRes.bookings);
      if (workersRes.workers) setNearbyWorkers(workersRes.workers.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeBookings = bookings.filter(b => ['REQUESTED', 'ACCEPTED', 'WORKER_ON_WAY', 'IN_PROGRESS'].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Quick Emergency Bar */}
      <div className="bg-gradient-to-r from-coop-800 to-coop-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
            Household Member Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            Welcome back, {user?.name || 'Sunita Sharma'}!
          </h1>
          <p className="text-xs sm:text-sm text-coop-200 mt-1 max-w-xl">
            You are served by Varanasi Labour & Artisan Cooperative Society. Guaranteed fair pricing, verified technicians, and direct worker insurance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg flex items-center space-x-2 transition animate-pulse hover:animate-none"
          >
            <span>🚨</span>
            <span>Emergency Technician</span>
          </button>
          <Link
            to="/services"
            className="bg-white hover:bg-slate-100 text-coop-950 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition"
          >
            Find a Service
          </Link>
        </div>
      </div>

      {/* Active Service Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <span>Ongoing & Active Bookings</span>
            {activeBookings.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {activeBookings.length} Active
              </span>
            )}
          </h2>
          <Link to="/customer/bookings" className="text-xs font-bold text-coop-700 hover:underline">
            View All ({bookings.length}) →
          </Link>
        </div>

        {activeBookings.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
            No active jobs in transit right now. Everything is running smoothly!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-5 border-2 border-coop-400 shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-500">#{b.id}</span>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                        {b.status}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {b.serviceName} Service
                    </h3>
                    <p className="text-xs text-slate-500">
                      Assigned to <b>{b.workerName}</b> ({b.workerPhone})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-coop-800">₹{b.estimatedPrice}</span>
                    <div className="text-[10px] text-slate-400">{b.bookingType}</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.scheduledDate} at {b.scheduledTime}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{b.address}</span>
                  </div>
                </div>

                <Link
                  to={`/booking/${b.id}`}
                  className="w-full bg-coop-700 hover:bg-coop-800 text-white font-bold text-xs py-2.5 rounded-xl text-center shadow-xs transition"
                >
                  Track Live Technician & Invoice →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Nearby Cooperative Workers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">
            Top-Rated Nearby Technicians
          </h2>
          <Link to="/services" className="text-xs font-bold text-coop-700 hover:underline">
            Explore All Technicians →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {nearbyWorkers.map((w) => (
            <div
              key={w.id}
              className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs hover:border-coop-400 hover:shadow-md transition text-center flex flex-col items-center justify-between space-y-3"
            >
              <div className="relative">
                <img
                  src={w.profilePhoto}
                  alt={w.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-coop-400"
                />
                <span className="absolute -bottom-1 -right-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  {w.skillLevel}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900">{w.name}</h4>
                <div className="text-xs text-coop-800 font-semibold">{w.skills[0]?.name}</div>
                <div className="flex items-center justify-center space-x-1 text-xs text-amber-600 font-bold mt-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{w.averageRating} ({w.completedJobs} jobs)</span>
                </div>
              </div>

              <div className="w-full pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">₹{w.startingPrice}</span>
                <Link
                  to={`/worker/${w.id}`}
                  className="text-[11px] font-bold text-coop-700 hover:bg-coop-50 px-2.5 py-1 rounded-lg transition"
                >
                  Book →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Services & Invoices */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900">
          Recent Completed Services & Invoices
        </h2>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {completedBookings.slice(0, 5).map((b) => (
            <div key={b.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {b.serviceName} • {b.workerName}
                  </h4>
                  <div className="text-slate-500 text-[11px]">
                    Completed on {b.scheduledDate} • Total: ₹{b.finalPrice || b.estimatedPrice} (Paid via UPI)
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  to={`/booking/${b.id}`}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>View Receipt</span>
                </Link>
                <Link
                  to={`/booking/${b.id}`}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>Rate / Review</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
    </div>
  );
};
