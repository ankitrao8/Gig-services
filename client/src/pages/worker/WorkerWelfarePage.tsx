import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Welfare } from '../../types';
import { HeartPulse, ShieldCheck, IndianRupee, Calendar, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorkerWelfarePage: React.FC = () => {
  const [welfare, setWelfare] = useState<Welfare | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('250');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchWelfare();
  }, []);

  const fetchWelfare = async () => {
    setIsLoading(true);
    try {
      const res = await api.getWelfare('wrk-1');
      if (res.welfare) setWelfare(res.welfare);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoluntaryContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!welfare) return;
    setIsUpdating(true);
    try {
      const res = await api.updateWelfare('wrk-1', {
        contributionAmount: Number(topUpAmount)
      });
      if (res.success && res.welfare) {
        setWelfare(res.welfare);
        setSuccessMsg(`₹${topUpAmount} added to your cooperative welfare balance!`);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !welfare) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-12 h-12 border-4 border-coop-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading welfare & insurance accounts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Worker Welfare & Insurance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Cooperative Shramik Suraksha Yojana • Varanasi Labour Cooperative Society
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Welfare Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Insurance */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Medical Insurance</span>
          <div className="text-xl font-black text-emerald-700 mt-1 flex items-center space-x-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>{welfare.insuranceStatus}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{welfare.insuranceProvider}</p>
        </div>

        {/* Welfare Fund */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Welfare Fund Balance</span>
          <div className="text-2xl font-black text-coop-800 mt-1">
            ₹{welfare.welfareFund.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-coop-700 font-semibold mt-1">+₹25 credited per booking</p>
        </div>

        {/* Accident Coverage */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Accident Coverage</span>
          <div className="text-xl font-black text-blue-700 mt-1 flex items-center space-x-1.5">
            <HeartPulse className="w-5 h-5 text-blue-600" />
            <span>{welfare.accidentCoverage}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">₹5,00,000 Emergency Cover</p>
        </div>

        {/* Renewal Date */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Next Renewal</span>
          <div className="text-base font-black text-slate-900 mt-1 flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>{welfare.nextRenewal}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Last Contribution: ₹{welfare.lastContribution}</p>
        </div>
      </div>

      {/* Voluntary Contribution / Top-up */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">
          Voluntary Cooperative Welfare Deposit
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
          Voluntary member deposits directly expand your medical emergency buffer and community micro-credit limit.
        </p>

        <form onSubmit={handleVoluntaryContribution} className="flex flex-wrap items-center gap-3">
          {['100', '250', '500', '1000'].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setTopUpAmount(amt)}
              className={`py-2 px-4 rounded-xl text-xs font-bold border transition ${
                topUpAmount === amt
                  ? 'bg-coop-700 text-white border-coop-700'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              ₹{amt}
            </button>
          ))}

          <button
            type="submit"
            disabled={isUpdating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition"
          >
            {isUpdating ? 'Depositing...' : `Deposit ₹${topUpAmount} via UPI`}
          </button>
        </form>
      </div>

      {/* Contribution History Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-slate-900">
          Micro-Contribution Ledger
        </div>
        <div className="divide-y divide-slate-100">
          {welfare.contributions.map((c, idx) => (
            <div key={idx} className="p-4 sm:p-5 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-slate-900">{c.type}</h4>
                <p className="text-[10px] text-slate-400">Date: {c.date} {c.bookingId && `• Booking #${c.bookingId}`}</p>
              </div>
              <span className="font-black text-emerald-700 text-sm">
                +₹{c.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
