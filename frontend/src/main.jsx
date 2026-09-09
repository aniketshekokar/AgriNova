import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './layouts/Navbar';
import LandingPage from './pages/LandingPage';
import MarketplacePage from './pages/MarketplacePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AuthWelcomePage from './pages/AuthWelcomePage';
import AuthOtpPage from './pages/AuthOtpPage';
import AuthForgotPasswordPage from './pages/AuthForgotPasswordPage';
import AuthResetPasswordPage from './pages/AuthResetPasswordPage';
import AuthSuccessPage from './pages/AuthSuccessPage';
import DeliveryTrackingPage from './pages/DeliveryTrackingPage';
import TransporterDeliveryPage from './pages/TransporterDeliveryPage';
import MarketMapPage from './pages/MarketMapPage';
import FarmerDashboard from './dashboard/FarmerDashboard';
import BuyerDashboard from './dashboard/BuyerDashboard';
import TransporterDashboard from './dashboard/TransporterDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import BuyerLoginPage from './pages/BuyerLoginPage';
import BuyerRegisterPage from './pages/BuyerRegisterPage';
import TransporterLoginPage from './pages/TransporterLoginPage';
import TransporterRegisterPage from './pages/TransporterRegisterPage';
import AgriTradeLoginPage from './pages/AgriTradeLoginPage';
import AgriTradeRegisterPage from './pages/AgriTradeRegisterPage';
import AgriTradeDashboard from './dashboard/AgriTradeDashboard';
import { initialCrops, initialOrders, initialAgmarknetPrices } from './utils/mockData';
import api from './services/api';
import './index.css';

