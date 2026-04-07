import express from 'express';
import passport from '../config/passport.js';
import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, checkAuth } from '../controllers/AuthController.js';
import verifyToken from '../middlewares/AuthmiddleWare.js';

const router = express.Router();

router.post('/register/user', registerUser);
router.post('/login/user', loginUser);
//...


// Update the Google auth initiation route
router.get("/auth/google", (req, res, next) => {
    const redirectUrl = req.query.redirect || `${process.env.CLIENT_URL}/dashboard/home`;

    const authenticator = passport.authenticate("google", {
        scope: ["profile", "email"],
        state: redirectUrl // Store redirect URL in state
    });

    authenticator(req, res, next);
});

// Update the Google callback route
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    async (req, res) => {
        try {
            const token = jwt.sign(
                { userId: req.user._id, email: req.user.email, role: req.user.role },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            // Store latest token
            await User.findByIdAndUpdate(req.user._id, { currentToken: token });

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            // ✅ FIX: Use the redirect URL from state parameter or default
            const redirectUrl = req.query.state || `${process.env.CLIENT_URL}/dashboard/home`;

            // Pass token and user data via URL for frontend to handle
            const userData = encodeURIComponent(JSON.stringify({
                id: req.user._id,
                email: req.user.email,
                name: req.user.name,
                avatar: req.user.avatar,
                role: req.user.role,
            }));

            // ✅ FIX: Redirect back to the login page (from state) to store token
            res.redirect(`${redirectUrl}?token=${token}&user=${userData}`);

        } catch (error) {
            console.error("Google auth callback error:", error);
            res.redirect(`${process.env.CLIENT_URL}/login?error=Google authentication failed`);
        }
    }
);


router.get('/check-auth', verifyToken, checkAuth);




export default router;