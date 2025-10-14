import React from 'react';

export const Textarea = ({ 
  className = "", 
  placeholder = "",
  ...props 
}) => {
  return (
    <textarea
      placeholder={placeholder}
      className={`flex min-h-[80px] w-full rounded-md border border-orange-300 bg-white px-3 py-2 text-sm placeholder:text-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};