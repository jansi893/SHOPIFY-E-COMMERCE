import express from 'express';
import { getAllOrders , getUserOrders , getOrderById ,markDelivered } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middlewares/authMiddelware.js';

const router = express.Router();

router.get('/my-orders', protect, getUserOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/deliver', protect, adminOnly, markDelivered);


export default router;