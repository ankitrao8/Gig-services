import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Booking } from '../../types';
import { Link } from 'react-router-dom';
import { Receipt, FileText, CheckCircle2, Printer } from 'lucide-react';

export const CustomerPaymentsPage: React.FC = () => {
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await api.getBookings('COMPLETED');
      if (res.bookings) setCompletedBookings(res.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Payments & Digital Invoices
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          GST-compliant cooperative digital receipts with verified breakdown
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map(n => (
            <div key={n} className="h-24 bg-slate-200/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : completedBookings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
          No completed payments found yet.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {completedBookings.map((b) => (
            <div key={b.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Invoice #INV-SS-{b.id}
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    {b.serviceName} • {b.workerName} • Date: {b.scheduledDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-black text-sm text-slate-900">₹{b.finalPrice || b.estimatedPrice}</div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    PAID (UPI)
                  </span>
                </div>
                <Link
                  to={`/booking/${b.id}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CustomerProfilePage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Customer Profile</h1>
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center space-x-4">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
            alt="Sunita Sharma"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-coop-500"
          />
          <div>
            <h3 className="font-bold text-base text-slate-900">Sunita Sharma</h3>
            <p className="text-slate-500">Phone: +91 9999999999 (Verified Customer)</p>
            <span className="text-[10px] font-bold text-coop-700 bg-coop-50 px-2 py-0.5 rounded">
              Household Member • Varanasi Coop
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Primary Saved Address</h4>
          <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            Flat 402, Ganga Heights, Dashashwamedh Ghat Road, Varanasi, UP - 221001
          </p>
        </div>
      </div>
    </div>
  );
};
