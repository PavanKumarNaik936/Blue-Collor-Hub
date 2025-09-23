import connect from "../../../../../../lib/mongodb";
import Post from "../../../../../../models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(req, { params }) {
  await connect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { postId } = await params;
    let { value, feedback } = await req.json();

    if (typeof value !== "number" || value < 1 || value > 5) {
      return new Response(
        JSON.stringify({ success: false, message: "Rating must be a number between 1 and 5" }),
        { status: 400 }
      );
    }

    feedback = feedback || "";

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return new Response(
        JSON.stringify({ success: false, message: "Post not found" }),
        { status: 404 }
      );
    }

    // Check if user already rated
    const existingIndex = post.ratings.findIndex(r => r.userId.toString() === userId);

    if (existingIndex !== -1) {
      // Update existing rating
      post.ratings[existingIndex].value = value;
      post.ratings[existingIndex].feedback = feedback;
    } else {
      // Add new rating
      post.ratings.push({ userId, value, feedback });
    }

    // Recalculate average rating
    post.averageRating = parseFloat(
      (post.ratings.reduce((sum, r) => sum + r.value, 0) / post.ratings.length).toFixed(1)
    );

    await post.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Rating submitted successfully",
        averageRating: post.averageRating,
        ratings: post.ratings
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error rating post:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
