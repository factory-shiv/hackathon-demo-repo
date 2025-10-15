import React, { useRef, useState } from 'react';
import { exportToCSV, exportToJSON, exportToTXT, downloadFile, importFromFile } from '../utils/historyExporter';

const HistoryPanel = ({ history, onClearHistory, onReuseItem, onUpdateHistory, formatResult }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleExportCSV = () => {
    const csv = exportToCSV(history);
    downloadFile(csv, 'calculator-history.csv', 'text/csv');
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    const json = exportToJSON(history);
    downloadFile(json, 'calculator-history.json', 'application/json');
    setShowExportMenu(false);
  };

  const handleExportTXT = () => {
    const txt = exportToTXT(history);
    downloadFile(txt, 'calculator-history.txt', 'text/plain');
    setShowExportMenu(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedHistory = await importFromFile(file);
      if (importedHistory && importedHistory.length > 0) {
        const existingIds = new Set(history.map((h) => h.id));
        const newEntries = importedHistory.filter(h => !existingIds.has(h.id));
        const mergedHistory = [...newEntries, ...history].slice(0, 20);
        onUpdateHistory(mergedHistory);
        setImportStatus(`Imported ${importedHistory.length} entries`);
        setTimeout(() => setImportStatus(''), 3000);
      }
    } catch (error) {
      setImportStatus('Failed to import history');
      setTimeout(() => setImportStatus(''), 3000);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowExportMenu(false);
  };

  return (
    <section className="history-panel" aria-label="Calculation history">
      <div className="history-header">
        <h3>History</h3>
        <div className="history-actions">
          <button 
            className="history-clear" 
            onClick={onClearHistory} 
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
              onClick={() => onReuseItem(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { 
                  e.preventDefault(); 
                  onReuseItem(item); 
                }
              }}
            >
              <div className="history-row">
                <div className="history-expression">{item.expression} =</div>
                <div className="history-result">{formatResult(item.result)}</div>
              </div>
              <div className="history-meta">{new Date(item.timestamp).toLocaleTimeString()}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default HistoryPanel;
