import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, SlidersHorizontal, MessageSquare, Shield, CheckCircle, ArrowRight, X, Phone } from 'lucide-react';
import api from '../services/api';

const districtsData = {
  'Ahmednagar': { farmers: 950, buyers: 180, topCrop: 'Sugarcane', avgPrice: 3200, demand: 'High' },
  'Akola': { farmers: 450, buyers: 90, topCrop: 'Cotton', avgPrice: 6800, demand: 'Medium' },
  'Amravati': { farmers: 580, buyers: 110, topCrop: 'Soybean', avgPrice: 4500, demand: 'Medium' },
  'Beed': { farmers: 400, buyers: 70, topCrop: 'Bajra', avgPrice: 2100, demand: 'Low' },
  'Bhandara': { farmers: 300, buyers: 60, topCrop: 'Rice', avgPrice: 2400, demand: 'Medium' },
  'Buldhana': { farmers: 380, buyers: 80, topCrop: 'Soybean', avgPrice: 4400, demand: 'Low' },
  'Chandrapur': { farmers: 280, buyers: 50, topCrop: 'Rice', avgPrice: 2350, demand: 'Medium' },
  'Chhatrapati Sambhajinagar': { farmers: 600, buyers: 140, topCrop: 'Maize', avgPrice: 2200, demand: 'High' },
  'Dhule': { farmers: 350, buyers: 75, topCrop: 'Onion', avgPrice: 2200, demand: 'Medium' },
  'Gadchiroli': { farmers: 150, buyers: 30, topCrop: 'Rice', avgPrice: 2100, demand: 'Low' },
  'Gondia': { farmers: 260, buyers: 45, topCrop: 'Rice', avgPrice: 2300, demand: 'Medium' },
  'Hingoli': { farmers: 310, buyers: 50, topCrop: 'Soybean', avgPrice: 4350, demand: 'Low' },
  'Jalgaon': { farmers: 880, buyers: 210, topCrop: 'Banana', avgPrice: 1800, demand: 'High' },
  'Jalna': { farmers: 420, buyers: 85, topCrop: 'Sweet Orange', avgPrice: 4200, demand: 'Medium' },
  'Kolhapur': { farmers: 1100, buyers: 280, topCrop: 'Sugarcane', avgPrice: 3300, demand: 'High' },
  'Latur': { farmers: 950, buyers: 240, topCrop: 'Soybean', avgPrice: 4600, demand: 'High' },
  'Mumbai City': { farmers: 0, buyers: 520, topCrop: 'None', avgPrice: 0, demand: 'High' },
  'Mumbai Suburban': { farmers: 0, buyers: 480, topCrop: 'None', avgPrice: 0, demand: 'High' },
  'Nagpur': { farmers: 850, buyers: 230, topCrop: 'Orange', avgPrice: 4800, demand: 'High' },
  'Nanded': { farmers: 670, buyers: 120, topCrop: 'Cotton', avgPrice: 6700, demand: 'Medium' },
  'Nandurbar': { farmers: 290, buyers: 40, topCrop: 'Chilli', avgPrice: 5500, demand: 'Medium' },
  'Nashik': { farmers: 1450, buyers: 390, topCrop: 'Onion', avgPrice: 2400, demand: 'High' },
  'Dharashiv': { farmers: 370, buyers: 65, topCrop: 'Jowar', avgPrice: 2900, demand: 'Low' },
  'Palghar': { farmers: 210, buyers: 55, topCrop: 'Rice', avgPrice: 2200, demand: 'Medium' },
  'Parbhani': { farmers: 490, buyers: 85, topCrop: 'Cotton', avgPrice: 6500, demand: 'Medium' },
  'Pune': { farmers: 1250, buyers: 320, topCrop: 'Sugarcane', avgPrice: 3100, demand: 'High' },
  'Raigad': { farmers: 340, buyers: 90, topCrop: 'Rice', avgPrice: 2300, demand: 'High' },
  'Ratnagiri': { farmers: 780, buyers: 150, topCrop: 'Mango', avgPrice: 8500, demand: 'High' },
  'Sangli': { farmers: 920, buyers: 200, topCrop: 'Grapes', avgPrice: 7200, demand: 'High' },
  'Satara': { farmers: 810, buyers: 170, topCrop: 'Sugarcane', avgPrice: 3150, demand: 'Medium' },
  'Sindhudurg': { farmers: 520, buyers: 95, topCrop: 'Cashew', avgPrice: 9500, demand: 'Medium' },
  'Solapur': { farmers: 900, buyers: 190, topCrop: 'Pomegranate', avgPrice: 6500, demand: 'High' },
  'Thane': { farmers: 280, buyers: 160, topCrop: 'Rice', avgPrice: 2250, demand: 'High' },
  'Wardha': { farmers: 390, buyers: 80, topCrop: 'Cotton', avgPrice: 6600, demand: 'Medium' },
  'Washim': { farmers: 330, buyers: 60, topCrop: 'Soybean', avgPrice: 4400, demand: 'Low' },
  'Yavatmal': { farmers: 620, buyers: 110, topCrop: 'Cotton', avgPrice: 6700, demand: 'Medium' }
};

