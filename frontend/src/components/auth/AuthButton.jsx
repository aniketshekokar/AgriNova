import React from 'react';

export default function AuthButton({ 
  children, 
  onClick, 
  type = 'submit', 
  variant = 'primary', 
  disabled = false, 
  loading = false 
}) {
  const baseStyles = "w-full py-4 px-6 rounded-2xl font-extrabold text-sm transition duration-200 flex items-center justify-center gap-2 select-none shadow-sm cursor-pointer";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/10 hover:shadow-md hover:shadow-primary-500/20 active:scale-[0.99] border border-transparent disabled:bg-primary-400 disabled:cursor-not-allowed",
    secondary: "bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 active:scale-[0.99]"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
