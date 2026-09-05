const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/admin");

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      username: "admin",
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    // Create admin
    const admin = new Admin({
      username: "admin",
      password: "admin123",
    });

    await admin.save();

    console.log("Admin created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");

  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();

