import { useState } from 'react'
import './FriendCard.css'

function FriendCard({ friend, isSelected, onToggleSelect }) {
  const [imageError, setImageError] = useState(false)

  const handleProfileClick = (e) => {
    e.stopPropagation()
    window.open(`https://www.roblox.com/users/${friend.id}/profile`, '_blank')
  }

  // Generate initials from display name or username
  const getInitials = (name) => {
    if (!name) return '?'
    const words = name.trim().split(/\s+/)
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Generate a consistent color based on user ID
  const getAvatarColor = (id) => {
    const colors = [
      '#5865f2', '#3ba55d', '#faa61a', '#ed4245', 
      '#eb459e', '#9c84ef', '#57f287', '#fee75c'
    ]
    return colors[id % colors.length]
  }

  return (
    <div 
      className={`friend-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onToggleSelect(friend.id)}
    >
      <div className="friend-card-header">
        <label className="checkbox-wrapper" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            className="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(friend.id)}
          />
        </label>
      </div>

      <div className="friend-avatar">
        {imageError ? (
          <div 
            className="avatar-fallback" 
            style={{ backgroundColor: getAvatarColor(friend.id) }}
          >
            {getInitials(friend.displayName || friend.name)}
          </div>
        ) : (
          <img
            src={friend.thumbnail}
            alt={friend.displayName}
            onError={() => setImageError(true)}
          />
        )}
        {friend.isOnline && <div className="online-indicator" title="Online"></div>}
      </div>

      <div className="friend-info">
        <h3 className="friend-display-name">{friend.displayName || friend.name || 'Unknown'}</h3>
        <p className="friend-username">@{friend.name || friend.displayName || 'unknown'}</p>
      </div>

      <button 
        className="btn btn-ghost btn-view-profile" 
        onClick={handleProfileClick}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 3L3 13M13 3H7M13 3V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        View Profile
      </button>
    </div>
  )
}

export default FriendCard
