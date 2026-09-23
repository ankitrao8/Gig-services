import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Worker } from '../../types';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, MapPin, ShieldCheck, Star, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('sk-plumb');
  const [matchedWorker, setMatchedWorker] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      findNearestWorker(selectedService);
    }
  }, [isOpen, selectedService]);

  const findNearestWorker = async (serviceId: string) => {
    setIsLoading(true);
    try {
      const res = await api.getWorkers({
        service: serviceId,
        emergency: 'true',
        availableOnly: 'true'
      });
      if (res.workers && res.workers.length > 0) {
        setMatchedWorker(res.workers[0]);
      } else {
        setMatchedWorker(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmEmergency = async () => {
    setIsLoading(true);
    try {
      const res = await api.createEmergencyBooking({
        serviceId: selectedService,
        address: 'Current Location: Dashashwamedh Ghat Road, Varanasi',
        problemDescription: 'URGENT: Emergency service required immediately.'
      });

      if (res.success && res.booking) {
        setBookingId(res.booking.id);
        setIsDispatched(true);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.5 }
        });
      }
    } catch (err) {
      console.error('Emergency dispatch error', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-red-500/80 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <AlertTriangle className="w-6 h-6 text-amber-300 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-wide flex items-center space-x-2">
                <span>🚨 EMERGENCY SERVICE DISPATCH</span>
              </h3>
              <p className="text-[11px] text-red-100">
                Priority matching with nearest verified cooperative worker
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!isDispatched ? (
            <>
              {/* Step 1: Select Emergency Service */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Select Emergency Service
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'sk-plumb', name: 'Plumber', icon: '🔧' },
                    { id: 'sk-elec', name: 'Electrician', icon: '⚡' },
                    { id: 'sk-ac', name: 'AC / Gas Leak', icon: '❄️' },
                    { id: 'sk-carp', name: 'Lock / Door', icon: '🪚' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedService(s.id)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        selectedService === s.id
                          ? 'bg-red-50 border-red-500 ring-2 ring-red-400 text-red-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="text-xl mb-1">{s.icon}</div>
                      <div className="text-xs">{s.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Location Detection */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Detected Location: <b>Dashashwamedh Ward, Varanasi</b></span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  GPS Active
                </span>
              </div>

              {/* Step 3: Matched Worker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  2. Nearest Available Verified Worker Found
                </label>
                {isLoading ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Scanning nearby cooperative clusters...
                  </div>
                ) : matchedWorker ? (
                  <div className="p-4 rounded-2xl bg-coop-50/70 border border-coop-300 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={matchedWorker.profilePhoto}
                        alt={matchedWorker.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-coop-500"
                      />
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 flex items-center space-x-1">
                          <span>{matchedWorker.name}</span>
                          <ShieldCheck className="w-4 h-4 text-coop-700" />
                        </h4>
                        <div className="text-xs text-coop-800 font-medium">
                          {matchedWorker.skills[0]?.name} • {matchedWorker.societyName}
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-600 mt-1">
                          <span className="flex items-center text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                            {matchedWorker.averageRating}
                          </span>
                          <span><b>{matchedWorker.distanceKm || 1.1} km</b> away</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-red-600 flex items-center justify-end space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>ETA: {matchedWorker.etaMinutes || 8} min</span>
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 mt-1">
                        ₹{matchedWorker.startingPrice + 100}
                      </div>
                      <span className="text-[9px] text-slate-400">includes emergency fee</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    No emergency workers currently available in this specific category within 5km. Try Electrician or Plumber.
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Dispatched state */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Emergency Dispatched!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Worker <b>{matchedWorker?.name}</b> has accepted priority dispatch and is moving to your location.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-xs space-y-1 text-left font-mono">
                <div><b>Booking ID:</b> {bookingId}</div>
                <div><b>Worker Contact:</b> {matchedWorker?.phone || '+91 8888888888'}</div>
                <div><b>Estimated Arrival:</b> {matchedWorker?.etaMinutes || 8} minutes</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3">
          {!isDispatched ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!matchedWorker || isLoading}
                onClick={handleConfirmEmergency}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
              >
                <span>Confirm Emergency Dispatch</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (bookingId) navigate(`/booking/${bookingId}`);
              }}
              className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold py-3 rounded-xl transition shadow-md"
            >
              Track Live Worker Arrival & Timeline →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
