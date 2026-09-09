import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { maharashtraDistrictNames } from '../utils/mockData';
import { 
  Building2, Store, UtensilsCrossed, Factory, Globe2, Truck, 
  CheckCircle, ChevronRight, ChevronLeft, ArrowRight, ShieldCheck, 
  AlertCircle, Upload, Sprout 
} from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';
import api from '../services/api';

const BUYER_TYPES = [
  { id: 'Restaurant', icon: '🍽️', title: 'Restaurant', desc: 'Daily fresh vegetables, fruits & herbs supply' },
  { id: 'Hotel', icon: '🏨', title: 'Hotel / Hospitality', desc: 'Bulk procurement & scheduled pantry supply' },
  { id: 'Retail Store', icon: '🏪', title: 'Retail Store', desc: 'Regular grocery stock & local farm supply' },
  { id: 'Supermarket', icon: '🛒', title: 'Supermarket Chain', desc: 'Large volume multi-crop procurement contracts' },
  { id: 'Mandi / Wholesale Market', icon: '🏬', title: 'Mandi / Wholesaler', desc: 'Truckload bulk lots & APMC trading' },
  { id: 'Trader', icon: '👨‍💼', title: 'Agri Trader', desc: 'Multi-district arbitrage & market resale' },
  { id: 'Exporter', icon: '🚢', title: 'Export Company', desc: 'Export-quality graded crops with phytosanitary compliance' },
  { id: 'Food Processing Company', icon: '🏭', title: 'Food Processing', desc: 'Raw material procurement for canning, pulping & drying' },
  { id: 'Distributor', icon: '📦', title: 'Distributor', desc: 'Bulk regional supply & recurring logistics routes' },
  { id: 'Food & Beverage Company', icon: '🧃', title: 'Food & Beverage', desc: 'Juicing, packaging & ingredient bulk lots' },
  { id: 'Grain / Dal Mill', icon: '🌾', title: 'Grain / Dal Mill', desc: 'Paddy, wheat, pulses & oilseeds direct mill sourcing' },
  { id: 'Animal Feed Company', icon: '🐄', title: 'Animal Feed Plant', desc: 'Maize, soybean meal, jowar & feed grain supply' },
  { id: 'Institutional Buyer', icon: '🏢', title: 'Institutional Buyer', desc: 'Hospitals, colleges, corporate canteens & kitchens' },
  { id: 'Other', icon: '➕', title: 'Other Enterprise', desc: 'Custom commercial agricultural procurement' }
];

const COMMON_CROPS = [
  'Tomato', 'Onion', 'Potato', 'Wheat', 'Rice', 'Maize', 
  'Soybean', 'Cotton', 'Grapes', 'Banana', 'Pomegranate', 
  'Chilli', 'Turmeric', 'Pulses (Tur/Gram)', 'Sugarcane', 'Vegetables'
];

