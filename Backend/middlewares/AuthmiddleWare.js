import jwt from "jsonwebtoken";
import User from "../models/users.js";

// This middleware protects routes - requires valid authentication
const protect = async (req, res, next) => {
  try {
    // ✅ SAFE token reading
    let token =
      req.headers.authorization ||
      (req.cookies && req.cookies.auth_token);

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // ✅ Remove Bearer prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Single-session security check
    if (user.currentToken !== token) {
      return res.status(401).json({
        message: "Another device logged in, session expired",
      });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// This middleware restricts access to admin users only
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      message: "You are not authorized to perform this action" 
    });
  }
};

export { protect, authorizeAdmin };
export default protect;
