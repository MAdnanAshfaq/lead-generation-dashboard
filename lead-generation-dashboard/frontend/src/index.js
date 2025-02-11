import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Get the root element
const container = document.getElementById('root');

// Create a root
const root = ReactDOM.createRoot(container);

// Render app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Report web vitals
reportWebVitals();
