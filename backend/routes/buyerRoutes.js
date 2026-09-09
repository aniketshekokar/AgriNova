import express from 'express';
import { getBuyers, getBuyerById, registerBuyer, updateBuyer } from '../controllers/buyerController.js';

const router = express.Router();

router.get('/', getBuyers);
router.get('/:id', getBuyerById);
router.post('/', registerBuyer);
router.put('/:id', updateBuyer);

export default router;
