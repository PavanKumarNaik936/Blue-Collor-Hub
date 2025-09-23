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

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return new Response(
        JSON.stringify({ success: false, message: "Post not found" }),
        { status: 404 }
      );
    }

    let message = "";

    if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId);
      message = "Post unliked";
    } else {
      // Like
      post.likes.push(userId);
      message = "Post liked";
    }

    await post.save();

    return new Response(
      JSON.stringify({ success: true, message, likesCount: post.likes.length }),
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
