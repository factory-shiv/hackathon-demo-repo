import React from 'react';
import { useMemory } from '../contexts/MemoryContext';
import '../styles/MemoryIndicator.css';

const MemoryIndicator = () => {
  const { hasMemory, memoryValue } = useMemory();

  if (!hasMemory) return null;

  return (
    <div className="memory-indicator" title={`Memory: ${memoryValue}`}>
      📝 M
    </div>
  );
};

export default MemoryIndicator;
