import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppProvider } from './app/AppContext';
import { AppContent } from './app/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <AppContent />
    </AppProvider>
  </StrictMode>
);
