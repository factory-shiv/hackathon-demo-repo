import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

// Create context with default values
const NumberFormatContext = createContext({
  formattingEnabled: true,
  toggleFormatting: () => {},
  locale: 'en-US',
  formatter: null
});

// Storage key for localStorage
const STORAGE_KEY = 'calculator_number_format_enabled';

export const NumberFormatProvider = ({ children }) => {
  // Determine if we're in a browser environment (SSR safety)
  const isBrowser = typeof window !== 'undefined';
  
  // Get user's locale with fallback
  const userLocale = useMemo(() => {
    if (isBrowser && navigator.language) {
      return navigator.language;
    }
    return 'en-US';
  }, [isBrowser]);

  // Initialize state from localStorage or default to true
  const [formattingEnabled, setFormattingEnabled] = useState(() => {
    if (isBrowser) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        // Only return false if explicitly stored as 'false'
        return stored !== null ? stored === 'true' : true;
      } catch (error) {
        // Handle localStorage errors (private browsing, etc.)
        return true;
      }
    }
    return true;
  });

  // Create formatter instance with current locale
  const formatter = useMemo(() => {
    return new Intl.NumberFormat(userLocale, {
      useGrouping: formattingEnabled,
      maximumFractionDigits: 20 // Support long decimal values
    });
  }, [userLocale, formattingEnabled]);

  // Toggle formatting and update localStorage
  const toggleFormatting = () => {
    setFormattingEnabled(prev => {
      const newValue = !prev;
      if (isBrowser) {
        try {
          localStorage.setItem(STORAGE_KEY, String(newValue));
        } catch (error) {
          // Ignore localStorage errors
        }
      }
      return newValue;
    });
  };

  // Sync with localStorage if it changes externally
  useEffect(() => {
    if (!isBrowser) return;

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        setFormattingEnabled(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isBrowser]);

  // Context value
  const contextValue = {
    formattingEnabled,
    toggleFormatting,
    locale: userLocale,
    formatter
  };

  return (
    <NumberFormatContext.Provider value={contextValue}>
      {children}
    </NumberFormatContext.Provider>
  );
};

// Custom hook for consuming the context
export const useNumberFormat = () => {
  const context = useContext(NumberFormatContext);
  if (context === undefined) {
    throw new Error('useNumberFormat must be used within a NumberFormatProvider');
  }
  return context;
};
