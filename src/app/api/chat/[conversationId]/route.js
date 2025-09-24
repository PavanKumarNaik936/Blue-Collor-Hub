// File: src/app/api/chat/[conversationId]/route.js
import connect from "../../../../../lib/mongodb";
import Message from "../../../../../models/Message";
export async function GET(req, { params }) {
  await connect();
  const { conversationId } =await params;

  if (!conversationId) {
    return new Response(JSON.stringify({ error: "conversationId required" }), {
      status: 400,
    });
  }

  try {
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