export default function MarketMapPage({ onNavigate }) {
  const { t, lang } = useTranslation();
  const { user } = useAuth();

  const [mode, setMode] = useState('BUYER'); // 'BUYER' = buyer looking for farmers; 'FARMER' = farmer looking for buyers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  
  // Filter states
  const [filterCrop, setFilterCrop] = useState('');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');
  const [filterQuantity, setFilterQuantity] = useState('');

  // Selected item modal & Chat drawer states
  const [selectedItem, setSelectedItem] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [dealConfirmed, setDealConfirmed] = useState(false);
  const [confirmingDeal, setConfirmingDeal] = useState(false);

  // Google Maps setup refs
  const mapContainerRef = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapError, setMapError] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isKeyConfigured = apiKey && apiKey !== 'YOUR_API_KEY_HERE';

  // Live Farmers and Buyers list
  const [farmersList, setFarmersList] = useState([
    { id: 'f_1', name: 'Ramesh Patil', district: 'Pune', crop: 'Tomato', qty: 500, price: 28, quality: 'Good', harvest: '10 Aug', lat: 18.5204, lng: 73.8567 },
    { id: 'f_2', name: 'Sanjay Deshmukh', district: 'Nashik', crop: 'Onion', qty: 1200, price: 24, quality: 'Good', harvest: '12 Aug', lat: 19.9975, lng: 73.7898 },
    { id: 'f_3', name: 'Maruti Kadam', district: 'Latur', crop: 'Soybean', qty: 3000, price: 46, quality: 'Premium', harvest: '14 Aug', lat: 18.4088, lng: 76.5604 },
    { id: 'f_4', name: 'Vitthal Pawar', district: 'Nagpur', crop: 'Orange', qty: 800, price: 48, quality: 'Good', harvest: '11 Aug', lat: 21.1458, lng: 79.0882 },
    { id: 'f_5', name: 'Dnyaneshwar Shinde', district: 'Pune', crop: 'Wheat', qty: 1500, price: 26, quality: 'Good', harvest: '08 Aug', lat: 18.398, lng: 74.575 }
  ]);

  const [buyersList, setBuyersList] = useState([
    { id: 'b_1', name: 'ABC Foods', district: 'Pune', crop: 'Tomato', qtyRequired: 1000, expectedPrice: 30, reqDate: '15 Aug', type: 'Food Processing', lat: 18.53, lng: 73.87 },
    { id: 'b_2', name: 'Vashi Wholesale Traders', district: 'Mumbai Suburban', crop: 'Onion', qtyRequired: 5000, expectedPrice: 26, reqDate: '16 Aug', type: 'Wholesaler', lat: 19.03, lng: 73.01 },
    { id: 'b_3', name: 'Nashik Agro Exporters', district: 'Nashik', crop: 'Grapes', qtyRequired: 2000, expectedPrice: 65, reqDate: '18 Aug', type: 'Exporter', lat: 19.98, lng: 73.75 },
    { id: 'b_4', name: 'Latur Oil Millers', district: 'Latur', crop: 'Soybean', qtyRequired: 10000, expectedPrice: 48, reqDate: '20 Aug', type: 'Processor', lat: 18.42, lng: 76.54 }
  ]);

  // Load live farmers and buyers from backend
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const [fRes, bRes] = await Promise.all([
          api.get('/farmers'),
          api.get('/buyers')
        ]);
        if (fRes.success && fRes.data?.length > 0) {
          const mappedFarmers = fRes.data.map((f, i) => ({
            id: f.id,
            name: f.name,
            district: f.district,
            crop: f.mainCrop || f.crop || 'Produce',
            qty: f.quantity || 500,
            price: f.expectedPrice || 2500,
            quality: f.verification === 'VERIFIED' ? 'Premium' : 'Good',
            harvest: 'Active',
            lat: f.district === 'Nashik' ? 19.9975 : f.district === 'Latur' ? 18.4088 : 18.5204 + (i * 0.05),
            lng: f.district === 'Nashik' ? 73.7898 : f.district === 'Latur' ? 76.5604 : 73.8567 + (i * 0.05)
          }));
          setFarmersList(mappedFarmers);
        }
        if (bRes.success && bRes.data?.length > 0) {
          const mappedBuyers = bRes.data.map((b, i) => ({
            id: b.id,
            name: b.businessName,
            district: b.district,
            crop: 'All Commodities',
            qtyRequired: 2000,
            expectedPrice: 3000,
            reqDate: 'Daily Procurement',
            type: b.businessType,
            lat: b.district === 'Nashik' ? 19.98 : b.district === 'Mumbai Suburban' ? 19.03 : 18.53 + (i * 0.04),
            lng: b.district === 'Nashik' ? 73.75 : b.district === 'Mumbai Suburban' ? 73.01 : 73.87 + (i * 0.04)
          }));
          setBuyersList(mappedBuyers);
        }
      } catch (err) {
        console.warn('Using initial map directory');
      }
    };
    fetchEntities();
  }, []);

  // Set default search mode based on authenticated user's role
  useEffect(() => {
    if (user) {
      if (user.role === 'FARMER') {
        setMode('FARMER');
      } else if (user.role === 'BUYER') {
        setMode('BUYER');
      }
    }
  }, [user]);

  // Asynchronously load Google Maps
  useEffect(() => {
    if (!isKeyConfigured || mapError) return;

    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const scriptId = 'google-maps-api-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      script.onerror = () => setMapError(true);
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => initMap());
      script.addEventListener('error', () => setMapError(true));
    }
  }, [apiKey, isKeyConfigured, mapError]);

  const initMap = () => {
    if (!mapContainerRef.current) return;
    try {
      const google = window.google;
      const maharashtraCenter = { lat: 19.7515, lng: 75.7139 }; // Center of Maharashtra
      
      const map = new google.maps.Map(mapContainerRef.current, {
        center: maharashtraCenter,
        zoom: 7,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          {
            "featureType": "administrative.district",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#047857" }]
          }
        ]
      });
      setGoogleMap(map);
    } catch (e) {
      console.error(e);
      setMapError(true);
    }
  };

  // Render Map markers dynamically
  useEffect(() => {
    if (!googleMap) return;

    const google = window.google;

    // Clear old markers
    markers.forEach(m => m.setMap(null));
    const newMarkers = [];

    const activeList = mode === 'BUYER' ? farmersList : buyersList;

    activeList.forEach(item => {
      // Filter check
      if (filterCrop && item.crop !== filterCrop) return;
      if (searchQuery && !item.district.toLowerCase().includes(searchQuery.toLowerCase()) && !item.crop.toLowerCase().includes(searchQuery.toLowerCase())) return;

      const marker = new google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: googleMap,
        title: item.name,
        icon: {
          url: mode === 'BUYER' 
            ? 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%2310b981" stroke-width="2.5"><path d="M2 22s8-4 8-10V2H2v10c0 6 8 10 8 10z"/></svg>'
            : 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23ef4444" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>',
          scaledSize: new google.maps.Size(28, 28)
        }
      });

      marker.addListener('click', () => {
        setSelectedItem(item);
        googleMap.panTo(marker.getPosition());
        googleMap.setZoom(10);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [googleMap, mode, filterCrop, searchQuery]);

  // Handle District search Zooming
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const matchedDist = Object.keys(districtsData).find(
      d => d.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (matchedDist) {
      setSelectedDistrict(matchedDist);
      if (googleMap) {
        // approximate geocoded positions for zoom pan
        const locations = {
          'Pune': { lat: 18.5204, lng: 73.8567 },
          'Nashik': { lat: 19.9975, lng: 73.7898 },
          'Latur': { lat: 18.4088, lng: 76.5604 },
          'Nagpur': { lat: 21.1458, lng: 79.0882 }
        };
        const coords = locations[matchedDist] || { lat: 19.75, lng: 75.71 };
        googleMap.panTo(coords);
        googleMap.setZoom(9);
      }
    }
  };

  // Renders chat drawer init
  const handleOpenChat = (item) => {
    setSelectedItem(item);
    setIsChatOpen(true);
    setDealConfirmed(false);
    setChatMessages([
      { sender: 'other', text: `Hello! I see you are interested in ${item.crop}. Is this requirement still open?` },
      { sender: 'self', text: `Yes, let me know your quantity capability and preferred rates.` }
    ]);
  };

  const sendMessage = () => {
    if (!typedMessage.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'self', text: typedMessage }]);
    setTypedMessage('');

    // Simulate reply after 1s
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'other', 
        text: 'Sounds fair. Can we proceed and confirm this order on SA Group?' 
      }]);
    }, 1200);
  };

  const handleConfirmDeal = () => {
    setConfirmingDeal(true);
    setTimeout(() => {
      setConfirmingDeal(false);
      setDealConfirmed(true);
    }, 1500);
  };

  // Filter lists based on states
  const filteredFarmers = farmersList.filter(item => {
    if (filterCrop && item.crop !== filterCrop) return false;
    if (filterQuantity && item.qty < parseFloat(filterQuantity)) return false;
    if (selectedDistrict && item.district !== selectedDistrict) return false;
    return true;
  });

  const filteredBuyers = buyersList.filter(item => {
    if (filterCrop && item.crop !== filterCrop) return false;
    if (selectedDistrict && item.district !== selectedDistrict) return false;
    return true;
  });

  const distInfo = districtsData[selectedDistrict] || { farmers: 120, buyers: 40, topCrop: 'Sugarcane', avgPrice: 3000, demand: 'Medium' };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-200">
      
      {/* Search Header Bar */}
      <div className="bg-white dark:bg-slate-850 px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-100 dark:border-slate-800 shadow-sm relative z-20">
        
        {/* Toggle Mode */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full md:w-auto">
          <button
            onClick={() => { setMode('BUYER'); setSelectedItem(null); }}
            className={`flex-1 md:flex-none px-5 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'BUYER' 
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow' 
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            🌾 Find Farmers / फसलें
          </button>
          <button
            onClick={() => { setMode('FARMER'); setSelectedItem(null); }}
            className={`flex-1 md:flex-none px-5 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'FARMER' 
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow' 
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            🏢 Find Buyers / खरीदार
          </button>
        </div>

        {/* Global Search form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search district (e.g. Pune, Nashik, Latur)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold dark:text-white"
          />
        </form>

      </div>

      {/* Main Split Screen container */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        
        {/* Left Column: Interactive Map Widget */}
        <div className="flex-1 h-[50vh] lg:h-auto relative">
          
          {(!isKeyConfigured || mapError) ? (
            /* Fallback Vector SVG Maharashtra Map */
            <div className="w-full h-full min-h-[350px] lg:h-full bg-slate-100 dark:bg-slate-900 flex flex-col p-6 justify-between relative border border-slate-200/50">
              
              <div className="absolute top-4 right-4 z-10 bg-amber-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg">
                Demo Interactive Map
              </div>

              {/* District circle overlay map */}
              <div className="flex-1 flex items-center justify-center">
                <svg className="w-full max-w-lg h-72" viewBox="0 0 500 400">
                  {/* Maharashtra boundaries representation */}
                  <path d="M 50 150 L 150 50 L 320 70 L 450 150 L 400 320 L 220 350 L 120 280 Z" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeLinejoin="round" />
                  
                  {/* Nashik Circle (Grain basket) */}
                  <g onClick={() => { setSelectedDistrict('Nashik'); }} className="cursor-pointer group">
                    <circle cx="150" cy="110" r="28" fill="#10b981" fillOpacity="0.25" className="group-hover:fill-opacity-40 transition" />
                    <circle cx="150" cy="110" r="5" fill="#10b981" />
                    <text x="150" y="114" fontSize="10" fontWeight="extrabold" textAnchor="middle" fill="#047857">Nashik</text>
                  </g>

                  {/* Pune Circle */}
                  <g onClick={() => { setSelectedDistrict('Pune'); }} className="cursor-pointer group">
                    <circle cx="180" cy="220" r="32" fill="#10b981" fillOpacity="0.25" className="group-hover:fill-opacity-40 transition" />
                    <circle cx="180" cy="220" r="5" fill="#10b981" />
                    <text x="180" y="224" fontSize="10" fontWeight="extrabold" textAnchor="middle" fill="#047857">Pune</text>
                  </g>

                  {/* Latur Circle */}
                  <g onClick={() => { setSelectedDistrict('Latur'); }} className="cursor-pointer group">
                    <circle cx="320" cy="250" r="26" fill="#10b981" fillOpacity="0.25" className="group-hover:fill-opacity-40 transition" />
                    <circle cx="320" cy="250" r="5" fill="#10b981" />
                    <text x="320" y="254" fontSize="10" fontWeight="extrabold" textAnchor="middle" fill="#047857">Latur</text>
                  </g>

                  {/* Nagpur Circle */}
                  <g onClick={() => { setSelectedDistrict('Nagpur'); }} className="cursor-pointer group">
                    <circle cx="410" cy="90" r="28" fill="#10b981" fillOpacity="0.25" className="group-hover:fill-opacity-40 transition" />
                    <circle cx="410" cy="90" r="5" fill="#10b981" />
                    <text x="410" y="94" fontSize="10" fontWeight="extrabold" textAnchor="middle" fill="#047857">Nagpur</text>
                  </g>
                </svg>
              </div>

              {/* Click instruction bar */}
              <div className="border-t border-slate-200/50 pt-3 text-center text-[10px] text-slate-400 font-bold">
                ⚠️ Click on any District hotspot circle (Pune, Nashik, Latur, Nagpur) to filter and view local agricultural stats.
              </div>

            </div>
          ) : (
            <div ref={mapContainerRef} className="w-full h-full min-h-[350px] lg:h-full" />
          )}

        </div>

        {/* Right Column: Search, Filters, and Result Cards */}
        <div className="w-full lg:w-[450px] bg-white dark:bg-slate-850 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 flex flex-col shadow-xl z-10 p-6 space-y-6 overflow-y-auto max-h-[50vh] lg:max-h-none">
          
          {/* District Information Panel */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Selected Location Analytics</span>
                <h3 className="text-base font-black text-slate-850 dark:text-white pt-0.5">{selectedDistrict} District</h3>
              </div>
              <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                Demand: {distInfo.demand}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-slate-550">
              <p>Active Farmers: <span className="font-bold text-slate-800 dark:text-white">{distInfo.farmers}</span></p>
              <p>Active Buyers: <span className="font-bold text-slate-800 dark:text-white">{distInfo.buyers}</span></p>
              <p>Top crop: <span className="font-bold text-primary-650">{distInfo.topCrop}</span></p>
              <p>Avg Market Price: <span className="font-bold text-slate-800 dark:text-white">₹{distInfo.avgPrice}/Qtl</span></p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Search Filter Tools</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Crop / फसल</label>
                <select
                  value={filterCrop}
                  onChange={(e) => setFilterCrop(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs rounded-xl font-bold dark:text-white"
                >
                  <option value="">All Crops</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Onion">Onion</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Orange">Orange</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Min Quantity / मात्रा</label>
                <input
                  type="number"
                  placeholder="e.g. 500 Kg"
                  value={filterQuantity}
                  onChange={(e) => setFilterQuantity(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs rounded-xl font-bold dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Results list */}
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">
              {mode === 'BUYER' ? 'Available Crops' : 'Buyer Requirements'}
            </span>

            <div className="space-y-4 overflow-y-auto pr-1">
              {mode === 'BUYER' ? (
                /* Farmers List */
                filteredFarmers.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No matching farmers found in {selectedDistrict}.</p>
                ) : (
                  filteredFarmers.map((item) => (
                    <div key={item.id} className="border border-slate-100 dark:border-slate-800 rounded-3xl p-5 bg-white dark:bg-slate-850 shadow-sm space-y-3.5 hover:shadow transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">{item.name}</h4>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">📍 {item.district} District (Approximate)</span>
                        </div>
                        <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                          {item.crop}
                        </span>
                      </div>

                      <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400 font-semibold grid grid-cols-2">
                        <p>Available: <span className="font-bold text-slate-850 dark:text-white">{item.qty} Kg</span></p>
                        <p>Rate: <span className="font-bold text-primary-600">₹{item.price}/Kg</span></p>
                        <p>Quality: <span className="font-bold text-slate-850 dark:text-white">{item.quality}</span></p>
                        <p>Harvest: <span className="font-bold text-slate-850 dark:text-white">{item.harvest}</span></p>
                      </div>

                      {/* Approximate distance matrices */}
                      <div className="text-[10px] border-t border-slate-50 dark:border-slate-800/80 pt-2 flex justify-between text-slate-400 font-bold">
                        <span>Approx. Distance: <span className="text-slate-600 dark:text-slate-300">145 km</span></span>
                        <span>Transport Cost: <span className="text-slate-600 dark:text-slate-300">₹1,500</span></span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenChat(item)}
                          className="flex-1 py-2.5 bg-primary-800 hover:bg-primary-900 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <MessageSquare size={13} />
                          <span>Contact / Chat</span>
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                /* Buyers List */
                filteredBuyers.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No matching buyers found in {selectedDistrict}.</p>
                ) : (
                  filteredBuyers.map((item) => (
                    <div key={item.id} className="border border-slate-100 dark:border-slate-800 rounded-3xl p-5 bg-white dark:bg-slate-850 shadow-sm space-y-3.5 hover:shadow transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">{item.name}</h4>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">📍 {item.district} (Approximate location)</span>
                        </div>
                        <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          {item.crop}
                        </span>
                      </div>

                      <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400 font-semibold grid grid-cols-2">
                        <p>Required: <span className="font-bold text-slate-850 dark:text-white">{item.qtyRequired} Kg</span></p>
                        <p>Target Rate: <span className="font-bold text-primary-600">₹{item.expectedPrice}/Kg</span></p>
                        <p>Required by: <span className="font-bold text-slate-850 dark:text-white">{item.reqDate}</span></p>
                        <p>Business: <span className="font-bold text-slate-850 dark:text-white">{item.type}</span></p>
                      </div>

                      <div className="text-[10px] border-t border-slate-50 dark:border-slate-800/80 pt-2 flex justify-between text-slate-400 font-bold">
                        <span>Approx. Distance: <span className="text-slate-600 dark:text-slate-300">45 km</span></span>
                        <span>Time: <span className="text-slate-600 dark:text-slate-300">1.5 hrs</span></span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenChat(item)}
                          className="flex-1 py-2.5 bg-primary-800 hover:bg-primary-900 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <MessageSquare size={13} />
                          <span>Contact Buyer</span>
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ==========================================
          INTERACTIVE NEGOTIATION CHAT DRAWER
          ========================================== */}
      {isChatOpen && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
          
          <div className="bg-white dark:bg-slate-850 w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative animate-slide-left p-6 border-l border-slate-100 dark:border-slate-800">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">{selectedItem.name}</h3>
                  <span className="text-[10px] text-slate-400 font-bold block">Secure Negotiation Escrow</span>
                </div>
              </div>
              <button 
                onClick={() => { setIsChatOpen(false); setDealConfirmed(false); }}
                className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Privacy Warning */}
            <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 p-3 rounded-xl text-[10px] font-semibold flex items-start gap-1.5">
              <Shield size={14} className="shrink-0 mt-0.5 text-amber-600" />
              <span>SA Group masking is active. Phone number & exact address are hidden until the deal is completed.</span>
            </div>

            {/* Messages logs */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3.5">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'self' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs font-semibold leading-relaxed ${
                    msg.sender === 'self' 
                      ? 'bg-primary-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Deal Unlocked / Confirmed Success Card */}
              {dealConfirmed && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-3xl space-y-4 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Order Confirmed! (ऑर्डर की पुष्टि)</h4>
                    <p className="text-[10px] text-slate-400 leading-normal">Exact Pickup location (Baramati Pune Gate 2) and Receiver contact details are now unlocked for transporter routing.</p>
                  </div>
                  <button
                    onClick={() => { setIsChatOpen(false); onNavigate('delivery-tracking'); }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Launch Delivery Tracking App</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-3">
              {!dealConfirmed && (
                <button
                  onClick={handleConfirmDeal}
                  disabled={confirmingDeal}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs transition shadow-md shadow-slate-900/10 cursor-pointer flex justify-center items-center gap-2"
                >
                  {confirmingDeal ? 'Confirming Order...' : 'Lock Deal & Place Order / सौदा पक्का करें'}
                </button>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type negotiation offer..."
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 font-semibold dark:text-white"
                />
                <button
                  onClick={sendMessage}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 rounded-xl text-xs transition"
                >
                  Send
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
