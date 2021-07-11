import React, { useState } from 'react';
import logo from '../assets/logo.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  const handleCountClick = () => {
    setCount((count) => {
      const value = count + 1;
      (window as any).ipc.loginWithGithub().then((data: any) => {
        alert(data);
      });
      return value;
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button onClick={handleCountClick}>count is: {count}</button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
