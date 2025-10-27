import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from "../src/context/AuthContext.jsx";
import { ScoreProvider } from '../src/context/ScoreContext';
import { GuideProvider } from './context/GuideContext.jsx';
import App from './App.jsx'
import VLibras from './components/vlibras/VLibras';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ScoreProvider>
        <GuideProvider>
          {/* VLibras carregado globalmente para todo o app */}
          <VLibras />
          <App />
        </GuideProvider>
      </ScoreProvider>
    </AuthProvider>
  </StrictMode>,
)
