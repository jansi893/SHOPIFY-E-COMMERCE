import express from 'express';
import { getNotifications, markAsRead  } from '../controllers/NotificationController.js';
import { protect } from '../middlewares/authMiddelware.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/mark-as-read', protect, markAsRead);

export default router;