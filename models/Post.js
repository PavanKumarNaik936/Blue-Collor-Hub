import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, // store image URLs or paths
      },
    ],
    video: {
      type: String, // store video URL/path
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User schema
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like", // reference Like schema
      },
    ],
    comments: [
      {
        type: String, // simple string comments
      },
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
