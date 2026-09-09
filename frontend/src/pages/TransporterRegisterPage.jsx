import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { maharashtraDistrictNames } from '../utils/mockData';
import { 
  Truck, Sprout, User, Phone, Mail, MapPin, FileText, 
  Upload, CheckCircle, ChevronRight, ChevronLeft, ArrowRight, 
  ShieldCheck, AlertCircle, Clock, CreditCard
} from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';

const VEHICLE_TYPES = [
  { id: 'Pickup', icon: '🛻', title: 'Pickup (e.g. Bolero Maxi)', capacity: '1.2 - 2.0 Ton', desc: 'Ideal for local mandi runs, farm pickups & quick city delivery' },
  { id: 'Mini Truck', icon: '🚛', title: 'Mini Truck (e.g. Tata 407)', capacity: '2.5 - 4.5 Ton', desc: 'Inter-district transport, medium crop volume & restaurant supplies' },
  { id: 'Tempo', icon: '🚐', title: 'Tempo / Three Wheeler', capacity: '500 kg - 1.0 Ton', desc: 'Fast retail store deliveries & narrow village farm access' },
  { id: 'Truck', icon: '🚚', title: 'Heavy Truck (10 - 20 Ton)', capacity: '10 - 25 Ton', desc: 'Long haul APMC Mandi, grain mill & processor bulk transport' },
  { id: 'Refrigerated Vehicle', icon: '❄️', title: 'Reefer / Cold Van', capacity: '2.0 - 15 Ton', desc: 'Temperature-controlled perishables, export grapes & berries' },
  { id: 'Other', icon: '➕', title: 'Other Commercial Vehicle', capacity: 'Custom Capacity', desc: 'Tractor trailer, bulk container or specialized agri-cargo' }
];

