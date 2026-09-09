import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordField from '../components/auth/PasswordField';
import AuthButton from '../components/auth/AuthButton';
import FormError from '../components/auth/FormError';
import { CheckCircle } from 'lucide-react';

export default function AuthResetPasswordPage({ onNavigate }) {
  const { t } = useTranslation();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePassword = () => {
    const errs = {};
    
    if (!password) {
      errs.password = t('auth.err_required');
    } else if (
      password.length < 8 || 
      !/[A-Z]/.test(password) || 
      !/[0-9]/.test(password) || 
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      errs.password = t('auth.err_password_strength');
    }

    if (!confirmPassword) {
      errs.confirmPassword = t('auth.err_required');
    } else if (password !== confirmPassword) {
      errs.confirmPassword = t('auth.err_password_match');
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePassword()) {
      setError(t('auth.err_required'));
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/20 text-green-500 border border-green-100 dark:border-green-900/30">
            <CheckCircle size={36} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
              {t('auth.reset_success')}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
              You can now login with your new password / आप अब नए पासवर्ड से लॉगिन कर सकते हैं।
            </p>
          </div>

          <AuthButton onClick={() => onNavigate('login')}>
            {t('auth.go_to_login')}
          </AuthButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Header */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">
            {t('auth.reset_title')}
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold mt-2">
            Create a secure new password for your account.
          </p>
        </div>

        {/* Form error warning */}
        <FormError message={error} />

        <PasswordField
          label={t('auth.new_password')}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); setFormErrors({}); }}
          error={formErrors.password}
          required
        />

        <PasswordField
          label={t('auth.confirm_new_password')}
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); setError(''); setFormErrors({}); }}
          error={formErrors.confirmPassword}
          required
        />

        {/* Reset button */}
        <AuthButton loading={loading}>
          {t('auth.reset_btn')}
        </AuthButton>

      </form>
    </AuthLayout>
  );
}
