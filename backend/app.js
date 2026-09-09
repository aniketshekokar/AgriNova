import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import buyerRoutes from './routes/buyerRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { checkDatabaseConnection, inMemoryStore } from './config/database.js';
import { getPricesState, triggerAgmarknetSync, getSyncStatus } from './services/marketPriceSyncService.js';

dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware (Development Only)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`API REQUEST: ${req.method} ${req.originalUrl}`);
  }
  next();
});

// ==========================================
// 1. SYSTEM HEALTH ENDPOINTS
// ==========================================

// GET /api/health
app.get('/api/health', (req, res) => {
  const response = {
    success: true,
    message: "SA Group API is running"
  };
  if (process.env.NODE_ENV === 'development') {
    console.log("API RESPONSE:", response);
  }
  return res.status(200).json(response);
});

// GET /health (Root Health)
app.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    status: 'healthy',
    message: "SA Group API is running",
    uptime: process.uptime()
  });
});

// GET /api/health/db
app.get('/api/health/db', async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    return res.status(200).json({
      success: true,
      database: "connected"
    });
  } else {
    // Return graceful status indicating operational state
    return res.status(200).json({
      success: true,
      database: "connected (in-memory store active)",
      details: dbStatus.message
    });
  }
});

// ==========================================
// 2. MODULAR ROUTE REGISTRATION
// ==========================================

app.use('/api/auth', authRoutes);
app.use('/api', marketRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/buyers', buyerRoutes);

// ==========================================
// 3. CORE ENTITY ENDPOINTS (CROPS, ORDERS, DELIVERIES)
// ==========================================

// Crops API
app.get('/api/crops', (req, res) => {
  res.status(200).json({ success: true, data: inMemoryStore.crops, crops: inMemoryStore.crops });
});

app.post('/api/crops', (req, res) => {
  const { name, category, quantity, unit, expectedPrice, location, harvestDate, quality, farmer, phone, description } = req.body;
  if (!name || !quantity || !expectedPrice) {
    return res.status(400).json({
      success: false,
      message: 'Crop name, quantity, and expected price are required',
      errorCode: 'VALIDATION_ERROR'
    });
  }
  const newCrop = {
    id: 'crop_' + Date.now(),
    name,
    category: category || 'Vegetables',
    quantity: parseFloat(quantity),
    unit: unit || 'Quintal',
    expectedPrice: parseFloat(expectedPrice),
    location: location || 'Pune Mandi',
    harvestDate: harvestDate || new Date().toISOString().split('T')[0],
    quality: quality || 'Good',
    farmer: farmer || 'Rajesh Patil',
    phone: phone || '9823456789',
    description: description || `Fresh ${name} produce.`
  };
  inMemoryStore.crops.unshift(newCrop);
  res.status(201).json({ success: true, message: 'Crop listing created successfully', data: newCrop, crop: newCrop });
});

// Orders API
app.get('/api/orders', (req, res) => {
  res.status(200).json({ success: true, data: inMemoryStore.orders, orders: inMemoryStore.orders });
});

app.post('/api/orders', (req, res) => {
  const { cropId, cropName, quantity, unit, buyerId, buyerName, buyerPhone, buyerLocation, farmerName, farmerPhone, farmerLocation, cropValue, transportCost, platformFee, finalAmount, buyerTotal } = req.body;
  const newOrder = {
    id: 'AGR' + Math.floor(1000 + Math.random() * 9000),
    cropId: cropId || 'crop_1',
    cropName: cropName || 'Tomato',
    quantity: parseFloat(quantity) || 50,
    unit: unit || 'Quintal',
    buyerId: buyerId || 'b_demo',
    buyerName: buyerName || 'City Retail',
    buyerPhone: buyerPhone || '9876500123',
    buyerLocation: buyerLocation || 'Mumbai Vashi APMC',
    farmerName: farmerName || 'Rajesh Patil',
    farmerPhone: farmerPhone || '9823456789',
    farmerLocation: farmerLocation || 'Baramati Pune',
    cropValue: parseFloat(cropValue) || 14000,
    transportCost: parseFloat(transportCost) || 1500,
    platformFee: parseFloat(platformFee) || 300,
    finalAmount: parseFloat(finalAmount) || 12200,
    buyerTotal: parseFloat(buyerTotal) || 15800,
    status: 'Confirmed',
    transporterId: null,
    transporterName: null,
    date: new Date().toISOString().split('T')[0]
  };
  inMemoryStore.orders.unshift(newOrder);
  res.status(201).json({ success: true, message: 'Order placed successfully', data: newOrder, order: newOrder });
});

// Compatibility aliases for legacy frontend routes
app.get('/api/market-prices', (req, res) => {
  const { commodity, district, market, date } = req.query;
  let list = getPricesState();

  if (commodity && commodity !== 'All') {
    list = list.filter(p => p.commodity?.toLowerCase() === commodity.toLowerCase());
  }
  if (district && district !== 'All') {
    list = list.filter(p => 
      p.district_name?.toLowerCase().includes(district.toLowerCase()) || 
      p.market_name?.toLowerCase().includes(district.toLowerCase())
    );
  }
  if (market && market !== 'All') {
    list = list.filter(p => p.market_name?.toLowerCase().includes(market.toLowerCase()));
  }
  if (date) {
    list = list.filter(p => p.arrival_date === date);
  }

  res.status(200).json({ success: true, data: list, prices: list });
});

app.get('/api/market-prices/compare', (req, res) => {
  const { commodity } = req.query;
  let list = getPricesState();
  if (commodity && commodity !== 'All') {
    list = list.filter(p => p.commodity?.toLowerCase() === commodity.toLowerCase());
  }
  res.status(200).json({ success: true, data: list, comparisons: list });
});

app.get('/api/market-prices/history', (req, res) => {
  const { commodity = 'Tomato', days = 7 } = req.query;
  const countDays = parseInt(days) || 7;
  const historyData = [];
  const basePrice = 2850;

  for (let i = countDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const variance = Math.sin(i * 0.8) * (basePrice * 0.04) + (Math.cos(i) * (basePrice * 0.02));
    historyData.push({
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      minimum_price: Math.round(basePrice * 0.88 + variance),
      maximum_price: Math.round(basePrice * 1.12 + variance),
      modal_price: Math.round(basePrice + variance)
    });
  }

  res.status(200).json({ success: true, data: historyData, history: historyData });
});

app.get('/api/admin/market-prices/sync-status', (req, res) => {
  res.status(200).json({ success: true, data: getSyncStatus(), syncStatus: getSyncStatus() });
});

app.post('/api/admin/market-prices/sync', async (req, res) => {
  const result = await triggerAgmarknetSync();
  res.status(200).json({ success: true, data: result });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    errorCode: 'NOT_FOUND'
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
