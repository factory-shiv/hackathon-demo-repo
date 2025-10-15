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
  const inputRef = useRef(null);

  // When category changes, reset unit selections
  useEffect(() => {
    const units = getUnitsByCategory(activeCategory);
    if (units && units.length >= 2) {
      setFromUnitId(units[0].id);
      setToUnitId(units[1].id);
    } else if (units && units.length === 1) {
      setFromUnitId(units[0].id);
      setToUnitId(units[0].id);
    }
  }, [activeCategory]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
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

  const categoryUnits = getUnitsByCategory(activeCategory) || [];
  const fromUnit = categoryUnits.find(u => u.id === fromUnitId);
  const toUnit = categoryUnits.find(u => u.id === toUnitId);

  let convertedValue = 0;
  if (fromUnit && toUnit) {
    try {
      const num = parseFloat(inputValue) || 0;
      convertedValue = convertUnit(num, fromUnitId, toUnitId);
    } catch (err) {
      convertedValue = 0;
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
          {Object.keys(categories).map((catKey) => (
            <button
              key={catKey}
              className={`converter-tab ${activeCategory === catKey ? 'active' : ''}`}
              onClick={() => setActiveCategory(catKey)}
            >
              {categories[catKey]}
            </button>
          ))}
        </div>

        <div className="converter-controls">
          <div className="converter-input-group">
            <label htmlFor="converter-input">Value</label>
            <input
              ref={inputRef}
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
              {categoryUnits.length > 0 ? (
                categoryUnits.map((unit) => (
                  <option key={`${unit.id}-from`} value={unit.id}>
                    {unit.symbol} - {unit.name}
                  </option>
                ))
              ) : (
                <option>No units</option>
              )}
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
              {categoryUnits.length > 0 ? (
                categoryUnits.map((unit) => (
                  <option key={`${unit.id}-to`} value={unit.id}>
                    {unit.symbol} - {unit.name}
                  </option>
                ))
              ) : (
                <option>No units</option>
              )}
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
