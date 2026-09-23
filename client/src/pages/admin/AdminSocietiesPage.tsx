import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Society, Booking } from '../../types';
import { Building2, ShieldCheck, Phone, MapPin, Users, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminSocietiesPage: React.FC = () => {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getSocieties().then(res => {
      if (res.societies) setSocieties(res.societies);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Registered Cooperative Societies
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Federation Directory • Varanasi District Labor & Services Unions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {societies.map((soc) => (
          <div key={soc.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-coop-100 text-coop-800 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{soc.name}</h3>
                <span className="text-[10px] text-coop-700 font-mono font-semibold">{soc.registrationNumber}</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{soc.address}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span><b>{soc.memberCount || 420}</b> Registered Members</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{soc.phone || '+91 542 2450192'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                ✓ Federation Verified
              </span>
              <Link
                to="/admin/workers"
                className="text-xs font-bold text-coop-700 hover:underline"
              >
                View Members →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getBookings().then(res => {
      if (res.bookings) setBookings(res.bookings);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Master Federation Bookings Log
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Live audit trail of all household, institutional, and emergency gig requests
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
        {bookings.map((b) => (
          <div key={b.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-slate-500">#{b.id}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {b.status}
                </span>
                {b.emergency && <span className="text-[10px] font-bold text-red-600">🚨 EMERGENCY</span>}
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mt-1">
                {b.serviceName} • Customer: {b.customerName} → Worker: {b.workerName}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Scheduled: {b.scheduledDate} ({b.scheduledTime}) • 📍 {b.address}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-black text-sm text-slate-900">₹{b.finalPrice || b.estimatedPrice}</div>
                <div className="text-[10px] text-slate-400">{b.bookingType}</div>
              </div>
              <Link
                to={`/booking/${b.id}`}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
              >
                Inspect →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminWelfarePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Worker Welfare & Collective Insurance Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Cooperative federation medical buffer, accident insurance, and claims monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Welfare Pool</span>
          <div className="text-3xl font-black text-coop-800 mt-1">₹8,42,500</div>
          <span className="text-[10px] text-emerald-700 font-semibold">+₹25 credited per booking</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Insured Workers</span>
          <div className="text-3xl font-black text-blue-700 mt-1">1,855</div>
          <span className="text-[10px] text-slate-500 font-medium">95% Federation Coverage</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Claims</span>
          <div className="text-3xl font-black text-slate-900 mt-1">0</div>
          <span className="text-[10px] text-emerald-600 font-bold">100% Settled</span>
        </div>
      </div>
    </div>
  );
};
