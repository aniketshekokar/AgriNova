import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { initialCrops, maharashtraDistricts, maharashtraDistrictNames } from '../utils/mockData';
import { 
  Building2, ShoppingBag, Truck, MapPin, Search, Plus, Filter, 
  CheckCircle2, Clock, AlertTriangle, ChevronRight, X, ArrowRight, 
  Send, Phone, ShieldCheck, Star, FileText, User, Bell, TrendingUp, 
  RefreshCw, Navigation, Check, Award, Eye, Calendar, Sparkles, MessageSquare
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../services/api';

export default function BuyerDashboard({ orders = [], onCompleteOrder, onNavigate, marketPrices = [], onSyncPrices }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('home'); // home, farmers, marketplace, requirements, offers, orders, tracking, market, profile, notifications

  // Adaptive Buyer Type config
  const buyerType = user?.buyerType || 'Hotel';
  const businessName = user?.businessName || user?.username || 'Grand Heritage Hotel';
  const isApproved = user?.verificationStatus === 'VERIFIED' || user?.verified !== false;

  // Search and filter states
  const [farmerSearchDistrict, setFarmerSearchDistrict] = useState('All');
  const [farmerSearchCrop, setFarmerSearchCrop] = useState('');
  const [selectedFarmerDetail, setSelectedFarmerDetail] = useState(null);

  // Market Prices Filter state in Buyer Dashboard
  const [buyerMarketDistrict, setBuyerMarketDistrict] = useState('All');
  const [buyerMarketCrop, setBuyerMarketCrop] = useState('All');
  const [syncingBuyerPrices, setSyncingBuyerPrices] = useState(false);
  const [buyerSyncMsg, setBuyerSyncMsg] = useState('');

  const handleBuyerSync = async () => {
    setSyncingBuyerPrices(true);
    setBuyerSyncMsg('');
    try {
      if (onSyncPrices) {
        const res = await onSyncPrices();
        if (res?.success) {
          setBuyerSyncMsg('AGMARKNET live rates synchronized!');
        }
      } else {
        const res = await api.post('/prices/sync');
        if (res.success) {
          setBuyerSyncMsg('AGMARKNET live rates synchronized!');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncingBuyerPrices(false);
      setTimeout(() => setBuyerSyncMsg(''), 4000);
    }
  };

  // Dual Procurement Channel State: 'B2F' (Buy from Farmer) or 'B2B' (Buy from Aggregator / Mandi / Trader)
  const [procurementMode, setProcurementMode] = useState('B2F');

  // Requirements state (starts at 0 baseline)
  const [requirementsList, setRequirementsList] = useState([]);
  const [showPostReqModal, setShowPostReqModal] = useState(false);
  const [newReqCrop, setNewReqCrop] = useState('Tomato');
  const [newReqQty, setNewReqQty] = useState('');
  const [newReqUnit, setNewReqUnit] = useState('Quintal');
  const [newReqMaxPrice, setNewReqMaxPrice] = useState('');
  const [newReqDate, setNewReqDate] = useState('2026-08-22');
  const [newReqDistrict, setNewReqDistrict] = useState('Pune');
  const [newReqQuality, setNewReqQuality] = useState('Grade A');

  // B2B Wholesale Tenders (starts at 0 baseline)
  const [b2bTendersList, setB2bTendersList] = useState([]);
  const [showB2bTenderModal, setShowB2bTenderModal] = useState(false);
  const [tenderCrop, setTenderCrop] = useState('Onion');
  const [tenderVolume, setTenderVolume] = useState('');
  const [tenderTargetPrice, setTenderTargetPrice] = useState('');
  const [tenderSpecs, setTenderSpecs] = useState('Export Grade A+ (GlobalGAP)');

  // B2B Aggregated Warehouse Lots (Supplied by Primary Buyers, Traders & Mandi Aggregators)
  const b2bWarehouseLots = [
    {
      id: 'B2B-LOT-101',
      commodity: 'Onion (Export Pink)',
      supplierEntity: 'Lasalgaon APMC Aggregation Consortium',
      supplierType: 'Mandi Aggregator & Trader',
      location: 'Lasalgaon Yard, Nashik',
      availableQty: 850,
      unit: 'Quintal',
      price: 2350,
      moq: 50,
      grade: 'Export Grade A+ (GlobalGAP)',
      specs: 'Cured, sorted, 55mm+ size, mesh bag packed',
      loadingTime: 'Immediate (Warehouse Ready)',
      verified: true
    },
    {
      id: 'B2B-LOT-102',
      commodity: 'Tomato (Roma Processing)',
      supplierEntity: 'Sahyadri Agro Processing Hub',
      supplierType: 'Primary Processor & Trader',
      location: 'Dindori Cold Storage, Nashik',
      availableQty: 450,
      unit: 'Quintal',
      price: 2700,
      moq: 40,
      grade: 'Brix 5.2+ Industrial Grade',
      specs: 'Uniform red, firm rind, plastic crate packed',
      loadingTime: 'Within 4 Hours',
      verified: true
    },
    {
      id: 'B2B-LOT-103',
      commodity: 'Sharbati Premium Wheat',
      supplierEntity: 'Maharashtra Grain Millers Trade Pool',
      supplierType: 'Wholesale Grain Merchant',
      location: 'Latur Central Warehouse',
      availableQty: 1200,
      unit: 'Quintal',
      price: 2280,
      moq: 100,
      grade: 'Lab Certified (<10% Moisture)',
      specs: 'Machine cleaned, fumigated, 50kg HDPE bags',
      loadingTime: 'Immediate Dispatch',
      verified: true
    },
    {
      id: 'B2B-LOT-104',
      commodity: 'Grapes (Thompson Seedless)',
      supplierEntity: 'Khandesh Export Trading Corp',
      supplierType: 'Export Consolidator',
      location: 'Pimpalgaon Pre-cooling Center, Nashik',
      availableQty: 320,
      unit: 'Quintal',
      price: 8500,
      moq: 25,
      grade: 'Phytosanitary & Residue Tested',
      specs: '18+ Brix, sulfur pad packed, thermo-regulated',
      loadingTime: 'Reefer Loading Ready',
      verified: true
    }
  ];

  // Offers state (starts at 0 baseline)
  const [offersList, setOffersList] = useState([]);
  const [selectedOfferModal, setSelectedOfferModal] = useState(null);
  const [counterPriceInput, setCounterPriceInput] = useState('');

  // Sample Maharashtra Farmers directory for discovery
  const farmersList = [
    {
      id: 'FARM-1',
      name: 'Rajesh Patil',
      phone: '9823456789',
      district: 'Nashik',
      taluka: 'Niphad',
      rating: 4.8,
      verified: true,
      crops: ['Tomato', 'Grapes', 'Onion'],
      totalLand: '12 Acres',
      distance: '38 km'
    },
    {
      id: 'FARM-2',
      name: 'Sanjay Deshmukh',
      phone: '9845612307',
      district: 'Pune',
      taluka: 'Haveli',
      rating: 4.9,
      verified: true,
      crops: ['Onion', 'Sugarcane', 'Potato'],
      totalLand: '18 Acres',
      distance: '14 km'
    },
    {
      id: 'FARM-3',
      name: 'Vijay Shinde',
      phone: '9812345678',
      district: 'Ahilyanagar',
      taluka: 'Rahata',
      rating: 4.7,
      verified: true,
      crops: ['Sugarcane', 'Soybean', 'Wheat'],
      totalLand: '25 Acres',
      distance: '65 km'
    },
    {
      id: 'FARM-4',
      name: 'Madhukar Gavit',
      phone: '9422001122',
      district: 'Nagpur',
      taluka: 'Katol',
      rating: 4.9,
      verified: true,
      crops: ['Orange', 'Rice', 'Cotton'],
      totalLand: '30 Acres',
      distance: '180 km'
    },
    {
      id: 'FARM-5',
      name: 'Dnyaneshwar Borade',
      phone: '9822446688',
      district: 'Latur',
      taluka: 'Ausa',
      rating: 4.8,
      verified: true,
      crops: ['Soybean', 'Tur', 'Gram'],
      totalLand: '15 Acres',
      distance: '140 km'
    }
  ];

  // Buyer Orders (empty initial 0 baseline or matched user orders)
  const buyerOrders = orders.filter(o => o.buyerId === user?.id || o.buyerName === user?.username);

  // Buyer Type Adaptive Helper Config
  const getBuyerTypeContent = (type) => {
    switch (type) {
      case 'Restaurant':
        return {
          badge: '🍽️ Restaurant Kitchen',
          headline: 'Daily Fresh Farm Sourcing',
          quickActionLabel: 'Order Fresh Produce',
          quickActionTab: 'marketplace',
          priorityProduce: ['Tomato', 'Onion', 'Potato', 'Chilli', 'Vegetables', 'Grapes'],
          desc: 'Direct-from-farm daily morning harvest deliveries without cold chain storage delays.'
        };
      case 'Hotel':
        return {
          badge: '🏨 Hospitality Bulk Buyer',
          headline: 'Scheduled Pantry & Buffet Procurement',
          quickActionLabel: 'Create Bulk Requirement',
          quickActionTab: 'requirements',
          priorityProduce: ['Tomato', 'Potato', 'Rice', 'Wheat', 'Vegetables', 'Banana', 'Pulses'],
          desc: 'Contract-based bulk supply with verified quality compliance and scheduled delivery slots.'
        };
      case 'Retail Store':
        return {
          badge: '🏪 Retail Mart',
          headline: 'Fresh Grocery Restocking',
          quickActionLabel: 'Find Local Suppliers',
          quickActionTab: 'farmers',
          priorityProduce: ['Onion', 'Tomato', 'Potato', 'Banana', 'Vegetables'],
          desc: 'Source shelf-ready farm produce directly from neighboring talukas with low transit freight.'
        };
      case 'Supermarket':
        return {
          badge: '🛒 Supermarket Chain',
          headline: 'Multi-Truck Procurement Request',
          quickActionLabel: 'Create Procurement Request',
          quickActionTab: 'requirements',
          priorityProduce: ['Tomato', 'Onion', 'Potato', 'Wheat', 'Rice', 'Grapes', 'Pomegranate'],
          desc: 'High-volume recurring multi-crop agreements with quality grading and unified transport.'
        };
      case 'Mandi / Wholesale Market':
        return {
          badge: '🏬 Mandi Wholesaler',
          headline: 'Wholesale APMC Lot Sourcing',
          quickActionLabel: 'Buy in Bulk',
          quickActionTab: 'marketplace',
          priorityProduce: ['Onion', 'Soybean', 'Cotton', 'Wheat', 'Gram', 'Turmeric'],
          desc: 'Direct APMC wholesale consignments with live mandi price benchmarking.'
        };
      case 'Trader':
        return {
          badge: '👨‍💼 Agri Trader',
          headline: 'Multi-District Market Arbitrage',
          quickActionLabel: 'Compare Markets',
          quickActionTab: 'market',
          priorityProduce: ['Soybean', 'Cotton', 'Tur', 'Gram', 'Wheat', 'Onion'],
          desc: 'Compare AGMARKNET market prices across 36 Maharashtra districts for optimal trade margins.'
        };
      case 'Exporter':
        return {
          badge: '🚢 Global Exporter',
          headline: 'Export Grade Certified Crops',
          quickActionLabel: 'Find Export-Quality Produce',
          quickActionTab: 'marketplace',
          priorityProduce: ['Grapes', 'Pomegranate', 'Onion', 'Banana', 'Rice', 'Chilli'],
          desc: 'Global GAP standard produce with pesticide residue test reports and farm-to-port traceability.'
        };
      case 'Food Processing Company':
        return {
          badge: '🏭 Food Processing Plant',
          headline: 'Raw Material Processing Contracts',
          quickActionLabel: 'Post Raw Material Requirement',
          quickActionTab: 'requirements',
          priorityProduce: ['Tomato (Processing Roma)', 'Sugarcane', 'Soybean', 'Potato (Chip Grade)', 'Maize'],
          desc: 'Standardized brix and dry-matter specifications for pulp, sauce, sugar, and oil milling.'
        };
      case 'Grain / Dal Mill':
        return {
          badge: '🌾 Grain & Dal Mill',
          headline: 'Paddy, Wheat & Pulses Procurement',
          quickActionLabel: 'Source Bulk Grains',
          quickActionTab: 'marketplace',
          priorityProduce: ['Wheat', 'Rice', 'Tur', 'Gram', 'Soybean', 'Moong'],
          desc: 'Direct moisture-tested grain supply from Marathwada and Vidarbha farmers.'
        };
      case 'Animal Feed Company':
        return {
          badge: '🐄 Animal Feed Manufacturer',
          headline: 'Feed Grain & Meal Sourcing',
          quickActionLabel: 'Post Feed Requirements',
          quickActionTab: 'requirements',
          priorityProduce: ['Maize', 'Soybean', 'Jowar', 'Bajra'],
          desc: 'Protein-rich raw feed grain lots with direct mill delivery.'
        };
      default:
        return {
          badge: '🏢 Institutional Buyer',
          headline: 'Commercial Agri Sourcing',
          quickActionLabel: 'Post Requirement',
          quickActionTab: 'requirements',
          priorityProduce: ['Tomato', 'Onion', 'Wheat', 'Rice', 'Vegetables', 'Potato'],
          desc: 'Reliable scheduled procurement backed by SA Group escrow guarantees.'
        };
    }
  };

  const buyerConfig = getBuyerTypeContent(buyerType);

  const handleCreateRequirement = (e) => {
    e.preventDefault();
    if (!newReqQty || !newReqMaxPrice) {
      alert('Please fill out all requirement fields.');
      return;
    }
    const newReq = {
      id: 'REQ-' + Math.floor(100 + Math.random() * 900),
      crop: newReqCrop,
      variety: 'Standard Grade',
      quantity: parseFloat(newReqQty),
      unit: newReqUnit,
      maxPrice: parseFloat(newReqMaxPrice),
      requiredDate: newReqDate,
      preferredDistrict: newReqDistrict,
      quality: newReqQuality,
      status: 'Active',
      matchedFarmers: 5
    };
    setRequirementsList([newReq, ...requirementsList]);
    setShowPostReqModal(false);
    setNewReqQty('');
    setNewReqMaxPrice('');
    alert(`Requirement for ${newReqQty} ${newReqUnit} ${newReqCrop} posted! Matching farmers will receive SMS notifications.`);
  };

  const handleAcceptOffer = (offerId) => {
    setOffersList(offersList.map(o => o.id === offerId ? { ...o, status: 'Accepted' } : o));
    alert('Offer accepted! Trade order created with escrow security.');
  };

  const handleRejectOffer = (offerId) => {
    setOffersList(offersList.map(o => o.id === offerId ? { ...o, status: 'Rejected' } : o));
  };

  const handleCounterOfferSubmit = (offerId) => {
    if (!counterPriceInput) {
      alert('Please enter a counter price.');
      return;
    }
    setOffersList(offersList.map(o => o.id === offerId ? { ...o, buyerOffer: parseFloat(counterPriceInput), status: 'Counter Offered' } : o));
    setSelectedOfferModal(null);
    setCounterPriceInput('');
    alert(`Counter offer of ₹${counterPriceInput}/Qtl sent to farmer.`);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5] dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Buyer Navigation Bar */}
      <div className="bg-white dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand / Title */}
            <div 
              onClick={() => onNavigate && onNavigate('landing')}
              className="flex items-center gap-3 cursor-pointer select-none hover:opacity-90 transition"
              title="Return to Home"
            >
              <div className="bg-primary-600 p-2 rounded-2xl text-white">
                <Building2 size={20} />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-850 dark:text-white leading-none block">
                  {businessName}
                </span>
                <span className="text-[10px] font-extrabold text-primary-600 dark:text-primary-400 uppercase tracking-widest mt-0.5 block">
                  {buyerConfig.badge}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 text-xs font-extrabold">
              {procurementMode === 'B2F' ? (
                [
                  { id: 'home', label: '🏠 Dashboard' },
                  { id: 'farmers', label: '🔎 Find Farmers' },
                  { id: 'marketplace', label: '🌾 Farm Marketplace' },
                  { id: 'requirements', label: '📋 Requirements' },
                  { id: 'offers', label: '💬 Offers' },
                  { id: 'orders', label: '📦 Orders' },
                  { id: 'tracking', label: '🗺️ Tracking' },
                  { id: 'market', label: '📈 Mandi Prices' },
                  { id: 'profile', label: '👤 Profile' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-xl transition ${
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))
              ) : (
                [
                  { id: 'home', label: '🏢 B2B Dashboard' },
                  { id: 'marketplace', label: '🏬 Warehouse Lots (B2B)' },
                  { id: 'requirements', label: '📑 Bulk RFQ Tenders' },
                  { id: 'offers', label: '💬 Trader Offers' },
                  { id: 'orders', label: '📦 B2B Orders' },
                  { id: 'tracking', label: '🚚 Freight Tracking' },
                  { id: 'market', label: '📈 APMC Arbitrage' },
                  { id: 'profile', label: '👤 Profile' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-xl transition ${
                      activeTab === tab.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))
              )}
            </div>

            {/* Verification Status & Profile Action */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-[10px] font-black border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{procurementMode === 'B2F' ? 'FARM-DIRECT VERIFIED' : 'B2B WHOLESALE VERIFIED'}</span>
              </div>

              <button
                onClick={() => onNavigate('marketplace')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow"
              >
                <ShoppingBag size={14} />
                <span>Marketplace</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  if (onNavigate) onNavigate('landing');
                }}
                className="text-xs font-extrabold text-slate-400 hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>

          </div>
        </div>

        {/* Dual Channel Procurement Switcher Sub-Header Bar */}
        <div className="bg-slate-100/90 dark:bg-slate-800/90 border-t border-slate-200/80 dark:border-slate-700/80 py-2.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
            
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-600 dark:text-slate-300">
              <span className="text-slate-400 uppercase tracking-wider text-[10px]">Active Sourcing Mode:</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-black ${
                procurementMode === 'B2F' ? 'bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {procurementMode === 'B2F' ? '🌱 Channel 1: Farm-to-Business (B2F)' : '🏢 Channel 2: Buyer-to-Buyer Wholesale (B2B)'}
              </span>
            </div>

            {/* Switcher Toggle Pill */}
            <div className="flex items-center p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <button
                onClick={() => {
                  setProcurementMode('B2F');
                  setActiveTab('home');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                  procurementMode === 'B2F'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-primary-600'
                }`}
              >
                <span>🌱 Farm-Direct Sourcing</span>
                <span className="text-[9px] font-bold opacity-80 hidden md:inline">(From Farmers)</span>
              </button>

              <button
                onClick={() => {
                  setProcurementMode('B2B');
                  setActiveTab('home');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                  procurementMode === 'B2B'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                }`}
              >
                <span>🏢 B2B Wholesale Trading</span>
                <span className="text-[9px] font-bold opacity-80 hidden md:inline">(Hotels, Mandis, Traders, Exporters)</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* ==========================================
            TAB 1: ADAPTIVE BUYER HOME DASHBOARD
            ========================================== */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Adaptive Welcome Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-primary-500/30 to-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <span>🚀 SA GROUP BUYER PORTAL</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    </span>
                    <span className="text-xs text-slate-400 font-bold">• {buyerConfig.badge}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black">
                    Good morning, {businessName} 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    {buyerConfig.desc}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab(buyerConfig.quickActionTab)}
                    className="px-5 py-3 bg-primary-600 hover:bg-primary-500 text-white font-extrabold text-xs rounded-2xl transition shadow-lg shadow-primary-600/30 flex items-center gap-2"
                  >
                    <span>⚡ {buyerConfig.quickActionLabel}</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={() => setShowPostReqModal(true)}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition border border-white/10"
                  >
                    + Post Requirement
                  </button>
                </div>
              </div>

              {/* Priority Produce Tags Bar */}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center flex-wrap gap-2 text-xs">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  🎯 Priority Crops for {buyerType}:
                </span>
                {buyerConfig.priorityProduce.map((cropName, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setFarmerSearchCrop(cropName);
                      setActiveTab('farmers');
                    }}
                    className="px-3 py-1 bg-white/10 hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition border border-white/10"
                  >
                    {cropName}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Available Crops</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">{initialCrops.length}+ Lots</span>
                <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Across 36 Maharashtra districts</span>
              </div>

              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">My Requirements</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">{requirementsList.length} Active</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">{requirementsList.reduce((acc, r) => acc + (r.matchedFarmers || 0), 0)} Matched Farmers</span>
              </div>

              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Deliveries</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">
                  {buyerOrders.filter(o => o.status === 'In Transit' || o.status === 'Pickup Started').length} In-Transit
                </span>
                <span className="text-[10px] text-emerald-600 font-bold mt-1 block">GPS Telemetry</span>
              </div>

              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Procurement</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">
                  ₹{buyerOrders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + (o.total || o.buyerTotal || 0), 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">Escrow Protected</span>
              </div>
            </div>

            {/* Dual Column Section: Quick Actions & Live Deliveries */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Actions Column (2 Cols) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 5 Core Actions Grid */}
                <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">
                    Core Buyer Actions / मुख्य सुविधाएं
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setActiveTab('marketplace')}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-left hover:border-primary-500 transition space-y-1"
                    >
                      <span className="text-xl">🌾</span>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-white block">Find Crops</span>
                      <span className="text-[10px] text-slate-400 block">Direct farm listings</span>
                    </button>

                    <button
                      onClick={() => setShowPostReqModal(true)}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-left hover:border-primary-500 transition space-y-1"
                    >
                      <span className="text-xl">📋</span>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-white block">Post Requirement</span>
                      <span className="text-[10px] text-slate-400 block">Get farmer bids</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('orders')}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-left hover:border-primary-500 transition space-y-1"
                    >
                      <span className="text-xl">📦</span>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-white block">My Orders</span>
                      <span className="text-[10px] text-slate-400 block">Status & invoices</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('farmers')}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-left hover:border-primary-500 transition space-y-1"
                    >
                      <span className="text-xl">🗺️</span>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-white block">Find Farmers</span>
                      <span className="text-[10px] text-slate-400 block">Maharashtra map</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('tracking')}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-left hover:border-primary-500 transition space-y-1"
                    >
                      <span className="text-xl">🚚</span>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-white block">Track Delivery</span>
                      <span className="text-[10px] text-slate-400 block">Live cargo route</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('market')}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-left hover:border-primary-500 transition space-y-1"
                    >
                      <span className="text-xl">📈</span>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-white block">Mandi Prices</span>
                      <span className="text-[10px] text-slate-400 block">AGMARKNET feeds</span>
                    </button>
                  </div>
                </div>

                {/* Active Buyer Requirements Widget */}
                <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">
                      Active Requirements ({requirementsList.length})
                    </h3>
                    <button
                      onClick={() => setActiveTab('requirements')}
                      className="text-xs font-bold text-primary-600 hover:underline"
                    >
                      View All →
                    </button>
                  </div>

                  {requirementsList.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="text-2xl block">📋</span>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-white block">No active requirements posted yet (0)</span>
                      <p className="text-[10px] text-slate-400">Post your crop demands to receive direct quotations and counter bids from verified farmers.</p>
                      <button 
                        onClick={() => setShowPostReqModal(true)} 
                        className="mt-2 py-1.5 px-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow"
                      >
                        + Post First Requirement
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {requirementsList.map((req) => (
                        <div key={req.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-slate-850 dark:text-white">{req.crop}</span>
                              <span className="text-[10px] font-bold text-primary-700 bg-primary-50 dark:bg-primary-950 px-2 py-0.5 rounded-full">{req.quality}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-semibold mt-1">
                              {req.quantity} {req.unit} • Max Price: ₹{req.maxPrice}/{req.unit} • Needed by {req.requiredDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-emerald-600 block">{req.matchedFarmers} Farmers Matched</span>
                            <button
                              onClick={() => setActiveTab('offers')}
                              className="mt-1 text-[10px] font-bold text-primary-600 hover:underline"
                            >
                              Check Offers →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Sidebar Column: In-Transit Tracking & Offers */}
              <div className="space-y-6">
                
                {/* Live Delivery Preview Card */}
                <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">
                      Live Delivery Tracking
                    </h3>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      {buyerOrders.filter(o => o.status === 'In Transit').length} In Transit
                    </span>
                  </div>

                  {buyerOrders.filter(o => o.status === 'In Transit').length === 0 ? (
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
                      <span className="text-2xl block">🚚</span>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-white block">No active shipments in transit (0)</span>
                      <p className="text-[10px] text-slate-400">Live GPS tracking and driver telemetry activate automatically when an order is picked up.</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">Order #{buyerOrders.find(o => o.status === 'In Transit')?.id}</span>
                        <span className="font-extrabold text-primary-600">ETA: 35 mins</span>
                      </div>
                      <div className="space-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <p>🌾 Cargo: {buyerOrders.find(o => o.status === 'In Transit')?.cropName || 'Tomato'}</p>
                        <p>🏢 Dest: {businessName}, Pune</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('tracking')}
                        className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        Open Live GPS Map →
                      </button>
                    </div>
                  )}
                </div>

                {/* Pending Offers Widget */}
                <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">
                      Pending Farmer Offers ({offersList.length})
                    </h3>
                    <button onClick={() => setActiveTab('offers')} className="text-xs font-bold text-primary-600 hover:underline">
                      View All →
                    </button>
                  </div>

                  {offersList.length === 0 ? (
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-1.5">
                      <span className="text-2xl block">💬</span>
                      <span className="font-extrabold text-xs text-slate-850 dark:text-white block">No pending offers (0)</span>
                      <p className="text-[10px] text-slate-400">Incoming price quotes from farmers will appear here for review.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {offersList.map((off) => (
                        <div key={off.id} className="p-3 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 text-xs space-y-1">
                          <div className="flex justify-between font-extrabold">
                            <span className="text-slate-800 dark:text-white">{off.farmer}</span>
                            <span className="text-primary-600">₹{off.buyerOffer}/Qtl</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold">{off.crop} • {off.quantity}</p>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-[10px] text-amber-600 font-bold">{off.status}</span>
                            <button
                              onClick={() => setActiveTab('offers')}
                              className="text-[10px] font-black text-primary-600 hover:underline"
                            >
                              Review →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            TAB 2: FARMER DISCOVERY (/buyer/farmers)
            ========================================== */}
        {activeTab === 'farmers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  Farmer Discovery / किसान खोज
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Browse verified Maharashtra farm suppliers with privacy-protected location mapping.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={farmerSearchDistrict}
                  onChange={(e) => setFarmerSearchDistrict(e.target.value)}
                  className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-white"
                >
                  <option value="All">All Maharashtra Districts (36)</option>
                  {maharashtraDistrictNames.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Farmers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmersList
                .filter(f => farmerSearchDistrict === 'All' || f.district === farmerSearchDistrict)
                .map((farmer) => (
                  <div key={farmer.id} className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-800 font-black flex items-center justify-center text-base">
                          {farmer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-slate-850 dark:text-white">{farmer.name}</span>
                            <span className="text-xs text-emerald-600" title="Verified Farm">✓</span>
                          </div>
                          <span className="text-xs text-slate-400 font-semibold block mt-0.5">
                            📍 {farmer.taluka}, {farmer.district} ({farmer.distance})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-lg text-xs font-bold">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span>{farmer.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available Produce:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {farmer.crops.map((c, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg border border-slate-100 dark:border-slate-700 text-[10px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-bold">{farmer.totalLand} Cultivation</span>
                      <button
                        onClick={() => {
                          setNewReqCrop(farmer.crops[0]);
                          setNewReqDistrict(farmer.district);
                          setShowPostReqModal(true);
                        }}
                        className="py-1.5 px-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow"
                      >
                        Request Quote
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: CROP MARKETPLACE (/buyer/marketplace)
            ========================================== */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  {procurementMode === 'B2F' 
                    ? '🌱 Direct Farm Harvest Marketplace / खेत से सीधी खरीद' 
                    : '🏢 B2B Pre-Graded Warehouse Lots / व्यापारी एवं मंडी थोक लॉट'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {procurementMode === 'B2F'
                    ? 'Procure directly from verified Maharashtra farmer harvests with farm-gate pickup.'
                    : 'Buy aggregated, lab-certified warehouse truckloads from primary traders, mandi aggregators and mills.'}
                </p>
              </div>

              <button
                onClick={() => onNavigate('marketplace')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition shadow ${
                  procurementMode === 'B2F' ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                Open Full Catalog View →
              </button>
            </div>

            {procurementMode === 'B2B' ? (
              /* B2B Warehouse Pre-Graded Lots Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {b2bWarehouseLots.map((lot) => (
                  <div key={lot.id} className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-slate-850 dark:text-white">{lot.commodity}</span>
                          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] px-2 py-0.5 rounded-lg border border-emerald-200">
                            {lot.grade}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-slate-500 block mt-1">
                          🏢 Supplier: {lot.supplierEntity} ({lot.supplierType})
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                          📍 {lot.location}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-lg text-emerald-600">₹{lot.price.toLocaleString('en-IN')}/{lot.unit}</span>
                        <span className="text-[10px] text-slate-400 block font-bold">GST & Mandi Tax Incl.</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Available Stock:</span>
                        <span className="font-extrabold text-slate-850 dark:text-white">{lot.availableQty} {lot.unit}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Min. Order (MOQ):</span>
                        <span className="font-extrabold text-primary-600">{lot.moq} {lot.unit}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Loading Time:</span>
                        <span className="font-extrabold text-emerald-600">{lot.loadingTime}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20 p-2.5 rounded-xl">
                      <span className="font-bold text-slate-500 text-[10px] uppercase block">Technical Specs:</span>
                      <span>{lot.specs}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-2">
                      <button
                        onClick={() => alert(`Lab Inspection Report for #${lot.id}: Moisture <11%, Foreign matter <0.5%, Lab Approved.`)}
                        className="py-2 px-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-50"
                      >
                        🔬 View Lab Report
                      </button>
                      <button
                        onClick={() => {
                          setNewReqCrop(lot.commodity);
                          setNewReqMaxPrice(lot.price);
                          setShowPostReqModal(true);
                        }}
                        className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition shadow"
                      >
                        Place B2B Bulk Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* B2F Direct Farm Produce Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {initialCrops.slice(0, 8).map((crop) => (
                  <div key={crop.id} className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                    <div className="h-40 bg-slate-100 relative">
                      <img src={crop.imageUrl} alt={crop.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-primary-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow">
                        {crop.quality} Quality
                      </span>
                    </div>
                    <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">{crop.name}</h4>
                          <span className="font-black text-sm text-primary-600">₹{crop.expectedPrice}/{crop.unit}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-semibold block mt-0.5">📍 {crop.location}</span>
                        <p className="text-xs text-slate-500 font-medium mt-2 line-clamp-2">{crop.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold">{crop.quantity} {crop.unit} avail</span>
                        <button
                          onClick={() => {
                            setNewReqCrop(crop.name);
                            setNewReqMaxPrice(crop.expectedPrice);
                            setShowPostReqModal(true);
                          }}
                          className="py-1.5 px-3 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition shadow"
                        >
                          Buy / Offer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 4: BUYER REQUIREMENTS / B2B TENDERS
            ========================================== */}
        {activeTab === 'requirements' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  {procurementMode === 'B2F' 
                    ? 'My Posted Farm Procurement Demands / मांग पत्र' 
                    : 'Commercial Bulk RFQ & Tenders / थोक व्यापार टेंडर'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {procurementMode === 'B2F'
                    ? 'Broadcast crop demands to nearby farmers to receive harvest quotes.'
                    : 'Float multi-truck commercial tenders for APMC Mandi aggregators, mills and export consolidators.'}
                </p>
              </div>

              <button
                onClick={() => setShowPostReqModal(true)}
                className={`py-2.5 px-5 rounded-2xl text-xs font-extrabold transition shadow flex items-center gap-1.5 ${
                  procurementMode === 'B2F' ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Plus size={14} />
                <span>{procurementMode === 'B2F' ? '+ Post New Requirement' : '+ Float Commercial Bulk RFQ'}</span>
              </button>
            </div>

            {requirementsList.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-3xl block">📋</span>
                <h4 className="font-black text-sm text-slate-850 dark:text-white">No Posted Requirements (0)</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">You haven't posted any crop requirements yet. Broadcast your demands to receive direct farmer bids.</p>
                <button onClick={() => setShowPostReqModal(true)} className="py-2.5 px-5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-extrabold transition shadow">
                  + Post First Requirement
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {requirementsList.map((req) => (
                  <div key={req.id} className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-slate-850 dark:text-white">{req.crop}</span>
                        <span className="bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-extrabold text-xs px-2.5 py-0.5 rounded-lg">
                          {req.variety}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Quantity: <strong>{req.quantity} {req.unit}</strong> • Target Price: <strong>₹{req.maxPrice}/{req.unit}</strong> • District: <strong>{req.preferredDistrict}</strong>
                      </p>
                      <span className="text-[10px] text-slate-400 font-bold block">
                        Required by: {req.requiredDate} • Quality Grade: {req.quality}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                      <div className="text-left lg:text-right">
                        <span className="text-xs font-black text-emerald-600 block">{req.matchedFarmers} Farmers Matching</span>
                        <span className="text-[10px] text-slate-400 font-semibold">2 direct offers received</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('offers')}
                        className="py-2 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                      >
                        View Offers →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 5: OFFERS & NEGOTIATIONS (/buyer/offers)
            ========================================== */}
        {activeTab === 'offers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  Offers & Price Negotiations / सौदे और बातचीत
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Review direct quotes from farmers, accept matching prices, or propose counter-offers.
                </p>
              </div>
            </div>

            {offersList.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-3xl block">💬</span>
                <h4 className="font-black text-sm text-slate-850 dark:text-white">No Farmer Offers Received (0)</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">When farmers submit price proposals or counter offers for your requirements, they will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offersList.map((offer) => (
                  <div key={offer.id} className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-850 dark:text-white">{offer.farmer}</span>
                          <span className="text-[10px] text-slate-400 font-bold">📍 {offer.farmerDistrict}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-semibold block mt-0.5">{offer.crop} • {offer.quantity}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                        offer.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {offer.status}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs font-semibold">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Farmer Quoted:</span>
                        <span className="text-sm font-extrabold text-slate-800 dark:text-white">₹{offer.farmerPrice}/Qtl</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Your Proposed Offer:</span>
                        <span className="text-sm font-extrabold text-primary-600">₹{offer.buyerOffer}/Qtl</span>
                      </div>
                    </div>

                    {offer.status !== 'Accepted' && (
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow"
                        >
                          Accept & Lock Trade
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOfferModal(offer);
                            setCounterPriceInput(offer.buyerOffer.toString());
                          }}
                          className="py-2 px-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50"
                        >
                          Counter Offer
                        </button>
                        <button
                          onClick={() => handleRejectOffer(offer.id)}
                          className="py-2 px-3 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 6: MY ORDERS (/buyer/orders)
            ========================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  Procurement Orders Pipeline / ऑर्डर सूची ({buyerOrders.length})
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Track orders from farm pickup and quality grading to final mandi delivery and escrow settlement.
                </p>
              </div>
            </div>

            {buyerOrders.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-3xl block">🛒</span>
                <h4 className="font-black text-sm text-slate-850 dark:text-white">No Procurement Orders (0)</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">You have not placed any orders yet. Visit the crop marketplace to procure directly from verified farmers.</p>
                <button onClick={() => setActiveTab('marketplace')} className="py-2.5 px-5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-extrabold transition shadow">
                  Explore Crop Marketplace →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {buyerOrders.map((order) => (
                  <div key={order.id} className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-850 dark:text-white">#{order.id}</span>
                          <span className="font-bold text-sm text-primary-600">• {order.cropName || order.crop}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-semibold">{order.quantity || order.qty} {order.unit || 'Qtl'} • Total: ₹{(order.total || order.buyerTotal || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <span className="bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-extrabold text-xs px-3 py-1 rounded-full uppercase">
                        {order.status}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Farmer / Origin:</span>
                        <span className="text-slate-800 dark:text-white">{order.farmerName || order.farmer || 'Farmer Partner'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Transporter:</span>
                        <span className="text-slate-800 dark:text-white">{order.transporterName || order.transporter || 'Pending Assignment'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Delivery ETA / Date:</span>
                        <span className="text-emerald-600 font-bold">{order.deliveryDate || order.eta || 'Standard Transit'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 7: LIVE DELIVERY TRACKING (/buyer/tracking)
            ========================================== */}
        {activeTab === 'tracking' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  Live Consignment Tracking / लाइव जीपीएस ट्रैकिंग
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Active transport route telemetry between Farmer Pickup and Buyer Destination.
                </p>
              </div>
            </div>

            {buyerOrders.filter(o => o.status === 'In Transit').length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-3xl block">🛰️</span>
                <h4 className="font-black text-sm text-slate-850 dark:text-white">No Active Shipments in Transit (0)</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">Real-time GPS telemetry, driver details, and arrival ETA will activate here once a farm consignment is picked up.</p>
                <button onClick={() => setActiveTab('marketplace')} className="py-2.5 px-5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-extrabold transition shadow">
                  Browse Produce Marketplace →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Map Canvas Simulation */}
                <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 relative overflow-hidden min-h-[380px] flex flex-col justify-between text-white shadow-xl">
                  <div className="flex justify-between items-start relative z-10">
                    <div className="bg-slate-800/90 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold">
                      🛰️ Live GPS Telemetry Active
                    </div>
                    <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase">
                      35 Mins to Arrival
                    </span>
                  </div>

                  {/* Simulated Visual Route */}
                  <div className="space-y-4 py-8 relative z-10">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span>📍 Farm: Niphad, Nashik</span>
                      <span className="text-emerald-400">🚚 MH-12-AB-1234 (Highway NH-60)</span>
                      <span>🏢 Dest: {businessName}, Pune</span>
                    </div>
                    <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden relative">
                      <div className="bg-gradient-to-r from-emerald-500 to-primary-400 h-full w-[72%] rounded-full animate-pulse" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                      <span>Departed 06:30 AM</span>
                      <span>Speed: 52 km/h • Temp: 21°C</span>
                      <span>Expected: 11:15 AM</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono relative z-10">
                    Privacy Protected: Exact private farm coordinates are secured under authorized transport manifest.
                  </div>
                </div>

                {/* Manifest Driver Info */}
                <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">Transporter Details</h4>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2 text-xs font-semibold">
                    <p className="font-bold text-slate-850 dark:text-white">Driver: Satnam Singh</p>
                    <p className="text-slate-500">Vehicle: Tata 407 (MH-12-AB-1234)</p>
                    <p className="text-slate-500">Transporter Rating: ⭐ 4.9</p>
                    <p className="text-emerald-600 font-bold">Quality Check: Verified at Farm Pickup ✓</p>
                  </div>
                  <button
                    onClick={() => alert('Calling Transporter Satnam Singh: +91 9912345678')}
                    className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-extrabold transition shadow flex items-center justify-center gap-2"
                  >
                    <Phone size={14} />
                    <span>Call Transporter</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 8: MARKET INTELLIGENCE (/buyer/market)
            ========================================== */}
        {activeTab === 'market' && (() => {
          const filteredBuyerPrices = marketPrices.filter((p) => {
            const matchesCrop = buyerMarketCrop === 'All' || !buyerMarketCrop || p.commodity?.toLowerCase() === buyerMarketCrop.toLowerCase();
            const matchesDistrict = buyerMarketDistrict === 'All' || !buyerMarketDistrict || 
              p.district_name?.toLowerCase().includes(buyerMarketDistrict.toLowerCase()) || 
              p.market_name?.toLowerCase().includes(buyerMarketDistrict.toLowerCase());
            return matchesCrop && matchesDistrict;
          });

          return (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                    AGMARKNET Mandi Bhav Intelligence / मंडी भाव
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Official AGMARKNET agricultural market data synchronized across 36 Maharashtra APMC mandis.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/50 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>🟢 Live AGMARKNET Feeds</span>
                  </span>
                  <button
                    onClick={handleBuyerSync}
                    disabled={syncingBuyerPrices}
                    className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition shadow disabled:opacity-50"
                  >
                    <span>{syncingBuyerPrices ? '⏳ Syncing...' : '🔄 Sync Mandi Bhav'}</span>
                  </button>
                </div>
              </div>

              {buyerSyncMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 animate-fade-in">
                  ✓ {buyerSyncMsg}
                </div>
              )}

              {/* Filters Bar */}
              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Filter District</label>
                    <select
                      value={buyerMarketDistrict}
                      onChange={(e) => setBuyerMarketDistrict(e.target.value)}
                      className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-white"
                    >
                      <option value="All">All Maharashtra Mandis (36)</option>
                      {maharashtraDistrictNames.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Filter Commodity</label>
                    <select
                      value={buyerMarketCrop}
                      onChange={(e) => setBuyerMarketCrop(e.target.value)}
                      className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-white"
                    >
                      <option value="All">All Commodities</option>
                      {['Tomato', 'Onion', 'Potato', 'Wheat', 'Rice', 'Soybean', 'Cotton', 'Sugarcane', 'Chilli', 'Banana', 'Grapes', 'Pomegranate', 'Jowar', 'Bajra', 'Orange', 'Turmeric', 'Maize', 'Mango'].map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-400">
                  Showing {filteredBuyerPrices.length} live APMC observations
                </span>
              </div>

              {/* Price Table */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto max-h-[460px]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800">
                      <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold">
                        <th className="p-4">Commodity</th>
                        <th className="p-4">Market / Mandi</th>
                        <th className="p-4">District</th>
                        <th className="p-4">Arrival Qty</th>
                        <th className="p-4">Min Price</th>
                        <th className="p-4">Max Price</th>
                        <th className="p-4 text-emerald-600 font-black">Modal Price</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-semibold">
                      {filteredBuyerPrices.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="p-12 text-center text-slate-400 font-bold">
                            No market records found for this combination. Try choosing "All Mandis" or "All Commodities".
                          </td>
                        </tr>
                      ) : (
                        filteredBuyerPrices.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                            <td className="p-4 font-black text-slate-850 dark:text-white">
                              {row.commodity}
                              <span className="text-[10px] text-slate-400 font-normal block">{row.variety || 'Local'}</span>
                            </td>
                            <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{row.market_name}</td>
                            <td className="p-4 text-slate-500">📍 {row.district_name || 'Maharashtra'}</td>
                            <td className="p-4 font-bold text-slate-600 dark:text-slate-400">{row.arrival_quantity || 50} {row.unit || 'Quintal'}</td>
                            <td className="p-4 font-bold text-slate-700">₹{row.minimum_price?.toLocaleString('en-IN')}/Qtl</td>
                            <td className="p-4 font-bold text-slate-700">₹{row.maximum_price?.toLocaleString('en-IN')}/Qtl</td>
                            <td className="p-4 font-extrabold text-emerald-600 text-sm">₹{row.modal_price?.toLocaleString('en-IN')}/Qtl</td>
                            <td className="p-4 text-slate-400 font-bold">{row.arrival_date}</td>
                            <td className="p-4 text-emerald-600 font-bold text-[10px]">{row.source || 'AGMARKNET'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ==========================================
            TAB 9: BUYER PROFILE (/buyer/profile)
            ========================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  Buyer Profile & KYC Status / प्रोफ़ाइल
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage registered commercial information and verified trade credentials.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                🟢 Verified Active Account
              </span>
            </div>

            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">Business Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Business Name:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{businessName}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Buyer Category:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{buyerType}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Contact Person:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{user?.username || 'Priya Sharma'}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Email & Mobile:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{user?.email || 'priya@hotel.com'} • {user?.phone || '9876543210'}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl sm:col-span-2">
                  <span className="text-slate-400 text-[10px] block">Business Location:</span>
                  <span className="font-bold text-slate-800 dark:text-white">Pune, Maharashtra, India</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* POST REQUIREMENT MODAL */}
      {showPostReqModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-scale-up">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                Post Bulk Procurement Requirement
              </h3>
              <button onClick={() => setShowPostReqModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Crop / Commodity</label>
                <select
                  value={newReqCrop}
                  onChange={(e) => setNewReqCrop(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                >
                  {['Tomato', 'Onion', 'Potato', 'Wheat', 'Rice', 'Cotton', 'Soybean', 'Grapes', 'Banana', 'Sugarcane'].map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Required Quantity</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={newReqQty}
                    onChange={(e) => setNewReqQty(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Unit</label>
                  <select
                    value={newReqUnit}
                    onChange={(e) => setNewReqUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                  >
                    <option value="Quintal">Quintal</option>
                    <option value="Kg">Kg</option>
                    <option value="Ton">Ton</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Max Price (₹/Unit)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2800"
                    value={newReqMaxPrice}
                    onChange={(e) => setNewReqMaxPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Required Date</label>
                  <input
                    type="date"
                    value={newReqDate}
                    onChange={(e) => setNewReqDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Preferred District</label>
                <select
                  value={newReqDistrict}
                  onChange={(e) => setNewReqDistrict(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                >
                  {maharashtraDistrictNames.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-extrabold text-xs transition shadow mt-2"
              >
                Post Requirement / मांग पत्र भेजें
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COUNTER OFFER MODAL */}
      {selectedOfferModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-scale-up">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">
                Counter Offer to {selectedOfferModal.farmer}
              </h3>
              <button onClick={() => setSelectedOfferModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <div className="text-xs space-y-1">
              <p className="text-slate-500">Crop: <strong>{selectedOfferModal.crop}</strong></p>
              <p className="text-slate-500">Farmer Price: <strong>₹{selectedOfferModal.farmerPrice}/Qtl</strong></p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Counter Price (₹/Qtl)</label>
              <input
                type="number"
                value={counterPriceInput}
                onChange={(e) => setCounterPriceInput(e.target.value)}
                placeholder="Enter counter price"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white text-xs"
              />
            </div>

            <button
              onClick={() => handleCounterOfferSubmit(selectedOfferModal.id)}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs transition shadow"
            >
              Send Counter Offer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
