import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { initialCrops, maharashtraDistricts, maharashtraDistrictNames } from '../utils/mockData';
import { Search, MapPin, Calendar, Shield, Phone, Sparkles, ShoppingBag, Eye, X, Filter } from 'lucide-react';

export default function MarketplacePage({ onNavigate, crops, onPlaceOrder }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [qualityFilter, setQualityFilter] = useState('');
  
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [compareCrops, setCompareCrops] = useState([]);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  // Combine initial crops and any new crops added in this session
  const allCrops = crops || initialCrops;

  // Derive unique crops list
  const uniqueCropNames = Array.from(new Set(allCrops.map((c) => c.name))).sort();

  // Find active district produce
  const selectedDistrictData = maharashtraDistricts.find(d => d.district.toLowerCase() === districtFilter.toLowerCase());

  // Filter crops
  const filteredCrops = allCrops.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          crop.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          crop.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          crop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter === '' || 
                            crop.location.toLowerCase().includes(districtFilter.toLowerCase()) ||
                            crop.description?.toLowerCase().includes(districtFilter.toLowerCase());
    const matchesCrop = cropFilter === '' || crop.name.toLowerCase() === cropFilter.toLowerCase();
    const matchesQuality = qualityFilter === '' || crop.quality === qualityFilter;
    return matchesSearch && matchesDistrict && matchesCrop && matchesQuality;
  });

  // Calculate pricing split
  const cropValue = selectedCrop ? selectedCrop.expectedPrice * orderQuantity : 0;
  const transportCost = selectedCrop ? Math.round(50 * orderQuantity + 300) : 0; // simple distance/size rate
  const platformFee = selectedCrop ? Math.round(cropValue * 0.01) + 50 : 0; // 1% + ₹50 base fee
  const finalAmount = cropValue + transportCost + platformFee;

  const handleCheckoutSubmit = () => {
    if (!user) {
      alert('Please Login as a Buyer to place an order! / कृपया आर्डर देने के लिए खरीदार के रूप में लॉगिन करें');
      onNavigate('login');
      return;
    }
    if (user.role !== 'BUYER') {
      alert('Only registered Buyers can place orders! Current role: ' + user.role);
      return;
    }

    // Call callback to store order in global state
    const newOrder = {
      id: 'ord_' + Math.floor(100 + Math.random() * 900),
      cropId: selectedCrop.id,
      cropName: selectedCrop.name,
      quantity: orderQuantity,
      unit: selectedCrop.unit,
      farmerId: 'usr_farmer1', // Mock matching
      farmerName: selectedCrop.farmer,
      farmerLocation: selectedCrop.location,
      farmerPhone: selectedCrop.phone,
      buyerId: user.id,
      buyerName: user.username,
      buyerLocation: 'Mumbai Wholesale Mandi',
      buyerPhone: user.phone || '9876543210',
      cropValue,
      transportCost,
      platformFee,
      finalAmount,
      buyerTotal: finalAmount,
      status: 'Confirmed', // Starts as Confirmed, waiting for transporter pickup
      transporterId: null,
      transporterName: null,
      pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
      deliveryDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // day after tomorrow
      distance: Math.floor(50 + Math.random() * 200)
    };

    onPlaceOrder(newOrder);
    
    // Reset state
    setShowCheckout(false);
    setSelectedCrop(null);
    alert('Order placed successfully! Redirecting to tracking dashboard.');
    onNavigate('buyer-dashboard');
  };

  const handleAddToCompare = (crop) => {
    if (compareCrops.some((c) => c.id === crop.id)) {
      setCompareCrops(compareCrops.filter((c) => c.id !== crop.id));
    } else {
      if (compareCrops.length >= 2) {
        alert('You can only compare up to 2 crops at a time.');
        return;
      }
      setCompareCrops([...compareCrops, crop]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg uppercase">Direct Farm Sourcing</span>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2">{t('nav.marketplace')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Buy high quality verified crops directly from Maharashtra farmers across 36 districts without middlemen</p>
        </div>

        {compareCrops.length > 0 && (
          <div className="flex items-center gap-3 bg-accent-50 border border-accent-200 px-4 py-2 rounded-2xl">
            <span className="text-xs font-bold text-accent-800">Comparing {compareCrops.length}/2 crops</span>
            <button 
              onClick={() => setSelectedCrop({ isCompareView: true })}
              className="bg-accent-600 hover:bg-accent-700 text-white font-semibold text-xs px-3 py-1.5 rounded-xl transition"
            >
              Show Comparison
            </button>
            <button onClick={() => setCompareCrops([])} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder={t('buyer.search_crops') || 'Search crop, farmer...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-medium transition dark:text-white"
            />
          </div>

          {/* 36 Maharashtra Districts Dropdown */}
          <div>
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setCropFilter(''); // Reset crop filter when district changes
              }}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-bold transition dark:text-white"
            >
              <option value="">All Maharashtra Districts (36) / सर्व जिल्हे</option>
              {maharashtraDistrictNames.map((dist, idx) => (
                <option key={idx} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          {/* Crop / Produce Dropdown */}
          <div>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-bold transition dark:text-white"
            >
              <option value="">All Produce / सर्व पिके</option>
              {uniqueCropNames.map((cropName, idx) => (
                <option key={idx} value={cropName}>{cropName}</option>
              ))}
            </select>
          </div>

          {/* Quality Dropdown */}
          <div>
            <select
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-medium transition dark:text-white"
            >
              <option value="">{t('buyer.all_qualities') || 'All Qualities'}</option>
              <option value="Good">Good / उत्तम ✓</option>
              <option value="Average">Average / मध्यम</option>
              <option value="Poor">Poor / निम्न</option>
            </select>
          </div>

        </div>

        {/* District Produce Suggestion Tag Pills */}
        {selectedDistrictData && selectedDistrictData.crops && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center flex-wrap gap-2 text-xs">
            <span className="font-extrabold text-slate-500 dark:text-slate-400">
              📍 Major produce in {selectedDistrictData.district}:
            </span>
            {selectedDistrictData.crops.map((cropName, idx) => (
              <button
                key={idx}
                onClick={() => setCropFilter(cropFilter === cropName ? '' : cropName)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition border ${
                  cropFilter === cropName
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-primary-50 hover:text-primary-700'
                }`}
              >
                {cropName}
              </button>
            ))}
            {(districtFilter || cropFilter || qualityFilter || searchTerm) && (
              <button
                onClick={() => {
                  setDistrictFilter('');
                  setCropFilter('');
                  setQualityFilter('');
                  setSearchTerm('');
                }}
                className="text-xs font-bold text-red-500 hover:underline ml-auto"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
          <span className="text-4xl block">🔍</span>
          <h3 className="font-bold text-slate-800 text-lg mt-4">No Crops Found</h3>
          <p className="text-sm text-slate-400 mt-1">Try modifying your search queries or quality filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCrops.map((crop) => (
            <div 
              key={crop.id} 
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col"
            >
              {/* Crop Image & Quality tag */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img 
                  src={crop.imageUrl || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c808b?auto=format&fit=crop&w=400&q=80'} 
                  alt={crop.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
                
                {/* Quality Indicator Badge */}
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${
                  crop.quality === 'Good' 
                    ? 'bg-green-500 text-white' 
                    : crop.quality === 'Average' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {crop.quality === 'Good' ? '★ Good' : crop.quality === 'Average' ? 'Average' : 'Poor'}
                </span>

                <span className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-[10px] font-bold">
                  {crop.category}
                </span>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">{crop.name}</h3>
                    <span className="text-xs font-bold text-slate-400">ID: {crop.id}</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Available:</span>
                      <span className="font-bold text-slate-800">{crop.quantity} {crop.unit}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Price Expected:</span>
                      <span className="font-extrabold text-primary-600">₹{crop.expectedPrice} / {t('common.quintal')}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                      <MapPin size={14} className="text-primary-500 shrink-0" />
                      <span>{crop.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={14} className="text-slate-400 shrink-0" />
                      <span>Harvest: {crop.harvestDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 border-t border-slate-50 pt-2.5">
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                        {crop.farmer[0]}
                      </div>
                      <span className="font-semibold text-slate-700">{crop.farmer}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded font-bold">Farmer</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedCrop(crop);
                      setOrderQuantity(1);
                      setShowCheckout(false);
                    }}
                    className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedCrop(crop);
                      setOrderQuantity(1);
                      setShowCheckout(true);
                    }}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl font-bold text-xs transition shadow-sm"
                  >
                    {t('buyer.buy_now')}
                  </button>
                  <button
                    onClick={() => handleAddToCompare(crop)}
                    className={`p-2.5 rounded-xl border transition text-xs ${
                      compareCrops.some((c) => c.id === crop.id)
                        ? 'border-accent-500 bg-accent-50 text-accent-700'
                        : 'border-slate-200 text-slate-400 hover:text-slate-600'
                    }`}
                    title="Compare"
                  >
                    ⚖️
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Crop details or Compare modal */}
      {selectedCrop && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h2 className="font-extrabold text-xl text-slate-800">
                {selectedCrop.isCompareView ? 'Compare Product Details' : 'Crop Details / फसल की जानकारी'}
              </h2>
              <button 
                onClick={() => { setSelectedCrop(null); setShowCheckout(false); }} 
                className="p-1 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* Product Comparison View */}
              {selectedCrop.isCompareView ? (
                <div className="grid grid-cols-2 gap-4">
                  {compareCrops.map((c, i) => (
                    <div key={i} className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50">
                      <img src={c.imageUrl} className="h-32 w-full object-cover rounded-xl" alt="" />
                      <h4 className="font-bold text-lg text-slate-800">{c.name}</h4>
                      <div className="text-xs space-y-2">
                        <p><span className="text-slate-400 block font-bold">Farmer:</span> {c.farmer}</p>
                        <p><span className="text-slate-400 block font-bold">Quality:</span> {c.quality}</p>
                        <p><span className="text-slate-400 block font-bold">Location:</span> {c.location}</p>
                        <p><span className="text-slate-400 block font-bold">Harvest Date:</span> {c.harvestDate}</p>
                        <p><span className="text-slate-400 block font-bold">Expected Price:</span> ₹{c.expectedPrice} / Quintal</p>
                      </div>
                      <button 
                        onClick={() => { setSelectedCrop(c); setShowCheckout(true); }}
                        className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        Buy This Crop
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                
                // Regular Crop Details & Checkout
                <div>
                  
                  {/* Left-Right split */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <img 
                        src={selectedCrop.imageUrl} 
                        alt={selectedCrop.name}
                        className="w-full h-52 object-cover rounded-2xl shadow-sm border border-slate-100"
                      />
                      <div className="mt-3 flex items-center gap-1.5 text-slate-500 font-medium text-xs">
                        <Shield size={16} className="text-primary-600" />
                        <span>Verified listing by SA Group Transporter Network</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                          {selectedCrop.category}
                        </span>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          selectedCrop.quality === 'Good' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          Quality: {selectedCrop.quality}
                        </span>
                      </div>

                      <h3 className="text-2xl font-extrabold text-slate-800">{selectedCrop.name}</h3>
                      <p className="text-xs text-slate-400">{selectedCrop.description}</p>
                      
                      <hr className="border-slate-100" />

                      <div className="text-sm space-y-1.5">
                        <div className="flex justify-between"><span className="text-slate-400">Available Stock:</span> <span className="font-bold text-slate-800">{selectedCrop.quantity} {selectedCrop.unit}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Price expected:</span> <span className="font-extrabold text-primary-600">₹{selectedCrop.expectedPrice} / {t('common.quintal')}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Mandi Location:</span> <span className="font-bold text-slate-800">{selectedCrop.location}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Harvest Date:</span> <span className="font-bold text-slate-800">{selectedCrop.harvestDate}</span></div>
                      </div>

                      {/* Contact Farmer Details */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs block font-bold text-slate-700">{selectedCrop.farmer}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Farmer</span>
                        </div>
                        <a href={`tel:${selectedCrop.phone}`} className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-xl text-xs font-bold">
                          <Phone size={12} className="text-primary-600" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Area Toggle */}
                  {showCheckout ? (
                    <div className="bg-slate-50 p-5 rounded-2xl border border-primary-200 mt-6 space-y-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                        <Sparkles size={16} className="text-primary-600" />
                        <span>Place Direct Order / सीधे आर्डर करें</span>
                      </div>

                      {/* Select Quantity */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Quantity to Purchase ({selectedCrop.unit})</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max={selectedCrop.quantity}
                            value={orderQuantity}
                            onChange={(e) => setOrderQuantity(Math.min(selectedCrop.quantity, Math.max(1, Number(e.target.value))))}
                            className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                          <span className="text-xs font-medium text-slate-400">Max available: {selectedCrop.quantity} {selectedCrop.unit}</span>
                        </div>
                      </div>

                      {/* Price split breakups */}
                      <div className="border-t border-slate-200/60 pt-3 space-y-2">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">{t('buyer.price_breakdown')}</span>
                        
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>{t('buyer.crop_value')} ({orderQuantity} x ₹{selectedCrop.expectedPrice}):</span>
                          <span className="font-semibold text-slate-800">₹{cropValue.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>{t('buyer.transport_cost')} (Mandi transport rate):</span>
                          <span className="font-semibold text-slate-800">₹{transportCost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>{t('buyer.platform_fee')} (1% platform service charge):</span>
                          <span className="font-semibold text-slate-800">₹{platformFee.toLocaleString('en-IN')}</span>
                        </div>

                        <hr className="border-slate-200" />

                        <div className="flex justify-between text-sm font-bold text-slate-800 pt-1">
                          <span>{t('buyer.final_amount')}:</span>
                          <span className="text-lg font-extrabold text-primary-600">₹{finalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Final Confirm buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowCheckout(false)}
                          className="flex-1 py-3 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-xs transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCheckoutSubmit}
                          className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow-md shadow-primary-100 transition flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag size={14} />
                          <span>{t('buyer.pay_confirm')}</span>
                        </button>
                      </div>

                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full mt-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-sm shadow-md transition"
                    >
                      Proceed to Checkout / आर्डर और भुगतान की ओर बढ़ें
                    </button>
                  )}

                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
