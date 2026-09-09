import pg from 'pg';
import dotenv from 'dotenv';
import { getPricesState } from '../services/marketPriceSyncService.js';

dotenv.config();

const { Pool } = pg;

let pool = null;
let isDbConnected = false;
let dbConnectionError = null;

// Initialize PostgreSQL pool if DATABASE_URL or credentials provided
try {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000,
      max: 10
    });

    pool.on('error', (err) => {
      console.error('[Database Pool Error]:', err.message);
      isDbConnected = false;
      dbConnectionError = err.message;
    });
  }
} catch (err) {
  console.warn('[Database Init Warning]: Failed to initialize PG pool, using local operational store.', err.message);
}

// In-Memory Relational Operational Store (Fallback / Seeded)
export const inMemoryStore = {
  users: [
    {
      id: 'usr_farmer1',
      full_name: 'Rajesh Patil',
      username: 'Rajesh Patil',
      email: 'rajesh@agrinova.in',
      mobile_number: '9823456789',
      phone: '9823456789',
      password_hash: '$2a$10$X8mD4c6w2b9U1.8rAdfGk.qC2xR5qg.0pQoB9Mh4Bf8j8L8c4r5e',
      role: 'FARMER',
      preferred_language: 'en',
      is_verified: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_buyer1',
      full_name: 'Amit Sharma',
      username: 'Amit Sharma',
      businessName: 'Grand Heritage Palace Hotels',
      email: 'grocer@citygrocer.in',
      mobile_number: '9876500123',
      phone: '9876500123',
      password_hash: '$2a$10$X8mD4c6w2b9U1.8rAdfGk.qC2xR5qg.0pQoB9Mh4Bf8j8L8c4r5e',
      role: 'BUYER',
      preferred_language: 'en',
      is_verified: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_transporter1',
      full_name: 'Satnam Singh',
      username: 'driver',
      email: 'driver@agrinova.in',
      mobile_number: '9811223344',
      phone: '9811223344',
      password_hash: '$2a$10$X8mD4c6w2b9U1.8rAdfGk.qC2xR5qg.0pQoB9Mh4Bf8j8L8c4r5e',
      role: 'TRANSPORTER',
      preferred_language: 'en',
      is_verified: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_admin1',
      full_name: 'SA Group Admin',
      username: 'admin',
      email: 'admin@agrinova.in',
      mobile_number: '9999999999',
      phone: '9999999999',
      password_hash: '$2a$10$X8mD4c6w2b9U1.8rAdfGk.qC2xR5qg.0pQoB9Mh4Bf8j8L8c4r5e',
      role: 'ADMIN',
      preferred_language: 'en',
      is_verified: true,
      created_at: new Date().toISOString()
    }
  ],
  farmers: [
    {
      id: 'f_1',
      user_id: 'usr_farmer1',
      name: 'Rajesh Patil',
      phone: '9823456789',
      district: 'Pune',
      taluka: 'Baramati',
      village: 'Malegaon',
      mainCrop: 'Tomato',
      farmSize: '5.5 Acres',
      status: 'Active',
      verification: 'VERIFIED'
    },
    {
      id: 'f_2',
      user_id: 'usr_farmer2',
      name: 'Sanjay Deshmukh',
      phone: '9845612307',
      district: 'Nashik',
      taluka: 'Niphad',
      village: 'Pimpalgaon',
      mainCrop: 'Onion',
      farmSize: '10.0 Acres',
      status: 'Active',
      verification: 'VERIFIED'
    }
  ],
  buyers: [
    {
      id: 'b_1',
      user_id: 'usr_buyer1',
      businessName: 'ABC Foods',
      businessType: 'Food Processing Company',
      contactPerson: 'Amit Sharma',
      email: 'amit@abcfoods.com',
      mobile: '9876500123',
      state: 'Maharashtra',
      district: 'Pune',
      taluka: 'Haveli',
      city: 'Pune',
      address: 'Plot 42, Hadapsar Industrial Estate',
      pincode: '411028',
      gstNumber: '27AABCA1234F1Z5',
      verificationStatus: 'VERIFIED',
      created_at: new Date().toISOString()
    },
    {
      id: 'b_2',
      user_id: 'usr_buyer2',
      businessName: 'Vashi Wholesale APMC',
      businessType: 'Wholesaler',
      contactPerson: 'Vijay Kadam',
      email: 'vijay@vashitraders.in',
      mobile: '9812345678',
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
      taluka: 'Navi Mumbai',
      city: 'Navi Mumbai',
      address: 'Sector 19, APMC Market Yard, Vashi',
      pincode: '400703',
      gstNumber: '27AABCV5678G2Z1',
      verificationStatus: 'VERIFIED',
      created_at: new Date().toISOString()
    }
  ],
  crops: [
    {
      id: 'crop_1',
      name: 'Tomato',
      category: 'Vegetables',
      quantity: 45,
      unit: 'Quintal',
      expectedPrice: 2800,
      location: 'Nashik Market',
      harvestDate: '2026-08-15',
      quality: 'Good',
      farmer: 'Rajesh Patil',
      phone: '9823456789',
      description: 'Fresh field-picked hybrid tomatoes, graded and sorted.'
    },
    {
      id: 'crop_2',
      name: 'Onion',
      category: 'Vegetables',
      quantity: 120,
      unit: 'Quintal',
      expectedPrice: 2400,
      location: 'Pune Mandi',
      harvestDate: '2026-08-14',
      quality: 'Good',
      farmer: 'Sanjay Deshmukh',
      phone: '9845612307',
      description: 'Nashik red onions, medium size, well cured.'
    }
  ],
  orders: [
    {
      id: 'AGR1024',
      cropId: 'crop_1',
      cropName: 'Tomato',
      quantity: 45,
      unit: 'Quintal',
      buyerId: 'b_1',
      buyerName: 'ABC Foods',
      buyerPhone: '9876500123',
      buyerLocation: 'Mumbai Vashi APMC',
      farmerName: 'Rajesh Patil',
      farmerPhone: '9823456789',
      farmerLocation: 'Baramati Pune',
      cropValue: 126000,
      transportCost: 6500,
      platformFee: 1200,
      finalAmount: 118300,
      buyerTotal: 133700,
      status: 'In Transit',
      transporterId: 'TR001',
      transporterName: 'Ramesh Kumar',
      vehicleNumber: 'MH-12-QW-4567',
      vehicleType: 'Tata Ace',
      distance: 165,
      pickupDate: '2026-08-11'
    }
  ]
};

// Check active database connection
export const checkDatabaseConnection = async () => {
  if (!pool) {
    return {
      connected: false,
      database: 'disconnected',
      message: 'PostgreSQL pool not configured or DATABASE_URL unavailable'
    };
  }

  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    isDbConnected = true;
    dbConnectionError = null;
    return {
      connected: true,
      database: 'connected',
      message: 'PostgreSQL database connected successfully'
    };
  } catch (err) {
    isDbConnected = false;
    dbConnectionError = err.message;
    return {
      connected: false,
      database: 'disconnected',
      message: err.message
    };
  }
};

// Unified Database Query Executor
export const dbQuery = async (text, params = []) => {
  if (pool && isDbConnected) {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      if (process.env.NODE_ENV === 'development') {
        console.log('[DB Query]', { text, duration, rows: res.rowCount });
      }
      return res;
    } catch (err) {
      console.error('[DB Query Error]', err.message);
      throw err;
    }
  }
  return null;
};

export default {
  pool,
  checkDatabaseConnection,
  dbQuery,
  inMemoryStore
};
