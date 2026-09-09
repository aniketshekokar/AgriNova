import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { checkDatabaseConnection } from './config/database.js';

const PORT = process.env.PORT || 5000;

// Create HTTP Server & Bind Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

// Real-time GPS Location & Delivery Tracking Cache
const deliveryLocationsCache = {
  'AGR1024': {
    latitude: 18.5204,
    longitude: 73.8567,
    accuracy: 10,
    timestamp: new Date().toISOString()
  }
};

// Delivery status endpoints for live tracking
app.get('/api/deliveries/:orderId', (req, res) => {
  const { orderId } = req.params;
  res.json({
    success: true,
    data: {
      id: orderId,
      status: 'In Transit',
      location: deliveryLocationsCache[orderId] || { latitude: 18.5204, longitude: 73.8567 }
    }
  });
});

app.get('/api/deliveries/:orderId/location', (req, res) => {
  const { orderId } = req.params;
  const loc = deliveryLocationsCache[orderId] || { latitude: 18.5204, longitude: 73.8567 };
  res.json({ success: true, location: loc, data: loc });
});

app.post('/api/deliveries/:orderId/location', (req, res) => {
  const { orderId } = req.params;
  const { latitude, longitude, accuracy } = req.body;
  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, message: 'Latitude and Longitude required', errorCode: 'VALIDATION_ERROR' });
  }

  deliveryLocationsCache[orderId] = {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    accuracy: accuracy || 10,
    timestamp: new Date().toISOString()
  };

  io.to(`delivery_${orderId}`).emit('delivery:location', {
    orderId,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    accuracy: accuracy || 10,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, message: 'Transporter coordinates updated' });
});

app.patch('/api/deliveries/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  io.to(`delivery_${orderId}`).emit('delivery:status', { orderId, status });
  res.json({ success: true, message: 'Delivery status updated' });
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Socket] Client connected: ${socket.id}`);
  }

  socket.on('join-delivery', (orderId) => {
    socket.join(`delivery_${orderId}`);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Socket] Client ${socket.id} joined tracking room: delivery_${orderId}`);
    }
  });

  socket.on('delivery:start', (data) => {
    io.to(`delivery_${data.orderId}`).emit('delivery:status', { status: 'Pickup Started', timestamp: new Date() });
  });

  socket.on('delivery:location', (data) => {
    if (data && data.orderId) {
      deliveryLocationsCache[data.orderId] = {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        accuracy: data.accuracy || 10,
        timestamp: new Date().toISOString()
      };
      io.to(`delivery_${data.orderId}`).emit('delivery:location', data);
    }
  });

  socket.on('delivery:status', (data) => {
    io.to(`delivery_${data.orderId}`).emit('delivery:status', data);
  });

  socket.on('delivery:complete', (data) => {
    io.to(`delivery_${data.orderId}`).emit('delivery:status', { status: 'Delivered', timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    }
  });
});

server.listen(PORT, async () => {
  console.log(`==================================================`);
  console.log(`🚀 SA Group Backend API Server listening on port ${PORT}`);
  console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
  console.log(`📡 Real-time Socket.IO GPS Tracking & Escrow online`);
  
  // Database status check
  const dbStatus = await checkDatabaseConnection();
  console.log(`🗄️  Database Status: ${dbStatus.connected ? 'Connected (PostgreSQL)' : 'Active (In-Memory Fallback Store)'}`);
  console.log(`==================================================`);
});

export { app, server, io };
