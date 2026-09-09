import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Phone, Mail, ArrowRight, ShieldCheck, ShoppingBag, Eye, EyeOff, Building2, CheckCircle2 } from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';

export default function BuyerLoginPage({ onNavigate, setAuthTempData }) {
  const { t } = useTranslation();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('priya@starhotel.in');
  const [password, setPassword] = useState('buyer123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [useOtpMode, setUseOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier) {
      setErrorMsg('Please enter your Business Email or Mobile Number.');
      return;
    }

    if (!useOtpMode && !password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (useOtpMode && (!otpCode || otpCode.length < 4)) {
      setErrorMsg('Please enter the 4-digit verification OTP.');
      return;
    }

    // Determine buyer type and profile based on identifier
    let buyerType = 'Hotel';
    let businessName = 'Grand Heritage Hotel';
    let contactPerson = 'Priya Sharma';

    if (identifier.includes('restaurant') || identifier.includes('taj')) {
      buyerType = 'Restaurant';
      businessName = 'The Spice Route Restaurant';
      contactPerson = 'Chef Vikram Oberoi';
    } else if (identifier.includes('supermarket') || identifier.includes('mart')) {
      buyerType = 'Supermarket';
      businessName = 'Metro Fresh Supermarket';
      contactPerson = 'Anil Deshmukh';
    } else if (identifier.includes('exporter') || identifier.includes('global')) {
      buyerType = 'Exporter';
      businessName = 'AgroGlobal Export Corp';
      contactPerson = 'Rajeev Singhania';
    } else if (identifier.includes('process') || identifier.includes('food')) {
      buyerType = 'Food Processing Company';
      businessName = 'Sahyadri Agro Processing Ltd';
      contactPerson = 'Dr. Manoj Patil';
    }

    const userData = {
      id: 'usr_buyer_' + Date.now().toString(36),
      username: contactPerson,
      businessName,
      buyerType,
      email: identifier.includes('@') ? identifier : `${identifier.replace(/\D/g, '')}@buyer.agrinova.in`,
      phone: identifier.replace(/\D/g, '') || '9876543210',
      role: 'BUYER',
      verificationStatus: 'VERIFIED',
      district: 'Pune',
      city: 'Pune',
      state: 'Maharashtra',
      verified: true
    };

    login(userData);
    onNavigate('buyer-dashboard');
  };

  const handleSendOtp = () => {
    if (!identifier) {
      setErrorMsg('Please enter your mobile number or business email to receive OTP.');
      return;
    }
    setIsOtpSent(true);
    setOtpCode('1234'); // Simulated OTP auto-fill
    setErrorMsg('');
  };

  const fastFillBuyer = (type, name, email, pass, contact) => {
    setIdentifier(email);
    setPassword(pass);
    setUseOtpMode(false);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5] dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2">
          <BrandLogo 
            size="md" 
            subtitle="Commercial Buyer Portal"
            onClick={() => onNavigate('landing')}
          />
        </div>

        <div className="text-center mt-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Source Fresh Produce Directly From Farmers
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Connect with verified farmers, discover agricultural products, and manage bulk procurement across Maharashtra.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        
        {/* Main Card */}
        <div className="bg-white dark:bg-slate-850 py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-700 dark:text-red-300 rounded-2xl text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Identifier input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                Business Email / Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. procurement@hotel.com or 9876543210"
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
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ) : (
              /* OTP Verification Mode */
              <div className="space-y-3 p-4 bg-primary-50/50 dark:bg-primary-950/20 rounded-2xl border border-primary-100 dark:border-primary-900/30">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-primary-900 dark:text-primary-300">
                    Mobile OTP Verification
                  </span>
                  {!isOtpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs font-black text-primary-600 hover:underline"
                    >
                      Send OTP →
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      OTP Sent (1234)
                    </span>
                  )}
                </div>

                {isOtpSent && (
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-primary-300 dark:border-primary-700 rounded-xl text-center tracking-widest font-black text-base dark:text-white"
                  />
                )}
              </div>
            )}

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm rounded-2xl transition shadow-lg shadow-primary-600/20 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Login to Buyer Portal</span>
              <ArrowRight size={16} />
            </button>

            {/* Alternative OTP Switch */}
            <button
              type="button"
              onClick={() => {
                setUseOtpMode(!useOtpMode);
                setErrorMsg('');
                if (!useOtpMode && !isOtpSent) handleSendOtp();
              }}
              className="w-full py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold text-xs rounded-2xl transition"
            >
              {useOtpMode ? 'Switch to Password Login' : 'Continue with Mobile OTP'}
            </button>

          </form>

          {/* Quick Fast-fill Board for Testing Buyer Types */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-2.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block text-center">
              Quick Test: Select Buyer Category (B2F & B2B)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fastFillBuyer('Hotel', 'Grand Heritage Palace Hotel', 'procure@heritagehotel.in', 'buyer123', 'Priya Sharma')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">🏨 Hotel / Hospitality</span>
                <span className="text-[10px] text-slate-400 block">B2B Wholesale Buyer</span>
              </button>

              <button
                type="button"
                onClick={() => fastFillBuyer('Mandi / Wholesale Market', 'Lasalgaon Mandi Traders Consortium', 'trade@lasalgaonmandi.in', 'buyer123', 'Suresh Mandlik')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-850 dark:text-white block">🏬 Mandi Wholesaler / Trader</span>
                <span className="text-[10px] text-slate-400 block">Inter-Trader Consolidator</span>
              </button>

              <button
                type="button"
                onClick={() => fastFillBuyer('Exporter', 'AgroGlobal Export Corp', 'trade@exporter.com', 'buyer123', 'Rajeev Singhania')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">🚢 Exporter</span>
                <span className="text-[10px] text-slate-400 block">Pre-Graded Bulk Lots</span>
              </button>

              <button
                type="button"
                onClick={() => fastFillBuyer('Restaurant', 'The Spice Route Dining', 'chef@spiceroute.in', 'buyer123', 'Chef Vikram Oberoi')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">🍽️ Restaurant</span>
                <span className="text-[10px] text-slate-400 block">🌱 Farm-Direct Sourcing</span>
              </button>

              <button
                type="button"
                onClick={() => fastFillBuyer('Food Processing Company', 'Sahyadri Fruit Pulp & Cannery Ltd', 'supply@sahyadripulp.com', 'buyer123', 'Dr. Nitin Kulkarni')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">🏭 Food Processor</span>
                <span className="text-[10px] text-slate-400 block">High-Volume Industrial Lots</span>
              </button>

              <button
                type="button"
                onClick={() => fastFillBuyer('Supermarket', 'Metro Fresh Mart Chains', 'purchase@metrofresh.in', 'buyer123', 'Anil Deshmukh')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">🛒 Supermarket Chain</span>
                <span className="text-[10px] text-slate-400 block">Multi-Crop Contracts</span>
              </button>
            </div>
          </div>

          {/* Registration Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('buyer-register')}
                className="font-extrabold text-primary-600 hover:underline"
              >
                Register as Buyer
              </button>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
