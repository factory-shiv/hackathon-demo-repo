/**
 * Sound Manager for Calculator App
 * 
 * Provides audio feedback for calculator interactions using Web Audio API.
 * Includes different sound profiles for various button types and operations.
 */

// Check if Web Audio API is supported
const audioSupported = typeof window !== 'undefined' && 
                      (window.AudioContext || window.webkitAudioContext);

// Sound configuration constants
const SOUND_CONFIG = {
  number: { frequency: 440, duration: 50 },   // Standard A4 note, short
  operator: { frequency: 600, duration: 80 },  // Higher pitch, slightly longer
  function: { frequency: 800, duration: 60 },  // Even higher for function keys
  equals: { frequency: 1000, duration: 120 },  // Highest pitch for equals/result
  clear: { frequency: 300, duration: 100 },    // Lower tone for clearing
  error: { frequency: 200, duration: 200 },    // Low tone, longer for errors
  backspace: { frequency: 350, duration: 60 }  // Unique tone for backspace
};

// Default settings
const DEFAULT_SETTINGS = {
  enabled: true,
  volume: 0.5  // 50% volume by default
};

// LocalStorage key
const STORAGE_KEY = 'calculator_sound_settings';

/**
 * SoundManager class to handle all audio functionality
 */
class SoundManager {
  constructor() {
    this.settings = this._loadSettings();
    this.audioContext = null;
    
    // Initialize audio context if supported
    if (audioSupported) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
      } catch (error) {
        console.warn('Failed to initialize Web Audio API:', error);
      }
    }
  }

  /**
   * Load user settings from localStorage
   * @returns {Object} Sound settings
   */
  _loadSettings() {
    if (typeof localStorage === 'undefined') {
      return { ...DEFAULT_SETTINGS };
    }

    try {
      const storedSettings = localStorage.getItem(STORAGE_KEY);
      return storedSettings 
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) }
        : { ...DEFAULT_SETTINGS };
    } catch (error) {
      console.warn('Failed to load sound settings:', error);
      return { ...DEFAULT_SETTINGS };
    }
  }

  /**
   * Save current settings to localStorage
   */
  _saveSettings() {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
      } catch (error) {
        console.warn('Failed to save sound settings:', error);
      }
    }
  }

  /**
   * Generate and play a tone with the given parameters
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in ms
   * @returns {Promise} Resolves when sound finishes playing
   */
  _playTone(frequency, duration) {
    if (!this.audioContext || !this.settings.enabled) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      try {
        // Resume audio context if it's suspended (browser autoplay policy)
        const resumePromise = this.audioContext.state === 'suspended' 
          ? this.audioContext.resume() 
          : Promise.resolve();

        resumePromise.then(() => {
          // Create oscillator and gain node
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();

          // Configure oscillator
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;

          // Configure gain (volume)
          gainNode.gain.value = this.settings.volume;

          // Quick fade out to avoid clicks
          gainNode.gain.exponentialRampToValueAtTime(
            0.001, 
            this.audioContext.currentTime + (duration / 1000)
          );

          // Connect nodes and start oscillator
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          oscillator.start();
          oscillator.stop(this.audioContext.currentTime + (duration / 1000));

          // Resolve promise when sound finishes
          setTimeout(resolve, duration);
        });
      } catch (error) {
        console.warn('Error playing sound:', error);
        resolve();
      }
    });
  }

  /**
   * Play a sound for a specific button type
   * @param {string} type - Button type ('number', 'operator', etc.)
   * @returns {Promise} Resolves when sound finishes playing
   */
  playSound(type) {
    if (!SOUND_CONFIG[type]) {
      console.warn(`Unknown sound type: ${type}`);
      return Promise.resolve();
    }

    const { frequency, duration } = SOUND_CONFIG[type];
    return this._playTone(frequency, duration);
  }

  /**
   * Enable sounds
   */
  enableSounds() {
    this.settings.enabled = true;
    this._saveSettings();
  }

  /**
   * Disable sounds
   */
  disableSounds() {
    this.settings.enabled = false;
    this._saveSettings();
  }

  /**
   * Toggle sound on/off
   * @returns {boolean} New enabled state
   */
  toggleSounds() {
    this.settings.enabled = !this.settings.enabled;
    this._saveSettings();
    return this.settings.enabled;
  }

  /**
   * Set volume level
   * @param {number} level - Volume level (0.0 to 1.0)
   */
  setVolume(level) {
    // Ensure volume is between 0 and 1
    this.settings.volume = Math.max(0, Math.min(1, level));
    this._saveSettings();
  }

  /**
   * Get current sound settings
   * @returns {Object} Current settings
   */
  getSettings() {
    return { ...this.settings };
  }

  /**
   * Check if audio is supported in this browser
   * @returns {boolean} Whether audio is supported
   */
  isSupported() {
    return !!this.audioContext;
  }
}

// Create and export a singleton instance
const soundManager = new SoundManager();
export default soundManager;
