import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { initialMarketPrices } from '../utils/mockData';
import { 
  ArrowRight, ShieldCheck, Cpu, TrendingUp, Truck, CheckCircle2, 
  HelpCircle, UserCheck, Smartphone, Landmark, MessageSquare, PhoneCall
} from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';

export default function LandingPage({ onNavigate }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('farmer');

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Live Market Price Ticker */}
      <div className="bg-primary-900 text-white py-2 text-xs overflow-hidden border-b border-primary-800">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          <div className="flex gap-8 justify-around min-w-full">
            {initialMarketPrices.slice(0, 5).map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 font-medium">
                <span className="font-bold text-accent-300">{item.crop}</span>: 
                <span>₹{item.current}/{t('common.quintal')}</span>
                <span className={item.trend === 'up' ? 'text-green-400 font-bold' : item.trend === 'down' ? 'text-red-400 font-bold' : 'text-slate-400 font-bold'}>
                  {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '↔'}
                </span>
                <span className="text-[10px] text-slate-300">({item.market})</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner Section with Direct Access to All 4 Portals */}
      <section className="bg-gradient-to-b from-primary-50/70 via-white to-slate-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-5 shadow-sm">
            <span>🇮🇳</span>
            <span>Maharashtra Direct Agri Trade Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            Direct Farm-to-Business <br className="hidden sm:inline" />
            <span className="text-primary-600">Agricultural Commerce</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Connect directly with verified farmers, commercial buyers, enterprise wholesalers, and rural logistics across Maharashtra without middleman commissions.
          </p>

          {/* Quick 4 Portals Access Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-10 max-w-4xl mx-auto text-left">
            
            {/* Farmer Portal Card */}
            <div 
              onClick={() => onNavigate('farmer-dashboard')}
              className="p-5 bg-white dark:bg-slate-800 rounded-3xl border-2 border-emerald-500/40 hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer group shadow-sm bg-gradient-to-br from-emerald-50/50 to-white dark:from-slate-800 dark:to-slate-800/80"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🌾</span>
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-0.5 rounded-full">Kisan</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">Farmer Portal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">List harvest, check Mandi prices & AI advice.</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition">
                <span>Open Portal</span>
                <span>→</span>
              </div>
            </div>

            {/* Buyer Portal Card */}
            <div 
              onClick={() => onNavigate('buyer-login')}
              className="p-5 bg-white dark:bg-slate-800 rounded-3xl border-2 border-primary-500/20 hover:border-primary-500 hover:shadow-xl transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🏢</span>
                <span className="text-[10px] font-black uppercase bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 px-2 py-0.5 rounded-full">Buyer</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition">Buyer Portal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Procure directly from verified farms.</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-black text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition">
                <span>Procure Produce</span>
                <span>→</span>
              </div>
            </div>

            {/* AgriTrade Card */}
            <div 
              onClick={() => onNavigate('agritrade-login')}
              className="p-5 bg-white dark:bg-slate-800 rounded-3xl border-2 border-amber-500/20 hover:border-amber-500 hover:shadow-xl transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🏬</span>
                <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-2 py-0.5 rounded-full">B2B Trade</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition">AgriTrade</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bulk warehouse lots & tenders.</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition">
                <span>Enterprise Login</span>
                <span>→</span>
              </div>
            </div>

            {/* Transporter Card */}
            <div 
              onClick={() => onNavigate('transporter-login')}
              className="p-5 bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-300/40 hover:border-slate-800 hover:shadow-xl transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🚚</span>
                <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full">Driver</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-slate-300 transition">AgriLogistics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Farm pickup dispatch & GPS routes.</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-black text-slate-700 dark:text-slate-300 group-hover:translate-x-1 transition">
                <span>Driver Portal</span>
                <span>→</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white border-t border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900">{t('landing.how_it_works')}</h2>
            <p className="mt-4 text-slate-600 font-medium">
              We connect three key partners in the agricultural supply chain through one simplified interface.
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="mt-10 flex justify-center gap-2 max-w-md mx-auto bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {['farmer', 'buyer', 'transporter'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all capitalize ${
                  activeTab === tab 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t(`landing.for_${tab}s`)}
              </button>
            ))}
          </div>

          {/* Workflows based on Active Tab */}
          <div className="mt-12 max-w-5xl mx-auto">
            {activeTab === 'farmer' && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-3xl relative text-center">
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center">1</span>
                  <div className="text-primary-600 font-bold mx-auto w-12 h-12 flex items-center justify-center bg-primary-50 rounded-2xl mb-4">🌱</div>
                  <h3 className="font-bold text-slate-800 text-lg">List Crop</h3>
                  <p className="text-sm text-slate-500 mt-2">Enter quantity, target price, and upload photo straight from your farm field.</p>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-3xl relative text-center">
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center">2</span>
                  <div className="text-primary-600 font-bold mx-auto w-12 h-12 flex items-center justify-center bg-primary-50 rounded-2xl mb-4">🤝</div>
                  <h3 className="font-bold text-slate-800 text-lg">Get Direct Orders</h3>
                  <p className="text-sm text-slate-500 mt-2">Urban wholesale buyers bid or buy at your price directly, removing middlemen.</p>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-3xl relative text-center">
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center">3</span>
                  <div className="text-primary-600 font-bold mx-auto w-12 h-12 flex items-center justify-center bg-primary-50 rounded-2xl mb-4">💰</div>
                  <h3 className="font-bold text-slate-800 text-lg">Instant Settlement</h3>
                  <p className="text-sm text-slate-500 mt-2">Transporter picks up, verifies quality, and funds settle directly into your bank.</p>
                </div>
              </div>
            )}
            {activeTab === 'buyer' && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-3xl relative text-center">
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center">1</span>
                  <div className="text-primary-600 font-bold mx-auto w-12 h-12 flex items-center justify-center bg-primary-50 rounded-2xl mb-4">🔍</div>
                  <h3 className="font-bold text-slate-800 text-lg">Browse Direct</h3>
                  <p className="text-sm text-slate-500 mt-2">Search across crops listed by farmers with verifiable harvesting dates and location.</p>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-3xl relative text-center">
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center">2</span>
                  <div className="text-primary-600 font-bold mx-auto w-12 h-12 flex items-center justify-center bg-primary-50 rounded-2xl mb-4">💳</div>
                  <h3 className="font-bold text-slate-800 text-lg">Secure Payment</h3>
                  <p className="text-sm text-slate-500 mt-2">Pay securely online. Payouts are safely held in escrow until delivery is complete.</p>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-3xl relative text-center">
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center">3</span>
                  <div className="text-primary-600 font-bold mx-auto w-12 h-12 flex items-center justify-center bg-primary-50 rounded-2xl mb-4">🚚</div>
                  <h3 className="font-bold text-slate-800 text-lg">Live Delivery</h3>
                  <p className="text-sm text-slate-500 mt-2">Monitor cargo location and transporter quality verification checks on map.</p>
                </div>
              </div>
            )}
            {activeTab === 'transporter' && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-3xl relative text-center">
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center">1</span>
                  <div className="text-primary-600 font-bold mx-auto w-12 h-12 flex items-center justify-center bg-primary-50 rounded-2xl mb-4">🚛</div>
                  <h3 className="font-bold text-slate-800 text-lg">Accept Route</h3>
                  <p className="text-sm text-slate-500 mt-2">Receive delivery jobs matching your vehicle type (Tata Ace, Bolero) and capacity.</p>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-3xl relative text-center">
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center">2</span>
                  <div className="text-primary-600 font-bold mx-auto w-12 h-12 flex items-center justify-center bg-primary-50 rounded-2xl mb-4">📸</div>
                  <h3 className="font-bold text-slate-800 text-lg">Verify at Farm</h3>
                  <p className="text-sm text-slate-500 mt-2">Inspect crops, enter weight and quality checklist, and sign digital pickup report.</p>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-3xl relative text-center">
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center">3</span>
                  <div className="text-primary-600 font-bold mx-auto w-12 h-12 flex items-center justify-center bg-primary-50 rounded-2xl mb-4">🏁</div>
                  <h3 className="font-bold text-slate-800 text-lg">Deliver & Earn</h3>
                  <p className="text-sm text-slate-500 mt-2">Deliver to city buyer warehouse, confirm OTP, and receive transportation fee instantly.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modern Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-bold text-primary-600 tracking-wider uppercase">Built with Intelligence</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">Platform Core Innovations</h2>
            <p className="mt-4 text-slate-600 font-medium">Combining modern cloud logic and simple mobile tools for rural accessibility.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="text-primary-600 bg-primary-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-5">
                <Cpu size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{t('landing.market_intel')}</h3>
              <p className="text-sm text-slate-500 mt-2">Plain language suggestions tells farmers whether to wait or sell based on predictive crop supply data.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="text-primary-600 bg-primary-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{t('landing.quality_verification')}</h3>
              <p className="text-sm text-slate-500 mt-2">Transporters generate digital checks at pickup, guaranteeing quality standards to city buyers before shipping.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="text-primary-600 bg-primary-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-5">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{t('landing.transparent_trading')}</h3>
              <p className="text-sm text-slate-500 mt-2">Fully split breakdown of Crop cost, Transport, and Platform service fees. No hidden margins.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="text-primary-600 bg-primary-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-5">
                <Truck size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{t('landing.transportation')}</h3>
              <p className="text-sm text-slate-500 mt-2">Automated distance calculation, driver mapping, and status tracking from farm gate to city grocer.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Indian Farmer Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-bold text-accent-600 tracking-wider uppercase">Designed for India</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">{t('landing.benefits_title')}</h2>
              <p className="mt-4 text-slate-600 font-medium">We built SA Group around the day-to-day realities of Indian agriculture: erratic prices, language hurdles, and cash flow needs.</p>
              
              <div className="mt-8 space-y-4">
                <div className="flex gap-3">
                  <div className="text-green-600 mt-1"><CheckCircle2 size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800">Farmer Prosperity First</h4>
                    <p className="text-sm text-slate-500">{t('landing.benefits_farmer')}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-green-600 mt-1"><CheckCircle2 size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800">Fresh and Direct For Buyers</h4>
                    <p className="text-sm text-slate-500">{t('landing.benefits_buyer')}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-green-600 mt-1"><CheckCircle2 size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800">Empowered Rural Transport</h4>
                    <p className="text-sm text-slate-500">{t('landing.benefits_transporter')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphic mockup cards block */}
            <div className="relative bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Today's Advice</span>
                <h4 className="font-bold text-slate-800 mt-1">🌾 Rice Price predicted to increase by 8%</h4>
                <p className="text-xs text-slate-500 mt-1">Wait 4 days before listing. Demand in Nagpur wholesale is strong.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Tomato (Quintal)</span>
                  <span className="text-lg font-bold text-slate-800">₹2,800</span>
                </div>
                <span className="text-xs font-bold bg-green-50 text-green-600 px-2 py-1 rounded-lg">↑ ₹200 (Pune Market)</span>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <span className="text-xs text-slate-500 block">Active Delivery Route</span>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-bold text-slate-700">Nashik (Farm)</span>
                  <span className="text-slate-300">-----🚚-----</span>
                  <span className="text-xs font-bold text-slate-700">Mumbai (Buyer)</span>
                </div>
                <span className="text-[10px] font-bold text-primary-600 block mt-2 text-right">In Transit (165 km)</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Vision & Call to Action */}
      <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-800/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white">Shaping the Future of Agriculture</h2>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {t('landing.future_vision')}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => onNavigate('signup')}
              className="bg-primary-500 hover:bg-primary-600 text-slate-900 font-bold px-8 py-3.5 rounded-xl shadow-lg transition"
            >
              {t('landing.get_started')}
            </button>
          </div>
        </div>
      </section>

      {/* Help & Contact Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl flex gap-4">
              <div className="text-primary-600 bg-white p-3 rounded-2xl h-fit shadow-sm"><PhoneCall size={24} /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{t('landing.contact')}</h3>
                <p className="text-sm text-slate-500 mt-2">{t('landing.contact_text')}</p>
                <a href="tel:1800000000" className="inline-block mt-4 text-primary-600 font-extrabold text-sm hover:underline">1800-123-AGRI (Toll Free)</a>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl flex gap-4">
              <div className="text-primary-600 bg-white p-3 rounded-2xl h-fit shadow-sm"><MessageSquare size={24} /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">WhatsApp Kisan Help</h3>
                <p className="text-sm text-slate-500 mt-2">Send "HELP" or "Mandi Price" to our official WhatsApp support number.</p>
                <a href="https://wa.me/918000000000" target="_blank" rel="noreferrer" className="inline-block mt-4 text-primary-600 font-extrabold text-sm hover:underline">+91 98765 43210</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <BrandLogo 
                size="sm" 
                textColor="text-white" 
                subtitle="© 2026 SA Group Solutions Pvt Ltd"
                showSubtitle={true}
              />
            </div>
            
            {/* Indian Flag Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Made for India with pride</span>
              <div className="inline-flex flex-col w-5 h-3">
                <div className="flex-1 flag-saffron"></div>
                <div className="flex-1 flag-white flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-900"></div>
                </div>
                <div className="flex-1 flag-green"></div>
              </div>
            </div>

            <div className="flex gap-6 text-sm">
              <span className="hover:text-white cursor-pointer">Terms</span>
              <span className="hover:text-white cursor-pointer">Privacy</span>
              <span className="hover:text-white cursor-pointer">Kisan Portal</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
