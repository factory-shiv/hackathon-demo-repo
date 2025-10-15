import React, { useState, useRef, useEffect } from 'react';
import { categories, getUnitsByCategory, searchUnits, convertUnit } from '../data/units';
import '../styles/UnitConverterPanel.css';

const UnitConverterPanel = ({ isOpen, onClose, onInsertValue }) => {
  const [activeCategory, setActiveCategory] = useState('length');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnitId, setFromUnitId] = useState('m');
  const [toUnitId, setToUnitId] = useState('ft');
  const [copyStatus, setCopyStatus] = useState('');
  const panelRef = useRef(null);
  const searchInputRef = useRef(null);

  // Update unit IDs when category changes
  useEffect(() => {
    const categoryUnits = getUnitsByCategory(activeCategory);
    if (categoryUnits.length >= 2) {
      setFromUnitId(categoryUnits[0].id);
      setToUnitId(categoryUnits[1].id);
    }
  }, [activeCategory]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle outside clicks and escape key
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

  const categoryUnits = searchQuery
    ? searchUnits(searchQuery)
    : getUnitsByCategory(activeCategory);

  const performConversion = () => {
    try {
      const numValue = parseFloat(inputValue);
      if (isNaN(numValue)) return 0;
      return convertUnit(numValue, fromUnitId, toUnitId);
    } catch {
      return 0;
    }
  };

  const convertedValue = performConversion();

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value.toString());
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const handleInsertValue = (value) => {
    onInsertValue(value);
    onClose();
  };

  const fromUnit = categoryUnits.find(u => u.id === fromUnitId);
  const toUnit = categoryUnits.find(u => u.id === toUnitId);

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
              onClick={() => {
                setActiveCategory(key);
                setSearchQuery('');
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="converter-search">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="converter-search-input"
          />
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
              {categoryUnits.map((unit) => (
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
              {categoryUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.symbol} - {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="converter-result">
          <div className="result-display">
            <span className="result-value">{inputValue}</span>
            <span className="result-unit">{fromUnit?.symbol}</span>
            <span className="result-equals">=</span>
            <span className="result-value">{convertedValue}</span>
            <span className="result-unit">{toUnit?.symbol}</span>
          </div>

          <div className="result-actions">
            <button
              className="result-btn copy-btn"
              onClick={() => handleCopy(convertedValue)}
              title="Copy to clipboard"
            >
              📋 {copyStatus || 'Copy'}
            </button>
            <button
              className="result-btn insert-btn"
              onClick={() => handleInsertValue(convertedValue)}
              title="Insert into calculator"
            >
              ➕ Insert
            </button>
          </div>
        </div>

        <div className="converter-list">
          <div className="converter-list-title">Quick conversions for {inputValue} {fromUnit?.symbol}:</div>
          {categoryUnits.filter(u => u.id !== fromUnitId).slice(0, 8).map((unit) => {
            if (!unit || !unit.id) return null;
            try {
              const numValue = parseFloat(inputValue) || 0;
              if (isNaN(numValue)) return null;
              const value = convertUnit(numValue, fromUnitId, unit.id);
              if (typeof value !== 'number' || isNaN(value)) return null;
              return (
                <div key={String(unit.id)} className="converter-list-item">
                  <div className="converter-list-left">
                    <div className="converter-list-result">{value.toFixed(4)}</div>
                    <div className="converter-list-unit">{String(unit.symbol)}</div>
                  </div>
                  <div className="converter-list-info">
                    <div className="converter-list-name">{String(unit.name)}</div>
                  </div>
                  <button
                    className="converter-list-copy"
                    onClick={() => handleCopy(value)}
                    title="Copy value"
                  >
                    📋
                  </button>
                </div>
              );
            } catch (e) {
              return null;
            }
          })}
        </div>

        <div className="converter-footer">
          <span>Convert between units instantly</span>
        </div>
      </div>
    </>
  );
};

export default UnitConverterPanel;
