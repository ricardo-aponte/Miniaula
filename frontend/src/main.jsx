import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './context/AuthProvider';
import RouterConfig from './routes/RouterConfig';
import NavigationHandler from './routes/NavigationHandler';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NavigationHandler />
        <RouterConfig />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
