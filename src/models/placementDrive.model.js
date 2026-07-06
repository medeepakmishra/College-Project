import mongoose from "mongoose";

const placementDriveSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    jobRole: {
      type: String,
      required: true,
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["full-time", "internship", "internship-with-ppo"],
      required: true,
    },

    ctc: {
      type: Number,
      required: true,
      min: 0,
    },

    internshipStipend: {
      type: Number,
      default: 0,
      min: 0,
    },

    jobLocation: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    minCGPA: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    maxBacklogs: {
      type: Number,
      default: 0,
      min: 0,
    },

    eligibleDepartments: [
      {
        type: String,
        required: true,
      },
    ],

    eligibleBatches: [
      {
        type: String,
        required: true,
      },
    ],

    applicationDeadline: {
      type: Date,
      required: true,
    },

    driveDate: {
      type: Date,
      required: true,
    },

    venue: {
      type: String,
      default: "",
    },

    driveMode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      default: "offline",
    },

    status: {
      type: String,
      enum: ["draft", "open", "closed", "completed", "cancelled"],
      default: "draft",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PlacementDrive = mongoose.model(
  "PlacementDrive",
  placementDriveSchema
);

export default PlacementDrive;
