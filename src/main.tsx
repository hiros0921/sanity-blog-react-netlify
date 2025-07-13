// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Force rebuild - BrowserRouter fix
console.log('App version: 1.0.2 - No Router')
import './index.css'
import TestApp from './TestApp.tsx'

console.log('Loading TestApp...')

createRoot(document.getElementById('root')!).render(
  <TestApp />
)