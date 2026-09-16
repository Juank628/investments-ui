import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core';
import {
  ClientSideRowModelModule,
  NumberFilterModule,
  TextFilterModule,
  enableDevValidations,
} from 'ag-grid-community';
import { AgGridProvider } from 'ag-grid-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App.tsx';
import './index.css';

// From v36 the ValidationModule is no longer part of AllCommunityModule. Without it AG Grid logs a
// bare error code instead of a readable message, so opt in for development builds only.
if (import.meta.env.DEV) {
  enableDevValidations();
}

// Only the modules the grid actually uses: the default row model, plus the filters backing
// `filter: true`. Registering AllCommunityModule instead would defeat tree shaking.
const agGridModules = [ClientSideRowModelModule, TextFilterModule, NumberFilterModule];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider defaultColorScheme="light">
        <AgGridProvider modules={agGridModules}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AgGridProvider>
      </MantineProvider>
    </Provider>
  </StrictMode>,
);
