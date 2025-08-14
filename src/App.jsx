import React from 'react';
import Calculator from './Calculator';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <header className="App-header">
          <h1>Calculator App</h1>
          <ThemeToggle />
        </header>
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
