import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { CertificateCard } from '../../components/worker/CertificateCard';
import { Award, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const PublicCertificateVerifyPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [cert, setCert] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) fetchCert(token);
  }, [token]);

  const fetchCert = async (t: string) => {
    setIsLoading(true);
    try {
      const res = await api.verifyCertificatePublic(t);
      if (res.success && res.certificate) {
        setCert(res.certificate);
      } else {
        setError(res.message || 'Certificate record not found.');
      }
    } catch {
      setError('Unable to verify certificate token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-6">
      <div className="max-w-2xl w-full text-center space-y-2">
        <Link to="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-coop-800 hover:text-coop-900 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Home</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Cooperative Milestone Certificate Verification
        </h1>
        <p className="text-xs text-slate-500">
          Verify authenticity of platform-issued skill recognition milestones
        </p>
      </div>

      {isLoading ? (
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      ) : cert ? (
        <CertificateCard certificate={cert} />
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-red-200 text-center max-w-md shadow-lg">
          <p className="text-xs text-red-700 font-bold">{error}</p>
        </div>
      )}
    </div>
  );
};
