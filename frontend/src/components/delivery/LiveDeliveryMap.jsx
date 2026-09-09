import React, { useEffect, useRef, useState } from 'react';

export default function LiveDeliveryMap({ 
  orderId, 
  pickupLocName = "Baramati Pune", 
  deliveryLocName = "Mumbai Vashi APMC", 
  transporterLocation, // { lat, lng }
  deliveryStatus,
  demoMode = true
}) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState({});
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isKeyConfigured = apiKey && apiKey !== 'YOUR_API_KEY_HERE';

  // Load Google Maps Script asynchronously
  useEffect(() => {
    if (!isKeyConfigured || demoMode) {
      setMapError(true); // Forces fallback to demo mode
      return;
    }

    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const scriptId = 'google-maps-api-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,directions`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => setMapError(true);
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => setMapLoaded(true));
      script.addEventListener('error', () => setMapError(true));
    }
  }, [apiKey, isKeyConfigured, demoMode]);

  // Initialize Map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstance) return;

    try {
      const google = window.google;
      const initialCenter = { lat: 18.5204, lng: 73.8567 }; // Pune default

      const map = new google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: 9,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          {
            "featureType": "poi",
            "stylers": [{ "visibility": "off" }]
          }
        ]
      });

      const dirService = new google.maps.DirectionsService();
      const dirRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#059669',
          strokeWeight: 5,
          strokeOpacity: 0.8
        }
      });

      setMapInstance(map);
      setDirectionsRenderer(dirRenderer);
    } catch (err) {
      console.error("Google Maps Initialization Error:", err);
      setMapError(true);
    }
  }, [mapLoaded, mapInstance]);

  // Update Markers & Directions Route
  useEffect(() => {
    if (!mapInstance || !directionsRenderer) return;

    const google = window.google;

    // Clear old markers
    Object.values(markers).forEach(m => m.setMap(null));

    // Geocode places and set route polylines
    const geocoder = new google.maps.Geocoder();

    const getCoords = (address) => {
      return new Promise((resolve) => {
        geocoder.geocode({ address: address + ", Maharashtra, India" }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0].geometry.location);
          } else {
            resolve(null);
          }
        });
      });
    };

    const updateRoute = async () => {
      const pickupCoords = await getCoords(pickupLocName);
      const deliveryCoords = await getCoords(deliveryLocName);

      if (!pickupCoords || !deliveryCoords) return;

      const transCoords = transporterLocation 
        ? new google.maps.LatLng(transporterLocation.lat, transporterLocation.lng)
        : pickupCoords;

      // Draw custom markers
      const markerOptions = {
        map: mapInstance,
        animation: google.maps.Animation.DROP
      };

      const mPickup = new google.maps.Marker({
        ...markerOptions,
        position: pickupCoords,
        title: 'Pickup (Farm)',
        icon: {
          url: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%2310b981" stroke-width="2"><path d="M2 22s8-4 8-10V2H2v10c0 6 8 10 8 10z"/></svg>',
          scaledSize: new google.maps.Size(32, 32)
        }
      });

      const mDelivery = new google.maps.Marker({
        ...markerOptions,
        position: deliveryCoords,
        title: 'Delivery (Buyer)',
        icon: {
          url: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"/></svg>',
          scaledSize: new google.maps.Size(32, 32)
        }
      });

      const mTrans = new google.maps.Marker({
        map: mapInstance,
        position: transCoords,
        title: 'Delivery Partner',
        icon: {
          url: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
          scaledSize: new google.maps.Size(40, 40)
        }
      });

      setMarkers({ pickup: mPickup, delivery: mDelivery, transporter: mTrans });

      // Request direction polyline
      const dirService = new google.maps.DirectionsService();
      dirService.route({
        origin: transCoords,
        destination: deliveryCoords,
        travelMode: google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        }
      });

      // Fit map bounds to show route
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(pickupCoords);
      bounds.extend(deliveryCoords);
      bounds.extend(transCoords);
      mapInstance.fitBounds(bounds);
    };

    updateRoute();
  }, [mapInstance, pickupLocName, deliveryLocName, transporterLocation, directionsRenderer]);

  // Recenter map on active carrier
  const handleRecenter = () => {
    if (!mapInstance || !markers.transporter) return;
    mapInstance.panTo(markers.transporter.getPosition());
    mapInstance.setZoom(12);
  };

  // Fallback Mock Tracking Vector (SVG) Render
  if (mapError || !isKeyConfigured) {
    return (
      <div className="relative w-full h-full min-h-[380px] lg:min-h-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between p-6">
        
        {/* Saffron white green background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/10 to-accent-50/10 pointer-events-none" />

        {/* Demo Indicator */}
        <div className="absolute top-4 right-4 z-10 bg-amber-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-sm animate-pulse">
          Demo Tracking Mode
        </div>

        {/* Dynamic Route SVG Map */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
          
          <svg className="w-full max-w-md h-48" viewBox="0 0 400 200">
            {/* Background Roads */}
            <path d="M 50 150 Q 200 50 350 120" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
            
            {/* Glowing route line */}
            <path d="M 50 150 Q 200 50 350 120" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" className="stroke-dasharray animate-[dash_4s_linear_infinite]" style={{ strokeDasharray: '8, 8' }} />

            {/* Farm pickup point */}
            <circle cx="50" cy="150" r="12" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
            <text x="50" y="154" fontSize="12" textAnchor="middle" fill="#0284c7">🌾</text>
            <text x="50" y="180" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#64748b">Pickup Farm</text>

            {/* Buyer Delivery APMC point */}
            <circle cx="350" cy="120" r="12" fill="#fee2e2" stroke="#dc2626" strokeWidth="3" />
            <text x="350" y="124" fontSize="12" textAnchor="middle" fill="#dc2626">📍</text>
            <text x="350" y="150" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#64748b">Vashi Buyer</text>

            {/* Moving Transporter truck */}
            <g className="animate-[moveTruck_12s_ease-in-out_infinite]" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <rect x="0" y="-12" width="20" height="12" fill="#3b82f6" rx="2" />
              <polygon points="20 -10, 26 -10, 26 -4, 20 -4" fill="#60a5fa" />
              <circle cx="5" cy="2" r="3" fill="#1e293b" />
              <circle cx="18" cy="2" r="3" fill="#1e293b" />
              <text x="10" y="-2" fontSize="9" fill="white" fontWeight="bold" textAnchor="middle">🚚</text>
            </g>

            {/* Keyframe stylesheet injection */}
            <style>{`
              @keyframes moveTruck {
                0% { transform: translate(50px, 150px); }
                50% { transform: translate(200px, 75px); }
                100% { transform: translate(350px, 120px); }
              }
            `}</style>
          </svg>

        </div>

        {/* Live coordinate tracking overlay */}
        <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center text-[10px] text-slate-400 font-bold">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>GPS Tracking Simulator Active</span>
          </span>
          <span>Lat: {transporterLocation?.lat?.toFixed(4) || '18.5204'} | Lng: {transporterLocation?.lng?.toFixed(4) || '73.8567'}</span>
        </div>

      </div>
    );
  }

  // Google Maps Frame render
  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
      
      {/* Google Map Div target */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Recenter button overlay */}
      <button
        onClick={handleRecenter}
        className="absolute top-4 left-4 bg-white dark:bg-slate-850 p-2.5 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 text-slate-700 dark:text-white"
      >
        <span>◎</span>
        <span>Recenter</span>
      </button>

    </div>
  );
}
