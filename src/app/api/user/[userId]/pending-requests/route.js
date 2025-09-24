// src/app/api/user/[userId]/pending-requests/route.js
import connect from "../../../../../../lib/mongodb";
import User from "../../../../../../models/User";
export async function GET(req, { params }) {
  await connect();

  const { userId } = await params; // params from App Router dynamic route
  if (!userId) return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });

  try {
    const user = await User.findById(userId).select("pendingRequests");

    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    const pendingUsers = await User.find({ _id: { $in: user.pendingRequests } }).select("name email image");
    return new Response(JSON.stringify({ requests: pendingUsers }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch pending requests" }), { status: 500 });
  }
}
