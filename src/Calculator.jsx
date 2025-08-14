import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
  // State variables
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [error, setError] = useState('');

  // Handle number input
  const handleNumber = (number) => {
    setError('');
    
    if (waitingForOperand) {
      setDisplayValue(String(number));
      setWaitingForOperand(false);
    } else {
      // Replace display if it's just '0', otherwise append
      setDisplayValue(displayValue === '0' ? String(number) : displayValue + number);
    }
  };

  // Handle decimal point
  const handleDecimal = () => {
    setError('');
    
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
      return;
    }
    
    const inputValue = parseFloat(displayValue);
    
    // Don't calculate if waiting for an operand (prevents double equals)
    if (waitingForOperand && previousValue !== null) {
      return;
    }
    
    const result = calculate(previousValue, inputValue, operation);
    
    // Handle division by zero
    if (result === 'Error') {
      setError('Cannot divide by zero');
      setDisplayValue('Error');
    } else {
      setDisplayValue(String(result));
      setError('');
    }
    
    // Reset for a new calculation
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  // Handle clear button
  const handleClear = () => {
    setDisplayValue('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setError('');
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

  // Get the current operation display
  const getOperationDisplay = () => {
    return operation ? `${previousValue} ${operation}` : '';
  };

  return (
    <div className="calculator">
      <div className="calculator-display">
        <div className="operation-display">{getOperationDisplay()}</div>
        <div className="value-display">{displayValue}</div>
        {error && <div className="error-display">{error}</div>}
      </div>
      
      <div className="calculator-keypad">
        <div className="input-keys">
          <div className="function-keys">
            <button className="calculator-key key-clear" onClick={handleClear}>
              AC
            </button>
            <button className="calculator-key key-sign" onClick={() => {
              setDisplayValue(displayValue.charAt(0) === '-' ? displayValue.substr(1) : '-' + displayValue);
            }}>
              ±
            </button>
            <button className="calculator-key key-percent" onClick={() => {
              const value = parseFloat(displayValue);
              setDisplayValue(String(value / 100));
            }}>
              %
            </button>
          </div>
          
          <div className="digit-keys">
            <button className="calculator-key key-0" onClick={() => handleNumber(0)}>0</button>
            <button className="calculator-key key-dot" onClick={handleDecimal}>.</button>
            <button className="calculator-key key-1" onClick={() => handleNumber(1)}>1</button>
            <button className="calculator-key key-2" onClick={() => handleNumber(2)}>2</button>
            <button className="calculator-key key-3" onClick={() => handleNumber(3)}>3</button>
            <button className="calculator-key key-4" onClick={() => handleNumber(4)}>4</button>
            <button className="calculator-key key-5" onClick={() => handleNumber(5)}>5</button>
            <button className="calculator-key key-6" onClick={() => handleNumber(6)}>6</button>
            <button className="calculator-key key-7" onClick={() => handleNumber(7)}>7</button>
            <button className="calculator-key key-8" onClick={() => handleNumber(8)}>8</button>
            <button className="calculator-key key-9" onClick={() => handleNumber(9)}>9</button>
          </div>
        </div>
        
        <div className="operator-keys">
          <button className="calculator-key key-divide" onClick={() => handleOperator('/')}>÷</button>
          <button className="calculator-key key-multiply" onClick={() => handleOperator('*')}>×</button>
          <button className="calculator-key key-subtract" onClick={() => handleOperator('-')}>−</button>
          <button className="calculator-key key-add" onClick={() => handleOperator('+')}>+</button>
          <button className="calculator-key key-equals" onClick={handleEquals}>=</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
