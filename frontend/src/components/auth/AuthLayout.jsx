import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Sprout, ShieldCheck, Globe } from 'lucide-react';
import authBanner from '../../assets/auth_banner.png';
import BrandLogo from '../common/BrandLogo';

export default function AuthLayout({ children, currentStepTitle }) {
  const { t, lang, setLang } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50/50 dark:bg-slate-900 transition-colors duration-200">
      
      {/* Left Column: Visual AgriTech Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-800 text-white overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <img 
            src={authBanner} 
            alt="AGRINOVA" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Decorative ambient blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-700/30 rounded-full blur-3xl z-10" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl z-10" />
        
        {/* Brand header */}
        <BrandLogo 
          size="lg"
          textColor="text-white"
          subtitle={t('nav.tagline')}
          className="relative z-20"
        />

        {/* Core Value Statement */}
        <div className="relative z-20 max-w-md my-auto space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight text-white">
            {t('landing.hero_title')}
          </h2>
          <p className="text-sm text-primary-100/90 leading-relaxed font-medium">
            {t('landing.hero_subtitle')}
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5">
              <span className="text-xs font-extrabold text-accent-400 uppercase">100% Direct</span>
              <span className="text-xs font-bold text-white/95">Farmer to Wholesale Buyer</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5">
              <span className="text-xs font-extrabold text-accent-400 uppercase">Verified Trade</span>
              <span className="text-xs font-bold text-white/95">Agrinova Transporter Network</span>
            </div>
          </div>
        </div>

        {/* Footer info / trust badges */}
        <div className="relative z-20 flex items-center justify-between border-t border-white/10 pt-6">
          <span className="text-xs text-primary-200/80 font-medium">
            © {new Date().getFullYear()} AGRINOVA India. All rights reserved.
          </span>
          <div className="flex items-center gap-1.5 text-xs text-accent-400 font-bold bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10">
            <ShieldCheck size={14} />
            <span>Kisan Verified</span>
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen relative p-6 sm:p-12 justify-center">
        
        {/* Top bar with language selector */}
        <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl p-1 border border-slate-100 dark:border-slate-700 shadow-sm">
            <Globe size={14} className="text-slate-400 mx-2" />
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  lang === l.code 
                    ? 'bg-primary-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Header Logo (Visible only on mobile/tablet) */}
        <div className="lg:hidden flex flex-col items-center mb-8 mt-12">
          <BrandLogo size="md" subtitle={t('nav.tagline')} />
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-850 p-6 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none transition">
          {children}
        </div>

      </div>

    </div>
  );
}
