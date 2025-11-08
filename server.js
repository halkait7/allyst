const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// CORS configuration
const corsOptions = {
  origin: isProduction ? process.env.FRONTEND_URL : '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Limit payload size

// Middleware to validate cookie
const validateCookie = (req, res, next) => {
  const cookie = req.headers['x-roblox-cookie'];
  if (!cookie) {
    return res.status(401).json({ error: 'Roblox cookie is required' });
  }
  req.robloxCookie = cookie;
  next();
};

// Get CSRF token
async function getCsrfToken(cookie) {
  try {
    const response = await axios.post('https://auth.roblox.com/v2/logout', {}, {
      headers: {
        'Cookie': `.ROBLOSECURITY=${cookie}`,
      },
      validateStatus: () => true
    });
    return response.headers['x-csrf-token'];
  } catch (error) {
    throw new Error('Failed to get CSRF token');
  }
}

// Get current user info
app.post('/api/user-info', validateCookie, async (req, res) => {
  try {
    const response = await axios.get('https://users.roblox.com/v1/users/authenticated', {
      headers: {
        'Cookie': `.ROBLOSECURITY=${req.robloxCookie}`,
      }
    });
    res.json(response.data);
  } catch (error) {
    if (!isProduction) console.error('Error fetching user info:', error.message);
    res.status(401).json({ error: 'Invalid cookie or authentication failed' });
  }
});

// Get friends list
app.post('/api/friends', validateCookie, async (req, res) => {
  try {
    // First get user info to get user ID
    const userResponse = await axios.get('https://users.roblox.com/v1/users/authenticated', {
      headers: {
        'Cookie': `.ROBLOSECURITY=${req.robloxCookie}`,
      }
    });
    
    const userId = userResponse.data.id;
    
    // Get friends list
    const friendsResponse = await axios.get(`https://friends.roblox.com/v1/users/${userId}/friends`, {
      headers: {
        'Cookie': `.ROBLOSECURITY=${req.robloxCookie}`,
      }
    });
    
    // Get friend IDs
    const friendIds = friendsResponse.data.data.map(friend => friend.id);
    
    if (friendIds.length === 0) {
      return res.json({ data: [] });
    }
    
    // Split friend IDs into chunks of 100
    const chunks = [];
    for (let i = 0; i < friendIds.length; i += 100) {
      chunks.push(friendIds.slice(i, i + 100));
    }
    
    let userDetails = {};
    let thumbnails = {};
    
    // Fetch user details and thumbnails for each chunk
    for (const chunk of chunks) {
      // Get usernames and display names
      const usersResponse = await axios.post('https://users.roblox.com/v1/users', {
        userIds: chunk,
        excludeBannedUsers: false
      });
      
      usersResponse.data.data.forEach(user => {
        userDetails[user.id] = {
          name: user.name,
          displayName: user.displayName
        };
      });
      
      // Get thumbnails
      const thumbnailResponse = await axios.get('https://thumbnails.roblox.com/v1/users/avatar-headshot', {
        params: {
          userIds: chunk.join(','),
          size: '150x150',
          format: 'Png'
        }
      });
      
      thumbnailResponse.data.data.forEach(thumb => {
        thumbnails[thumb.targetId] = thumb.imageUrl;
      });
    }
    
    // Combine all data
    const friendsWithThumbnails = friendsResponse.data.data.map(friend => ({
      id: friend.id,
      name: userDetails[friend.id]?.name || 'Unknown',
      displayName: userDetails[friend.id]?.displayName || 'Unknown',
      isOnline: friend.isOnline || false,
      thumbnail: thumbnails[friend.id] || 'https://via.placeholder.com/150'
    }));
    
    res.json({ data: friendsWithThumbnails });
  } catch (error) {
    if (!isProduction) console.error('Error fetching friends:', error.message);
    res.status(500).json({ error: 'Failed to fetch friends list' });
  }
});

// Unfriend a user
app.post('/api/unfriend', validateCookie, async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  try {
    // Get CSRF token
    const csrfToken = await getCsrfToken(req.robloxCookie);
    
    // Unfriend the user
    const response = await axios.post(
      `https://friends.roblox.com/v1/users/${userId}/unfriend`,
      {},
      {
        headers: {
          'Cookie': `.ROBLOSECURITY=${req.robloxCookie}`,
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json({ success: true, message: 'Friend removed successfully' });
  } catch (error) {
    if (!isProduction) console.error('Error unfriending user:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to unfriend user'
    });
  }
});

// Batch unfriend
app.post('/api/batch-unfriend', validateCookie, async (req, res) => {
  const { userIds } = req.body;
  
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: 'User IDs array is required' });
  }
  
  try {
    // Get CSRF token once for all requests
    const csrfToken = await getCsrfToken(req.robloxCookie);
    
    const results = [];
    
    // Process unfriend requests sequentially to avoid rate limiting
    for (const userId of userIds) {
      try {
        await axios.post(
          `https://friends.roblox.com/v1/users/${userId}/unfriend`,
          {},
          {
            headers: {
              'Cookie': `.ROBLOSECURITY=${req.robloxCookie}`,
              'X-CSRF-TOKEN': csrfToken,
              'Content-Type': 'application/json'
            }
          }
        );
        results.push({ userId, success: true });
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        results.push({ 
          userId, 
          success: false, 
          error: error.response?.data || error.message 
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    res.json({ 
      success: true, 
      results,
      summary: `${successCount}/${userIds.length} friends removed successfully`
    });
  } catch (error) {
    if (!isProduction) console.error('Error in batch unfriend:', error.message);
    res.status(500).json({ error: 'Failed to process batch unfriend' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Allyst server running on port ${PORT}`);
  console.log(`📝 Environment: ${isProduction ? 'Production' : 'Development'}`);
});
