import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// --- 1. IMPORT AMPLIFY AND THE CONFIGURATION FILE HERE ---
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

// --- 2. CONFIGURE AMPLIFY HERE ---
// This code now runs BEFORE anything else in your React app.
Amplify.configure(awsExports);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);