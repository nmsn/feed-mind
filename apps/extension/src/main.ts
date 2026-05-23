import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { Sidepanel } from './Sidepanel';

export default defineSidebar({
  defaultIcon: '/icon.svg',
  devUrl: 'http://localhost:5173',
  onMount(sidebar) {
    const root = document.createElement('div');
    root.id = 'feedmind-root';
    sidebar.append(root);
    createRoot(root).render(<Sidepanel />);
  },
});