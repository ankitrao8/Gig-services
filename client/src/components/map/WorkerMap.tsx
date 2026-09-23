import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Worker } from '../../types';
import { Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix Leaflet default icon issues in bundlers
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const customerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const workerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface WorkerMapProps {
  workers: Worker[];
  customerLat?: number;
  customerLng?: number;
  searchRadiusKm?: number;
  onSelectWorker?: (worker: Worker) => void;
}

export const WorkerMap: React.FC<WorkerMapProps> = ({
  workers,
  customerLat = 25.3176,
  customerLng = 82.9739,
  searchRadiusKm = 5,
  onSelectWorker
}) => {
  return (
    <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative">
      <MapContainer
        center={[customerLat, customerLng]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Customer Location Pin */}
        <Marker position={[customerLat, customerLng]} icon={customerIcon}>
          <Popup>
            <div className="text-xs font-sans">
              <p className="font-bold text-slate-900">📍 You Are Here</p>
              <p className="text-slate-500 text-[10px]">Dashashwamedh Ward, Varanasi</p>
            </div>
          </Popup>
        </Marker>

        {/* Search Radius Circle */}
        <Circle
          center={[customerLat, customerLng]}
          radius={searchRadiusKm * 1000}
          pathOptions={{ fillColor: '#22c55e', fillOpacity: 0.1, color: '#16a34a', weight: 1.5 }}
        />

        {/* Verified Worker Pins */}
        {workers.map((worker) => (
          <Marker
            key={worker.id}
            position={[worker.latitude, worker.longitude]}
            icon={workerIcon}
            eventHandlers={{
              click: () => onSelectWorker && onSelectWorker(worker)
            }}
          >
            <Popup>
              <div className="text-xs font-sans p-1 min-w-[160px]">
                <div className="flex items-center space-x-2 mb-1.5">
                  <img
                    src={worker.profilePhoto}
                    alt={worker.name}
                    className="w-8 h-8 rounded-full object-cover border border-coop-500"
                  />
                  <div>
                    <h5 className="font-bold text-slate-900 leading-tight flex items-center">
                      {worker.name}
                      <ShieldCheck className="w-3 h-3 text-coop-600 ml-1 inline" />
                    </h5>
                    <span className="text-[10px] text-coop-800 font-medium">
                      {worker.skills[0]?.name || 'Technician'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] mb-2 bg-slate-50 p-1 rounded">
                  <span className="flex items-center text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                    {worker.averageRating}
                  </span>
                  <span className="text-slate-500">
                    {worker.completedJobs} jobs
                  </span>
                  <span className="text-coop-700 font-bold">
                    ₹{worker.startingPrice}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <Link
                    to={`/worker/${worker.id}`}
                    className="text-center py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-semibold"
                  >
                    Profile
                  </Link>
                  <Link
                    to={`/book/${worker.id}`}
                    className="text-center py-1 rounded bg-coop-700 hover:bg-coop-800 text-white text-[10px] font-semibold"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
