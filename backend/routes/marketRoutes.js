import express from 'express';
import { getMarkets, getMarketById, getPrices, getPriceHistory, syncPrices, getSyncStatusHandler } from '../controllers/marketController.js';

const router = express.Router();

// Markets
router.get('/markets', getMarkets);
router.get('/markets/:id', getMarketById);

// Prices
router.get('/prices', getPrices);
router.get('/prices/history', getPriceHistory);
router.post('/prices/sync', syncPrices);
router.get('/prices/sync-status', getSyncStatusHandler);

export default router;
