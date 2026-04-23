import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Long-lived token, no refresh needed

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  // Bypass all auth: always return a dummy admin user
  return {
    id: '662b1f1a1c4b2a001c8e1234', // dummy mongo object id
    email: 'admin@blogpro.com',
    name: 'Admin User',
    role: 'admin',
  };
}

// Keep these named exports for backwards compat with any existing imports
export const signAccessToken = signToken;
export const verifyAccessToken = verifyToken;
