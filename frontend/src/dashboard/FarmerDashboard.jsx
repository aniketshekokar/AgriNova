import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { initialMarketPrices, aiAdvice, initialTransporters, maharashtraDistricts, maharashtraDistrictNames } from '../utils/mockData';
import { 
  Sprout, Plus, IndianRupee, TrendingUp, TrendingDown, HelpCircle, 
  MapPin, CheckCircle, Upload, Camera, ChevronRight, User, ShoppingBag, 
  Eye, Truck, BarChart2, Bell, Shield, Settings, LogOut, FileText, ChevronLeft
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../services/api';

export default function FarmerDashboard({ crops = [], onAddCrop, orders = [], marketPrices = [], onSyncPrices, onNavigate }) {
  const { t, lang, setLang } = useTranslation();
  const { user, logout } = useAuth();

  // Active Tab/Subpage internally within Farmer Portal
  const [currentTab, setCurrentTab] = useState('home');

  // Subpage states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderTabFilter, setOrderTabFilter] = useState('All');

  // Wizard state for listing new crop
  const [wizardStep, setWizardStep] = useState(1);
  const [cropName, setCropName] = useState('Tomato');
  const [category, setCategory] = useState('Vegetables');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Quintal');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [location, setLocation] = useState('Nashik Mandi');
  const [harvestDate, setHarvestDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [cropImages, setCropImages] = useState([]);

  // AI Advice tab selection
  const [aiCrop, setAiCrop] = useState('Tomato');

  // Profile edit state
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&h=150&q=80');
  const [profileName, setProfileName] = useState(user?.username || 'Ramesh Patil');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '9823456789');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'ramesh@agrinova.in');
  const [village, setVillage] = useState('Baramati');
  const [taluka, setTaluka] = useState('Baramati');
  const [district, setDistrict] = useState('Pune');
  const [farmSize, setFarmSize] = useState('2–5 Acres');
  const [showBankDetails, setShowBankDetails] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      title: 'Order Confirmed for Tomatoes 📦',
      body: 'ABC Foods confirmed purchase of 45 Quintals at ₹2,800/Q. Transport pickup assigned.',
      time: '10 mins ago',
      read: false
    },
    {
      id: 'notif_2',
      title: 'APMC Market Rate Alert 📈',
      body: 'Nashik Onion Mandi prices climbed +₹150/Quintal today.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 'notif_3',
      title: 'AI Price Advisory 🤖',
      body: 'Hold soybean harvest for 3 more days. Expected rate spike next week.',
      time: '1 day ago',
      read: true
    }
  ]);

  // Transport Form State
  const [pickupLoc, setPickupLoc] = useState('Baramati Farm');
  const [deliveryLoc, setDeliveryLoc] = useState('Mumbai Vashi APMC');
  const [transportCrop, setTransportCrop] = useState('Tomato');
  const [transportQty, setTransportQty] = useState('');
  const [transportDate, setTransportDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [transportTime, setTransportTime] = useState('10:00');
  const [transportRequests, setTransportRequests] = useState([]);

  // Quality Report Selected Modal
  const [selectedQualityReport, setSelectedQualityReport] = useState(null);

  // Market Prices Filter state
  const [marketDistrict, setMarketDistrict] = useState('All');
  const [marketCrop, setMarketCrop] = useState('All');
  const [historyData, setHistoryData] = useState([]);
  const [historyDays, setHistoryDays] = useState(7);
  const [marketSearchDate, setMarketSearchDate] = useState('');
  const [syncingPrices, setSyncingPrices] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');

  const handleManualSync = async () => {
    setSyncingPrices(true);
    setSyncSuccessMsg('');
    try {
      if (onSyncPrices) {
        const res = await onSyncPrices();
        if (res?.success) {
          setSyncSuccessMsg('AGMARKNET Mandi rates synchronized successfully! / मंडी भाव सफलतापूर्वक अपडेट किए गए!');
        }
      } else {
        const res = await api.post('/prices/sync');
        if (res.success) {
          setSyncSuccessMsg('AGMARKNET Mandi rates synchronized successfully!');
        }
      }
    } catch (e) {
      console.error('Failed to sync AGMARKNET:', e);
    } finally {
      setSyncingPrices(false);
      setTimeout(() => setSyncSuccessMsg(''), 4000);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const cropQuery = marketCrop === 'All' ? 'Tomato' : marketCrop;
        const res = await api.get(`/prices/history?commodity=${cropQuery}&days=${historyDays}`);
        if (res.success && res.data) {
          setHistoryData(res.data);
        } else if (res.history) {
          setHistoryData(res.history);
        }
      } catch (e) {
        console.error('Failed to load historical mandi data:', e);
      }
    };
    fetchHistory();
  }, [marketCrop, historyDays]);

  // Recharts earnings mock data
  const monthlyEarningsData = [
    { month: 'Mar', amount: 22000 },
    { month: 'Apr', amount: 35000 },
    { month: 'May', amount: 28000 },
    { month: 'Jun', amount: 48000 },
    { month: 'Jul', amount: 55000 },
    { month: 'Aug', amount: 62000 }
  ];

  // Farmer specific crops list filter (Added crops list)
  const farmerCrops = Array.isArray(crops) ? crops.filter(c => c && (c.farmer === profileName || c.farmer === 'Rajesh Patil' || c.id?.startsWith('crop_new') || c.id?.startsWith('crop_'))) : [];

  // Farmer orders list filter
  const farmerOrders = Array.isArray(orders) ? orders.filter(o => o && (o.farmerName === profileName || o.farmerName === 'Rajesh Patil')) : [];

  // Calculations
  const totalEarnings = farmerOrders.filter(o => o?.status === 'Completed').reduce((sum, o) => sum + (o?.finalAmount || 0), 0);
  const pendingPayments = farmerOrders.filter(o => o && o.status !== 'Completed' && o.status !== 'Cancelled').reduce((sum, o) => sum + (o?.finalAmount || 0), 0);

  // Add Crop wizard handlers
  const handleNextWizard = () => setWizardStep((prev) => Math.min(prev + 1, 8));
  const handleBackWizard = () => setWizardStep((prev) => Math.max(prev - 1, 1));

  const handleListCropSubmit = () => {
    if (!quantity || !expectedPrice) {
      alert('Please fill in quantity and expected price / कृपया मात्रा और अपेक्षित मूल्य प्रविष्ट करें।');
      return;
    }

    const newCrop = {
      id: 'crop_new_' + Math.floor(100 + Math.random() * 900),
      name: cropName,
      category,
      quantity: parseFloat(quantity),
      unit,
      expectedPrice: parseFloat(expectedPrice),
      location,
      harvestDate,
      quality: 'Good',
      farmer: profileName,
      phone: profilePhone,
      imageUrl: cropImages[0] || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c808b?auto=format&fit=crop&w=600&q=80',
      description: description || `Fresh ${cropName} listed directly from the farm in ${village}.`
    };

    onAddCrop(newCrop);
    setWizardStep(1);
    setQuantity('');
    setExpectedPrice('');
    setDescription('');
    setCropImages([]);
    setCurrentTab('my-crops');
    alert(t('farmer.list_success') + ' / ' + t('farmer.list_success_desc'));
  };

  const handleRemoveCrop = (cropId) => {
    if (confirm('Are you sure you want to remove this listing? / क्या आप वाकई इस सूची को हटाना चाहते हैं?')) {
      // Simulate removal by alert
      alert('Crop listing removed successfully / पीक सूची सफलतापूर्वक हटा दी गई।');
    }
  };

  // Simulating Camera Action
  const triggerCameraCapture = () => {
    alert('Camera interface activated (Simulated Capture) / कैमरा इंटरफ़ेस सक्रिय।');
    setCropImages(['https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=300&q=80']);
  };

  // Transport Request
  const handleTransportRequest = (e) => {
    e.preventDefault();
    if (!transportQty) {
      alert('Please fill out all transport details / कृपया सभी परिवहन विवरण भरें।');
      return;
    }
    const req = {
      pickup: pickupLoc,
      delivery: deliveryLoc,
      crop: transportCrop,
      quantity: transportQty,
      date: transportDate,
      time: transportTime,
      vehicle: 'Satnam Singh (Eicher Pro Truck)',
      status: 'Transport Request Pending'
    };
    setTransportRequests([req, ...transportRequests]);
    alert('Transport request submitted successfully! / परिवहन अनुरोध सफलतापूर्वक प्रस्तुत किया गया!');
    setTransportQty('');
  };

  // Notification click handlers
  const toggleNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50/50 dark:bg-slate-900 transition-colors duration-200">
      
      {/* ==========================================
          DESKTOP SIDEBAR NAVIGATION
          ========================================== */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-850 border-r border-slate-100 dark:border-slate-800 p-6 space-y-8 shrink-0">
        
        {/* Portal Header */}
        <div className="flex items-center gap-2.5">
          <div className="bg-primary-600 p-2 rounded-xl text-white">
            <Sprout size={20} />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-850 dark:text-white leading-none">SA Group</h2>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 block">Kisan Portal</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1">
          {[
            { id: 'home', label: t('farmer.tab_dashboard'), icon: '🏠' },
            { id: 'my-crops', label: t('farmer.tab_my_crops'), icon: '🌾' },
            { id: 'add-crop', label: t('farmer.tab_sell_crop'), icon: '➕' },
            { id: 'market-prices', label: t('farmer.tab_market_prices'), icon: '📊' },
            { id: 'market-map', label: 'Buyer Market Map / खरीदार मैप', icon: '🗺️', action: () => onNavigate('market-map') },
            { id: 'ai-advice', label: t('farmer.tab_ai_advice'), icon: '🤖' },
            { id: 'orders', label: t('farmer.tab_orders'), icon: '📦' },
            { id: 'transport', label: t('farmer.tab_transport'), icon: '🚚' },
            { id: 'quality', label: t('farmer.tab_quality_reports'), icon: '📋' },
            { id: 'earnings', label: t('farmer.tab_earnings'), icon: '💰' },
            { id: 'notifications', label: t('farmer.tab_notifications'), icon: '🔔', badge: unreadCount },
            { id: 'profile', label: t('farmer.tab_profile'), icon: '👤' },
            { id: 'settings', label: t('farmer.tab_settings'), icon: '⚙️' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { 
                if (item.action) {
                  item.action();
                } else {
                  setCurrentTab(item.id); 
                  setSelectedOrder(null); 
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                currentTab === item.id || (item.id === 'orders' && currentTab === 'order-details')
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                  : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            onClick={() => { logout(); onNavigate('landing'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
          >
            <LogOut size={16} />
            <span>{t('farmer.tab_logout')}</span>
          </button>
        </div>

      </aside>

      {/* ==========================================
          MAIN CONTENT VIEW CONTAINER
          ========================================== */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 pb-24 lg:pb-10 overflow-y-auto">
        
        {/* Top Header Controls (Branding + Language Swapper) */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="lg:block hidden">
            <h1 className="text-2xl font-extrabold text-slate-850 dark:text-white leading-none">
              {t('farmer.portal_title')}
            </h1>
            <span className="text-xs text-slate-400 font-semibold mt-1.5 block">
              📍 {village}, {district}, Maharashtra
            </span>
          </div>

          {/* Quick Branding on Mobile */}
          <div className="lg:hidden flex flex-col">
            <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>SA Group</span> <span className="text-xs font-bold bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded">Kisan</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-bold block">
              📍 {village}, {district}
            </span>
          </div>

          {/* Language selection switches */}
          <div className="flex items-center bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 p-1.5 rounded-2xl shadow-sm">
            {['en', 'hi', 'mr'].map((langCode) => (
              <button
                key={langCode}
                onClick={() => setLang(langCode)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                  lang === langCode 
                    ? 'bg-primary-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100'
                }`}
              >
                {langCode === 'en' ? 'English' : langCode === 'hi' ? 'हिंदी' : 'मराठी'}
              </button>
            ))}
          </div>
        </div>

        {/* Active view renderer */}
        
        {/* ==========================================
            VIEW 1: HOME/DASHBOARD
            ========================================== */}
        {currentTab === 'home' && (
          <div className="space-y-8">
            
            {/* Namaste banner */}
            <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 translate-x-16 -translate-y-16 w-64 h-64 bg-primary-700/25 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-1">
                <span className="text-xs font-extrabold text-primary-200 uppercase tracking-widest">Namaste / नमस्ते / नमस्कार</span>
                <h2 className="text-3xl font-extrabold">{profileName}</h2>
                <p className="text-sm text-primary-100">Welcome to your SA Group digital trading portal. Control your harvest sales below.</p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base">
                {t('farmer.quick_actions')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: '🌾 ' + t('farmer.tab_sell_crop'), tab: 'add-crop', bg: 'bg-emerald-500 hover:bg-emerald-600' },
                  { label: '📊 ' + t('farmer.tab_market_prices'), tab: 'market-prices', bg: 'bg-amber-500 hover:bg-amber-600' },
                  { label: '🚚 ' + t('farmer.tab_transport'), tab: 'transport', bg: 'bg-blue-500 hover:bg-blue-600' },
                  { label: '🤖 ' + t('farmer.tab_ai_advice'), tab: 'ai-advice', bg: 'bg-purple-500 hover:bg-purple-600' }
                ].map((act, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTab(act.tab)}
                    className={`${act.bg} text-white font-extrabold py-5 px-4 rounded-3xl shadow-sm text-center text-sm transition-transform active:scale-[0.99] select-none cursor-pointer flex flex-col items-center justify-center gap-2`}
                  >
                    <span>{act.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary click cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <button 
                onClick={() => setCurrentTab('my-crops')}
                className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-left shadow-sm hover:shadow-md transition active:scale-[0.99]"
              >
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {t('farmer.summary_my_crops')}
                </span>
                <span className="block text-2xl font-extrabold text-slate-800 dark:text-white mt-2">
                  {farmerCrops.length} Crops
                </span>
              </button>

              <button 
                onClick={() => setCurrentTab('orders')}
                className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-left shadow-sm hover:shadow-md transition active:scale-[0.99]"
              >
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {t('farmer.summary_active_orders')}
                </span>
                <span className="block text-2xl font-extrabold text-slate-800 dark:text-white mt-2">
                  {farmerOrders.length} Orders
                </span>
              </button>

              <button 
                onClick={() => setCurrentTab('earnings')}
                className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-left shadow-sm hover:shadow-md transition active:scale-[0.99]"
              >
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {t('farmer.summary_earnings')}
                </span>
                <span className="block text-xl font-extrabold text-emerald-600 mt-2 truncate">
                  ₹{totalEarnings.toLocaleString('en-IN')}
                </span>
              </button>

              <button 
                onClick={() => setCurrentTab('transport')}
                className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-left shadow-sm hover:shadow-md transition active:scale-[0.99]"
              >
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {t('farmer.summary_deliveries')}
                </span>
                <span className="block text-2xl font-extrabold text-slate-800 dark:text-white mt-2">
                  {farmerOrders.filter(o => o.status === 'In Transit' || o.status === 'Picked Up').length} Active
                </span>
              </button>

            </div>

            {/* Split layout: Today's bhav + AI advice */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Bhav list */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-slate-850 dark:text-white text-base">
                    {t('farmer.market_bhav_title')}
                  </h3>
                  <button 
                    onClick={() => setCurrentTab('market-prices')}
                    className="text-xs font-bold text-primary-600 hover:underline"
                  >
                    {t('farmer.view_all_prices')} →
                  </button>
                </div>
                
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {marketPrices.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 font-bold">
                      No market data available.
                    </div>
                  ) : (
                    marketPrices.slice(0, 4).map((item, idx) => {
                      const price = Number(item.modal_price || item.current || item.modal || 2500);
                      const minPrice = Number(item.minimum_price || Math.round(price * 0.9));
                      const maxPrice = Number(item.maximum_price || Math.round(price * 1.1));
                      const commodity = item.commodity || item.crop || 'Crop';
                      const marketName = item.market_name || item.market || 'Mandi';
                      const variety = item.variety || 'Standard';
                      const dateStr = item.last_updated ? new Date(item.last_updated).toLocaleDateString('en-IN') : 'Today';

                      return (
                        <div key={idx} className="flex justify-between items-center py-3.5">
                          <div>
                            <span className="font-extrabold text-sm text-slate-850 dark:text-white block">{commodity}</span>
                            <span className="text-[10px] text-slate-400 font-bold block">📍 {marketName} | {variety}</span>
                            <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Source: {item.source || 'AGMARKNET'} | Last updated: {dateStr}</span>
                          </div>
                          <div className="text-right font-semibold">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white block">₹{price.toLocaleString('en-IN')} / Qtl</span>
                            <span className="text-[9px] text-slate-450 block">Min: ₹{minPrice.toLocaleString('en-IN')} | Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* AI Prediction preview */}
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg uppercase">
                    {t('farmer.demo_ai_prediction')}
                  </span>
                  <span className="text-2xl">🤖</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Crop:</span>
                    <span className="font-extrabold text-slate-800 dark:text-white">Tomato (टमाटर)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Current Price:</span>
                    <span className="font-extrabold text-slate-800 dark:text-white">₹2,800 / Qtl</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Expected Price:</span>
                    <span className="font-extrabold text-primary-600">₹3,050 / Qtl</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Demand / Supply:</span>
                    <span className="font-extrabold text-slate-850 dark:text-white">High / Medium</span>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-3.5 rounded-2xl text-xs leading-relaxed text-amber-800 dark:text-amber-400 font-medium">
                  {t('farmer.ai_recommendation')}: Prices may increase. If you don't need immediate payment, consider waiting 3–5 days.
                </div>

                <button 
                  onClick={() => setCurrentTab('ai-advice')}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-bold transition shadow-sm"
                >
                  {t('farmer.view_market_analysis')}
                </button>
              </div>

            </div>

            {/* Recent Orders section */}
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-slate-850 dark:text-white text-base">
                  {t('farmer.recent_orders')}
                </h3>
                <button 
                  onClick={() => setCurrentTab('orders')}
                  className="text-xs font-bold text-primary-600 hover:underline"
                >
                  {t('farmer.view_all_orders')} →
                </button>
              </div>

              {farmerOrders.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No recent orders yet. List crops to get buyers!</p>
              ) : (
                <div className="space-y-3">
                  {farmerOrders.slice(0, 2).map((ord) => (
                    <div key={ord.id} className="border border-slate-50 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-850 dark:text-white">{ord.cropName}</span>
                          <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">#{ord.id}</span>
                        </div>
                        <span className="text-xs text-slate-400 block mt-0.5">Quantity: {ord.quantity} {ord.unit} | Buyer: {ord.buyerName}</span>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                        <span className="font-extrabold text-sm text-primary-600">₹{ord.finalAmount.toLocaleString('en-IN')}</span>
                        <button
                          onClick={() => { setSelectedOrder(ord); setCurrentTab('order-details'); }}
                          className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-[10px] font-extrabold hover:bg-slate-100 transition shrink-0 dark:text-white"
                        >
                          {t('farmer.view_details')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==========================================
            VIEW 2: MY CROPS
            ========================================== */}
        {currentTab === 'my-crops' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-880 dark:text-white leading-none">
                  {t('farmer.tab_my_crops')}
                </h2>
                <span className="text-xs text-slate-400 mt-1 block">Manage your active marketplace listings</span>
              </div>
              <button 
                onClick={() => { setWizardStep(1); setCurrentTab('add-crop'); }}
                className="bg-primary-600 hover:bg-primary-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-md shadow-primary-500/10 flex items-center gap-1.5"
              >
                <Plus size={16} />
                <span>{t('farmer.add_crop_btn')}</span>
              </button>
            </div>

            {farmerCrops.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                <span className="text-5xl block mb-4">🌱</span>
                <h4 className="font-bold text-slate-800 dark:text-white text-lg">No crops listed yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Start listing your harvest to reach thousands of urban retail buyers and traders.</p>
                <button 
                  onClick={() => setCurrentTab('add-crop')}
                  className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-2xl text-xs transition"
                >
                  List Crop Now
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {farmerCrops.map((crop) => (
                  <div key={crop.id} className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <img src={crop.imageUrl} className="h-40 w-full object-cover" alt="" />
                      <div className="p-5 space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-extrabold text-base text-slate-800 dark:text-white leading-tight">{crop.name}</h3>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-extrabold">
                            {t('farmer.status_available')}
                          </span>
                        </div>
                        
                        <div className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 font-semibold">
                          <p className="flex justify-between"><span>Quantity:</span> <span className="font-bold text-slate-800 dark:text-white">{crop.quantity} {crop.unit}</span></p>
                          <p className="flex justify-between"><span>Expected:</span> <span className="font-bold text-slate-800 dark:text-white">₹{crop.expectedPrice} / Qtl</span></p>
                          <p className="flex justify-between"><span>Location:</span> <span className="font-bold text-slate-800 dark:text-white">{(crop.location || 'Pune Mandi').split(' ')[0]}</span></p>
                          <p className="flex justify-between"><span>Harvest:</span> <span className="font-bold text-slate-800 dark:text-white">{crop.harvestDate}</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 border-t border-slate-50 dark:border-slate-800/80 flex gap-2">
                      <button 
                        onClick={() => alert(`Viewing details for crop: ${crop.name} (Variety: ${crop.description})`)}
                        className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-extrabold transition"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleRemoveCrop(crop.id)}
                        className="py-2 px-3 border border-red-100 hover:bg-red-50 text-red-600 rounded-xl text-[10px] font-extrabold transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            VIEW 3: SELL / ADD CROP
            ========================================== */}
        {currentTab === 'add-crop' && (
          <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
            <div className="text-center mb-8">
              <h2 className="font-extrabold text-xl text-slate-850 dark:text-white">{t('farmer.tab_sell_crop')}</h2>
              <p className="text-xs text-slate-400 mt-1">Submit your harvest detail in 8 simple steps.</p>
            </div>

            {/* Horizontal progress bar */}
            <div className="flex items-center justify-between mb-8 max-w-md mx-auto relative select-none">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />
              <div className="absolute left-0 top-1/2 h-0.5 bg-primary-600 -z-10 transition-all duration-300" style={{ width: `${((wizardStep - 1) / 7) * 100}%` }} />
              {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                <span 
                  key={step} 
                  className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center border transition-all ${
                    wizardStep >= step 
                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm' 
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-455'
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>

            {/* Wizard Form step panels */}
            <div className="min-h-[220px] mb-8">
              
              {/* Step 1: Select Crop */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">{t('farmer.sell_step_1')}</span>
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded-lg">
                      Selected: {cropName} ({category})
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                    {[
                      { name: 'Tomato', category: 'Vegetables', icon: '🍅' },
                      { name: 'Onion', category: 'Vegetables', icon: '🧅' },
                      { name: 'Potato', category: 'Vegetables', icon: '🥔' },
                      { name: 'Wheat', category: 'Grains', icon: '🌾' },
                      { name: 'Rice', category: 'Grains', icon: '🍚' },
                      { name: 'Soybean', category: 'Oilseeds', icon: '🌱' },
                      { name: 'Cotton', category: 'Cash Crops', icon: '☁️' },
                      { name: 'Sugarcane', category: 'Cash Crops', icon: '🎋' },
                      { name: 'Chilli', category: 'Spices', icon: '🌶️' },
                      { name: 'Banana', category: 'Fruits', icon: '🍌' },
                      { name: 'Grapes', category: 'Fruits', icon: '🍇' },
                      { name: 'Pomegranate', category: 'Fruits', icon: '🍎' },
                      { name: 'Jowar', category: 'Grains', icon: '🌾' },
                      { name: 'Bajra', category: 'Grains', icon: '🌾' },
                      { name: 'Orange', category: 'Fruits', icon: '🍊' },
                      { name: 'Turmeric', category: 'Spices', icon: '🟨' },
                      { name: 'Maize', category: 'Grains', icon: '🌽' },
                      { name: 'Mango', category: 'Fruits', icon: '🥭' }
                    ].map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          setCropName(item.name);
                          setCategory(item.category);
                        }}
                        className={`p-3 rounded-2xl border text-center font-bold text-xs transition flex flex-col items-center justify-center gap-1 ${
                          cropName === item.name 
                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-primary-400 shadow-sm ring-2 ring-primary-500/20' 
                            : 'border-slate-100 hover:bg-slate-50 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Enter Quantity */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">{t('farmer.sell_step_2')}</span>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Quantity / मात्रा</label>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Unit / वजन इकाई</label>
                    <div className="flex gap-3">
                      {['Quintal', 'Kg'].map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setUnit(u)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                            unit === u ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700 dark:text-white'
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Expected Price */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">{t('farmer.sell_step_3')}</span>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Target Price (per Quintal) / अपेक्षित दर</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        placeholder="e.g. 2400"
                        value={expectedPrice}
                        onChange={(e) => setExpectedPrice(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Select Location */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">{t('farmer.sell_step_4')}</span>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Your nearest Mandi / मंडी का स्थान</label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold dark:text-white"
                    >
                      {maharashtraDistrictNames.map((d, idx) => (
                        <option key={idx} value={d + ' Mandi'}>{d} Mandi (APMC)</option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 font-medium">
                    📍 Selected Mandi Market: <strong className="text-slate-800 dark:text-white">{location}</strong>
                  </div>
                </div>
              )}

              {/* Step 5: Harvest Date */}
              {wizardStep === 5 && (
                <div className="space-y-4">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">{t('farmer.sell_step_5')}</span>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Harvest Date / फसल कटाई की तारीख</label>
                    <input
                      type="date"
                      value={harvestDate}
                      onChange={(e) => setHarvestDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Upload Crop Images */}
              {wizardStep === 6 && (
                <div className="space-y-4">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">{t('farmer.sell_step_6')}</span>
                  <div className="border border-dashed border-slate-350 dark:border-slate-700 rounded-3xl p-6 text-center bg-slate-50 dark:bg-slate-800/40">
                    
                    {cropImages.length > 0 ? (
                      <div className="space-y-3">
                        <img src={cropImages[0]} className="h-32 mx-auto object-cover rounded-xl" alt="" />
                        <button 
                          type="button" 
                          onClick={() => setCropImages([])} 
                          className="text-xs text-red-500 font-bold hover:underline"
                        >
                          Clear Image / साफ़ करें
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-3xl block mb-2">📸</span>
                        <p className="text-xs text-slate-400 font-semibold mb-4">Take a live photo of your crop or select file</p>
                      </>
                    )}

                    {cropImages.length === 0 && (
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={triggerCameraCapture}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 transition"
                        >
                          <Camera size={14} className="text-primary-600" />
                          <span>{t('farmer.take_photo')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCropImages(['https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=300&q=80'])}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 transition"
                        >
                          <Upload size={14} className="text-slate-400" />
                          <span>{t('farmer.upload_photo')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 7: Review */}
              {wizardStep === 7 && (
                <div className="space-y-4">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">{t('farmer.sell_step_7')}</span>
                  <div className="border border-slate-100 dark:border-slate-850 rounded-2xl p-4 bg-slate-50/50 space-y-2.5 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Crop Name:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{cropName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quantity:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{quantity} {unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Expected Price:</span>
                      <span className="font-bold text-primary-600">₹{expectedPrice} / Qtl</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mandi Location:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Harvest Date:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{harvestDate}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Add Varieties / Remarks (Optional)</label>
                    <textarea
                      placeholder="e.g. Premium local variety, properly dried and clean"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-white"
                      rows="2"
                    />
                  </div>
                </div>
              )}

              {/* Step 8: Confirm Listing */}
              {wizardStep === 8 && (
                <div className="space-y-4 text-center py-6">
                  <span className="text-5xl block mb-2 animate-bounce">✓</span>
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">{t('farmer.list_success')}</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">{t('farmer.list_success_desc')}</p>
                </div>
              )}

            </div>

            {/* Back/Next Control buttons */}
            <div className="flex justify-between border-t border-slate-100 dark:border-slate-850 pt-5">
              {wizardStep > 1 && wizardStep < 8 ? (
                <button
                  onClick={handleBackWizard}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-50 transition"
                >
                  {t('farmer.back')}
                </button>
              ) : <div />}

              {wizardStep < 7 ? (
                <button
                  onClick={handleNextWizard}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition flex items-center gap-1"
                >
                  <span>{t('farmer.next')}</span>
                  <ChevronRight size={14} />
                </button>
              ) : wizardStep === 7 ? (
                <button
                  onClick={handleNextWizard}
                  className="bg-accent-500 hover:bg-accent-600 text-slate-900 font-extrabold px-8 py-2.5 rounded-xl text-xs transition shadow-sm"
                >
                  Confirm Review
                </button>
              ) : (
                <button
                  onClick={handleListCropSubmit}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md transition"
                >
                  {t('farmer.list_my_crop_btn')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 4: MARKET PRICES (AGMARKNET PRICE INTELLIGENCE)
            ========================================== */}
        {currentTab === 'market-prices' && (() => {
          // Filter matching prices from active marketPrices prop
          const filteredPrices = marketPrices.filter((p) => {
            const matchesCrop = !marketCrop || marketCrop === 'All' || p.commodity?.toLowerCase() === marketCrop.toLowerCase();
            const matchesDistrict = !marketDistrict || marketDistrict === 'All' || 
              p.district_name?.toLowerCase().includes(marketDistrict.toLowerCase()) || 
              p.market_name?.toLowerCase().includes(marketDistrict.toLowerCase());
            const matchesDate = !marketSearchDate || p.arrival_date === marketSearchDate;
            return matchesCrop && matchesDistrict && matchesDate;
          });

          // Comparison matrix across Maharashtra APMCs for selected crop
          const activeComparisonCrop = marketCrop === 'All' ? 'Tomato' : marketCrop;
          const cropComparisons = (marketPrices || []).filter(p => p && (p.commodity || p.crop)?.toLowerCase() === activeComparisonCrop.toLowerCase());
          const modalPrices = cropComparisons.map(c => Number(c.modal_price || c.current || c.modal || 0)).filter(p => p > 0);
          const highestModal = modalPrices.length > 0 ? Math.max(...modalPrices) : 2850;
          const lowestModal = modalPrices.length > 0 ? Math.min(...modalPrices) : 2400;
          const highestRecord = cropComparisons.find(c => Number(c.modal_price || c.current || c.modal) === highestModal);
          const lowestRecord = cropComparisons.find(c => Number(c.modal_price || c.current || c.modal) === lowestModal);
          const priceDifference = Math.max(0, highestModal - lowestModal);
          const currentModalPrice = modalPrices.length > 0 ? modalPrices[0] : 2800;
          const predictedPrice = Math.round(currentModalPrice * 1.08);

          return (
            <div className="space-y-6">
              {/* Subpage Header */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏛️</span>
                    <h2 className="font-extrabold text-xl text-slate-850 dark:text-white">
                      AGMARKNET Mandi Price Intelligence
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Official agricultural market-price data source synchronized across 36 Maharashtra APMC mandis.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1.5 rounded-full uppercase border border-emerald-200/50 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>AGMARKNET Connected</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleManualSync}
                    disabled={syncingPrices}
                    className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
                  >
                    <span>{syncingPrices ? '⏳ Syncing...' : '🔄 Sync Live Mandi Rates'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('market-map')}
                    className="py-2 px-3.5 bg-primary-600 hover:bg-primary-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                  >
                    🗺️ Mandi Map
                  </button>
                </div>
              </div>

              {/* Sync Success Toast */}
              {syncSuccessMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fade-in">
                  <span>✓</span>
                  <span>{syncSuccessMsg}</span>
                </div>
              )}

              {/* Price Search & Filter Tools */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                    Search & Filter Mandi Prices / मंडी भाव खोजें
                  </span>
                  <span className="text-xs font-bold text-primary-600">
                    Showing {filteredPrices.length} live records
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">State / राज्य</label>
                    <input 
                      type="text" 
                      value="Maharashtra" 
                      disabled 
                      className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl font-bold text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">District / ज़िला</label>
                    <select 
                      value={marketDistrict} 
                      onChange={(e) => setMarketDistrict(e.target.value)}
                      className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs rounded-xl font-bold dark:text-white"
                    >
                      <option value="All">All Maharashtra Mandis (36 APMCs)</option>
                      {maharashtraDistrictNames.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Commodity / फसल</label>
                    <select 
                      value={marketCrop} 
                      onChange={(e) => setMarketCrop(e.target.value)}
                      className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs rounded-xl font-bold dark:text-white"
                    >
                      <option value="All">All Commodities (सभी फसलें)</option>
                      {['Tomato', 'Onion', 'Potato', 'Wheat', 'Rice', 'Soybean', 'Cotton', 'Sugarcane', 'Chilli', 'Banana', 'Grapes', 'Pomegranate', 'Jowar', 'Bajra', 'Orange', 'Turmeric', 'Maize', 'Mango'].map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Mandi / मंडी</label>
                    <input 
                      type="text" 
                      value={marketDistrict === 'All' ? 'All 36 APMC Mandis' : `${marketDistrict} APMC`}
                      disabled
                      className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl font-bold text-slate-500"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Arrival Date / तारीख</label>
                      {marketSearchDate && (
                        <button
                          type="button"
                          onClick={() => setMarketSearchDate('')}
                          className="text-[9px] font-bold text-red-500 hover:underline"
                        >
                          ✕ Clear
                        </button>
                      )}
                    </div>
                    <input 
                      type="date"
                      value={marketSearchDate}
                      onChange={(e) => setMarketSearchDate(e.target.value)}
                      className="w-full py-1.5 px-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs rounded-xl font-bold dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Price Observation Data Table */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-2">
                  <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">
                    Available Market Observations ({filteredPrices.length} Records)
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold">
                    Source: AGMARKNET • Official Government Market Feed
                  </span>
                </div>

                <div className="overflow-x-auto max-h-[460px]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800 shadow-sm">
                      <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-extrabold">
                        <th className="p-4">Commodity / Variety</th>
                        <th className="p-4">Market / District</th>
                        <th className="p-4">Arrival Qty</th>
                        <th className="p-4">Min Price</th>
                        <th className="p-4">Max Price</th>
                        <th className="p-4 text-emerald-600">Modal Price</th>
                        <th className="p-4">Arrival Date</th>
                        <th className="p-4">Source Attribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60 font-semibold">
                      {filteredPrices.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="p-12 text-center text-slate-400 font-bold">
                            No observations matching this exact filter combination. Try selecting "All Maharashtra Mandis" or "All Commodities".
                          </td>
                        </tr>
                      ) : (
                        filteredPrices.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                            <td className="p-4 font-black text-slate-850 dark:text-white">
                              {item.commodity} <span className="text-[10px] text-slate-400 font-normal block">{item.variety || 'Local / Hybrid'}</span>
                            </td>
                            <td className="p-4 text-slate-700 dark:text-slate-300">
                              {item.market_name} <span className="text-[10px] text-slate-400 block">📍 {item.district_name || item.state}</span>
                            </td>
                            <td className="p-4 font-bold text-slate-600 dark:text-slate-400">
                              {item.arrival_quantity} {item.unit || 'Quintal'}
                            </td>
                            <td className="p-4 font-bold text-slate-600">₹{item.minimum_price?.toLocaleString('en-IN')}</td>
                            <td className="p-4 font-bold text-slate-600">₹{item.maximum_price?.toLocaleString('en-IN')}</td>
                            <td className="p-4 font-extrabold text-emerald-600 text-sm">₹{item.modal_price?.toLocaleString('en-IN')} / {item.unit || 'Q'}</td>
                            <td className="p-4 text-slate-400 font-bold">{item.arrival_date}</td>
                            <td className="p-4 text-[10px] text-slate-400 space-y-0.5">
                              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">{item.source || 'AGMARKNET'}</span>
                              <span className="block">Feed: {new Date(item.last_updated).toLocaleDateString('en-IN')}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price Comparison & Transport Margin Analysis */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Comparison matrix */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">
                        Cross-Market Price Comparison / बाज़ार तुलना
                      </h3>
                      <p className="text-xs text-slate-400">Comparing {activeComparisonCrop} rates across Maharashtra APMCs</p>
                    </div>
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-xl">
                      {activeComparisonCrop}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 p-4 rounded-2xl">
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase block">Highest Modal Price</span>
                      <span className="text-xl font-black text-emerald-800 dark:text-emerald-300 block mt-1">₹{highestModal.toLocaleString('en-IN')} / Q</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">{highestRecord?.market_name || 'Mumbai Vashi APMC'}</span>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-2xl">
                      <span className="text-[10px] font-extrabold text-amber-700 uppercase block">Lowest Modal Price</span>
                      <span className="text-xl font-black text-amber-800 dark:text-amber-300 block mt-1">₹{lowestModal.toLocaleString('en-IN')} / Q</span>
                      <span className="text-[10px] text-amber-600 font-bold block mt-0.5">{lowestRecord?.market_name || 'Pune APMC'}</span>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 p-4 rounded-2xl">
                      <span className="text-[10px] font-extrabold text-blue-700 uppercase block">Max Price Spread</span>
                      <span className="text-xl font-black text-blue-800 dark:text-blue-300 block mt-1">₹{priceDifference.toLocaleString('en-IN')} / Q</span>
                      <span className="text-[10px] text-blue-600 font-bold block mt-0.5">Market Difference</span>
                    </div>
                  </div>

                  {/* Net revenue transport check alert */}
                  <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
                      <span>⚠️</span>
                      <span>Estimated Net Revenue Calculation Rule</span>
                    </div>
                    <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-200 leading-relaxed">
                      <strong>Expected Revenue − Transport Freight Cost = Estimated Net Revenue</strong>.<br />
                      Do not select a mandi market solely on the highest nominal price. Long-distance freight cost to distant mandis may reduce your net profit.
                    </p>
                  </div>
                </div>

                {/* AI Price Prediction Card */}
                <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded uppercase">
                        AI Market Intelligence
                      </span>
                      <span className="text-xl">🤖</span>
                    </div>
                    <h4 className="font-extrabold text-slate-850 dark:text-white text-base mt-2">
                      {activeComparisonCrop} Price Forecast
                    </h4>
                    <p className="text-xs text-slate-400">Based on historical AGMARKNET prices, weather & supply arrivals</p>
                  </div>

                  <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Modal Price:</span>
                      <span className="font-bold text-slate-800 dark:text-white">₹{currentModalPrice.toLocaleString('en-IN')} / Q</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Predicted Price (3-5 Days):</span>
                      <span className="font-extrabold text-emerald-600">₹{predictedPrice.toLocaleString('en-IN')} / Q</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Model Confidence:</span>
                      <span className="font-extrabold text-primary-600">84%</span>
                    </div>
                  </div>

                  <div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200/50 p-3.5 rounded-xl text-xs text-primary-900 dark:text-primary-200 font-bold leading-relaxed">
                    💡 Potential price increase detected for {activeComparisonCrop}. Consider holding harvest if transport logistics are constrained.
                  </div>
                </div>
              </div>

              {/* Historical Price Movement Line Chart */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h3 className="font-extrabold text-slate-850 dark:text-white text-base">
                      Price Movement History ({activeComparisonCrop} - {marketDistrict === 'All' ? 'Maharashtra APMC Average' : marketDistrict + ' APMC'})
                    </h3>
                    <p className="text-xs text-slate-400">Historical Min, Max and Modal price curve from AGMARKNET records</p>
                  </div>

                  {/* Day range selectors */}
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                    {[7, 30, 90].map((days) => (
                      <button
                        key={days}
                        onClick={() => setHistoryDays(days)}
                        className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition ${
                          historyDays === days
                            ? 'bg-white dark:bg-slate-700 text-slate-850 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {days} Days
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData.length > 0 ? historyData : [
                      { date: 'Day 1', minimum_price: 2400, maximum_price: 3000, modal_price: 2700 },
                      { date: 'Day 2', minimum_price: 2500, maximum_price: 3100, modal_price: 2800 },
                      { date: 'Day 3', minimum_price: 2450, maximum_price: 3050, modal_price: 2750 },
                      { date: 'Day 4', minimum_price: 2600, maximum_price: 3200, modal_price: 2900 },
                      { date: 'Day 5', minimum_price: 2550, maximum_price: 3150, modal_price: 2850 },
                      { date: 'Day 6', minimum_price: 2650, maximum_price: 3300, modal_price: 2950 },
                      { date: 'Day 7', minimum_price: 2700, maximum_price: 3400, modal_price: 3050 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                      <Tooltip formatter={(val, name) => [`₹${val}`, name]} />
                      <Line type="monotone" dataKey="maximum_price" stroke="#3b82f6" strokeWidth={2} name="Maximum Price" dot={false} />
                      <Line type="monotone" dataKey="modal_price" stroke="#10b981" strokeWidth={3} name="Modal Price" />
                      <Line type="monotone" dataKey="minimum_price" stroke="#ef4444" strokeWidth={2} name="Minimum Price" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          );
        })()}

        {/* ==========================================
            VIEW 5: AI MARKET ADVICE
            ========================================== */}
        {currentTab === 'ai-advice' && (
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Crop selector */}
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm h-fit space-y-4">
              <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">Select Harvest Crop</h3>
              <div className="space-y-2">
                {['Tomato', 'Onion', 'Wheat', 'Chilli', 'Soybean'].map((cropName) => (
                  <button
                    key={cropName}
                    onClick={() => setAiCrop(cropName)}
                    className={`w-full p-3.5 rounded-2xl text-left font-bold text-xs transition border flex justify-between items-center ${
                      aiCrop === cropName 
                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-primary-400' 
                        : 'border-slate-50 hover:bg-slate-50 dark:border-slate-800 text-slate-650 dark:text-slate-300'
                    }`}
                  >
                    <span>{cropName}</span>
                    <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-extrabold">INCREASE</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prediction advice card */}
            <div className="md:col-span-2 bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-primary-650 bg-primary-50 px-2.5 py-1 rounded-lg uppercase">
                    {t('farmer.demo_ai_prediction')}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-2">
                    {aiCrop} Market Intelligence
                  </h3>
                </div>
                <span className="text-3xl">🤖</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-extrabold block">Current price</span>
                  <span className="text-lg font-extrabold text-slate-800 dark:text-white mt-1 block">₹2,800 / Qtl</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-extrabold block">{t('farmer.predicted_price')}</span>
                  <span className="text-lg font-extrabold text-primary-600 mt-1 block">₹3,050 / Qtl</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-extrabold block">{t('farmer.market_demand')}</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">High / बहुत अधिक</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-extrabold block">{t('farmer.market_supply')}</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">Medium / मध्यम</span>
                </div>
              </div>

              <div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold text-primary-800 dark:text-primary-300 uppercase tracking-wider block">Suggested Action</span>
                <p className="text-xs font-bold text-primary-950 dark:text-primary-200 leading-relaxed">
                  Recommended Selling Window: Hold harvest for 3–5 days to maximize price margins. Demand is increasing while logistics delay has restricted incoming supply in Pune mandi.
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-1.5 text-xs">
                <span className="font-extrabold text-slate-700 dark:text-slate-350 block">Why this recommendation?</span>
                <p className="text-slate-400 leading-normal">
                  Our demo predictive AI structures represent standard REST endpoints ready for machine learning model integration. In the production app, this advice will call `/api/farmer/advice/:crop` referencing historical AGMARKNET parameters.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ==========================================
            VIEW 6: ORDERS LIST
            ========================================== */}
        {currentTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
              {t('farmer.tab_orders')}
            </h2>

            {/* Status tab filters */}
            <div className="flex overflow-x-auto gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 no-scrollbar">
              {['All', 'Pending', 'Confirmed', 'Transporter Assigned', 'In Transit', 'Delivered', 'Completed', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderTabFilter(status)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                    orderTabFilter === status 
                      ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' 
                      : 'bg-white dark:bg-slate-850 text-slate-500 border border-slate-200/50 dark:border-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Orders listing */}
            {farmerOrders.length === 0 ? (
              <p className="text-xs text-slate-400 py-16 text-center bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl">No buyer orders registered yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {farmerOrders
                  .filter((o) => orderTabFilter === 'All' || o.status === orderTabFilter)
                  .map((ord) => (
                    <div key={ord.id} className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-slate-400 font-extrabold block">{t('farmer.order_id')}</span>
                            <span className="font-extrabold text-slate-850 dark:text-white">#{ord.id}</span>
                          </div>
                          <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase">
                            {ord.status}
                          </span>
                        </div>

                        <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400">
                          <p className="flex justify-between"><span>Crop / Quantity:</span> <span className="font-bold text-slate-850 dark:text-white">{ord.cropName} ({ord.quantity} {ord.unit})</span></p>
                          <p className="flex justify-between"><span>Buyer:</span> <span className="font-bold text-slate-850 dark:text-white">{ord.buyerName}</span></p>
                          <p className="flex justify-between"><span>Order Date:</span> <span className="font-bold text-slate-850 dark:text-white">{ord.pickupDate}</span></p>
                        </div>
                      </div>

                      <div className="border-t border-slate-50 dark:border-slate-850 pt-3 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] text-slate-400 font-extrabold block">Farmer Payout</span>
                          <span className="font-extrabold text-emerald-600 text-sm">₹{ord.finalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <button
                          onClick={() => { setSelectedOrder(ord); setCurrentTab('order-details'); }}
                          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition"
                        >
                          {t('farmer.view_details')}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            VIEW 7: ORDER DETAILS (WITH TIMELINE)
            ========================================== */}
        {currentTab === 'order-details' && selectedOrder && (
          <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 max-w-3xl mx-auto shadow-sm space-y-8">
            
            {/* Header */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setSelectedOrder(null); setCurrentTab('orders'); }}
                className="p-1 hover:bg-slate-50 rounded-full text-slate-450"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-extrabold text-slate-850 dark:text-white">
                {t('farmer.order_details_title')} #{selectedOrder.id}
              </h2>
            </div>

            {/* Visual status timeline */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-4">Delivery Status Timeline</span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 text-center text-[10px] font-bold">
                {[
                  { label: t('farmer.order_placed'), active: true },
                  { label: t('farmer.order_confirmed'), active: ['Confirmed', 'Transporter Assigned', 'Picked Up', 'In Transit', 'Delivered', 'Completed'].includes(selectedOrder.status) },
                  { label: t('farmer.order_transporter_assigned'), active: ['Transporter Assigned', 'Picked Up', 'In Transit', 'Delivered', 'Completed'].includes(selectedOrder.status) },
                  { label: t('farmer.order_picked_up'), active: ['Picked Up', 'In Transit', 'Delivered', 'Completed'].includes(selectedOrder.status) },
                  { label: t('farmer.order_in_transit'), active: ['In Transit', 'Delivered', 'Completed'].includes(selectedOrder.status) },
                  { label: t('farmer.order_delivered'), active: ['Delivered', 'Completed'].includes(selectedOrder.status) },
                  { label: t('farmer.order_completed'), active: selectedOrder.status === 'Completed' }
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-[9px] border ${
                      step.active 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-350'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={step.active ? 'text-slate-700 dark:text-white font-extrabold' : 'text-slate-400 dark:text-slate-500'}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Info: Buyer vs Crop */}
            <div className="grid sm:grid-cols-2 gap-6">
              
              <div className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl bg-slate-50/50 space-y-2.5">
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Crop Info</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Crop Name: <span className="font-bold text-slate-850 dark:text-white">{selectedOrder.cropName}</span></p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Quantity: <span className="font-bold text-slate-850 dark:text-white">{selectedOrder.quantity} {selectedOrder.unit}</span></p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Seller Phone: <span className="font-bold text-slate-850 dark:text-white">{selectedOrder.farmerPhone}</span></p>
              </div>

              <div className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl bg-slate-50/50 space-y-2.5">
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Buyer Info</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Buyer Name: <span className="font-bold text-slate-850 dark:text-white">{selectedOrder.buyerName}</span></p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Destination: <span className="font-bold text-slate-850 dark:text-white">{selectedOrder.buyerLocation}</span></p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Buyer Phone: <span className="font-bold text-slate-850 dark:text-white">{selectedOrder.buyerPhone}</span></p>
              </div>

            </div>

            {/* Price breakdown details */}
            <div className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-3">
              <h4 className="font-extrabold text-sm text-slate-850 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                {t('buyer.price_breakdown')}
              </h4>
              <div className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
                <div className="flex justify-between"><span>Crop Market Value:</span> <span className="font-bold text-slate-850 dark:text-white">₹{selectedOrder.cropValue.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>Mandi Transport Fee:</span> <span className="font-bold text-slate-850 dark:text-white">₹{selectedOrder.transportCost.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>Platform Service Charge:</span> <span className="font-bold text-slate-850 dark:text-white">₹{selectedOrder.platformFee.toLocaleString('en-IN')}</span></div>
                <hr className="border-slate-100 dark:border-slate-800" />
                <div className="flex justify-between font-extrabold text-sm pt-1">
                  <span className="text-slate-700 dark:text-white">Farmer Final Payout:</span> 
                  <span className="text-primary-600">₹{selectedOrder.finalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Transporter section details */}
            {selectedOrder.transporterName && (
              <div className="border border-slate-100 dark:border-slate-800 p-5 rounded-2xl bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Assigned Transporter</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{selectedOrder.transporterName}</p>
                  <p className="text-[10px] text-slate-400">Vehicle: {selectedOrder.vehicleNumber} ({selectedOrder.vehicleType || 'Tata Ace'})</p>
                </div>
                <a href={`tel:${selectedOrder.transporterPhone || '9811223344'}`} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition">
                  Call Driver / ड्राइवर को कॉल करें
                </a>
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            VIEW 8: TRANSPORT MANAGEMENT
            ========================================== */}
        {currentTab === 'transport' && (
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Active Delivery Status */}
            <div className="md:col-span-2 bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 h-fit">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white leading-none">
                  {t('farmer.transport_management')}
                </h2>
                <p className="text-xs text-slate-400 mt-1">Track active deliveries and logistics booking</p>
              </div>

              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-extrabold text-blue-700 uppercase">In Transit / मार्ग में</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">Driver: Satnam Singh</span>
                </div>

                <div className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
                  <p className="flex justify-between"><span>{t('farmer.transport_pickup')}:</span> <span className="font-bold text-slate-850 dark:text-white">{pickupLoc}</span></p>
                  <p className="flex justify-between"><span>{t('farmer.transport_delivery')}:</span> <span className="font-bold text-slate-850 dark:text-white">{deliveryLoc}</span></p>
                  <p className="flex justify-between"><span>{t('farmer.transport_vehicle')}:</span> <span className="font-bold text-slate-850 dark:text-white">MH-12-AB-1234 (Tata Ace)</span></p>
                  <p className="flex justify-between"><span>{t('farmer.transport_distance')}:</span> <span className="font-bold text-slate-850 dark:text-white">165 km</span></p>
                  <p className="flex justify-between"><span>{t('farmer.transport_eta')}:</span> <span className="font-bold text-slate-850 dark:text-white">Today, 6:30 PM</span></p>
                </div>

                {/* Real-time Google Map Connection */}
                <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 h-48 relative">
                  <iframe
                    title="Live Routing Map"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(pickupLoc + ' to ' + deliveryLoc)}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('delivery-tracking')}
                  className="w-full mt-3 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-bold transition shadow-sm"
                >
                  Open Live Tracking App / लाइव ट्रैकिंग खोलें
                </button>
              </div>

              {/* List submitted transport requests */}
              {transportRequests.length > 0 && (
                <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h4 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wide">My Booking Requests</h4>
                  {transportRequests.map((req, idx) => (
                    <div key={idx} className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex justify-between items-center text-xs font-semibold">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white">{req.crop} ({req.quantity} Qtl)</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Date: {req.date} | pickup: {req.pickup}</span>
                      </div>
                      <span className="text-[10px] font-extrabold bg-amber-50 text-amber-700 px-2 py-0.5 rounded uppercase">
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Request Transport Form */}
            <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm h-fit space-y-4">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base">
                {t('farmer.transport_request')}
              </h3>
              
              <form onSubmit={handleTransportRequest} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('farmer.transport_pickup_loc')}</label>
                  <input
                    type="text"
                    value={pickupLoc}
                    onChange={(e) => setPickupLoc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('farmer.transport_delivery_loc')}</label>
                  <input
                    type="text"
                    value={deliveryLoc}
                    onChange={(e) => setDeliveryLoc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('farmer.filter_crop')}</label>
                    <select 
                      value={transportCrop} 
                      onChange={(e) => setTransportCrop(e.target.value)}
                      className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs rounded-xl font-bold dark:text-white"
                    >
                      {['Tomato', 'Onion', 'Wheat', 'Potato', 'Rice', 'Soybean', 'Cotton', 'Sugarcane', 'Chilli', 'Banana', 'Grapes', 'Pomegranate', 'Jowar', 'Bajra', 'Orange', 'Turmeric', 'Maize', 'Mango'].map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('farmer.quantity')}</label>
                    <input
                      type="number"
                      placeholder="Qtl"
                      value={transportQty}
                      onChange={(e) => setTransportQty(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('farmer.transport_pref_date')}</label>
                    <input
                      type="date"
                      value={transportDate}
                      onChange={(e) => setTransportDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('farmer.transport_pref_time')}</label>
                    <input
                      type="time"
                      value={transportTime}
                      onChange={(e) => setTransportTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-xs transition shadow-sm"
                >
                  Submit Request / अनुरोध भेजें
                </button>
              </form>
            </div>

          </div>
        )}

        {/* ==========================================
            VIEW 9: QUALITY REPORT
            ========================================== */}
        {currentTab === 'quality' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-none">
                Quality Verification Reports
              </h2>
              <p className="text-xs text-slate-400 mt-1">Review verified digital certificates signed by transporters at farm pickups.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { id: 'rep_1', crop: 'Tomato', verifiedQty: 480, unit: 'Kg', quality: 'GOOD ✓', verifiedBy: 'Satnam Singh (Driver)', date: '10 August 2026', location: 'Baramati Pune', image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=150&q=80', remarks: 'Sorted correctly, Checked moisture < 10%, Crates loaded securely.' },
                { id: 'rep_2', crop: 'Onion', verifiedQty: 300, unit: 'Kg', quality: 'GOOD ✓', verifiedBy: 'Ramesh Kumar (Driver)', date: '08 August 2026', location: 'Baramati Pune', image: 'https://images.unsplash.com/photo-1618519764620-7403abdbfee9?auto=format&fit=crop&w=150&q=80', remarks: 'Dry well cured, high pungency pink quality.' }
              ].map((report) => (
                <div key={report.id} className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold block">Report ID</span>
                        <span className="font-extrabold text-slate-800 dark:text-white">#{report.id}</span>
                      </div>
                      <span className="text-xs font-extrabold text-green-600 bg-green-50 px-2.5 py-1 rounded-xl">
                        {report.quality}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <img src={report.image} className="h-20 w-20 object-cover rounded-2xl shrink-0" alt="" />
                      <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400 font-semibold">
                        <p>Crop: <span className="text-slate-800 dark:text-white font-bold">{report.crop}</span></p>
                        <p>{t('farmer.quality_quantity')}: <span className="text-slate-800 dark:text-white font-bold">{report.verifiedQty} {report.unit}</span></p>
                        <p>Date: <span className="text-slate-800 dark:text-white font-bold">{report.date}</span></p>
                        <p>Inspector: <span className="text-slate-850 dark:text-white font-bold">{report.verifiedBy}</span></p>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-650 dark:text-slate-450 leading-relaxed font-semibold">
                      Remarks: "{report.remarks}"
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedQualityReport(report)}
                    className="w-full py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition shadow-sm bg-white dark:bg-slate-850"
                  >
                    {t('farmer.quality_view_full')}
                  </button>
                </div>
              ))}
            </div>

            {/* Quality Report Modal */}
            {selectedQualityReport && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                <div className="bg-white dark:bg-slate-850 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6 relative border border-slate-100 dark:border-slate-800">
                  <div className="text-center space-y-3">
                    <span className="text-4xl">📜</span>
                    <h3 className="text-lg font-extrabold text-slate-850 dark:text-white">SA Group Quality Certificate</h3>
                    <p className="text-xs text-slate-450">This document verifies that the crop meets wholesale trade parameters.</p>
                  </div>
                  
                  <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-2xl space-y-2 text-xs font-semibold bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex justify-between"><span>Crop Name:</span> <span className="font-bold text-slate-850 dark:text-white">{selectedQualityReport.crop}</span></div>
                    <div className="flex justify-between"><span>Weight Verified:</span> <span className="font-bold text-slate-850 dark:text-white">{selectedQualityReport.verifiedQty} {selectedQualityReport.unit}</span></div>
                    <div className="flex justify-between"><span>Quality Grade:</span> <span className="text-green-600 font-extrabold">{selectedQualityReport.quality}</span></div>
                    <div className="flex justify-between"><span>Inspector Sign:</span> <span className="font-bold text-slate-850 dark:text-white">{selectedQualityReport.verifiedBy}</span></div>
                    <div className="flex justify-between"><span>Verification Date:</span> <span className="font-bold text-slate-850 dark:text-white">{selectedQualityReport.date}</span></div>
                  </div>

                  <button
                    onClick={() => setSelectedQualityReport(null)}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-xs font-bold transition shadow-sm"
                  >
                    Close Report
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            VIEW 10: EARNINGS
            ========================================== */}
        {currentTab === 'earnings' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-none">
                {t('farmer.tab_earnings')}
              </h2>
              <p className="text-xs text-slate-400 mt-1">Review financial transactions and payouts</p>
            </div>

            {/* Metric counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">{t('farmer.earnings_total')}</span>
                <span className="text-xl font-extrabold text-emerald-600 block mt-2">₹{totalEarnings.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">{t('farmer.earnings_month')}</span>
                <span className="text-xl font-extrabold text-slate-800 dark:text-white block mt-2">₹32,500</span>
              </div>
              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">{t('farmer.earnings_pending')}</span>
                <span className="text-xl font-extrabold text-amber-600 block mt-2">₹{pendingPayments.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">{t('farmer.earnings_completed')}</span>
                <span className="text-xl font-extrabold text-slate-800 dark:text-white block mt-2">₹1,17,000</span>
              </div>
            </div>

            {/* Split: Monthly Earnings Chart + Payment History */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Chart */}
              <div className="lg:col-span-1 bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-850 dark:text-white text-xs uppercase tracking-wide">
                  {t('farmer.earnings_chart')}
                </h3>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyEarningsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                      <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* History Table */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-850 dark:text-white text-xs uppercase tracking-wide">
                  {t('farmer.earnings_history')}
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold">
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Order Name</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-350">
                      <tr>
                        <td className="py-3">10 Aug 2026</td>
                        <td className="py-3 font-bold">Tomato Order #AGR1024</td>
                        <td className="py-3 font-bold text-slate-850 dark:text-white">₹14,000</td>
                        <td className="py-3 text-green-600 font-extrabold">Paid ✓</td>
                      </tr>
                      <tr>
                        <td className="py-3">08 Aug 2026</td>
                        <td className="py-3 font-bold">Onion Order #AGR1023</td>
                        <td className="py-3 font-bold text-slate-850 dark:text-white">₹7,200</td>
                        <td className="py-3 text-amber-600 font-extrabold">Pending</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            VIEW 11: NOTIFICATIONS
            ========================================== */}
        {currentTab === 'notifications' && (
          <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 max-w-2xl mx-auto shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-850 dark:text-white">
                  {t('farmer.notifications_title')}
                </h2>
                <p className="text-xs text-slate-400">Manage received logs and push updates</p>
              </div>
              <button 
                onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                className="text-xs font-bold text-primary-600 hover:underline"
              >
                {t('farmer.mark_all_read')}
              </button>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-12 text-center">Zero messages or notifications.</p>
            ) : (
              <div className="space-y-4">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 rounded-2xl border transition-all flex justify-between items-start gap-4 ${
                      n.read 
                        ? 'border-slate-50 dark:border-slate-800/80 bg-slate-50/20' 
                        : 'border-primary-100 bg-primary-50/10 dark:bg-slate-800'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-slate-200' : 'bg-primary-500 animate-pulse'}`} />
                        <h4 className="font-extrabold text-sm text-slate-850 dark:text-white leading-tight">{n.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-normal">{n.body}</p>
                      <span className="text-[10px] text-slate-400 block">{n.time}</span>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => toggleNotificationRead(n.id)}
                        className="text-[10px] font-bold text-slate-450 hover:text-primary-600 transition"
                      >
                        {n.read ? 'Unread' : 'Read'}
                      </button>
                      <button 
                        onClick={() => deleteNotification(n.id)}
                        className="text-[10px] font-bold text-red-500 hover:underline"
                      >
                        {t('farmer.delete_notification')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            VIEW 12: PROFILE VIEW
            ========================================== */}
        {currentTab === 'profile' && (
          <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 max-w-2xl mx-auto shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-slate-850 dark:text-white pb-3 border-b border-slate-55">
              {t('farmer.profile_details')}
            </h2>

            {/* Split: profile photo + core data */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img src={profilePhoto} className="w-24 h-24 rounded-full object-cover border border-slate-100" alt="" />
                <button 
                  onClick={() => alert('Update photo file selection... (Simulated)')}
                  className="absolute bottom-0 right-0 p-1.5 bg-primary-600 text-white rounded-full border border-white"
                >
                  ✏️
                </button>
              </div>
              <div className="space-y-1 w-full text-center sm:text-left">
                <h3 className="font-extrabold text-lg text-slate-850 dark:text-white">{profileName}</h3>
                <p className="text-xs text-slate-400 font-bold">📍 {village}, {district}, Maharashtra</p>
              </div>
            </div>

            {/* Profile fields details grid */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="border border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50/50">
                <span className="text-[10px] text-slate-400 block">Mobile Number</span>
                <span className="font-bold text-slate-800 dark:text-white block mt-0.5">{profilePhone}</span>
              </div>
              <div className="border border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50/50">
                <span className="text-[10px] text-slate-400 block">Email Address</span>
                <span className="font-bold text-slate-800 dark:text-white block mt-0.5">{profileEmail}</span>
              </div>
              <div className="border border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50/50">
                <span className="text-[10px] text-slate-400 block">Village / Taluka</span>
                <span className="font-bold text-slate-800 dark:text-white block mt-0.5">{village} / {taluka}</span>
              </div>
              <div className="border border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50/50">
                <span className="text-[10px] text-slate-400 block">Farm Size</span>
                <span className="font-bold text-slate-800 dark:text-white block mt-0.5">{farmSize}</span>
              </div>
            </div>

            {/* Bank details card (Protected) */}
            <div className="border border-slate-150 dark:border-slate-800 p-5 rounded-2xl bg-amber-50/20 dark:bg-slate-800/40 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wide">
                {t('farmer.profile_bank_details')}
              </h4>
              
              {showBankDetails ? (
                <div className="text-xs space-y-2 text-slate-500 dark:text-slate-400 font-semibold">
                  <p>Bank Name: <span className="font-bold text-slate-850 dark:text-white">State Bank of India (SBI)</span></p>
                  <p>Account Number: <span className="font-bold text-slate-850 dark:text-white">30910041234</span></p>
                  <p>IFSC Code: <span className="font-bold text-slate-850 dark:text-white">SBIN0001234</span></p>
                  <button 
                    onClick={() => setShowBankDetails(false)}
                    className="text-[10px] font-bold text-red-500 hover:underline block"
                  >
                    Hide details
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowBankDetails(true)}
                  className="py-2 px-4 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl text-slate-750 dark:text-slate-200 hover:bg-slate-100 transition shadow-sm"
                >
                  Show Account Payout details
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const newName = prompt('Enter new Full Name:', profileName);
                  if (newName) setProfileName(newName);
                }}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition text-center"
              >
                {t('farmer.profile_edit')}
              </button>
              <button 
                onClick={() => alert('Change password flow... (Simulated)')}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition text-center bg-white dark:bg-slate-850"
              >
                {t('farmer.profile_change_password')}
              </button>
            </div>

          </div>
        )}

        {/* ==========================================
            VIEW 13: SETTINGS
            ========================================== */}
        {currentTab === 'settings' && (
          <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 max-w-2xl mx-auto shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-slate-850 dark:text-white pb-3 border-b border-slate-55">
              {t('farmer.settings_title')}
            </h2>

            {/* Language */}
            <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide">
                {t('farmer.settings_lang')}
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs rounded-xl font-bold dark:text-white focus:outline-none"
              >
                <option value="en">English (अंग्रेजी)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            {/* Notification settings switches */}
            <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide">
                {t('farmer.settings_notify')}
              </label>
              <div className="space-y-2 text-xs font-bold text-slate-650 dark:text-slate-350">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                  <span>Receive WhatsApp Mandi updates / व्हाट्सएप भाव संदेश</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                  <span>Receive SMS notifications for Buyer orders / एसएमएस सूचनाएं</span>
                </label>
              </div>
            </div>

            {/* Privacy details */}
            <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide">
                {t('farmer.settings_privacy')}
              </label>
              <div className="space-y-2 text-xs font-bold text-slate-650 dark:text-slate-350">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                  <span>Show phone number publicly to transporter drivers</span>
                </label>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="space-y-4 pt-2">
              <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wide">{t('farmer.settings_security')}</h3>
              
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Old Password / पुराना पासवर्ड"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                />
                <input
                  type="password"
                  placeholder="New Password / नया पासवर्ड"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => alert('Password updated successfully! / पासवर्ड सफलतापूर्वक बदला गया!')}
                  className="py-2.5 px-4 bg-slate-800 text-white font-bold rounded-xl text-xs hover:bg-slate-900 transition"
                >
                  Update Password
                </button>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={() => { logout(); onNavigate('landing'); }}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-red-200 text-red-650 font-bold rounded-2xl hover:bg-red-50 transition text-xs"
            >
              <LogOut size={16} />
              <span>{t('farmer.tab_logout')}</span>
            </button>

          </div>
        )}

      </main>

      {/* ==========================================
          MOBILE BOTTOM NAVIGATION BAR
          ========================================== */}
      <footer className="flex lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 justify-around py-3 px-4 z-45 shadow-lg select-none">
        {[
          { id: 'home', label: 'Home', icon: '🏠' },
          { id: 'my-crops', label: 'Crops', icon: '🌾' },
          { id: 'market-prices', label: 'Market', icon: '📊' },
          { id: 'orders', label: 'Orders', icon: '📦' },
          { id: 'profile', label: 'Profile', icon: '👤' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { setCurrentTab(item.id); setSelectedOrder(null); }}
            className="flex flex-col items-center gap-1 cursor-pointer select-none shrink-0"
          >
            <span className={`text-xl flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              currentTab === item.id || (item.id === 'orders' && currentTab === 'order-details')
                ? 'bg-primary-50 text-primary-600' 
                : 'text-slate-400'
            }`}>
              {item.icon}
            </span>
            <span className={`text-[9px] font-extrabold tracking-wide uppercase ${
              currentTab === item.id || (item.id === 'orders' && currentTab === 'order-details')
                ? 'text-primary-650 font-black' 
                : 'text-slate-400 font-bold'
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </footer>

    </div>
  );
}
