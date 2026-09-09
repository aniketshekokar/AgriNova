import express from 'express';
import { getFarmers, getFarmerById, createFarmerListing, updateFarmerListing, deleteFarmerListing } from '../controllers/farmerController.js';

const router = express.Router();

router.get('/', getFarmers);
router.get('/:id', getFarmerById);
router.post('/', createFarmerListing);
router.put('/:id', updateFarmerListing);
router.delete('/:id', deleteFarmerListing);

export default router;
