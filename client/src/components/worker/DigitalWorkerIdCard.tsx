import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Worker } from '../../types';
import { ShieldCheck, Star, Award, CheckCircle2, Download, Printer } from 'lucide-react';

interface DigitalWorkerIdCardProps {
  worker: Worker;
  showPrintButton?: boolean;
}

export const DigitalWorkerIdCard: React.FC<DigitalWorkerIdCardProps> = ({
  worker,
  showPrintButton = true
}) => {
  const publicVerifyUrl = `${window.location.origin}/verify-worker/${worker.qrVerificationToken}`;

  const handlePrint = () => {
    window.print();
  };

  const getTierColor = (level: string) => {
    switch (level) {
      case 'MASTER':
        return 'from-purple-600 to-indigo-800 text-purple-100 border-purple-400';
      case 'GOLD':
        return 'from-amber-500 to-amber-700 text-amber-100 border-amber-300';
      case 'SILVER':
        return 'from-slate-400 to-slate-600 text-slate-100 border-slate-300';
      default:
        return 'from-amber-700 to-stone-800 text-amber-200 border-amber-600';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Front of ID Card */}
      <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white relative p-6">
        {/* Holographic Watermark / Cooperative Header */}
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-coop-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wider text-white">SAHAKAR SEVA</h3>
              <p className="text-[9px] uppercase tracking-widest text-coop-400 font-bold">
                Cooperative Shramik Card
              </p>
            </div>
          </div>

          <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border bg-gradient-to-r shadow-xs ${getTierColor(worker.skillLevel)}`}>
            {worker.skillLevel} TIER
          </span>
        </div>

        {/* Worker Main Visual Info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <img
              src={worker.profilePhoto}
              alt={worker.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-coop-400 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-1 bg-coop-600 text-white p-1 rounded-full border-2 border-slate-900 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-black text-lg text-white truncate leading-snug">
              {worker.name}
            </h4>
            <div className="text-xs font-mono text-amber-400 font-bold mb-1">
              ID: {worker.workerId}
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-1">
              {worker.societyName}
            </p>
          </div>
        </div>

        {/* Skills & Badges */}
        <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Verified Skills:</span>
            <span className="font-semibold text-white">
              {worker.skills.map(s => s.name).join(', ')}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/50 text-center">
            <div>
              <div className="text-[10px] text-slate-400">Rating</div>
              <div className="text-xs font-bold text-amber-400 flex items-center justify-center">
                <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                {worker.averageRating}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Jobs Done</div>
              <div className="text-xs font-bold text-white">
                {worker.completedJobs}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Status</div>
              <div className="text-xs font-bold text-emerald-400 uppercase">
                {worker.verificationStatus === 'VERIFIED' ? 'ACTIVE' : 'PENDING'}
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Verification Section */}
        <div className="flex items-center justify-between bg-white text-slate-900 rounded-2xl p-3.5 shadow-md">
          <div className="pr-3">
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">
              Scan to Verify Worker
            </p>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
              Instant public verification via cooperative registry.
            </p>
            <a
              href={publicVerifyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 text-[10px] text-coop-800 font-bold hover:underline"
            >
              Open Verification Link →
            </a>
          </div>

          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs shrink-0">
            <QRCodeSVG
              value={publicVerifyUrl}
              size={76}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Security Microprint */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[9px] text-slate-500 text-center flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-coop-500 inline" />
          <span>OFFICIAL DIGITAL CREDENTIAL • ISSUED BY COOPERATIVE FEDERATION</span>
        </div>
      </div>

      {/* Action Buttons */}
      {showPrintButton && (
        <div className="mt-4 flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print ID Card</span>
          </button>
          <a
            href={publicVerifyUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 bg-coop-50 hover:bg-coop-100 text-coop-800 text-xs font-semibold px-4 py-2 rounded-xl border border-coop-300 transition"
          >
            <ShieldCheck className="w-4 h-4 text-coop-700" />
            <span>Test QR Verify URL</span>
          </a>
        </div>
      )}
    </div>
  );
};
