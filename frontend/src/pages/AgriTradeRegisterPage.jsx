import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { maharashtraDistrictNames } from '../utils/mockData';
import { 
  Building2, Sprout, User, Phone, Mail, MapPin, FileText, 
  Upload, CheckCircle, ChevronRight, ChevronLeft, ArrowRight, 
  ShieldCheck, AlertCircle, Clock, Plus, Trash2, Globe, Truck, Package, Store
} from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';

const BUSINESS_TYPES = [
  { id: 'Restaurant', icon: '🍽️', title: 'Restaurant', desc: 'Commercial kitchens, multi-outlet dining & food chains' },
  { id: 'Hotel', icon: '🏨', title: 'Hotel / Hospitality', desc: 'Luxury resorts, hotels, catering & banquet services' },
  { id: 'Retail Store', icon: '🏪', title: 'Retail Store', desc: 'Neighborhood vegetable/fruit grocers & specialty stores' },
  { id: 'Supermarket', icon: '🛒', title: 'Supermarket Chain', desc: 'Large format modern trade retail hypermarkets' },
  { id: 'Mandi / Wholesale Market', icon: '🏬', title: 'Mandi / Wholesale Market', desc: 'APMC commission agents & primary produce traders' },
  { id: 'Trader', icon: '👨‍💼', title: 'Commodity Trader', desc: 'Inter-district & inter-state agricultural produce traders' },
  { id: 'Exporter', icon: '🚢', title: 'Agro Exporter', desc: 'International fresh produce & grain export companies (IEC)' },
  { id: 'Food Processing Company', icon: '🏭', title: 'Food Processing Company', desc: 'Canning, pulp, juice, frozen snacks & dehydration plants' },
  { id: 'Distributor', icon: '📦', title: 'Regional Distributor', desc: 'Wholesale suppliers distributing to retailers & restaurants' },
  { id: 'Food & Beverage Company', icon: '🧃', title: 'Food & Beverage', desc: 'Packaged food brands, beverages & snack processors' },
  { id: 'Grain / Dal Mill', icon: '🌾', title: 'Grain / Dal Mill', desc: 'Commercial pulses, rice & wheat processing mills' },
  { id: 'Animal Feed Company', icon: '🐄', title: 'Animal Feed Plant', desc: 'Livestock, cattle, poultry & aquafeed manufacturers' },
  { id: 'Institutional Buyer', icon: '🏢', title: 'Institutional Buyer', desc: 'Hospital canteens, university campuses & corporate dining' },
  { id: 'Agri Aggregator', icon: '🌱', title: 'Agri Aggregator', desc: 'Village level collection centers & farmer FPO aggregators' },
  { id: 'Warehouse / Storage Business', icon: '📦', title: 'Warehouse / Cold Storage', desc: 'Bulk dry storage, cold rooms & CA storage facilities' },
  { id: 'Other', icon: '➕', title: 'Other Enterprise', desc: 'Custom specialized agricultural business enterprise' }
];

const CROP_CATEGORIES = [
  { category: 'Fruits', items: ['Mango', 'Banana', 'Grapes', 'Pomegranate', 'Orange', 'Apple', 'Guava', 'Papaya', 'Watermelon'] },
  { category: 'Vegetables', items: ['Tomato', 'Onion', 'Potato', 'Cabbage', 'Cauliflower', 'Brinjal', 'Chilli', 'Okra', 'Carrot'] },
  { category: 'Grains & Cereals', items: ['Rice', 'Wheat', 'Maize', 'Jowar', 'Bajra'] },
  { category: 'Pulses & Legumes', items: ['Tur', 'Gram (Chana)', 'Moong', 'Urad', 'Masoor'] },
  { category: 'Cash & Oilseeds', items: ['Cotton', 'Sugarcane', 'Soybean', 'Groundnut'] },
  { category: 'Spices & Condiments', items: ['Turmeric', 'Dry Red Chilli', 'Coriander', 'Cumin', 'Ginger', 'Garlic'] }
];

