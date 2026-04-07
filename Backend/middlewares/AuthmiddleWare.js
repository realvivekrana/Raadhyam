import jwt from "jsonwebtoken";
import User from "../models/users.js";

const verifyToken = async (req, res, next) => {
  try {
    // ✅ SAFE token reading
    let token =
      req.headers.authorization ||
      (req.cookies && req.cookies.auth_token);

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }//...
//...


    // ✅ Remove Bearer
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Single-session security
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

export default verifyToken;
