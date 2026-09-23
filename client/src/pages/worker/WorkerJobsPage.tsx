import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Booking } from '../../types';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle2, ChevronRight, Phone } from 'lucide-react';

export const WorkerJobsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await api.getBookings();
      if (res.bookings) setBookings(res.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = bookings.filter(b => {
    if (filter === 'ACTIVE') return ['REQUESTED', 'ACCEPTED', 'WORKER_ON_WAY', 'IN_PROGRESS'].includes(b.status);
    if (filter === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 md:pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          कामगार कार्य सूची (Worker Jobs)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage accepted requests, transit status, and completed bookings
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { id: 'ALL', label: 'All Jobs (सभी कार्य)' },
          { id: 'ACTIVE', label: 'Active in Transit (सक्रिय कार्य)' },
          { id: 'COMPLETED', label: 'Completed (संपन्न कार्य)' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`px-4 py-2 rounded-xl transition ${
              filter === t.id ? 'bg-coop-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-28 bg-slate-200/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
          No jobs found under this category.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-500">#{b.id}</span>
                  <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                    b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {b.status}
                  </span>
                  {b.emergency && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                      🚨 Emergency
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mt-1">
                  {b.serviceName} for {b.customerName}
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  📞 {b.customerPhone} • 📍 {b.address}
                </p>
                <div className="text-[10px] text-slate-400 mt-1">
                  Scheduled: {b.scheduledDate} at {b.scheduledTime}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="font-black text-sm text-coop-800">₹{b.finalPrice || b.estimatedPrice}</div>
                  <span className="text-[10px] text-slate-400">Direct Earnings</span>
                </div>
                <Link
                  to={`/booking/${b.id}`}
                  className="px-4 py-2 bg-coop-50 hover:bg-coop-100 text-coop-800 font-bold rounded-xl transition text-xs"
                >
                  Manage Job →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const WorkerEarningsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 md:pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          कामगार कमाई (Earnings & Settlements)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Direct bank / UPI transfers with cooperative transparent records
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Lifetime Earnings</span>
          <div className="text-3xl font-black text-coop-800 mt-1">₹44,100</div>
          <span className="text-[10px] text-emerald-600 font-semibold">126 Completed Jobs</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">This Month (March 2026)</span>
          <div className="text-3xl font-black text-slate-900 mt-1">₹12,450</div>
          <span className="text-[10px] text-slate-400">32 Jobs Completed</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Welfare Accumulation</span>
          <div className="text-3xl font-black text-amber-600 mt-1">₹4,250</div>
          <span className="text-[10px] text-amber-700 font-semibold">Protected Shramik Fund</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">
          Direct Payment Method
        </h3>
        <div className="p-4 rounded-2xl bg-coop-50/70 border border-coop-200 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-slate-900">State Bank of India (Varanasi Dashashwamedh)</div>
            <div className="font-mono text-slate-500">A/C: •••••••• 8192 • IFSC: SBIN0001234</div>
            <div className="font-mono text-coop-800 font-bold mt-0.5">UPI: ramesh.kumar@okhdfcbank</div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Active Verified
          </span>
        </div>
      </div>
    </div>
  );
};
