# Allyst!
> A powerful, secure web application for managing your Roblox friends efficiently.


## Overview

Allyst is a modern friend management tool designed for Roblox users who need to efficiently organize their friend lists. Built with security and user experience as top priorities, it provides a clean interface for batch operations while keeping your data safe.

## Key Features

### Friend Management
- **Batch Operations** - Remove multiple friends simultaneously
- **Smart Selection** - Flexible selection with select all/deselect all
- **Search & Filter** - Quickly find specific friends
- **Sort Options** - Organize by username or display name

### User Experience
- **Profile Previews** - View friend profiles before taking action
- **Theme Support** - Dark and light mode with smooth transitions
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Intuitive Interface** - Clean, modern UI with smooth animations

### Security & Privacy
- **Local Storage** - Your cookie never leaves your device
- **No Data Collection** - We don't store or track any user data
- **Secure Headers** - Industry-standard security practices
- **Direct API Calls** - All requests go directly to Roblox

## Technology

Built with modern web technologies for optimal performance:

- **Frontend**: React 18, Vite
- **Backend**: Node.js, Express
- **Styling**: Custom CSS with CSS Variables
- **API Integration**: Official Roblox APIs

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   This will start both the backend (port 5000) and frontend (port 3000)

4. **Build for Production**
   ```bash
   npm run build
   ```

## Usage Guide

### Getting Your Roblox Cookie

1. Open [Roblox.com](https://www.roblox.com) in your browser
2. Press `F12` to open Developer Tools
3. Navigate to **Application** → **Cookies** → `https://www.roblox.com`
4. Find `.ROBLOSECURITY` and copy its value
5. Paste into Allyst's login screen

### Managing Friends

1. **Login** - Enter your Roblox cookie to authenticate
2. **Browse** - View all your friends with their avatars and usernames
3. **Search** - Use the search bar to find specific friends
4. **Select** - Click checkboxes to select friends for removal
5. **Remove** - Confirm and remove selected friends
6. **Profile** - Click "View Profile" to open friend's Roblox page

## Security

Your security is our priority. Please read [SECURITY.md](SECURITY.md) for:
- How we protect your data
- Cookie security best practices
- Reporting vulnerabilities
- Compliance information

**Important:** Never share your Roblox cookie with anyone. It's equivalent to your password.

## API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user-info` | Get authenticated user information |
| POST | `/api/friends` | Retrieve friends list with details |
| POST | `/api/unfriend` | Remove a single friend |
| POST | `/api/batch-unfriend` | Remove multiple friends |
| GET | `/health` | Server health check |

### Authentication

All API endpoints (except `/health`) require the `X-Roblox-Cookie` header with your `.ROBLOSECURITY` cookie.

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under a custom license with restrictions. See [LICENSE](LICENSE) for details.

**TL;DR:** Free for personal use, commercial use requires permission.

## ⚠️ Important Disclaimers

### Security Warning
- **Your Roblox cookie is equivalent to your password**
- Never share your cookie with anyone
- Use this tool at your own risk
- We are not responsible for any account actions taken by Roblox

### Legal Notice
- This is an **unofficial tool** and is **not affiliated with Roblox Corporation**
- Use in accordance with Roblox Terms of Service
- We make no warranties about the safety or legality of this tool
- By using this tool, you accept all risks

### Privacy & Data
- Your cookie is stored **locally in your browser only**
- We **never** send your cookie to our servers
- All API requests go **directly to Roblox**
- We do not collect, store, or transmit your personal data
- Open-source code available for verification

### Recommendations
- ✅ Use on a trusted device
- ✅ Log out when finished
- ✅ Review the open-source code before use
- ❌ Don't use on public/shared computers
- ❌ Don't share your cookie with anyone

## Documentation

- 🔒 [Security](SECURITY.md)
- 📝 [Contributing](CONTRIBUTING.md)
- 📋 [License](LICENSE)

---

**Made for Roblox users**