function App() {
  const getInitialPage = () => {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash) {
      if (['farmer-dashboard', 'farmer', 'kisan'].includes(hash)) return 'farmer-dashboard';
      if (['buyer-dashboard', 'buyer'].includes(hash)) return 'buyer-dashboard';
      if (['agritrade-dashboard', 'agritrade'].includes(hash)) return 'agritrade-dashboard';
      if (['transporter-dashboard', 'transporter'].includes(hash)) return 'transporter-dashboard';
      if (['admin-dashboard', 'admin'].includes(hash)) return 'admin-dashboard';
      return hash;
    }
    return 'landing';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (hash) {
        if (['farmer-dashboard', 'farmer', 'kisan'].includes(hash)) setCurrentPage('farmer-dashboard');
        else if (['buyer-dashboard', 'buyer'].includes(hash)) setCurrentPage('buyer-dashboard');
        else if (['agritrade-dashboard', 'agritrade'].includes(hash)) setCurrentPage('agritrade-dashboard');
        else if (['transporter-dashboard', 'transporter'].includes(hash)) setCurrentPage('transporter-dashboard');
        else if (['admin-dashboard', 'admin'].includes(hash)) setCurrentPage('admin-dashboard');
        else setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const [crops, setCrops] = useState(() => {
    try {
      const saved = localStorage.getItem('agrinova-crops');
      return saved ? JSON.parse(saved) : initialCrops;
    } catch {
      return initialCrops;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('agrinova-orders');
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [marketPrices, setMarketPrices] = useState(initialAgmarknetPrices);

  useEffect(() => {
    localStorage.setItem('agrinova-crops', JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem('agrinova-orders', JSON.stringify(orders));
  }, [orders]);

  // Initial load from backend API
  useEffect(() => {
    const fetchInitialData = async () => {
      // 1. Fetch live market prices
      try {
        const res = await api.get('/prices');
        if (res.success && res.data?.length > 0) {
          setMarketPrices(res.data);
        }
      } catch (e) {
        console.warn('Using initial fallback AGMARKNET prices cache');
      }

      // 2. Fetch live crops
      try {
        const resCrops = await api.get('/crops');
        if (resCrops.success && resCrops.data?.length > 0) {
          setCrops(resCrops.data);
        }
      } catch (e) {
        console.warn('Using local crops store');
      }

      // 3. Fetch live orders
      try {
        const resOrders = await api.get('/orders');
        if (resOrders.success && resOrders.data?.length > 0) {
          setOrders(resOrders.data);
        }
      } catch (e) {
        console.warn('Using local orders store');
      }
    };
    fetchInitialData();
  }, []);

  const handleSyncPrices = async () => {
    try {
      const res = await api.post('/prices/sync');
      if (res.success) {
        const res2 = await api.get('/prices');
        if (res2.success && res2.data) {
          setMarketPrices(res2.data);
        }
      }
      return res;
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  const [authRole, setAuthRole] = useState('FARMER');
  const [authTempData, setAuthTempData] = useState({
    role: 'FARMER',
    phone: '',
    email: '',
    username: '',
    password: '',
    flowType: 'login'
  });

  // Navigation controller helper
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo(0, 0);
  };

  // 1. Farmer & Admin crop listings
  const handleAddCrop = (newCrop) => {
    setCrops([newCrop, ...crops]);
  };

  const handleDeleteCrop = (cropId) => {
    setCrops(crops.filter(c => c.id !== cropId));
  };

  // 2. Buyer order placement
  const handlePlaceOrder = (newOrder) => {
    setOrders([newOrder, ...orders]);
    
    // Decrement corresponding crop quantity
    setCrops(crops.map(c => {
      if (c.id === newOrder.cropId) {
        const remaining = c.quantity - newOrder.quantity;
        return { ...c, quantity: Math.max(0, remaining) };
      }
      return c;
    }));
  };

  // 3. Transporter assignments & transits
  const handleAcceptOrder = (orderId, driverId, driverName, vehicleNumber, vehicleType) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return { 
          ...o, 
          status: 'Picked Up', // changes to Picked Up so driver can verify quality
          transporterId: driverId, 
          transporterName: driverName,
          vehicleNumber,
          vehicleType
        };
      }
      return o;
    }));
  };

  const handleStartPickup = (orderId) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'Picked Up' };
      }
      return o;
    }));
  };

  const handleVerifyQuality = (orderId, qualityReport) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return { 
          ...o, 
          status: 'In Transit', 
          qualityReport
        };
      }
      return o;
    }));
  };

  // 4. Buyer completes delivery (releases escrow payment)
  const handleCompleteOrder = (orderId) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'Completed', deliveryDate: new Date().toISOString().split('T')[0] };
      }
      return o;
    }));
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-slate-50/50 transition-colors duration-200">
            
            {/* Main Navigation (Shown on public & auth pages; hidden on dedicated dashboards with their own navbar/sidebar) */}
            {!['farmer-dashboard', 'buyer-dashboard', 'agritrade-dashboard', 'transporter-dashboard', 'admin-dashboard'].includes(currentPage) && (
              <Navbar onNavigate={navigateTo} currentPage={currentPage} />
            )}

            {/* Core Content Area */}
            <main className="flex-1">
              {currentPage === 'landing' && (
                <LandingPage onNavigate={navigateTo} />
              )}
              
              {currentPage === 'marketplace' && (
                <MarketplacePage 
                  onNavigate={navigateTo} 
                  crops={crops} 
                  onPlaceOrder={handlePlaceOrder} 
                />
              )}

              {currentPage === 'auth-welcome' && (
                <AuthWelcomePage onNavigate={navigateTo} onSelectRole={setAuthRole} />
              )}

              {currentPage === 'login' && (
                <LoginPage 
                  onNavigate={navigateTo} 
                  role={authRole} 
                  setRole={setAuthRole} 
                  setAuthTempData={setAuthTempData} 
                />
              )}

              {currentPage === 'signup' && (
                <SignUpPage 
                  onNavigate={navigateTo} 
                  role={authRole} 
                  setRole={setAuthRole} 
                  setAuthTempData={setAuthTempData} 
                />
              )}

              {currentPage === 'auth-otp' && (
                <AuthOtpPage 
                  onNavigate={navigateTo} 
                  authTempData={authTempData} 
                  setAuthTempData={setAuthTempData} 
                />
              )}

              {currentPage === 'auth-forgot' && (
                <AuthForgotPasswordPage 
                  onNavigate={navigateTo} 
                  setAuthTempData={setAuthTempData} 
                  role={authRole} 
                />
              )}

              {currentPage === 'auth-reset' && (
                <AuthResetPasswordPage onNavigate={navigateTo} />
              )}

              {currentPage === 'auth-success' && (
                <AuthSuccessPage 
                  onNavigate={navigateTo} 
                  authTempData={authTempData} 
                />
              )}

              {currentPage === 'farmer-dashboard' && (
                <FarmerDashboard 
                  crops={crops} 
                  onAddCrop={handleAddCrop}
                  orders={orders}
                  marketPrices={marketPrices}
                  onSyncPrices={handleSyncPrices}
                  onNavigate={navigateTo}
                />
              )}

              {currentPage === 'buyer-login' && (
                <BuyerLoginPage 
                  onNavigate={navigateTo} 
                  setAuthTempData={setAuthTempData} 
                />
              )}

              {currentPage === 'buyer-register' && (
                <BuyerRegisterPage onNavigate={navigateTo} />
              )}

              {currentPage === 'buyer-dashboard' && (
                <BuyerDashboard 
                  orders={orders}
                  onCompleteOrder={handleCompleteOrder}
                  onNavigate={navigateTo}
                  marketPrices={marketPrices}
                  onSyncPrices={handleSyncPrices}
                />
              )}

              {currentPage === 'agritrade-login' && (
                <AgriTradeLoginPage onNavigate={navigateTo} />
              )}

              {currentPage === 'agritrade-register' && (
                <AgriTradeRegisterPage onNavigate={navigateTo} />
              )}

              {currentPage === 'agritrade-dashboard' && (
                <AgriTradeDashboard 
                  orders={orders}
                  onNavigate={navigateTo}
                  marketPrices={marketPrices}
                  onSyncPrices={handleSyncPrices}
                />
              )}

              {currentPage === 'transporter-login' && (
                <TransporterLoginPage onNavigate={navigateTo} />
              )}

              {currentPage === 'transporter-register' && (
                <TransporterRegisterPage onNavigate={navigateTo} />
              )}

              {currentPage === 'transporter-dashboard' && (
                <TransporterDashboard 
                  orders={orders}
                  onAcceptOrder={handleAcceptOrder}
                  onStartPickup={handleStartPickup}
                  onVerifyQuality={handleVerifyQuality}
                  onCompleteOrder={handleCompleteOrder}
                  onNavigate={navigateTo}
                />
              )}

              {currentPage === 'admin-dashboard' && (
                <AdminDashboard 
                  crops={crops}
                  orders={orders}
                  marketPrices={marketPrices}
                  onSyncPrices={handleSyncPrices}
                  onAddCrop={handleAddCrop}
                  onDeleteCrop={handleDeleteCrop}
                  onNavigate={navigateTo}
                />
              )}

              {currentPage === 'delivery-tracking' && (
                <DeliveryTrackingPage 
                  orderId="AGR1024" 
                  onNavigate={navigateTo} 
                />
              )}

              {currentPage === 'transporter-workspace' && (
                <TransporterDeliveryPage 
                  orderId="AGR1024" 
                  onNavigate={navigateTo} 
                />
              )}

              {currentPage === 'market-map' && (
                <MarketMapPage onNavigate={navigateTo} />
              )}
            </main>

          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
