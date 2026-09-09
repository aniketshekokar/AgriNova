import React from 'react';

/**
 * Modern SA Group Brand Logo with stylized 'SA' monogram & agricultural accent
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} iconOnly - whether to display only the SA icon badge
 * @param {string} className - extra classes
 * @param {string} subtitle - custom tagline or subtext
 * @param {string} textColor - custom title color (defaults to dark / white in dark mode)
 */
export default function BrandLogo({ 
  size = 'md', 
  iconOnly = false, 
  className = '', 
  subtitle = '',
  textColor = '',
  onClick,
  showSubtitle = false
}) {
  // Dimension mapping
  const sizeMap = {
    sm: {
      box: 'w-8 h-8 rounded-xl',
      svg: 'w-5 h-5',
      text: 'text-lg',
      sub: 'text-[8px]',
      gap: 'gap-2'
    },
    md: {
      box: 'w-10 h-10 rounded-2xl',
      svg: 'w-6 h-6',
      text: 'text-2xl',
      sub: 'text-[10px]',
      gap: 'gap-3'
    },
    lg: {
      box: 'w-12 h-12 rounded-2xl',
      svg: 'w-7 h-7',
      text: 'text-3xl',
      sub: 'text-xs',
      gap: 'gap-3.5'
    },
    xl: {
      box: 'w-14 h-14 rounded-3xl',
      svg: 'w-8 h-8',
      text: 'text-4xl',
      sub: 'text-sm',
      gap: 'gap-4'
    }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div 
      className={`flex items-center ${currentSize.gap} cursor-pointer select-none group flex-shrink-0 ${className}`}
      onClick={onClick}
    >
      {/* Stylized 'SA' Emblem Badge */}
      <div 
        className={`${currentSize.box} relative flex-shrink-0 bg-gradient-to-br from-primary-600 via-emerald-600 to-teal-700 p-1 flex items-center justify-center text-white shadow-md shadow-primary-500/25 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary-500/35 transition-all duration-300 border border-white/20`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`${currentSize.svg} text-white drop-shadow-sm fill-current`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background subtle geometric glow */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
          
          {/* SA Monogram Typography */}
          {/* S glyph */}
          <path
            d="M 44 32 C 34 32 26 37 26 44 C 26 53 43 53 43 60 C 43 64 37 66 31 66 C 24 66 18 62 16 57"
            fill="none"
            stroke="white"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* A glyph with agricultural leaf peak */}
          <path
            d="M 52 68 L 68 28 L 84 68"
            fill="none"
            stroke="white"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* A crossbar */}
          <path
            d="M 58 54 L 78 54"
            fill="none"
            stroke="#FDE047"
            strokeWidth="7"
            strokeLinecap="round"
          />
          
          {/* Sprout Leaf Emblem on the apex of A */}
          <path
            d="M 68 26 C 68 18 78 14 82 14 C 82 22 74 26 68 26 Z"
            fill="#86EFAC"
          />
        </svg>

        {/* Shimmer pulse dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full border border-white shadow-sm animate-pulse" />
      </div>

      {/* Brand Text */}
      {!iconOnly && (
        <div className="leading-none flex-shrink-0">
          <div className="flex items-center">
            <span className={`${currentSize.text} font-black tracking-tight ${textColor || 'text-slate-850 dark:text-white'} font-sans block leading-none whitespace-nowrap`}>
              SA GROUP
            </span>
          </div>
          {showSubtitle && subtitle && (
            <span className={`${currentSize.sub} text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase mt-1 block`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
