import React from 'react';
import { createRoot } from 'react-dom/client';
import Page from './page';

// Create a root.
const container = document.getElementById('root');
const root = createRoot(container);

// Initial render
root.render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);
