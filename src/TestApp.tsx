export default function TestApp() {
  console.log('TestApp rendering...')
  return (
    <div style={{ padding: '20px', background: 'white', minHeight: '100vh' }}>
      <h1>Simple Test Page</h1>
      <p>URL: {window.location.pathname}</p>
      <p>This page works without React Router!</p>
    </div>
  )
}