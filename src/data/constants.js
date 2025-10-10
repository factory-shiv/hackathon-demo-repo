// Mathematical and Physical Constants

export const constants = [
  // Mathematical Constants
  {
    id: 'pi',
    symbol: 'π',
    name: 'Pi',
    value: Math.PI,
    category: 'mathematical',
    description: 'Ratio of circle circumference to diameter',
    precision: '3.14159265358979323846...',
    keywords: ['pi', 'circle', 'circumference']
  },
  {
    id: 'e',
    symbol: 'e',
    name: 'Euler\'s Number',
    value: Math.E,
    category: 'mathematical',
    description: 'Base of natural logarithms',
    precision: '2.71828182845904523536...',
    keywords: ['e', 'euler', 'natural', 'logarithm', 'exponential']
  },
  {
    id: 'phi',
    symbol: 'φ',
    name: 'Golden Ratio',
    value: (1 + Math.sqrt(5)) / 2,
    category: 'mathematical',
    description: 'The golden ratio',
    precision: '1.61803398874989484820...',
    keywords: ['phi', 'golden', 'ratio', 'fibonacci']
  },
  {
    id: 'sqrt2',
    symbol: '√2',
    name: 'Square Root of 2',
    value: Math.SQRT2,
    category: 'mathematical',
    description: 'Pythagoras constant',
    precision: '1.41421356237309504880...',
    keywords: ['sqrt', 'square root', 'pythagoras', '2']
  },
  {
    id: 'ln2',
    symbol: 'ln(2)',
    name: 'Natural Log of 2',
    value: Math.LN2,
    category: 'mathematical',
    description: 'Natural logarithm of 2',
    precision: '0.69314718055994530941...',
    keywords: ['ln', 'log', 'natural', 'logarithm', '2']
  },
  {
    id: 'ln10',
    symbol: 'ln(10)',
    name: 'Natural Log of 10',
    value: Math.LN10,
    category: 'mathematical',
    description: 'Natural logarithm of 10',
    precision: '2.30258509299404568401...',
    keywords: ['ln', 'log', 'natural', 'logarithm', '10']
  },
  
  // Physical Constants
  {
    id: 'c',
    symbol: 'c',
    name: 'Speed of Light',
    value: 299792458,
    category: 'physical',
    description: 'Speed of light in vacuum (m/s)',
    precision: '299,792,458 m/s',
    keywords: ['speed', 'light', 'c', 'velocity', 'physics']
  },
  {
    id: 'g',
    symbol: 'g',
    name: 'Gravity',
    value: 9.80665,
    category: 'physical',
    description: 'Standard gravity acceleration (m/s²)',
    precision: '9.80665 m/s²',
    keywords: ['gravity', 'g', 'acceleration', 'earth']
  },
  {
    id: 'h',
    symbol: 'h',
    name: 'Planck Constant',
    value: 6.62607015e-34,
    category: 'physical',
    description: 'Planck\'s constant (J·s)',
    precision: '6.62607015×10⁻³⁴ J·s',
    keywords: ['planck', 'h', 'quantum', 'physics']
  },
  {
    id: 'k',
    symbol: 'k',
    name: 'Boltzmann Constant',
    value: 1.380649e-23,
    category: 'physical',
    description: 'Boltzmann constant (J/K)',
    precision: '1.380649×10⁻²³ J/K',
    keywords: ['boltzmann', 'k', 'thermodynamics', 'temperature']
  },
  {
    id: 'na',
    symbol: 'Nₐ',
    name: 'Avogadro\'s Number',
    value: 6.02214076e23,
    category: 'physical',
    description: 'Avogadro\'s number (mol⁻¹)',
    precision: '6.02214076×10²³ mol⁻¹',
    keywords: ['avogadro', 'na', 'mole', 'chemistry']
  },
  {
    id: 'r',
    symbol: 'R',
    name: 'Gas Constant',
    value: 8.314462618,
    category: 'physical',
    description: 'Universal gas constant (J/(mol·K))',
    precision: '8.314462618 J/(mol·K)',
    keywords: ['gas', 'constant', 'r', 'universal', 'chemistry']
  },
  
  // Engineering Constants
  {
    id: 'atm',
    symbol: 'atm',
    name: 'Atmospheric Pressure',
    value: 101325,
    category: 'engineering',
    description: 'Standard atmospheric pressure (Pa)',
    precision: '101,325 Pa',
    keywords: ['atmosphere', 'pressure', 'atm', 'standard']
  },
  {
    id: 'zero_c',
    symbol: '0°C',
    name: 'Zero Celsius',
    value: 273.15,
    category: 'engineering',
    description: 'Zero Celsius in Kelvin',
    precision: '273.15 K',
    keywords: ['celsius', 'kelvin', 'temperature', 'zero']
  },
  {
    id: 'mile',
    symbol: 'mi',
    name: 'Mile to Meters',
    value: 1609.344,
    category: 'engineering',
    description: 'Mile in meters',
    precision: '1,609.344 m',
    keywords: ['mile', 'meter', 'conversion', 'distance']
  },
  {
    id: 'inch',
    symbol: 'in',
    name: 'Inch to Centimeters',
    value: 2.54,
    category: 'engineering',
    description: 'Inch in centimeters',
    precision: '2.54 cm',
    keywords: ['inch', 'centimeter', 'conversion', 'length']
  }
];

export const categories = {
  mathematical: 'Mathematical',
  physical: 'Physical',
  engineering: 'Engineering'
};

// Get constants by category
export const getConstantsByCategory = (category) => {
  return constants.filter(c => c.category === category);
};

// Search constants
export const searchConstants = (query) => {
  if (!query) return constants;
  
  const lowerQuery = query.toLowerCase();
  return constants.filter(c =>
    c.name.toLowerCase().includes(lowerQuery) ||
    c.symbol.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery) ||
    c.keywords.some(k => k.includes(lowerQuery))
  );
};
