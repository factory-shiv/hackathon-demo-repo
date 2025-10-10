import React, { createContext, useState, useContext, useEffect } from 'react';

const MemoryContext = createContext({
  memoryValue: null,
  hasMemory: false,
  memoryAdd: () => {},
  memorySubtract: () => {},
  memoryRecall: () => {},
  memoryClear: () => {}
});

const STORAGE_KEY = 'calculator_memory';

export const MemoryProvider = ({ children }) => {
  const isBrowser = typeof window !== 'undefined';

  const [memoryValue, setMemoryValue] = useState(() => {
    if (isBrowser) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          const parsed = parseFloat(stored);
          return isNaN(parsed) ? null : parsed;
        }
      } catch (error) {
        return null;
      }
    }
    return null;
  });

  const hasMemory = memoryValue !== null;

  useEffect(() => {
    if (!isBrowser) return;
    
    try {
      if (memoryValue !== null) {
        localStorage.setItem(STORAGE_KEY, String(memoryValue));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      // Ignore localStorage errors
    }
  }, [memoryValue, isBrowser]);

  const memoryAdd = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    
    setMemoryValue(prevMemory => {
      if (prevMemory === null) return num;
      return prevMemory + num;
    });
  };

  const memorySubtract = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    
    setMemoryValue(prevMemory => {
      if (prevMemory === null) return -num;
      return prevMemory - num;
    });
  };

  const memoryRecall = () => {
    return memoryValue;
  };

  const memoryClear = () => {
    setMemoryValue(null);
  };

  useEffect(() => {
    if (!isBrowser) return;

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue === null) {
          setMemoryValue(null);
        } else {
          const parsed = parseFloat(e.newValue);
          setMemoryValue(isNaN(parsed) ? null : parsed);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isBrowser]);

  const contextValue = {
    memoryValue,
    hasMemory,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear
  };

  return (
    <MemoryContext.Provider value={contextValue}>
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  return context;
};
