import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Users, BarChart2, ShoppingBag, Truck, Sprout, ShieldCheck, 
  Trash2, Landmark, ShieldAlert, Award, FileText, CheckCircle,
  Search, Bell, Settings, LogOut, Globe, AlertTriangle, ArrowRight,
  Star, Plus, Check, X, Info, Camera, Shield, HelpCircle, ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard({ crops = [], orders = [], marketPrices = [], onSyncPrices, onAddCrop, onDeleteCrop, onNavigate }) {
  const { t, lang, setLang } = useTranslation();
  const { logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('stats');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Detail overlays and modals
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCropForView, setSelectedCropForView] = useState(null);
  const [isAddCropModalOpen, setIsAddCropModalOpen] = useState(false);
  const [cropCategoryFilter, setCropCategoryFilter] = useState('All');

  // Admin Create Crop state
  const [adminCropForm, setAdminCropForm] = useState({
    name: 'Tomato',
    category: 'Vegetables',
    quantity: '',
    unit: 'Quintal',
    expectedPrice: '',
    location: 'Pune Mandi',
    farmer: 'Rajesh Patil',
    phone: '9823456789',
    harvestDate: new Date().toISOString().split('T')[0],
    quality: 'Good',
    description: ''
  });

  // Sync status state
  const [syncStatusData, setSyncStatusData] = useState({
    lastSuccess: '11 Aug 2026 18:30',
    status: 'Connected',
    totalMarkets: 36,
    totalCommodities: 12,
    failedSyncs: 0
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const checkSyncStatus = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/market-prices/sync-status');
        const data = await res.json();
        if (data.success && data.syncStatus) {
          setSyncStatusData(data.syncStatus);
        }
      } catch (e) {
        console.error('Failed to fetch sync status:', e);
      }
    };
    checkSyncStatus();
  }, []);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showInfoRequestModal, setShowInfoRequestModal] = useState(false);
  const [infoRequestText, setInfoRequestText] = useState('');
  
  // Notification Broadcast Console state
  const [broadcastTarget, setBroadcastTarget] = useState('ALL');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState('system');

  // Market Price manual inputs
  const [newPriceCrop, setNewPriceCrop] = useState('Tomato');
  const [newPriceMarket, setNewPriceMarket] = useState('Pune Mandi');
  const [newPriceMin, setNewPriceMin] = useState('');
  const [newPriceMax, setNewPriceMax] = useState('');
  const [newPriceModal, setNewPriceModal] = useState('');

  // Pre-configured 36 districts data array
  const districtsList = [
    { name: 'Pune', code: 'PN', farmers: 1250, buyers: 320, transporters: 185, listings: 4500, orders: 180, active: 12, topCrop: 'Sugarcane' },
    { name: 'Nashik', code: 'NS', farmers: 950, buyers: 280, transporters: 140, listings: 3800, orders: 150, active: 10, topCrop: 'Onion' },
    { name: 'Nagpur', code: 'NG', farmers: 850, buyers: 230, transporters: 110, listings: 3200, orders: 130, active: 8, topCrop: 'Orange' },
    { name: 'Latur', code: 'LT', farmers: 780, buyers: 190, transporters: 95, listings: 2800, orders: 110, active: 6, topCrop: 'Soybean' },
    { name: 'Ahmednagar', code: 'AN', farmers: 690, buyers: 160, transporters: 80, listings: 2400, orders: 90, active: 5, topCrop: 'Sugarcane' },
    { name: 'Kolhapur', code: 'KH', farmers: 650, buyers: 150, transporters: 75, listings: 2200, orders: 85, active: 4, topCrop: 'Sugarcane' },
    { name: 'Solapur', code: 'SL', farmers: 580, buyers: 140, transporters: 70, listings: 1900, orders: 75, active: 4, topCrop: 'Pomegranate' },
    { name: 'Sangli', code: 'SN', farmers: 540, buyers: 120, transporters: 65, listings: 1800, orders: 70, active: 3, topCrop: 'Grapes' },
    { name: 'Satara', code: 'ST', farmers: 510, buyers: 110, transporters: 60, listings: 1700, orders: 65, active: 3, topCrop: 'Sugarcane' },
    { name: 'Jalgaon', code: 'JL', farmers: 480, buyers: 100, transporters: 55, listings: 1600, orders: 60, active: 2, topCrop: 'Banana' }
  ];

  // 1. Mock Database representing the realistic Maharashtra startup metrics
  const mockFarmers = [
    { id: 'f_1', name: 'Ramesh Patil', phone: '9823456789', district: 'Pune', taluka: 'Baramati', village: 'Malegaon', mainCrop: 'Tomato', farmSize: '5.5 Acres', status: 'Active', verification: 'VERIFIED' },
    { id: 'f_2', name: 'Sanjay Deshmukh', phone: '9823456781', district: 'Nashik', taluka: 'Niphad', village: 'Pimpalgaon', mainCrop: 'Onion', farmSize: '10.0 Acres', status: 'Active', verification: 'VERIFIED' },
    { id: 'f_3', name: 'Maruti Kadam', phone: '9823456782', district: 'Latur', taluka: 'Latur', village: 'Ausa', mainCrop: 'Soybean', farmSize: '12.5 Acres', status: 'Active', verification: 'VERIFIED' },
    { id: 'f_4', name: 'Vitthal Pawar', phone: '9823456783', district: 'Nagpur', taluka: 'Katol', village: 'Katol', mainCrop: 'Orange', farmSize: '8.2 Hectare', status: 'Pending', verification: 'PENDING' },
    { id: 'f_5', name: 'Eknath Shinde', phone: '9823456784', district: 'Ahmednagar', taluka: 'Rahuri', village: 'Rahuri', mainCrop: 'Sugarcane', farmSize: '4.0 Hectare', status: 'Suspended', verification: 'REJECTED' }
  ];

  const mockBuyers = [
    { id: 'b_1', name: 'ABC Foods', owner: 'Amit Sharma', type: 'FOOD_PROCESSOR', district: 'Pune', ordersCount: 45, verification: 'VERIFIED', status: 'Active' },
    { id: 'b_2', name: 'Vashi Wholesale APMC', owner: 'Vijay Kadam', type: 'WHOLESALER', district: 'Thane', ordersCount: 120, verification: 'VERIFIED', status: 'Active' },
    { id: 'b_3', name: 'Nashik Juice Exporters', owner: 'Nitin Gadkari', type: 'EXPORTER', district: 'Nashik', ordersCount: 30, verification: 'VERIFIED', status: 'Active' },
    { id: 'b_4', name: 'Latur Mills Oil Corp', owner: 'Devendra F.', type: 'FOOD_PROCESSOR', district: 'Latur', ordersCount: 15, verification: 'PENDING', status: 'Pending' },
    { id: 'b_5', name: 'Star Hotel Sourcing Corp', owner: 'Ratan Tata', type: 'HOTEL', district: 'Mumbai City', ordersCount: 65, verification: 'VERIFIED', status: 'Active' }
  ];

  const mockTransporters = [
    { id: 't_1', name: 'Rajesh Patil Transports', vehicle: 'PICKUP', number: 'MH-12-AB-1234', capacity: '1.5 Ton', district: 'Pune', trips: 150, rating: 4.8, verification: 'VERIFIED', status: 'Active' },
    { id: 't_2', name: 'Satnam Singh Logi', vehicle: 'TRUCK', number: 'MH-15-CD-5678', capacity: '8.0 Ton', district: 'Nashik', trips: 340, rating: 4.9, verification: 'VERIFIED', status: 'Active' },
    { id: 't_3', name: 'Kisan Rath Cargo', vehicle: 'TEMPO', number: 'MH-14-XY-9012', capacity: '3.0 Ton', district: 'Pune', trips: 80, rating: 4.5, verification: 'PENDING', status: 'Pending' },
    { id: 't_4', name: 'Sahyadri Agri Transports', vehicle: 'MINI_TRUCK', number: 'MH-24-QR-3456', capacity: '2.0 Ton', district: 'Latur', trips: 45, rating: 4.2, verification: 'VERIFIED', status: 'Active' },
    { id: 't_5', name: 'Maharashtra Agri Logistic Ltd', vehicle: 'TRUCK', number: 'MH-09-JK-7890', capacity: '10.0 Ton', district: 'Ahmednagar', trips: 620, rating: 4.9, verification: 'VERIFIED', status: 'Active' }
  ];

  const mockRegistrations = [
    { id: 'REG-001', name: 'Balasaheb Vikhe', role: 'FARMER', district: 'Ahmednagar', date: '11 Aug', docsCount: '3/3', status: 'Pending' },
    { id: 'REG-002', name: 'Sahyadri Agro Processing', role: 'BUYER', district: 'Pune', date: '11 Aug', docsCount: '4/4', status: 'Pending' },
    { id: 'REG-003', name: 'Ghatge Patil Transports', role: 'TRANSPORTER', district: 'Kolhapur', date: '10 Aug', docsCount: '5/5', status: 'Pending' },
    { id: 'REG-004', name: 'Dnyaneshwar Shinde', role: 'FARMER', district: 'Solapur', date: '09 Aug', docsCount: '3/3', status: 'Under Review' }
  ];

  const mockDisputes = [
    { id: 'DSP-1024', orderId: 'AGR1024', raiser: 'ABC Foods (Buyer)', against: 'Ramesh Patil (Farmer)', reason: 'Quality discrepancy', desc: 'Buyer claims Tomato size and moisture grade does not match the parameters verified in quality inspection.', status: 'OPEN', date: '11 Aug' },
    { id: 'DSP-1023', orderId: 'AGR1019', raiser: 'Sanjay Deshmukh (Farmer)', against: 'Rajesh Patil Transports', reason: 'Transit delay damage', desc: 'Farmer claims logistics delay of 36 hours caused spoilage of 2 Tons of Onions.', status: 'UNDER_REVIEW', date: '08 Aug' }
  ];

  const mockPredictions = [
    { crop: 'Tomato', district: 'Pune', current: 2800, predicted: 3050, date: '18 Aug', confidence: '82%', version: 'v1.2' },
    { crop: 'Onion', district: 'Nashik', current: 2400, predicted: 2250, date: '19 Aug', confidence: '88%', version: 'v1.2' },
    { crop: 'Soybean', district: 'Latur', current: 4600, predicted: 4850, date: '21 Aug', confidence: '75%', version: 'v1.1' },
    { crop: 'Orange', district: 'Nagpur', current: 4800, predicted: 5100, date: '20 Aug', confidence: '80%', version: 'v1.2' }
  ];

  const mockAuditLogs = [
    { id: 'AUD-901', admin: 'admin@agrinova.in', action: 'Approved Farmer Registration', entity: 'REG-001', date: '11 Aug 2026 19:30', ip: '192.168.1.45' },
    { id: 'AUD-902', admin: 'admin@agrinova.in', action: 'Modified Crop Listing expected price', entity: 'crop_12', date: '11 Aug 2026 18:15', ip: '192.168.1.45' },
    { id: 'AUD-903', admin: 'admin@agrinova.in', action: 'Updated System Settings (Platform Fees)', entity: 'platform_fee', date: '10 Aug 2026 14:02', ip: '192.168.1.100' },
    { id: 'AUD-904', admin: 'admin@agrinova.in', action: 'Initiated Dispute Investigation', entity: 'DSP-1024', date: '11 Aug 2026 19:45', ip: '192.168.1.45' }
  ];

  const [localRequests, setLocalRequests] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('agrinova-registrations');
    if (saved) {
      setLocalRequests(JSON.parse(saved));
    } else {
      setLocalRequests([]);
    }
  }, []);

  const approvedFarmersFromReg = localRequests.filter(r => r.role === 'FARMER' && r.status === 'Approved').map(r => ({
    id: r.id,
    name: r.name,
    phone: r.phone || '9823456789',
    district: r.district || 'Pune',
    taluka: 'Baramati',
    village: 'Malegaon',
    mainCrop: 'Tomato',
    farmSize: '5.0 Acres',
    status: 'Active',
    verification: 'VERIFIED'
  }));

  const approvedBuyersFromReg = localRequests.filter(r => r.role === 'BUYER' && r.status === 'Approved').map(r => ({
    id: r.id,
    name: r.name,
    owner: r.name,
    type: 'WHOLESALER',
    district: r.district || 'Pune',
    ordersCount: 0,
    verification: 'VERIFIED',
    status: 'Active'
  }));

  const approvedTransportersFromReg = localRequests.filter(r => r.role === 'TRANSPORTER' && r.status === 'Approved').map(r => ({
    id: r.id,
    name: r.name,
    vehicle: r.vehicleType || 'TRUCK',
    number: r.vehicleNumber || 'MH-12-QW-4567',
    capacity: '2.5 Ton',
    district: r.district || 'Pune',
    trips: 0,
    rating: 5.0,
    verification: 'VERIFIED',
    status: 'Active'
  }));

  // Dynamic filter sets - strictly live
  const activeFarmers = approvedFarmersFromReg;
  const activeBuyers = approvedBuyersFromReg;
  const activeTransporters = approvedTransportersFromReg;
  const activeRequests = localRequests.filter(r => r.status === 'Pending' || r.status === 'Under Review');
  const activeDisputesList = [];
  const activeAuditLogsList = [];

  // Search logic
  const filteredFarmers = activeFarmers.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.district.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredBuyers = activeBuyers.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.district.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredTransporters = activeTransporters.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic crops list for Crop Listings view
  const allCrops = crops.filter(c => {
    const matchesSearch = !searchQuery || 
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.farmer?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = cropCategoryFilter === 'All' || c.category?.toLowerCase() === cropCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Dynamic orders list for Orders History view
  const allOrders = orders.filter(o => 
    !searchQuery || 
    o.id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.cropName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.farmerName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.buyerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.transporterName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats Card values
  const countFarmers = crops.map(c => c.farmer).filter((v, i, a) => a.indexOf(v) === i).length;
  const countBuyers = orders.map(o => o.buyerName).filter((v, i, a) => a.indexOf(v) === i).length;
  const countTransporters = orders.map(o => o.transporterName).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).length;
  const countOrders = orders.length;

  const countGmv = `₹${orders.reduce((s, o) => s + (o.buyerTotal || o.finalAmount || 0), 0).toLocaleString('en-IN')}`;
  const countDeliveries = orders.filter(o => o.status === 'In Transit').length;
  const countPendingRegistrations = activeRequests.length;
  const countOpenDisputes = activeDisputesList.length;

  // Chart configurations mapping
  const analyticsChartData = [
    { name: 'Wk 1', volume: orders.length },
    { name: 'Wk 2', volume: orders.length * 1.2 },
    { name: 'Wk 3', volume: orders.length * 1.5 },
    { name: 'Wk 4', volume: orders.length * 2 }
  ];

  const pieChartData = [
    { name: 'Farmers', value: countFarmers, color: '#2E7D32' },
    { name: 'Buyers', value: countBuyers, color: '#1976D2' },
    { name: 'Transporters', value: countTransporters, color: '#F9A825' }
  ];

  return (
    <div className="min-h-screen bg-[#F7FAF5] dark:bg-slate-900 flex flex-col lg:flex-row transition-colors duration-200">
      
      {/* ==========================================
          ADMIN SIDEBAR & DRAWER SWITCH
          ========================================== */}
      
      {/* Desktop Sidebar (visible lg+) */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white shrink-0 border-r border-slate-800 h-screen sticky top-0 overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <div>
              <h2 className="font-black text-sm tracking-widest text-primary-400">SA GROUP</h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">Control Panel</span>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {[
            { id: 'stats', label: '📊 Dashboard', icon: 'stats' },
            { id: 'farmers', label: '👨‍🌾 Farmers List', icon: 'farmers' },
            { id: 'buyers', label: '🛒 Buyers List', icon: 'buyers' },
            { id: 'transporters', label: '🚚 Transporters', icon: 'transporters' },
            { id: 'registrations', label: '🔔 Registrations', badge: countPendingRegistrations },
            { id: 'crops', label: '🌾 Crop Listings', icon: 'crops' },
            { id: 'orders', label: '📦 Orders History', icon: 'orders' },
            { id: 'tracking', label: '🗺️ Live GPS Route', icon: 'tracking' },
            { id: 'quality', label: '✅ Quality Audits', icon: 'quality' },
            { id: 'prices', label: '📈 Mandi Bhav Price', icon: 'prices' },
            { id: 'ai', label: '🤖 AI Projections', icon: 'ai' },
            { id: 'payments', label: '💰 Escrow Payments', icon: 'payments' },
            { id: 'disputes', label: '⚠️ Dispute Resolution', badge: countOpenDisputes },
            { id: 'audit', label: '📜 System Audit Logs', icon: 'audit' },
            { id: 'settings', label: '⚙️ Settings', icon: 'settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex justify-between items-center ${
                activeTab === item.id 
                  ? 'bg-primary-600 text-white shadow' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {item.badge ? (
                <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => onNavigate('landing')}
            className="w-full py-2.5 border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <LogOut size={13} />
            <span>Return to App</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Toggle Button (visible <lg) */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex justify-between items-center relative z-40">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <span className="font-extrabold text-xs tracking-widest text-primary-400">SA GROUP ADMIN</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 hover:bg-slate-800 rounded-xl"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Search size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-950/80 z-30 flex justify-start animate-fade-in">
          <div className="bg-slate-900 text-white w-64 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <h2 className="font-black text-sm tracking-widest text-primary-400">ADMIN CONTROL</h2>
              <nav className="space-y-2">
                {[
                  { id: 'stats', label: '📊 Dashboard' },
                  { id: 'farmers', label: '👨‍🌾 Farmers List' },
                  { id: 'buyers', label: '🛒 Buyers List' },
                  { id: 'transporters', label: '🚚 Transporters' },
                  { id: 'registrations', label: '🔔 Registrations' },
                  { id: 'crops', label: '🌾 Crop Listings' },
                  { id: 'orders', label: '📦 Orders History' },
                  { id: 'tracking', label: '🗺️ Live GPS Route' },
                  { id: 'quality', label: '✅ Quality Audits' },
                  { id: 'prices', label: '📈 Mandi Bhav' },
                  { id: 'ai', label: '🤖 AI Projections' },
                  { id: 'payments', label: '💰 Escrow Ledger' },
                  { id: 'disputes', label: '⚠️ Disputes Desk' },
                  { id: 'audit', label: '📜 Audit Logs' },
                  { id: 'settings', label: '⚙️ Settings' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition ${
                      activeTab === item.id ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            <button
              onClick={() => onNavigate('landing')}
              className="w-full py-2.5 border border-slate-700 text-slate-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <LogOut size={13} />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          ADMIN CONTENT AREA & HEADER
          ========================================== */}
      <div className="flex-grow flex flex-col min-h-0">
        
        {/* Top Header bar */}
        <header className="bg-white dark:bg-slate-850 px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-200/60 dark:border-slate-800 shadow-sm relative z-20">
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
              Admin / {activeTab.toUpperCase()}
            </div>
            <h2 className="text-base font-black text-slate-800 dark:text-white capitalize mt-0.5">
              Platform {activeTab} Console
            </h2>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Search Input bar */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Global filter search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 font-bold dark:text-white"
              />
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/50">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-[10px] font-black rounded-lg transition ${
                  lang === 'en' ? 'bg-white dark:bg-slate-700 text-slate-800 shadow' : 'text-slate-500'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 text-[10px] font-black rounded-lg transition ${
                  lang === 'hi' ? 'bg-white dark:bg-slate-700 text-slate-800 shadow' : 'text-slate-500'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLang('mr')}
                className={`px-2 py-1 text-[10px] font-black rounded-lg transition ${
                  lang === 'mr' ? 'bg-white dark:bg-slate-700 text-slate-800 shadow' : 'text-slate-500'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* Notifications Alert Hub */}
            <div className="relative">
              <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full relative text-slate-500">
                <Bell size={16} />
              </button>
            </div>

            {/* Admin Profile indicator */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                AD
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-black block text-slate-850 dark:text-white">Admin Desk</span>
                <span className="text-[9px] text-slate-400 font-bold block">admin@agrinova.in</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">

          {/* ==========================================
              VIEW: DASHBOARD STATS OVERVIEW
              ========================================== */}
          {activeTab === 'stats' && (
            <div className="space-y-6 animate-fade-in">
              {/* Alert Ribbon Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'disputes', label: `${countOpenDisputes} Open Disputes`, color: 'bg-red-500 text-white', icon: '🔴' },
                  { id: 'registrations', label: `${countPendingRegistrations} Registrations`, color: 'bg-amber-500 text-white', icon: '🟡' },
                  { id: 'quality', label: '12 Quality Audits', color: 'bg-blue-500 text-white', icon: '🔵' },
                  { id: 'payments', label: '245 Successful Payouts', color: 'bg-emerald-600 text-white', icon: '🟢' }
                ].map((alertItem) => (
                  <button
                    key={alertItem.id}
                    onClick={() => setActiveTab(alertItem.id)}
                    className={`${alertItem.color} p-3 rounded-2xl text-[10px] font-black tracking-wide uppercase flex items-center justify-center gap-2 hover:scale-[1.02] transition shadow-sm`}
                  >
                    <span>{alertItem.icon}</span>
                    <span>{alertItem.label}</span>
                  </button>
                ))}
              </div>

              {/* Four summary cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { id: 'farmers', label: 'Total Farmers / कुल किसान', val: countFarmers.toLocaleString(), icon: '👨‍🌾', color: 'text-primary-700 bg-primary-50' },
                  { id: 'buyers', label: 'Total Buyers / कुल खरीदार', val: countBuyers.toLocaleString(), icon: '🛒', color: 'text-blue-700 bg-blue-50' },
                  { id: 'transporters', label: 'Transporters / कुल ड्राइवर', val: countTransporters.toLocaleString(), icon: '🚚', color: 'text-amber-700 bg-amber-50' },
                  { id: 'orders', label: 'Active Orders / सक्रिय ऑर्डर', val: countOrders.toLocaleString(), icon: '📦', color: 'text-purple-700 bg-purple-50' }
                ].map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setActiveTab(card.id)}
                    className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow transition text-left"
                  >
                    <div className={`${card.color} p-4 rounded-2xl text-xl`}>{card.icon}</div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">{card.label}</span>
                      <span className="text-2xl font-black text-slate-850 dark:text-white block mt-1">{card.val}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Additional Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold block">Platform GMV</span>
                  <span className="text-xl font-black text-slate-800 dark:text-white mt-1.5 block">{countGmv}</span>
                  <span className="text-[10px] text-primary-650 font-bold block mt-1">₹ Platform fee: 2% of total transaction value</span>
                </div>

                <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold block">In Transit Shipments</span>
                  <span className="text-xl font-black text-slate-800 dark:text-white mt-1.5 block">{countDeliveries} Shipments</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Trackable via live transporter coordinate feeds</span>
                </div>

                <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold block">Registrations Pending</span>
                  <span className="text-xl font-black text-slate-800 dark:text-white mt-1.5 block">{countPendingRegistrations} Applicants</span>
                  <span className="text-[10px] text-amber-600 font-bold block mt-1">Requires documents KYC validations</span>
                </div>

                <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold block">Escrow Dispute Claims</span>
                  <span className="text-xl font-black text-red-600 mt-1.5 block">{countOpenDisputes} Disputes Open</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Quality discrepancy disputes resolved by Admin</span>
                </div>
              </div>

              {/* Analytics graph row */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-6">Weekly Platform Transaction Volumes</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="volume" stroke="#2E7D32" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Active User Demographics</h3>
                  <div className="h-44 w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-350">
                    {pieChartData.map((cell) => (
                      <div key={cell.name} className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cell.color }} />
                          {cell.name}
                        </span>
                        <span>{cell.value} Users</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              VIEW: REGISTRATIONS MANAGEMENT
              ========================================== */}
          {activeTab === 'registrations' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center flex-wrap gap-4 bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Transporter & User Registrations requests</h3>
                  <p className="text-xs text-slate-400 mt-1">Review validation documents (Aadhaar, PAN, DL, RC) for applicant accounts verification.</p>
                </div>
                <span className="bg-amber-50 text-amber-700 font-extrabold text-xs px-3 py-1 rounded-full animate-pulse border border-amber-100">
                  🔔 {activeRequests.length} Pending
                </span>
              </div>

              {/* Verification List table */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/40">
                        <th className="p-4">Applicant</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">District</th>
                        <th className="p-4">Submitted Date</th>
                        <th className="p-4">Documents verified</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {activeRequests.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-16 text-slate-400 font-bold">
                            No pending registrations found.
                          </td>
                        </tr>
                      ) : (
                        activeRequests.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="p-4 font-black text-slate-800 dark:text-white">{app.name}</td>
                            <td className="p-4">
                              <span className="bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-650 dark:text-slate-300 font-bold uppercase">
                                {app.role}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-slate-550">{app.district}</td>
                            <td className="p-4 text-slate-400 font-bold">{app.date}</td>
                            <td className="p-4 font-bold text-slate-600">{app.docsCount} Verified</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                                app.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => setSelectedApplicant(app)}
                                className="py-1 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition text-[10px]"
                              >
                                Review Request
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Applicant Review Modal */}
              {selectedApplicant && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                  <div className="bg-white dark:bg-slate-850 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-880 dark:text-white">Review Profile KYC</h3>
                        <p className="text-[10px] text-slate-400 mt-1">Reviewing verification docs for {selectedApplicant.name}</p>
                      </div>
                      <button onClick={() => setSelectedApplicant(null)} className="text-slate-400 hover:text-slate-600">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
                      {/* Personal Info details */}
                      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl space-y-2 border border-slate-100 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-350">
                        <p>Role: <span className="font-extrabold text-slate-800 dark:text-white">{selectedApplicant.role}</span></p>
                        <p>District: <span className="font-extrabold text-slate-800 dark:text-white">{selectedApplicant.district}</span></p>
                        <p>Taluka: <span className="font-extrabold text-slate-800 dark:text-white">Baramati</span></p>
                        <p>Village/City: <span className="font-extrabold text-slate-800 dark:text-white">Malegaon</span></p>
                        <p>Mobile: <span className="font-extrabold text-slate-800 dark:text-white">9823456789</span></p>
                      </div>

                      {/* Documents Checklist verification */}
                      <div className="space-y-3">
                        <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Uploaded Documents Checks</h4>
                        {[
                          { id: 'id', name: 'Identity Document (Aadhaar Card)', status: 'VERIFIED' },
                          { id: 'business', name: 'PAN / Business Document', status: 'PENDING' },
                          { id: 'vehicle', name: 'Vehicle Permit / License', status: 'VERIFIED' }
                        ].map((doc) => (
                          <div key={doc.id} className="flex justify-between items-center p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-850 shadow-sm">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{doc.name}</span>
                            <div className="flex gap-2 items-center">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                                doc.status === 'VERIFIED' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {doc.status}
                              </span>
                              <button
                                type="button"
                                onClick={() => alert(`Simulating file view overlay for ${doc.name}`)}
                                className="py-1 px-2 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50"
                              >
                                View File
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Triggers */}
                      <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            const updated = localRequests.map(r => r.id === selectedApplicant.id ? { ...r, status: 'Approved' } : r);
                            localStorage.setItem('agrinova-registrations', JSON.stringify(updated));
                            setLocalRequests(updated);
                            alert(`Applicant ${selectedApplicant.name} registration approved successfully!`);
                            setSelectedApplicant(null);
                          }}
                          className="flex-grow py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition text-xs shadow-sm flex items-center justify-center gap-1.5"
                        >
                          <Check size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => setShowRejectionModal(true)}
                          className="py-3 px-4 bg-red-650 hover:bg-red-700 text-white rounded-2xl font-bold transition text-xs flex items-center justify-center gap-1.5"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => setShowInfoRequestModal(true)}
                          className="py-3 px-4 border border-slate-200 text-slate-600 rounded-2xl font-bold transition text-xs hover:bg-slate-50"
                        >
                          Request Info
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Reason Modal */}
              {showRejectionModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                  <div className="bg-white dark:bg-slate-850 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl relative">
                    <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">Reason for Rejection</h3>
                    <textarea
                      placeholder="Enter specific reasons (e.g. Document copy is blurred, invalid driving license number)..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                      rows="3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setShowRejectionModal(false)} className="flex-1 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold">
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (!rejectionReason.trim()) { alert('Please enter rejection notes'); return; }
                          const updated = localRequests.map(r => r.id === selectedApplicant.id ? { ...r, status: 'Rejected' } : r);
                          localStorage.setItem('agrinova-registrations', JSON.stringify(updated));
                          setLocalRequests(updated);
                          alert('Rejection processed and applicant notified.');
                          setShowRejectionModal(false);
                          setSelectedApplicant(null);
                        }}
                        className="flex-grow py-2 bg-red-650 hover:bg-red-750 text-white rounded-xl text-xs font-bold"
                      >
                        Submit Rejection
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Request More Information Modal */}
              {showInfoRequestModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                  <div className="bg-white dark:bg-slate-850 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl relative">
                    <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">Request More Information</h3>
                    <textarea
                      placeholder="e.g. Please upload a clearer copy of your PAN card."
                      value={infoRequestText}
                      onChange={(e) => setInfoRequestText(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                      rows="3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setShowInfoRequestModal(false)} className="flex-1 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold">
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (!infoRequestText.trim()) { alert('Please enter request instructions'); return; }
                          const updated = localRequests.map(r => r.id === selectedApplicant.id ? { ...r, status: 'Under Review' } : r);
                          localStorage.setItem('agrinova-registrations', JSON.stringify(updated));
                          setLocalRequests(updated);
                          alert('Information request ticket dispatched.');
                          setShowInfoRequestModal(false);
                          setSelectedApplicant(null);
                        }}
                        className="flex-grow py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold"
                      >
                        Send Request
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              VIEW: FARMER MANAGEMENT
              ========================================== */}
          {activeTab === 'farmers' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center flex-wrap gap-4 bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Farmer Directory / किसान निर्देशिका</h3>
                  <p className="text-xs text-slate-400 mt-1">Monitor farm sizes, crops listed, and accounts verification status.</p>
                </div>
                <div className="flex gap-3 text-xs font-bold">
                  <span className="px-3 py-1 bg-slate-50 border border-slate-150 rounded-xl">Farmers: {filteredFarmers.length}</span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-xl">Verified: {filteredFarmers.filter(f=>f.verification === 'VERIFIED').length}</span>
                </div>
              </div>

              {/* Farmers Table */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/40">
                        <th className="p-4">Name</th>
                        <th className="p-4">Mobile</th>
                        <th className="p-4">District</th>
                        <th className="p-4">Main Crop</th>
                        <th className="p-4">Farm Size</th>
                        <th className="p-4">Verification</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {filteredFarmers.map((farmer) => (
                        <tr key={farmer.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-4 font-black text-slate-800 dark:text-white">{farmer.name}</td>
                          <td className="p-4 font-semibold text-slate-500">{farmer.phone}</td>
                          <td className="p-4 font-semibold text-slate-600">{farmer.district}</td>
                          <td className="p-4 font-extrabold text-primary-650">{farmer.mainCrop}</td>
                          <td className="p-4 font-bold text-slate-700">{farmer.farmSize}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                              farmer.verification === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {farmer.verification}
                            </span>
                          </td>
                          <td className="p-4 text-center flex justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedFarmer(farmer)}
                              className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-[10px] text-slate-650"
                            >
                              View
                            </button>
                            <button
                              onClick={() => alert(`Suspending farmer ${farmer.name} profile...`)}
                              className="py-1 px-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold text-[10px]"
                            >
                              Suspend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Farmer Profile overlay drawer */}
              {selectedFarmer && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
                  <div className="bg-white dark:bg-slate-850 w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative animate-slide-left p-6 overflow-y-auto">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">👨‍🌾</span>
                          <div>
                            <h3 className="font-extrabold text-base text-slate-850 dark:text-white">{selectedFarmer.name}</h3>
                            <span className="text-[10px] text-slate-400 font-bold block">Verified Farmer Portfolio</span>
                          </div>
                        </div>
                        <button onClick={() => setSelectedFarmer(null)} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-400">
                          <X size={20} />
                        </button>
                      </div>

                      <div className="text-xs space-y-4">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Personal Information</span>
                          <div className="mt-2 space-y-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-350">
                            <p>Mobile: <span className="font-extrabold text-slate-850 dark:text-white">{selectedFarmer.phone}</span></p>
                            <p>Email: <span className="font-extrabold text-slate-850 dark:text-white">{selectedFarmer.name.toLowerCase().replace(' ', '')}@gmail.com</span></p>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Farm details</span>
                          <div className="mt-2 space-y-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-350">
                            <p>District: <span className="font-extrabold text-slate-850 dark:text-white">{selectedFarmer.district}</span></p>
                            <p>Taluka: <span className="font-extrabold text-slate-850 dark:text-white">{selectedFarmer.taluka}</span></p>
                            <p>Village: <span className="font-extrabold text-slate-850 dark:text-white">{selectedFarmer.village}</span></p>
                            <p>Farm Size: <span className="font-extrabold text-slate-850 dark:text-white">{selectedFarmer.farmSize}</span></p>
                            <p>Primary Crop: <span className="font-extrabold text-primary-650">{selectedFarmer.mainCrop}</span></p>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Ratings & Trades</span>
                          <div className="mt-2 space-y-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-350">
                            <p>User Rating: <span className="font-bold text-slate-850 dark:text-white">⭐ 4.8 / 5.0 (24 reviews)</span></p>
                            <p>Active Listings: <span className="font-bold text-slate-850 dark:text-white">2 Crop Listings</span></p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex gap-2">
                      <button
                        onClick={() => { alert('Account verification approved.'); setSelectedFarmer(null); }}
                        className="flex-grow py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        Approve verification
                      </button>
                      <button
                        onClick={() => setSelectedFarmer(null)}
                        className="py-3 px-4 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              VIEW: BUYERS MANAGEMENT
              ========================================== */}
          {activeTab === 'buyers' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center flex-wrap gap-4 bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Buyers Directory / खरीदार सूची</h3>
                  <p className="text-xs text-slate-400 mt-1">Review commercial profiles, business categories, and order counts.</p>
                </div>
              </div>

              {/* Buyers table list */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/40">
                        <th className="p-4">Business Name</th>
                        <th className="p-4">Owner</th>
                        <th className="p-4">Business Type</th>
                        <th className="p-4">District</th>
                        <th className="p-4">Orders Completed</th>
                        <th className="p-4">Verification</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {filteredBuyers.map((buyer) => (
                        <tr key={buyer.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-4 font-black text-slate-800 dark:text-white">{buyer.name}</td>
                          <td className="p-4 font-semibold text-slate-500">{buyer.owner}</td>
                          <td className="p-4 font-bold text-slate-500">{buyer.type}</td>
                          <td className="p-4 font-semibold text-slate-650">{buyer.district}</td>
                          <td className="p-4 font-bold text-slate-800">{buyer.ordersCount} Trades</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                              buyer.verification === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {buyer.verification}
                            </span>
                          </td>
                          <td className="p-4 text-center flex justify-center gap-1.5">
                            <button
                              onClick={() => alert(`Reviewing documents for business ${buyer.name}`)}
                              className="py-1 px-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                            >
                              Review Docs
                            </button>
                            <button
                              onClick={() => alert(`Suspending buyer ${buyer.name}...`)}
                              className="py-1 px-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold"
                            >
                              Suspend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              VIEW: TRANSPORTERS MANAGEMENT
              ========================================== */}
          {activeTab === 'transporters' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center flex-wrap gap-4 bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Transporter Registry / वाहन चालक</h3>
                  <p className="text-xs text-slate-400 mt-1">Review vehicle models, license credentials, trip history, and safety ratings.</p>
                </div>
              </div>

              {/* Transporters table list */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/40">
                        <th className="p-4">Carrier Name</th>
                        <th className="p-4">Vehicle Model</th>
                        <th className="p-4">Plate Number</th>
                        <th className="p-4">Capacity</th>
                        <th className="p-4">District</th>
                        <th className="p-4">Completed Trips</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4">Verification</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {filteredTransporters.map((trans) => (
                        <tr key={trans.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-4 font-black text-slate-800 dark:text-white">{trans.name}</td>
                          <td className="p-4 font-semibold text-slate-500">{trans.vehicle}</td>
                          <td className="p-4 font-bold text-slate-700">{trans.number}</td>
                          <td className="p-4 font-semibold text-slate-500">{trans.capacity}</td>
                          <td className="p-4 text-slate-500 font-bold">{trans.district}</td>
                          <td className="p-4 font-bold text-slate-800">{trans.trips}</td>
                          <td className="p-4 font-extrabold text-amber-600">⭐ {trans.rating}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                              trans.verification === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {trans.verification}
                            </span>
                          </td>
                          <td className="p-4 text-center flex justify-center gap-1.5">
                            <button
                              onClick={() => alert(`Reviewing license MH-12-2026-0012 for ${trans.name}`)}
                              className="py-1 px-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => alert(`Suspending driving credentials for ${trans.name}`)}
                              className="py-1 px-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold"
                            >
                              Suspend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              VIEW: CROP LISTINGS MANAGEMENT
              ========================================== */}
          {/* ==========================================
              VIEW: CROP LISTINGS MANAGEMENT
              ========================================== */}
          {activeTab === 'crops' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌾</span>
                    <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Active Crop Listings Database / फसल सूची</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Review active farmer harvests posted for open marketplace discovery.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAddCropModalOpen(true)}
                    className="py-2.5 px-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black transition shadow flex items-center gap-1.5"
                  >
                    <Plus size={15} />
                    <span>+ Create Crop Listing / नई फसल जोड़ें</span>
                  </button>
                </div>
              </div>

              {/* Summary Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Total Listed Crops</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">{crops.length} Items</span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Active in Marketplace</span>
                </div>
                <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Total Volume</span>
                  <span className="text-2xl font-black text-primary-600 mt-1 block">
                    {crops.reduce((acc, c) => acc + (Number(c.quantity) || 0), 0).toLocaleString('en-IN')} Quintals
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Ready for procurement</span>
                </div>
                <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Active Farmers</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">
                    {Array.from(new Set(crops.map(c => c.farmer))).length} Farmers
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Across Maharashtra</span>
                </div>
                <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Categories</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">
                    {Array.from(new Set(crops.map(c => c.category))).length} Categories
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Vegetables, Grains, Cash Crops</span>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['All', 'Vegetables', 'Grains', 'Oilseeds', 'Cash Crops', 'Fruits', 'Spices'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCropCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition shrink-0 ${
                      cropCategoryFilter === cat
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Crop list table */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/40">
                        <th className="p-4">Crop Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Farmer</th>
                        <th className="p-4">District Mandi Location</th>
                        <th className="p-4">Available Quantity</th>
                        <th className="p-4">Expected Price</th>
                        <th className="p-4">Harvest Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-semibold">
                      {allCrops.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center py-16 text-slate-400 font-bold">
                            No crop listings matching your filter. Click "+ Create Crop Listing" to add one.
                          </td>
                        </tr>
                      ) : (
                        allCrops.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="p-4 font-black text-slate-800 dark:text-white flex items-center gap-2">
                              {c.imageUrl && (
                                <img src={c.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                              )}
                              <span>{c.name}</span>
                            </td>
                            <td className="p-4">
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">
                                {c.category || 'Produce'}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-slate-600 dark:text-slate-300">{c.farmer}</td>
                            <td className="p-4 text-slate-550 font-bold">{c.location}</td>
                            <td className="p-4 font-bold text-slate-800 dark:text-white">{c.quantity} {c.unit}</td>
                            <td className="p-4 font-extrabold text-primary-600">₹{c.expectedPrice} / {c.unit}</td>
                            <td className="p-4 text-slate-400 font-bold">{c.harvestDate}</td>
                            <td className="p-4">
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-black text-[10px] uppercase">
                                AVAILABLE
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setSelectedCropForView(c)}
                                  className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-bold text-[10px]"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remove listing for ${c.name} (Farmer: ${c.farmer})?`)) {
                                      if (onDeleteCrop) {
                                        onDeleteCrop(c.id);
                                      }
                                    }
                                  }}
                                  className="py-1 px-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold text-[10px]"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* View Crop Detail Modal */}
              {selectedCropForView && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                  <div className="bg-white dark:bg-slate-850 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-880 dark:text-white">Crop Listing Details</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Listing ID: {selectedCropForView.id}</p>
                      </div>
                      <button onClick={() => setSelectedCropForView(null)} className="text-slate-400 hover:text-slate-600">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="p-6 space-y-4 text-xs font-semibold">
                      {selectedCropForView.imageUrl && (
                        <img src={selectedCropForView.imageUrl} alt="" className="w-full h-40 object-cover rounded-2xl" />
                      )}
                      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl space-y-2 border border-slate-100 dark:border-slate-800">
                        <p>Crop: <span className="font-black text-slate-850 dark:text-white">{selectedCropForView.name}</span> ({selectedCropForView.category})</p>
                        <p>Farmer: <span className="font-black text-slate-850 dark:text-white">{selectedCropForView.farmer}</span></p>
                        <p>Mobile: <span className="font-black text-slate-850 dark:text-white">{selectedCropForView.phone || '9823456789'}</span></p>
                        <p>Mandi Location: <span className="font-black text-slate-850 dark:text-white">{selectedCropForView.location}</span></p>
                        <p>Available Stock: <span className="font-black text-slate-850 dark:text-white">{selectedCropForView.quantity} {selectedCropForView.unit}</span></p>
                        <p>Expected Price: <span className="font-black text-primary-600">₹{selectedCropForView.expectedPrice} / {selectedCropForView.unit}</span></p>
                        <p>Harvest Date: <span className="font-black text-slate-850 dark:text-white">{selectedCropForView.harvestDate}</span></p>
                        <p>Quality Grade: <span className="font-black text-emerald-600">{selectedCropForView.quality || 'Good'}</span></p>
                        {selectedCropForView.description && (
                          <p className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-500">
                            {selectedCropForView.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => setSelectedCropForView(null)}
                          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition"
                        >
                          Close Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add New Crop Listing Modal */}
              {isAddCropModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                  <div className="bg-white dark:bg-slate-850 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-880 dark:text-white">Create New Crop Listing</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Post harvest listing directly to open marketplace</p>
                      </div>
                      <button onClick={() => setIsAddCropModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={18} />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!adminCropForm.name || !adminCropForm.quantity || !adminCropForm.expectedPrice) {
                          alert('Please enter Crop Name, Quantity, and Expected Price');
                          return;
                        }

                        const newCrop = {
                          id: 'crop_admin_' + Math.floor(100 + Math.random() * 900),
                          name: adminCropForm.name,
                          category: adminCropForm.category,
                          quantity: parseFloat(adminCropForm.quantity),
                          unit: adminCropForm.unit,
                          expectedPrice: parseFloat(adminCropForm.expectedPrice),
                          location: adminCropForm.location,
                          harvestDate: adminCropForm.harvestDate,
                          quality: adminCropForm.quality,
                          farmer: adminCropForm.farmer,
                          phone: adminCropForm.phone,
                          imageUrl: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c808b?auto=format&fit=crop&w=600&q=80',
                          description: adminCropForm.description || `Fresh ${adminCropForm.name} listed from ${adminCropForm.location}.`
                        };

                        if (onAddCrop) {
                          onAddCrop(newCrop);
                        }

                        alert(`Crop listing for ${newCrop.name} (${newCrop.quantity} ${newCrop.unit}) created successfully!`);
                        setIsAddCropModalOpen(false);
                        setAdminCropForm({
                          name: 'Tomato',
                          category: 'Vegetables',
                          quantity: '',
                          unit: 'Quintal',
                          expectedPrice: '',
                          location: 'Pune Mandi',
                          farmer: 'Rajesh Patil',
                          phone: '9823456789',
                          harvestDate: new Date().toISOString().split('T')[0],
                          quality: 'Good',
                          description: ''
                        });
                      }}
                      className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Crop Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Tomato, Onion, Soybean"
                            value={adminCropForm.name}
                            onChange={(e) => setAdminCropForm({ ...adminCropForm, name: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Category</label>
                          <select
                            value={adminCropForm.category}
                            onChange={(e) => setAdminCropForm({ ...adminCropForm, category: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                          >
                            <option value="Vegetables">Vegetables</option>
                            <option value="Grains">Grains</option>
                            <option value="Oilseeds">Oilseeds</option>
                            <option value="Cash Crops">Cash Crops</option>
                            <option value="Fruits">Fruits</option>
                            <option value="Spices">Spices</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Quantity</label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="e.g. 50"
                            value={adminCropForm.quantity}
                            onChange={(e) => setAdminCropForm({ ...adminCropForm, quantity: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Unit</label>
                          <select
                            value={adminCropForm.unit}
                            onChange={(e) => setAdminCropForm({ ...adminCropForm, unit: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                          >
                            <option value="Quintal">Quintal</option>
                            <option value="Ton">Ton</option>
                            <option value="Kg">Kg</option>
                            <option value="Crates">Crates</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Expected Price (₹)</label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="e.g. 2800"
                            value={adminCropForm.expectedPrice}
                            onChange={(e) => setAdminCropForm({ ...adminCropForm, expectedPrice: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Location / APMC Mandi</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Pune Mandi, Nashik"
                            value={adminCropForm.location}
                            onChange={(e) => setAdminCropForm({ ...adminCropForm, location: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Farmer Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rajesh Patil"
                            value={adminCropForm.farmer}
                            onChange={(e) => setAdminCropForm({ ...adminCropForm, farmer: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Farmer Phone</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 9823456789"
                            value={adminCropForm.phone}
                            onChange={(e) => setAdminCropForm({ ...adminCropForm, phone: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Harvest Date</label>
                          <input
                            type="date"
                            value={adminCropForm.harvestDate}
                            onChange={(e) => setAdminCropForm({ ...adminCropForm, harvestDate: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Quality Grade</label>
                          <select
                            value={adminCropForm.quality}
                            onChange={(e) => setAdminCropForm({ ...adminCropForm, quality: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                          >
                            <option value="Good">Good (उत्तम)</option>
                            <option value="Average">Average (मध्यम)</option>
                            <option value="Premium">Premium (उत्कृष्ट)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold mb-1">Description / Notes</label>
                        <textarea
                          placeholder="e.g. Fresh farm-picked produce, sorted and ready for transit."
                          value={adminCropForm.description}
                          onChange={(e) => setAdminCropForm({ ...adminCropForm, description: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium dark:text-white"
                          rows="2"
                        />
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddCropModalOpen(false)}
                          className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-xl shadow-md transition"
                        >
                          Save & Publish Listing
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              VIEW: ORDERS MANAGEMENT & STATUS HISTORY
              ========================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">System Orders ledger / ऑर्डर</h3>
                <p className="text-xs text-slate-400 mt-1">Monitor dispatch status, payments transaction values, and quality assurance check indicators.</p>
              </div>

              {/* Orders table list */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/40">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Farmer</th>
                        <th className="p-4">Buyer</th>
                        <th className="p-4">Transporter</th>
                        <th className="p-4">Crop</th>
                        <th className="p-4">Payload</th>
                        <th className="p-4">Escrow Value</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {allOrders.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center py-16 text-slate-400 font-bold">
                            No orders found on the platform.
                          </td>
                        </tr>
                      ) : (
                        allOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="p-4 font-black text-slate-650">#{ord.id}</td>
                            <td className="p-4 font-semibold text-slate-500">{ord.farmerName}</td>
                            <td className="p-4 font-semibold text-slate-500">{ord.buyerName}</td>
                            <td className="p-4 font-bold text-slate-700">{ord.transporterName || 'Unassigned'}</td>
                            <td className="p-4 font-bold text-primary-650">{ord.cropName}</td>
                            <td className="p-4 font-bold text-slate-800">{ord.quantity} {ord.unit}</td>
                            <td className="p-4 font-extrabold text-slate-900 dark:text-white">₹{ord.buyerTotal.toLocaleString('en-IN')}</td>
                            <td className="p-4">
                              <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-black text-[10px] uppercase">
                                {ord.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="py-1 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold"
                              >
                                View Flow
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Flow Details Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                  <div className="bg-white dark:bg-slate-850 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Order Dispatch Tracking Flow</h3>
                        <p className="text-[10px] text-slate-400 mt-1">Transaction flow status mapping for Order #{selectedOrder.id}</p>
                      </div>
                      <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-650">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="p-6 space-y-6 text-xs font-semibold">
                      {/* Interactive Flow progression representation */}
                      <div className="flex justify-between items-center relative py-2">
                        <div className="absolute left-0 right-0 h-0.5 bg-slate-200 top-1/2 -translate-y-1/2 z-0" />
                        {[
                          { id: '1', name: 'Farmer Listed', active: true },
                          { id: '2', name: 'Buyer Secured', active: true },
                          { id: '3', name: 'Carrier Match', active: !!selectedOrder.transporterId },
                          { id: '4', name: 'Quality verified', active: !!selectedOrder.qualityReport },
                          { id: '5', name: 'Escrow Paid', active: selectedOrder.status === 'Completed' }
                        ].map((step, idx) => (
                          <div key={idx} className="relative z-10 flex flex-col items-center gap-1 bg-[#F7FAF5] dark:bg-slate-900 px-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black ${
                              step.active ? 'bg-primary-600 text-white' : 'bg-slate-250 text-slate-400 border border-slate-200'
                            }`}>
                              {step.id}
                            </span>
                            <span className="text-[8px] uppercase tracking-wide font-black text-slate-500">{step.name}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                        <p>Crop Details: <span className="font-bold text-slate-850 dark:text-white">{selectedOrder.cropName} ({selectedOrder.quantity} {selectedOrder.unit})</span></p>
                        <p>Freight Charges: <span className="font-bold text-primary-650">₹{selectedOrder.transportCost}</span></p>
                        <p>Platform service fee (2%): <span className="font-bold text-slate-850 dark:text-white">₹{selectedOrder.platformFee}</span></p>
                        <p>Escrow payout: <span className="font-bold text-slate-850 dark:text-white">₹{selectedOrder.buyerTotal}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              VIEW: LIVE DELIVERY TRACKING (MAPS)
              ========================================== */}
          {activeTab === 'tracking' && (
            <div className="space-y-6 animate-fade-in h-[70vh] flex flex-col min-h-0">
              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Platform Live Deliveries Map / लाइव ट्रैकिंग</h3>
                  <p className="text-xs text-slate-400 mt-1">Geographic overview of active transporters routes across Maharashtra APMC zones.</p>
                </div>
                <span className="bg-primary-50 text-primary-700 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase">
                  96 Deliveries In-transit
                </span>
              </div>

              {/* Geotrack map split viewport */}
              <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                <div className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 rounded-3xl overflow-hidden relative min-h-[300px]">
                  {/* Fallback Vector SVG Map of Maharashtra */}
                  <div className="absolute top-4 right-4 z-10 bg-amber-500 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                    Admin Geotrack Overlays
                  </div>
                  
                  <div className="w-full h-full flex items-center justify-center p-6">
                    <svg className="w-full max-w-lg h-64" viewBox="0 0 500 400">
                      <path d="M 50 150 L 150 50 L 320 70 L 450 150 L 400 320 L 220 350 L 120 280 Z" fill="none" stroke="#cbd5e1" strokeWidth="6" />
                      {/* Active delivery markers */}
                      <g className="cursor-pointer">
                        <circle cx="150" cy="110" r="10" fill="#10b981" fillOpacity="0.4" />
                        <circle cx="150" cy="110" r="4" fill="#10b981" />
                        <text x="150" y="128" fontSize="8" fontWeight="extrabold" fill="#047857" textAnchor="middle">Truck MH-12 (Tomato)</text>
                      </g>
                      <g className="cursor-pointer">
                        <circle cx="180" cy="220" r="10" fill="#ef4444" fillOpacity="0.4" />
                        <circle cx="180" cy="220" r="4" fill="#ef4444" />
                        <text x="180" y="238" fontSize="8" fontWeight="extrabold" fill="#b91c1c" textAnchor="middle">Truck MH-15 (Onion)</text>
                      </g>
                    </svg>
                  </div>
                </div>

                <div className="w-full lg:w-80 bg-white dark:bg-slate-850 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 space-y-4 overflow-y-auto shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Active Carrier Feeds</span>
                  {[
                    { id: 'AGR1024', name: 'Rajesh Patil', vehicle: 'MH-12-AB-1234', cargo: 'Tomato', eta: '35 mins', status: 'In Transit' },
                    { id: 'AGR1019', name: 'Satnam Singh', vehicle: 'MH-15-CD-5678', cargo: 'Onion', eta: '1.2 hrs', status: 'In Transit' }
                  ].map((delivery, idx) => (
                    <div key={idx} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-800 dark:text-white">#{delivery.id}</span>
                        <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded text-[8px] font-black uppercase">{delivery.status}</span>
                      </div>
                      <div className="text-[10px] text-slate-550 space-y-0.5 font-bold">
                        <p>Transporter: {delivery.name}</p>
                        <p>Plate: {delivery.vehicle}</p>
                        <p>Cargo: {delivery.cargo}</p>
                        <p>ETA: {delivery.eta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              VIEW: MANDI PRICE MANAGEMENT (AGMARKNET SYNC PANEL)
              ========================================== */}
          {activeTab === 'prices' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏛️</span>
                    <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                      AGMARKNET Market Price Synchronization Panel
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage official automated and on-demand synchronization runs for Maharashtra APMC Mandis.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    disabled={isSyncing}
                    onClick={async () => {
                      setIsSyncing(true);
                      if (onSyncPrices) {
                        const res = await onSyncPrices();
                        if (res?.syncStatus) setSyncStatusData(res.syncStatus);
                      }
                      setTimeout(() => setIsSyncing(false), 1200);
                    }}
                    className={`py-2.5 px-5 rounded-2xl text-xs font-extrabold transition shadow flex items-center gap-2 ${
                      isSyncing
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    <span>{isSyncing ? '⏳ Syncing Data...' : '🔄 Sync AGMARKNET Now'}</span>
                  </button>
                </div>
              </div>

              {/* Sync Status Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Sync Status</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${syncStatusData.status === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-sm font-extrabold text-slate-800 dark:text-white">
                      {syncStatusData.status === 'Connected' ? '🟢 Connected' : '🔴 Sync Failed'}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Total Markets</span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-white block mt-1">
                    {syncStatusData.totalMarkets || 36} APMCs
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Total Commodities</span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-white block mt-1">
                    {syncStatusData.totalCommodities || 12} Produce
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Last Sync Time</span>
                  <span className="text-xs font-extrabold text-primary-600 block mt-2 truncate">
                    {syncStatusData.lastSuccess || '11 Aug 2026 18:30'}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Failed Syncs</span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-white block mt-1">
                    {syncStatusData.failedSyncs || 0}
                  </span>
                </div>
              </div>

              {/* Price logs table */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-2">
                  <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">
                    Synchronized Mandi Bhav Records ({marketPrices.length} Active Feeds)
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold">
                    Official Source: AGMARKNET
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/40">
                        <th className="p-4">Commodity</th>
                        <th className="p-4">Market / Mandi</th>
                        <th className="p-4">District</th>
                        <th className="p-4">Min Price</th>
                        <th className="p-4">Max Price</th>
                        <th className="p-4 text-emerald-600 font-extrabold">Modal Price</th>
                        <th className="p-4">Arrival Qty</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Source</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-semibold">
                      {marketPrices.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="p-12 text-center text-slate-400 font-bold">
                            No market price logs currently loaded. Click "Sync AGMARKNET Now" to fetch live data.
                          </td>
                        </tr>
                      ) : (
                        marketPrices.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="p-4 font-black text-slate-800 dark:text-white">
                              {item.commodity} <span className="text-[10px] text-slate-400 font-normal block">{item.variety || 'Local'}</span>
                            </td>
                            <td className="p-4 text-slate-700 dark:text-slate-300 font-bold">{item.market_name}</td>
                            <td className="p-4 text-slate-500">{item.district_name || item.state}</td>
                            <td className="p-4 font-bold text-slate-700">₹{item.minimum_price}/Qtl</td>
                            <td className="p-4 font-bold text-slate-700">₹{item.maximum_price}/Qtl</td>
                            <td className="p-4 font-extrabold text-emerald-600">₹{item.modal_price}/Qtl</td>
                            <td className="p-4 text-slate-600">{item.arrival_quantity} {item.unit || 'Qtl'}</td>
                            <td className="p-4 text-slate-400 font-bold">{item.arrival_date}</td>
                            <td className="p-4 text-slate-500 font-mono font-bold text-[10px]">{item.source || 'AGMARKNET'}</td>
                            <td className="p-4">
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                🟢 Live Feed
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              VIEW: AI MARKET INTELLIGENCE predictions
              ========================================== */}
          {activeTab === 'ai' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-2xl flex items-start gap-3">
                <Info size={18} className="shrink-0 mt-0.5 text-blue-600" />
                <div className="text-xs">
                  <span className="font-extrabold block">Machine Learning Predictions Endpoint</span>
                  <p className="font-medium leading-relaxed mt-0.5">This index connects to future Python/FastAPI ML services. Actual price forecast trends will be computed dynamically from AGMARKNET logs.</p>
                </div>
              </div>

              {/* Predictions Table */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/40">
                        <th className="p-4">Crop</th>
                        <th className="p-4">District</th>
                        <th className="p-4">Current Price</th>
                        <th className="p-4">Predicted Price</th>
                        <th className="p-4">Forecast Date</th>
                        <th className="p-4">Confidence score</th>
                        <th className="p-4">Model Version</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {mockPredictions.map((pred, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-4 font-black text-slate-800 dark:text-white">{pred.crop}</td>
                          <td className="p-4 font-semibold text-slate-550">{pred.district}</td>
                          <td className="p-4 font-bold text-slate-700">₹{pred.current}/Qtl</td>
                          <td className="p-4 font-extrabold text-primary-650">₹{pred.predicted}/Qtl</td>
                          <td className="p-4 text-slate-400 font-bold">{pred.date}</td>
                          <td className="p-4 font-bold text-green-600">{pred.confidence}</td>
                          <td className="p-4 font-mono font-bold text-slate-400">{pred.version}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              VIEW: PAYMENTS LEDGER
              ========================================== */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Platform Escrow Ledger / भुगतान</h3>
                <p className="text-xs text-slate-400 mt-1">Review payouts release states. Credit card numbers or CVV codes are never stored inside platform databases.</p>
              </div>

              {/* Payments table list */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/40">
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Payer (Buyer)</th>
                        <th className="p-4">Receiver (Farmer)</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {[
                        { txId: 'TXN-908234509', ordId: 'AGR1024', payer: 'ABC Foods', payee: 'Ramesh Patil', amount: 15800, method: 'UPI Pay', status: 'Success', date: '11 Aug' },
                        { txId: 'TXN-908234508', ordId: 'AGR1019', payer: 'Vashi APMC', payee: 'Sanjay Deshmukh', amount: 8250, method: 'NetBanking', status: 'Success', date: '10 Aug' }
                      ].map((txn, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-4 font-mono font-bold text-slate-600">{txn.txId}</td>
                          <td className="p-4 font-bold text-slate-800 dark:text-white">#{txn.ordId}</td>
                          <td className="p-4 font-semibold text-slate-500">{txn.payer}</td>
                          <td className="p-4 font-semibold text-slate-500">{txn.payee}</td>
                          <td className="p-4 font-black text-slate-900 dark:text-white">₹{txn.amount.toLocaleString('en-IN')}</td>
                          <td className="p-4 font-semibold text-slate-400">{txn.method}</td>
                          <td className="p-4">
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-black text-[9px] uppercase">
                              {txn.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400 font-bold">{txn.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              VIEW: DISPUTES RESOLUTION DESK
              ========================================== */}
          {activeTab === 'disputes' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Escrow Dispute Claims Desk / विवाद</h3>
                <p className="text-xs text-slate-400 mt-1">Investigate buyer/farmer claims, review digital quality audit reports, and release locked escrow funds.</p>
              </div>

              {/* Disputes table list */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/40">
                        <th className="p-4">Dispute ID</th>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Raised By</th>
                        <th className="p-4">Against</th>
                        <th className="p-4">Issue Claim</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Submitted Date</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {activeDisputesList.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center py-16 text-slate-400 font-bold">
                            No disputes active.
                          </td>
                        </tr>
                      ) : (
                        activeDisputesList.map((dsp) => (
                          <tr key={dsp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="p-4 font-mono font-bold text-red-600">{dsp.id}</td>
                            <td className="p-4 font-bold text-slate-850 dark:text-white">#{dsp.orderId}</td>
                            <td className="p-4 font-semibold text-slate-500">{dsp.raiser}</td>
                            <td className="p-4 font-semibold text-slate-500">{dsp.against}</td>
                            <td className="p-4 font-bold text-slate-700">{dsp.reason}</td>
                            <td className="p-4">
                              <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded font-black text-[9px]">
                                {dsp.status}
                              </span>
                            </td>
                            <td className="p-4 text-slate-400 font-bold">{dsp.date}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => { setSelectedDispute(dsp); setResolutionNotes(''); }}
                                className="py-1 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
                              >
                                Investigate
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dispute Resolution Modal */}
              {selectedDispute && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                  <div className="bg-white dark:bg-slate-850 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Investigate Dispute {selectedDispute.id}</h3>
                        <p className="text-[10px] text-slate-400 mt-1">Reviewing transaction claims parameters</p>
                      </div>
                      <button onClick={() => setSelectedDispute(null)} className="text-slate-400 hover:text-slate-650">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="p-6 space-y-4 text-xs font-semibold">
                      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                        <p>Raiser: <span className="font-bold text-slate-850 dark:text-white">{selectedDispute.raiser}</span></p>
                        <p>Against: <span className="font-bold text-slate-850 dark:text-white">{selectedDispute.against}</span></p>
                        <p>Details: <span className="font-bold text-slate-800 dark:text-slate-350 leading-relaxed block mt-1">{selectedDispute.desc}</span></p>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Resolution Verdict Notes / निर्णय</label>
                        <textarea
                          placeholder="Enter final resolution outcome notes (e.g. Escrow payment released to farmer after quality proof check)..."
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 text-xs font-semibold"
                          rows="3"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!resolutionNotes.trim()) { alert('Please enter resolution notes'); return; }
                            alert('Verdict logged. Dispute resolved successfully.');
                            setSelectedDispute(null);
                          }}
                          className="flex-grow py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition"
                        >
                          Resolve & Payout
                        </button>
                        <button
                          onClick={() => setSelectedDispute(null)}
                          className="py-3 px-4 border border-slate-200 text-slate-500 rounded-xl font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              VIEW: NOTIFICATIONS BROADCAST CONSOLE
              ========================================== */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in max-w-lg">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Admin Notifications Console / अधिसूचना</h3>
                <p className="text-xs text-slate-400 mt-1">Broadcast alert notifications to farmers, buyers, or transporters based on districts.</p>
              </div>

              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Target Audience</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="ALL">All Users / सभी सदस्य</option>
                    <option value="FARMER">Farmers Only / केवल किसान</option>
                    <option value="BUYER">Buyers Only / केवल खरीदार</option>
                    <option value="TRANSPORTER">Transporters Only / केवल वाहन चालक</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Notification Title</label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="e.g. Pune Mandi Tomato Price Alert"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Message Description</label>
                  <textarea
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Enter alert text description details..."
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
                    rows="3"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!broadcastTitle || !broadcastMessage) { alert('Please enter title and message description'); return; }
                    alert('Admin broadcast notification dispatched to target group!');
                    setBroadcastTitle('');
                    setBroadcastMessage('');
                  }}
                  className="py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  Dispatch Broadcast / संदेश भेजें
                </button>
              </div>
            </div>
          )}

          {/* ==========================================
              VIEW: SYSTEM SETTINGS
              ========================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in max-w-lg">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Admin System Settings / सेटिंग्स</h3>
                <p className="text-xs text-slate-400 mt-1">Configure global application variables. API Keys and JWT secrets are hidden securely.</p>
              </div>

              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Platform Name</label>
                  <input type="text" defaultValue="SA Group 🌱" className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Support Email</label>
                  <input type="email" defaultValue="support@sagroup.in" className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Escrow Platform commission fee (%)</label>
                  <input type="number" defaultValue="2" className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold" />
                </div>

                <button
                  onClick={() => alert('System parameters saved successfully!')}
                  className="py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition"
                >
                  Save settings
                </button>
              </div>
            </div>
          )}

          {/* ==========================================
              VIEW: SYSTEM AUDIT LOGS
              ========================================== */}
          {activeTab === 'audit' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">System Audit Logs / ऑडिट लॉग</h3>
                <p className="text-xs text-slate-400 mt-1">Immutable ledger logging all administrative operations, KYC approvals, and dispute resolutions.</p>
              </div>

              {/* Audit logs table list */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/40">
                        <th className="p-4">Log ID</th>
                        <th className="p-4">Admin Account</th>
                        <th className="p-4">Action Event</th>
                        <th className="p-4">Target Entity ID</th>
                        <th className="p-4">IP Address</th>
                        <th className="p-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {activeAuditLogsList.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-4 font-mono font-bold text-slate-450">{log.id}</td>
                          <td className="p-4 font-semibold text-slate-650">{log.admin}</td>
                          <td className="p-4 font-bold text-slate-850 dark:text-white">{log.action}</td>
                          <td className="p-4 font-mono text-slate-500 font-bold">{log.entity}</td>
                          <td className="p-4 font-mono text-slate-400">{log.ip}</td>
                          <td className="p-4 text-slate-400 font-bold">{log.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
