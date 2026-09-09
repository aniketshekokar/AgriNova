import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { inMemoryStore, dbQuery } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'agrinova_secure_jwt_token_secret_seed_2026';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// 1. User Registration (POST /api/auth/register)
export const register = async (req, res, next) => {
  try {
    const { username, full_name, email, phone, mobile_number, password, role } = req.body;
    const name = full_name || username;
    const mobile = mobile_number || phone;
    const userRole = (role || 'FARMER').toUpperCase();

    if (!name || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, Mobile Number, and Password are required / नाम, मोबाइल नंबर और पासवर्ड आवश्यक हैं।',
        errorCode: 'VALIDATION_ERROR'
      });
    }

    // Check if mobile or email already exists
    const existingUser = inMemoryStore.users.find(
      u => u.mobile_number === mobile || (email && u.email?.toLowerCase() === email.toLowerCase())
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this mobile number or email already exists.',
        errorCode: 'USER_EXISTS'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const id = 'usr_' + Date.now();

    const newUser = {
      id,
      full_name: name,
      username: name,
      mobile_number: mobile,
      phone: mobile,
      email: email || `${mobile}@agrinova.in`,
      password_hash,
      role: userRole,
      preferred_language: 'en',
      is_verified: true,
      created_at: new Date().toISOString()
    };

    inMemoryStore.users.push(newUser);

    // If farmer, register into farmers store
    if (userRole === 'FARMER') {
      inMemoryStore.farmers.push({
        id: 'f_' + Date.now(),
        user_id: id,
        name: name,
        phone: mobile,
        district: req.body.district || 'Pune',
        taluka: req.body.taluka || 'Baramati',
        village: req.body.village || 'Malegaon',
        mainCrop: req.body.mainCrop || 'Tomato',
        farmSize: req.body.farmSize || '5.0 Acres',
        status: 'Active',
        verification: 'VERIFIED'
      });
    }

    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    const safeUser = {
      id: newUser.id,
      username: newUser.full_name,
      email: newUser.email,
      phone: newUser.mobile_number,
      role: newUser.role,
      verified: true
    };

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully / खाता सफलतापूर्वक पंजीकृत किया गया।',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. User Login (POST /api/auth/login)
export const login = async (req, res, next) => {
  try {
    const { email, phone, phoneOrEmail, username, password, role } = req.body;
    const identifier = email || phone || phoneOrEmail || username;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username / Mobile and Password are required / उपयोगकर्ता नाम और पासवर्ड आवश्यक हैं।',
        errorCode: 'MISSING_CREDENTIALS'
      });
    }

    // List of accepted demo fast-fill & testing passwords
    const isDemoPassword = ['farmer123', 'buyer123', 'driver123', 'admin123', 'password123', 'admin', '123456', '1234', 'agritrade123'].includes(password);

    // Special quick developer / demo convenience accounts
    let targetUser = inMemoryStore.users.find(
      u => u.email?.toLowerCase() === identifier.toLowerCase() ||
           u.mobile_number === identifier ||
           u.phone === identifier ||
           u.username?.toLowerCase() === identifier.toLowerCase()
    );

    let isMatch = false;

    if (targetUser) {
      isMatch = isDemoPassword;
      if (!isMatch && targetUser.password_hash) {
        try {
          isMatch = await bcrypt.compare(password, targetUser.password_hash);
        } catch (e) {
          isMatch = false;
        }
      }
      // If client explicitly requested a specific role for demo fast fill, respect it
      if (role && ['FARMER', 'BUYER', 'TRANSPORTER', 'ADMIN', 'AGRITRADE'].includes(role.toUpperCase())) {
        targetUser.role = role.toUpperCase();
      }
    } else {
      // Auto-provision demo role account for seamless testing
      let assignedRole = (role || 'FARMER').toUpperCase();
      let displayName = identifier.split('@')[0];

      if (identifier.toLowerCase() === 'admin' || identifier.toLowerCase().includes('admin')) {
        assignedRole = 'ADMIN';
        displayName = 'SA Group Admin';
      } else if (identifier.toLowerCase() === 'driver' || identifier.toLowerCase().includes('transporter')) {
        assignedRole = 'TRANSPORTER';
        displayName = 'Satnam Singh (Transporter)';
      } else if (identifier.toLowerCase() === 'buyer' || identifier.toLowerCase().includes('buyer') || identifier.includes('grocer') || identifier.includes('hotel')) {
        assignedRole = 'BUYER';
        displayName = 'Grand Heritage Palace Hotels';
      } else if (assignedRole === 'FARMER') {
        displayName = 'Rajesh Patil';
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      const newId = 'usr_' + Date.now();

      targetUser = {
        id: newId,
        full_name: displayName,
        username: displayName,
        mobile_number: /^\d+$/.test(identifier) ? identifier : '9823456789',
        phone: /^\d+$/.test(identifier) ? identifier : '9823456789',
        email: identifier.includes('@') ? identifier : `${identifier}@agrinova.in`,
        password_hash,
        role: assignedRole,
        preferred_language: 'en',
        is_verified: true,
        created_at: new Date().toISOString()
      };

      inMemoryStore.users.push(targetUser);
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials provided / अमान्य साख प्रदान की गई।',
        errorCode: 'INVALID_CREDENTIALS'
      });
    }

    const token = generateToken({ id: targetUser.id, email: targetUser.email, role: targetUser.role });

    const safeUser = {
      id: targetUser.id,
      username: targetUser.full_name || targetUser.username,
      email: targetUser.email,
      phone: targetUser.mobile_number || targetUser.phone,
      role: targetUser.role,
      verified: true
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful / लॉगिन सफल रहा।',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// 3. Current User Profile (GET /api/auth/me)
export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
        errorCode: 'UNAUTHORIZED'
      });
    }

    const user = inMemoryStore.users.find(u => u.id === req.user.id);
    const safeUser = user ? {
      id: user.id,
      username: user.full_name || user.username,
      email: user.email,
      phone: user.mobile_number || user.phone,
      role: user.role,
      verified: true
    } : req.user;

    return res.status(200).json({
      success: true,
      message: 'User profile retrieved',
      data: { user: safeUser }
    });
  } catch (error) {
    next(error);
  }
};

// 4. Logout (POST /api/auth/logout)
export const logout = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully / सफलतापूर्वक लॉगआउट किया गया।'
    });
  } catch (error) {
    next(error);
  }
};
