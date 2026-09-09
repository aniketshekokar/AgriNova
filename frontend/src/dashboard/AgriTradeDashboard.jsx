import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { maharashtraDistrictNames } from '../utils/mockData';
import { 
  Building2, Sprout, Store, MapPin, Phone, ShoppingCart, 
  CheckCircle2, Clock, AlertTriangle, ChevronRight, X, ArrowRight, 
  FileText, User, Bell, Star, TrendingUp, RefreshCw, 
  Check, Award, Eye, Calendar, Sparkles, MessageSquare, AlertCircle, 
  CreditCard, Fuel, Layers, DollarSign, Package, Truck, Search, Plus, Filter
} from 'lucide-react';

export default function AgriTradeDashboard({ orders = [], onCompleteOrder, onNavigate, marketPrices = [], onSyncPrices }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  // Navigation tabs: home, marketplace, orders, distribution, inventory, rfq, prices, network, profile
  const [activeTab, setActiveTab] = useState('home');

  const businessName = user?.businessName || user?.name || 'Grand Heritage Palace Hotels';
  const businessType = user?.businessType || 'Hotel / Hospitality';
  const location = user?.location || 'Pune / Mumbai';

  // 0-Baseline Rule: Initialized with 0 data for brand new website launch
  const [marketplaceLots, setMarketplaceLots] = useState([]);
  const [rfqList, setRfqList] = useState([]);
  const [distributionCustomers, setDistributionCustomers] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  const [b2bOrders, setB2bOrders] = useState([]);

  // Modal for posting new RFQ
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [newRfqCrop, setNewRfqCrop] = useState('Tomato');
  const [newRfqQty, setNewRfqQty] = useState('10');
  const [newRfqUnit, setNewRfqUnit] = useState('Ton');
  const [newRfqPrice, setNewRfqPrice] = useState('30');
  const [newRfqDate, setNewRfqDate] = useState('2026-08-28');
  const [newRfqLocation, setNewRfqLocation] = useState('Central Warehouse');

  // Modal for adding Distribution Location
  const [showDistModal, setShowDistModal] = useState(false);
  const [newDistName, setNewDistName] = useState('');
  const [newDistType, setNewDistType] = useState('Restaurant');
  const [newDistCity, setNewDistCity] = useState('Pune');
  const [newDistContact, setNewDistContact] = useState('');
  const [newDistPhone, setNewDistPhone] = useState('');
  const [newDistVolume, setNewDistVolume] = useState('5 Ton');

  // Post new RFQ handler
  const handlePostRfq = (e) => {
    e.preventDefault();
    const newId = 'RFQ-' + Math.floor(500 + Math.random() * 500);
    setRfqList(prev => [
      {
        id: newId,
        crop: newRfqCrop,
        requiredQty: `${newRfqQty} ${newRfqUnit}`,
        maxTargetPrice: `₹${newRfqPrice}/kg`,
        targetDate: newRfqDate,
        deliveryLocation: newRfqLocation,
        qualityReq: 'Grade A Certified',
        bidsReceived: 0,
        lowestBid: 'Awaiting Bids',
        status: 'OPEN_FOR_BIDS'
      },
      ...prev
    ]);
    setShowRfqModal(false);
    alert(`🎉 RFQ Tender #${newId} Broadcasted to verified AgriSource suppliers across Maharashtra.`);
  };

  // Add new Distribution Destination handler
  const handleAddDistributionCustomer = (e) => {
    e.preventDefault();
    if (!newDistName.trim()) return;
    const newId = 'DIST-' + (distributionCustomers.length + 1);
    setDistributionCustomers(prev => [
      ...prev,
      {
        id: newId,
        name: newDistName,
        type: newDistType,
        city: newDistCity,
        contact: newDistContact || 'Manager',
        phone: newDistPhone || '+91 9822000000',
        monthlyReq: newDistVolume,
        weeklyFreq: 'Weekly',
        activeOrders: 0
      }
    ]);
    setShowDistModal(false);
    setNewDistName('');
    alert(`✓ Added ${newDistName} (${newDistCity}) to your active distribution network.`);
  };

  // Instant Purchase from Marketplace Lot
  const handlePurchaseLot = (lot) => {
    const orderNo = 'AGR-TRD-' + Math.floor(8800 + Math.random() * 200);
    const amount = lot.pricePerKg * 2000;
    const newOrder = {
      id: 'ORD-B2B-' + Math.floor(100 + Math.random() * 900),
      orderNumber: orderNo,
      crop: lot.crop,
      quantity: '2,000 kg (2 Ton MOQ)',
      supplier: lot.supplier,
      destination: 'Central Warehouse',
      totalAmount: amount,
      orderStatus: 'TRANSPORT_ASSIGNED',
      transportAssigned: 'AgriLogistics Dispatch #TR-991',
      eta: 'Tomorrow, 10:00 AM',
      paymentStatus: 'ESCROW_LOCKED'
    };
    setB2bOrders(prev => [newOrder, ...prev]);
    setActiveTab('orders');
    alert(`🎉 Purchase Order #${orderNo} confirmed! ₹${amount.toLocaleString('en-IN')} escrow-locked.`);
  };

  // Dynamic calculations from 0-baseline
  const totalProcurementAmount = b2bOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F7FAF5] dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Enterprise Header */}
      <div className="bg-white dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Title */}
            <div 
              onClick={() => onNavigate && onNavigate('landing')}
              className="flex items-center gap-3 cursor-pointer select-none hover:opacity-90 transition"
              title="Return to Home"
            >
              <div className="bg-amber-500 text-slate-950 p-2 rounded-2xl shadow-sm">
                <Store size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-slate-850 dark:text-white leading-none block">
                    {businessName}
                  </span>
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm">
                    AGRITRADE 🏬
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5 block">
                  {businessType} • {location}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 text-xs font-extrabold">
              {[
                { id: 'home', label: '🏠 Dashboard' },
                { id: 'marketplace', label: '🔎 Source Products' },
                { id: 'orders', label: '📦 Orders' },
                { id: 'distribution', label: '📍 Distribution' },
                { id: 'inventory', label: '🏬 Warehouses' },
                { id: 'rfq', label: '📋 Procurement Tenders' },
                { id: 'prices', label: '📊 Market Prices' },
                { id: 'network', label: '🌐 Business Network' },
                { id: 'profile', label: '👤 Profile' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl transition flex items-center gap-1 ${
                    activeTab === tab.id
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-black ring-1 ring-amber-400/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Actions & Verification Status */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-[10px] font-black border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>VERIFIED ENTERPRISE</span>
              </div>

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
      </div>

      {/* Main Workspace */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">

        {/* ==========================================
            TAB 1: ENTERPRISE OVERVIEW DASHBOARD
            ========================================== */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-primary-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                      AgriTrade B2B Business Channel
                    </span>
                    <span className="text-xs text-slate-400 font-bold">• {businessType}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black">
                    Good morning, {businessName} 👋
                  </h1>
                  <p className="text-xs text-slate-300 font-medium max-w-xl leading-relaxed">
                    Welcome to AgriTrade. Source pre-graded warehouse lots from primary aggregators, manage cold storage inventory, and distribute to client outlets across Maharashtra.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="flex-1 sm:flex-none px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
                  >
                    <span>🔎 Source Products</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={() => setShowRfqModal(true)}
                    className="flex-1 sm:flex-none px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition border border-white/10 text-center"
                  >
                    + Float RFQ Tender
                  </button>
                </div>
              </div>
            </div>

            {/* 8 Live Commercial KPI Cards - ALL 0 BASELINE */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div 
                onClick={() => setActiveTab('marketplace')}
                className="bg-white dark:bg-slate-850 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-amber-400 transition"
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Available Sourcing Lots</span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{marketplaceLots.length} Warehouse Lots</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">0 Ton Active Lots</span>
              </div>

              <div 
                onClick={() => setActiveTab('orders')}
                className="bg-white dark:bg-slate-850 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-primary-400 transition"
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Orders</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">{b2bOrders.length} In Pipeline</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">0 In Transit</span>
              </div>

              <div 
                onClick={() => setActiveTab('distribution')}
                className="bg-white dark:bg-slate-850 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-400 transition"
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Distribution Network</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">{distributionCustomers.length} Client Hubs</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">0 Ton Monthly Supply</span>
              </div>

              <div 
                onClick={() => setActiveTab('inventory')}
                className="bg-white dark:bg-slate-850 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-slate-400 transition"
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Warehouse Stock</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">0 Ton</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">0 Cold Storages</span>
              </div>

              <div className="bg-white dark:bg-slate-850 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Monthly Procurement</span>
                <span className="text-2xl font-black text-primary-600 mt-1 block">₹{totalProcurementAmount.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">0 Ton Procured</span>
              </div>

              <div className="bg-white dark:bg-slate-850 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Monthly Commercial Sales</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">₹0</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">0% Margin</span>
              </div>

              <div className="bg-white dark:bg-slate-850 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Active RFQ Tenders</span>
                <span className="text-2xl font-black text-amber-600 mt-1 block">{rfqList.length} Open RFQs</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">0 Bids Received</span>
              </div>

              <div className="bg-white dark:bg-slate-850 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Estimated Business Value</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">₹0</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">0 Active Contracts</span>
              </div>
            </div>

            {/* Sourcing Empty State */}
            <div className="p-8 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-4xl block">🏪</span>
              <h4 className="font-black text-base text-slate-850 dark:text-white">Start Sourcing Bulk Agricultural Cargo</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Float your first RFQ procurement tender or discover verified warehouse lots from APMC aggregators across Maharashtra.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowRfqModal(true)}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-black text-xs rounded-xl transition shadow"
                >
                  + Float RFQ Tender
                </button>
                <button
                  onClick={() => setShowDistModal(true)}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-50"
                >
                  + Add Distribution Location
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ==========================================
            TAB 2: SOURCE PRODUCTS MARKETPLACE (/agritrade/marketplace)
            ========================================== */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  Source Products Marketplace / कृषि उत्पाद स्रोत
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Procure verified pre-graded warehouse lots from primary AgriSource buyers, APMC aggregators and mills.
                </p>
              </div>

              <button
                onClick={() => setShowRfqModal(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow"
              >
                + Post Custom RFQ Tender
              </button>
            </div>

            {marketplaceLots.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-4xl block">📦</span>
                <h4 className="font-black text-base text-slate-850 dark:text-white">0 Active Marketplace Lots</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Aggregators and primary buyers have not uploaded fresh warehouse consignments yet. Float an RFQ tender to request suppliers for custom quotes.
                </p>
                <button
                  onClick={() => setShowRfqModal(true)}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-black text-xs rounded-xl transition shadow"
                >
                  + Float RFQ Tender
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketplaceLots.map((lot) => (
                  <div key={lot.id} className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="font-black text-base text-slate-850 dark:text-white">{lot.crop}</span>
                      <span className="font-black text-2xl text-emerald-600">₹{lot.pricePerKg}/kg</span>
                    </div>
                    <button
                      onClick={() => handlePurchaseLot(lot)}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition shadow"
                    >
                      Request Purchase
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 3: DISTRIBUTION NETWORK (/agritrade/distribution)
            ========================================== */}
        {activeTab === 'distribution' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  Distribution Network Management / वितरण नेटवर्क
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage where your sourced agricultural cargo is supplied (Restaurants, Hotels, Supermarkets, Mandis).
                </p>
              </div>

              <button
                onClick={() => setShowDistModal(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add Distribution Location</span>
              </button>
            </div>

            {distributionCustomers.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-4xl block">📍</span>
                <h4 className="font-black text-base text-slate-850 dark:text-white">0 Distribution Destinations Added</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Add your client restaurants, hotels, supermarket outlets, or retail stores to manage dispatches.
                </p>
                <button
                  onClick={() => setShowDistModal(true)}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-black text-xs rounded-xl transition shadow"
                >
                  + Add First Distribution Destination
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {distributionCustomers.map((cust) => (
                  <div key={cust.id} className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="font-black text-sm text-slate-850 dark:text-white">{cust.name}</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded">{cust.type}</span>
                    </div>
                    <p className="text-xs text-slate-400">📍 {cust.city} • Volume: {cust.monthlyReq}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 4: MULTI-WAREHOUSE INVENTORY (/agritrade/inventory)
            ========================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                Multi-Warehouse Inventory & Storage / गोदाम स्टॉक प्रबंधन
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Real-time tracking of Available, Reserved, and Dispatched stock across dry and cold storage facilities.
              </p>
            </div>

            {inventoryList.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-4xl block">🏬</span>
                <h4 className="font-black text-sm text-slate-850 dark:text-white">0 kg Warehouse Stock Recorded</h4>
                <p className="text-xs text-slate-400">Stock intake from completed purchase orders will automatically appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {inventoryList.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2 text-xs font-semibold">
                    <span className="font-black text-sm text-slate-850 dark:text-white block">{item.crop}</span>
                    <span className="text-slate-400">{item.warehouse}</span>
                    <span className="font-black text-emerald-600 text-sm block">{item.availableQty}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 5: PROCUREMENT RFQ TENDERS
            ========================================== */}
        {activeTab === 'rfq' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  Bulk Procurement RFQ Tenders / निविदाएं
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Float multi-ton commercial procurement tenders to verified AgriSource aggregators and suppliers.
                </p>
              </div>

              <button
                onClick={() => setShowRfqModal(true)}
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Float New RFQ Tender</span>
              </button>
            </div>

            {rfqList.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-4xl block">📋</span>
                <h4 className="font-black text-base text-slate-850 dark:text-white">0 Open Procurement Tenders</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  You have not floated any RFQ tenders yet. Post a tender with target prices to invite aggregator quotes.
                </p>
                <button
                  onClick={() => setShowRfqModal(true)}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-black text-xs rounded-xl transition shadow"
                >
                  + Float First RFQ Tender
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {rfqList.map((rfq) => (
                  <div key={rfq.id} className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center text-xs">
                    <div>
                      <span className="font-black text-sm text-slate-850 dark:text-white block">{rfq.crop} (#{rfq.id})</span>
                      <span className="text-slate-400">Volume: {rfq.requiredQty} • Target Cap: {rfq.maxTargetPrice}</span>
                    </div>
                    <span className="font-black text-emerald-600">{rfq.bidsReceived} Bids</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 6: COMMERCIAL B2B ORDERS
            ========================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                B2B Purchase Orders & Shipments / आदेश ट्रैकिंग
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Track commercial purchase orders, dispatch consignments, and AgriLogistics transport.
              </p>
            </div>

            {b2bOrders.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-3xl block">📦</span>
                <h4 className="font-black text-sm text-slate-850 dark:text-white">0 Orders In Pipeline</h4>
                <p className="text-xs text-slate-400">When you purchase consignments from suppliers, active orders will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {b2bOrders.map((ord) => (
                  <div key={ord.id} className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2 text-xs">
                    <span className="font-black text-sm text-slate-850 dark:text-white block">{ord.crop} (#{ord.orderNumber})</span>
                    <span className="text-slate-400">Supplier: {ord.supplier} • ₹{ord.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 7: AGMARKNET MARKET PRICES
            ========================================== */}
        {activeTab === 'prices' && (() => {
          return (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                    AGMARKNET Mandi Price Intelligence / सरकारी मंडी भाव
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Official government market prices synchronized across 36 Maharashtra APMC mandis.
                  </p>
                </div>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/50 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>AGMARKNET Official Mandi Feeds</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(marketPrices.length > 0 ? marketPrices.slice(0, 18) : [
                  { commodity: 'Tomato', market_name: 'Pune APMC', minimum_price: 2400, maximum_price: 3100, modal_price: 2800, arrival_quantity: 45 },
                  { commodity: 'Onion', market_name: 'Nashik APMC', minimum_price: 2100, maximum_price: 2700, modal_price: 2400, arrival_quantity: 120 },
                  { commodity: 'Grapes', market_name: 'Nashik APMC', minimum_price: 6200, maximum_price: 7800, modal_price: 7000, arrival_quantity: 25 },
                  { commodity: 'Pomegranate', market_name: 'Solapur APMC', minimum_price: 5800, maximum_price: 7500, modal_price: 6600, arrival_quantity: 30 },
                  { commodity: 'Soybean', market_name: 'Latur APMC', minimum_price: 4250, maximum_price: 4950, modal_price: 4580, arrival_quantity: 85 },
                  { commodity: 'Cotton', market_name: 'Akola APMC', minimum_price: 6650, maximum_price: 7450, modal_price: 7080, arrival_quantity: 60 }
                ]).map((mp, i) => (
                  <div key={i} className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="font-black text-sm text-slate-850 dark:text-white">{mp.commodity}</span>
                      <span className="text-xs font-bold text-slate-400">{mp.market_name}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Modal Mandi Price:</span>
                        <span className="font-black text-xl text-emerald-600">₹{mp.modal_price?.toLocaleString('en-IN')} <span className="text-xs font-medium text-slate-400">/ Qtl</span></span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">Range: ₹{mp.minimum_price?.toLocaleString('en-IN')} - ₹{mp.maximum_price?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ==========================================
            TAB 8: MY BUSINESS NETWORK GRAPH - 0 BASELINE
            ========================================== */}
        {activeTab === 'network' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                My AgriTrade Business Network / व्यावसायिक नेटवर्क
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Connected Suppliers, Client Outlets, Warehouses and Transporters in one ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">🤝 Primary Suppliers</span>
                <span className="font-black text-slate-850 dark:text-white text-base block">0 Connected APMCs</span>
                <p className="text-slate-400 text-[11px]">Connect with verified primary aggregators</p>
              </div>

              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">📍 Client Customers</span>
                <span className="font-black text-slate-850 dark:text-white text-base block">{distributionCustomers.length} Outlets</span>
                <p className="text-slate-400 text-[11px]">Add client restaurants & stores</p>
              </div>

              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">🏬 Storage Hubs</span>
                <span className="font-black text-slate-850 dark:text-white text-base block">0 Facilities</span>
                <p className="text-slate-400 text-[11px]">Register storage warehouses</p>
              </div>

              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">🚚 AgriLogistics Fleet</span>
                <span className="font-black text-slate-850 dark:text-white text-base block">0 Active Routes</span>
                <p className="text-slate-400 text-[11px]">Dispatch transport via AgriLogistics</p>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 9: MULTI-LOCATION PROFILE (/agritrade/profile)
            ========================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  Enterprise Profile & Multi-Branch Locations / कंपनी प्रोफ़ाइल
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Corporate headquarters, branch offices, and warehouse registrations.
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                Verified B2B Business ✓
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3 text-xs font-semibold">
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">Corporate Credentials</h4>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Business Name:</span>
                  <span className="font-bold text-slate-850 dark:text-white">{businessName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Business Type:</span>
                  <span className="font-bold text-primary-600">{businessType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Headquarters Address:</span>
                  <span className="font-bold text-slate-850 dark:text-white">Pune, Maharashtra</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3 text-xs font-semibold">
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">Registered Multi-Locations</h4>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="font-bold block">1. Head Office & Central Procurement</span>
                  <span className="text-slate-400 text-[11px]">Pune, Maharashtra</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: Post New RFQ Tender */}
      {showRfqModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-100 dark:border-slate-800 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-primary-100 text-primary-600 rounded-xl">
                  <FileText size={18} />
                </span>
                <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">
                  Float Bulk Procurement Tender (RFQ)
                </h3>
              </div>
              <button onClick={() => setShowRfqModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePostRfq} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Crop Commodity *</label>
                <input
                  type="text"
                  value={newRfqCrop}
                  onChange={(e) => setNewRfqCrop(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl font-bold dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Required Quantity *</label>
                  <input
                    type="number"
                    value={newRfqQty}
                    onChange={(e) => setNewRfqQty(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl font-bold dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Unit</label>
                  <select
                    value={newRfqUnit}
                    onChange={(e) => setNewRfqUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl font-bold dark:text-white"
                  >
                    <option value="Ton">Ton</option>
                    <option value="Quintal">Quintal</option>
                    <option value="Kg">Kg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Max Ceiling Price (₹/kg) *</label>
                <input
                  type="number"
                  value={newRfqPrice}
                  onChange={(e) => setNewRfqPrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl font-bold dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Target Delivery Location</label>
                <input
                  type="text"
                  value={newRfqLocation}
                  onChange={(e) => setNewRfqLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl font-bold dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRfqModal(false)}
                  className="py-2 px-4 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black transition shadow"
                >
                  Broadcast RFQ Tender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Distribution Location */}
      {showDistModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-100 dark:border-slate-800 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                  <MapPin size={18} />
                </span>
                <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">
                  Add Distribution Outlet / Client
                </h3>
              </div>
              <button onClick={() => setShowDistModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDistributionCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Outlet / Client Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Spice Route Baner Outlets"
                  value={newDistName}
                  onChange={(e) => setNewDistName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl font-bold dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Client Category</label>
                  <select
                    value={newDistType}
                    onChange={(e) => setNewDistType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl font-bold dark:text-white"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Retail Store">Retail Store</option>
                    <option value="Supermarket">Supermarket</option>
                    <option value="Mandi">Mandi</option>
                    <option value="Food Processor">Food Processor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={newDistCity}
                    onChange={(e) => setNewDistCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl font-bold dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Contact Officer & Mobile</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma (+91 9822113344)"
                  value={newDistContact}
                  onChange={(e) => setNewDistContact(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl font-semibold dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Estimated Monthly Sourcing Volume</label>
                <input
                  type="text"
                  value={newDistVolume}
                  onChange={(e) => setNewDistVolume(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl font-bold dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDistModal(false)}
                  className="py-2 px-4 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black transition shadow"
                >
                  Save Distribution Outlet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
