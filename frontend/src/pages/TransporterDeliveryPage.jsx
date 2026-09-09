import React, { useEffect, useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import LiveDeliveryMap from '../components/delivery/LiveDeliveryMap';
import { io } from 'socket.io-client';
import { ChevronLeft, MapPin, Truck, ShieldAlert, CheckCircle, Wifi, WifiOff } from 'lucide-react';

export default function TransporterDeliveryPage({ orderId = 'AGR1024', onNavigate }) {
  const { t } = () => ({ t: (k) => k }); // simple fallback inside transporter layout

  const [deliveryStatus, setDeliveryStatus] = useState('Transporter Assigned');
  const [transporterLocation, setTransporterLocation] = useState({ lat: 18.5204, lng: 73.8567 });
  const [watchId, setWatchId] = useState(null);

  // Connection & Permission states
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('🔴 GPS Inactive');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineBuffer, setOfflineBuffer] = useState([]);
  const [networkAlert, setNetworkAlert] = useState('');
  const [socket, setSocket] = useState(null);

  // Delivery order specifications
  const deliveryInfo = {
    buyerName: 'ABC Foods (Vashi APMC)',
    quantity: '500 Kg Tomato',
    pickup: 'Baramati Farm',
    delivery: 'Mumbai APMC'
  };

  // Socket Connection setup
  useEffect(() => {
    const s = io('http://localhost:5000', {
      transports: ['websocket'],
      timeout: 3000
    });
    setSocket(s);

    s.on('connect', () => {
      console.log("[Socket] Driver socket connected to server");
      s.emit('join-delivery', orderId);
      // Flush buffered locations if connection recovered
      if (offlineBuffer.length > 0) {
        setNetworkAlert('Connection restored / इंटरनेट वापस आ गया है');
        setTimeout(() => setNetworkAlert(''), 3000);
        offlineBuffer.forEach(loc => {
          s.emit('delivery:location', loc);
        });
        setOfflineBuffer([]);
      }
    });

    s.on('connect_error', () => {
      console.log("[Socket] Driver server offline. Running simulator logs.");
    });

    // Offline / Online listeners
    const handleOnline = () => {
      setIsOnline(true);
      setNetworkAlert('Connection restored / इंटरनेट वापस आ गया है');
      setTimeout(() => setNetworkAlert(''), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkAlert('Connection interrupted / इंटरनेट बंद हो गया है');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      s.disconnect();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [orderId, offlineBuffer]);

  // Clean geolocation watch on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Request & watch geolocation position
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setPermissionDenied(false);

    const options = {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000
    };

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setTransporterLocation({ lat, lng });

        // Update GPS quality status based on accuracy radius
        if (accuracy < 30) setGpsStatus('🟢 GPS Active (High Accuracy)');
        else if (accuracy < 100) setGpsStatus('🟠 GPS Weak (Low Accuracy)');
        else setGpsStatus('🟠 GPS Signal Poor');

        const locationPayload = {
          orderId,
          latitude: lat,
          longitude: lng,
          accuracy,
          timestamp: new Date().toISOString()
        };

        // Submit or buffer based on connectivity status
        if (socket && socket.connected && isOnline) {
          socket.emit('delivery:location', locationPayload);
          // Also submit POST API for verification check
          fetch(`http://localhost:5000/api/deliveries/${orderId}/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(locationPayload)
          }).catch(err => console.log("POST api failed", err));
        } else {
          // Buffer locally
          setOfflineBuffer(prev => [...prev, locationPayload]);
        }
      },
      (error) => {
        console.error("GPS Watch Position Error:", error);
        setGpsStatus('🔴 GPS Unavailable');
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionDenied(true);
        }
      },
      options
    );

    setWatchId(id);
  };

  const handleStatusChange = (newStatus) => {
    setDeliveryStatus(newStatus);
    
    if (socket) {
      socket.emit('delivery:status', { orderId, status: newStatus });
      // Update via REST endpoint
      fetch(`http://localhost:5000/api/deliveries/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      }).catch(err => console.log("PATCH status failed", err));
    }

    if (newStatus === 'In Transit') {
      startLocationTracking();
    }

    if (newStatus === 'Delivered') {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      setGpsStatus('🔴 GPS Inactive');
      alert('Delivery completed successfully! Payout released to wallet.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-200">
      
      {/* Header Bar */}
      <header className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between shadow-md relative z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('transporter-dashboard')}
            className="p-2 hover:bg-slate-700 rounded-full transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-base font-extrabold leading-none">Transporter Workspace</h1>
            <span className="text-[10px] text-slate-300 font-semibold block mt-1">Driving Order #{orderId}</span>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 text-[10px] font-bold">
          <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-200">
            {gpsStatus}
          </span>
          <span className={`px-2.5 py-1 rounded-full flex items-center gap-1 text-white ${
            isOnline ? 'bg-emerald-600' : 'bg-red-500'
          }`}>
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </span>
        </div>
      </header>

      {/* Network Alert Notification banner */}
      {networkAlert && (
        <div className="bg-amber-500 text-white text-xs font-bold text-center py-2 px-4 shadow-sm z-30 animate-bounce">
          ⚠️ {networkAlert}
        </div>
      )}

      {/* Main split Screen container */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        
        {/* Left Column: Fullscreen Map (Takes 65% on mobile, large on desktop) */}
        <div className="flex-1 h-[55vh] lg:h-full lg:min-h-[500px] relative">
          <LiveDeliveryMap
            orderId={orderId}
            pickupLocName={deliveryInfo.pickup}
            deliveryLocName={deliveryInfo.delivery}
            transporterLocation={transporterLocation}
            deliveryStatus={deliveryStatus}
            demoMode={watchId === null}
          />
        </div>

        {/* Right Column: Driver Actions Panel (Bottom sheet on mobile, panel on desktop) */}
        <div className="w-full lg:w-[400px] bg-white dark:bg-slate-850 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 flex flex-col shadow-xl z-10 p-6 space-y-6 overflow-y-auto max-h-[50vh] lg:max-h-none">
          
          {/* Permission Denied Box */}
          {permissionDenied && (
            <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl text-xs space-y-3 font-semibold">
              <div className="flex items-start gap-2">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <p>Location permission is required to provide live delivery tracking.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={startLocationTracking}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold"
                >
                  Allow Location
                </button>
                <button
                  type="button"
                  onClick={startLocationTracking}
                  className="bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Delivery Cargo details */}
          <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs font-semibold text-slate-550">
            <h3 className="font-extrabold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5 uppercase tracking-wide">Payload & Target</h3>
            <p>Cargo: <span className="font-bold text-slate-850 dark:text-white">{deliveryInfo.quantity}</span></p>
            <p>Destination: <span className="font-bold text-slate-850 dark:text-white">{deliveryInfo.buyerName}</span></p>
            <p>Current Status: <span className="font-extrabold text-primary-600">{deliveryStatus}</span></p>
          </div>

          {/* Driver step actions */}
          <div className="space-y-3.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Drive Workflow Actions</span>
            
            {deliveryStatus === 'Transporter Assigned' && (
              <button
                onClick={() => handleStatusChange('Pickup Started')}
                className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-2xl text-sm shadow-md cursor-pointer text-center"
              >
                Start Pickup / पिकअप शुरू करें
              </button>
            )}

            {deliveryStatus === 'Pickup Started' && (
              <button
                onClick={() => handleStatusChange('Crop Picked Up')}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-extrabold rounded-2xl text-sm shadow-md cursor-pointer text-center"
              >
                Arrived & Loaded / फसल उठा ली है
              </button>
            )}

            {deliveryStatus === 'Crop Picked Up' && (
              <button
                onClick={() => handleStatusChange('In Transit')}
                className="w-full py-4 bg-accent-500 hover:bg-accent-600 text-slate-900 font-extrabold rounded-2xl text-sm shadow-md cursor-pointer text-center"
              >
                Start Delivery / यात्रा शुरू करें (GPS Watch)
              </button>
            )}

            {deliveryStatus === 'In Transit' && (
              <div className="space-y-3">
                <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 border border-emerald-100 dark:border-emerald-900/30 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>GPS Tracking active. Keep browser window open.</span>
                </div>
                <button
                  onClick={() => handleStatusChange('Delivered')}
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-extrabold rounded-2xl text-sm shadow-md cursor-pointer text-center"
                >
                  Arrived & Complete Delivery / यात्रा पूर्ण करें
                </button>
              </div>
            )}

            {deliveryStatus === 'Delivered' && (
              <div className="bg-blue-50 text-blue-700 border border-blue-100 p-4 rounded-2xl text-xs font-bold text-center">
                🎉 Delivery Completed. Live GPS Sharing Completed.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
