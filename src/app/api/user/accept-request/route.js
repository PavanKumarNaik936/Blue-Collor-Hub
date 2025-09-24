import connect from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export async function POST(req) {
  try {
    await connect();
    const { receiverId, senderId } = await req.json();

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Remove from pending and sent requests
    receiver.pendingRequests = receiver.pendingRequests.filter(id => !id.equals(sender._id));
    sender.sentRequests = sender.sentRequests.filter(id => !id.equals(receiver._id));

    // Add to connections
    if (!receiver.connections.includes(sender._id)) receiver.connections.push(sender._id);
    if (!sender.connections.includes(receiver._id)) sender.connections.push(receiver._id);

    await receiver.save();
    await sender.save();

    return new Response(JSON.stringify({ message: "Connection accepted" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}