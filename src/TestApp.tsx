import { BrowserRouter, Routes, Route } from 'react-router-dom'

function TestPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Page</h1>
      <p>This is a test page to check if routing works.</p>
    </div>
  )
}

export default function TestApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestPage />} />
        <Route path="/post/:slug" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  )
}