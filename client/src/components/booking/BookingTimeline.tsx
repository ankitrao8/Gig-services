import React, { useState } from 'react';
import { Booking, Worker, Payment, Rating, BookingStatus } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  FileText,
  Printer,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingTimelineProps {
  booking: Booking;
  worker?: Worker;
  payment?: Payment;
  rating?: Rating;
  onRefresh?: () => void;
}

export const BookingTimeline: React.FC<BookingTimelineProps> = ({
  booking,
  worker,
  payment,
  rating: initialRating,
  onRefresh
}) => {
  const { user } = useAuth();
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [onTime, setOnTime] = useState(true);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState<Rating | null>(initialRating || null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const steps: { key: BookingStatus; label: string; desc: string }[] = [
    { key: 'REQUESTED', label: 'Booking Requested', desc: 'Customer placed service request' },
    { key: 'ACCEPTED', label: 'Worker Accepted', desc: 'Cooperative worker assigned' },
    { key: 'WORKER_ON_WAY', label: 'Worker On The Way', desc: 'Technician transit in progress' },
    { key: 'IN_PROGRESS', label: 'Service In Progress', desc: 'Work underway at residence' },
    { key: 'COMPLETED', label: 'Service Completed', desc: 'Work completed and verified' }
  ];

  const getStepIndex = (status: BookingStatus) => {
    switch (status) {
      case 'REQUESTED': return 0;
      case 'ACCEPTED': return 1;
      case 'WORKER_ON_WAY': return 2;
      case 'IN_PROGRESS': return 3;
      case 'COMPLETED': return 4;
      case 'CANCELLED': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(booking.status);

  // Status progression action for demo worker testing
  const handleAdvanceStatus = async (nextStatus: BookingStatus) => {
    setStatusUpdating(true);
    try {
      await api.updateBookingStatus(booking.id, nextStatus);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRating(true);
    try {
      const res = await api.submitRating({
        bookingId: booking.id,
        rating: ratingVal,
        review: reviewText,
        onTime
      });

      if (res.success && res.rating) {
        setRatingSubmitted(res.rating);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Booking Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase">
              Booking #{booking.id}
            </span>
            <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
              booking.status === 'COMPLETED'
                ? 'bg-emerald-100 text-emerald-800'
                : booking.status === 'CANCELLED'
                ? 'bg-red-100 text-red-800'
                : 'bg-amber-100 text-amber-800 animate-pulse'
            }`}>
              {booking.status}
            </span>
            {booking.emergency && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                🚨 Emergency
              </span>
            )}
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            {booking.serviceName} Service
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Scheduled for {booking.scheduledDate} at {booking.scheduledTime}
          </p>
        </div>

        {/* Worker Contact Capsule */}
        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-coop-50/80 border border-coop-200">
          <img
            src={worker?.profilePhoto || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'}
            alt={booking.workerName}
            className="w-11 h-11 rounded-xl object-cover border border-coop-500"
          />
          <div>
            <h4 className="font-bold text-xs text-slate-900 flex items-center space-x-1">
              <span>{booking.workerName}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-coop-600" />
            </h4>
            <div className="text-[10px] text-coop-800 font-medium">Cooperative Verified Technician</div>
            <a
              href={`tel:${booking.workerPhone}`}
              className="inline-flex items-center space-x-1 text-xs text-coop-700 font-bold hover:underline mt-0.5"
            >
              <Phone className="w-3 h-3" />
              <span>{booking.workerPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Interactive Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 mb-6">
          Live Service Progression
        </h3>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8 my-4 ml-4">
          {steps.map((s, idx) => {
            const isDone = currentStepIdx >= idx && booking.status !== 'CANCELLED';
            const isCurrent = currentStepIdx === idx && booking.status !== 'CANCELLED';

            return (
              <div key={s.key} className="relative group">
                {/* Circle Marker */}
                <div
                  className={`absolute -left-[33px] sm:-left-[41px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-coop-600 border-coop-600 text-white shadow-md'
                      : isCurrent
                      ? 'bg-amber-500 border-amber-500 text-white animate-pulse'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>

                <div>
                  <h4 className={`text-sm font-bold ${isDone ? 'text-slate-900' : 'text-slate-500'}`}>
                    {s.label}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Fast-Forward Status Transition Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 font-semibold text-[11px]">
            ⚡ Worker/Admin Demo Quick Actions:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {booking.status === 'REQUESTED' && (
              <button
                onClick={() => handleAdvanceStatus('ACCEPTED')}
                disabled={statusUpdating}
                className="bg-coop-700 hover:bg-coop-800 text-white px-3 py-1.5 rounded-lg font-bold"
              >
                Accept Booking →
              </button>
            )}
            {booking.status === 'ACCEPTED' && (
              <button
                onClick={() => handleAdvanceStatus('WORKER_ON_WAY')}
                disabled={statusUpdating}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg font-bold"
              >
                Mark "Worker on the Way" →
              </button>
            )}
            {booking.status === 'WORKER_ON_WAY' && (
              <button
                onClick={() => handleAdvanceStatus('IN_PROGRESS')}
                disabled={statusUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold"
              >
                Start Service →
              </button>
            )}
            {booking.status === 'IN_PROGRESS' && (
              <button
                onClick={() => handleAdvanceStatus('COMPLETED')}
                disabled={statusUpdating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold"
              >
                Mark Complete Job →
              </button>
            )}
            {booking.status === 'COMPLETED' && (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                ✓ Service Completed & Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Verified Customer Rating Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 mb-2">
          Customer Service Rating
        </h3>

        {booking.status !== 'COMPLETED' ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Rating locked until service completion</p>
              <p className="text-[11px] mt-0.5">
                To prevent fake reviews, Sahakar Seva requires the job to be marked <b>COMPLETED</b> and payment verified before rating is unlocked.
              </p>
            </div>
          </div>
        ) : ratingSubmitted ? (
          <div className="p-5 rounded-2xl bg-coop-50 border border-coop-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-coop-900">Your Verified Review:</span>
              <div className="flex text-amber-500">
                {[...Array(ratingSubmitted.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-700 italic">"{ratingSubmitted.review}"</p>
            <div className="text-[10px] text-slate-500">
              Punctual on-time delivery: <b>{ratingSubmitted.onTime ? 'YES' : 'NO'}</b> • Submitted on {ratingSubmitted.createdAt.split('T')[0]}
            </div>
          </div>
        ) : (
          <form onSubmit={handleRateSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                How was your experience with {booking.workerName}?
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingVal(star)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= ratingVal
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">
                  {ratingVal} Stars
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs font-medium text-slate-700">
              <span>Was the worker on time?</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setOnTime(true)}
                  className={`px-3 py-1 rounded-lg border text-xs font-bold ${
                    onTime ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300 text-slate-600'
                  }`}
                >
                  YES
                </button>
                <button
                  type="button"
                  onClick={() => setOnTime(false)}
                  className={`px-3 py-1 rounded-lg border text-xs font-bold ${
                    !onTime ? 'bg-red-600 text-white border-red-600' : 'border-slate-300 text-slate-600'
                  }`}
                >
                  NO
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Written Review
              </label>
              <textarea
                rows={3}
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience (e.g. professional quality, polite behavior, clean finish)..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingRating}
              className="bg-coop-700 hover:bg-coop-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition"
            >
              {isSubmittingRating ? 'Verifying & Submitting...' : 'Submit Verified Rating'}
            </button>
          </form>
        )}
      </div>

      {/* 4. Digital GST Invoice */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-coop-700" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">
              Digital Cooperative Invoice
            </h3>
          </div>
          <button
            onClick={handlePrintInvoice}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 font-sans text-xs space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-black text-base text-slate-900">SAHAKAR SEVA</h4>
              <p className="text-[10px] text-slate-500">Cooperative Gig Services Federation</p>
              <p className="text-[10px] text-slate-500">Dashashwamedh Ward, Varanasi, UP - 221001</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Invoice ID</span>
              <div className="font-mono font-bold text-slate-900">INV-SS-{booking.id}</div>
              <div className="text-[10px] text-slate-500">Date: {booking.scheduledDate}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-200 text-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Billed To</span>
              <div className="font-bold text-slate-900">{booking.customerName}</div>
              <div className="text-[10px]">{booking.address}</div>
              <div className="text-[10px]">Phone: {booking.customerPhone}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Service Provider</span>
              <div className="font-bold text-slate-900">{booking.workerName}</div>
              <div className="text-[10px]">Society: Varanasi Labour Cooperative Society</div>
              <div className="text-[10px]">Skill: {booking.serviceName}</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-slate-600">
              <span>Technician Service Charge</span>
              <span>₹{booking.estimatedPrice - 45}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Cooperative Platform Tech Fee</span>
              <span>₹20.00</span>
            </div>
            <div className="flex justify-between text-coop-700 font-medium">
              <span>Shramik Welfare & Insurance Contribution</span>
              <span>₹25.00</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (5%)</span>
              <span>₹{Math.round((booking.estimatedPrice - 45) * 0.05)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Paid:</span>
              <span className="text-coop-800">₹{booking.finalPrice || booking.estimatedPrice}</span>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Payment Status: <b>PAID VIA UPI</b></span>
            <span>Transaction ID: TXN-UPI-2026-{booking.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
