import React from 'react';
import Calculator from './Calculator';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Calculator App</h1>
      </header>
      <main>
        <Calculator />
      </main>
      <footer className="App-footer">
        <p>Created with <span className="heart">♥</span> by Factory</p>
      </footer>
    </div>
  );
}

export default App;
