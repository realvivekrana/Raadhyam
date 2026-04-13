import User from "./models/users.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@raadhyam.com" });
    
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }
    
    const hashedPassword = await bcrypt.hash("Admin@1234", 12);
    
    await User.create({
      email: "admin@raadhyam.com",
      username: "raadhyam_admin",
      password: hashedPassword,
      role: "admin",
      name: "Admin",
      status: "Active"
    });
    
    console.log("Admin user created successfully:", admin.email);
  } catch (error) {
    console.error("Error seeding admin:", error);
    throw error;
  }
};

export default seedAdmin;
