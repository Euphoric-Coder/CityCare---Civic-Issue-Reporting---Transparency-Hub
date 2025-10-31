"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, AlertCircle } from "lucide-react";

const Location = ({ formData, setFormData, errors }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteContainerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  // ✅ Load Google Maps JS API dynamically
  useEffect(() => {
    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    }&libraries=places,marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.body.appendChild(script);
  }, []);

  // ✅ Initialize map, marker, and autocomplete
  useEffect(() => {
    if (!mapLoaded || !window.google) return;

    const center = {
      lat: formData.latitude || 40.7128,
      lng: formData.longitude || -74.006,
    };

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "YOUR_MAP_ID",
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    google.maps.importLibrary("marker").then(({ AdvancedMarkerElement }) => {
      const marker = new AdvancedMarkerElement({
        map,
        position: center,
        gmpDraggable: true,
      });
      markerRef.current = marker;

      marker.addListener("dragend", () => {
        const pos = marker.position;
        if (pos) {
          const lat = pos.lat();
          const lng = pos.lng();
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
        }
      });
    });

    // ✅ PlaceAutocompleteElement (modern)
    const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement();
    placeAutocomplete.id = "place-autocomplete";
    placeAutocomplete.className =
      "w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-gray-800 bg-white shadow-sm";
    placeAutocomplete.placeholder = "Search address or landmark...";
    autocompleteContainerRef.current?.appendChild(placeAutocomplete);

    // ✅ Apply light theme manually to fix black patch
    placeAutocomplete.style.setProperty("--gmpx-color-surface", "#ffffff");
    placeAutocomplete.style.setProperty("--gmpx-color-on-surface", "#1f2937");
    placeAutocomplete.style.setProperty("--gmpx-color-outline", "#d1d5db");
    placeAutocomplete.style.setProperty("--gmpx-color-primary", "#059669");
    placeAutocomplete.style.setProperty("--gmpx-border-radius", "12px");
    placeAutocomplete.style.setProperty(
      "--gmpx-shadow",
      "0 1px 3px rgba(0,0,0,0.1)"
    );

    // ✅ Handle place select
    placeAutocomplete.addEventListener("gmp-placeselect", async () => {
      const place = await placeAutocomplete.getPlace();
      if (!place || !place.location) {
        setManualMode(true);
        return;
      }

      const lat = place.location.lat();
      const lng = place.location.lng();

      if (markerRef.current) markerRef.current.position = place.location;
      map.panTo(place.location);
      map.setZoom(15);

      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        address:
          place.formattedAddress || place.displayName || "Selected location",
      }));
      setManualMode(false);
    });
  }, [mapLoaded]);

  // ✅ Current location
  const handleCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const loc = new google.maps.LatLng(latitude, longitude);
          if (markerRef.current) {
            markerRef.current.position = loc;
            markerRef.current.map.panTo(loc);
          }
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }));
        },
        (err) => console.error("Error getting location:", err)
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
        {/* 🔍 Autocomplete */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Search Address or Landmark
            </label>
            <button
              onClick={handleCurrentLocation}
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              <Navigation size={16} />
              Use Current Location
            </button>
          </div>
          <div ref={autocompleteContainerRef}></div>
          {errors.address && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.address}
            </p>
          )}
        </div>

        {/* 🧭 Manual Coordinates */}
        {manualMode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.latitude || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full mt-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                placeholder="Enter latitude"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.longitude || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full mt-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                placeholder="Enter longitude"
              />
            </div>
          </div>
        )}

        {/* 🗺️ Map */}
        <div className="relative w-full h-80 rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner">
          {!mapLoaded ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Loading map...
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}
        </div>

        {/* 📍 Coordinates */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-700">
          <div>
            <span className="font-semibold">Latitude:</span>{" "}
            {formData.latitude?.toFixed(6) || "—"}
          </div>
          <div>
            <span className="font-semibold">Longitude:</span>{" "}
            {formData.longitude?.toFixed(6) || "—"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
