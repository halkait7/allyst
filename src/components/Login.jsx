import { useState } from 'react'
import { getApiUrl } from '../config'
import './Login.css'

function Login({ onLogin, theme, toggleTheme }) {
  const [cookieInput, setCookieInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!cookieInput.trim()) {
      setError('Please enter your Roblox cookie')
      return
    }

    setLoading(true)

    try {
      // Validate cookie by fetching user info
      const response = await fetch(getApiUrl('/api/user-info'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Roblox-Cookie': cookieInput.trim()
        }
      })

      if (!response.ok) {
        throw new Error('Invalid cookie or authentication failed')
      }

      const userData = await response.json()
      onLogin(cookieInput.trim())
    } catch (err) {
      setError(err.message || 'Failed to authenticate. Please check your cookie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container fade-in">
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="login-content">
        <div className="login-header">
          <div className="logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="url(#gradient)"/>
              <path d="M24 14L32 20V28L24 34L16 28V20L24 14Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 14V34M16 20L32 28M32 20L16 28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48">
                  <stop stopColor="#5865f2"/>
                  <stop offset="1" stopColor="#4752c4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>Allyst</h1>
          <p className="subtitle">Roblox Friend Manager</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="cookie">Roblox Cookie</label>
            <textarea
              id="cookie"
              className="input cookie-input"
              placeholder="Paste your .ROBLOSECURITY cookie here..."
              value={cookieInput}
              onChange={(e) => setCookieInput(e.target.value)}
              rows={4}
              disabled={loading}
            />
            <p className="help-text">
              Your cookie is stored locally and never shared with third parties.
            </p>
          </div>

          {error && (
            <div className="error-message">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 4V8M8 10V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-login" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                Authenticating...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </form>

        <div className="login-footer">
          <details className="how-to">
            <summary>How to get your cookie?</summary>
            <ol>
              <li>Open Roblox.com in your browser</li>
              <li>Press F12 to open Developer Tools</li>
              <li>Go to the "Application" or "Storage" tab</li>
              <li>Find "Cookies" in the left sidebar</li>
              <li>Click on "https://www.roblox.com"</li>
              <li>Find ".ROBLOSECURITY" and copy its value</li>
              <li>Paste it above (without the cookie name)</li>
            </ol>
          </details>

          <div className="security-notice">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L3 3V7C3 10.5 5.5 13.5 8 15C10.5 13.5 13 10.5 13 7V3L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Your data is encrypted and stored locally</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
