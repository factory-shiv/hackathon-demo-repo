import React, { useState, useRef, useEffect } from 'react';
import { useNumberFormat } from '../contexts/NumberFormatContext';
import '../styles/NumberFormatToggle.css';

const NumberFormatToggle = () => {
  const { 
    formattingEnabled, 
    toggleFormatting, 
    scientificNotation, 
    setScientificNotation 
  } = useNumberFormat();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handleScientificChange = (mode) => {
    setScientificNotation(mode);
    setShowDropdown(false);
  };

  const getScientificLabel = () => {
    switch (scientificNotation) {
      case 'always': return '1.23×10³';
      case 'never': return '1230';
      default: return 'Auto';
    }
  };

  return (
    <div className="number-format-controls">
      <label className="number-format-toggle" title={formattingEnabled ? 'Disable thousand separators' : 'Enable thousand separators'}>
        <input
          type="checkbox"
          className="number-format-toggle-input"
          role="switch"
          aria-checked={formattingEnabled}
          aria-label={formattingEnabled ? 'Disable thousand separators' : 'Enable thousand separators'}
          checked={formattingEnabled}
          onChange={toggleFormatting}
        />
        <div className="number-format-toggle-track">
          <div className="number-format-toggle-thumb">
            {formattingEnabled ? (
              <svg
                className="format-on-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M4 9h4v2H4V9zm0 4h4v2H4v-2zm10-4h6v2h-6V9zm0 4h6v2h-6v-2zm-5 4h4v2H9v-2zm0-8h4v2H9V9z"
                />
              </svg>
            ) : (
              <svg
                className="format-off-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M5 9h14v2H5V9zm0 4h14v2H5v-2zm0 4h14v2H5v-2z"
                />
              </svg>
            )}
          </div>
        </div>
      </label>
      
      <div className="scientific-dropdown-container" ref={dropdownRef}>
        <button
          className="scientific-toggle-btn"
          onClick={() => setShowDropdown(!showDropdown)}
          aria-label="Scientific notation mode"
          title="Scientific notation mode"
        >
          {getScientificLabel()}
        </button>
        
        {showDropdown && (
          <div className="scientific-dropdown">
            <button
              className={scientificNotation === 'auto' ? 'active' : ''}
              onClick={() => handleScientificChange('auto')}
            >
              <span className="option-label">Auto</span>
              <span className="option-desc">Large/small numbers</span>
            </button>
            <button
              className={scientificNotation === 'always' ? 'active' : ''}
              onClick={() => handleScientificChange('always')}
            >
              <span className="option-label">Always On</span>
              <span className="option-desc">1.23×10³</span>
            </button>
            <button
              className={scientificNotation === 'never' ? 'active' : ''}
              onClick={() => handleScientificChange('never')}
            >
              <span className="option-label">Off</span>
              <span className="option-desc">Standard notation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberFormatToggle;
