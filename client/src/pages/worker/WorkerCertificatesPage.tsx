import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Certificate, Worker } from '../../types';
import { CertificateCard } from '../../components/worker/CertificateCard';

export const WorkerCertificatesPage: React.FC = () => {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    api.getWorkerById('wrk-1').then(res => {
      if (res.worker) setWorker(res.worker);
      if (res.certificates) setCerts(res.certificates);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 md:pb-12 text-center">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          कौशल प्रशस्ति पत्र (Milestone Certificates)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Platform-issued Skill Recognition Certificates based on verified customer ratings
        </p>
      </div>

      <div className="space-y-6 pt-4 flex flex-col items-center">
        {certs.map(c => (
          <CertificateCard key={c.id} certificate={c} workerPhoto={worker?.profilePhoto} />
        ))}
      </div>
    </div>
  );
};

export const WorkerProfilePageSelf: React.FC = () => {
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    api.getWorkerById('wrk-1').then(res => {
      if (res.worker) setWorker(res.worker);
    });
  }, []);

  if (!worker) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-24 md:pb-12">
      <h1 className="text-2xl font-black text-slate-900">मेरी प्रोफ़ाइल (My Profile)</h1>
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center space-x-4">
          <img
            src={worker.profilePhoto}
            alt={worker.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-coop-500 shadow-sm"
          />
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">{worker.name}</h3>
            <p className="text-slate-500">Phone: {worker.phone} • Worker ID: {worker.workerId}</p>
            <div className="text-coop-800 font-bold mt-1">{worker.societyName}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">Primary Skill</span>
            <span className="font-bold text-slate-800">{worker.skills.map(s => s.name).join(', ')}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">Verification Status</span>
            <span className="font-bold text-emerald-700">✓ {worker.verificationStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
