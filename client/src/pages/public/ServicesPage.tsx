import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Worker, Skill } from '../../types';
import { WorkerMap } from '../../components/map/WorkerMap';
import { BookingWizardModal } from '../../components/booking/BookingWizardModal';
import {
  Search,
  Filter,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  Map as MapIcon,
  List
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [services, setServices] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [viewMode, setViewMode] = useState<'both' | 'list' | 'map'>('both');

  // Booking modal
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<Worker | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [selectedService, searchQuery, minRating, maxPrice, availableOnly, maxDistance]);

  const fetchServices = async () => {
    try {
      const res = await api.getServices();
      if (res.services) setServices(res.services);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWorkers = async () => {
    setIsLoading(true);
    try {
      const res = await api.getWorkers({
        service: selectedService || undefined,
        search: searchQuery || undefined,
        minRating: minRating > 0 ? minRating : undefined,
        maxPrice: maxPrice < 1000 ? maxPrice : undefined,
        availableOnly: availableOnly ? 'true' : undefined,
        maxDistance: maxDistance
      });
      if (res.workers) setWorkers(res.workers);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedService('');
    setSearchQuery('');
    setMinRating(0);
    setMaxPrice(1000);
    setAvailableOnly(false);
    setMaxDistance(15);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Discover Verified Cooperative Technicians
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Varanasi District Cooperative Federation • Zero Commission Surcharges
          </p>
        </div>

        {/* Search input */}
        <div className="flex items-center space-x-2 w-full md:w-96">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by worker name, skill or society..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
            />
          </div>

          {/* View toggle on desktop */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode('both')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${viewMode === 'both' ? 'bg-white shadow-xs text-coop-800' : 'text-slate-600'}`}
              title="Split View"
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${viewMode === 'list' ? 'bg-white shadow-xs text-coop-800' : 'text-slate-600'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${viewMode === 'map' ? 'bg-white shadow-xs text-coop-800' : 'text-slate-600'}`}
              title="Map View"
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Filters Sidebar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 font-bold text-sm text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-coop-700" />
              <span>Filter Workers</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs text-coop-700 hover:text-coop-800 font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Service Category */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Service Category
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-coop-500 focus:outline-hidden"
            >
              <option value="">All Services (Electrician, Plumber, etc.)</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          {/* Distance Radius */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Max Distance:</span>
              <span className="text-coop-800 font-bold">{maxDistance} km</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
              className="w-full accent-coop-600"
            />
          </div>

          {/* Maximum Starting Price */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Max Base Price:</span>
              <span className="text-coop-800 font-bold">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min={200}
              max={1000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-coop-600"
            />
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Minimum Rating
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 4.0, 4.5, 4.8].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setMinRating(r)}
                  className={`py-1.5 rounded-lg border text-xs font-bold transition flex items-center justify-center space-x-1 ${
                    minRating === r
                      ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {r > 0 ? (
                    <>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{r}+</span>
                    </>
                  ) : (
                    <span>All</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Available Now Only</span>
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-4 h-4 rounded text-coop-600 focus:ring-coop-500"
            />
          </div>
        </div>

        {/* Content Area: Map + Worker Cards */}
        <div className="lg:col-span-3 space-y-6">
          {/* Map view (if enabled) */}
          {(viewMode === 'both' || viewMode === 'map') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                <span>📍 Interactive Cooperative Technician Geo-Radar</span>
                <span>Green Pins: Verified Workers</span>
              </div>
              <WorkerMap
                workers={workers}
                searchRadiusKm={maxDistance}
                onSelectWorker={(w) => setSelectedWorkerForBooking(w)}
              />
            </div>
          )}

          {/* List of Workers */}
          {(viewMode === 'both' || viewMode === 'list') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
                <span>Showing {workers.length} verified cooperative workers</span>
                <span>Sorted by Distance & Skill Score</span>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-32 bg-slate-200/70 rounded-3xl animate-pulse" />
                  ))}
                </div>
              ) : workers.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-800">No workers found nearby</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Try expanding your search radius slider or resetting filter criteria to view more cooperative technicians.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 text-xs font-bold text-coop-700 bg-coop-50 px-4 py-2 rounded-xl border border-coop-200"
                  >
                    Reset Search Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workers.map((worker) => (
                    <div
                      key={worker.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-coop-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      {/* Top Row: Photo, Name, Badge */}
                      <div className="flex items-start space-x-3.5">
                        <div className="relative shrink-0">
                          <img
                            src={worker.profilePhoto}
                            alt={worker.name}
                            className="w-16 h-16 rounded-2xl object-cover border border-coop-300 shadow-xs"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                              worker.availabilityStatus === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            title={worker.availabilityStatus}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                              {worker.name}
                            </h3>
                            <span title="Cooperative Verified">
                              <ShieldCheck className="w-4 h-4 text-coop-600 shrink-0" />
                            </span>
                          </div>

                          <div className="text-xs text-coop-800 font-semibold mt-0.5">
                            {worker.skills[0]?.name}
                            {worker.skills.length > 1 && ` +${worker.skills.length - 1} more`}
                          </div>

                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {worker.societyName}
                          </div>
                        </div>

                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                          {worker.skillLevel}
                        </span>
                      </div>

                      {/* Middle Metrics Row */}
                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center text-xs">
                        <div>
                          <div className="flex items-center justify-center text-amber-600 font-extrabold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                            {worker.averageRating}
                          </div>
                          <span className="text-[10px] text-slate-400">Rating</span>
                        </div>

                        <div>
                          <div className="font-extrabold text-slate-800">
                            {worker.completedJobs}
                          </div>
                          <span className="text-[10px] text-slate-400">Jobs Done</span>
                        </div>

                        <div>
                          <div className="font-extrabold text-coop-700">
                            {worker.distanceKm ? `${worker.distanceKm} km` : '1.2 km'}
                          </div>
                          <span className="text-[10px] text-slate-400">Distance</span>
                        </div>
                      </div>

                      {/* Bottom Action Row: Price & Buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Starting from</span>
                          <span className="text-base font-black text-slate-900">₹{worker.startingPrice}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/worker/${worker.id}`}
                            className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition"
                          >
                            Profile
                          </Link>

                          <button
                            type="button"
                            onClick={() => setSelectedWorkerForBooking(worker)}
                            className="text-xs font-bold text-white bg-coop-700 hover:bg-coop-800 px-4 py-2 rounded-xl transition shadow-xs"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Wizard Modal */}
      {selectedWorkerForBooking && (
        <BookingWizardModal
          worker={selectedWorkerForBooking}
          isOpen={!!selectedWorkerForBooking}
          onClose={() => setSelectedWorkerForBooking(null)}
        />
      )}
    </div>
  );
};
