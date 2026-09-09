import React, { useRef, useEffect } from 'react';

export default function OTPInput({ value = '', onChange }) {
  const inputRefs = useRef([]);

  useEffect(() => {
    // Initialize input refs list length
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (e, idx) => {
    const val = e.target.value;
    
    // Only accept digit numbers
    if (val && !/^[0-9]$/.test(val)) return;

    const otpArray = value.split('');
    otpArray[idx] = val;
    const newOtp = otpArray.join('');
    
    onChange(newOtp);

    // If typing digit, focus next input
    if (val && idx < 5) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      const otpArray = value.split('');
      
      // If current box is empty, clear previous box and focus it
      if (!otpArray[idx] && idx > 0) {
        otpArray[idx - 1] = '';
        onChange(otpArray.join(''));
        inputRefs.current[idx - 1].focus();
      } else {
        // Clear current box
        otpArray[idx] = '';
        onChange(otpArray.join(''));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Validate that it's a 6 digit number
    if (/^\d{6}$/.test(pastedData)) {
      onChange(pastedData);
      inputRefs.current[5].focus();
    }
  };

  return (
    <div className="flex justify-center gap-3" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          maxLength="1"
          value={value[idx] || ''}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className="w-12 h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-center font-extrabold text-xl rounded-2xl focus:outline-none transition dark:text-white"
        />
      ))}
    </div>
  );
}
