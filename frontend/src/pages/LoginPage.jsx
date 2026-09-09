import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import InputField from '../components/auth/InputField';
import PasswordField from '../components/auth/PasswordField';
import AuthButton from '../components/auth/AuthButton';
import FormError from '../components/auth/FormError';
import { Phone, ShieldCheck } from 'lucide-react';

export default function LoginPage({ onNavigate, role, setRole, setAuthTempData }) {
  const { t } = useTranslation();
  const { login, loading } = useAuth();
  
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' or 'password'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, val) => {
    if (field === 'identifier') setIdentifier(val);
    if (field === 'password') setPassword(val);
    setFormErrors({ ...formErrors, [field]: '' });
    setError('');
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');

    const errs = {};
    if (!identifier.trim()) errs.identifier = t('auth.err_required');
    if (!password) errs.password = t('auth.err_required');

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      setError(t('auth.err_required'));
      return;
    }

    const result = await login(identifier, password, role);
    if (result.success) {
      const userRole = (result.user?.role || role || 'FARMER').toUpperCase();
      setAuthTempData({
        role: userRole,
        username: result.user?.username,
        flowType: 'login'
      });
      if (userRole === 'FARMER') {
        onNavigate('farmer-dashboard');
      } else if (userRole === 'BUYER') {
        onNavigate('buyer-dashboard');
      } else if (userRole === 'TRANSPORTER') {
        onNavigate('transporter-dashboard');
      } else if (userRole === 'AGRITRADE') {
        onNavigate('agritrade-dashboard');
      } else if (userRole === 'ADMIN') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('farmer-dashboard');
      }
    } else {
      setError(result.message || result.error || 'Login failed / लॉगिन विफल');
    }
  };

  const handleOtpLoginRequest = (e) => {
    e.preventDefault();
    setError('');
    
    if (!identifier.trim()) {
      setFormErrors({ identifier: t('auth.err_required') });
      setError(t('auth.err_required'));
      return;
    }

    if (!/^\d{10}$/.test(identifier.trim())) {
      setFormErrors({ identifier: t('auth.err_phone_invalid') });
      setError(t('auth.err_phone_invalid'));
      return;
    }

    // Set temp auth states and navigate to OTP verification view
    setAuthTempData({
      role: role,
      phone: identifier.trim(),
      flowType: 'login'
    });

    onNavigate('auth-otp');
  };

  // Fast-fill helper to login with demo credentials
  const fillDemoCredentials = (selectedRole) => {
    setRole(selectedRole);
    setFormErrors({});
    setError('');
    if (selectedRole === 'FARMER') {
      setIdentifier('9823456789');
      setPassword('farmer123');
      setLoginMethod('password'); // Auto-switch to password mode for demo fast fill
    } else if (selectedRole === 'BUYER') {
      setIdentifier('grocer@citygrocer.in');
      setPassword('buyer123');
      setLoginMethod('password'); // Auto-switch to password mode for demo fast fill
    } else if (selectedRole === 'TRANSPORTER') {
      setIdentifier('driver');
      setPassword('driver123');
      setLoginMethod('password'); // Auto-switch to password mode for demo fast fill
    } else if (selectedRole === 'ADMIN') {
      setIdentifier('admin');
      setPassword('admin123');
      setLoginMethod('password'); // Auto-switch to password mode for demo fast fill
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        
        {/* Title */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">
            {role === 'FARMER' ? t('auth.welcome_back_farmer') : t('auth.login_welcome')}
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold mt-1">
            {t('auth.login_subtitle')}
          </p>
        </div>

        {/* Global error block */}
        <FormError message={error} />

        {/* Role Toggle Selector */}
        <div>
          <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2">
            {t('auth.who_are_you')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'FARMER', label: '👨‍🌾 ' + t('auth.role_farmer') },
              { id: 'BUYER', label: '🛒 ' + t('auth.role_buyer') },
              { id: 'TRANSPORTER', label: '🚚 ' + t('auth.role_transporter') }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => { setRole(item.id); setError(''); setFormErrors({}); }}
                className={`py-3 text-xs font-bold rounded-2xl border transition-all ${
                  role === item.id 
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' 
                    : 'border-slate-100 hover:bg-slate-50 text-slate-600 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Universal login option segmented control for all roles */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setLoginMethod('otp')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition ${
              loginMethod === 'otp'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            💬 Mobile OTP / ओटीपी
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('password')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition ${
              loginMethod === 'password'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow'
                : 'text-slate-400 dark:text-slate-550'
            }`}
          >
            🔑 Password / पासवर्ड
          </button>
        </div>

        {/* Universal Auth forms depending on toggle */}
        <div className="space-y-5">
          {loginMethod === 'otp' ? (
            /* OTP Request Form (Universal) */
            <form onSubmit={handleOtpLoginRequest} className="space-y-4">
              <InputField
                label={t('auth.mobile_number')}
                type="tel"
                icon={Phone}
                placeholder="e.g. 9876543210"
                value={identifier}
                onChange={(e) => handleInputChange('identifier', e.target.value)}
                error={formErrors.identifier}
                maxLength={10}
                required
              />
              <AuthButton loading={loading}>
                {t('auth.get_otp')}
              </AuthButton>
            </form>
          ) : (
            /* Password Form (Universal) */
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <InputField
                label={role === 'BUYER' ? t('common.email') + ' / ' + t('auth.mobile_number') : t('auth.mobile_number')}
                type="text"
                icon={Phone}
                placeholder={role === 'BUYER' ? 'e.g. buyer@store.com or 9876543210' : 'e.g. 9876543210'}
                value={identifier}
                onChange={(e) => handleInputChange('identifier', e.target.value)}
                error={formErrors.identifier}
                required
              />
              
              <PasswordField
                label={t('common.password')}
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={formErrors.password}
                required
              />
              
              <div className="flex justify-between items-center text-xs font-bold text-primary-600">
                <button 
                  type="button" 
                  onClick={() => onNavigate('auth-forgot')}
                  className="hover:underline"
                >
                  {t('auth.forgot_password')}
                </button>
              </div>

              <AuthButton loading={loading}>
                {t('auth.login_btn')}
              </AuthButton>
            </form>
          )}
        </div>

        {/* Demo Fast Login Box for evaluation */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 text-center flex justify-center items-center gap-1">
              <ShieldCheck size={12} className="text-primary-600" />
              <span>MVP Demo Fast-Fill Login</span>
            </span>
            <div className="grid grid-cols-4 gap-2">
              <button 
                type="button" 
                onClick={() => fillDemoCredentials('FARMER')}
                className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2 px-1 rounded-xl text-slate-700 dark:text-slate-350 hover:bg-slate-100"
              >
                🌾 Farmer
              </button>
              <button 
                type="button" 
                onClick={() => fillDemoCredentials('BUYER')}
                className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2 px-1 rounded-xl text-slate-700 dark:text-slate-350 hover:bg-slate-100"
              >
                🛒 Buyer
              </button>
              <button 
                type="button" 
                onClick={() => fillDemoCredentials('TRANSPORTER')}
                className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2 px-1 rounded-xl text-slate-700 dark:text-slate-350 hover:bg-slate-100"
              >
                🚚 Driver
              </button>
              <button 
                type="button" 
                onClick={() => fillDemoCredentials('ADMIN')}
                className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2 px-1 rounded-xl text-slate-700 dark:text-slate-350 hover:bg-slate-100"
              >
                🛠️ Admin
              </button>
            </div>
          </div>
        </div>

        {/* Create Account Link */}
        <div className="text-center text-xs font-bold text-slate-500">
          {t('auth.dont_have_account')}{' '}
          <button 
            onClick={() => onNavigate('auth-welcome')}
            className="text-primary-600 hover:underline font-extrabold"
          >
            {t('auth.create_account')}
          </button>
        </div>

      </div>
    </AuthLayout>
  );
}
