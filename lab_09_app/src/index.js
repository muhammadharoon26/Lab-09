import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // We reuse App.css for global styles since index.css might be missing
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);