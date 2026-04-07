import mongoose from "mongoose";
import slugify from "slugify";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  password: String,
  googleId: String,
  name: String,
  avatar: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  currentToken: { type: String, default: null },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  plan: { type: String, enum: ["Free", "Monthly Premium", "Annual Premium"], default: "Free" },
  status: { type: String, enum: ["Active", "Inactive", "Suspended", "Deleted"], default: "Active" },
  streams: { type: Number, default: 0 },
  phone: String,
  country: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre("save", function (next) {
  if (!this.slug && this.name)
    this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
