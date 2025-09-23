import connect from "../../../../../../lib/mongodb";
import Post from "../../../../../../models/Post";
import Like from "../../../../../../models/Like";
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
    const { postId } = params;

    // Check if the post exists
    const post = await Post.findById(postId).populate("likes");
    if (!post) {
      return new Response(
        JSON.stringify({ success: false, message: "Post not found" }),
        { status: 404 }
      );
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({ postId, userId });

    let message = "";

    if (existingLike) {
      // Unlike: remove Like document
      await existingLike.deleteOne();
      // Remove from post.likes array
      post.likes = post.likes.filter(like => like._id.toString() !== existingLike._id.toString());
      message = "Post unliked";
    } else {
      // Like: create new Like document
      const newLike = await Like.create({ postId, userId });
      post.likes.push(newLike._id);
      message = "Post liked";
    }

    await post.save();

    return new Response(
      JSON.stringify({ success: true, message, likes: post.likes }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error toggling like:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
