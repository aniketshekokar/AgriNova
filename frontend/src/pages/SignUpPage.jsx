import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import InputField from '../components/auth/InputField';
import SelectField from '../components/auth/SelectField';
import PasswordField from '../components/auth/PasswordField';
import AuthButton from '../components/auth/AuthButton';
import FormError from '../components/auth/FormError';
import { User, Phone, Mail, Map, Truck, ShoppingBag } from 'lucide-react';

const districts = [
  'Ahmednagar (Ahilyanagar)', 'Akola', 'Amravati', 'Beed', 'Bhandara', 'Buldhana',
  'Chandrapur', 'Chhatrapati Sambhajinagar', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
  'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur',
  'Nanded', 'Nandurbar', 'Nashik', 'Dharashiv (Osmanabad)', 'Palghar', 'Parbhani',
  'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur',
  'Thane', 'Wardha', 'Washim', 'Yavatmal'
];

const crops = [
  'Tomato', 'Onion', 'Potato', 'Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane',
  'Soybean', 'Chilli', 'Tur', 'Gram', 'Jowar', 'Bajra', 'Grapes', 'Banana',
  'Orange', 'Turmeric', 'Groundnut', 'Mango', 'Cashew', 'Other'
];

const farmSizes = [
  'Less than 1 Acre',
  '1–2 Acres',
  '2–5 Acres',
  '5–10 Acres',
  'More than 10 Acres'
];

const businessTypes = [
  'Trader', 'Retailer', 'Restaurant', 'Hotel', 'Food Processing Company', 'Exporter', 'Wholesaler', 'Other'
];

const vehicleTypes = [
  'Mini Truck', 'Pickup', 'Truck', 'Tempo', 'Other'
];

const states = ['Maharashtra'];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'mr', label: 'मराठी' }
];

