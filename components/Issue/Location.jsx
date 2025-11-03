"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Link2, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";

export default function Location({ formData, setFormData, errors }) {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { theme } = useTheme();

  // --- Load Google Maps script once ---
  useEffect(() => {
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    if (document.getElementById("google-maps-script")) return;

    window.initMap = initMap;
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    }&libraries=places&v=weekly&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);
  }, [theme]);

  // --- Initialize the Map after script loads ---
  function initMap() {
    if (!window.google || !window.google.maps) return;

    const center = {
      lat: formData.latitude || 20.5937,
      lng: formData.longitude || 78.9629,
    };

    const mapObj = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      styles:
        theme === "dark"
          ? [
              { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
              {
                elementType: "labels.text.fill",
                stylers: [{ color: "#8ec3b9" }],
              },
              { featureType: "water", stylers: [{ color: "#0e1626" }] },
            ]
          : [],
    });

    const marker = new window.google.maps.Marker({
      map: mapObj,
      position: center,
      draggable: true,
    });
    markerRef.current = marker;

    // Reverse geocode on drag
    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      reverseGeocode(pos.lat(), pos.lng());
    });

    // Autocomplete setup
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["address_components", "geometry", "formatted_address"],
        componentRestrictions: { country: "in" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        handleManualSearch();
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      mapObj.panTo({ lat, lng });
      mapObj.setZoom(15);
      marker.setPosition({ lat, lng });

      fillForm(place, lat, lng);
    });

    setMapLoaded(true);
  }

  // --- Helper: construct the longest formatted address ---
  const buildFullAddress = (components) => {
    if (!components) return "";
    const parts = [];
    const priority = [
      "premise",
      "subpremise",
      "establishment",
      "point_of_interest",
      "sublocality_level_3",
      "sublocality_level_2",
      "sublocality_level_1",
      "locality",
      "administrative_area_level_3",
      "administrative_area_level_2",
      "administrative_area_level_1",
      "country",
      "postal_code",
    ];
    priority.forEach((type) => {
      const comp = components.find((c) => c.types.includes(type));
      if (comp && !parts.includes(comp.long_name)) parts.push(comp.long_name);
    });
    return parts.join(", ");
  };

  // --- Fill form fields with place data ---
  const fillForm = (place, lat, lng) => {
    const components = place.address_components || [];

    const get = (t) =>
      components.find((c) => c.types.includes(t))?.long_name || "";

    const fullAddress =
      buildFullAddress(components) || place.formatted_address || "";

    setFormData({
      ...formData,
      searchQuery: inputRef.current.value,
      address: fullAddress, // ✅ longest formatted address
      city: get("locality") || get("administrative_area_level_2") || "",
      state: get("administrative_area_level_1") || "",
      postal: get("postal_code") || "",
      mapUrl: `https://www.google.com/maps?q=${lat},${lng}`,
      latitude: lat,
      longitude: lng,
    });
  };

  // --- Reverse Geocoding for manual drag or current location ---
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      const result = data.results?.[0];
      if (!result) return;

      const components = result.address_components || [];
      const get = (t) =>
        components.find((c) => c.types.includes(t))?.long_name || "";

      const fullAddress =
        buildFullAddress(components) || result.formatted_address || "";

      setFormData({
        ...formData,
        searchQuery: inputRef.current?.value || "",
        address: fullAddress, // ✅ longest formatted address
        city: get("locality") || get("administrative_area_level_2") || "",
        state: get("administrative_area_level_1") || "",
        postal: get("postal_code") || "",
        mapUrl: `https://www.google.com/maps?q=${lat},${lng}`,
        latitude: lat,
        longitude: lng,
      });
    } catch (err) {
      console.error("Reverse geocode failed:", err);
    }
  };

  // --- Manual search fallback when pressing Enter ---
  const handleManualSearch = async () => {
    const query = inputRef.current.value.trim();
    if (!query) return;

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          query
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      const result = data.results?.[0];
      if (!result) return alert("No matching address found.");

      const lat = result.geometry.location.lat;
      const lng = result.geometry.location.lng;

      const map = markerRef.current.getMap();
      map.panTo({ lat, lng });
      map.setZoom(15);
      markerRef.current.setPosition({ lat, lng });

      const components = result.address_components || [];
      const get = (t) =>
        components.find((c) => c.types.includes(t))?.long_name || "";
      const fullAddress =
        buildFullAddress(components) || result.formatted_address || "";

      setFormData({
        ...formData,
        searchQuery: query,
        address: fullAddress,
        city: get("locality") || get("administrative_area_level_2") || "",
        state: get("administrative_area_level_1") || "",
        postal: get("postal_code") || "",
        mapUrl: `https://www.google.com/maps?q=${lat},${lng}`,
        latitude: lat,
        longitude: lng,
      });
    } catch (err) {
      console.error("Manual geocode failed:", err);
    }
  };

  // --- Current location handler ---
  const handleCurrentLocation = () => {
    if (!navigator.geolocation || !mapLoaded) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { latitude, longitude } = coords;
      const map = markerRef.current.getMap();
      map.panTo({ lat: latitude, lng: longitude });
      map.setZoom(15);
      markerRef.current.setPosition({ lat: latitude, lng: longitude });
      reverseGeocode(latitude, longitude);
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
        <MapPin className="text-emerald-600 dark:text-emerald-400" size={28} />
        Issue Location
      </h2>

      {/* Search field */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Search Address *
          </label>
          <button
            onClick={handleCurrentLocation}
            className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            <Navigation size={16} /> Use Current
          </button>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type address..."
          value={formData.searchQuery || ""}
          onChange={(e) =>
            setFormData({ ...formData, searchQuery: e.target.value })
          }
          onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
        />
      </div>

      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full h-80 rounded-xl border-2 border-gray-200 dark:border-gray-700"
      />

      {/* Address info fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {["address", "city", "state", "postal"].map((key) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 capitalize">
              {key === "postal" ? "Postal Code *" : `${key} *`}
            </label>
            <input
              value={formData[key] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-xl
                ${
                  errors[key]
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 dark:border-gray-700 focus:border-emerald-500 "
                }
                border-2 border-gray-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-emerald-100 outline-none`}
            />
            {errors[key] && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors[key]}
              </p>
            )}
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
            Google Maps URL
            <Link2
              size={14}
              className="text-emerald-600 dark:text-emerald-400"
            />
          </label>
          <input
            value={formData.mapUrl || ""}
            onChange={(e) =>
              setFormData({ ...formData, mapUrl: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
