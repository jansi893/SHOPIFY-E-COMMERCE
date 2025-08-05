import express from 'express';
import {protect} from "../middlewares/authMiddelware.js";
import { createPaypalOrder, executePayPalPayment } from '../controllers/paymentController.js';


const router = express.Router();

router.post('/create', protect, createPaypalOrder);
router.get('/execute', protect, executePayPalPayment);

export default router;