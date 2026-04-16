import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  checkAuth,
  sendOtp,
  verifyOtp,
  resetPasswordWithToken
} from "../controllers/AuthController.js";
import verifyToken from "../middlewares/AuthmiddleWare.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/check-auth", verifyToken, checkAuth);

// OTP-based password reset
router.post("/send-otp",           sendOtp);
router.post("/verify-otp",         verifyOtp);
router.post("/reset-password-otp", resetPasswordWithToken);

export default router;
