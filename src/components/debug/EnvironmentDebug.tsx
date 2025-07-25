import React from 'react';
import { API_BASE_URL, NODE_ENV, IS_DEVELOPMENT, IS_PRODUCTION } from '@/config/environment';

export const EnvironmentDebug: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 bg-slate-900/90 text-white p-4 rounded-lg border border-slate-700 text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">🔧 Environment Debug</h3>
      <div className="space-y-1">
        <div><strong>API_BASE_URL:</strong> {API_BASE_URL}</div>
        <div><strong>NODE_ENV:</strong> {NODE_ENV}</div>
        <div><strong>IS_DEVELOPMENT:</strong> {IS_DEVELOPMENT.toString()}</div>
        <div><strong>IS_PRODUCTION:</strong> {IS_PRODUCTION.toString()}</div>
        <div><strong>VITE_API_BASE_URL:</strong> {import.meta.env?.VITE_API_BASE_URL || 'NOT SET'}</div>
        <div><strong>import.meta.env.NODE_ENV:</strong> {import.meta.env?.NODE_ENV || 'NOT SET'}</div>
        <div><strong>import.meta.env.MODE:</strong> {import.meta.env?.MODE || 'NOT SET'}</div>
        <div><strong>import.meta.env.DEV:</strong> {import.meta.env?.DEV?.toString() || 'NOT SET'}</div>
        <div><strong>import.meta.env.PROD:</strong> {import.meta.env?.PROD?.toString() || 'NOT SET'}</div>
      </div>
      <button 
        onClick={() => console.log('Environment:', { API_BASE_URL, NODE_ENV, IS_DEVELOPMENT, IS_PRODUCTION })}
        className="mt-2 bg-blue-600 px-2 py-1 rounded text-xs"
      >
        Log to Console
      </button>
    </div>
  );
}; 