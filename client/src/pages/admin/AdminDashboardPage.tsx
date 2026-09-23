import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  UserCheck,
  CalendarCheck,
  IndianRupee,
  HeartPulse,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [fraudCount, setFraudCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, fraudRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getFraudAlerts()
      ]);

      if (analyticsRes.stats) setAnalytics(analyticsRes);
      if (fraudRes.count !== undefined) setFraudCount(fraudRes.count);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-12 h-12 border-4 border-coop-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading society & federation analytics console...</p>
      </div>
    );
  }

  const { stats, charts } = analytics;
  const COLORS = ['#15803d', '#d97706', '#0284c7', '#9333ea', '#e11d48', '#0d9488'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Alerts Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-coop-500/20 text-coop-300 px-3 py-1 rounded-full text-xs font-bold border border-coop-400/30 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Varanasi Cooperative Labour & Technicians Federation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Society Administrator Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Real-time federation oversight: member verification, smart dispatch, welfare governance, and demand forecasting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/workers"
            className="bg-coop-600 hover:bg-coop-700 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-md transition flex items-center space-x-2"
          >
            <span>Verify Workers ({stats.pendingVerification})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/admin/forecast"
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl border border-slate-700 transition flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>AI Demand Forecast</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Workers */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Workers</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.totalWorkers}</div>
          <span className="text-[10px] text-coop-700 font-bold">100% Cooperative</span>
        </div>

        {/* Active Workers */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active / Online</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{stats.activeWorkers}</div>
          <span className="text-[10px] text-slate-400 font-medium">Ready for dispatch</span>
        </div>

        {/* Pending Verification */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pending Verify</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">{stats.pendingVerification}</div>
          <Link to="/admin/workers" className="text-[10px] text-amber-700 font-bold hover:underline">
            Review Queue →
          </Link>
        </div>

        {/* Today's Bookings */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Completed Jobs</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.completedJobs}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">{stats.cancellationRate}% cancel rate</span>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Transaction Value</span>
          <div className="text-xl sm:text-2xl font-black text-coop-800 mt-1">₹{stats.totalTransactionValue.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-400">Fair Wages</span>
        </div>

        {/* Worker Welfare Coverage */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Welfare Coverage</span>
          <div className="text-xl sm:text-2xl font-black text-blue-600 mt-1">{stats.welfareCoverage}%</div>
          <span className="text-[10px] text-blue-700 font-bold">Insured Shramiks</span>
        </div>
      </div>

      {/* Fraud Alert Callout if any */}
      {fraudCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-amber-950 font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>{fraudCount} suspicious reviews / velocity anomalies detected by AI anti-fraud audit.</span>
          </div>
          <Link
            to="/admin/fraud"
            className="text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1 rounded-xl transition"
          >
            Inspect Alerts →
          </Link>
        </div>
      )}

      {/* Charts Section: Monthly Trend & Service Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bookings & Revenue Trend */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">
              Federation Service Bookings Trend
            </h3>
            <span className="text-[10px] text-slate-400">Last 6 Months</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyTrend}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="bookings" stroke="#15803d" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Requested Services Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">
              Cooperative Service Demand Volume
            </h3>
            <span className="text-[10px] text-slate-400">By Service Type</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.serviceDemandData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Links Footer Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs font-bold">
        <Link to="/admin/workers" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-coop-500 shadow-xs transition">
          👷 Worker Verification ({stats.pendingVerification})
        </Link>
        <Link to="/admin/forecast" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-coop-500 shadow-xs transition">
          📈 AI Demand Forecast
        </Link>
        <Link to="/admin/societies" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-coop-500 shadow-xs transition">
          🏛️ Cooperative Societies
        </Link>
        <Link to="/admin/fraud" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-coop-500 shadow-xs transition">
          🛡️ Anti-Fraud Audit
        </Link>
      </div>
    </div>
  );
};
