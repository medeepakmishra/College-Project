import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    // Reference to User Collection
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Academic Information
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      enum: ["CSE", "IT", "ECE", "EE", "ME", "CE", "BCA", "MCA", "BBA", "MBA"],
    },

    course: {
      type: String,
      required: true,
    },

    batch: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    backlogs: {
      type: Number,
      default: 0,
    },

    // Professional Details
    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    projects: [
      {
        title: {
          type: String,
          required: true,
        },

        description: {
          type: String,
          required: true,
        },

        technologies: [
          {
            type: String,
          },
        ],

        githubLink: {
          type: String,
          default: "",
        },

        liveLink: {
          type: String,
          default: "",
        },
      },
    ],

   internships: [
  {
    company: String,
    role: String,
    startDate: Date,
    endDate: Date,
    description: String,
  },
],

   certifications: [
  {
    title: String,
    issuer: String,
    issueDate: Date,
    certificateLink: String,
  },
],

    // Social Links
    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },

    // Resume
    resume: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    // Placement Status
    isPlaced: {
      type: Boolean,
      default: false,
    },

    placedCompany: {
      type: String,
      default: "",
    },

    placedPackage: {
      type: Number,
      default: 0,
    },

    // Profile Completion
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

export default StudentProfile;
