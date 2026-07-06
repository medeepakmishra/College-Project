import "dotenv/config";
import bcrypt from "bcrypt";


import connectDB from "../db/db.js";
import User from "../models/user.model.js";

const createAdmin = async () => {
  try {
    // Uses your existing DB connection logic,
    // including the DNS fix
    await connectDB();

    const email = "admin@placement.com";

    const existingAdmin = await User.findOne({
      email,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@123",
      10
    );

    await User.collection.insertOne({
      name: "Placement Admin",
      number: "9999999999",
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Admin created successfully");

    process.exit(0);

  } catch (error) {
    console.error(
      "❌ Admin creation error:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();