export default function AgriTradeRegisterPage({ onNavigate }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  // Step 1: Business Type
  const [businessType, setBusinessType] = useState('Hotel');
  const [secondaryTypes, setSecondaryTypes] = useState(['Restaurant']);

  // Step 2: Business Info
  const [businessName, setBusinessName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [businessDesc, setBusinessDesc] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [yearEst, setYearEst] = useState('2018');
  const [employeeCount, setEmployeeCount] = useState('25-50');
  const [website, setWebsite] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessMobile, setBusinessMobile] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');

  // Step 3: Complete Address
  const [country] = useState('India');
  const [state] = useState('Maharashtra');
  const [district, setDistrict] = useState('Pune');
  const [taluka, setTaluka] = useState('Haveli');
  const [city, setCity] = useState('Pune');
  const [villageArea, setVillageArea] = useState('Gultekdi APMC Yard');
  const [street, setStreet] = useState('Market Yard Main Road');
  const [buildingName, setBuildingName] = useState('Trade Tower, Suite 402');
  const [plotNumber, setPlotNumber] = useState('Plot No. 12-B');
  const [pincode, setPincode] = useState('411037');
  const [landmark, setLandmark] = useState('Opposite Central Gate No. 2');
  const [latitude, setLatitude] = useState('18.4965');
  const [longitude, setLongitude] = useState('73.8643');

  // Step 4: Business Operations
  const [operations, setOperations] = useState([
    'Buy agricultural products',
    'Distribute agricultural products',
    'Supply restaurants',
    'Supply hotels'
  ]);

  // Step 5: Crop Portfolio
  const [selectedCrops, setSelectedCrops] = useState(['Tomato', 'Onion', 'Grapes', 'Pomegranate']);

  // Step 6: Procurement Requirements
  const [cropRequirements, setCropRequirements] = useState([
    { crop: 'Tomato', monthlyQty: '10,000', unit: 'Kg', quality: 'Grade A', frequency: 'Weekly', targetPrice: '28' },
    { crop: 'Onion', monthlyQty: '15,000', unit: 'Kg', quality: 'Grade A', frequency: 'Bi-Weekly', targetPrice: '22' }
  ]);

  // Step 7: Supply & Distribution Network
  const [distributionList, setDistributionList] = useState([
    { name: 'Pune Hospitality Outlets', city: 'Pune', type: 'Hotel', count: 8, monthlyVolume: '12 Ton' },
    { name: 'Mumbai Fine Dining Chain', city: 'Mumbai', type: 'Restaurant', count: 24, monthlyVolume: '18 Ton' }
  ]);
  const [newDistCity, setNewDistCity] = useState('Nashik');
  const [newDistType, setNewDistType] = useState('Restaurant');
  const [newDistName, setNewDistName] = useState('');

  // Step 8: Warehouse / Storage Facilities
  const [hasWarehouse, setHasWarehouse] = useState('YES');
  const [warehousesList, setWarehousesList] = useState([
    { name: 'Pune Central Cold Hub', city: 'Pune', type: 'Cold Storage (2°C - 8°C)', capacity: '500 Ton' },
    { name: 'Nashik Dry Cargo Depot', city: 'Nashik', type: 'Dry Storage', capacity: '300 Ton' }
  ]);

  // Step 9: Transport Fleet
  const [transportMode, setTransportMode] = useState('Combination');
  const [hasReefer, setHasReefer] = useState('YES');
  const [fleetCount, setFleetCount] = useState('4');

  // Step 10: Dynamic Documents
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [iecNumber, setIecNumber] = useState('');

  // Step 11: Submitted state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState('');

  const toggleOperation = (op) => {
    setOperations(prev => 
      prev.includes(op) ? prev.filter(item => item !== op) : [...prev, op]
    );
  };

  const toggleCrop = (c) => {
    setSelectedCrops(prev => 
      prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
    );
  };

  const handleAddDistribution = () => {
    if (!newDistName.trim()) {
      alert('Please enter destination network name.');
      return;
    }
    setDistributionList(prev => [
      ...prev,
      { name: newDistName, city: newDistCity, type: newDistType, count: 5, monthlyVolume: '5 Ton' }
    ]);
    setNewDistName('');
  };

  const handleNext = () => {
    if (step === 2 && (!businessName.trim() || !businessMobile.trim())) {
      alert('Please enter your Business Name and Mobile Number.');
      return;
    }
    if (step === 3 && (!city.trim() || !pincode.trim())) {
      alert('Please enter complete business address details.');
      return;
    }
    setStep(prev => Math.min(prev + 1, 10));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitRegistration = () => {
    const newRegId = 'TRADE-' + Math.floor(1000 + Math.random() * 9000);
    setRegistrationId(newRegId);

    const businessRecord = {
      id: newRegId,
      name: businessName,
      legalName: legalName || businessName,
      role: 'BUSINESS_BUYER',
      businessType: businessType,
      secondaryTypes: secondaryTypes,
      phone: businessMobile,
      email: businessEmail || `${businessMobile}@agritrade.in`,
      district: district,
      city: city,
      address: `${buildingName}, ${street}, ${villageArea}, ${city} - ${pincode}`,
      gstNumber: gstNumber.toUpperCase(),
      panNumber: panNumber.toUpperCase(),
      operations: operations,
      selectedCrops: selectedCrops,
      warehouses: warehousesList,
      distributionLocations: distributionList,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    try {
      const existing = JSON.parse(localStorage.getItem('agrinova-registrations') || '[]');
      existing.unshift(businessRecord);
      localStorage.setItem('agrinova-registrations', JSON.stringify(existing));
    } catch(e) {}

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5] dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <BrandLogo 
            size="sm" 
            subtitle="AgriTrade Enterprise Onboarding"
            onClick={() => onNavigate('landing')}
          />

          <button
            onClick={() => onNavigate('agritrade-login')}
            className="text-xs font-extrabold text-primary-600 dark:text-primary-400 hover:underline"
          >
            Already an AgriTrade Business? Sign In →
          </button>
        </div>

        {/* Wizard Container Card */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {!isSubmitted ? (
            <>
              {/* Stepper Progress Bar */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[700px] px-4">
                  {[
                    { num: 1, label: 'Type' },
                    { num: 2, label: 'Info' },
                    { num: 3, label: 'Address' },
                    { num: 4, label: 'Operations' },
                    { num: 5, label: 'Crops' },
                    { num: 6, label: 'Procure' },
                    { num: 7, label: 'Supply' },
                    { num: 8, label: 'Warehouse' },
                    { num: 9, label: 'Transport' },
                    { num: 10, label: 'Docs' }
                  ].map((s) => (
                    <div key={s.num} className="flex flex-col items-center gap-1 text-center">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[11px] transition ${
                        step >= s.num 
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}>
                        {step > s.num ? '✓' : s.num}
                      </span>
                      <span className={`text-[9px] font-extrabold ${step >= s.num ? 'text-slate-850 dark:text-white' : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Form Body */}
              <div className="p-6 sm:p-10 space-y-6">

                {/* STEP 1: BUSINESS TYPE */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 1: Tell Us About Your Business / व्यवसाय का प्रकार
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Select your primary agricultural enterprise category across the commercial supply chain.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {BUSINESS_TYPES.map((bt) => (
                        <div
                          key={bt.id}
                          onClick={() => setBusinessType(bt.id)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 space-y-1.5 select-none ${
                            businessType === bt.id
                              ? 'border-primary-600 bg-primary-50/60 dark:bg-primary-950/20 shadow-md ring-2 ring-primary-500/20'
                              : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-2xl">{bt.icon}</span>
                            {businessType === bt.id && (
                              <span className="w-2 h-2 rounded-full bg-primary-600" />
                            )}
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-slate-850 dark:text-white block">{bt.title}</span>
                            <p className="text-[9px] text-slate-400 font-semibold leading-relaxed mt-0.5">{bt.desc}</p>
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
                        Enter your registered entity credentials and contact officers.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Business Trade Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Grand Heritage Palace Hotels"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Legal Registered Entity Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Grand Heritage Hospitality Pvt Ltd"
                          value={legalName}
                          onChange={(e) => setLegalName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">GST Number</label>
                        <input
                          type="text"
                          placeholder="e.g. 27AAACG1234F1Z5"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">PAN Card Number</label>
                        <input
                          type="text"
                          placeholder="e.g. AAACG1234F"
                          value={panNumber}
                          onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Business Mobile Number *</label>
                        <input
                          type="tel"
                          placeholder="e.g. 9822998811"
                          value={businessMobile}
                          onChange={(e) => setBusinessMobile(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Official Business Email</label>
                        <input
                          type="email"
                          placeholder="e.g. procurement@heritagehotels.com"
                          value={businessEmail}
                          onChange={(e) => setBusinessEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Business Description / Operation Overview</label>
                        <textarea
                          rows="2"
                          placeholder="Brief description of your sourcing requirements and business scale..."
                          value={businessDesc}
                          onChange={(e) => setBusinessDesc(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: COMPLETE BUSINESS ADDRESS */}
                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                          Step 3: Complete Business Address & Location / व्यावसायिक पता
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Exact location details for logistics pickups, warehouse deliveries, and invoicing.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert('GPS Coordinates Synced from Device: 18.4965° N, 73.8643° E')}
                        className="px-3 py-1.5 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 rounded-xl text-xs font-extrabold border border-primary-200 flex items-center gap-1"
                      >
                        <MapPin size={12} />
                        <span>Use Current Location</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Building / Shop Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Trade Tower, Suite 402"
                          value={buildingName}
                          onChange={(e) => setBuildingName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Street / Road / Yard</label>
                        <input
                          type="text"
                          placeholder="e.g. Market Yard Road"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Area / Village / Hub</label>
                        <input
                          type="text"
                          placeholder="e.g. Gultekdi APMC Yard"
                          value={villageArea}
                          onChange={(e) => setVillageArea(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">City *</label>
                        <input
                          type="text"
                          placeholder="e.g. Pune"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">District *</label>
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
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Pincode *</label>
                        <input
                          type="text"
                          placeholder="e.g. 411037"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Simulated Map Coordinates Preview */}
                    <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-emerald-400" />
                        <div>
                          <span className="font-extrabold block">📍 Pinpointed Business Coordinates</span>
                          <span className="text-slate-400 text-[10px]">Lat: {latitude}° N, Lon: {longitude}° E (Consent Verified)</span>
                        </div>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-400/30">
                        GPS VERIFIED
                      </span>
                    </div>
                  </div>
                )}

                {/* STEP 4: BUSINESS OPERATIONS */}
                {step === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 4: What Does Your Business Do? / व्यावसायिक गतिविधियाँ
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Select all operations applicable to your agricultural enterprise.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Buy agricultural products',
                        'Sell agricultural products',
                        'Distribute agricultural products',
                        'Process agricultural products',
                        'Export agricultural products',
                        'Import agricultural products',
                        'Store agricultural products',
                        'Supply restaurants',
                        'Supply hotels',
                        'Supply retailers',
                        'Supply supermarkets',
                        'Supply mandis',
                        'Supply food processing companies'
                      ].map((op) => (
                        <div
                          key={op}
                          onClick={() => toggleOperation(op)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                            operations.includes(op)
                              ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/20 text-primary-900 dark:text-primary-300 font-extrabold'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-semibold'
                          }`}
                        >
                          <span className="text-xs">{op}</span>
                          <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs ${
                            operations.includes(op) ? 'bg-primary-600 text-white' : 'border border-slate-300'
                          }`}>
                            {operations.includes(op) ? '✓' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: CROP PORTFOLIO */}
                {step === 5 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 5: Crop Requirements & Portfolio / कृषि उत्पाद चयन
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Select crops and commodities handled by your enterprise.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {CROP_CATEGORIES.map((cat) => (
                        <div key={cat.category} className="space-y-2">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                            {cat.category}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {cat.items.map((crop) => (
                              <button
                                key={crop}
                                type="button"
                                onClick={() => toggleCrop(crop)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                                  selectedCrops.includes(crop)
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                }`}
                              >
                                {selectedCrops.includes(crop) ? '✓ ' : '+ '}{crop}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: PROCUREMENT REQUIREMENTS */}
                {step === 6 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 6: Monthly Procurement Demands / मासिक मांग
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Define expected volume, quality grade and purchase targets for key crops.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {cropRequirements.map((cr, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-extrabold block">Crop</span>
                            <span className="font-extrabold text-slate-850 dark:text-white text-sm">{cr.crop}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-extrabold block">Monthly Requirement</span>
                            <span className="font-bold text-primary-600">{cr.monthlyQty} {cr.unit}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-extrabold block">Quality Grade</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{cr.quality} ({cr.frequency})</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-extrabold block">Target Max Price</span>
                            <span className="font-black text-emerald-600">₹{cr.targetPrice}/kg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 7: SUPPLY & DISTRIBUTION NETWORK */}
                {step === 7 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 7: Where Do You Supply Your Products? / वितरण नेटवर्क
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Add target distribution cities, client restaurants, hotels, or wholesale markets.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {distributionList.map((dist, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-black text-slate-850 dark:text-white text-sm">{dist.name}</span>
                            <span className="text-slate-400 text-[11px] block mt-0.5">
                              📍 {dist.city} • {dist.count} {dist.type} Outlets • Volume: {dist.monthlyVolume}
                            </span>
                          </div>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded">
                            ACTIVE CHANNEL
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Add Destination Form */}
                    <div className="p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl space-y-3 bg-white dark:bg-slate-850">
                      <span className="text-xs font-extrabold text-slate-850 dark:text-white block">+ Add Distribution Location</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <input
                          type="text"
                          placeholder="e.g. Nashik Supermarket Hub"
                          value={newDistName}
                          onChange={(e) => setNewDistName(e.target.value)}
                          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl"
                        />
                        <select
                          value={newDistCity}
                          onChange={(e) => setNewDistCity(e.target.value)}
                          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl"
                        >
                          {maharashtraDistrictNames.slice(0, 10).map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <select
                          value={newDistType}
                          onChange={(e) => setNewDistType(e.target.value)}
                          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl"
                        >
                          <option value="Restaurant">Restaurant</option>
                          <option value="Hotel">Hotel</option>
                          <option value="Supermarket">Supermarket</option>
                          <option value="Retail Store">Retail Store</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddDistribution}
                        className="py-2 px-4 bg-primary-600 text-white font-extrabold text-xs rounded-xl hover:bg-primary-700"
                      >
                        Save Distribution Destination
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 8: WAREHOUSE / STORAGE */}
                {step === 8 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 8: Warehouse & Storage Facilities / भंडारण सुविधाएँ
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Do you have commercial warehouses, cold storages or ripening chambers?
                      </p>
                    </div>

                    <div className="flex gap-4">
                      {['YES', 'NO'].map((ans) => (
                        <button
                          key={ans}
                          type="button"
                          onClick={() => setHasWarehouse(ans)}
                          className={`flex-1 py-3 rounded-2xl text-xs font-black border transition ${
                            hasWarehouse === ans 
                              ? 'bg-primary-600 text-white border-primary-600 shadow' 
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
                          }`}
                        >
                          {ans === 'YES' ? 'Yes, We Own / Lease Storage Facilities' : 'No, Direct Transit Delivery'}
                        </button>
                      ))}
                    </div>

                    {hasWarehouse === 'YES' && (
                      <div className="space-y-3">
                        {warehousesList.map((wh, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-semibold">
                            <div>
                              <span className="font-extrabold text-slate-850 dark:text-white block">{wh.name}</span>
                              <span className="text-slate-400 text-[10px]">📍 {wh.city} • {wh.type}</span>
                            </div>
                            <span className="font-black text-primary-600">{wh.capacity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 9: TRANSPORT FLEET */}
                {step === 9 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 9: Transport & Fleet Logistics / परिवहन साधन
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        How do you receive agricultural cargo from primary suppliers?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'SA Group Transporter', title: '🚚 SA Group AgriLogistics Network', desc: 'On-demand verified truck dispatch & live GPS' },
                        { id: 'Own Vehicle', title: '🚛 Own Commercial Fleet', desc: 'In-house pickups & refrigerated reefers' },
                        { id: 'Third-party Transporter', title: '📦 Third-party Transport Contracts', desc: 'External contracted logistics firms' },
                        { id: 'Combination', title: '🔄 Hybrid Multi-Modal', desc: 'Combination of SA Group + Own Fleet' }
                      ].map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setTransportMode(t.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition ${
                            transportMode === t.id
                              ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/20 text-primary-900 dark:text-primary-300 font-extrabold ring-1 ring-primary-500/20'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="text-xs font-extrabold block">{t.title}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{t.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 10: DYNAMIC DOCUMENTS & REVIEW */}
                {step === 10 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 10: Verification Documents & Submit / दस्तावेज और सबमिशन
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Dynamic compliance credentials tailored to your {businessType} operations.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {[
                        { key: 'gst', label: '1. GST Certificate', icon: '📄' },
                        { key: 'pan', label: '2. Company / Business PAN', icon: '💳' },
                        { key: 'reg', label: '3. Shop Act / Incorporation Certificate', icon: '🏢' },
                        { key: 'fssai', label: '4. FSSAI Food Safety License', icon: '🛡️' },
                        { key: 'iec', label: '5. IEC Code (Exporters Only)', icon: '🚢' }
                      ].map((doc) => (
                        <div key={doc.key} className="p-3.5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{doc.icon}</span>
                            <div>
                              <span className="font-extrabold text-slate-850 dark:text-white block">{doc.label}</span>
                              <span className="text-[10px] text-emerald-600 font-bold">Document attached ✓</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-extrabold text-primary-600">Attached</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stepper Navigation Buttons */}
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

                  {step < 10 ? (
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
                      <span>Submit Business Registration 🏬</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>

              </div>
            </>
          ) : (
            /* STEP 11: PENDING VERIFICATION GATED STATE */
            <div className="p-8 sm:p-12 text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
                ⏳
              </div>

              <div className="space-y-2">
                <span className="bg-amber-100 text-amber-800 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                  🟡 Status: PENDING VERIFICATION
                </span>
                <h2 className="text-2xl font-black text-slate-850 dark:text-white">
                  Your AgriTrade Business Account Has Been Submitted
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your business profile (<strong>#{registrationId}</strong>) has been queued for verification. Compliance officers review business registration, address coordinates, and trade licenses.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-left max-w-md mx-auto space-y-2 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Business Enterprise:</span>
                  <span className="font-bold text-slate-850 dark:text-white">{businessName || 'Grand Heritage Palace Hotels'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-bold text-slate-850 dark:text-white">{businessType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Operating City:</span>
                  <span className="font-bold text-slate-850 dark:text-white">{city}, {district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Turnaround:</span>
                  <span className="font-bold text-primary-600">2 - 4 Business Hours</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => onNavigate('agritrade-login')}
                  className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-extrabold transition shadow"
                >
                  Return to AgriTrade Login
                </button>
                <button
                  onClick={() => onNavigate('landing')}
                  className="py-3 px-6 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-extrabold hover:bg-slate-50"
                >
                  Back to Homepage
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
