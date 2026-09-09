import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function PasswordField({ 
  label, 
  placeholder = '••••••••', 
  value, 
  onChange, 
  error,
  required = false
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
          <Lock size={16} />
        </span>
        
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800/50 border ${
            error 
              ? 'border-red-500 focus:ring-red-500/20' 
              : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-500'
          } rounded-2xl focus:outline-none focus:ring-2 text-sm font-semibold transition dark:text-white`}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && (
        <p className="text-[11px] font-bold text-red-500 mt-1 pl-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