export default function BuyerRegisterPage({ onNavigate }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  // Form State
  const [buyerType, setBuyerType] = useState('Restaurant');
  
  // Step 2: Business Info
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [taluka, setTaluka] = useState('Haveli');
  const [city, setCity] = useState('Pune');
  const [pincode, setPincode] = useState('411001');

  // Step 3: Procurement Info
  const [selectedCrops, setSelectedCrops] = useState(['Tomato', 'Onion']);
  const [monthlyRequirement, setMonthlyRequirement] = useState('50');
  const [preferredUnit, setPreferredUnit] = useState('Quintal');
  const [preferredDistricts, setPreferredDistricts] = useState(['Pune', 'Nashik']);
  const [maxDistance, setMaxDistance] = useState('150');

  // Step 4: Verification Documents
  const [gstNumber, setGstNumber] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState({
    businessReg: true,
    gstCert: true,
    idProof: true,
    addressProof: true
  });

  // Step 5: Submitted State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState('');

  const toggleCrop = (crop) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(selectedCrops.filter(c => c !== crop));
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const handleNext = () => {
    if (step === 2) {
      if (!businessName || !contactPerson || !mobileNumber) {
        alert('Please fill out all required business fields.');
        return;
      }
    }
    if (step === 3) {
      if (selectedCrops.length === 0) {
        alert('Please select at least one crop normally purchased.');
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitRegistration = async () => {
    const newRegId = 'BUY-' + Math.floor(1000 + Math.random() * 9000);
    setRegistrationId(newRegId);

    // Save registration payload to backend API
    const buyerPayload = {
      businessName,
      businessType,
      contactPerson,
      email: businessEmail || `${mobileNumber}@buyer.agrinova.in`,
      mobile: mobileNumber,
      state: 'Maharashtra',
      district,
      taluka,
      city,
      address,
      pincode,
      gstNumber: gstNumber || '27AAAAA0000A1Z5'
    };

    try {
      await api.post('/buyers', buyerPayload);
      const existing = JSON.parse(localStorage.getItem('agrinova-registrations') || '[]');
      existing.unshift({
        id: newRegId,
        name: businessName,
        owner: contactPerson,
        role: 'BUYER',
        buyerType: buyerType,
        email: buyerPayload.email,
        phone: mobileNumber,
        district: district,
        city: city,
        address: address,
        pincode: pincode,
        gstNumber: buyerPayload.gstNumber,
        crops: selectedCrops,
        monthlyRequirement: `${monthlyRequirement} ${preferredUnit}`,
        preferredDistricts: preferredDistricts,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      });
      localStorage.setItem('agrinova-registrations', JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to store buyer registration:', e);
    }

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5] dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <BrandLogo 
            size="sm" 
            subtitle="Buyer Onboarding"
            onClick={() => onNavigate('landing')}
          />

          <button
            onClick={() => onNavigate('buyer-login')}
            className="text-xs font-extrabold text-primary-600 dark:text-primary-400 hover:underline"
          >
            Already have an account? Sign In →
          </button>
        </div>

        {/* Wizard Container Card */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {!isSubmitted ? (
            <>
              {/* Stepper Progress Bar */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center max-w-2xl mx-auto">
                  {[
                    { num: 1, label: 'Buyer Type' },
                    { num: 2, label: 'Business Info' },
                    { num: 3, label: 'Procurement' },
                    { num: 4, label: 'KYC Verification' },
                    { num: 5, label: 'Review & Submit' }
                  ].map((s) => (
                    <div key={s.num} className="flex flex-col items-center gap-1 text-center">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition ${
                        step >= s.num 
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}>
                        {step > s.num ? '✓' : s.num}
                      </span>
                      <span className={`text-[10px] font-extrabold hidden sm:block ${
                        step >= s.num ? 'text-slate-800 dark:text-white' : 'text-slate-400'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6 sm:p-10 space-y-6">

                {/* STEP 1: SELECT BUYER TYPE (14 CARDS) */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 1: Select Your Buyer Category / खरीदार का प्रकार चुनें
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Choose the enterprise type that matches your commercial procurement operations.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[55vh] overflow-y-auto pr-1">
                      {BUYER_TYPES.map((bt) => (
                        <div
                          key={bt.id}
                          onClick={() => setBuyerType(bt.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-3.5 select-none ${
                            buyerType === bt.id 
                              ? 'border-primary-600 bg-primary-50/60 dark:bg-primary-950/20 shadow-md ring-2 ring-primary-500/20' 
                              : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                          }`}
                        >
                          <span className="text-2xl p-2 bg-slate-50 dark:bg-slate-800 rounded-xl shrink-0">
                            {bt.icon}
                          </span>
                          <div className="space-y-0.5">
                            <span className="font-extrabold text-xs text-slate-850 dark:text-white block">
                              {bt.title}
                            </span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                              {bt.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: BUSINESS INFORMATION */}
                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 2: Business Information / व्यावसायिक जानकारी
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Official contact and location details for commercial invoicing and dispatch.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Business Name / प्रतिष्ठान का नाम *</label>
                        <input
                          type="text"
                          placeholder="e.g. Grand Heritage Hotels Ltd"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Contact Person / संपर्क अधिकारी *</label>
                        <input
                          type="text"
                          placeholder="e.g. Priya Sharma"
                          value={contactPerson}
                          onChange={(e) => setContactPerson(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Business Email / ईमेल</label>
                        <input
                          type="email"
                          placeholder="e.g. procurement@hotel.com"
                          value={businessEmail}
                          onChange={(e) => setBusinessEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Mobile Number / मोबाइल नंबर *</label>
                        <input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Business Address / पता</label>
                        <textarea
                          placeholder="Plot No, Street, Landmark, APMC Market Yard"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          rows="2"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">State / राज्य</label>
                        <input
                          type="text"
                          value="Maharashtra"
                          disabled
                          className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">District / ज़िला</label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        >
                          {maharashtraDistrictNames.map((d, i) => (
                            <option key={i} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">City / शहर</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Pincode / पिन कोड</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: PROCUREMENT INFORMATION */}
                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 3: Procurement Information / खरीद प्राथमिकताएं
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Select which crops you regularly purchase so farmers and mandis can be matched.
                      </p>
                    </div>

                    {/* Crops multi-select chips */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-2">
                        What crops do you normally purchase? (Select all that apply)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_CROPS.map((crop) => (
                          <button
                            key={crop}
                            type="button"
                            onClick={() => toggleCrop(crop)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition border ${
                              selectedCrops.includes(crop)
                                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {selectedCrops.includes(crop) ? '✓ ' : '+ '} {crop}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Average Monthly Requirement</label>
                        <input
                          type="number"
                          placeholder="e.g. 50"
                          value={monthlyRequirement}
                          onChange={(e) => setMonthlyRequirement(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Preferred Unit</label>
                        <select
                          value={preferredUnit}
                          onChange={(e) => setPreferredUnit(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        >
                          <option value="Quintal">Quintal</option>
                          <option value="Kg">Kg</option>
                          <option value="Ton">Ton</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Max Procurement Distance</label>
                        <select
                          value={maxDistance}
                          onChange={(e) => setMaxDistance(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        >
                          <option value="50">Within 50 km</option>
                          <option value="150">Within 150 km</option>
                          <option value="300">Within 300 km</option>
                          <option value="All Maharashtra">All Maharashtra</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: BUSINESS VERIFICATION */}
                {step === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 4: Business Verification & KYC / दस्तावेज़ सत्यापन
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Upload standard verification documents to activate your direct wholesale buying account.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">GST Number (Optional for smaller retailers)</label>
                      <input
                        type="text"
                        placeholder="e.g. 27AAAAA0000A1Z5"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {[
                        { key: 'businessReg', label: '1. Business Registration / Shop Act', icon: '📄' },
                        { key: 'gstCert', label: '2. GST Certificate', icon: '📜' },
                        { key: 'idProof', label: '3. Identity Document (PAN / Aadhaar)', icon: '🆔' },
                        { key: 'addressProof', label: '4. Business Address Proof / Utility Bill', icon: '🏢' }
                      ].map((doc) => (
                        <div key={doc.key} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{doc.icon}</span>
                            <div>
                              <span className="font-extrabold text-xs text-slate-800 dark:text-white block">{doc.label}</span>
                              <span className="text-[10px] text-emerald-600 font-bold">Document attached ✓</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => alert('Document upload simulated.')}
                            className="text-xs font-extrabold text-primary-600 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-xl hover:bg-slate-50"
                          >
                            Re-upload
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: REVIEW & SUBMIT */}
                {step === 5 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 5: Review & Submit Registration / समीक्षा और सबमिट
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Please review your buyer profile details before final verification submission.
                      </p>
                    </div>

                    <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 text-xs font-semibold">
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-slate-400">Buyer Category:</span>
                        <span className="font-bold text-slate-800 dark:text-white">{buyerType}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-slate-400">Business Name:</span>
                        <span className="font-bold text-slate-800 dark:text-white">{businessName || 'Grand Heritage Hotel'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-slate-400">Contact Person:</span>
                        <span className="font-bold text-slate-800 dark:text-white">{contactPerson || 'Priya Sharma'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-slate-400">Mobile & Email:</span>
                        <span className="font-bold text-slate-800 dark:text-white">{mobileNumber || '9876543210'} • {businessEmail || 'priya@hotel.com'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-slate-400">Location:</span>
                        <span className="font-bold text-slate-800 dark:text-white">{city}, {district}, Maharashtra</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Target Crops:</span>
                        <span className="font-bold text-primary-600">{selectedCrops.join(', ')}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
                      <span className="font-extrabold block">🛡️ SA Group Buyer Verification Policy</span>
                      <p className="leading-relaxed font-medium">
                        Your account will be placed under Admin Review. Our team verifies registered business documents to maintain trading security.
                      </p>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Buttons */}
                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1"
                    >
                      <ChevronLeft size={14} />
                      <span>Back</span>
                    </button>
                  ) : <div />}

                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-extrabold transition shadow flex items-center gap-1"
                    >
                      <span>Next Step</span>
                      <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitRegistration}
                      className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-extrabold transition shadow-lg shadow-primary-600/20 flex items-center gap-2"
                    >
                      <span>Submit Registration / सबमिट करें</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>

              </div>
            </>
          ) : (
            /* STEP 5 / CONFIRMATION: PENDING VERIFICATION GATE */
            <div className="p-8 sm:p-12 text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
                ⏳
              </div>

              <div className="space-y-2">
                <span className="bg-amber-100 text-amber-800 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                  🟡 Status: Pending Verification
                </span>
                <h2 className="text-2xl font-black text-slate-850 dark:text-white">
                  Registration Submitted Successfully
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your buyer application (<strong>#{registrationId}</strong>) has been received and is currently under SA Group compliance verification.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-left max-w-md mx-auto space-y-2 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Enterprise Category:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{buyerType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Business Name:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{businessName || 'Grand Heritage Hotel'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Review Turnaround:</span>
                  <span className="font-bold text-primary-600">2 - 4 Business Hours</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => onNavigate('buyer-login')}
                  className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-extrabold transition shadow"
                >
                  Return to Buyer Login
                </button>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="py-3 px-6 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-extrabold hover:bg-slate-50"
                >
                  Preview Public Marketplace
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
