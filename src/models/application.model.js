import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },

    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementDrive",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
      ],
      default: "applied",
    },

    interviewDate: {
      type: Date,
      default: null,
    },

    interviewVenue: {
      type: String,
      default: "",
    },

    adminRemark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same student from applying twice to the same drive
applicationSchema.index(
  {
    student: 1,
    drive: 1,
  },
  {
    unique: true,
  }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;