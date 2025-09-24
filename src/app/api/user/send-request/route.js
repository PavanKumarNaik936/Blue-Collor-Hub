// src/app/api/user/send-request/route.js
import connect from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export async function POST(req) {
  try {
    await connect();
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return new Response(JSON.stringify({ error: "Missing IDs" }), { status: 400 });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Check if already connected
    if (receiver.connections.includes(sender._id)) {
      return new Response(JSON.stringify({ error: "Already connected" }), { status: 400 });
    }

    // Check if request already sent
    if (receiver.pendingRequests.includes(sender._id)) {
      return new Response(JSON.stringify({ error: "Request already sent" }), { status: 400 });
    }

    // Add to pending and sent arrays
    receiver.pendingRequests.push(sender._id);
    sender.sentRequests.push(receiver._id);

    await receiver.save();
    await sender.save();

    return new Response(JSON.stringify({ message: "Request sent successfully" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}