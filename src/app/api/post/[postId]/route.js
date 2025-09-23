import connect from "../../../../../lib/mongodb";
import Post from "../../../../../models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; // adjust path if needed

//delete your own post
export async function DELETE(req, { params }) {
  await connect();

  try {
    // Get session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const userId = session.user.id; // logged-in user ID
    const { postId } = params;      // post ID from URL

    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return new Response(
        JSON.stringify({ success: false, message: "Post not found" }),
        { status: 404 }
      );
    }

    // Check if the logged-in user is the owner
    if (post.userId.toString() !== userId) {
      return new Response(
        JSON.stringify({ success: false, message: "You can only delete your own posts" }),
        { status: 403 }
      );
    }

    // Delete the post
    await post.deleteOne();

    return new Response(
      JSON.stringify({ success: true, message: "Post deleted successfully" }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}

//delete from wishlist

export async function DELETE(req, context) {
  try {
     const postId =await context.params.postId;
     const { userId } = await req.URL();

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
      return new Response(JSON.stringify({ message: "Invalid userId or postId" }), { status: 400 });
    }

    await connect();

    // Remove the post from the user's wishlist
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { posts: { postId } } },
      { new: true }
    ).populate("posts.postId");

    if (!wishlist) {
      return new Response(JSON.stringify({ message: "Wishlist not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ message: "Post removed from wishlist", wishlist }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

