import connect from "../../../../../lib/mongodb"; // adjust path
import Wishlist from "../../../../../models/Wishlist";
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const userId = session.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response(JSON.stringify({ message: "Invalid userId" }), { status: 400 });
    }

    await connect();

    // Find wishlist for this user and populate the post + nested fields
    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: "posts.postId",
      populate: [
        { path: "userId", select: "name email profilePic title" },           // post creator
        { path: "likes", select: "name profilePic" },                         // users who liked
        { path: "comments.userId", select: "name profilePic" },               // users who commented
        { path: "ratings.userId", select: "name profilePic" },                // users who rated
      ],
    });

    // Map to post objects
    const posts = wishlist?.posts?.map((p) => {
      const post = p.postId;
      if (!post) return null;

      // Calculate likes count & average rating
      const likesCount = post.likes?.length || 0;
      const averageRating =
        post.ratings?.length > 0
          ? post.ratings.reduce((sum, r) => sum + r.value, 0) / post.ratings.length
          : 0;

      return {
        ...post.toObject(),
        likesCount,
        averageRating: parseFloat(averageRating.toFixed(1)),
      };
    }).filter(Boolean); // remove nulls if any

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}