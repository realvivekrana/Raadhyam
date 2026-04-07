/**
 * Admin Role Middleware
 * 
 * Purpose: Verify that the authenticated user has admin privileges
 * 
 * Usage: Add after verifyToken middleware on admin routes
 * 
 * Example:
 * router.get('/admin-only', verifyToken, isAdmin, handler)
 */

const isAdmin = (req, res, next) => {
  // Check if user exists (should be set by verifyToken middleware)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  // User is admin, proceed to next middleware
  next();
};

export default isAdmin;