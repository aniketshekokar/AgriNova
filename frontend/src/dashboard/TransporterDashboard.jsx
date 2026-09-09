import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Truck, Sprout, MapPin, Phone, Navigation, ShieldCheck, 
  CheckCircle2, Clock, AlertTriangle, ChevronRight, X, ArrowRight, 
  Camera, FileText, User, Bell, Star, TrendingUp, RefreshCw, 
  Check, Award, Eye, Calendar, Sparkles, MessageSquare, AlertCircle, 
  CreditCard, Fuel, Layers, DollarSign, Plus
} from 'lucide-react';

export default function TransporterDashboard({ orders = [], onCompleteOrder, onNavigate }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  // Navigation tab: home, jobs, active, tracking, history, earnings, ratings, profile
  const [activeTab, setActiveTab] = useState('home');

  // Transporter profile
  const driverName = user?.name || user?.username || 'Satnam Singh';
  const vehicleNumber = user?.vehicleNumber || 'MH-12-AB-1234';
  const vehicleType = user?.vehicleType || 'Pickup (Bolero Maxi)';

  // 0-Baseline Rule: Initialized with 0 data for brand new website launch
  const [availableJobs, setAvailableJobs] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [earningsHistory, setEarningsHistory] = useState([]);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Filters for available jobs
  const [filterCrop, setFilterCrop] = useState('All');
  const [filterDistrict, setFilterDistrict] = useState('All');

  // Quality Inspection Form State at Farm
  const [inspectQty, setInspectQty] = useState('');
  const [inspectGrade, setInspectGrade] = useState('EXCELLENT');
  const [inspectPackaging, setInspectPackaging] = useState('Crates Intact');
  const [inspectRemarks, setInspectRemarks] = useState('');

  // Delivery Proof of Delivery (POD) Form
  const [receiverNameInput, setReceiverNameInput] = useState('');

  // Problem Incident Report Modal State
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [problemType, setProblemType] = useState('TRAFFIC_JAM');
  const [problemDesc, setProblemDesc] = useState('');
  const [problemSubmitted, setProblemSubmitted] = useState(false);

  // Action: Accept Job
  const handleAcceptJob = (job) => {
    setActiveDelivery({
      ...job,
      expectedQty: job.quantity,
      actualQty: job.quantity,
      distanceRemainingKm: job.distanceKm,
      currentSpeedKmH: 0,
      etaMinutes: Math.round((job.distanceKm / 45) * 60),
      status: 'ASSIGNED',
      qualityGrade: 'EXCELLENT',
      packagingCondition: 'Crates Intact',
      remarks: '',
      lastUpdated: 'Just now',
      receiverName: '',
      podSignature: false
    });
    setAvailableJobs(prev => prev.filter(j => j.id !== job.id));
    setActiveTab('active');
  };

  // Action: Progress Delivery State
  const updateDeliveryStatus = (nextStatus) => {
    if (!activeDelivery) return;
    setActiveDelivery(prev => ({
      ...prev,
      status: nextStatus,
      lastUpdated: 'Just now'
    }));

    if (nextStatus === 'COMPLETED') {
      const earnedAmount = activeDelivery.estimatedEarnings || 0;
      setEarningsHistory(prev => [
        {
          id: activeDelivery.orderId || 'AGR1024',
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          crop: activeDelivery.crop,
          distance: `${activeDelivery.distanceKm || 0} km`,
          amount: earnedAmount,
          status: 'Paid via Escrow'
        },
        ...prev
      ]);
      setDeliveryHistory(prev => [
        {
          id: 'DEL-' + Math.floor(100 + Math.random() * 900),
          orderId: activeDelivery.orderId,
          crop: activeDelivery.crop,
          origin: activeDelivery.pickupLocation,
          dest: activeDelivery.deliveryLocation,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          fare: earnedAmount,
          status: 'COMPLETED',
          rating: 5.0
        },
        ...prev
      ]);
      alert(`🎉 Delivery Completed! ₹${earnedAmount.toLocaleString('en-IN')} has been transferred to your registered bank account via Escrow.`);
      setActiveDelivery(null);
      setActiveTab('earnings');
    }
  };

  // Action: Submit Quality Check at Farm
  const handleCompleteQualityCheck = () => {
    if (!activeDelivery) return;
    setActiveDelivery(prev => ({
      ...prev,
      actualQty: inspectQty ? `${inspectQty} kg` : prev.expectedQty,
      qualityGrade: inspectGrade,
      packagingCondition: inspectPackaging,
      remarks: inspectRemarks,
      status: 'PICKED_UP',
      lastUpdated: 'Just now'
    }));
  };

  // Action: Submit Incident Report
  const handleSubmitProblem = () => {
    if (!problemDesc.trim()) {
      alert('Please enter a brief description of the issue.');
      return;
    }
    setProblemSubmitted(true);
    setTimeout(() => {
      setShowProblemModal(false);
      setProblemSubmitted(false);
      setProblemDesc('');
      alert('⚠️ Incident report sent to SA Group 24/7 Logistics Command Center.');
    }, 1200);
  };

  // Calculate dynamic totals from 0-baseline
  const totalEarningsAmount = earningsHistory.reduce((sum, item) => sum + (item.amount || 0), 0);
  const completedCount = deliveryHistory.length;

  return (
    <div className="min-h-screen bg-[#F7FAF5] dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col font-sans pb-20 sm:pb-8 transition-colors duration-200">
      
      {/* Top Transporter Header */}
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
                <Truck size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-slate-850 dark:text-white leading-none block">
                    AgriLogistics
                  </span>
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm">
                    DRIVER 🚚
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5 block">
                  {driverName} • {vehicleNumber}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 text-xs font-extrabold">
              {[
                { id: 'home', label: '🏠 Dashboard' },
                { id: 'jobs', label: '🚚 Available Jobs' },
                { id: 'active', label: '📦 Active Delivery' },
                { id: 'tracking', label: '🗺️ Live GPS Tracking' },
                { id: 'history', label: '📋 Delivery History' },
                { id: 'earnings', label: '💰 Earnings' },
                { id: 'ratings', label: '⭐ Ratings' },
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
                  {tab.id === 'jobs' && availableJobs.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-primary-600 text-white text-[9px] flex items-center justify-center font-black">
                      {availableJobs.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Online Driver Badge & Actions */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-[10px] font-black border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">ONLINE & DISPATCH READY</span>
                <span className="sm:hidden">ONLINE</span>
              </div>

              <button
                onClick={() => setShowProblemModal(true)}
                className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition"
                title="Report Delivery Issue"
              >
                <AlertTriangle size={18} />
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
      </div>

      {/* Main Workspace Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {/* ==========================================
            TAB 1: TRANSPORTER HOME DASHBOARD
            ========================================== */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Top Welcome & Driver Status Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-primary-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                      Verified Delivery Partner
                    </span>
                    <span className="text-xs text-slate-400 font-bold">• {vehicleType}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black">
                    Good morning, {driverName} 👋
                  </h1>
                  <p className="text-xs text-slate-300 font-medium max-w-xl leading-relaxed">
                    Welcome to AgriLogistics. Connect directly with verified farm harvests and APMC wholesale routes with instant Escrow trip payouts.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className="flex-1 sm:flex-none px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
                  >
                    <span>🚚 Find Delivery Jobs</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* 5 Core Metric Cards - ALL 0 BASELINE */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div 
                onClick={() => setActiveTab('jobs')}
                className="bg-white dark:bg-slate-850 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-amber-400 transition"
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Available Jobs</span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{availableJobs.length} Loads</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">Nearby Farms</span>
              </div>

              <div 
                onClick={() => setActiveTab('active')}
                className="bg-white dark:bg-slate-850 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-primary-400 transition"
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Delivery</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">{activeDelivery ? '1 In Transit' : '0 In Transit'}</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">{activeDelivery ? `Order #${activeDelivery.orderId}` : 'No active trip'}</span>
              </div>

              <div 
                onClick={() => setActiveTab('earnings')}
                className="bg-white dark:bg-slate-850 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-400 transition"
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Today's Earnings</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">₹{totalEarningsAmount.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">₹0 In Transit</span>
              </div>

              <div 
                onClick={() => setActiveTab('history')}
                className="bg-white dark:bg-slate-850 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-slate-400 transition"
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Completed Deliveries</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">{completedCount} Trips</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">100% On-Time</span>
              </div>

              <div 
                onClick={() => setActiveTab('ratings')}
                className="bg-white dark:bg-slate-850 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-amber-400 transition col-span-2 lg:col-span-1"
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Driver Rating</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-2xl font-black text-slate-850 dark:text-white">{completedCount > 0 ? '5.0' : '0.0'}</span>
                  <div className="flex text-amber-400 text-xs">
                    {completedCount > 0 ? '⭐⭐⭐⭐⭐' : '☆☆☆☆☆'}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">{completedCount} Reviews</span>
              </div>
            </div>

            {/* Active Delivery Snapshot Banner or Clean Empty State */}
            {activeDelivery ? (
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">
                      Current Active Consignment • Order #{activeDelivery.orderId}
                    </h3>
                    <span className="bg-emerald-50 text-emerald-700 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                      {activeDelivery.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('active')}
                    className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
                  >
                    <span>Open Active Workspace</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Cargo & Weight:</span>
                    <span className="font-extrabold text-slate-850 dark:text-white">{activeDelivery.crop} ({activeDelivery.actualQty})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Route Telemetry:</span>
                    <span className="font-extrabold text-slate-850 dark:text-white">{activeDelivery.pickupLocation} ➔ {activeDelivery.deliveryLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">ETA & Distance:</span>
                    <span className="font-extrabold text-primary-600">{activeDelivery.etaMinutes} mins ({activeDelivery.distanceRemainingKm} km left)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Trip Payment:</span>
                    <span className="font-black text-emerald-600 text-sm">₹{activeDelivery.estimatedEarnings?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-4xl block">🚚</span>
                <h4 className="font-black text-base text-slate-850 dark:text-white">No Active Delivery In Transit</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You are currently dispatch ready. When farmers or buyers float transport requests, they will appear in your Available Jobs feed.
                </p>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition shadow"
                >
                  Browse Available Delivery Jobs
                </button>
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            TAB 2: AVAILABLE DELIVERY JOBS (/transporter/jobs)
            ========================================== */}
        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  Available Delivery Jobs / उपलब्ध कृषि परिवहन
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connect direct farm harvests with wholesale buyers across Maharashtra APMC routes.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-white"
                >
                  <option value="All">All Districts</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                </select>

                <select
                  value={filterCrop}
                  onChange={(e) => setFilterCrop(e.target.value)}
                  className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-white"
                >
                  <option value="All">All Produce</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Onion">Onion</option>
                  <option value="Grapes">Grapes</option>
                </select>
              </div>
            </div>

            {/* Jobs List Grid or Clean Empty State */}
            {availableJobs.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-4xl block">📦</span>
                <h4 className="font-black text-base text-slate-850 dark:text-white">0 Transport Requests Available</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  There are currently 0 pending pickup orders in your area. New dispatch notifications will chime automatically when farmers or buyers post transport requests.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableJobs.map((job) => (
                  <div key={job.id} className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-slate-850 dark:text-white">{job.crop}</span>
                          <span className="bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                            Order #{job.orderId}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-semibold block mt-0.5">{job.quantity}</span>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-xl text-emerald-600">₹{job.estimatedEarnings?.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-slate-400 font-bold block">Escrow Protected</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptJob(job)}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition shadow flex items-center justify-center gap-1.5"
                    >
                      <span>Accept Delivery</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 3: ACTIVE DELIVERY WORKFLOW & STATE MACHINE
            ========================================== */}
        {activeTab === 'active' && (
          <div className="space-y-6 animate-fade-in">
            {activeDelivery ? (
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                    Active Consignment #{activeDelivery.orderId}
                  </h3>
                  <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                    {activeDelivery.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs space-y-2 font-semibold">
                  <p>📍 <strong>Pickup:</strong> {activeDelivery.pickupLocation}</p>
                  <p>🏢 <strong>Destination:</strong> {activeDelivery.deliveryLocation}</p>
                  <p>🌾 <strong>Produce:</strong> {activeDelivery.crop} ({activeDelivery.actualQty})</p>
                </div>

                {activeDelivery.status === 'ASSIGNED' && (
                  <button
                    onClick={() => updateDeliveryStatus('ARRIVED_AT_PICKUP')}
                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-sm font-black transition shadow flex items-center justify-center gap-2"
                  >
                    <MapPin size={16} />
                    <span>I Have Arrived at Farm Pickup Gate</span>
                  </button>
                )}

                {activeDelivery.status === 'ARRIVED_AT_PICKUP' && (
                  <button
                    onClick={handleCompleteQualityCheck}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black transition shadow flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    <span>Confirm Pickup & Sign Quality Report</span>
                  </button>
                )}

                {activeDelivery.status === 'PICKED_UP' && (
                  <button
                    onClick={() => updateDeliveryStatus('IN_TRANSIT')}
                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-sm font-black transition shadow flex items-center justify-center gap-2"
                  >
                    <Navigation size={16} />
                    <span>Start Delivery ➔ Live GPS Route</span>
                  </button>
                )}

                {activeDelivery.status === 'IN_TRANSIT' && (
                  <button
                    onClick={() => updateDeliveryStatus('ARRIVED_AT_DESTINATION')}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black transition shadow flex items-center justify-center gap-2"
                  >
                    <MapPin size={16} />
                    <span>I Have Arrived at Destination</span>
                  </button>
                )}

                {activeDelivery.status === 'ARRIVED_AT_DESTINATION' && (
                  <button
                    onClick={() => updateDeliveryStatus('COMPLETED')}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    <span>Confirm Delivery & Claim ₹{activeDelivery.estimatedEarnings}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-4xl block">🚚</span>
                <h4 className="font-black text-base text-slate-850 dark:text-white">No Active Delivery</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You do not have any delivery jobs assigned at this time.
                </p>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition shadow"
                >
                  Find Available Jobs
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 4: LIVE GPS ROUTE TRACKING
            ========================================== */}
        {activeTab === 'tracking' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  Live GPS Route & Highway Telemetry / जीपीएस रूट
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Active turn-by-turn route telemetry across Maharashtra APMC routes.
                </p>
              </div>
              <span className="text-xs font-extrabold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                Standby Mode
              </span>
            </div>

            <div className="p-12 text-center bg-slate-900 text-white rounded-3xl space-y-3">
              <span className="text-4xl block">🗺️</span>
              <h4 className="font-black text-base">GPS Tracking Standby</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Live GPS broadcasting activates automatically when you start an active delivery transit. No GPS telemetry is transmitted during idle standby.
              </p>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 5: DELIVERY HISTORY (/transporter/history)
            ========================================== */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                Trip History & Completed Manifests / यात्रा इतिहास
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Completed agricultural deliveries and signed proof-of-delivery receipts.
              </p>
            </div>

            {deliveryHistory.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-3xl block">📋</span>
                <h4 className="font-black text-sm text-slate-850 dark:text-white">0 Completed Trips Recorded</h4>
                <p className="text-xs text-slate-400">Completed deliveries and customer ratings will be archived here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deliveryHistory.map((trip) => (
                  <div key={trip.id} className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center text-xs">
                    <div>
                      <span className="font-black text-slate-850 dark:text-white block">{trip.crop} (#{trip.orderId})</span>
                      <span className="text-slate-400">{trip.origin} ➔ {trip.dest} • {trip.date}</span>
                    </div>
                    <span className="font-black text-emerald-600 text-sm">₹{trip.fare?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 6: EARNINGS & PAYOUTS (/transporter/earnings)
            ========================================== */}
        {activeTab === 'earnings' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  Earnings & Escrow Payouts / कमाई और भुगतान
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Instant escrow payout settlements released directly to your registered bank account.
                </p>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">
                💳 Bank Account Linked ✓
              </span>
            </div>

            {/* Earnings Cards - 0 BASELINE */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Today's Earnings</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">₹{totalEarningsAmount.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">0 Deliveries Completed</span>
              </div>

              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">This Week</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">₹0</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">0 Trips</span>
              </div>

              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">This Month</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white mt-1 block">₹0</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">0 Trips</span>
              </div>

              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">All Time Lifetime</span>
                <span className="text-2xl font-black text-primary-600 mt-1 block">₹0</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">0 Total Trips</span>
              </div>
            </div>

            {/* Statement Empty State */}
            {earningsHistory.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-3xl block">💰</span>
                <h4 className="font-black text-sm text-slate-850 dark:text-white">No Payout Records Yet</h4>
                <p className="text-xs text-slate-400">Your trip earnings and bank settlement receipts will appear here.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">Trip Statements</h4>
                <div className="space-y-2">
                  {earningsHistory.map((item) => (
                    <div key={item.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-850 dark:text-white">#{item.id} • {item.crop}</span>
                        <span className="text-[10px] text-slate-400 block">{item.date}</span>
                      </div>
                      <span className="font-black text-emerald-600 text-sm">+₹{item.amount?.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 7: RATINGS & REVIEWS (/transporter/ratings)
            ========================================== */}
        {activeTab === 'ratings' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                Driver Performance & Customer Reviews / रेटिंग
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ratings submitted by farmers and commercial buyers after delivery confirmation.
              </p>
            </div>

            <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-4xl block">⭐</span>
              <h4 className="font-black text-sm text-slate-850 dark:text-white">0 Reviews Recorded (New Driver Partner)</h4>
              <p className="text-xs text-slate-400">Complete your first delivery to earn 5-star customer ratings.</p>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 8: DRIVER PROFILE & VEHICLE RC
            ========================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">
                  Transporter Profile & Vehicle Compliance / प्रोफ़ाइल
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Active commercial vehicle documents and KYC verification credentials.
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                Approved Partner ✓
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3 text-xs font-semibold">
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">Driver Personal Details</h4>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Full Name:</span>
                  <span className="font-bold text-slate-850 dark:text-white">{driverName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Phone Number:</span>
                  <span className="font-bold text-slate-850 dark:text-white">+91 9822114477</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Driving License:</span>
                  <span className="font-bold text-slate-850 dark:text-white">MH12 20180012345 (Commercial)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Base District:</span>
                  <span className="font-bold text-slate-850 dark:text-white">Niphad, Nashik, Maharashtra</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3 text-xs font-semibold">
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">Vehicle Specifications</h4>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Vehicle Type:</span>
                  <span className="font-bold text-slate-850 dark:text-white">{vehicleType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Registration Number:</span>
                  <span className="font-black text-primary-600">{vehicleNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Payload Capacity:</span>
                  <span className="font-bold text-slate-850 dark:text-white">2.5 Ton (25 Quintal)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Insurance & Fitness:</span>
                  <span className="font-bold text-emerald-600">Valid till Dec 2027 ✓</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Problem Incident Modal */}
      {showProblemModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-100 dark:border-slate-800 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-red-100 text-red-600 rounded-xl">
                  <AlertTriangle size={18} />
                </span>
                <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">
                  Report Delivery Incident
                </h3>
              </div>
              <button onClick={() => setShowProblemModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Issue Category</label>
                <select
                  value={problemType}
                  onChange={(e) => setProblemType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                >
                  <option value="VEHICLE_BREAKDOWN">Vehicle Breakdown (Engine / Tyre Puncture)</option>
                  <option value="TRAFFIC_JAM">Severe Highway Traffic Delay</option>
                  <option value="WEATHER_DELAY">Heavy Rain / Landslide Route Block</option>
                  <option value="CROP_DAMAGE">Transit Produce Damage / Leakage</option>
                  <option value="WRONG_ADDRESS">Incorrect Farm or Drop Location</option>
                  <option value="OTHER">Other Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Incident Details</label>
                <textarea
                  rows="3"
                  placeholder="Describe the delay or breakdown situation..."
                  value={problemDesc}
                  onChange={(e) => setProblemDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowProblemModal(false)}
                className="py-2 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitProblem}
                className="py-2 px-5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition shadow"
              >
                {problemSubmitted ? 'Reporting...' : 'Broadcast Alert to Support'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile-First Sticky Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-850/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 py-2 px-3 z-40 shadow-lg">
        <div className="flex justify-around items-center">
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'jobs', label: 'Jobs', icon: '🚚', badge: availableJobs.length },
            { id: 'active', label: 'Active', icon: '📦' },
            { id: 'tracking', label: 'GPS', icon: '🗺️' },
            { id: 'earnings', label: 'Earnings', icon: '💰' },
            { id: 'profile', label: 'Profile', icon: '👤' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition relative ${
                activeTab === btn.id
                  ? 'text-amber-600 font-black scale-105'
                  : 'text-slate-500 dark:text-slate-400 font-bold'
              }`}
            >
              <span className="text-base">{btn.icon}</span>
              <span className="text-[10px]">{btn.label}</span>
              {btn.badge && btn.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary-600 text-white rounded-full text-[8px] flex items-center justify-center font-black">
                  {btn.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
