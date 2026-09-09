import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import AuthLayout from '../components/auth/AuthLayout';
import AuthButton from '../components/auth/AuthButton';
import { CheckCircle } from 'lucide-react';

export default function AuthSuccessPage({ onNavigate, authTempData }) {
  const { t } = useTranslation();

  const handleDashboardRedirect = () => {
    const role = (authTempData?.role || 'FARMER').toUpperCase();
    if (role === 'FARMER') onNavigate('farmer-dashboard');
    else if (role === 'BUYER') onNavigate('buyer-dashboard');
    else if (role === 'TRANSPORTER') onNavigate('transporter-dashboard');
    else if (role === 'AGRITRADE') onNavigate('agritrade-dashboard');
    else if (role === 'ADMIN') onNavigate('admin-dashboard');
    else onNavigate('farmer-dashboard');
  };

  return (
    <AuthLayout>
      <div className="text-center space-y-6 py-4">
        
        {/* Animated green check circle */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-100 dark:border-emerald-900/30 shadow-md">
          <CheckCircle size={44} className="animate-bounce" />
        </div>
        
        {/* Messages */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">
            {t('auth.success_title')}
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold max-w-sm mx-auto">
            {authTempData.flowType === 'signup' 
              ? t('auth.success_subtitle') 
              : 'You have logged in successfully to your agricultural workspace. / आप अपने कृषि कार्यक्षेत्र में सफलतापूर्वक लॉगिन हो चुके हैं।'}
          </p>
        </div>

        {/* Dashboard button */}
        <div className="pt-4">
          <AuthButton onClick={handleDashboardRedirect}>
            {t('auth.go_to_dashboard')}
          </AuthButton>
        </div>

      </div>
    </AuthLayout>
  );
}
