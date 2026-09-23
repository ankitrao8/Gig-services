import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Booking } from '../../types';
import { Calendar, Clock, MapPin, ShieldCheck, ChevronRight, Search } from 'lucide-react';

export const CustomerBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
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

  const filtered = filter === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Service Bookings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, track active technicians, download receipts, and rate completed work
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        {['ALL', 'REQUESTED', 'ACCEPTED', 'WORKER_ON_WAY', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl transition whitespace-nowrap ${
              filter === st
                ? 'bg-coop-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st.replace('_', ' ')}
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
          No bookings found matching this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <Link
              key={b.id}
              to={`/booking/${b.id}`}
              className="block bg-white p-5 rounded-3xl border border-slate-200 hover:border-coop-400 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
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
                        Emergency
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1">
                    {b.serviceName} • {b.workerName}
                  </h3>
                  <div className="text-slate-500 text-[11px] mt-0.5 flex items-center space-x-2">
                    <span>📅 {b.scheduledDate} ({b.scheduledTime})</span>
                    <span>•</span>
                    <span className="truncate max-w-xs">📍 {b.address}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-black text-sm text-slate-900">₹{b.finalPrice || b.estimatedPrice}</div>
                    <div className="text-[10px] text-coop-700 font-semibold">{b.bookingType}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
