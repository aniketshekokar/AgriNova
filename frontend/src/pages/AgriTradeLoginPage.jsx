import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Building2, Sprout, ShieldCheck, ArrowRight, Phone, Lock, Eye, EyeOff, CheckCircle2, Store } from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';

export default function AgriTradeLoginPage({ onNavigate }) {
  const { t } = useTranslation();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useOtpMode, setUseOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your business registered email or mobile number.');
      return;
    }

    if (!useOtpMode && !password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (useOtpMode && otpCode.length < 4) {
      setErrorMsg('Please enter the 4-digit OTP sent to your business mobile.');
      return;
    }

    // Authenticate business buyer
    const success = login(identifier, password || 'business123', 'business_buyer');
    if (success) {
      onNavigate('agritrade-dashboard');
    } else {
      setErrorMsg('Invalid credentials or business verification pending.');
    }
  };

  const fastFillEnterprise = (name, phone, type, location, gst) => {
    setIdentifier(phone);
    setPassword('business123');
    setUseOtpMode(false);

    const userPayload = {
      username: name,
      name: name,
      businessName: name,
      businessType: type,
      mobile: phone,
      email: `${phone}@agritrade.agrinova.in`,
      role: 'business_buyer',
      location: location,
      gstNumber: gst,
      verificationStatus: 'APPROVED'
    };

    try {
      localStorage.setItem('agrinova-user', JSON.stringify(userPayload));
    } catch(e) {}

    const success = login(phone, 'business123', 'business_buyer');
    if (success) {
      onNavigate('agritrade-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5] dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex items-center justify-center gap-2">
          <BrandLogo 
            size="md" 
            subtitle="AgriTrade B2B Enterprise"
            onClick={() => onNavigate('landing')}
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-6">
          Connect. Source. Distribute.
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed font-semibold">
          The Secondary Agricultural B2B Marketplace connecting Wholesalers, Food Processors, Exporters, Hotels & Retail Chains.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        
        {/* Main Card */}
        <div className="bg-white dark:bg-slate-850 py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-700 dark:text-red-300 rounded-2xl text-xs font-bold animate-fade-in">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Identifier input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                Business Email / Registered Mobile
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. procurement@heritagehotels.com or 9822998877"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Standard Password Mode */}
            {!useOtpMode ? (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('auth-forgot')}
                    className="text-xs font-bold text-primary-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter business password"
                    className="w-full px-4 py-3 pr-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                  4-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 4-digit code (e.g. 1234)"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-black tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white"
                />
              </div>
            )}

            {/* Remember Me & OTP Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => setUseOtpMode(!useOtpMode)}
                className="text-xs font-extrabold text-amber-600 dark:text-amber-400 hover:underline"
              >
                {useOtpMode ? 'Login with Password' : 'Continue with OTP →'}
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm rounded-2xl transition shadow-lg shadow-primary-600/20 active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            >
              <span>{useOtpMode ? 'Verify OTP & Login' : 'Login to AgriTrade'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Fast-fill Board for Business Testing */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-2.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block text-center">
              Quick Test: Select Business Profile
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fastFillEnterprise('Grand Heritage Palace Hotels', '9822998811', 'Hotel', 'Pune / Mumbai', '27AAACG1234F1Z5')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-850 dark:text-white block">🏨 Grand Heritage Palace</span>
                <span className="text-[10px] text-slate-400 block">5-Star Luxury Hotel Chain</span>
              </button>

              <button
                type="button"
                onClick={() => fastFillEnterprise('The Spice Route Kitchens', '9845007788', 'Restaurant', 'Mumbai / Thane', '27AABCT9988M1Z2')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-850 dark:text-white block">🍽️ Spice Route Kitchens</span>
                <span className="text-[10px] text-slate-400 block">24 Multi-City Outlets</span>
              </button>

              <button
                type="button"
                onClick={() => fastFillEnterprise('AgroGlobal Export Corp', '9890114455', 'Exporter', 'JNPT / Navi Mumbai', '27AAECF5544N1Z8')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-850 dark:text-white block">🚢 AgroGlobal Export</span>
                <span className="text-[10px] text-slate-400 block">Global Produce Exporter</span>
              </button>

              <button
                type="button"
                onClick={() => fastFillEnterprise('Lasalgaon APMC Traders', '9422005566', 'Mandi / Wholesale Market', 'Lasalgaon, Nashik', '27AADCP3322K1Z9')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-850 dark:text-white block">🏬 Lasalgaon Mandi Traders</span>
                <span className="text-[10px] text-slate-400 block">Primary APMC Wholesaler</span>
              </button>

              <button
                type="button"
                onClick={() => fastFillEnterprise('Sahyadri Fruit & Pulp Ltd', '9822338844', 'Food Processing Company', 'Nashik Mega Food Park', '27AAGCS7766P1Z3')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-850 dark:text-white block">🏭 Sahyadri Fruit & Pulp</span>
                <span className="text-[10px] text-slate-400 block">Commercial Food Processor</span>
              </button>

              <button
                type="button"
                onClick={() => fastFillEnterprise('Metro Fresh Marts Ltd', '9811227700', 'Supermarket', '18 Stores across Maharashtra', '27AALCM1199R1Z1')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-850 dark:text-white block">🛒 Metro Fresh Marts</span>
                <span className="text-[10px] text-slate-400 block">Supermarket Retail Chain</span>
              </button>
            </div>
          </div>

          {/* Registration Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Looking to register your enterprise?{' '}
              <button
                type="button"
                onClick={() => onNavigate('agritrade-register')}
                className="font-extrabold text-primary-600 hover:underline"
              >
                Register Your Business
              </button>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
