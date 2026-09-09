import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import AuthLayout from '../components/auth/AuthLayout';
import AuthButton from '../components/auth/AuthButton';

export default function AuthWelcomePage({ onNavigate, onSelectRole }) {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState('FARMER');

  const roles = [
    {
      id: 'FARMER',
      title: t('auth.role_farmer'),
      description: t('auth.role_farmer_desc'),
      icon: '👨‍🌾',
      bgClass: 'hover:border-emerald-500 hover:bg-emerald-50/10'
    },
    {
      id: 'BUYER',
      title: t('auth.role_buyer'),
      description: t('auth.role_buyer_desc'),
      icon: '🛒',
      bgClass: 'hover:border-amber-500 hover:bg-amber-50/10'
    },
    {
      id: 'TRANSPORTER',
      title: t('auth.role_transporter'),
      description: t('auth.role_transporter_desc'),
      icon: '🚚',
      bgClass: 'hover:border-blue-500 hover:bg-blue-50/10'
    }
  ];

  const handleContinue = () => {
    onSelectRole(selectedRole);
    onNavigate('signup');
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        
        {/* Header Text */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">
            {t('auth.welcome_title')}
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold mt-1">
            {t('auth.welcome_choose')}
          </p>
        </div>

        {/* Role Cards List */}
        <div className="space-y-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full p-5 rounded-3xl border text-left flex items-start gap-4 transition select-none cursor-pointer ${
                selectedRole === role.id 
                  ? 'border-primary-500 bg-primary-50/40 dark:bg-slate-800/80 ring-2 ring-primary-500/25 shadow-sm' 
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 hover:shadow-md'
              } ${role.bgClass}`}
            >
              {/* Large Icon Box */}
              <span className="text-4xl shrink-0 p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                {role.icon}
              </span>
              
              {/* Card info */}
              <div className="space-y-1">
                <span className="block font-extrabold text-base text-slate-850 dark:text-white">
                  {role.title}
                </span>
                <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 leading-normal">
                  {role.description}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="pt-2">
          <AuthButton onClick={handleContinue}>
            {t('auth.continue')}
          </AuthButton>
        </div>

        {/* Already have an account link */}
        <div className="text-center text-xs font-bold text-slate-500">
          {t('auth.already_have_account')}{' '}
          <button 
            onClick={() => onNavigate('login')}
            className="text-primary-600 hover:underline font-extrabold"
          >
            {t('nav.login')}
          </button>
        </div>

      </div>
    </AuthLayout>
  );
}
