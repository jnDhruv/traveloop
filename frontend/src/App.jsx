import { useState } from 'react'
import { IntroPage } from './pages/intro/IntroPage'
import { Signup } from './pages/signup/Signup'

function App() {
  const [page, setPage] = useState('intro')

  if (page === 'intro') {
    return (
      <IntroPage
        onGetStarted={() => setPage('signup')}
        onLogin={() => setPage('login')}
      />
    )
  }

  if (page === 'signup') {
      return (
        <Signup
          onLogin={() => setPage('login')}
          onSuccess={() => setPage('dashboard')}
        />
      )
    }

  // Placeholder pages — replace with real components later
  return (
    <div>
      {page === 'signup' ? '→ Signup page coming soon' : '→ Login page coming soon'}
      <button onClick={() => setPage('intro')}>
        ← Back
      </button>
    </div>
  )
}

export default App
