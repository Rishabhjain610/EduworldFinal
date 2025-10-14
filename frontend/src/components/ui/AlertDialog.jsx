import React from 'react';

export const AlertDialog = ({ open, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-orange-100 bg-opacity-50" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const AlertDialogContent = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 border border-orange-200 ${className}`}>
    {children}
  </div>
);

export const AlertDialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const AlertDialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-orange-500 mb-2">{children}</h2>
);

export const AlertDialogDescription = ({ children }) => (
  <div className="text-orange-400 mb-4">{children}</div>
);

export const AlertDialogFooter = ({ children }) => (
  <div className="flex justify-end gap-2">{children}</div>
);

export const AlertDialogAction = ({ children, onClick, disabled, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

export const AlertDialogCancel = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`bg-orange-100 text-orange-500 px-4 py-2 rounded-md hover:bg-orange-200 ${className}`}
  >
    {children}
  </button>
);