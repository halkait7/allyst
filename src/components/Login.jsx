import { useState } from 'react'
import { getApiUrl } from '../config'
import './Login.css'

function Login({ onLogin, theme, toggleTheme }) {
  const [cookieInput, setCookieInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

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
            <label htmlFor="cookie">
              Roblox Cookie
              <button 
                type="button"
                className="info-icon" 
                onClick={() => setShowInfo(!showInfo)}
                aria-label="Why do we need your cookie?"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </button>
            </label>
            {showInfo && (
              <div className="info-tooltip">
                <p><strong>Why do we need your cookie?</strong></p>
                <p>Your cookie authenticates you with Roblox's API so we can manage your friends. It's stored locally in your browser and never sent to our servers.</p>
              </div>
            )}
            <textarea
              id="cookie"
              className="input cookie-input"
              placeholder="Paste your .ROBLOSECURITY cookie here..."
              value={cookieInput}
              onChange={(e) => setCookieInput(e.target.value)}
              rows={4}
              disabled={loading}
            />
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
            <summary>How to get your Roblox cookie?</summary>
            <ol>
              <li>Open Roblox.com → Press F12</li>
              <li>Application → Cookies → roblox.com</li>
              <li>Copy .ROBLOSECURITY value</li>
            </ol>
          </details>

          <div className="security-notice">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Stored locally. Requests go directly to Roblox.</span>
          </div>

          <div className="disclaimer">
            <small>Unofficial tool. Not affiliated with Roblox Corporation.</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
