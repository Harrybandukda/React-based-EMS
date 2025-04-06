require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticate = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { user: decoded };
      } catch (err) {
        console.warn('⚠️ Invalid token:', err.message);
      }
    }
  }
  return { user: null };
};

module.exports = authenticate;
