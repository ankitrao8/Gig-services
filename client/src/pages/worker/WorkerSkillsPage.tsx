import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Worker } from '../../types';
import { SkillGraph } from '../../components/worker/SkillGraph';
import { DigitalWorkerIdCard } from '../../components/worker/DigitalWorkerIdCard';

export const WorkerSkillsPage: React.FC = () => {
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    api.getWorkerById('wrk-1').then(res => {
      if (res.worker) setWorker(res.worker);
    });
  }, []);

  if (!worker) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 md:pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          कौशल प्रगति व स्तर (Skill Progression)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Formula: Completed Jobs × Average Rating × On-Time Percentage
        </p>
      </div>

      <SkillGraph worker={worker} />

      {/* Tier explanation table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">
          Cooperative Skill Tiers & Benefits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="font-bold text-amber-900">🥉 Bronze Tier:</span>
            <p className="text-slate-600 mt-1">New cooperative member. Basic platform dispatch access.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
            <span className="font-bold text-slate-800">🥈 Silver Tier (15+ Jobs, 4.0+ Rating):</span>
            <p className="text-slate-600 mt-1">Eligible for instant bookings and higher priority dispatch radius.</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300">
            <span className="font-bold text-amber-900">🥇 Gold Tier (40+ Jobs, 4.4+ Rating, 85%+ On-Time):</span>
            <p className="text-slate-700 mt-1">Priority 24x7 emergency job matching and milestone certification.</p>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <span className="font-bold text-purple-900">👑 Master Tier (100+ Jobs, 4.7+ Rating, 90%+ On-Time):</span>
            <p className="text-purple-800 mt-1">Master craftsman badge, cooperative trainer eligibility & bonus stipend.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WorkerIdCardPage: React.FC = () => {
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    api.getWorkerById('wrk-1').then(res => {
      if (res.worker) setWorker(res.worker);
    });
  }, []);

  if (!worker) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 pb-24 md:pb-12 text-center">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          डिजिटल कामगार पहचान पत्र
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Official Digital Worker ID Card • Scan QR to verify publicly
        </p>
      </div>

      <div className="flex justify-center pt-2">
        <DigitalWorkerIdCard worker={worker} showPrintButton={true} />
      </div>
    </div>
  );
};
