import React, { useState, useRef, useEffect } from 'react';
import { categories, getUnitsByCategory, convertUnit } from '../data/units';
import '../styles/UnitConverterPanel.css';

const UnitConverterPanel = ({ isOpen, onClose, onInsertValue }) => {
  const [activeCategory, setActiveCategory] = useState('length');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnitId, setFromUnitId] = useState('m');
  const [toUnitId, setToUnitId] = useState('ft');
  const [copyStatus, setCopyStatus] = useState('');
  const panelRef = useRef(null);
  const searchInputRef = useRef(null);

  // Update units when category changes
  useEffect(() => {
    const units = getUnitsByCategory(activeCategory);
    if (units && units.length >= 2) {
      setFromUnitId(units[0].id);
      setToUnitId(units[1].id || units[0].id);
    }
  }, [activeCategory]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleCopy = (value) => {
    navigator.clipboard.writeText(String(value));
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const handleInsert = (value) => {
    onInsertValue(value);
    onClose();
  };

  let convertedValue = 0;
  let fromUnit = null;
  let toUnit = null;

  const categoryUnits = getUnitsByCategory(activeCategory);
  
  if (categoryUnits && categoryUnits.length > 0) {
    fromUnit = categoryUnits.find(u => u.id === fromUnitId);
    toUnit = categoryUnits.find(u => u.id === toUnitId);
    
    if (fromUnit && toUnit) {
      try {
        const num = parseFloat(inputValue) || 0;
        convertedValue = convertUnit(num, fromUnitId, toUnitId);
      } catch (e) {
        convertedValue = 0;
      }
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="converter-overlay" />
      <div
        ref={panelRef}
        className="converter-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="converter-panel-title"
      >
        <div className="converter-header">
          <h2 id="converter-panel-title">Unit Converter</h2>
          <button
            className="converter-close"
            onClick={onClose}
            aria-label="Close converter panel"
          >
            ×
          </button>
        </div>

        <div className="converter-tabs">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              className={`converter-tab ${activeCategory === key ? 'active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="converter-controls">
          <div className="converter-input-group">
            <label htmlFor="converter-input">Value</label>
            <input
              id="converter-input"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="converter-input"
              step="any"
            />
          </div>

          <div className="converter-unit-select">
            <label htmlFor="from-unit">From</label>
            <select
              id="from-unit"
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="converter-select"
            >
              {categoryUnits && categoryUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.symbol} - {unit.name}
                </option>
              ))}
            </select>
          </div>

          <div className="converter-unit-select">
            <label htmlFor="to-unit">To</label>
            <select
              id="to-unit"
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="converter-select"
            >
              {categoryUnits && categoryUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.symbol} - {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {fromUnit && toUnit && (
          <div className="converter-result">
            <div className="result-display">
              <span className="result-value">{inputValue}</span>
              <span className="result-unit">{fromUnit.symbol}</span>
              <span className="result-equals">=</span>
              <span className="result-value">{convertedValue.toFixed(6)}</span>
              <span className="result-unit">{toUnit.symbol}</span>
            </div>

            <div className="result-actions">
              <button
                className="result-btn copy-btn"
                onClick={() => handleCopy(convertedValue)}
              >
                📋 {copyStatus || 'Copy'}
              </button>
              <button
                className="result-btn insert-btn"
                onClick={() => handleInsert(convertedValue)}
              >
                ➕ Insert
              </button>
            </div>
          </div>
        )}

        <div className="converter-footer">
          <span>Convert between units</span>
        </div>
      </div>
    </>
  );
};

export default UnitConverterPanel;
