import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Date },
    image: { type: String }, // NextAuth field for Google profile
    profilePic: { type: String, default: null }, // your legacy field
    password: { type: String }, // for credentials login
    title: { type: String, default: null },
    skills: { type: [String], default: [] },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
      state: { type: String, default: null },
      district: { type: String, default: null },
      town: { type: String, default: null },
    },
  },
  { timestamps: true }
);

// Geospatial index for location
userSchema.index({ location: "2dsphere" });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
