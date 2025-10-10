// Utility functions for exporting and importing calculator history

export const exportToCSV = (history) => {
  if (!Array.isArray(history) || history.length === 0) {
    return null;
  }

  const headers = 'Expression,Result,Timestamp\n';
  const rows = history.map(item => {
    const expression = `"${item.expression}"`;
    const result = item.result;
    const timestamp = new Date(item.timestamp).toLocaleString();
    return `${expression},${result},"${timestamp}"`;
  }).join('\n');

  return headers + rows;
};

export const exportToJSON = (history) => {
  if (!Array.isArray(history) || history.length === 0) {
    return null;
  }

  return JSON.stringify(history, null, 2);
};

export const exportToTXT = (history) => {
  if (!Array.isArray(history) || history.length === 0) {
    return null;
  }

  return history.map(item => {
    const timestamp = new Date(item.timestamp).toLocaleString();
    return `${item.expression} = ${item.result} (${timestamp})`;
  }).join('\n');
};

export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  if (!content) return false;

  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
};

export const importFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const extension = file.name.split('.').pop().toLowerCase();
        
        let history = null;
        
        if (extension === 'json') {
          history = parseJSONHistory(content);
        } else if (extension === 'csv') {
          history = parseCSVHistory(content);
        } else if (extension === 'txt') {
          history = parseTXTHistory(content);
        } else {
          reject(new Error('Unsupported file format. Please use JSON, CSV, or TXT.'));
          return;
        }
        
        if (!history || history.length === 0) {
          reject(new Error('No valid history entries found in file.'));
          return;
        }
        
        resolve(history);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };
    
    reader.readAsText(file);
  });
};

const parseJSONHistory = (content) => {
  const parsed = JSON.parse(content);
  
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid JSON format: Expected an array.');
  }
  
  return parsed.filter(item => 
    item && 
    typeof item.expression === 'string' && 
    (typeof item.result === 'number' || typeof item.result === 'string') &&
    typeof item.timestamp === 'number'
  ).map(item => ({
    id: item.id || Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    expression: item.expression,
    result: item.result,
    timestamp: item.timestamp
  }));
};

const parseCSVHistory = (content) => {
  const lines = content.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('Invalid CSV format: No data rows found.');
  }
  
  // Skip header row
  const dataLines = lines.slice(1);
  
  return dataLines.map(line => {
    // Simple CSV parsing (handles quoted fields)
    const match = line.match(/^"([^"]*)",([^,]+),"([^"]*)"$/);
    
    if (!match) {
      return null;
    }
    
    const expression = match[1];
    const result = parseFloat(match[2]);
    const timestampStr = match[3];
    
    if (!expression || isNaN(result)) {
      return null;
    }
    
    return {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      expression,
      result,
      timestamp: new Date(timestampStr).getTime() || Date.now()
    };
  }).filter(item => item !== null);
};

const parseTXTHistory = (content) => {
  const lines = content.trim().split('\n');
  
  return lines.map(line => {
    // Parse format: "expression = result (timestamp)"
    const match = line.match(/^(.+?)\s*=\s*([^\s(]+)\s*\((.+)\)$/);
    
    if (!match) {
      return null;
    }
    
    const expression = match[1].trim();
    const result = parseFloat(match[2]);
    const timestampStr = match[3];
    
    if (!expression || isNaN(result)) {
      return null;
    }
    
    return {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      expression,
      result,
      timestamp: new Date(timestampStr).getTime() || Date.now()
    };
  }).filter(item => item !== null);
};
