import connect from "../../../../../../lib/mongodb";
import User from "../../../../../../models/User";

export async function GET(req, { params }) {
    try {
      await connect();
      const { userId } = await params;
      const user = await User.findById(userId)
        .populate("connections", "name profilePic email")
        .populate("pendingRequests", "name profilePic email");
  
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
      }
  
      return new Response(
        JSON.stringify({
          connections: user.connections,
          requestsReceived: user.pendingRequests,
        }),
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  }
  