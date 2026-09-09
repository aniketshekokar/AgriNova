import jwt from 'jsonwebtoken';
import { inMemoryStore } from '../config/database.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required / प्रमाणीकरण आवश्यक है',
        errorCode: 'UNAUTHORIZED'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'agrinova_secure_jwt_token_secret_seed_2026';

    const decoded = jwt.verify(token, secret);
    
    // Find user in store or database
    const user = inMemoryStore.users.find(u => u.id === decoded.id || u.email === decoded.email);
    if (!user && !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists or session has expired',
        errorCode: 'USER_NOT_FOUND'
      });
    }

    req.user = user ? {
      id: user.id,
      username: user.full_name || user.username,
      email: user.email,
      phone: user.mobile_number || user.phone,
      role: user.role
    } : decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.name === 'TokenExpiredError' ? 'Authentication token expired' : 'Invalid authentication token',
      errorCode: 'INVALID_TOKEN'
    });
  }
};

export default authMiddleware;
