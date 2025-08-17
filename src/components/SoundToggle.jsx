import React, { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';
import '../styles/SoundToggle.css';

/**
 * SoundToggle Component
 * 
 * Provides a toggle button for enabling/disabling calculator sound effects
 * Plays a test sound when enabled to give immediate feedback
 */
const SoundToggle = () => {
  // Get initial state from sound manager
  const [soundEnabled, setSoundEnabled] = useState(
    soundManager.getSettings().enabled
  );
  
  // Track if audio is supported in this browser
  const [isSupported, setIsSupported] = useState(true);
  
  // Check audio support on mount
  useEffect(() => {
    setIsSupported(soundManager.isSupported());
  }, []);

  // Handle toggle action
  const handleToggle = () => {
    const newState = soundManager.toggleSounds();
    setSoundEnabled(newState);
    
    // Play a test sound if we just enabled sounds
    if (newState) {
      soundManager.playSound('function');
    }
  };

  // If audio is not supported, don't render the toggle
  if (!isSupported) {
    return null;
  }

  return (
    <label className="sound-toggle" title={soundEnabled ? 'Disable sounds' : 'Enable sounds'}>
      <input
        type="checkbox"
        className="sound-toggle-input"
        role="switch"
        aria-checked={soundEnabled}
        aria-label={soundEnabled ? 'Disable calculator sounds' : 'Enable calculator sounds'}
        checked={soundEnabled}
        onChange={handleToggle}
      />
      <div className="sound-toggle-track">
        <div className="sound-toggle-thumb">
          {soundEnabled ? (
            <svg
              className="sound-on-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
              />
            </svg>
          ) : (
            <svg
              className="sound-off-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
              />
            </svg>
          )}
        </div>
      </div>
    </label>
  );
};

export default SoundToggle;
