import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CoffeeProvider } from "./context/CoffeeContext"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CoffeeProvider>
      <App />
    </CoffeeProvider>
  </StrictMode>
)