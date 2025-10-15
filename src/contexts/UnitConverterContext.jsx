import React, { createContext, useContext, useState } from 'react';

const UnitConverterContext = createContext();

export function UnitConverterProvider({ children }) {
  const [showConverter, setShowConverter] = useState(false);

  return (
    <UnitConverterContext.Provider value={{ showConverter, setShowConverter }}>
      {children}
    </UnitConverterContext.Provider>
  );
}

export function useUnitConverter() {
  const context = useContext(UnitConverterContext);
  if (!context) {
    throw new Error('useUnitConverter must be used within UnitConverterProvider');
  }
  return context;
}
