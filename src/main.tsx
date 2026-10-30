import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ClerkIntegrationProvider } from './context/ClerkAuthContext';

createRoot(document.getElementById('root')!).render(
  <ClerkIntegrationProvider>
    <App />
  </ClerkIntegrationProvider>
);

