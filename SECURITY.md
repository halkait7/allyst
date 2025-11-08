# Security Policy

## Overview

Allyst takes security seriously. This document outlines our security practices and how to report vulnerabilities.

## Security Features

### 1. **Cookie Storage**
- Roblox cookies are stored locally in the browser using `localStorage`
- Cookies are NEVER sent to any third-party servers
- Cookies are only used for direct Roblox API authentication
- Users can clear their cookie at any time by logging out

### 2. **API Security**
- All API endpoints require authentication via Roblox cookie
- Request payload size is limited to 10KB to prevent DoS attacks
- CSRF tokens are obtained and validated for state-changing operations
- Rate limiting is implemented through sequential API calls

### 3. **HTTP Security Headers**
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-XSS-Protection: 1; mode=block` - Enables XSS filtering
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts access to browser features
- `Strict-Transport-Security` - Enforces HTTPS in production

### 4. **Data Privacy**
- No user data is stored on our servers
- Privacy-focused analytics (Vercel Analytics) for performance monitoring only
- No third-party integrations except Roblox API and Vercel Analytics
- All data processing happens client-side or in real-time

### 5. **Input Validation**
- All user inputs are validated and sanitized
- API responses are validated before processing
- Error messages don't expose sensitive information in production

## Best Practices for Users

### Protecting Your Cookie

1. **Never share your Roblox cookie** with anyone
2. **Use the app on trusted devices only**
3. **Clear your cookie** when using shared/public computers
4. **Log out** when you're done using the app
5. **Change your Roblox password** if you suspect your cookie was compromised

### Cookie Security Tips

- Your `.ROBLOSECURITY` cookie is equivalent to your password
- If someone gets your cookie, they can access your account
- Cookies expire after a period of inactivity
- Roblox may invalidate cookies if suspicious activity is detected

## Reporting Security Vulnerabilities

If you discover a security vulnerability:

1. **DO NOT** exploit the vulnerability
2. Use the application responsibly
3. Consider contributing a fix if you're able

## Security Updates

- Security patches are released as soon as possible
- Users are notified of critical security updates
- We maintain a changelog of security-related changes

## Compliance

### Data Protection
- We don't collect or store personal data
- We comply with GDPR and CCPA principles
- Users have full control over their data

### Roblox Terms of Service
- This app complies with Roblox's Terms of Service
- We use official Roblox APIs only
- No automation or botting features
- No account sharing or unauthorized access

## Disclaimer

This application is provided "as is" without warranty. Users are responsible for:
- Keeping their Roblox credentials secure
- Using the app in accordance with Roblox ToS
- Any actions taken through the app

## Security Checklist for Deployment

- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS in production
- [ ] Set strong CORS policies
- [ ] Enable rate limiting
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated
- [ ] Regular security audits
- [ ] Backup and disaster recovery plan

---

**Last Updated:** 2025-01-09  
**Version:** 1.0.0
