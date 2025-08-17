import React from 'react';
import Calculator from './Calculator';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import SoundToggle from './components/SoundToggle';

function App() {
  return (
    <ThemeProvider>
      {/* Full-width application header */}
      <header className="AppHeader">
        <div className="HeaderContent">
          <h1>Calculator App</h1>
          <ThemeToggle />
          <SoundToggle />
        </div>
      </header>

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
    </ThemeProvider>
  );
}

export default App;
