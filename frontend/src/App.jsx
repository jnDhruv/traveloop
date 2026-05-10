import { useState } from 'react'
import { IntroPage } from './pages/intro/IntroPage'
import { Signup } from './pages/signup/Signup'
import { Login } from './pages/login/Login'

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
    else{
      return (
        <Login
          onSuccess={() => setPage('dashboard')}
        />
      )
    }
}

export default App
