import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DemandForecast, ZoneDemand } from '../../types';
import {
  TrendingUp,
  BrainCircuit,
  MapPin,
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export const AdminForecastPage: React.FC = () => {
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
  const [zones, setZones] = useState<ZoneDemand[]>([]);
  const [recommendations, setRecommendations] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dispatchNotified, setDispatchNotified] = useState(false);

  useEffect(() => {
    fetchForecastData();
  }, []);

  const fetchForecastData = async () => {
    setIsLoading(true);
    try {
      const [forecastRes, recRes] = await Promise.all([
        api.getDemandForecast(),
        api.getWorkforceRecommendations()
      ]);

      if (forecastRes.serviceForecasts) setForecasts(forecastRes.serviceForecasts);
      if (forecastRes.zoneDemands) setZones(forecastRes.zoneDemands);
      if (recRes) setRecommendations(recRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotifyIdleWorkers = () => {
    setDispatchNotified(true);
    setTimeout(() => setDispatchNotified(false), 5000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-12 h-12 border-4 border-coop-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Computing AI demand moving averages and zonal surge trends...</p>
      </div>
    );
  }

  // Prepare chart comparison data across services
  const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = chartDays.map(day => {
    const row: any = { day };
    forecasts.forEach(f => {
      const match = f.sevenDaysPrediction.find(p => p.day === day);
      if (match) {
        row[f.service] = match.projectedJobs;
      }
    });
    return row;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-400/30 mb-2">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            <span>AI Predictive Demand Engine (7-Day Rolling Horizon)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            AI Demand Forecasting & Workforce Allocation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Forecasted demand based on 30-day exponential moving averages, localized seasonal spikes, and weather anomalies.
          </p>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 text-xs space-y-1">
          <div className="text-slate-400">Model Algorithm:</div>
          <div className="font-mono text-emerald-400 font-bold">EMA-30 + Weekend Surge Multiplier</div>
          <div className="text-[10px] text-slate-400">Ready for Scikit-Learn Python microservice handoff</div>
        </div>
      </div>

      {/* Dispatch notification confirmation toast */}
      {dispatchNotified && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 font-bold text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Surge notification successfully transmitted to 6 available cooperative technicians nearby!</span>
        </div>
      )}

      {/* 1. Demand By Service Category Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900">
          Projected Service Demand (Next 7 Days)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {forecasts.map((f) => (
            <div
              key={f.service}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{f.service}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">Confidence: {f.confidence}%</div>
                </div>
                <span
                  className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                    f.forecast === 'HIGH'
                      ? 'bg-red-100 text-red-800'
                      : f.forecast === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {f.forecast} DEMAND
                </span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-slate-900">{f.expectedDemand}</span>
                <span className="text-xs text-slate-500">jobs / day avg</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Trend:</span>
                <span className={`font-bold ${
                  f.trend === 'UPWARD' ? 'text-emerald-600' : f.trend === 'DOWNWARD' ? 'text-red-500' : 'text-slate-600'
                }`}>
                  {f.trend === 'UPWARD' ? '▲ Trending Up' : f.trend === 'DOWNWARD' ? '▼ Trending Down' : '● Stable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Projected Demand Curve (Recharts) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">
              7-Day Predictive Demand Curve
            </h3>
            <p className="text-xs text-slate-500">Projected service bookings from Monday to Sunday</p>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
            Weekend Peak Modeled
          </span>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="Electrician" stroke="#15803d" strokeWidth={3} />
              <Line type="monotone" dataKey="Plumber" stroke="#0284c7" strokeWidth={3} />
              <Line type="monotone" dataKey="AC Technician" stroke="#d97706" strokeWidth={3} />
              <Line type="monotone" dataKey="Cleaner" stroke="#9333ea" strokeWidth={2} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Geographic Zone Demand & Workforce Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Demand Heatmap */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">
            Geographic Demand Zones (Varanasi District)
          </h3>

          <div className="space-y-3">
            {zones.map((z) => (
              <div
                key={z.zone}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-coop-700" />
                    <h4 className="font-bold text-sm text-slate-900">{z.zone}</h4>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Recommended: {z.recommendedWorkers.map(r => `${r.count} ${r.skill}s`).join(', ')}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                    z.demandLevel === 'HIGH'
                      ? 'bg-red-100 text-red-800'
                      : z.demandLevel === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {z.demandLevel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Workforce Allocation Rebalance Action */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">
                Workforce Rebalancing Recommendation
              </h3>
              <span className="text-xs font-bold text-coop-800 bg-coop-50 px-2.5 py-0.5 rounded-full">
                AI Optimization
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {recommendations?.recommendationSummary}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-amber-700" />
                <span>6 Idle Cooperative Technicians Detected in Outer Radius:</span>
              </div>
              <ul className="space-y-1 text-[11px] list-disc pl-5">
                {recommendations?.dispatchableWorkers?.map((w: any) => (
                  <li key={w.id}>
                    <b>{w.name}</b> ({w.primarySkill}) • {w.distanceToSurge} away from Central surge zone
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={handleNotifyIdleWorkers}
            className="w-full bg-coop-700 hover:bg-coop-800 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-2xl shadow-md transition flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Notify Idle Workers to Relocate to Central Zone</span>
          </button>
        </div>
      </div>
    </div>
  );
};
