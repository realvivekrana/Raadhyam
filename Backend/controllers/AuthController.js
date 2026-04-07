
import bcrypt from "bcryptjs";
import User from "../models/users.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ success: false, message: "User already exist" });

    const hash = await bcrypt.hash(password, 12);

    await User.create({ email, password: hash, name });

    res.json({ success: true, message: "You has registered successfully" });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid login" });

    if (!user.password)
      return res.status(400).json({
        success: false,
        message: "Use Google Sign-In for this account",
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ success: false, message: "Wrong password" });
//...

    //  INCLUDE ROLE INSIDE TOKEN
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,   // IMPORTANT
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,  // ⭐ SEND ROLE IN RESPONSE
      },
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};




export const checkAuth = (req, res) => {
  return res.status(200).json({
    authenticated: true,
    user: req.user
  });
};

