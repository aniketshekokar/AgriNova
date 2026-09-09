import React, { useEffect, useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import LiveDeliveryMap from '../components/delivery/LiveDeliveryMap';
import { io } from 'socket.io-client';
import { ChevronLeft, Phone, ShieldCheck, MapPin, Truck, AlertTriangle } from 'lucide-react';

export default function DeliveryTrackingPage({ orderId = 'AGR1024', onNavigate }) {
  const { t } = useTranslation();
  
  // Tracking stats
  const [deliveryStatus, setDeliveryStatus] = useState('In Transit');
  const [transporterLocation, setTransporterLocation] = useState({ lat: 18.5204, lng: 73.8567 });
  const [distanceRemaining, setDistanceRemaining] = useState(24.5);
  const [etaMinutes, setEtaMinutes] = useState(35);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  
  // Connection states
  const [isDemo, setIsDemo] = useState(true);
  const [socketStatus, setSocketStatus] = useState('Connecting'); // 'Connected' | 'Error' | 'Connecting'
  const [gpsSignal, setGpsSignal] = useState('🟢 GPS Active');

  // Transporter profile details
  const transporterInfo = {
    name: 'Rajesh Patil',
    phone: '9811223344',
    vehicleNumber: 'MH-12-AB-1234',
    vehicleType: 'Tata Ace'
  };

  // Socket Connection setup
  useEffect(() => {
    const socket = io('http://localhost:5000', {
      transports: ['websocket'],
      timeout: 3000
    });

    socket.on('connect', () => {
      console.log("[Socket] Connected to backend tracking server");
      setSocketStatus('Connected');
      setIsDemo(false);
      socket.emit('join-delivery', orderId);
    });

    socket.on('connect_error', () => {
      console.log("[Socket] Backend socket offline. Falling back to dynamic DEMO tracking simulator.");
      setSocketStatus('Error');
      setIsDemo(true);
    });

    // Listen for live location coordinates
    socket.on('delivery:location', (data) => {
      if (data && data.orderId === orderId) {
        setTransporterLocation({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
        setLastUpdated('Just now');
      }
    });

    // Listen for status timelines updates
    socket.on('delivery:status', (data) => {
      if (data && data.orderId === orderId) {
        setDeliveryStatus(data.status);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  // Demo Route Simulator (Triggers automatically if Socket fails or VITE key is mock)
  useEffect(() => {
    if (!isDemo) return;

    // Simulation Coordinates from Baramati to Mumbai
    const points = [
      { lat: 18.1506, lng: 74.5771, dist: 165, eta: 180, status: 'Pickup Started' },
      { lat: 18.5204, lng: 73.8567, dist: 120, eta: 140, status: 'Crop Picked Up' },
      { lat: 18.7500, lng: 73.4000, dist: 80,  eta: 90,  status: 'In Transit' },
      { lat: 18.9700, lng: 73.0300, dist: 24.5, eta: 35,  status: 'In Transit' },
      { lat: 19.0300, lng: 73.0100, dist: 5.0,  eta: 10,  status: 'Near Destination' },
      { lat: 19.0330, lng: 73.0030, dist: 0.0,  eta: 0,   status: 'Delivered' }
    ];

    let idx = 0;
    const interval = setInterval(() => {
      const pt = points[idx];
      setTransporterLocation({ lat: pt.lat, lng: pt.lng });
      setDistanceRemaining(pt.dist);
      setEtaMinutes(pt.eta);
      setDeliveryStatus(pt.status);
      setLastUpdated('Just now (Demo)');

      idx = (idx + 1) % points.length;
    }, 4000); // Progress steps every 4 seconds

    return () => clearInterval(interval);
  }, [isDemo]);

  // Handle call transporter
  const handleCall = () => {
    alert(`Calling Transporter Rajesh Patil at ${transporterInfo.phone}... / ड्राइवर को कॉल किया जा रहा है।`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-200">
      
      {/* Top Header Bar */}
      <header className="bg-white dark:bg-slate-850 px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shadow-sm relative z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('farmer-dashboard')}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-500 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-slate-850 dark:text-white leading-none">Live Delivery Tracking</h1>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">Order #{orderId}</span>
          </div>
        </div>

        {/* Live signals indicators */}
        <div className="flex items-center gap-2 text-[10px] font-bold">
          <span className="px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {gpsSignal}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-white ${
            socketStatus === 'Connected' 
              ? 'bg-emerald-600' 
              : 'bg-amber-500 animate-pulse'
          }`}>
            {socketStatus === 'Connected' ? '🌐 Live Sync' : '🛰️ Demo Mode'}
          </span>
        </div>
      </header>

      {/* Main split Screen container */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        
        {/* Left Column: Fullscreen Map Frame (Takes 65-75% on mobile, large on desktop) */}
        <div className="flex-1 h-[60vh] lg:h-full lg:min-h-[500px] relative">
          <LiveDeliveryMap
            orderId={orderId}
            pickupLocName="Baramati"
            deliveryLocName="Vashi Navi Mumbai"
            transporterLocation={transporterLocation}
            deliveryStatus={deliveryStatus}
            demoMode={isDemo}
          />
        </div>

        {/* Right Column: Information Panel (Bottom sheet on mobile, sidebar on desktop) */}
        <div className="w-full lg:w-[420px] bg-white dark:bg-slate-850 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 flex flex-col shadow-xl z-10 p-6 space-y-6 overflow-y-auto max-h-[45vh] lg:max-h-none">
          
          {/* Header delivery status */}
          <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg uppercase font-extrabold tracking-wide w-fit block">
              {deliveryStatus}
            </span>
            <h2 className="text-lg font-extrabold text-slate-850 dark:text-white pt-1">
              {deliveryStatus === 'Delivered' 
                ? 'Cargo Arrived at Destination' 
                : 'Delivery partner is on the way'}
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">Last updated: {lastUpdated}</p>
          </div>

          {/* Core Distance / ETA metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-450 uppercase tracking-wider block font-bold">ETA</span>
              <span className="text-xl font-black text-slate-850 dark:text-white mt-1 block">
                {etaMinutes > 0 ? `${etaMinutes} mins` : 'Arrived'}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-450 uppercase tracking-wider block font-bold">Distance remaining</span>
              <span className="text-xl font-black text-slate-850 dark:text-white mt-1 block">
                {distanceRemaining > 0 ? `${distanceRemaining.toFixed(1)} km` : '0.0 km'}
              </span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Delivery Progress Timeline</span>
            <div className="space-y-4 text-xs font-semibold pl-2 border-l-2 border-slate-100 dark:border-slate-800">
              {[
                { label: 'Order Confirmed / ऑर्डर की पुष्टि', active: true },
                { label: 'Transporter Assigned / वाहन आवंटित', active: ['Transporter Assigned', 'Pickup Started', 'Crop Picked Up', 'In Transit', 'Near Destination', 'Delivered'].includes(deliveryStatus) },
                { label: 'Pickup Started / पिकअप शुरू', active: ['Pickup Started', 'Crop Picked Up', 'In Transit', 'Near Destination', 'Delivered'].includes(deliveryStatus) },
                { label: 'Crop Picked Up / फसल उठाई गई', active: ['Crop Picked Up', 'In Transit', 'Near Destination', 'Delivered'].includes(deliveryStatus) },
                { label: 'In Transit / मार्ग में', active: ['In Transit', 'Near Destination', 'Delivered'].includes(deliveryStatus) },
                { label: 'Near Destination / गंतव्य के पास', active: ['Near Destination', 'Delivered'].includes(deliveryStatus) },
                { label: 'Delivered / डिलीवर हुआ', active: deliveryStatus === 'Delivered' }
              ].map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <span className={`absolute -left-[14px] top-0.5 w-2 h-2 rounded-full border ${
                    step.active ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-200 border-slate-250 dark:bg-slate-800'
                  }`} />
                  <span className={step.active ? 'text-slate-850 dark:text-white font-bold' : 'text-slate-400 dark:text-slate-500'}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Transporter Details card */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-auto">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Delivery Partner</span>
              <p className="text-sm font-black text-slate-850 dark:text-white">{transporterInfo.name}</p>
              <p className="text-[10px] text-slate-400 font-bold">Vehicle: {transporterInfo.vehicleNumber} ({transporterInfo.vehicleType})</p>
            </div>
            <button
              onClick={handleCall}
              className="bg-primary-600 hover:bg-primary-700 text-white font-extrabold py-3 px-5 rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-primary-500/10 cursor-pointer"
            >
              <Phone size={14} />
              <span>Call Transporter</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
