import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import{ UserDataProvider } from './context/UserContext.tsx'
import CaptainContext from './context/CaptionContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CaptainContext>
    <UserDataProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </UserDataProvider>
    </CaptainContext>
  </StrictMode>,
)
