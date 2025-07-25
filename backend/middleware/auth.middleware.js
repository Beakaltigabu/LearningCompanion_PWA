import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('=== AUTH DEBUG ===');
  console.log('Auth header:', authHeader);
  console.log('Extracted token:', token);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT verification error:', err.name, err.message);
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    console.log('Authenticated user:', user);
    req.user = user;
    next();
  });
};

// Export as 'protect' as well for compatibility
export const protect = authenticateToken;
