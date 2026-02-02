import mongoose from "mongoose";
import bcrypt from "bcrypt";
console.log("user model is imported sucessfully");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
      match: [/^\+?\d{10,15}$/, "Please enter a valid mobile number"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "admin"], // allowed roles
      default: "user",
    },
    

  isVerified: {
    type: Boolean,
    default: false
  },

  emailOTP: String,
  emailOTPExpiry: Date
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  // If password wasn't modified, nothing to do
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
export default User;

console.log(" user model is working");
