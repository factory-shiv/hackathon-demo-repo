import React from 'react';
import { useNumberFormat } from '../contexts/NumberFormatContext';
import '../styles/NumberFormatToggle.css';

const NumberFormatToggle = () => {
  const { formattingEnabled, toggleFormatting } = useNumberFormat();

  return (
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
  );
};

export default NumberFormatToggle;
