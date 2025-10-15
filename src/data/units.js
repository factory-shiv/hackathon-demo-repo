// Unit conversion data and functions

export const categories = {
  length: 'Length',
  weight: 'Weight',
  temperature: 'Temperature',
  volume: 'Volume',
  speed: 'Speed',
  area: 'Area',
};

// All conversion factors are relative to base units
// Length: meters, Weight: kilograms, Volume: liters, Speed: m/s, Area: square meters, Temperature: special handling
export const units = [
  // Length
  { id: 'mm', name: 'Millimeter', symbol: 'mm', category: 'length', toBase: 0.001, fromBase: 1000 },
  { id: 'cm', name: 'Centimeter', symbol: 'cm', category: 'length', toBase: 0.01, fromBase: 100 },
  { id: 'm', name: 'Meter', symbol: 'm', category: 'length', toBase: 1, fromBase: 1 },
  { id: 'km', name: 'Kilometer', symbol: 'km', category: 'length', toBase: 1000, fromBase: 0.001 },
  { id: 'in', name: 'Inch', symbol: 'in', category: 'length', toBase: 0.0254, fromBase: 39.3701 },
  { id: 'ft', name: 'Foot', symbol: 'ft', category: 'length', toBase: 0.3048, fromBase: 3.28084 },
  { id: 'yd', name: 'Yard', symbol: 'yd', category: 'length', toBase: 0.9144, fromBase: 1.09361 },
  { id: 'mi', name: 'Mile', symbol: 'mi', category: 'length', toBase: 1609.34, fromBase: 0.000621371 },
  { id: 'nm', name: 'Nautical Mile', symbol: 'nm', category: 'length', toBase: 1852, fromBase: 0.000539957 },

  // Weight
  { id: 'mg', name: 'Milligram', symbol: 'mg', category: 'weight', toBase: 0.000001, fromBase: 1000000 },
  { id: 'g', name: 'Gram', symbol: 'g', category: 'weight', toBase: 0.001, fromBase: 1000 },
  { id: 'kg', name: 'Kilogram', symbol: 'kg', category: 'weight', toBase: 1, fromBase: 1 },
  { id: 't', name: 'Metric Ton', symbol: 't', category: 'weight', toBase: 1000, fromBase: 0.001 },
  { id: 'oz', name: 'Ounce', symbol: 'oz', category: 'weight', toBase: 0.0283495, fromBase: 35.274 },
  { id: 'lb', name: 'Pound', symbol: 'lb', category: 'weight', toBase: 0.453592, fromBase: 2.20462 },
  { id: 'st', name: 'Stone', symbol: 'st', category: 'weight', toBase: 6.35029, fromBase: 0.157473 },
  { id: 'ton', name: 'Short Ton', symbol: 'ton', category: 'weight', toBase: 907.185, fromBase: 0.00110231 },

  // Volume
  { id: 'ml', name: 'Milliliter', symbol: 'ml', category: 'volume', toBase: 0.001, fromBase: 1000 },
  { id: 'l', name: 'Liter', symbol: 'l', category: 'volume', toBase: 1, fromBase: 1 },
  { id: 'floz', name: 'US Fluid Ounce', symbol: 'fl oz', category: 'volume', toBase: 0.0295735, fromBase: 33.814 },
  { id: 'cup', name: 'US Cup', symbol: 'cup', category: 'volume', toBase: 0.236588, fromBase: 4.22675 },
  { id: 'pint', name: 'US Pint', symbol: 'pint', category: 'volume', toBase: 0.473176, fromBase: 2.11338 },
  { id: 'gal', name: 'US Gallon', symbol: 'gal', category: 'volume', toBase: 3.78541, fromBase: 0.264172 },
  { id: 'ukfloz', name: 'UK Fluid Ounce', symbol: 'UK fl oz', category: 'volume', toBase: 0.0284131, fromBase: 35.1951 },
  { id: 'ukpint', name: 'UK Pint', symbol: 'UK pint', category: 'volume', toBase: 0.568261, fromBase: 1.75975 },
  { id: 'ukgal', name: 'UK Gallon', symbol: 'UK gal', category: 'volume', toBase: 4.54609, fromBase: 0.219969 },

  // Speed
  { id: 'mps', name: 'Meter per Second', symbol: 'm/s', category: 'speed', toBase: 1, fromBase: 1 },
  { id: 'kmh', name: 'Kilometer per Hour', symbol: 'km/h', category: 'speed', toBase: 0.277778, fromBase: 3.6 },
  { id: 'mph', name: 'Mile per Hour', symbol: 'mph', category: 'speed', toBase: 0.44704, fromBase: 2.23694 },
  { id: 'knot', name: 'Knot', symbol: 'knot', category: 'speed', toBase: 0.51444, fromBase: 1.94384 },
  { id: 'fps', name: 'Foot per Second', symbol: 'ft/s', category: 'speed', toBase: 0.3048, fromBase: 3.28084 },

  // Area
  { id: 'mm2', name: 'Square Millimeter', symbol: 'mm²', category: 'area', toBase: 0.000001, fromBase: 1000000 },
  { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', category: 'area', toBase: 0.0001, fromBase: 10000 },
  { id: 'm2', name: 'Square Meter', symbol: 'm²', category: 'area', toBase: 1, fromBase: 1 },
  { id: 'km2', name: 'Square Kilometer', symbol: 'km²', category: 'area', toBase: 1000000, fromBase: 0.000001 },
  { id: 'ha', name: 'Hectare', symbol: 'ha', category: 'area', toBase: 10000, fromBase: 0.0001 },
  { id: 'in2', name: 'Square Inch', symbol: 'in²', category: 'area', toBase: 0.00064516, fromBase: 1550 },
  { id: 'ft2', name: 'Square Foot', symbol: 'ft²', category: 'area', toBase: 0.092903, fromBase: 10.7639 },
  { id: 'yd2', name: 'Square Yard', symbol: 'yd²', category: 'area', toBase: 0.836127, fromBase: 1.19599 },
  { id: 'ac', name: 'Acre', symbol: 'ac', category: 'area', toBase: 4046.86, fromBase: 0.000247105 },
  { id: 'mi2', name: 'Square Mile', symbol: 'mi²', category: 'area', toBase: 2589988, fromBase: 3.861e-7 },
];

// Group units by category
export const unitsByCategory = categories;
for (const category in categories) {
  unitsByCategory[category] = units.filter(u => u.category === category);
}

/**
 * Convert a value from one unit to another
 * @param {number} value - The value to convert
 * @param {string} fromUnitId - The source unit ID
 * @param {string} toUnitId - The target unit ID
 * @returns {number} The converted value
 */
export function convertUnit(value, fromUnitId, toUnitId) {
  // Special handling for temperature
  if (fromUnitId === 'c' || fromUnitId === 'f' || fromUnitId === 'k') {
    return convertTemperature(value, fromUnitId, toUnitId);
  }

  const fromUnit = units.find(u => u.id === fromUnitId);
  const toUnit = units.find(u => u.id === toUnitId);

  if (!fromUnit || !toUnit) {
    throw new Error(`Unit not found: ${fromUnitId} or ${toUnitId}`);
  }

  if (fromUnit.category !== toUnit.category) {
    throw new Error(`Cannot convert between different categories`);
  }

  const baseValue = value * fromUnit.toBase;
  const convertedValue = baseValue * toUnit.fromBase;

  return Math.round(convertedValue * 1e10) / 1e10; // Round to avoid floating point errors
}

/**
 * Convert temperature between Celsius, Fahrenheit, and Kelvin
 * @param {number} value - The temperature value
 * @param {string} fromUnit - Source unit ('c', 'f', or 'k')
 * @param {string} toUnit - Target unit ('c', 'f', or 'k')
 * @returns {number} The converted temperature
 */
function convertTemperature(value, fromUnit, toUnit) {
  let celsius;

  // Convert to Celsius first
  if (fromUnit === 'c') {
    celsius = value;
  } else if (fromUnit === 'f') {
    celsius = (value - 32) * (5 / 9);
  } else if (fromUnit === 'k') {
    celsius = value - 273.15;
  } else {
    throw new Error(`Unknown temperature unit: ${fromUnit}`);
  }

  // Convert from Celsius to target
  if (toUnit === 'c') {
    return Math.round(celsius * 1e10) / 1e10;
  } else if (toUnit === 'f') {
    return Math.round((celsius * 9 / 5 + 32) * 1e10) / 1e10;
  } else if (toUnit === 'k') {
    return Math.round((celsius + 273.15) * 1e10) / 1e10;
  } else {
    throw new Error(`Unknown temperature unit: ${toUnit}`);
  }
}

/**
 * Get all units in a specific category
 * @param {string} category - The category name
 * @returns {Array} Array of units in that category
 */
export function getUnitsByCategory(category) {
  return units.filter(u => u.category === category);
}

/**
 * Search units by name or symbol
 * @param {string} query - Search query
 * @returns {Array} Matching units
 */
export function searchUnits(query) {
  const q = query.toLowerCase();
  return units.filter(u => 
    u.name.toLowerCase().includes(q) ||
    u.symbol.toLowerCase().includes(q) ||
    u.id.toLowerCase().includes(q)
  );
}
