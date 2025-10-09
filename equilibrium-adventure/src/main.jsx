import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from "../src/context/AuthContext.jsx";
import { ScoreProvider } from '../src/context/ScoreContext';
import { GuideProvider } from './context/GuideContext.jsx';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ScoreProvider>
        <GuideProvider>
          <App />
        </GuideProvider>
      </ScoreProvider>
    </AuthProvider>
  </StrictMode>,
)
