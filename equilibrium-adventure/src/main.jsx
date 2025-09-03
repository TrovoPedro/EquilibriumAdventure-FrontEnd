import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from "../src/context/AuthContext.jsx";
import { ScoreProvider } from '../src/context/ScoreContext';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <ScoreProvider>
    <App />
    </ScoreProvider>
    </AuthProvider>
  </StrictMode>,
)
