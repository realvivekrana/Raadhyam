import jwt from "jsonwebtoken";
import User from "../models/users.js";

const protect = async (req, res, next) => {
  try {
    let token =
      req.headers.authorization ||
      (req.cookies && req.cookies.auth_token);

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authenticated", 
        code: "AUTH_REQUIRED" 
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found", 
        code: "AUTH_REQUIRED" 
      });
    }

    if (user.currentToken && user.currentToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Another device logged in, session expired",
        code: "SESSION_EXPIRED"
      });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      code: err.name === 'TokenExpiredError' ? "TOKEN_EXPIRED" : "INVALID_TOKEN"
    });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      message: "You are not authorized to perform this action",
      code: "FORBIDDEN"
    });
  }
};

export { protect, authorizeAdmin };
export default protect;
