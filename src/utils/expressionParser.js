// Safe expression parser and evaluator
// Supports: +, -, *, /, (), decimal numbers, negative numbers

class ExpressionParser {
  constructor(expression) {
    this.expression = expression.trim();
    this.pos = 0;
    this.currentChar = this.expression[0];
  }

  advance() {
    this.pos++;
    this.currentChar = this.pos < this.expression.length ? this.expression[this.pos] : null;
  }

  skipWhitespace() {
    while (this.currentChar && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  parseNumber() {
    let numStr = '';
    
    // Handle negative numbers
    if (this.currentChar === '-') {
      numStr += '-';
      this.advance();
    }

    // Parse digits and decimal point
    while (this.currentChar && (/[0-9.]/.test(this.currentChar))) {
      numStr += this.currentChar;
      this.advance();
    }

    const num = parseFloat(numStr);
    if (isNaN(num)) {
      throw new Error(`Invalid number: ${numStr}`);
    }

    return num;
  }

  parseFactor() {
    this.skipWhitespace();

    // Handle parentheses
    if (this.currentChar === '(') {
      this.advance(); // skip '('
      const result = this.parseExpression();
      
      if (this.currentChar !== ')') {
        throw new Error('Mismatched parentheses');
      }
      
      this.advance(); // skip ')'
      return result;
    }

    // Handle numbers (including negative)
    if (this.currentChar === '-' || (this.currentChar && /[0-9]/.test(this.currentChar))) {
      return this.parseNumber();
    }

    throw new Error(`Unexpected character: ${this.currentChar}`);
  }

  parseTerm() {
    let result = this.parseFactor();

    this.skipWhitespace();

    while (this.currentChar && (this.currentChar === '*' || this.currentChar === '/')) {
      const op = this.currentChar;
      this.advance();
      
      const right = this.parseFactor();

      if (op === '*') {
        result *= right;
      } else if (op === '/') {
        if (right === 0) {
          throw new Error('Division by zero');
        }
        result /= right;
      }

      this.skipWhitespace();
    }

    return result;
  }

  parseExpression() {
    let result = this.parseTerm();

    this.skipWhitespace();

    while (this.currentChar && (this.currentChar === '+' || this.currentChar === '-')) {
      const op = this.currentChar;
      this.advance();
      
      const right = this.parseTerm();

      if (op === '+') {
        result += right;
      } else if (op === '-') {
        result -= right;
      }

      this.skipWhitespace();
    }

    return result;
  }

  evaluate() {
    if (!this.expression) {
      throw new Error('Empty expression');
    }

    const result = this.parseExpression();

    // Check if we consumed the entire expression
    this.skipWhitespace();
    if (this.currentChar !== null) {
      throw new Error(`Unexpected character at position ${this.pos}: ${this.currentChar}`);
    }

    return result;
  }
}

// Main evaluation function
export const evaluateExpression = (expression) => {
  try {
    const parser = new ExpressionParser(expression);
    const result = parser.evaluate();
    
    if (!isFinite(result)) {
      throw new Error('Result is not a finite number');
    }
    
    return { success: true, result, error: null };
  } catch (error) {
    return { success: false, result: null, error: error.message };
  }
};

// Validate expression syntax without evaluating
export const validateExpression = (expression) => {
  try {
    const parser = new ExpressionParser(expression);
    parser.evaluate();
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Format expression with syntax highlighting data
export const analyzeExpression = (expression) => {
  const tokens = [];
  let current = '';
  let type = null;

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (/[0-9.]/.test(char)) {
      if (type !== 'number') {
        if (current) tokens.push({ type, value: current });
        current = char;
        type = 'number';
      } else {
        current += char;
      }
    } else if (/[+\-*/()]/.test(char)) {
      if (current) tokens.push({ type, value: current });
      tokens.push({ type: 'operator', value: char });
      current = '';
      type = null;
    } else if (/\s/.test(char)) {
      if (current) tokens.push({ type, value: current });
      current = '';
      type = null;
    } else {
      if (type !== 'unknown') {
        if (current) tokens.push({ type, value: current });
        current = char;
        type = 'unknown';
      } else {
        current += char;
      }
    }
  }

  if (current) tokens.push({ type, value: current });

  return tokens;
};
