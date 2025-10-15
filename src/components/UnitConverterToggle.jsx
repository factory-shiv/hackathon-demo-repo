import React from 'react';
import { useUnitConverter } from '../contexts/UnitConverterContext';

const UnitConverterToggle = () => {
  const { showConverter, setShowConverter } = useUnitConverter();

  return (
    <button
      className="HeaderButton UnitConverterToggle"
      onClick={() => setShowConverter(!showConverter)}
      title="Open unit converter (Ctrl+Alt+U)"
      aria-pressed={showConverter}
    >
      📐
    </button>
  );
};

export default UnitConverterToggle;
