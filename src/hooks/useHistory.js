import { useState, useEffect } from 'react';

const HISTORY_STORAGE_KEY = 'calculator_history';
const HISTORY_LIMIT = 20;

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Persist history whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      /* ignore quota / private-mode failures */
    }
  }, [history]);

  const addHistoryEntry = (expression, result) => {
    const entry = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      expression,
      result,
      timestamp: Date.now(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, HISTORY_LIMIT));
  };

  const reuseFromHistory = (item) => {
    return String(item.result);
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      /* ignore errors */
    }
  };

  const updateHistory = (newHistory) => {
    setHistory(newHistory);
  };

  return {
    history,
    addHistoryEntry,
    reuseFromHistory,
    clearHistory,
    updateHistory,
  };
}
