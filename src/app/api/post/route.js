import dbConnect from "../../../../lib/mongodb";
import Post from "../../../../models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// Our GET method
export async function GET(req) {
  await dbConnect();

  try {
    const posts = await Post.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ["$likes", []] } }, // count likes
        },
      },
      {
        $sort: {
          createdAt: -1,   // latest first
          likesCount: -1,  // then most liked
        },
      },
    ]);

    return new Response(
      JSON.stringify({ success: true, posts }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}

//create post route
export async function POST(req) {
  await connect();

  try {
    // Get the logged-in session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const userId = session.user.id; // get user ID from session
    const body = await req.json();
    const { title, description, images, video } = body;

    if (!title || !description) {
      return new Response(
        JSON.stringify({ success: false, message: "Title and description are required" }),
        { status: 400 }
      );
    }

    const newPost = await Post.create({
      title,
      description,
      images: images || [],
      video: video || null,
      userId,
      likes: [],
      comments: [],
    });

    return new Response(
      JSON.stringify({ success: true, post: newPost }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}


