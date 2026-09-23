import React, { useState } from 'react';
import { Worker, BookingType, PaymentMethod } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  IndianRupee,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Upload
} from 'lucide-react';

interface BookingWizardModalProps {
  worker: Worker;
  isOpen: boolean;
  onClose: () => void;
  defaultEmergency?: boolean;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  worker,
  isOpen,
  onClose,
  defaultEmergency = false
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState(worker.skills[0]?.skillId || 'sk-elec');
  const [bookingType, setBookingType] = useState<BookingType>(defaultEmergency ? 'EMERGENCY' : 'INSTANT');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');
  const [address, setAddress] = useState('Flat 402, Ganga Heights, Dashashwamedh Ghat Road, Varanasi');
  const [problemDescription, setProblemDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('sunita@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const basePrice = worker.startingPrice;
  const emergencySurcharge = bookingType === 'EMERGENCY' ? 100 : 0;
  const platformFee = 20;
  const welfareContribution = 25;
  const subtotal = basePrice + emergencySurcharge;
  const gst = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + platformFee + welfareContribution + gst;

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, 10));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleConfirmAndPay = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create booking
      const res = await api.createBooking({
        workerId: worker.id,
        serviceId,
        bookingType,
        scheduledDate,
        scheduledTime,
        address,
        problemDescription: problemDescription || 'General maintenance check required.',
        emergency: bookingType === 'EMERGENCY',
        estimatedPrice: totalAmount
      });

