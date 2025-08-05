import express from 'express';
import { addToWishlist, removeFromWishlist , getWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middlewares/authMiddelware.js';

const router = express.Router();

router.route('/').post(protect, addToWishlist).get(protect, getWishlist);
router.route('/:productId').delete(protect, removeFromWishlist);




export default router;
