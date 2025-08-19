import React, { useState, useEffect, useRef } from 'react';
import './Calculator.css';
import './styles/ButtonEffects.css';
import soundManager from './utils/soundManager';

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
  
  // Refs for animation timeouts
  const animationTimeoutRef = useRef(null);

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
    }
    
    setWaitingForOperand(true);
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
          setDisplayValue(String(parseFloat(displayValue) / 100));
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

  // Get the current operation display
  const getOperationDisplay = () => {
    return operation ? `${previousValue} ${operation}` : '';
  };

  return (
    <div className={`calculator ${animationClass}`}>
      <div className="calculator-display">
        <div className="operation-display">{getOperationDisplay()}</div>
        <div className="value-display">
          {displayValue}
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
    </div>
  );
};

export default Calculator;
