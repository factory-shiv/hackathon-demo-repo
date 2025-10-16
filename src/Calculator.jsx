import React, { useState, useEffect, useRef } from 'react';
import './Calculator.css';
import './styles/ButtonEffects.css';
import './styles/MemoryButtons.css';
import soundManager from './utils/soundManager';
import { useNumberFormat } from './contexts/NumberFormatContext';
import { useMemory } from './contexts/MemoryContext';
import { useUnitConverter } from './contexts/UnitConverterContext';
import { exportToCSV, exportToJSON, exportToTXT, downloadFile, importFromFile } from './utils/historyExporter';
import ConstantsPanel from './components/ConstantsPanel';
import UnitConverterPanel from './components/UnitConverterPanel';

const Calculator = () => {
  // State variables
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [error, setError] = useState('');
  const [activeKey, setActiveKey] = useState(null); // for visual feedback
  const [copyStatus, setCopyStatus] = useState(''); // feedback for copy / paste
  const [animationClass, setAnimationClass] = useState(''); // for enhanced animations
  const [showExportMenu, setShowExportMenu] = useState(false); // export menu dropdown
  const [importStatus, setImportStatus] = useState(''); // import feedback
  const [showConstantsPanel, setShowConstantsPanel] = useState(false); // constants panel

  // Get number formatting context
  const { formattingEnabled, formatter } = useNumberFormat();

  // Get memory context
  const { memoryValue, hasMemory, memoryAdd, memorySubtract, memoryRecall, memoryClear } = useMemory();

  // Get unit converter context
  const { showConverter, setShowConverter } = useUnitConverter();

  /* ------------------------------------------------------------------
   * Number formatting helper
   * ------------------------------------------------------------------ */
  const formatDisplay = (raw) => {
    // Don't format if formatting is disabled
    if (!formattingEnabled) return raw;
    
    // Don't format error messages
    if (raw === 'Error') return raw;
    
    // Don't format if it ends with a decimal point (preserve typing state)
    if (raw.endsWith('.')) return raw;
    
    try {
      // Parse and format the number
      const number = parseFloat(raw);
      return formatter.format(number);
    } catch (e) {
      // If parsing fails, return the raw value
      return raw;
    }
  };

  /* ------------------------------------------------------------------
   * History tape (persistent)
   * ------------------------------------------------------------------ */
  const HISTORY_STORAGE_KEY = 'calculator_history';
  const HISTORY_LIMIT = 20;

  // Lazy-load history from localStorage
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  
  // Refs for animation timeouts and file input
  const animationTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Persist history whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      /* ignore quota / private-mode failures */
    }
  }, [history]);

  // Add a new entry to the history tape
  const addHistoryEntry = (expression, result) => {
    const entry = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      expression,
      result,
      timestamp: Date.now(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, HISTORY_LIMIT));
  };

  // Reuse a result from history
  const reuseFromHistory = (item) => {
    setDisplayValue(String(item.result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setError('');
    playButtonSound('function');
    addVisualFeedback('success-animation');
  };

  // Clear entire history
  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  /* ------------------------------------------------------------------
   * Sound and visual feedback helpers
   * ------------------------------------------------------------------ */
  // Play appropriate sound based on button type
  const playButtonSound = (type) => {
    soundManager.playSound(type);
  };

  // Add temporary animation class
  const addVisualFeedback = (animationType, duration = 500) => {
    setAnimationClass(animationType);
    
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Remove the class after duration
    animationTimeoutRef.current = setTimeout(() => {
      setAnimationClass('');
    }, duration);
  };

  /* ------------------------------------------------------------------
   * Helper to decide if a button should look active
   * ------------------------------------------------------------------ */
  const getActiveClass = (key) => (activeKey === key ? ' active' : '');

  // Handle number input
  const handleNumber = (number) => {
    setError('');
    playButtonSound('number');
    
    if (waitingForOperand) {
      setDisplayValue(String(number));
      setWaitingForOperand(false);
    } else {
      // Replace display if it's just '0', otherwise append
      setDisplayValue(displayValue === '0' ? String(number) : displayValue + number);
    }
  };

  // Handle backspace/delete (⌫)
  const handleBackspace = () => {
    setError('');
    playButtonSound('backspace');

    // If an error is on screen just clear everything
    if (displayValue === 'Error') {
      setDisplayValue('0');
      return;
    }

    // If waiting for operand, do nothing
    if (waitingForOperand) return;

    // If only one character or "-x" (single negative digit), reset to 0
    if (displayValue.length <= 1 || (displayValue.length === 2 && displayValue.startsWith('-'))) {
      setDisplayValue('0');
      return;
    }

    // Remove last char
    let newValue = displayValue.slice(0, -1);

    // Handle trailing decimal point
    if (newValue.endsWith('.')) {
      newValue = newValue.slice(0, -1);
    }

    // If we removed everything, show 0
    if (newValue === '' || newValue === '-') {
      newValue = '0';
    }

    setDisplayValue(newValue);
  };

  // Handle decimal point
  const handleDecimal = () => {
    setError('');
    playButtonSound('number');
    
    // If waiting for operand, start a new decimal number
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }
    
    // Don't add another decimal if one already exists
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  // Handle operators (+, -, *, /)
  const handleOperator = (nextOperation) => {
    setError('');
    playButtonSound('operator');
    
    const inputValue = parseFloat(displayValue);
    
    // If there's a previous operation waiting, perform it
    if (operation && waitingForOperand) {
      setOperation(nextOperation);
      return;
    }
    
    // If this is the first value
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      // Calculate the result of the previous operation
      const result = calculate(previousValue, inputValue, operation);
      
      // Check for errors (like division by zero)
      if (result === 'Error') {
        setError('Cannot divide by zero');
        setDisplayValue('Error');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        playButtonSound('error');
        addVisualFeedback('error-animation');
        return;
      }
      
      setDisplayValue(String(result));
      setPreviousValue(result);
    }
    
    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  // Handle equals button
  const handleEquals = () => {
    // If there's no operation, nothing to calculate
    if (operation === null) {
      playButtonSound('equals');
      return;
    }
    
    const inputValue = parseFloat(displayValue);
    
    // Don't calculate if waiting for an operand (prevents double equals)
    if (waitingForOperand && previousValue !== null) {
      playButtonSound('equals');
      return;
    }
    
    const result = calculate(previousValue, inputValue, operation);
    
    // Handle division by zero
    if (result === 'Error') {
      setError('Cannot divide by zero');
      setDisplayValue('Error');
      playButtonSound('error');
      addVisualFeedback('error-animation');
    } else {
      setDisplayValue(String(result));
      setError('');
      playButtonSound('equals');
      addVisualFeedback('success-animation');
      addHistoryEntry(`${previousValue} ${operation} ${inputValue}`, result);
    }
    
    // Reset for a new calculation
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  // Handle clear button
  const handleClear = () => {
    playButtonSound('clear');
    setDisplayValue('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setError('');
  };

  // Handle square root operation
  const handleSquareRoot = () => {
    setError('');
    playButtonSound('function');
    
    const value = parseFloat(displayValue);
    const result = Math.sqrt(value);
    
    if (isNaN(result)) {
      setError('Invalid input for square root');
      playButtonSound('error');
      addVisualFeedback('error-animation');
    } else {
      setDisplayValue(String(result));
      addVisualFeedback('success-animation');
      addHistoryEntry(`√(${value})`, result);
    }
    
    setWaitingForOperand(true);
  };

  // Handle square operation
  const handleSquare = () => {
    setError('');
    playButtonSound('function');
    
    const value = parseFloat(displayValue);
    const result = value * value;
    setDisplayValue(String(result));
    addVisualFeedback('success-animation');
    addHistoryEntry(`${value}²`, result);
    setWaitingForOperand(true);
  };

  // Handle reciprocal operation
  const handleReciprocal = () => {
    setError('');
    playButtonSound('function');
    
    const value = parseFloat(displayValue);
    
    if (value === 0) {
      setError('Cannot divide by zero');
      setDisplayValue('Error');
      playButtonSound('error');
      addVisualFeedback('error-animation');
    } else {
      const result = 1 / value;
      setDisplayValue(String(result));
      addVisualFeedback('success-animation');
      addHistoryEntry(`1/(${value})`, result);
    }
    
    setWaitingForOperand(true);
  };

  /* ------------------------------------------------------------------
   * Memory operations
   * ------------------------------------------------------------------ */
  const handleMemoryAdd = () => {
    setError('');
    playButtonSound('function');
    
    const value = parseFloat(displayValue);
    if (!isNaN(value)) {
      memoryAdd(value);
      addVisualFeedback('success-animation');
    }
  };

  const handleMemorySubtract = () => {
    setError('');
    playButtonSound('function');
    
    const value = parseFloat(displayValue);
    if (!isNaN(value)) {
      memorySubtract(value);
      addVisualFeedback('success-animation');
    }
  };

  const handleMemoryRecall = () => {
    setError('');
    playButtonSound('function');
    
    const value = memoryRecall();
    if (value !== null) {
      setDisplayValue(String(value));
      setWaitingForOperand(false);
      addVisualFeedback('success-animation');
    }
  };

  const handleMemoryClear = () => {
    setError('');
    playButtonSound('function');
    
    memoryClear();
    addVisualFeedback('success-animation');
  };

  /* ------------------------------------------------------------------
   * Keyboard support
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const keyDownHandler = (e) => {
      // ------------------------------------------------------------------
      // Ignore global shortcuts while typing in inputs, textareas, or any
      // element with contenteditable to prevent conflicts with components
      // like the Command Palette search box.
      // ------------------------------------------------------------------
      const tag = (e.target && e.target.tagName)
        ? e.target.tagName.toUpperCase()
        : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) {
        return;
      }

      const { key } = e;

      // Handle copy (Ctrl/Cmd + C)
      if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
        return;
      }

      // Handle paste (Ctrl/Cmd + V)
      if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePaste();
        return;
      }

      // Handle unit converter (Ctrl/Cmd + Alt + U)
      if ((e.ctrlKey || e.metaKey) && e.altKey && key.toLowerCase() === 'u') {
        e.preventDefault();
        setShowConverter(!showConverter);
        return;
      }

      // Map keys to actions
      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        handleNumber(Number(key));
        setActiveKey(key);
        return;
      }

      const lowered = key.toLowerCase();
      switch (lowered) {
        case '+':
          e.preventDefault();
          handleOperator('+');
          break;
        case '-':
          e.preventDefault();
          handleOperator('-');
          break;
        case '*':
        case 'x':
          e.preventDefault();
          handleOperator('*');
          break;
        case '/':
          e.preventDefault();
          handleOperator('/');
          break;
        case 'enter':
        case '=':
          e.preventDefault();
          handleEquals();
          break;
        case '.':
          e.preventDefault();
          handleDecimal();
          break;
        case 'escape':
        case 'c':
          e.preventDefault();
          handleClear();
          break;
        case 'backspace':
          e.preventDefault();
          handleBackspace();
          break;
        case '%':
          e.preventDefault();
          // mimic % button
          playButtonSound('function');
          const v = parseFloat(displayValue);
          setDisplayValue(String(v / 100));
          addHistoryEntry(`${v}%`, v / 100);
          break;
        case 'r':
          e.preventDefault();
          handleSquareRoot();
          break;
        case 's':
          e.preventDefault();
          handleSquare();
          break;
        case 'i':
          e.preventDefault();
          handleReciprocal();
          break;
        default:
          break;
      }

      // Memory shortcuts (Shift + key)
      if (e.shiftKey) {
        switch (lowered) {
          case 'm':
            e.preventDefault();
            handleMemoryAdd();
            setActiveKey('m+');
            break;
          case 'n':
            e.preventDefault();
            handleMemorySubtract();
            setActiveKey('m-');
            break;
          case 'r':
            if (!e.ctrlKey && !e.metaKey) {
              e.preventDefault();
              handleMemoryRecall();
              setActiveKey('mr');
            }
            break;
          case 'c':
            if (!e.ctrlKey && !e.metaKey) {
              e.preventDefault();
              handleMemoryClear();
              setActiveKey('mc');
            }
            break;
          default:
            return;
        }
      } else if (!['escape', 'c', 'backspace', '%', 'r', 's', 'i'].includes(lowered)) {
        return; // unmapped key
      }

      // Set active key for visual feedback
      setActiveKey(lowered);
    };

    const keyUpHandler = () => setActiveKey(null);

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  });

  /* ------------------------------------------------------------------
   * Copy / Paste helpers
   * ------------------------------------------------------------------ */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayValue);
      setCopyStatus('Copied!');
      playButtonSound('function');
      addVisualFeedback('success-animation');
    } catch (err) {
      setCopyStatus('Copy failed');
      playButtonSound('error');
      addVisualFeedback('error-animation');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text.trim();
      if (trimmed === '') {
        setCopyStatus('Nothing to paste');
        playButtonSound('error');
        return;
      }
      // Validate numeric
      const value = Number(trimmed);
      if (Number.isNaN(value)) {
        setCopyStatus('Invalid number');
        playButtonSound('error');
        addVisualFeedback('error-animation');
        return;
      }
      setDisplayValue(trimmed);
      setWaitingForOperand(false);
      setCopyStatus('Pasted!');
      playButtonSound('function');
      addVisualFeedback('success-animation');
    } catch (err) {
      setCopyStatus('Paste failed');
      playButtonSound('error');
      addVisualFeedback('error-animation');
    }
  };

  // Clear copyStatus after a short delay
  useEffect(() => {
    if (!copyStatus) return;
    const t = setTimeout(() => setCopyStatus(''), 1500);
    return () => clearTimeout(t);
  }, [copyStatus]);

  // Clear importStatus after a short delay
  useEffect(() => {
    if (!importStatus) return;
    const t = setTimeout(() => setImportStatus(''), 3000);
    return () => clearTimeout(t);
  }, [importStatus]);

  // Handle constant insertion from command palette
  useEffect(() => {
    const handleInsertConstant = (e) => {
      handleSelectConstant(e.detail.value);
    };

    window.addEventListener('insertConstant', handleInsertConstant);
    return () => window.removeEventListener('insertConstant', handleInsertConstant);
  }, []);

  /* ------------------------------------------------------------------
   * Constants panel operations
   * ------------------------------------------------------------------ */
  const handleSelectConstant = (value) => {
    setDisplayValue(String(value));
    setWaitingForOperand(false);
    playButtonSound('function');
    addVisualFeedback('success-animation');
  };

  /* ------------------------------------------------------------------
   * Unit converter operations
   * ------------------------------------------------------------------ */
  const handleInsertUnitValue = (value) => {
    setDisplayValue(String(value));
    setWaitingForOperand(false);
    playButtonSound('function');
    addVisualFeedback('success-animation');
  };

  /* ------------------------------------------------------------------
   * History export/import operations
   * ------------------------------------------------------------------ */
  const handleExportCSV = () => {
    const csv = exportToCSV(history);
    if (csv) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      downloadFile(csv, `calculator-history-${timestamp}.csv`, 'text/csv');
      playButtonSound('function');
      addVisualFeedback('success-animation');
    }
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    const json = exportToJSON(history);
    if (json) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      downloadFile(json, `calculator-history-${timestamp}.json`, 'application/json');
      playButtonSound('function');
      addVisualFeedback('success-animation');
    }
    setShowExportMenu(false);
  };

  const handleExportTXT = () => {
    const txt = exportToTXT(history);
    if (txt) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      downloadFile(txt, `calculator-history-${timestamp}.txt`, 'text/plain');
      playButtonSound('function');
      addVisualFeedback('success-animation');
    }
    setShowExportMenu(false);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setShowExportMenu(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const importedHistory = await importFromFile(file);
      
      if (importedHistory && importedHistory.length > 0) {
        // Merge with existing history, keeping unique entries
        const existingIds = new Set(history.map(h => h.id));
        const newEntries = importedHistory.filter(h => !existingIds.has(h.id));
        const mergedHistory = [...newEntries, ...history].slice(0, 20);
        
        setHistory(mergedHistory);
        setImportStatus(`Imported ${importedHistory.length} entries`);
        playButtonSound('function');
        addVisualFeedback('success-animation');
      }
    } catch (error) {
      setImportStatus(`Import failed: ${error.message}`);
      playButtonSound('error');
      addVisualFeedback('error-animation');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Calculate function to perform the actual math
  const calculate = (firstValue, secondValue, op) => {
    switch (op) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        // Handle division by zero
        return secondValue === 0 ? 'Error' : firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  // Format a number for the operation display
  const formatOperationValue = (value) => {
    if (value === null || value === undefined) return '';
    if (!formattingEnabled) return value;
    
    try {
      return formatter.format(value);
    } catch (e) {
      return value;
    }
  };

  // Get the current operation display
  const getOperationDisplay = () => {
    if (!operation) return '';
    return `${formatOperationValue(previousValue)} ${operation}`;
  };

  // Format a history result for display
  const formatHistoryResult = (result) => {
    if (!formattingEnabled) return result;
    if (result === 'Error') return result;
    
    try {
      const num = parseFloat(result);
      if (isFinite(num)) {
        return formatter.format(num);
      }
    } catch (e) {}
    
    return result;
  };

  return (
    <>
      <div className={`calculator ${animationClass}`}>
        <div className="calculator-controls">
          <button
            className="constants-btn"
            onClick={() => setShowConstantsPanel(true)}
            title="Open constants library"
            aria-label="Open constants library"
          >
            π
          </button>
        </div>
        
        <div className="calculator-display">
        <div className="operation-display">{getOperationDisplay()}</div>
        <div 
          className="value-display" 
          data-raw={displayValue}
          data-formatted={formatDisplay(displayValue)}
        >
          {formatDisplay(displayValue)}
          <button
            className="copy-btn"
            title="Copy"
            aria-label="Copy value"
            onClick={handleCopy}
          >
            📋
          </button>
        </div>
        {copyStatus && <div className="copy-status">{copyStatus}</div>}
        {error && <div className="error-display">{error}</div>}
      </div>
      
      <div className="calculator-keypad">
        <div className="input-keys">
          <div className="memory-keys">
            <button 
              className={'calculator-key key-memory key-mc' + getActiveClass('mc')} 
              onClick={handleMemoryClear}
              disabled={!hasMemory}
              title="Memory Clear (Shift+C)"
            >
              MC
            </button>
            <button 
              className={'calculator-key key-memory key-mr' + getActiveClass('mr')} 
              onClick={handleMemoryRecall}
              disabled={!hasMemory}
              title="Memory Recall (Shift+R)"
            >
              MR
            </button>
            <button 
              className={'calculator-key key-memory key-m-minus' + getActiveClass('m-')} 
              onClick={handleMemorySubtract}
              title="Memory Subtract (Shift+N)"
            >
              M−
            </button>
            <button 
              className={'calculator-key key-memory key-m-plus' + getActiveClass('m+')} 
              onClick={handleMemoryAdd}
              title="Memory Add (Shift+M)"
            >
              M+
            </button>
          </div>
          
          <div className="function-keys">
            <button 
              className={'calculator-key key-clear' + getActiveClass('escape')} 
              onClick={handleClear}
            >
              AC
            </button>
            <button 
              className="calculator-key key-sign" 
              onClick={() => {
                playButtonSound('function');
                setDisplayValue(displayValue.charAt(0) === '-' ? displayValue.substr(1) : '-' + displayValue);
              }}
            >
              ±
            </button>
            <button 
              className={'calculator-key key-percent' + getActiveClass('%')} 
              onClick={() => {
                playButtonSound('function');
                const value = parseFloat(displayValue);
                setDisplayValue(String(value / 100));
                addHistoryEntry(`${value}%`, value / 100);
              }}
            >
              %
            </button>
          </div>
          
          <div className="advanced-keys">
            <button 
              className={'calculator-key key-sqrt' + getActiveClass('r')} 
              onClick={handleSquareRoot}
            >
              √
            </button>
            <button 
              className={'calculator-key key-square' + getActiveClass('s')} 
              onClick={handleSquare}
            >
              x²
            </button>
            <button 
              className={'calculator-key key-reciprocal' + getActiveClass('i')} 
              onClick={handleReciprocal}
            >
              1/x
            </button>
          </div>
          
          <div className="digit-keys">
            <button className={'calculator-key key-0' + getActiveClass('0')} onClick={() => handleNumber(0)}>0</button>
            <button className={'calculator-key key-dot' + getActiveClass('.')} onClick={handleDecimal}>.</button>
            <button className={'calculator-key key-1' + getActiveClass('1')} onClick={() => handleNumber(1)}>1</button>
            <button className={'calculator-key key-2' + getActiveClass('2')} onClick={() => handleNumber(2)}>2</button>
            <button className={'calculator-key key-3' + getActiveClass('3')} onClick={() => handleNumber(3)}>3</button>
            <button className={'calculator-key key-4' + getActiveClass('4')} onClick={() => handleNumber(4)}>4</button>
            <button className={'calculator-key key-5' + getActiveClass('5')} onClick={() => handleNumber(5)}>5</button>
            <button className={'calculator-key key-6' + getActiveClass('6')} onClick={() => handleNumber(6)}>6</button>
            <button className={'calculator-key key-7' + getActiveClass('7')} onClick={() => handleNumber(7)}>7</button>
            <button className={'calculator-key key-8' + getActiveClass('8')} onClick={() => handleNumber(8)}>8</button>
            <button className={'calculator-key key-9' + getActiveClass('9')} onClick={() => handleNumber(9)}>9</button>
          </div>
        </div>
        
        <div className="operator-keys">
          <button className={'calculator-key key-divide' + getActiveClass('/')} onClick={() => handleOperator('/')}>÷</button>
          <button className={'calculator-key key-multiply' + getActiveClass('*')} onClick={() => handleOperator('*')}>×</button>
          <button className={'calculator-key key-subtract' + getActiveClass('-')} onClick={() => handleOperator('-')}>−</button>
          <button className={'calculator-key key-add' + getActiveClass('+')} onClick={() => handleOperator('+')}>+</button>
          <button className={'calculator-key key-equals' + getActiveClass('enter')} onClick={handleEquals}>=</button>
        </div>
      </div>

      <section className="history-panel" aria-label="Calculation history">
        <div className="history-header">
          <h3>History</h3>
          <div className="history-actions">
            <button 
              className="history-clear" 
              onClick={clearHistory} 
              aria-label="Clear history"
              disabled={history.length === 0}
            >
              Clear
            </button>
            <div className="history-export-menu">
              <button 
                className="history-export-btn" 
                onClick={() => setShowExportMenu(!showExportMenu)}
                aria-label="Export history menu"
                disabled={history.length === 0}
              >
                ⋮
              </button>
              {showExportMenu && (
                <div className="export-dropdown">
                  <button onClick={handleExportCSV}>Export as CSV</button>
                  <button onClick={handleExportJSON}>Export as JSON</button>
                  <button onClick={handleExportTXT}>Export as TXT</button>
                  <button onClick={handleImportClick}>Import History</button>
                </div>
              )}
            </div>
          </div>
        </div>
        {importStatus && <div className="import-status">{importStatus}</div>}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.csv,.txt"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
        {history.length === 0 ? (
          <div className="history-empty">No history yet</div>
        ) : (
          <ul className="history-list">
            {history.map((item) => (
              <li
                key={item.id}
                className="history-item"
                role="button"
                tabIndex={0}
                onClick={() => reuseFromHistory(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reuseFromHistory(item); }
                }}
              >
                <div className="history-row">
                  <div className="history-expression">{item.expression} =</div>
                  <div className="history-result">{formatHistoryResult(item.result)}</div>
                </div>
                <div className="history-meta">{new Date(item.timestamp).toLocaleTimeString()}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
      </div>
      
      <ConstantsPanel
        isOpen={showConstantsPanel}
        onClose={() => setShowConstantsPanel(false)}
        onSelectConstant={handleSelectConstant}
      />

      <UnitConverterPanel
        isOpen={showConverter}
        onClose={() => setShowConverter(false)}
        onInsertValue={handleInsertUnitValue}
      />
    </>
  );
};

export default Calculator;
