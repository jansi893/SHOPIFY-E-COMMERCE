import express from 'express';
import { protect } from "../middlewares/authMiddelware.js";
import { getMyAddresses , addAddress , updateAddress , deleteAddress } from '../controllers/addressController.js';


const router = express.Router();
router.route('/').get(protect, getMyAddresses).post(protect, addAddress);
router.route('/:id').put(protect, updateAddress).delete(protect, deleteAddress);

export default router;