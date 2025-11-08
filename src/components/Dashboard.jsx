import { useState, useEffect } from 'react'
import FriendCard from './FriendCard'
import Toast from './Toast'
import ConfirmModal from './ConfirmModal'
import { getApiUrl } from '../config'
import './Dashboard.css'

function Dashboard({ cookie, onLogout, theme, toggleTheme }) {
  const [friends, setFriends] = useState([])
  const [filteredFriends, setFilteredFriends] = useState([])
  const [selectedFriends, setSelectedFriends] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [toast, setToast] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    fetchUserInfo()
    fetchFriends()
  }, [])

  useEffect(() => {
    filterAndSortFriends()
  }, [friends, searchQuery, sortBy])

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(getApiUrl('/api/user-info'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Roblox-Cookie': cookie
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUserInfo(data)
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  const fetchFriends = async () => {
    setLoading(true)
    try {
      const response = await fetch(getApiUrl('/api/friends'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Roblox-Cookie': cookie
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch friends')
      }

      const data = await response.json()
      setFriends(data.data)
      showToast(`Loaded ${data.data.length} friends`, 'success')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortFriends = () => {
    let filtered = [...friends]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'displayName':
          return a.displayName.localeCompare(b.displayName)
        default:
          return 0
      }
    })

    setFilteredFriends(filtered)
  }

  const toggleFriendSelection = (friendId) => {
    const newSelected = new Set(selectedFriends)
    if (newSelected.has(friendId)) {
      newSelected.delete(friendId)
    } else {
      newSelected.add(friendId)
    }
    setSelectedFriends(newSelected)
  }

  const selectAll = () => {
    const allIds = new Set(filteredFriends.map(f => f.id))
    setSelectedFriends(allIds)
  }

  const deselectAll = () => {
    setSelectedFriends(new Set())
  }

  const handleRemoveSelected = () => {
    if (selectedFriends.size === 0) {
      showToast('No friends selected', 'error')
      return
    }
    setShowConfirmModal(true)
  }

  const confirmRemove = async () => {
    setShowConfirmModal(false)
    setRemoving(true)

    try {
      const userIds = Array.from(selectedFriends)
      const response = await fetch(getApiUrl('/api/batch-unfriend'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Roblox-Cookie': cookie
        },
        body: JSON.stringify({ userIds })
      })

      if (!response.ok) {
        throw new Error('Failed to remove friends')
      }

      const result = await response.json()
      
      // Remove successfully unfriended users from the list
      const successfulIds = result.results
        .filter(r => r.success)
        .map(r => r.userId)
      
      setFriends(friends.filter(f => !successfulIds.includes(f.id)))
      setSelectedFriends(new Set())
      
      showToast(result.summary, 'success')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setRemoving(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner spinner-large"></div>
        <p>Loading your friends...</p>
      </div>
    )
  }

  return (
    <div className="dashboard fade-in">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <div className="logo-small">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <rect width="48" height="48" rx="12" fill="url(#gradient)"/>
                  <path d="M24 14L32 20V28L24 34L16 28V20L24 14Z" stroke="white" strokeWidth="2"/>
                  <path d="M24 14V34M16 20L32 28M32 20L16 28" stroke="white" strokeWidth="2"/>
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48">
                      <stop stopColor="#5865f2"/>
                      <stop offset="1" stopColor="#4752c4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h1>Allyst</h1>
                {userInfo && (
                  <p className="user-name">Welcome, {userInfo.displayName}</p>
                )}
              </div>
            </div>

            <div className="header-right">
              <button className="btn btn-ghost" onClick={toggleTheme}>
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button className="btn btn-secondary" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="controls-section">
            <div className="search-bar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2"/>
                <path d="M12.5 12.5L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                className="input search-input"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="controls-row">
              <div className="sort-controls">
                <label>Sort by:</label>
                <select 
                  className="input sort-select" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Username</option>
                  <option value="displayName">Display Name</option>
                </select>
              </div>

              <div className="selection-controls">
                <button className="btn btn-ghost" onClick={selectAll}>
                  Select All ({filteredFriends.length})
                </button>
                <button className="btn btn-ghost" onClick={deselectAll}>
                  Deselect All
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={handleRemoveSelected}
                  disabled={selectedFriends.size === 0 || removing}
                >
                  {removing ? (
                    <>
                      <div className="spinner"></div>
                      Removing...
                    </>
                  ) : (
                    `Remove Selected (${selectedFriends.size})`
                  )}
                </button>
              </div>
            </div>
          </div>

          {filteredFriends.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
                <path d="M32 20V32M32 38V40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <h2>No friends found</h2>
              <p>
                {searchQuery 
                  ? 'Try adjusting your search query' 
                  : 'Your friends list is empty'}
              </p>
            </div>
          ) : (
            <div className="friends-grid">
              {filteredFriends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  isSelected={selectedFriends.has(friend.id)}
                  onToggleSelect={toggleFriendSelection}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="dashboard-footer">
        <div className="container">
          <p>© 2025 Allyst. Not affiliated with Roblox Corporation.</p>
        </div>
      </footer>

      {toast && <Toast message={toast.message} type={toast.type} />}
      
      {showConfirmModal && (
        <ConfirmModal
          title="Confirm Removal"
          message={`Are you sure you want to remove ${selectedFriends.size} friend${selectedFriends.size > 1 ? 's' : ''}? This action cannot be undone.`}
          onConfirm={confirmRemove}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  )
}

export default Dashboard
