import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    website: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    hrName: {
      type: String,
      default: "",
    },

    hrEmail: {
      type: String,
      default: "",
    },

    hrContact: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Company = mongoose.model("Company", companySchema);

export default Company;