      if (res.success && res.booking) {
        setCreatedBookingId(res.booking.id);

        // 2. Process simulated payment immediately
        await api.processPayment({
          bookingId: res.booking.id,
          amount: totalAmount,
          paymentMethod
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        setStep(10); // Final Confirmation step
      }
    } catch (err) {
      console.error('Booking failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewLiveTracking = () => {
    onClose();
    if (createdBookingId) {
      navigate(`/booking/${createdBookingId}`);
    } else {
      navigate('/customer/bookings');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <img
              src={worker.profilePhoto}
              alt={worker.name}
              className="w-10 h-10 rounded-2xl object-cover border border-coop-500"
            />
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-1.5">
                <span>Book {worker.name}</span>
                <ShieldCheck className="w-4 h-4 text-coop-600" />
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Step {step} of 10 • {worker.societyName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6 flex-1 space-y-6">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Step 1: Choose Service Required</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {worker.skills.map((skill) => (
                  <button
                    key={skill.skillId}
                    type="button"
                    onClick={() => setServiceId(skill.skillId)}
                    className={`p-4 rounded-2xl border text-left transition ${
                      serviceId === skill.skillId
                        ? 'bg-coop-50 border-coop-500 ring-2 ring-coop-400 text-coop-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-bold text-sm">{skill.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{skill.experienceYears} Years Exp • {skill.skillLevel}</div>
                    <div className="text-xs font-bold text-coop-700 mt-2">₹{worker.startingPrice} Base Visit</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Booking Type */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Step 2: Select Booking Type</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'INSTANT', title: '⚡ Instant Visit', desc: 'Worker arrives within 45-60 mins' },
                  { id: 'SCHEDULED', title: '📅 Scheduled', desc: 'Pick convenient date & time slot' },
                  { id: 'RECURRING', title: '🔁 Recurring', desc: 'Weekly or monthly repeat maintenance' },
                  { id: 'EMERGENCY', title: '🚨 Emergency', desc: 'Priority dispatch (+₹100 surcharge)' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setBookingType(t.id as BookingType)}
                    className={`p-4 rounded-2xl border text-left transition ${
                      bookingType === t.id
                        ? 'bg-coop-50 border-coop-500 ring-2 ring-coop-400 text-coop-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm">{t.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time Slot */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Step 3: Select Date & Time</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM', '06:00 PM', 'Immediate'].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setScheduledTime(slot)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                          scheduledTime === slot
                            ? 'bg-coop-700 text-white border-coop-700'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Service Address */}
          {step === 4 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Step 4: Confirm Service Address</h4>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">House / Flat / Landmark</label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
                  placeholder="Enter full address where worker will arrive..."
                />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-coop-600 shrink-0" />
                <span>Worker is located <b>1.2 km away</b> in Godowlia / Dashashwamedh Ward.</span>
              </div>
            </div>
          )}

          {/* Step 5: Problem Description */}
          {step === 5 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Step 5: Describe the Issue</h4>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Problem Details</label>
                <textarea
                  rows={4}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
                  placeholder="Describe what needs repair or servicing (e.g., MCB tripping, leaking faucet, door hinge loose)..."
                />
              </div>
            </div>
          )}

          {/* Step 6: Upload Optional Photo */}
          {step === 6 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Step 6: Upload Optional Photo (Simulation)</h4>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Click to upload photo of damaged part or appliance</p>
                <p className="text-[10px] text-slate-400 mt-1">Helps cooperative worker bring correct spare parts</p>
                <button
                  type="button"
                  onClick={() => setImagePreview('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300')}
                  className="mt-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium"
                >
                  Use Sample Issue Photo
                </button>
              </div>

              {imagePreview && (
                <div className="flex items-center space-x-3 p-2 bg-coop-50 border border-coop-200 rounded-xl">
                  <img src={imagePreview} alt="Issue preview" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="text-xs text-coop-800 font-semibold">Photo attached successfully</div>
                </div>
              )}
            </div>
          )}

          {/* Step 7: Transparent Price Breakdown */}
          {step === 7 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Step 7: Transparent Cooperative Pricing</h4>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Base Service Charge ({worker.skills.find(s => s.skillId === serviceId)?.name || 'Technician'}):</span>
                  <span className="font-bold">₹{basePrice}</span>
                </div>
                {bookingType === 'EMERGENCY' && (
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Emergency Priority Dispatch:</span>
                    <span>+₹100</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Cooperative Platform Tech Fee:</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-coop-700 font-medium">
                  <span>Worker Welfare & Insurance Fund:</span>
                  <span>₹{welfareContribution}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (5%):</span>
                  <span>₹{gst}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-slate-900 text-sm">
                  <span>Total Amount:</span>
                  <span className="text-coop-800">₹{totalAmount}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                *100% transparent. No hidden middleman commissions. ₹25 directly deposits into {worker.name}'s cooperative insurance fund.
              </p>
            </div>
          )}

          {/* Step 8: Confirm Booking */}
          {step === 8 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Step 8: Review & Confirm</h4>
              <div className="p-4 rounded-2xl bg-coop-50/70 border border-coop-200 text-xs space-y-2">
                <div><b>Worker:</b> {worker.name} ({worker.skills[0]?.name})</div>
                <div><b>Date & Time:</b> {scheduledDate} at {scheduledTime}</div>
                <div><b>Address:</b> {address}</div>
                <div><b>Booking Type:</b> {bookingType}</div>
                <div><b>Estimated Total:</b> ₹{totalAmount}</div>
              </div>
            </div>
          )}

          {/* Step 9: Payment Gateway Simulation */}
          {step === 9 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Step 9: Choose Payment Method</h4>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { id: 'CARD', label: 'RuPay / Card', icon: CreditCard },
                  { id: 'NET_BANKING', label: 'Net Banking', icon: ShieldCheck },
                  { id: 'CASH', label: 'Cash on Service', icon: IndianRupee }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition ${
                      paymentMethod === m.id
                        ? 'bg-coop-50 border-coop-500 ring-2 ring-coop-400 text-coop-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <m.icon className="w-4 h-4 text-coop-600" />
                    <span className="font-bold text-xs">{m.label}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'UPI' && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Simulated UPI Gateway (Instant Approval)</span>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <input
                    type="text"
                    value={cardNumber}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                  />
                  <span className="text-[10px] text-slate-400 block">RuPay / Visa / Mastercard Test Card</span>
                </div>
              )}
            </div>
          )}

          {/* Step 10: Confirmation & Success */}
          {step === 10 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Booking Confirmed!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your request has been accepted by {worker.name} from Varanasi Labour Cooperative Society.
              </p>
              <div className="p-4 rounded-2xl bg-coop-50 border border-coop-200 max-w-sm mx-auto text-xs space-y-1.5 text-left font-mono">
                <div><b>Booking ID:</b> {createdBookingId || 'BK-1001'}</div>
                <div><b>Amount Paid:</b> ₹{totalAmount} (via {paymentMethod})</div>
                <div><b>Worker Arrival:</b> {scheduledDate} • {scheduledTime}</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-3xl">
          {step < 10 ? (
            <>
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1 || isSubmitting}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border ${
                  step === 1
                    ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                    : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              {step < 9 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center space-x-1.5 bg-coop-700 hover:bg-coop-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmAndPay}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md"
                >
                  {isSubmitting ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Pay ₹{totalAmount} & Confirm</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handleViewLiveTracking}
                className="w-full bg-coop-700 hover:bg-coop-800 text-white font-bold text-xs py-3 rounded-xl transition shadow-md"
              >
                Track Live Booking Status & Invoice →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
