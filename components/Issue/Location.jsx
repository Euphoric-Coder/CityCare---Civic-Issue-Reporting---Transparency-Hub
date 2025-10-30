import { useState } from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

const Location = ({ formData, setFormData, errors }) => {
  const [markerPosition, setMarkerPosition] = useState({ x: 50, y: 50 });

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMarkerPosition({ x, y });

    const lat = 40.7128 + (y - 50) * 0.001;
    const lng = -74.0060 + (x - 50) * 0.001;

    setFormData({
      ...formData,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
    });
  };

  const handleCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
          });
          setMarkerPosition({ x: 50, y: 50 });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MapPin className="text-emerald-600" size={28} />
        Issue Location
      </h2>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Interactive Map
            </label>
            <button
              onClick={handleCurrentLocation}
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              <Navigation size={16} />
              Use Current Location
            </button>
          </div>

          <div
            onClick={handleMapClick}
            className="relative w-full h-80 rounded-xl overflow-hidden border-2 border-gray-200 cursor-crosshair bg-gradient-to-br from-teal-50 to-emerald-100 shadow-inner"
          >
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="25" x2="100" y2="25" stroke="#94a3b8" strokeWidth="0.2" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#94a3b8" strokeWidth="0.2" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#94a3b8" strokeWidth="0.2" />
                <line x1="25" y1="0" x2="25" y2="100" stroke="#94a3b8" strokeWidth="0.2" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="#94a3b8" strokeWidth="0.2" />
                <line x1="75" y1="0" x2="75" y2="100" stroke="#94a3b8" strokeWidth="0.2" />
              </svg>
            </div>

            <div
              className="absolute w-10 h-10 transform -translate-x-1/2 -translate-y-full transition-all duration-200 hover:scale-110"
              style={{ left: `${markerPosition.x}%`, top: `${markerPosition.y}%` }}
            >
              <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg" fill="currentColor" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                <p className="text-sm text-gray-600 font-medium">Click anywhere to set location</p>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="font-semibold">Coordinates:</span>
                <span className="font-mono">
                  {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Click or drag on the map to pinpoint the exact location
          </p>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
            Address or Landmark *
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.address ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
            } focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all`}
            placeholder="e.g., 123 Main Street, near Central Park"
          />
          {errors.address && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.address}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Help us locate the issue quickly and accurately
          </p>
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
          <div className="flex gap-3">
            <MapPin className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-emerald-900 mb-1">Location Tips</h3>
              <ul className="text-sm text-emerald-800 space-y-1">
                <li>• Be as specific as possible with landmarks</li>
                <li>• Double-check coordinates match the description</li>
                <li>• Include nearby intersections if applicable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
