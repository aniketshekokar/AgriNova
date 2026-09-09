import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function FormError({ message }) {
  if (!message) return null;
  return (
    <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-start gap-2.5 border border-red-100 dark:border-red-900/30 text-xs font-bold leading-relaxed shadow-sm">
      <AlertCircle size={16} className="shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
