const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    'FATAL: JWT_SECRET is missing or too short. Set a 32+ character secret in .env (see .env.example). Refusing to start with an insecure fallback.'
  );
}

const TOKEN_TTL = process.env.JWT_TTL || '8h';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tv: user.token_version || 0
    },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL, issuer: 'jjaf-api', audience: 'jjaf-admin' }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access denied: Authentication token required.' });
  }

  jwt.verify(token, JWT_SECRET, { issuer: 'jjaf-api', audience: 'jjaf-admin' }, (err, payload) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired session token.' });
    }
    req.user = payload;
    next();
  });
}

// Role-based authorization. Usage: requireRole('superadmin')
function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden: insufficient privileges.' });
    }
    next();
  };
}

// Minimum professional password policy for admin accounts
function validateNewPassword(pw) {
  if (!pw || typeof pw !== 'string') return 'New password is required.';
  if (pw.length < 10) return 'New password must be at least 10 characters.';
  if (pw.length > 128) return 'New password must be shorter than 128 characters.';
  if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) {
    return 'New password must include upper-case, lower-case and a number.';
  }
  return null;
}

module.exports = {
  generateToken,
  authenticateToken,
  requireRole,
  validateNewPassword
};
