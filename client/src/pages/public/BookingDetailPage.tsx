import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Booking, Worker, Payment, Rating } from '../../types';
import { BookingTimeline } from '../../components/booking/BookingTimeline';
import { ArrowLeft } from 'lucide-react';

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [payment, setPayment] = useState<Payment | undefined>(undefined);
  const [rating, setRating] = useState<Rating | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchBookingDetails(id);
  }, [id]);

  const fetchBookingDetails = async (bookingId: string) => {
    setIsLoading(true);
    try {
      const res = await api.getBookingById(bookingId);
      if (res.booking) {
        setBooking(res.booking);
        setWorker(res.worker);
        setPayment(res.payment);
        setRating(res.rating);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-12 h-12 border-4 border-coop-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Fetching live booking coordinates and invoice status...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h3 className="text-lg font-bold text-slate-800">Booking Not Found</h3>
        <Link to="/services" className="inline-block mt-4 text-xs font-bold text-coop-700 bg-coop-50 px-4 py-2 rounded-xl">
          ← Return to Services Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link to="/customer/bookings" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Bookings</span>
        </Link>
      </div>

      <BookingTimeline
        booking={booking}
        worker={worker || undefined}
        payment={payment}
        rating={rating}
        onRefresh={() => fetchBookingDetails(booking.id)}
      />
    </div>
  );
};

export const BookWorkerPage: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (workerId) {
      api.getWorkerById(workerId).then(res => {
        if (res.worker) setWorker(res.worker);
        setIsLoading(false);
      });
    }
  }, [workerId]);

  if (isLoading || !worker) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-slate-900">Book {worker.name}</h1>
        <p className="text-xs text-slate-500">{worker.societyName}</p>
      </div>
      {/* We re-use BookingWizardModal or display directly */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
        <img
          src={worker.profilePhoto}
          alt={worker.name}
          className="w-20 h-20 rounded-2xl object-cover border-2 border-coop-500 mx-auto shadow-sm"
        />
        <div>
          <h3 className="font-extrabold text-base text-slate-900">{worker.name}</h3>
          <p className="text-xs text-coop-800 font-semibold">{worker.skills[0]?.name} • Starting ₹{worker.startingPrice}</p>
        </div>
        <Link
          to={`/worker/${worker.id}`}
          className="inline-block bg-coop-700 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md"
        >
          Open Interactive Booking Flow →
        </Link>
      </div>
    </div>
  );
};
