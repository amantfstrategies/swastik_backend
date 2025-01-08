const jwt = require('jsonwebtoken');
const User = require('../models/User'); 


exports.protect = async (req, res, next) => {

  const token = req.headers['authorization']?.split(' ')[1]; 
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');
    
    next();
  } catch (error) {
    console.error("not authorized", error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};



// const jwt = require('jsonwebtoken');
// const User = require('../models/User'); 

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// exports.protect = async (req, res, next) => {
//     const token = req.cookies.authToken;
//     if (!token) {
//       return res.status(401).json({ message: 'Not authorized, no token' });
//     }
  
//     try {
//       const decoded = jwt.verify(token, JWT_SECRET);
//       req.user = await User.findById(decoded.id).select('-password');
//       next();
//     } catch (error) {
//       console.error("not authorized", error);
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   };