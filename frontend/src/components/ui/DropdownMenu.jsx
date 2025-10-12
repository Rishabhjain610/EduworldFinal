import React, { useState } from 'react';

export const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative" onBlur={() => setTimeout(() => setIsOpen(false), 100)}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

export const DropdownMenuTrigger = ({ children, isOpen, setIsOpen }) => (
  <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
    {children}
  </div>
);

export const DropdownMenuContent = ({ children, isOpen, className = "" }) => (
  isOpen && (
    <div className={`absolute right-0 top-full z-10 mt-1 w-48 rounded-md border bg-white shadow-lg ${className}`}>
      {children}
    </div>
  )
);

export const DropdownMenuItem = ({ children, onClick, className = "" }) => (
  <div
    onClick={onClick}
    className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${className}`}
  >
    {children}
  </div>
);