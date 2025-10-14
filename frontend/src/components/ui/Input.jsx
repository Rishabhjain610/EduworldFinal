import React from 'react';

export const Input = ({ 
  className = "", 
  type = "text", 
  placeholder = "",
  ...props 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`flex h-10 w-full rounded-md border border-orange-300 bg-white px-3 py-2 text-sm placeholder:text-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};