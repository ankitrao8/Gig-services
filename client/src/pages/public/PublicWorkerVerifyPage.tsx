import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ShieldCheck, CheckCircle2, Star, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';

export const PublicWorkerVerifyPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) verifyToken(token);
  }, [token]);

  const verifyToken = async (qrToken: string) => {
    setIsLoading(true);
    try {
      const res = await api.verifyWorkerPublic(qrToken);
      if (res.success && res.publicVerification) {
        setData(res.publicVerification);
      } else {
        setError(res.message || 'Worker verification record not found.');
      }
    } catch (err: any) {
      setError('Unable to verify worker token against cooperative registry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Verification Status Header */}
        <div className="text-center space-y-2">
          {isLoading ? (
            <div className="w-12 h-12 border-4 border-coop-600 border-t-transparent rounded-full animate-spin mx-auto" />
          ) : data ? (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg border-2 border-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-black tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                ✓ VERIFIED WORKER
              </span>
              <p className="text-[11px] text-slate-500 font-medium">
                Official Sahakar Seva Cooperative Federation Registry
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <span className="text-xs font-black tracking-widest uppercase text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200 inline-block">
                UNVERIFIED / INVALID QR TOKEN
              </span>
            </>
          )}
        </div>

        {/* Worker Details Card (Safe Redaction) */}
        {data && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={data.photo}
                alt={data.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-coop-500 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-lg text-slate-900 truncate">
                  {data.name}
                </h3>
                <div className="text-xs font-mono font-bold text-coop-800">
                  ID: {data.workerId}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {data.society}
                </div>
              </div>
            </div>

            {/* Public Verified Credentials Table */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Registered Skills:</span>
                <span className="font-bold text-slate-900">{data.skills.join(', ')}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Skill Level:</span>
                <span className="font-black text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {data.skillLevel}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Average Rating:</span>
                <span className="font-bold text-slate-900 flex items-center text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                  {data.rating} / 5.0
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Completed Jobs:</span>
                <span className="font-bold text-slate-900">{data.completedJobs} Verified Jobs</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">On-Time Punctuality:</span>
                <span className="font-bold text-emerald-700">{data.onTimePercentage}%</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="font-bold text-emerald-600 uppercase">
                  {data.verificationStatus === 'VERIFIED' ? 'ACTIVE & VERIFIED' : 'PENDING'}
                </span>
              </div>
            </div>

            {/* Privacy Shield Notice */}
            <div className="p-3 rounded-xl bg-coop-50/80 border border-coop-200 text-[10px] text-coop-900 space-y-1">
              <div className="font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-coop-700 inline" />
                <span>Protected Citizen Credential View</span>
              </div>
              <p className="text-slate-600 leading-tight">
                In compliance with data protection standards, sensitive personal records (Aadhaar, private mobile numbers, home address, and banking data) are strictly masked and securely maintained by the cooperative society.
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 text-center">
            {error}
          </div>
        )}

        <div className="pt-2 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-coop-800 hover:text-coop-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sahakar Seva Platform</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
