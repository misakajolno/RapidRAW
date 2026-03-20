import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { installFrontendLogBridge } from './utils/frontendLogBridge';
import { I18nProvider } from './i18n';
import './styles.css';

installFrontendLogBridge();

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>,
);