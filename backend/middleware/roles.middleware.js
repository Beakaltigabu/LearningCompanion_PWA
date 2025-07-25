// Role-based access control middleware
export const requireParent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'parent') {
    return res.status(403).json({
      success: false,
      message: 'Parent access required'
    });
  }

  next();
};

export const requireChild = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'child') {
    return res.status(403).json({
      success: false,
      message: 'Child access required'
    });
  }

  next();
};

export const requireParentOrChild = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!['parent', 'child'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Invalid user role'
    });
  }

  next();
};

// Generic role restriction middleware
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};
