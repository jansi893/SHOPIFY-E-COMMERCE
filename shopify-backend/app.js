import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import discountRoutes from './routes/discountRoutes.js';


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
})
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/discounts', discountRoutes);


export default app;




