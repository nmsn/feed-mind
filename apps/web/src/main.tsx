import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import './app.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(React.createElement(App, null));
}