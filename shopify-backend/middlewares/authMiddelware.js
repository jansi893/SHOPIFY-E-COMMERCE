import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {

   try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({msg: 'No token provided'});
        }
        const token = authHeader.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
   const user = await User.findById(decode.id).select('-password');
   if(!user){
    return res.status(401).json({msg: 'User not found'});
   }

   req.user = user;
    next();
   } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }   
    
};

export const adminOnly = (req, res, next) => {
if (req.user || req.user.role !== 'admin') {
   return res.status(403).json({ message: 'Admin access only' });
  }
    next();
}

