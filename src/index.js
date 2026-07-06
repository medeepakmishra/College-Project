



import dotenv from "dotenv";
import connectDB from "./db/db.js";
import app from "./app.js";
import "dotenv/config";

console.log("INDEX EMAIL USER:", !!process.env.EMAIL_USER);
console.log("INDEX EMAIL PASS:", !!process.env.EMAIL_PASS);

dotenv.config();

const PORT = process.env.PORT || 3000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

