import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import AuthLayout from '../components/auth/AuthLayout';
import InputField from '../components/auth/InputField';
import AuthButton from '../components/auth/AuthButton';
import FormError from '../components/auth/FormError';
import { Phone } from 'lucide-react';

export default function AuthForgotPasswordPage({ onNavigate, setAuthTempData, role }) {
  const { t } = useTranslation();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFormErrors({});

    const val = identifier.trim();
    if (!val) {
      setError(t('auth.err_required'));
      setFormErrors({ identifier: t('auth.err_required') });
      return;
    }

    // Basic format checking for phone or email
    const isEmail = /\S+@\S+\.\S+/.test(val);
    const isPhone = /^\d{10}$/.test(val);

    if (!isEmail && !isPhone) {
      setError(t('auth.err_phone_invalid'));
      setFormErrors({ identifier: t('auth.err_phone_invalid') });
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    setAuthTempData({
      role: role || 'FARMER',
      phone: isPhone ? val : '9876543210',
      email: isEmail ? val : '',
      flowType: 'forgot'
    });

    onNavigate('auth-otp');
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Header */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">
            {t('auth.forgot_title')}
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold mt-2">
            {t('auth.forgot_text')}
          </p>
        </div>

        {/* Form Error alert */}
        <FormError message={error} />

        {/* Input */}
        <InputField
          label={t('common.phone') + ' / ' + t('common.email')}
          icon={Phone}
          placeholder="e.g. 9876543210 or email@agrinova.in"
          value={identifier}
          onChange={(e) => { setIdentifier(e.target.value); setError(''); setFormErrors({}); }}
          error={formErrors.identifier}
          required
        />

        {/* Send OTP button */}
        <AuthButton loading={loading}>
          {t('auth.send_otp')}
        </AuthButton>

        {/* Back link */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-650 hover:underline"
          >
            ← Back to Login / लॉगिन पर वापस जाएँ
          </button>
        </div>

      </form>
    </AuthLayout>
  );
}
