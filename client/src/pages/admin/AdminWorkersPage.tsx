import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Worker, VerificationStatus } from '../../types';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Search, Filter } from 'lucide-react';

export const AdminWorkersPage: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkers();
  }, [statusFilter]);

  const fetchWorkers = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminWorkers({
        status: statusFilter !== 'ALL' ? statusFilter : undefined
      });
      if (res.workers) setWorkers(res.workers);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (workerId: string, newStatus: VerificationStatus) => {
    try {
      const res = await api.verifyWorker(workerId, newStatus);
      if (res.success) {
        setActionMsg(`Worker status updated to ${newStatus}`);
        setTimeout(() => setActionMsg(null), 3000);
        fetchWorkers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = workers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.phone.includes(search) ||
    w.workerId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {actionMsg && (
        <div className="fixed top-12 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl animate-in fade-in">
          ✓ {actionMsg}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Cooperative Worker Verification Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Society Secretaries & Federation Member Approval • 1-Click Verification
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2 w-full md:w-80">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by worker name, ID or phone..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { id: 'ALL', label: 'All Workers' },
          { id: 'PENDING', label: 'Pending Verification' },
          { id: 'VERIFIED', label: 'Verified Active' },
          { id: 'SUSPENDED', label: 'Suspended' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setStatusFilter(t.id)}
            className={`px-4 py-2 rounded-xl transition ${
              statusFilter === t.id ? 'bg-coop-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Worker</th>
                <th className="py-3.5 px-4">Worker ID</th>
                <th className="py-3.5 px-4">Cooperative Society</th>
                <th className="py-3.5 px-4">Skills</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">Loading verification roster...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">No workers found.</td>
                </tr>
              ) : (
                filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={w.profilePhoto}
                          alt={w.name}
                          className="w-10 h-10 rounded-xl object-cover border border-coop-500"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{w.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{w.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {w.workerId}
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-600 max-w-xs truncate">
                      {w.societyName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-coop-800">
                        {w.skills.map(s => s.name).join(', ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        w.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : w.verificationStatus === 'PENDING'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {w.verificationStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <Link
                          to={`/worker/${w.id}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                        >
                          View
                        </Link>

                        {w.verificationStatus !== 'VERIFIED' && (
                          <button
                            onClick={() => handleVerify(w.id, 'VERIFIED')}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-xs"
                          >
                            ✓ Verify
                          </button>
                        )}

                        {w.verificationStatus === 'VERIFIED' && (
                          <button
                            onClick={() => handleVerify(w.id, 'SUSPENDED')}
                            className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-amber-100 text-slate-700 font-bold text-[11px] transition"
                          >
                            Suspend
                          </button>
                        )}

                        {w.verificationStatus === 'PENDING' && (
                          <button
                            onClick={() => handleVerify(w.id, 'REJECTED')}
                            className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold text-[11px] transition"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
