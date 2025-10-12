import React from 'react';

export const AlertDialog = ({ open, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const AlertDialogContent = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 ${className}`}>
    {children}
  </div>
);

export const AlertDialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const AlertDialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-900 mb-2">{children}</h2>
);

export const AlertDialogDescription = ({ children }) => (
  <div className="text-gray-600 mb-4">{children}</div>
);

export const AlertDialogFooter = ({ children }) => (
  <div className="flex justify-end gap-2">{children}</div>
);

export const AlertDialogAction = ({ children, onClick, disabled, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

export const AlertDialogCancel = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 ${className}`}
  >
    {children}
  </button>
);