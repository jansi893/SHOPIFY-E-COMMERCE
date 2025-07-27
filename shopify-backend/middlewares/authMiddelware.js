import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token)  return res.status(401).json({ message: 'Unauthorized' });
    
   try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decode.id).select('-password');
    next();
   } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }   
    
};

export const adminOnly = (req, res, next) => {
if (req.user?.role !== 'admin') {
   return res.status(403).json({ message: 'Admin access only' });
  }
    next();
}

