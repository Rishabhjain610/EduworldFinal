import React, { useRef, useEffect } from 'react';

export const Popover = ({ children, open, onOpenChange }) => {
  const popoverRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onOpenChange(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onOpenChange]);

  // Clone children and inject open/onOpenChange to Trigger
  const enhancedChildren = React.Children.map(children, (child) => {
    if (child.type && child.type.displayName === "PopoverTrigger") {
      return React.cloneElement(child, { open, onOpenChange });
    }
    return child;
  });

  return (
    <div className="relative" ref={popoverRef}>
      {enhancedChildren}
    </div>
  );
};

export const PopoverTrigger = ({ children, asChild, open, onOpenChange }) => {
  const handleClick = () => {
    onOpenChange(!open);
  };
  return (
    <div className="cursor-pointer" onClick={handleClick}>
      {children}
    </div>
  );
};
PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = ({ children, className = "", open }) => {
  if (!open) return null;
  return (
    <div className={`absolute top-full left-0 z-10 mt-2 w-64 rounded-md border bg-white p-4 shadow-lg ${className}`}>
      {children}
    </div>
  );
};