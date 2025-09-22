import mongoose from "mongoose";

// Sub-schema for ratings
const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    value: {
      type: Number, // rating value (1 to 5)
      required: true,
      min: 1,
      max: 5
    },
    feedback: {
      type: String, // optional feedback
      default: ""
    }
  },
  { timestamps: true }
);

// Main Post schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    images: [
      {
        type: String // store image URLs or paths
      }
    ],
    video: {
      type: String // store video URL/path
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like"
      }
    ],
    comments: [
      {
        type: String // simple string comments
      }
    ],
    ratings: [ratingSchema], // embedded ratings
    averageRating: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
