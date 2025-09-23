
import { authOptions } from "../../../auth/[...nextauth]/route";
import connect from "../../../../../../lib/mongodb"; // your MongoDB connection helper
import Wishlist from "../../../../../../models/Wishlist";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";


export async function POST(req, { params }) {
  try {
       const session = await getServerSession(authOptions);
       const {postId}=await params;
   
       if (!session || !session.user?.id) {
         return new Response(
           JSON.stringify({ success: false, message: "Unauthorized" }),
           { status: 401 }
         );
       }
   
       const userId = session.user.id;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
      return new Response(JSON.stringify({ message: "Invalid userId or postId" }), { status: 400 });
    }

    await connect();

    // Check if the post is already in the wishlist
    const existingWishlist = await Wishlist.findOne({ userId, "posts.postId": postId });

    let updatedWishlist;
    let action;

    if (existingWishlist) {
      // Post exists → remove it
      updatedWishlist = await Wishlist.findOneAndUpdate(
        { userId },
        { $pull: { posts: { postId } } },
        { new: true }
      ).populate("posts.postId");
      action = "removed";
    } else {
      // Post does not exist → add it
      updatedWishlist = await Wishlist.findOneAndUpdate(
        { userId },
        { $addToSet: { posts: { postId } } },
        { upsert: true, new: true }
      ).populate("posts.postId");
      action = "added";
    }

    return new Response(
      JSON.stringify({ message: `Post ${action} to wishlist`, wishlist: updatedWishlist }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

//check if a post is alredy present in wishlist
export async function GET(req, {params}) {
  try {
    

       const session = await getServerSession(authOptions);
       const {postId}=await params;
   
       if (!session || !session.user?.id) {
         return new Response(
           JSON.stringify({ success: false, message: "Unauthorized" }),
           { status: 401 }
         );
       }
   
       const userId = session.user.id;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
      return new Response(JSON.stringify({ message: "Invalid userId or postId" }), { status: 400 });
    }

    await connect();

    // Check if the post exists in the user's wishlist
    const wishlist = await Wishlist.findOne({ userId, "posts.postId": postId });

    return new Response(
      JSON.stringify({ inWishlist: !!wishlist }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}