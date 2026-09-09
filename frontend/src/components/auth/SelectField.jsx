import React from 'react';

export default function SelectField({ 
  label, 
  value, 
  onChange, 
  options = [], 
  error, 
  icon: Icon,
  required = false
}) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <Icon size={16} />
          </span>
        )}
        <select
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-8 py-3.5 bg-slate-50 dark:bg-slate-800/50 border ${
            error 
              ? 'border-red-500 focus:ring-red-500/20' 
              : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-500'
          } rounded-2xl focus:outline-none focus:ring-2 text-sm font-semibold transition appearance-none dark:text-white`}
        >
          <option value="" disabled className="text-slate-400">
            Select / चुनें / निवडा
          </option>
          {options.map((opt, idx) => (
            <option key={idx} value={typeof opt === 'object' ? opt.value : opt}>
              {typeof opt === 'object' ? opt.label : opt}
            </option>
          ))}
        </select>
        
        {/* Custom Chevron indicator */}
        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 pointer-events-none">
          ▼
        </span>
      </div>

      {error && (
        <p className="text-[11px] font-bold text-red-500 mt-1 pl-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
