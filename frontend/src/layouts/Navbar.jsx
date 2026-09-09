import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sprout, LogOut, User, Globe, Menu, X, Sun, Moon, Sparkles, 
  Eye, Palette
} from 'lucide-react';

import BrandLogo from '../components/common/BrandLogo';

export default function Navbar({ onNavigate, currentPage }) {
  const { t, lang, setLang } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('landing');
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' }
  ];

  const themes = [
    { id: 'emerald', name: 'Emerald Fresh', icon: '🌿', color: 'bg-emerald-500' },
    { id: 'harvest', name: 'Harvest Amber', icon: '🌾', color: 'bg-amber-500' },
    { id: 'dark', name: 'Dark Slate', icon: '🌙', color: 'bg-slate-800' }
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand with SA Monogram */}
          <BrandLogo 
            size="md"
            subtitle={t('nav.tagline')}
            onClick={() => onNavigate('landing')}
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5">
            <button 
              onClick={() => onNavigate('landing')}
              className={`text-sm font-semibold transition px-2.5 py-1.5 rounded-xl ${
                currentPage === 'landing' 
                  ? 'text-primary-600 bg-primary-50 dark:bg-slate-800 font-bold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t('nav.home')}
            </button>

            <button 
              onClick={() => onNavigate('marketplace')}
              className={`text-sm font-semibold transition px-2.5 py-1.5 rounded-xl ${
                currentPage === 'marketplace' 
                  ? 'text-primary-600 bg-primary-50 dark:bg-slate-800 font-bold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t('nav.marketplace')}
            </button>

            <button 
              onClick={() => onNavigate('farmer-dashboard')}
              className={`text-sm font-semibold transition px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 ${
                currentPage === 'farmer-dashboard' 
                  ? 'text-emerald-600 bg-emerald-50 dark:bg-slate-800 font-bold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>🌾 Farmer</span>
            </button>

            <button 
              onClick={() => onNavigate('buyer-login')}
              className={`text-sm font-semibold transition px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 ${
                currentPage === 'buyer-login' || currentPage === 'buyer-register' || currentPage === 'buyer-dashboard'
                  ? 'text-primary-600 bg-primary-50 dark:bg-slate-800 font-bold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>🏢 Buyer</span>
            </button>

            <button 
              onClick={() => onNavigate('agritrade-login')}
              className={`text-sm font-semibold transition px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 ${
                currentPage === 'agritrade-login' || currentPage === 'agritrade-register' || currentPage === 'agritrade-dashboard'
                  ? 'text-amber-600 bg-amber-50 dark:bg-slate-800 font-bold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>🏬 AgriTrade</span>
            </button>

            <button 
              onClick={() => onNavigate('transporter-login')}
              className={`text-sm font-semibold transition px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 ${
                currentPage === 'transporter-login' || currentPage === 'transporter-register' || currentPage === 'transporter-dashboard'
                  ? 'text-amber-600 bg-amber-50 dark:bg-slate-800 font-bold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>🚚 AgriLogistics</span>
            </button>

            <button 
              onClick={() => onNavigate('market-map')}
              className={`text-sm font-semibold transition px-2.5 py-1.5 rounded-xl ${
                currentPage === 'market-map' 
                  ? 'text-primary-600 bg-primary-50 dark:bg-slate-800 font-bold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              🗺️ Market Map
            </button>

            {user && (
              <button 
                onClick={() => {
                  const role = (user.role || 'FARMER').toUpperCase();
                  if (role === 'FARMER') onNavigate('farmer-dashboard');
                  else if (role === 'BUYER') onNavigate('buyer-dashboard');
                  else if (role === 'TRANSPORTER') onNavigate('transporter-dashboard');
                  else if (role === 'AGRITRADE') onNavigate('agritrade-dashboard');
                  else if (role === 'ADMIN') onNavigate('admin-dashboard');
                  else onNavigate('farmer-dashboard');
                }}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800 px-2.5 py-1.5 rounded-xl transition"
              >
                {t('nav.dashboard')}
              </button>
            )}

            {/* Theme Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                title="Change Platform Theme"
              >
                <Palette size={14} className="text-primary-600" />
                <span className="capitalize">{theme}</span>
              </button>

              {themeDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setThemeDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Select Theme
                  </div>
                  {themes.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => {
                        setTheme(th.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition ${
                        theme === th.id 
                          ? 'bg-primary-50 dark:bg-slate-700/50 text-primary-600 font-bold' 
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{th.icon}</span>
                      <span>{th.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-1 border border-slate-100 dark:border-slate-700">
              <Globe size={15} className="text-slate-400 mx-2" />
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    lang === l.code 
                      ? 'bg-primary-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                  <User size={16} className="text-primary-600" />
                  <div className="text-left leading-none">
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">{user.username}</span>
                    <span className="text-[9px] font-semibold text-slate-500 bg-slate-200 dark:bg-slate-700 px-1 rounded uppercase">{user.role}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 transition text-xs font-bold rounded-xl"
                >
                  <LogOut size={15} />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => onNavigate('login')}
                  className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-primary-600 transition px-3 py-2"
                >
                  {t('nav.login')}
                </button>
                <button 
                  onClick={() => onNavigate('auth-welcome')}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 transition"
                >
                  {t('nav.signup')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Quick language toggle */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-1.5 text-slate-700 dark:text-slate-300"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-3 space-y-3">
          <button
            onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-bold text-slate-700 dark:text-slate-200 hover:text-primary-600"
          >
            {t('nav.home')}
          </button>
          <button
            onClick={() => { onNavigate('marketplace'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-bold text-slate-700 dark:text-slate-200 hover:text-primary-600"
          >
            {t('nav.marketplace')}
          </button>
          <button
            onClick={() => { onNavigate('farmer-dashboard'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
          >
            🌾 Farmer Portal
          </button>
          <button
            onClick={() => { onNavigate('buyer-login'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-bold text-slate-700 dark:text-slate-200 hover:text-primary-600"
          >
            🏢 Buyer Portal
          </button>
          <button
            onClick={() => { onNavigate('agritrade-login'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-bold text-amber-600 dark:text-amber-400"
          >
            🏬 AgriTrade
          </button>
          <button
            onClick={() => { onNavigate('transporter-login'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-bold text-amber-600 dark:text-amber-400"
          >
            🚚 AgriLogistics
          </button>
          <button
            onClick={() => { onNavigate('market-map'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-bold text-slate-700 dark:text-slate-200 hover:text-primary-600"
          >
            🗺️ Market Map
          </button>

          {user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (user.role === 'FARMER') onNavigate('farmer-dashboard');
                else if (user.role === 'BUYER') onNavigate('buyer-dashboard');
                else if (user.role === 'TRANSPORTER') onNavigate('transporter-dashboard');
                else if (user.role === 'ADMIN') onNavigate('admin-dashboard');
              }}
              className="block w-full text-left py-2 font-bold text-slate-700 dark:text-slate-200 hover:text-primary-600"
            >
              {t('nav.dashboard')}
            </button>
          )}

          {/* Theme selector in mobile */}
          <div className="py-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Theme</span>
            <div className="flex gap-2">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition ${
                    theme === th.id
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {th.icon} {th.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {user ? (
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <User size={18} className="text-primary-600" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-white block text-sm">{user.username}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{user.role}</span>
                </div>
              </div>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl text-sm"
              >
                <LogOut size={16} />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-center text-sm"
              >
                {t('nav.login')}
              </button>
              <button
                onClick={() => { onNavigate('auth-welcome'); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 bg-primary-600 text-white font-bold rounded-xl text-center text-sm shadow-md"
              >
                {t('nav.signup')}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
