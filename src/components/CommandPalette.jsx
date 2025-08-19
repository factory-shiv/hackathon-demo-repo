import React, { useState, useEffect, useMemo, useRef } from 'react';
import Fuse from 'fuse.js';
import { useTheme } from '../contexts/ThemeContext';
import soundManager from '../utils/soundManager';
import '../styles/CommandPalette.css';

const CommandPalette = () => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [runFeedback, setRunFeedback] = useState('');

  // Refs
  const inputRef = useRef(null);
  const lastFocusedElement = useRef(null);
  const paletteRef = useRef(null);

  // Theme context
  const { isDarkMode, toggleTheme } = useTheme();

  // Define available actions
  const actions = useMemo(() => [
    {
      id: 'toggle-theme',
      title: `Switch to ${isDarkMode ? 'Light' : 'Dark'} Theme`,
      subtitle: 'Change the appearance of the calculator',
      keywords: ['theme', 'dark', 'light', 'mode', 'appearance', 'color'],
      shortcut: '⌘D',
      run: () => {
        toggleTheme();
        return 'Theme toggled';
      }
    },
    {
      id: 'toggle-sounds',
      title: `Turn Sounds ${soundManager.getSettings().enabled ? 'Off' : 'On'}`,
      subtitle: 'Enable or disable calculator sound effects',
      keywords: ['sound', 'audio', 'mute', 'volume', 'effects'],
      shortcut: '⌘S',
      run: () => {
        const newState = soundManager.toggleSounds();
        return `Sounds turned ${newState ? 'on' : 'off'}`;
      }
    },
    {
      id: 'clear',
      title: 'Clear Calculator (AC)',
      subtitle: 'Reset the calculator to start fresh',
      keywords: ['clear', 'reset', 'ac', 'all clear', 'start over'],
      shortcut: 'Esc',
      run: () => {
        const clearButton = document.querySelector('.key-clear');
        if (clearButton) clearButton.click();
        return 'Calculator cleared';
      }
    },
    {
      id: 'copy-value',
      title: 'Copy Display Value',
      subtitle: 'Copy the current calculator display to clipboard',
      keywords: ['copy', 'clipboard', 'value', 'display', 'result'],
      shortcut: '⌘C',
      run: async () => {
        const displayElement = document.querySelector('.value-display');
        if (!displayElement) return 'No value to copy';
        
        const value = displayElement.textContent.trim();
        try {
          await navigator.clipboard.writeText(value);
          return 'Value copied to clipboard';
        } catch (err) {
          return 'Failed to copy value';
        }
      }
    },
    {
      id: 'square-root',
      title: 'Square Root (√)',
      subtitle: 'Calculate the square root of the current value',
      keywords: ['sqrt', 'square root', 'root', 'radical', 'math'],
      shortcut: 'R',
      run: () => {
        const button = document.querySelector('.key-sqrt');
        if (button) button.click();
        return 'Square root calculated';
      }
    },
    {
      id: 'square',
      title: 'Square (x²)',
      subtitle: 'Calculate the square of the current value',
      keywords: ['square', 'x2', 'power', 'squared', 'math'],
      shortcut: 'S',
      run: () => {
        const button = document.querySelector('.key-square');
        if (button) button.click();
        return 'Value squared';
      }
    },
    {
      id: 'reciprocal',
      title: 'Reciprocal (1/x)',
      subtitle: 'Calculate the reciprocal of the current value',
      keywords: ['reciprocal', 'inverse', '1/x', 'fraction', 'math'],
      shortcut: 'I',
      run: () => {
        const button = document.querySelector('.key-reciprocal');
        if (button) button.click();
        return 'Reciprocal calculated';
      }
    },
    {
      id: 'percentage',
      title: 'Percentage (%)',
      subtitle: 'Convert the current value to a percentage',
      keywords: ['percent', 'percentage', '%', 'math'],
      shortcut: '%',
      run: () => {
        const button = document.querySelector('.key-percent');
        if (button) button.click();
        return 'Converted to percentage';
      }
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Show Keyboard Shortcuts',
      subtitle: 'Display a list of available keyboard shortcuts',
      keywords: ['keyboard', 'shortcuts', 'keys', 'help', 'commands'],
      shortcut: '?',
      run: () => {
        setRunFeedback(`
          Calculator: 0-9 (numbers), +/-/*/÷ (operators), = or Enter (equals), 
          Esc (clear), Backspace (delete), . (decimal), % (percent), 
          R (square root), S (square), I (reciprocal)
        `);
        return null; // Don't close palette, keep feedback visible
      }
    }
  ], [isDarkMode, toggleTheme]);

  // Initialize Fuse for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(actions, {
      keys: ['title', 'keywords'],
      includeScore: true,
      threshold: 0.4
    });
  }, [actions]);

  // Filter actions based on search query
  const filteredActions = useMemo(() => {
    if (!query.trim()) return actions;
    return fuse.search(query).map(result => result.item);
  }, [fuse, query, actions]);

  // Handle keyboard shortcuts to open palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Open palette with Cmd/Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle keyboard navigation within palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prevIndex => 
            prevIndex < filteredActions.length - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prevIndex => 
            prevIndex > 0 ? prevIndex - 1 : prevIndex
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredActions[selectedIndex]) {
            executeAction(filteredActions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          closePalette();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, selectedIndex, filteredActions]);

  // Handle outside clicks to close palette
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target)) {
        closePalette();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Reset selected index when filtered actions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredActions]);

  // Clear feedback after a delay
  useEffect(() => {
    if (!runFeedback) return;
    
    const timer = setTimeout(() => {
      setRunFeedback('');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [runFeedback]);

  // Open the palette
  const openPalette = () => {
    lastFocusedElement.current = document.activeElement;
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
    setRunFeedback('');
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 10);
  };

  // Close the palette
  const closePalette = () => {
    setIsOpen(false);
    
    // Restore background scrolling
    document.body.style.overflow = '';
    
    // Restore focus
    if (lastFocusedElement.current) {
      lastFocusedElement.current.focus();
    }
  };

  // Execute the selected action
  const executeAction = async (action) => {
    if (!action || !action.run) return;
    
    try {
      const feedback = await action.run();
      
      // If feedback is null, keep palette open (for showing keyboard shortcuts)
      if (feedback === null) return;
      
      setRunFeedback(feedback || `Executed: ${action.title}`);
      closePalette();
    } catch (error) {
      setRunFeedback(`Error: ${error.message || 'Failed to execute command'}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" aria-hidden="true">
      <div 
        ref={paletteRef}
        className="command-palette" 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="command-palette-title"
      >
        <div className="command-palette-header">
          <h2 id="command-palette-title" className="command-palette-title">
            Command Palette
          </h2>
          <button 
            className="command-palette-close" 
            onClick={closePalette}
            aria-label="Close command palette"
          >
            ×
          </button>
        </div>
        
        <div className="command-palette-search">
          <input
            ref={inputRef}
            type="text"
            className="command-palette-input"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-autocomplete="list"
            aria-controls="command-palette-results"
            aria-expanded="true"
          />
          {runFeedback && (
            <div className="command-palette-feedback">
              {runFeedback}
            </div>
          )}
        </div>
        
        {filteredActions.length > 0 ? (
          <ul 
            id="command-palette-results"
            className="command-palette-results"
            role="listbox"
            aria-label="Available commands"
          >
            {filteredActions.map((action, index) => (
              <li
                key={action.id}
                className={`command-palette-item ${index === selectedIndex ? 'selected' : ''}`}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => executeAction(action)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="command-palette-item-content">
                  <div className="command-palette-item-title">
                    {action.title}
                  </div>
                  <div className="command-palette-item-subtitle">
                    {action.subtitle}
                  </div>
                </div>
                {action.shortcut && (
                  <div className="command-palette-item-shortcut">
                    {action.shortcut}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="command-palette-no-results">
            No commands found for "{query}"
          </div>
        )}
        
        <div className="command-palette-footer">
          <span>↑↓ to navigate • Enter to run • Esc to close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
