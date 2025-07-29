import express from 'express';
import { addToCart , getCart , updateCartItem , removeFromCart } from '../controllers/cartController.js';

import { protect } from '../middlewares/authMiddelware.js';

const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/', protect, updateCartItem);
router.delete('/:productId', protect, removeFromCart);

export default router;