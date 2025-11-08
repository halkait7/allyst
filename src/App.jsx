import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [cookie, setCookie] = useState(null)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    // Load saved cookie and theme
    const savedCookie = localStorage.getItem('robloxCookie')
    const savedTheme = localStorage.getItem('theme') || 'dark'
    
    if (savedCookie) {
      setCookie(savedCookie)
    }
    
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const handleLogin = (newCookie) => {
    setCookie(newCookie)
    localStorage.setItem('robloxCookie', newCookie)
  }

  const handleLogout = () => {
    setCookie(null)
    localStorage.removeItem('robloxCookie')
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <>
      <div className="app">
        {!cookie ? (
          <Login onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />
        ) : (
          <Dashboard 
            cookie={cookie} 
            onLogout={handleLogout} 
            theme={theme} 
            toggleTheme={toggleTheme} 
          />
        )}
      </div>
      <Analytics />
    </>
  )
}

export default App
