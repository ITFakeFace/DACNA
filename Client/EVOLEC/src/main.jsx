import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // PrimeReact theme
import 'primereact/resources/primereact.min.css';                 // PrimeReact core
import '@mantine/core/styles.css';
import 'primeicons/primeicons.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <App />
      </MantineProvider>
    </PrimeReactProvider>
  </React.StrictMode>,
);
