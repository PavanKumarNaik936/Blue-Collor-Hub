import connect from "../../../../../../lib/mongodb";
import Post from "../../../../../../models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(req, { params }) {
  await connect();

  try {
    // Get logged-in user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const { postId } = params;
    const { comment } = await req.json();

    if (!comment || comment.trim() === "") {
      return new Response(
        JSON.stringify({ success: false, message: "Comment cannot be empty" }),
        { status: 400 }
      );
    }

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return new Response(
        JSON.stringify({ success: false, message: "Post not found" }),
        { status: 404 }
      );
    }

    // Add comment (string only)
    post.comments.push(comment);
    await post.save();

    return new Response(
      JSON.stringify({ success: true, message: "Comment added", comments: post.comments }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Error adding comment:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