export default function SignUpPage({ onNavigate, role, setRole, setAuthTempData }) {
  const { t, setLang } = useTranslation();
  const { signup, loading } = useAuth();
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Dynamic state container
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    state: 'Maharashtra',
    district: '',
    taluka: '',
    village: '',
    mainCrop: '',
    farmSize: '',
    preferredLanguage: 'en',
    password: '',
    confirmPassword: '',
    
    // Buyer specific
    businessType: '',
    city: '',
    productsRequired: '',

    // Transporter specific
    vehicleType: '',
    vehicleNumber: '',
    vehicleCapacity: ''
  });

  const handleInputChange = (field, val) => {
    setFormData({ ...formData, [field]: val });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
    setError('');
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = t('auth.err_required');
    
    const phoneTrim = formData.mobileNumber.trim();
    if (!phoneTrim) {
      errs.mobileNumber = t('auth.err_required');
    } else if (!/^\d{10}$/.test(phoneTrim)) {
      errs.mobileNumber = t('auth.err_phone_invalid');
    }

    if (role !== 'FARMER' && !formData.email.trim()) {
      errs.email = t('auth.err_required');
    } else if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = t('auth.err_email_invalid');
    }

    if (!formData.state) errs.state = t('auth.err_state_required');
    if (!formData.district) errs.district = t('auth.err_district_required');

    // Role specific required check
    if (role === 'FARMER') {
      if (!formData.taluka.trim()) errs.taluka = t('auth.err_required');
      if (!formData.village.trim()) errs.village = t('auth.err_required');
      if (!formData.mainCrop) errs.mainCrop = t('auth.err_required');
      if (!formData.farmSize) errs.farmSize = t('auth.err_required');
    } else if (role === 'BUYER') {
      if (!formData.businessType) errs.businessType = t('auth.err_required');
      if (!formData.city.trim()) errs.city = t('auth.err_required');
      if (!formData.productsRequired.trim()) errs.productsRequired = t('auth.err_required');
    } else if (role === 'TRANSPORTER') {
      if (!formData.vehicleType) errs.vehicleType = t('auth.err_required');
      if (!formData.vehicleNumber.trim()) errs.vehicleNumber = t('auth.err_required');
      if (!formData.vehicleCapacity.trim()) errs.vehicleCapacity = t('auth.err_required');
    }

    // Password validation rules
    const password = formData.password;
    if (!password) {
      errs.password = t('auth.err_required');
    } else if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errs.password = t('auth.err_password_strength');
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = t('auth.err_required');
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = t('auth.err_password_match');
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError(t('auth.err_required'));
      return;
    }

    // Call context to start registration process
    // First, route to OTP verification
    setAuthTempData({
      role: role,
      phone: formData.mobileNumber,
      email: formData.email,
      username: formData.fullName,
      password: formData.password,
      vehicleNumber: formData.vehicleNumber,
      vehicleType: formData.vehicleType,
      flowType: 'signup'
    });

    // Instantly sync locale context language selector
    setLang(formData.preferredLanguage);

    // Navigate to OTP page
    onNavigate('auth-otp');
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        
        {/* Title */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">
            {t('auth.signup_title')}
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold mt-1">
            {t('auth.signup_subtitle')}
          </p>
        </div>

        {/* Global Error Banner */}
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

        {/* Dynamic Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          
          {/* Section: Common fields */}
          <InputField
            label={role === 'BUYER' ? t('auth.business_name') : t('auth.full_name')}
            icon={User}
            placeholder="e.g. Ramesh Patil"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            error={formErrors.fullName}
            required
          />

          <InputField
            label={t('auth.mobile_number')}
            type="tel"
            icon={Phone}
            placeholder="e.g. 9876543210"
            value={formData.mobileNumber}
            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
            error={formErrors.mobileNumber}
            maxLength={10}
            required
          />

          <InputField
            label={role === 'FARMER' ? t('auth.email_optional') : t('common.email')}
            type="email"
            icon={Mail}
            placeholder="e.g. contact@agri.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={formErrors.email}
            required={role !== 'FARMER'}
          />

          {/* Section: Regional & Location drop-downs */}
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label={t('auth.state')}
              icon={Map}
              options={states}
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              error={formErrors.state}
              required
            />

            <SelectField
              label={t('auth.district')}
              icon={Map}
              options={districts}
              value={formData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              error={formErrors.district}
              required
            />
          </div>

          {/* Section: Farmer Specific Fields */}
          {role === 'FARMER' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label={t('auth.taluka')}
                  placeholder="e.g. Haveli"
                  value={formData.taluka}
                  onChange={(e) => handleInputChange('taluka', e.target.value)}
                  error={formErrors.taluka}
                  required
                />

                <InputField
                  label={t('auth.village')}
                  placeholder="e.g. Wagholi"
                  value={formData.village}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                  error={formErrors.village}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label={t('auth.main_crop')}
                  options={crops}
                  value={formData.mainCrop}
                  onChange={(e) => handleInputChange('mainCrop', e.target.value)}
                  error={formErrors.mainCrop}
                  required
                />

                <SelectField
                  label={t('auth.farm_size')}
                  options={farmSizes}
                  value={formData.farmSize}
                  onChange={(e) => handleInputChange('farmSize', e.target.value)}
                  error={formErrors.farmSize}
                  required
                />
              </div>
            </>
          )}

          {/* Section: Buyer Specific Fields */}
          {role === 'BUYER' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label={t('auth.business_type')}
                  options={businessTypes}
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  error={formErrors.businessType}
                  required
                />

                <InputField
                  label={t('auth.city')}
                  placeholder="e.g. Vashi, Navi Mumbai"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  error={formErrors.city}
                  required
                />
              </div>

              <InputField
                label={t('auth.products_required')}
                icon={ShoppingBag}
                placeholder="e.g. Onion, Tomato, Wheat"
                value={formData.productsRequired}
                onChange={(e) => handleInputChange('productsRequired', e.target.value)}
                error={formErrors.productsRequired}
                required
              />
            </>
          )}

          {/* Section: Transporter Specific Fields */}
          {role === 'TRANSPORTER' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label={t('auth.vehicle_type')}
                  options={vehicleTypes}
                  value={formData.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                  error={formErrors.vehicleType}
                  required
                />

                <InputField
                  label={t('auth.vehicle_number')}
                  icon={Truck}
                  placeholder="e.g. MH-12-QW-4567"
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                  error={formErrors.vehicleNumber}
                  required
                />
              </div>

              <InputField
                label={t('auth.vehicle_capacity')}
                placeholder="e.g. 2 Tons / 5 Tons"
                value={formData.vehicleCapacity}
                onChange={(e) => handleInputChange('vehicleCapacity', e.target.value)}
                error={formErrors.vehicleCapacity}
                required
              />
            </>
          )}

          {/* Preferred Language & Password section */}
          <SelectField
            label={t('auth.preferred_language')}
            options={languages}
            value={formData.preferredLanguage}
            onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
            required
          />

          <PasswordField
            label={t('common.password')}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={formErrors.password}
            required
          />

          <PasswordField
            label={t('auth.confirm_password')}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            error={formErrors.confirmPassword}
            required
          />

          {/* Submit Button */}
          <div className="pt-2">
            <AuthButton loading={loading}>
              {role === 'FARMER' 
                ? t('auth.farmer_signup') 
                : role === 'BUYER' 
                ? t('auth.buyer_signup') 
                : t('auth.transporter_signup')}
            </AuthButton>
          </div>

        </form>

        {/* Login Link */}
        <div className="text-center text-xs font-bold text-slate-500">
          Already have an account?{' '}
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
