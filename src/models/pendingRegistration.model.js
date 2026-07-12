import mongoose from "mongoose";
import bcrypt from "bcrypt";

const pendingRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    number: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    otpExpiry: {
      type: Date,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,

      // Automatically delete after 15 minutes
      expires: 900,
    },
  }
);


// Hash password before temporary storage
pendingRegistrationSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});


const PendingRegistration = mongoose.model(
  "PendingRegistration",
  pendingRegistrationSchema
);

export default PendingRegistration;








