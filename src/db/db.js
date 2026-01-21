import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const url = process.env.MONGO_URL


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url, {
      autoIndex: false,        // better for production
      maxPoolSize: 10,         // connection pooling
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // crash app if DB fails
  }
};

export default connectDB();

// connectDB