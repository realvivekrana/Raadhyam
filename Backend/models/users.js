import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: String,
    googleId: String,
    name: String,
    avatar: String,
    role:{ type:String, default: "user" },
    currentToken: { type: String, default: null }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User
//...