export default function TransporterRegisterPage({ onNavigate }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  // Step 1: Personal Info
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [state] = useState('Maharashtra');
  const [district, setDistrict] = useState('Nashik');
  const [taluka, setTaluka] = useState('Niphad');
  const [address, setAddress] = useState('');

  // Step 2: Vehicle Info
  const [vehicleType, setVehicleType] = useState('Pickup');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('2.5');
  const [capacityUnit, setCapacityUnit] = useState('Ton');
  const [operatingDistricts, setOperatingDistricts] = useState(['Nashik', 'Pune', 'Mumbai']);

  // Step 3: Documents
  const [licenseNumber, setLicenseNumber] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState({
    drivingLicense: true,
    rcBook: true,
    insurance: true,
    permit: true,
    identityDoc: true
  });

  // Step 4: Bank Details
  const [accountHolder, setAccountHolder] = useState('');
  const [bankName, setBankName] = useState('Bank of Maharashtra');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  // Step 5: Submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState('');

  const handleNext = () => {
    if (step === 1) {
      if (!fullName.trim() || !mobileNumber.trim()) {
        alert('Please fill out all required personal details.');
        return;
      }
    }
    if (step === 2) {
      if (!vehicleNumber.trim() || !vehicleCapacity) {
        alert('Please enter vehicle registration number and capacity.');
        return;
      }
    }
    if (step === 3) {
      if (!licenseNumber.trim()) {
        alert('Please enter your commercial driving license number.');
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitRegistration = () => {
    const newRegId = 'LOG-' + Math.floor(1000 + Math.random() * 9000);
    setRegistrationId(newRegId);

    const transporterRecord = {
      id: newRegId,
      name: fullName,
      role: 'TRANSPORTER',
      phone: mobileNumber,
      email: email || `${mobileNumber}@driver.agrinova.in`,
      district: district,
      taluka: taluka,
      address: address,
      vehicleType: vehicleType,
      vehicleNumber: vehicleNumber.toUpperCase(),
      vehicleCapacity: `${vehicleCapacity} ${capacityUnit}`,
      licenseNumber: licenseNumber,
      operatingDistricts: operatingDistricts,
      bankName: bankName,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    try {
      const existing = JSON.parse(localStorage.getItem('agrinova-registrations') || '[]');
      existing.unshift(transporterRecord);
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
            subtitle="Driver & Logistics Onboarding"
            onClick={() => onNavigate('landing')}
          />

          <button
            onClick={() => onNavigate('transporter-login')}
            className="text-xs font-extrabold text-primary-600 dark:text-primary-400 hover:underline"
          >
            Already a delivery partner? Sign In →
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
                    { num: 1, label: 'Personal Info' },
                    { num: 2, label: 'Vehicle Info' },
                    { num: 3, label: 'Documents' },
                    { num: 4, label: 'Bank Details' },
                    { num: 5, label: 'Submit' }
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
                        step >= s.num ? 'text-slate-850 dark:text-white' : 'text-slate-400'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Form Body */}
              <div className="p-6 sm:p-10 space-y-6">

                {/* STEP 1: PERSONAL INFORMATION */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 1: Personal & Location Details / व्यक्तिगत जानकारी
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Driver identification and base hub operating location in Maharashtra.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Full Name / पूरा नाम *</label>
                        <input
                          type="text"
                          placeholder="e.g. Satnam Singh"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Mobile Number / मोबाइल नंबर *</label>
                        <input
                          type="tel"
                          placeholder="e.g. 9822114477"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Email / ईमेल</label>
                        <input
                          type="email"
                          placeholder="e.g. driver@logistics.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Base District / गृह ज़िला *</label>
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
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Taluka / तालुका</label>
                        <input
                          type="text"
                          placeholder="e.g. Niphad / Haveli"
                          value={taluka}
                          onChange={(e) => setTaluka(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">State / राज्य</label>
                        <input
                          type="text"
                          value={state}
                          disabled
                          className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Residential / Transport Yard Address</label>
                        <textarea
                          rows="2"
                          placeholder="Plot / Street / Transport Nagar, APMC Market Hub"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: VEHICLE INFORMATION */}
                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 2: Vehicle Information / वाहन विवरण
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Select your registered transport vehicle specifications and payload capacity.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {VEHICLE_TYPES.map((vt) => (
                        <div
                          key={vt.id}
                          onClick={() => setVehicleType(vt.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 space-y-2 select-none ${
                            vehicleType === vt.id
                              ? 'border-primary-600 bg-primary-50/60 dark:bg-primary-950/20 shadow-md ring-2 ring-primary-500/20'
                              : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-2xl">{vt.icon}</span>
                            <span className="bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                              {vt.capacity}
                            </span>
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-slate-850 dark:text-white block">{vt.title}</span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 leading-relaxed">{vt.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Vehicle Registration Number *</label>
                        <input
                          type="text"
                          placeholder="e.g. MH-12-AB-1234"
                          value={vehicleNumber}
                          onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase dark:text-white tracking-wider"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Payload Capacity *</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 2.5"
                          value={vehicleCapacity}
                          onChange={(e) => setVehicleCapacity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Capacity Unit</label>
                        <select
                          value={capacityUnit}
                          onChange={(e) => setCapacityUnit(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        >
                          <option value="Ton">Ton</option>
                          <option value="Quintal">Quintal</option>
                          <option value="Kg">Kg</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: DOCUMENTS */}
                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 3: Verification Documents / दस्तावेज सत्यापन
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Upload standard legal driving and transport vehicle fitness documents.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Commercial Driving License Number (DL) *</label>
                      <input
                        type="text"
                        placeholder="e.g. MH12 20180012345"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase dark:text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {[
                        { key: 'drivingLicense', label: '1. Driving License (Commercial Badge)', icon: '🪪' },
                        { key: 'rcBook', label: '2. Vehicle RC Book / Registration', icon: '📄' },
                        { key: 'insurance', label: '3. Commercial Vehicle Insurance Policy', icon: '🛡️' },
                        { key: 'permit', label: '4. Maharashtra / National Goods Permit', icon: '📜' },
                        { key: 'identityDoc', label: '5. Identity Proof (Aadhaar / PAN)', icon: '🆔' }
                      ].map((doc) => (
                        <div key={doc.key} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{doc.icon}</span>
                            <div>
                              <span className="font-extrabold text-xs text-slate-850 dark:text-white block">{doc.label}</span>
                              <span className="text-[10px] text-emerald-600 font-bold">Document attached ✓</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => alert('Document re-upload simulated.')}
                            className="text-xs font-extrabold text-primary-600 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-xl hover:bg-slate-50"
                          >
                            Re-upload
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: BANK & PAYOUT DETAILS */}
                {step === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 4: Bank Account for Delivery Earnings / बैंक खाता विवरण
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Earnings from completed delivery trips will be credited directly via Escrow settlement.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Account Holder Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Satnam Singh"
                          value={accountHolder || fullName}
                          onChange={(e) => setAccountHolder(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Bank Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Bank of Maharashtra / SBI"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Bank Account Number *</label>
                        <input
                          type="password"
                          placeholder="e.g. 60123456789"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">IFSC Code *</label>
                        <input
                          type="text"
                          placeholder="e.g. MAHB0001234"
                          value={ifscCode}
                          onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                      <span className="font-extrabold block">🛡️ SA Group Instant Trip Payouts</span>
                      <p className="leading-relaxed font-medium">
                        Payment is released immediately to this bank account upon receiver delivery confirmation and quality inspection signoff.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 5: REVIEW & SUBMIT */}
                {step === 5 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                        Step 5: Review & Submit Application / समीक्षा और सबमिट
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Please verify your transport vehicle and driver details before final verification.
                      </p>
                    </div>

                    <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 text-xs font-semibold">
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-slate-400">Driver Name:</span>
                        <span className="font-bold text-slate-850 dark:text-white">{fullName || 'Satnam Singh'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-slate-400">Mobile Phone:</span>
                        <span className="font-bold text-slate-850 dark:text-white">{mobileNumber || '9822114477'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-slate-400">Vehicle Type & Reg:</span>
                        <span className="font-bold text-primary-600">{vehicleType} • {vehicleNumber || 'MH-12-AB-1234'} ({vehicleCapacity} {capacityUnit})</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-slate-400">Base District:</span>
                        <span className="font-bold text-slate-850 dark:text-white">{taluka}, {district}, Maharashtra</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Commercial DL:</span>
                        <span className="font-bold text-slate-850 dark:text-white">{licenseNumber || 'MH12 20180012345'}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
                      <span className="font-extrabold block">🛡️ Transporter Verification Policy</span>
                      <p className="leading-relaxed font-medium">
                        Your vehicle documents will be reviewed by SA Group Safety & Compliance. Once verified, you will receive instant dispatch alerts on your phone.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
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
                      <span>Submit Driver Registration 🚚</span>
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
                  🟡 Status: PENDING VERIFICATION
                </span>
                <h2 className="text-2xl font-black text-slate-850 dark:text-white">
                  Transporter Application Submitted
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your delivery partner application (<strong>#{registrationId}</strong>) has been registered. You cannot accept delivery jobs until your vehicle documents are approved.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-left max-w-md mx-auto space-y-2 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver Partner:</span>
                  <span className="font-bold text-slate-850 dark:text-white">{fullName || 'Satnam Singh'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="font-bold text-slate-850 dark:text-white">{vehicleType} ({vehicleNumber || 'MH-12-AB-1234'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Review Turnaround:</span>
                  <span className="font-bold text-primary-600">2 - 4 Business Hours</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => onNavigate('transporter-login')}
                  className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-extrabold transition shadow"
                >
                  Return to Transporter Login
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
