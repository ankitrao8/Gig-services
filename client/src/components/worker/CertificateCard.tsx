import React from 'react';
import { Certificate } from '../../types';
import { Award, ShieldCheck, Printer, CheckCircle, ExternalLink } from 'lucide-react';

interface CertificateCardProps {
  certificate: Certificate;
  workerPhoto?: string;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, workerPhoto }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Official Certificate Paper Frame */}
      <div className="w-full max-w-2xl bg-white border-8 border-double border-amber-600/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative text-center text-slate-800 overflow-hidden">
        {/* Corner Ornaments */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-600/60"></div>
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-600/60"></div>
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-600/60"></div>
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-600/60"></div>

        {/* Header Emblem */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-lg mb-2">
            <Award className="w-9 h-9" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wider uppercase font-serif">
            Sahakar Seva
          </h2>
          <div className="inline-block bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full border border-amber-300 mt-1">
            Platform-issued Skill Recognition Certificate
          </div>
        </div>

        {/* Certificate Body */}
        <div className="space-y-4 my-6">
          <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-medium">
            This recognition is proudly awarded to
          </p>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-coop-900 font-serif underline decoration-amber-400 decoration-2 underline-offset-8">
            {certificate.workerName}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed pt-2">
            for demonstrating consistent excellence, customer trust, and on-time reliability in:
          </p>

          <div className="text-lg sm:text-xl font-black text-amber-700 tracking-wide">
            {certificate.skill}
          </div>

          {/* Badges / Metrics Box */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto py-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Skill Tier</span>
              <div className="font-extrabold text-slate-900 text-sm text-amber-700">{certificate.level}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Jobs Completed</span>
              <div className="font-extrabold text-slate-900 text-sm">100+ Jobs</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Punctuality</span>
              <div className="font-extrabold text-slate-900 text-sm text-emerald-700">94%+ On-Time</div>
            </div>
          </div>
        </div>

        {/* Signatures & Verification */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-4 items-end text-left text-xs">
          <div>
            <div className="font-mono text-[10px] text-slate-500 mb-0.5">
              Cert ID: <span className="font-bold text-slate-800">{certificate.certificateNumber}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Date: <span className="font-semibold text-slate-700">{certificate.issueDate}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Token: {certificate.verificationToken}
            </div>
          </div>

          <div className="text-right">
            <div className="inline-block border-b-2 border-slate-800 pb-1 px-4 font-serif italic font-bold text-slate-900 text-sm">
              Shramik Samiti
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">
              Cooperative Verification Board
            </p>
          </div>
        </div>

        {/* Mandatory Regulatory Disclaimer */}
        <div className="mt-6 pt-3 border-t border-slate-100 text-[9px] text-slate-400 text-center leading-tight">
          Disclaimer: This is a cooperative platform performance credential based on completed verified household service bookings. It is not an official government, NSDC, or PMKVY certificate.
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex items-center space-x-3">
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print Certificate</span>
        </button>
      </div>
    </div>
  );
};
