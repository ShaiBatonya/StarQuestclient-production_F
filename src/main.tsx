import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import '@/index.css';
import { validateEnvironment } from '@/config/environment';

// Validate and log environment configuration on startup
validateEnvironment();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
