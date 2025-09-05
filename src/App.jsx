import React from 'react';
import Calculator from './Calculator';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { NumberFormatProvider } from './contexts/NumberFormatContext';
import ThemeToggle from './components/ThemeToggle';
import SoundToggle from './components/SoundToggle';
import NumberFormatToggle from './components/NumberFormatToggle';
import CommandPalette from './components/CommandPalette';

function App() {
  return (
    <ThemeProvider>
      <NumberFormatProvider>
        {/* Full-width application header */}
        <header className="AppHeader">
          <div className="HeaderContent">
            <h1>Calculator App</h1>
            <ThemeToggle />
            <SoundToggle />
            <NumberFormatToggle />
          </div>
        </header>

        {/* Global command palette (Cmd/Ctrl + K) */}
        <CommandPalette />

        {/* Constrained main application area */}
        <div className="App">
          <main>
            <Calculator />
          </main>
          <footer className="App-footer">
            <p>
              Created with <span className="heart">♥</span> by Factory
            </p>
          </footer>
        </div>
      </NumberFormatProvider>
    </ThemeProvider>
  );
}

export default App;
