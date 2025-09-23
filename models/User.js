import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true, // optional, not unique
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // fixed typo from lowerCase
      trim: true,
    },
    password: {
      type: String,
      required: false, // optional for OAuth users
    },
    phone: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    profilePic: {
      type: String, // store image URL
      default: null,
    },
    coverImage: {
      type: String, // store image URL
      default: null,
    },
  
    skillCategories: {
      type: [String], // e.g., ["Web Development", "AI"]
      default: [],
    },
    skills: {
      type: [String], // e.g., ["React", "Node.js"]
      default: [],
    },
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
      state: { type: String, default: null },
      district: { type: String, default: null },
      town: { type: String, default: null },
    },
  },
  { timestamps: true }
);

// Create a geospatial index for location
userSchema.index({ location: "2dsphere" });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
