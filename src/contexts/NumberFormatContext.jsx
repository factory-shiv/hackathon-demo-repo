import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

// Create context with default values
const NumberFormatContext = createContext({
  formattingEnabled: true,
  toggleFormatting: () => {},
  locale: 'en-US',
  formatter: null,
  scientificNotation: 'auto',
  setScientificNotation: () => {},
  formatNumber: () => {}
});

// Storage keys for localStorage
const STORAGE_KEY = 'calculator_number_format_enabled';
const SCIENTIFIC_KEY = 'calculator_scientific_notation';

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

  // Scientific notation mode: 'auto', 'always', 'never'
  const [scientificNotation, setScientificNotationState] = useState(() => {
    if (isBrowser) {
      try {
        const stored = localStorage.getItem(SCIENTIFIC_KEY);
        return stored || 'auto';
      } catch (error) {
        return 'auto';
      }
    }
    return 'auto';
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

  // Set scientific notation mode
  const setScientificNotation = (mode) => {
    setScientificNotationState(mode);
    if (isBrowser) {
      try {
        localStorage.setItem(SCIENTIFIC_KEY, mode);
      } catch (error) {
        // Ignore localStorage errors
      }
    }
  };

  // Format a number based on current settings
  const formatNumber = (value) => {
    if (typeof value !== 'number' || !isFinite(value)) {
      return String(value);
    }

    const absValue = Math.abs(value);
    const shouldUseScientific = 
      scientificNotation === 'always' || 
      (scientificNotation === 'auto' && (absValue >= 1e9 || (absValue > 0 && absValue <= 1e-6)));

    if (shouldUseScientific) {
      // Format in scientific notation
      const exponent = Math.floor(Math.log10(absValue));
      const mantissa = value / Math.pow(10, exponent);
      const formattedMantissa = mantissa.toFixed(2).replace(/\.?0+$/, '');
      return `${formattedMantissa}×10${superscriptNumber(exponent)}`;
    }

    // Regular formatting
    if (formattingEnabled) {
      return formatter.format(value);
    }
    
    return String(value);
  };

  // Helper to convert number to superscript
  const superscriptNumber = (num) => {
    const superscripts = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      '-': '⁻', '+': '⁺'
    };
    return String(num).split('').map(char => superscripts[char] || char).join('');
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
    formatter,
    scientificNotation,
    setScientificNotation,
    formatNumber
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
