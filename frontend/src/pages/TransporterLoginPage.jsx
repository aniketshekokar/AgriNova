import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Truck, Sprout, ShieldCheck, ArrowRight, Phone, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';

export default function TransporterLoginPage({ onNavigate }) {
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
      setErrorMsg('Please enter your registered mobile number or email.');
      return;
    }

    if (!useOtpMode && !password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (useOtpMode && otpCode.length < 4) {
      setErrorMsg('Please enter the 4-digit OTP sent to your phone.');
      return;
    }

    // Authenticate transporter
    const success = login(identifier, password || 'transporter123', 'transporter');
    if (success) {
      onNavigate('transporter-dashboard');
    } else {
      setErrorMsg('Invalid login credentials or pending verification.');
    }
  };

  const fastFillDriver = (name, phone, vehicleType, vehicleNo, route) => {
    setIdentifier(phone);
    setPassword('transporter123');
    setUseOtpMode(false);
    
    // Store profile metadata
    const userPayload = {
      username: name,
      name: name,
      mobile: phone,
      email: `${phone}@logistics.agrinova.in`,
      role: 'transporter',
      vehicleType: vehicleType,
      vehicleNumber: vehicleNo,
      route: route,
      verificationStatus: 'APPROVED',
      rating: 4.8,
      completedDeliveries: 186
    };
    
    try {
      localStorage.setItem('agrinova-user', JSON.stringify(userPayload));
    } catch(e) {}
    
    const success = login(phone, 'transporter123', 'transporter');
    if (success) {
      onNavigate('transporter-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5] dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex items-center justify-center gap-2">
          <BrandLogo 
            size="md" 
            subtitle="AgriLogistics Transporter Portal"
            onClick={() => onNavigate('landing')}
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-6">
          Move Agricultural Products.<br />Earn on Every Delivery.
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed font-semibold">
          Dedicated logistics portal connecting Maharashtra farm pickups with mandi wholesalers and commercial buyers.
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
                Mobile Number / Registered Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9822114477 or driver@logistics.com"
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
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                  4-Digit Mobile OTP
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
              <span>{useOtpMode ? 'Verify OTP & Login' : 'Login to AgriLogistics'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Fast-fill Board for Driver Testing */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-2.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block text-center">
              Quick Test: Select Driver Profile
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fastFillDriver('Satnam Singh', '9822114477', 'Pickup', 'MH-12-AB-1234', 'Nashik ➔ Pune Route')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">🚚 Satnam Singh</span>
                <span className="text-[10px] text-slate-400 block">Pickup (MH-12-AB-1234)</span>
              </button>

              <button
                type="button"
                onClick={() => fastFillDriver('Ranjit Shinde', '9845001122', 'Mini Truck', 'MH-15-CD-5678', 'Pune ➔ Mumbai APMC')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">🚛 Ranjit Shinde</span>
                <span className="text-[10px] text-slate-400 block">Mini Truck (3.5 Ton)</span>
              </button>

              <button
                type="button"
                onClick={() => fastFillDriver('Mahendra Jadhav', '9422003344', 'Truck', 'MH-20-EF-9012', 'Latur ➔ Nagpur Grain Hub')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">🚚 Mahendra Jadhav</span>
                <span className="text-[10px] text-slate-400 block">Heavy Truck (10 Ton)</span>
              </button>

              <button
                type="button"
                onClick={() => fastFillDriver('Santosh Gaikwad', '9890112233', 'Refrigerated Vehicle', 'MH-14-GH-3456', 'Nashik Export Cold Chain')}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">❄️ Santosh Gaikwad</span>
                <span className="text-[10px] text-slate-400 block">Reefer Cold Van</span>
              </button>
            </div>
          </div>

          {/* Registration Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              New Transporter / Driver?{' '}
              <button
                type="button"
                onClick={() => onNavigate('transporter-register')}
                className="font-extrabold text-primary-600 hover:underline"
              >
                Register as Transporter
              </button>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
