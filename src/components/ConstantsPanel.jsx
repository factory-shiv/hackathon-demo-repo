import React, { useState, useRef, useEffect } from 'react';
import { constants, categories, searchConstants } from '../data/constants';
import '../styles/ConstantsPanel.css';

const ConstantsPanel = ({ isOpen, onClose, onSelectConstant }) => {
  const [activeCategory, setActiveCategory] = useState('mathematical');
  const [searchQuery, setSearchQuery] = useState('');
  const panelRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
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

  const filteredConstants = searchQuery
    ? searchConstants(searchQuery)
    : constants.filter(c => c.category === activeCategory);

  const handleSelectConstant = (constant) => {
    onSelectConstant(constant.value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="constants-overlay" />
      <div 
        ref={panelRef}
        className="constants-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="constants-panel-title"
      >
        <div className="constants-header">
          <h2 id="constants-panel-title">Constants</h2>
          <button
            className="constants-close"
            onClick={onClose}
            aria-label="Close constants panel"
          >
            ×
          </button>
        </div>

        <div className="constants-search">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search constants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="constants-search-input"
          />
        </div>

        {!searchQuery && (
          <div className="constants-tabs">
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                className={`constants-tab ${activeCategory === key ? 'active' : ''}`}
                onClick={() => setActiveCategory(key)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="constants-list">
          {filteredConstants.length === 0 ? (
            <div className="constants-empty">No constants found</div>
          ) : (
            filteredConstants.map((constant) => (
              <button
                key={constant.id}
                className="constant-item"
                onClick={() => handleSelectConstant(constant)}
                title={constant.precision}
              >
                <div className="constant-symbol">{constant.symbol}</div>
                <div className="constant-info">
                  <div className="constant-name">{constant.name}</div>
                  <div className="constant-description">{constant.description}</div>
                  <div className="constant-value">{constant.precision}</div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="constants-footer">
          <span>Click a constant to insert its value</span>
        </div>
      </div>
    </>
  );
};

export default ConstantsPanel;
